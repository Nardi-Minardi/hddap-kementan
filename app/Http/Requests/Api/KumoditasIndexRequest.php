<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;

class KumoditasIndexRequest extends AbstractPaginatedIndexRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function extraRules(): array
    {
        return [
            'kodejns' => ['nullable', 'integer'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function extraValidated(array $validated): array
    {
        return [
            'kodejns' => isset($validated['kodejns']) ? (int) $validated['kodejns'] : null,
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return [
            'id',
            'kumoditas',
            'kodejns',
            'keterangan',
        ];
    }
}
