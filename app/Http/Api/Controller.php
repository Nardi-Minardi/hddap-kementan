<?php

namespace App\Http\Api;

use Illuminate\Http\JsonResponse;

abstract class Controller extends \App\Http\Controllers\Controller
{
    protected function apiSuccess(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
        ?array $meta = null,
    ): JsonResponse {
        return ApiResponse::success($data, $message, $statusCode, $meta);
    }

    protected function apiError(
        string $message = 'Error',
        int $statusCode = 400,
        mixed $data = null,
        ?array $meta = null,
    ): JsonResponse {
        return ApiResponse::error($message, $statusCode, $data, $meta);
    }
}
