<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class ApiDocumentationController extends Controller
{
    public function ui(): View
    {
        return view('swagger.index');
    }

    public function spec(): JsonResponse
    {
        $path = public_path('api-docs/openapi.json');

        abort_unless(is_file($path), 404, 'OpenAPI specification not found.');

        return response()->json(
            json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR),
            200,
            [],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
        );
    }
}
