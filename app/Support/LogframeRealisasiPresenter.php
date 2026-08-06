<?php

namespace App\Support;

use App\Models\Logframe;
use App\Services\PetaniStatisticService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LogframeRealisasiPresenter
{
    public function __construct(
        private readonly PetaniStatisticService $petaniStatisticService,
    ) {}

    public function applyToPaginator(LengthAwarePaginator $paginator, ?string $tahap = null): LengthAwarePaginator
    {
        $paginator->setCollection(
            $this->applyToCollection($paginator->getCollection(), $tahap),
        );

        return $paginator;
    }

    public function applyToCollection(Collection $logframes, ?string $tahap = null): Collection
    {
        $petaniStatisticService = $this->petaniStatisticService->withTahap($tahap);

        return $logframes->map(function (Logframe $logframe) use ($petaniStatisticService) {
            $logframe->realisasi = $petaniStatisticService->resolveRealisasiForIndicator(
                $logframe->nama_indikator,
                $logframe->realisasi,
            );

            return $logframe;
        });
    }
}
