<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PetaniIndexRequest extends FormRequest
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
            'order_by'        => ['nullable', 'string', Rule::in(self::sortableColumns())],
            'order_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'gender_petani'   => ['nullable', 'string', Rule::in(['L', 'P'])],
            'kode_kota'       => ['nullable', 'integer'],
            'kode_poktan'     => ['nullable', 'integer'],
            'tahap'           => ['nullable', 'string', 'max:50'],
            'difabel'         => ['nullable', 'boolean'],
            'dukungan_proyek' => ['nullable', 'boolean'],
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
            'gender_petani'   => $validated['gender_petani'] ?? null,
            'kode_kota'       => isset($validated['kode_kota']) ? (int) $validated['kode_kota'] : null,
            'kode_poktan'     => isset($validated['kode_poktan']) ? (int) $validated['kode_poktan'] : null,
            'tahap'           => $validated['tahap'] ?? null,
            'difabel'         => array_key_exists('difabel', $validated) ? (bool) $validated['difabel'] : null,
            'dukungan_proyek' => array_key_exists('dukungan_proyek', $validated) ? (bool) $validated['dukungan_proyek'] : null,
        ];
    }

    /**
     * @return list<string>
     */
    public static function sortableColumns(): array
    {
        return [
            'id',
            'nama_petani',
            'nik_petani',
            'no_hp_petani',
            'gender_petani',
            'usia_petani',
            'difabel',
            'kode_kota',
            'kode_poktan',
            'jmlah_petani',
            'luas_lahan_ha',
            'latitude',
            'longitude',
            'kelas_lereng',
            'kemiringan',
            'fungsi_kws_hutan',
            'tahap',
            'created_at',
            'updated_at',
        ];
    }
}
