<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;

class ClusterIndexRequest extends AbstractPaginatedIndexRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function extraRules(): array
    {
        return [
            'kode_kota'      => ['nullable', 'integer'],
            'kode_kumoditas' => ['nullable', 'integer'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function extraValidated(array $validated): array
    {
        return [
            'kode_kota'      => isset($validated['kode_kota']) ? (int) $validated['kode_kota'] : null,
            'kode_kumoditas' => isset($validated['kode_kumoditas']) ? (int) $validated['kode_kumoditas'] : null,
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return [
            'id',
            'nama_cluster',
            'nama_kota',
            'kode_kota',
            'kode_kumoditas',
        ];
    }
}
