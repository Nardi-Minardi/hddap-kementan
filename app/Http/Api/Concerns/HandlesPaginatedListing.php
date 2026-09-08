<?php

namespace App\Http\Api\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

trait HandlesPaginatedListing
{
    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @param  array<string, mixed>  $params
     * @param  callable(\Illuminate\Database\Eloquent\Model): array<string, mixed>  $transform
     * @param  array<string, mixed>|null  $filters
     */
    protected function paginatedListing(
        Builder $query,
        array $params,
        callable $transform,
        ?array $filters = null,
    ): JsonResponse {
        $total = (clone $query)->count();

        $items = $query
            ->orderBy($params['order_by'], $params['order_direction'])
            ->offset($params['offset'])
            ->limit($params['limit'])
            ->get();

        $meta = [
            'total'           => $total,
            'limit'           => $params['limit'],
            'offset'          => $params['offset'],
            'order_by'        => $params['order_by'],
            'order_direction' => $params['order_direction'],
            'search'          => $params['search'],
        ];

        if ($filters !== null) {
            $meta['filters'] = $filters;
        }

        return $this->apiSuccess(
            data: $items->map($transform)->values(),
            message: 'Success',
            meta: $meta,
        );
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @param  list<string>  $columns
     */
    protected function applyIlikeSearch(Builder $query, ?string $search, array $columns): void
    {
        if ($search === null || $search === '') {
            return;
        }

        $query->where(function ($q) use ($search, $columns) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'ilike', "%{$search}%");
            }
        });
    }
}
