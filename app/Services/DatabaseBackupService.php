<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use RuntimeException;

class DatabaseBackupService
{
    private string $backupDirectory;

    public function __construct()
    {
        $this->backupDirectory = storage_path('app/' . config('database_backup.directory', 'database-backups'));

        if (! File::isDirectory($this->backupDirectory)) {
            File::makeDirectory($this->backupDirectory, 0755, true);
        }
    }

    /** @return array{driver: string, database: string, host: string|null, port: int|string|null} */
    public function connectionInfo(): array
    {
        $connection = (string) config('database.default');
        $config = config("database.connections.{$connection}", []);

        return [
            'driver' => (string) ($config['driver'] ?? $connection),
            'database' => (string) ($config['database'] ?? '-'),
            'host' => $config['host'] ?? null,
            'port' => $config['port'] ?? null,
        ];
    }

    /** @return list<array{filename: string, size: int, size_human: string, created_at: string}> */
    public function listBackups(): array
    {
        $files = collect(File::files($this->backupDirectory))
            ->sortByDesc(fn ($file) => $file->getMTime())
            ->values();

        return $files->map(function ($file) {
            $size = $file->getSize();

            return [
                'filename' => $file->getFilename(),
                'size' => $size,
                'size_human' => $this->formatBytes($size),
                'created_at' => date('c', $file->getMTime()),
            ];
        })->all();
    }

    /** @return array{filename: string, path: string, size: int, size_human: string} */
    public function createBackup(): array
    {
        $info = $this->connectionInfo();
        $timestamp = now()->format('Y-m-d_His');
        $database = preg_replace('/[^A-Za-z0-9_\-]/', '_', $info['database']) ?: 'database';

        $extension = match ($info['driver']) {
            'sqlite' => 'sqlite',
            default => 'sql',
        };

        $filename = "{$database}_{$timestamp}.{$extension}";
        $path = $this->backupDirectory . DIRECTORY_SEPARATOR . $filename;

        if (! is_writable($this->backupDirectory)) {
            throw new RuntimeException('Folder backup tidak dapat ditulis: ' . $this->backupDirectory);
        }

        try {
            match ($info['driver']) {
                'pgsql' => $this->backupPostgres($path),
                'mysql', 'mariadb' => $this->backupMysql($path),
                'sqlite' => $this->backupSqlite($path),
                default => throw new RuntimeException("Driver database '{$info['driver']}' belum didukung untuk backup."),
            };
        } catch (\Throwable $exception) {
            if (File::exists($path)) {
                File::delete($path);
            }

            throw $exception;
        }

        if (! File::exists($path)) {
            throw new RuntimeException('File backup gagal dibuat.');
        }

        $size = File::size($path);

        return [
            'filename' => $filename,
            'path' => $path,
            'size' => $size,
            'size_human' => $this->formatBytes($size),
        ];
    }

    public function restoreBackup(string $filename): void
    {
        $path = $this->resolveBackupPath($filename);
        $this->restoreFromPath($path);
    }

    public function restoreUploadedFile(string $absolutePath, string $originalExtension): void
    {
        $extension = strtolower(ltrim($originalExtension, '.'));
        $allowed = config('database_backup.allowed_extensions', ['sql', 'txt', 'sqlite', 'dump']);

        if (! in_array($extension, $allowed, true)) {
            throw new RuntimeException('Format file backup tidak didukung.');
        }

        $this->restoreFromPath($absolutePath);
    }

    public function deleteBackup(string $filename): void
    {
        $path = $this->resolveBackupPath($filename);
        File::delete($path);
    }

    public function resolveBackupPath(string $filename): string
    {
        $safeName = basename($filename);
        $path = $this->backupDirectory . DIRECTORY_SEPARATOR . $safeName;

        if (! File::exists($path)) {
            throw new RuntimeException('File backup tidak ditemukan.');
        }

        return $path;
    }

    private function restoreFromPath(string $path): void
    {
        $info = $this->connectionInfo();

        match ($info['driver']) {
            'pgsql' => $this->restorePostgres($path),
            'mysql', 'mariadb' => $this->restoreMysql($path),
            'sqlite' => $this->restoreSqlite($path),
            default => throw new RuntimeException("Driver database '{$info['driver']}' belum didukung untuk restore."),
        };
    }

    private function backupPostgres(string $outputPath): void
    {
        $config = $this->currentConfig();
        $binary = $this->resolveBinary('pg_dump');
        $outputFilename = basename($outputPath);

        $result = $this->runBinaryProcess($binary, [
            $binary,
            '--dbname=' . $this->postgresConnectionUri($config),
            '-f', $outputFilename,
            '--no-owner',
            '--no-acl',
        ], [], $this->backupDirectory);

        $this->ensureSuccessful($result, 'pg_dump');
    }

    private function restorePostgres(string $inputPath): void
    {
        $config = $this->currentConfig();
        $binary = $this->resolveBinary('psql');

        $result = $this->runBinaryProcess($binary, [
            $binary,
            '--dbname=' . $this->postgresConnectionUri($config),
            '-f', $inputPath,
            '-v', 'ON_ERROR_STOP=1',
        ]);

        $this->ensureSuccessful($result, 'psql');
    }

    private function backupMysql(string $outputPath): void
    {
        $config = $this->currentConfig();
        $binary = $this->resolveBinary('mysqldump');
        $password = (string) ($config['password'] ?? '');

        $result = $this->runBinaryProcess($binary, [
            $binary,
            '-h', (string) ($config['host'] ?? '127.0.0.1'),
            '-P', (string) ($config['port'] ?? '3306'),
            '-u', (string) ($config['username'] ?? 'root'),
            (string) $config['database'],
            '--result-file=' . $outputPath,
            '--single-transaction',
            '--routines',
            '--triggers',
        ], $password !== '' ? ['MYSQL_PWD' => $password] : []);

        $this->ensureSuccessful($result, 'mysqldump');
    }

    private function restoreMysql(string $inputPath): void
    {
        $config = $this->currentConfig();
        $binary = $this->resolveBinary('mysql');
        $password = (string) ($config['password'] ?? '');

        $result = Process::timeout(600)
            ->env($this->buildProcessEnv($binary, $password !== '' ? ['MYSQL_PWD' => $password] : []))
            ->path(dirname($binary))
            ->input(File::get($inputPath))
            ->run([
                $binary,
                '-h', (string) ($config['host'] ?? '127.0.0.1'),
                '-P', (string) ($config['port'] ?? '3306'),
                '-u', (string) ($config['username'] ?? 'root'),
                (string) $config['database'],
            ]);

        $this->ensureSuccessful($result, 'mysql');
    }

    private function backupSqlite(string $outputPath): void
    {
        $source = (string) $this->currentConfig()['database'];

        if (! File::exists($source)) {
            throw new RuntimeException('File database SQLite tidak ditemukan.');
        }

        if (! File::copy($source, $outputPath)) {
            throw new RuntimeException('Gagal menyalin file database SQLite.');
        }
    }

    private function restoreSqlite(string $inputPath): void
    {
        $target = (string) $this->currentConfig()['database'];

        DB::disconnect();
        usleep(200000);

        if (! File::copy($inputPath, $target)) {
            throw new RuntimeException('Gagal mengganti file database SQLite.');
        }
    }

    /** @return array<string, mixed> */
    private function currentConfig(): array
    {
        $connection = (string) config('database.default');

        return config("database.connections.{$connection}", []);
    }

    /** @param  array<int, string>  $command */
    private function runBinaryProcess(string $binary, array $command, array $extraEnv = [], ?string $workingDirectory = null)
    {
        return Process::timeout(600)
            ->env($this->buildProcessEnv($binary, $extraEnv))
            ->path($workingDirectory ?? dirname($binary))
            ->run($command);
    }

    /** @param  array<string, mixed>  $config */
    private function postgresConnectionUri(array $config): string
    {
        $user = rawurlencode((string) ($config['username'] ?? 'postgres'));
        $password = rawurlencode((string) ($config['password'] ?? ''));
        $host = (string) ($config['host'] ?? '127.0.0.1');
        $port = (string) ($config['port'] ?? '5432');
        $database = rawurlencode((string) $config['database']);

        return "postgresql://{$user}:{$password}@{$host}:{$port}/{$database}";
    }

    /** @return array<string, string> */
    private function buildProcessEnv(string $binary, array $extra = []): array
    {
        $env = [];

        foreach (array_merge($_ENV, $_SERVER) as $key => $value) {
            if (! is_string($key) || $key === '') {
                continue;
            }

            if (is_string($value) || is_numeric($value)) {
                $env[$key] = (string) $value;
            }
        }

        $systemEnv = getenv();

        if (is_array($systemEnv)) {
            foreach ($systemEnv as $key => $value) {
                if (is_string($key) && is_string($value)) {
                    $env[$key] = $value;
                }
            }
        }

        $binaryDir = dirname($binary);
        $path = $env['Path'] ?? $env['PATH'] ?? '';

        if (! str_contains($path, $binaryDir)) {
            $mergedPath = $binaryDir . PATH_SEPARATOR . $path;
            $env['Path'] = $mergedPath;
            $env['PATH'] = $mergedPath;
        }

        return array_merge($env, $extra);
    }

    private function resolveBinary(string $name): string
    {
        $envKey = 'DB_BACKUP_' . strtoupper(str_replace('-', '_', $name)) . '_PATH';
        $envPath = env($envKey);

        if ($envPath && File::exists($envPath)) {
            return $envPath;
        }

        $candidates = [];

        if (PHP_OS_FAMILY === 'Windows') {
            $patterns = [
                'C:\\laragon\\bin\\postgresql\\*\\bin\\' . $name . '.exe',
                'C:\\laragon\\bin\\mysql\\*\\bin\\' . $name . '.exe',
                'C:\\Program Files\\PostgreSQL\\*\\bin\\' . $name . '.exe',
                'C:\\Program Files (x86)\\PostgreSQL\\*\\bin\\' . $name . '.exe',
            ];

            foreach ($patterns as $pattern) {
                $matches = glob($pattern) ?: [];

                foreach ($matches as $match) {
                    if (File::exists($match)) {
                        $candidates[] = $match;
                    }
                }
            }

            $whereResult = Process::run(['where.exe', $name]);

            if ($whereResult->successful()) {
                foreach (preg_split('/\R/', trim($whereResult->output())) as $line) {
                    $line = trim($line);

                    if ($line !== '' && File::exists($line)) {
                        $candidates[] = $line;
                    }
                }
            }
        } else {
            foreach (['/usr/bin', '/usr/local/bin', '/opt/homebrew/bin'] as $directory) {
                $path = $directory . '/' . $name;

                if (File::exists($path)) {
                    $candidates[] = $path;
                }
            }
        }

        $candidates = array_values(array_unique($candidates));

        if ($candidates !== []) {
            $preferredMajor = $this->preferredPostgresMajorVersion($name);

            usort($candidates, function (string $a, string $b) use ($preferredMajor) {
                if ($preferredMajor !== null) {
                    $majorA = $this->binaryMajorVersion($a);
                    $majorB = $this->binaryMajorVersion($b);

                    if ($majorA === $preferredMajor && $majorB !== $preferredMajor) {
                        return -1;
                    }

                    if ($majorB === $preferredMajor && $majorA !== $preferredMajor) {
                        return 1;
                    }
                }

                return version_compare($this->binaryVersionKey($b), $this->binaryVersionKey($a));
            });

            return $candidates[0];
        }

        throw new RuntimeException(
            "Binary '{$name}' tidak ditemukan. Install PostgreSQL/MySQL client tools atau set {$envKey} di file .env."
        );
    }

    private function binaryMajorVersion(string $path): ?int
    {
        if (preg_match('/PostgreSQL[\\\\\/](\d+)/i', $path, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    private function preferredPostgresMajorVersion(string $binaryName): ?int
    {
        if (! in_array($binaryName, ['pg_dump', 'psql'], true)) {
            return null;
        }

        if (($this->connectionInfo()['driver'] ?? '') !== 'pgsql') {
            return null;
        }

        try {
            $version = DB::selectOne('select split_part(version(), \' \', 2) as version');

            if (! $version || empty($version->version)) {
                return null;
            }

            return (int) explode('.', (string) $version->version)[0];
        } catch (\Throwable) {
            return null;
        }
    }

    private function binaryVersionKey(string $path): string
    {
        if (preg_match('/PostgreSQL[\\\\\/](\d+)/i', $path, $matches)) {
            return $matches[1] . '.0.0';
        }

        if (preg_match('/mysql[\\\\\/-](\d+(?:\.\d+)?)/i', $path, $matches)) {
            return $matches[1] . '.0';
        }

        return '0.0.0';
    }

    private function ensureSuccessful($result, string $tool): void
    {
        if ($result->successful()) {
            return;
        }

        $error = trim($result->errorOutput() . ' ' . $result->output());
        $error = preg_replace('/\s+/', ' ', $error) ?? $error;

        throw new RuntimeException("Perintah {$tool} gagal: " . ($error !== '' ? mb_substr($error, 0, 500) : 'unknown error'));
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        }

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }

        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' B';
    }
}
