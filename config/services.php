<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'statistik' => [
        'dashboard_url' => env('STATISTIK_DASHBOARD_URL'),
    ],

    'social' => [
        'youtube_url' => env('SOCIAL_YOUTUBE_URL'),
        'instagram_url' => env('SOCIAL_INSTAGRAM_URL'),
    ],

    'videos' => [
        'hero_1' => env('VIDEO_HERO_1_URL', '/videos/hero-1.mp4'),
        'hero_2' => env('VIDEO_HERO_2_URL', '/videos/hero-2.mp4'),
        'hero_3' => env('VIDEO_HERO_3_URL', '/videos/hero-3.mp4'),
        'ai_tani' => env('VIDEO_AI_TANI_URL', '/videos/ai-tani-menyapa.mp4'),
    ],

];
