<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;

class PoktanIndexRequest extends AbstractPaginatedIndexRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function extraRules(): array
    {
        return [
            'kode_kota'     => ['nullable', 'integer'],
            'kode_cluster'  => ['nullable', 'integer'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function extraValidated(array $validated): array
    {
        return [
            'kode_kota'    => isset($validated['kode_kota']) ? (int) $validated['kode_kota'] : null,
            'kode_cluster' => isset($validated['kode_cluster']) ? (int) $validated['kode_cluster'] : null,
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return [
            'id',
            'nama_poktan',
            'ketua',
            'telp',
            'kode_kota',
            'kode_cluster',
            'gender_lp',
        ];
    }
}
