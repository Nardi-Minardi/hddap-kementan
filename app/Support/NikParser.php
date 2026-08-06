<?php

namespace App\Support;

class NikParser
{
    public function normalize(?string $nik): ?string
    {
        if ($nik === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $nik);

        return strlen($digits) >= 12 ? $digits : null;
    }

    public function birthYear(?string $nik): ?int
    {
        $normalized = $this->normalize($nik);

        if ($normalized === null) {
            return null;
        }

        $yearPart = (int) substr($normalized, 10, 2);
        $currentYear = (int) date('Y');
        $currentYearSuffix = $currentYear % 100;

        return $yearPart <= $currentYearSuffix
            ? 2000 + $yearPart
            : 1900 + $yearPart;
    }

    public function age(?string $nik): ?int
    {
        $birthYear = $this->birthYear($nik);

        if ($birthYear === null) {
            return null;
        }

        $age = ((int) date('Y')) - $birthYear;

        return $age >= 0 && $age <= 120 ? $age : null;
    }

    public function isFemaleGender(?string $gender, ?string $nik): bool
    {
        $normalizedGender = strtoupper((string) $gender);

        if ($normalizedGender === 'P') {
            return true;
        }

        if ($normalizedGender === 'L') {
            return false;
        }

        $normalizedNik = $this->normalize($nik);

        if ($normalizedNik === null) {
            return false;
        }

        return (int) substr($normalizedNik, 6, 2) > 40;
    }
}
