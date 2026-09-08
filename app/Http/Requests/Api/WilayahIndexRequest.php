<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class WilayahIndexRequest extends AbstractPaginatedIndexRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function extraRules(): array
    {
        return [
            'format'          => ['nullable', 'string', Rule::in(['nested', 'flat'])],
            'level'           => ['nullable', 'string', Rule::in(['provinsi', 'kab_kota', 'kecamatan', 'kel_des'])],
            'provinsi_code'   => ['nullable', 'string', 'max:10'],
            'kab_kota_code'   => ['nullable', 'string', 'max:10'],
            'kecamatan_code'  => ['nullable', 'string', 'max:15'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function extraValidated(array $validated): array
    {
        return [
            'format'         => $validated['format'] ?? 'nested',
            'level'          => $validated['level'] ?? null,
            'provinsi_code'  => $validated['provinsi_code'] ?? null,
            'kab_kota_code'  => $validated['kab_kota_code'] ?? null,
            'kecamatan_code' => $validated['kecamatan_code'] ?? null,
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return ['code', 'name'];
    }
}
