<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AbstractPaginatedIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return list<string>
     */
    abstract public static function sortableColumns(): array;

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function extraRules(): array
    {
        return [];
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge([
            'search'          => ['nullable', 'string', 'max:255'],
            'limit'           => ['nullable', 'integer', 'min:1', 'max:100'],
            'offset'          => ['nullable', 'integer', 'min:0'],
            'order_by'        => ['nullable', 'string', Rule::in(static::sortableColumns())],
            'order_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
        ], $this->extraRules());
    }

    /**
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        return array_merge([
            'search'          => $validated['search'] ?? null,
            'limit'           => (int) ($validated['limit'] ?? 10),
            'offset'          => (int) ($validated['offset'] ?? 0),
            'order_by'        => $validated['order_by'] ?? static::defaultOrderBy(),
            'order_direction' => $validated['order_direction'] ?? 'asc',
        ], $this->extraValidated($validated));
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function extraValidated(array $validated): array
    {
        return [];
    }

    protected static function defaultOrderBy(): string
    {
        $columns = static::sortableColumns();

        return $columns[0] ?? 'id';
    }
}
