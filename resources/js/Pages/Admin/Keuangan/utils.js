export function formatRupiah(value) {
    const num = Number(value || 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(num);
}

export function rekonBadge(status, selisih) {
    if (!status) {
        return { label: 'Belum Rekon', color: 'gold' };
    }

    if (selisih === 0) {
        return { label: 'Rekon OK', color: 'green' };
    }

    return { label: 'Perlu Cek', color: 'red' };
}

export function formatKodeAkun(kode, kodeAkunMap = {}) {
    if (!kode) return '-';
    const meta = kodeAkunMap[kode];
    if (!meta) return kode;
    return `${kode} — ${meta.label}`;
}
