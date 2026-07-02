<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LogframeIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search'          => ['nullable', 'string', 'max:255'],
            'limit'           => ['nullable', 'integer', 'min:1', 'max:100'],
            'offset'          => ['nullable', 'integer', 'min:0'],
            'order_by'        => ['nullable', 'string', Rule::in(LogframeIndexRequest::sortableColumns())],
            'order_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        return [
            'search'          => $validated['search'] ?? null,
            'limit'           => $validated['limit'] ?? 10,
            'offset'          => $validated['offset'] ?? 0,
            'order_by'        => $validated['order_by'] ?? 'id',
            'order_direction' => $validated['order_direction'] ?? 'asc',
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return [
            'id',
            'tingkat',
            'nama_indikator',
            'definisi_indikator',
            'nilai_dasar',
            'target_pertengahan_proyek',
            'target_akhir_proyek',
            'realisasi',
            'component',
            'sumber_data',
            'data_yg_dikumpulkan',
            'created_at',
            'updated_at',
        ];
    }
}
