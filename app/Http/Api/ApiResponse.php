<?php

namespace App\Http\Api;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
        ?array $meta = null,
    ): JsonResponse {
        return response()->json([
            'status_code' => $statusCode,
            'message'     => $message,
            'data'        => $data,
            'meta'        => $meta,
        ], $statusCode);
    }

    public static function error(
        string $message = 'Error',
        int $statusCode = 400,
        mixed $data = null,
        ?array $meta = null,
    ): JsonResponse {
        return response()->json([
            'status_code' => $statusCode,
            'message'     => $message,
            'data'        => $data,
            'meta'        => $meta,
        ], $statusCode);
    }
}
