<?php

/**
 * Daftar permission admin. Key dipakai di middleware, controller, dan form user.
 */
return [
    ['key' => 'dashboard.view', 'label' => 'Dashboard', 'group' => 'Umum', 'menu_key' => '/admin/dashboard'],

    ['key' => 'berita.view', 'label' => 'Berita — Lihat', 'group' => 'Konten Web', 'menu_key' => '/admin/berita'],
    ['key' => 'berita.create', 'label' => 'Berita — Tambah', 'group' => 'Konten Web'],
    ['key' => 'berita.update', 'label' => 'Berita — Edit', 'group' => 'Konten Web'],
    ['key' => 'berita.delete', 'label' => 'Berita — Hapus', 'group' => 'Konten Web'],

    ['key' => 'dokumen-kegiatan.view', 'label' => 'Dokumen Kegiatan — Lihat', 'group' => 'Konten Web', 'menu_key' => '/admin/dokumen-kegiatan'],
    ['key' => 'dokumen-kegiatan.create', 'label' => 'Dokumen Kegiatan — Tambah', 'group' => 'Konten Web'],
    ['key' => 'dokumen-kegiatan.update', 'label' => 'Dokumen Kegiatan — Edit', 'group' => 'Konten Web'],
    ['key' => 'dokumen-kegiatan.delete', 'label' => 'Dokumen Kegiatan — Hapus', 'group' => 'Konten Web'],

    ['key' => 'provinsi.view', 'label' => 'Provinsi', 'group' => 'Wilayah', 'menu_key' => '/admin/provinsi'],
    ['key' => 'kab-kota.view', 'label' => 'Kab/Kota', 'group' => 'Wilayah', 'menu_key' => '/admin/kab-kota'],
    ['key' => 'kecamatan.view', 'label' => 'Kecamatan', 'group' => 'Wilayah', 'menu_key' => '/admin/kecamatan'],
    ['key' => 'kel-des.view', 'label' => 'Kel/Desa', 'group' => 'Wilayah', 'menu_key' => '/admin/kel-des'],

    ['key' => 'users.view', 'label' => 'Users — Lihat', 'group' => 'Sistem', 'menu_key' => '/admin/users'],
    ['key' => 'users.create', 'label' => 'Users — Tambah', 'group' => 'Sistem'],
    ['key' => 'users.update', 'label' => 'Users — Edit', 'group' => 'Sistem'],
    ['key' => 'users.delete', 'label' => 'Users — Hapus', 'group' => 'Sistem'],

    ['key' => 'roles.view', 'label' => 'Roles — Lihat', 'group' => 'Sistem', 'menu_key' => '/admin/roles'],
    ['key' => 'roles.create', 'label' => 'Roles — Tambah', 'group' => 'Sistem'],
    ['key' => 'roles.update', 'label' => 'Roles — Edit', 'group' => 'Sistem'],
    ['key' => 'roles.delete', 'label' => 'Roles — Hapus', 'group' => 'Sistem'],

    ['key' => 'kelompok-petani.view', 'label' => 'Kelompok Petani — Lihat', 'group' => 'Master', 'menu_key' => '/admin/kelompok-petani'],
    ['key' => 'kelompok-petani.create', 'label' => 'Kelompok Petani — Tambah', 'group' => 'Master'],
    ['key' => 'kelompok-petani.update', 'label' => 'Kelompok Petani — Edit', 'group' => 'Master'],
    ['key' => 'kelompok-petani.delete', 'label' => 'Kelompok Petani — Hapus', 'group' => 'Master'],

    ['key' => 'petani.view', 'label' => 'Petani — Lihat', 'group' => 'Master', 'menu_key' => '/admin/petani'],
    ['key' => 'petani.create', 'label' => 'Petani — Tambah', 'group' => 'Master'],
    ['key' => 'petani.update', 'label' => 'Petani — Edit', 'group' => 'Master'],
    ['key' => 'petani.delete', 'label' => 'Petani — Hapus', 'group' => 'Master'],

    ['key' => 'pendamping.view', 'label' => 'Pendamping — Lihat', 'group' => 'Master', 'menu_key' => '/admin/pendamping'],
    ['key' => 'pendamping.create', 'label' => 'Pendamping — Tambah', 'group' => 'Master'],
    ['key' => 'pendamping.update', 'label' => 'Pendamping — Edit', 'group' => 'Master'],
    ['key' => 'pendamping.delete', 'label' => 'Pendamping — Hapus', 'group' => 'Master'],

    ['key' => 'jenis-pelatihan.view', 'label' => 'Jenis Pelatihan — Lihat', 'group' => 'Data Pelatihan', 'menu_key' => '/admin/data-verval/jenis-pelatihan'],
    ['key' => 'jenis-pelatihan.create', 'label' => 'Jenis Pelatihan — Tambah', 'group' => 'Data Pelatihan'],
    ['key' => 'jenis-pelatihan.update', 'label' => 'Jenis Pelatihan — Edit', 'group' => 'Data Pelatihan'],
    ['key' => 'jenis-pelatihan.delete', 'label' => 'Jenis Pelatihan — Hapus', 'group' => 'Data Pelatihan'],

    ['key' => 'pelatihan.view', 'label' => 'Pelatihan — Lihat', 'group' => 'Data Pelatihan', 'menu_key' => '/admin/data-verval/pelatihan'],
    ['key' => 'pelatihan.create', 'label' => 'Pelatihan — Tambah', 'group' => 'Data Pelatihan'],
    ['key' => 'pelatihan.update', 'label' => 'Pelatihan — Edit', 'group' => 'Data Pelatihan'],
    ['key' => 'pelatihan.delete', 'label' => 'Pelatihan — Hapus', 'group' => 'Data Pelatihan'],

    ['key' => 'kelembagaan-poktan.view', 'label' => 'Kelembagaan Poktan', 'group' => 'Lainnya', 'menu_key' => '/admin/kelembagaan-poktan'],
    ['key' => 'koperasi.view', 'label' => 'Koperasi', 'group' => 'Lainnya', 'menu_key' => '/admin/koperasi'],
    ['key' => 'bintek.view', 'label' => 'Bintek', 'group' => 'Lainnya', 'menu_key' => '/admin/bintek'],
    ['key' => 'monev-fisik.view', 'label' => 'Monev Fisik', 'group' => 'Lainnya', 'menu_key' => '/admin/monev-fisik'],
    ['key' => 'logframe.view', 'label' => 'Logframe — Lihat', 'group' => 'Lainnya', 'menu_key' => '/admin/logframe'],
    ['key' => 'logframe.create', 'label' => 'Logframe — Tambah', 'group' => 'Lainnya'],
    ['key' => 'logframe.update', 'label' => 'Logframe — Edit', 'group' => 'Lainnya'],
    ['key' => 'logframe.delete', 'label' => 'Logframe — Hapus', 'group' => 'Lainnya'],
    ['key' => 'activity-log.view', 'label' => 'Activity Log', 'group' => 'Lainnya', 'menu_key' => '/admin/activity-log'],
];
