<?php

/**
 * Kode akun belanja HDDAP — Tabel Sinkronisasi Akun Belanja (Pedoman Pengelolaan Keuangan HDDAP).
 */
return [
    'akun' => [
        '534131' => [
            'label' => 'Belanja Modal Jaringan',
            'kategori' => 'Civil Works, Goods, Mechanical and Equipment',
        ],
        '534135' => [
            'label' => 'Belanja Modal Perencanaan dan Pengawasan',
            'kategori' => 'Civil Works, Goods, Mechanical and Equipment',
        ],
        '532111' => [
            'label' => 'Belanja Modal Peralatan dan Mesin',
            'kategori' => 'Civil Works, Goods, Mechanical and Equipment',
        ],
        '533111' => [
            'label' => 'Belanja Modal Gedung dan Bangunan',
            'kategori' => 'Civil Works, Goods, Mechanical and Equipment',
        ],
        '522131' => [
            'label' => 'Belanja Jasa Konsultan',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '521211' => [
            'label' => 'Belanja Bahan',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '521213' => [
            'label' => 'Belanja Honor Output Kegiatan',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '521219' => [
            'label' => 'Belanja Barang Non Operasional Lainnya',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '522151' => [
            'label' => 'Belanja Jasa Profesi',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '524111' => [
            'label' => 'Belanja Perjalanan Biasa',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '524113' => [
            'label' => 'Belanja Perjalanan Dinas Dalam Kota',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '524114' => [
            'label' => 'Belanja Perjalanan Dinas Paket Meeting Dalam Kota',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
        '524119' => [
            'label' => 'Belanja Perjalanan Dinas Paket Meeting Luar Kota',
            'kategori' => 'Consulting Services & Incremental Operation Costs',
        ],
    ],

    'groups' => [
        [
            'label' => 'Civil Works, Goods, Mechanical and Equipment',
            'codes' => ['534131', '534135', '532111', '533111'],
        ],
        [
            'label' => 'Consulting Services & Incremental Operation Costs',
            'codes' => ['522131', '521211', '521213', '521219', '522151', '524111', '524113', '524114', '524119'],
        ],
    ],
];
