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

    ['key' => 'dokumen-kegiatan.view', 'label' => 'Dokumen — Lihat', 'group' => 'Konten Web', 'menu_key' => '/admin/dokumen-kegiatan'],
    ['key' => 'dokumen-kegiatan.create', 'label' => 'Dokumen — Tambah', 'group' => 'Konten Web'],
    ['key' => 'dokumen-kegiatan.update', 'label' => 'Dokumen — Edit', 'group' => 'Konten Web'],
    ['key' => 'dokumen-kegiatan.delete', 'label' => 'Dokumen — Hapus', 'group' => 'Konten Web'],

    ['key' => 'sub-menu-dokumen.view', 'label' => 'Sub Menu Dokumen — Lihat', 'group' => 'Konten Web', 'menu_key' => '/admin/sub-menu-dokumen'],
    ['key' => 'sub-menu-dokumen.create', 'label' => 'Sub Menu Dokumen — Tambah', 'group' => 'Konten Web'],
    ['key' => 'sub-menu-dokumen.update', 'label' => 'Sub Menu Dokumen — Edit', 'group' => 'Konten Web'],
    ['key' => 'sub-menu-dokumen.delete', 'label' => 'Sub Menu Dokumen — Hapus', 'group' => 'Konten Web'],

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

    ['key' => 'cluster.view', 'label' => 'Kluster Petani — Lihat', 'group' => 'Data Petani', 'menu_key' => '/admin/data-petani'],
    ['key' => 'cluster.create', 'label' => 'Kluster Petani — Tambah', 'group' => 'Data Petani'],
    ['key' => 'cluster.update', 'label' => 'Kluster Petani — Edit', 'group' => 'Data Petani'],
    ['key' => 'cluster.delete', 'label' => 'Kluster Petani — Hapus', 'group' => 'Data Petani'],

    ['key' => 'kelompok-petani.view', 'label' => 'Kelompok Petani — Lihat', 'group' => 'Data Petani', 'menu_key' => '/admin/data-petani'],
    ['key' => 'kelompok-petani.create', 'label' => 'Kelompok Petani — Tambah', 'group' => 'Data Petani'],
    ['key' => 'kelompok-petani.update', 'label' => 'Kelompok Petani — Edit', 'group' => 'Data Petani'],
    ['key' => 'kelompok-petani.delete', 'label' => 'Kelompok Petani — Hapus', 'group' => 'Data Petani'],

    ['key' => 'petani.view', 'label' => 'Petani — Lihat', 'group' => 'Data Petani', 'menu_key' => '/admin/data-petani'],
    ['key' => 'petani.create', 'label' => 'Petani — Tambah', 'group' => 'Data Petani'],
    ['key' => 'petani.update', 'label' => 'Petani — Edit', 'group' => 'Data Petani'],
    ['key' => 'petani.delete', 'label' => 'Petani — Hapus', 'group' => 'Data Petani'],

    ['key' => 'pendamping.view', 'label' => 'Fasilitator — Lihat', 'group' => 'Master', 'menu_key' => '/admin/pendamping'],
    ['key' => 'pendamping.create', 'label' => 'Fasilitator — Tambah', 'group' => 'Master'],
    ['key' => 'pendamping.update', 'label' => 'Fasilitator — Edit', 'group' => 'Master'],
    ['key' => 'pendamping.delete', 'label' => 'Fasilitator — Hapus', 'group' => 'Master'],

    ['key' => 'input-keuangan.view', 'label' => 'Input Keuangan — Lihat', 'group' => 'Input Keuangan', 'menu_key' => '/admin/keuangan'],
    ['key' => 'input-keuangan.create', 'label' => 'Input Keuangan — Tambah', 'group' => 'Input Keuangan'],
    ['key' => 'input-keuangan.update', 'label' => 'Input Keuangan — Edit', 'group' => 'Input Keuangan'],
    ['key' => 'input-keuangan.delete', 'label' => 'Input Keuangan — Hapus', 'group' => 'Input Keuangan'],

    ['key' => 'jenis-pelatihan.view', 'label' => 'Jenis Pelatihan — Lihat', 'group' => 'Kegiatan Bimtek/Sosialisasi', 'menu_key' => '/admin/data-verval/jenis-pelatihan'],
    ['key' => 'jenis-pelatihan.create', 'label' => 'Jenis Pelatihan — Tambah', 'group' => 'Kegiatan Bimtek/Sosialisasi'],
    ['key' => 'jenis-pelatihan.update', 'label' => 'Jenis Pelatihan — Edit', 'group' => 'Kegiatan Bimtek/Sosialisasi'],
    ['key' => 'jenis-pelatihan.delete', 'label' => 'Jenis Pelatihan — Hapus', 'group' => 'Kegiatan Bimtek/Sosialisasi'],

    ['key' => 'pelatihan.view', 'label' => 'Pelatihan — Lihat', 'group' => 'Kegiatan Bimtek/Sosialisasi', 'menu_key' => '/admin/data-verval/pelatihan'],
    ['key' => 'pelatihan.create', 'label' => 'Pelatihan — Tambah', 'group' => 'Kegiatan Bimtek/Sosialisasi'],
    ['key' => 'pelatihan.update', 'label' => 'Pelatihan — Edit', 'group' => 'Kegiatan Bimtek/Sosialisasi'],
    ['key' => 'pelatihan.delete', 'label' => 'Pelatihan — Hapus', 'group' => 'Kegiatan Bimtek/Sosialisasi'],

    ['key' => 'kelembagaan-poktan.view', 'label' => 'Kelembagaan Poktan', 'group' => 'Lainnya', 'menu_key' => '/admin/kelembagaan-poktan'],
    ['key' => 'koperasi.view', 'label' => 'Koperasi', 'group' => 'Lainnya', 'menu_key' => '/admin/koperasi'],
    ['key' => 'monev-fisik.view', 'label' => 'Monev Fisik', 'group' => 'Lainnya', 'menu_key' => '/admin/monev-fisik'],
    ['key' => 'logframe.view', 'label' => 'Logframe — Lihat', 'group' => 'Lainnya', 'menu_key' => '/admin/logframe'],
    ['key' => 'logframe.create', 'label' => 'Logframe — Tambah', 'group' => 'Lainnya'],
    ['key' => 'logframe.update', 'label' => 'Logframe — Edit', 'group' => 'Lainnya'],
    ['key' => 'logframe.delete', 'label' => 'Logframe — Hapus', 'group' => 'Lainnya'],
    ['key' => 'activity-log.view', 'label' => 'Activity Log', 'group' => 'Lainnya', 'menu_key' => '/admin/activity-log'],

    ['key' => 'database-backup.view', 'label' => 'Backup & Restore Database — Lihat', 'group' => 'Lainnya', 'menu_key' => '/admin/database-backup'],
    ['key' => 'database-backup.create', 'label' => 'Backup & Restore Database — Backup', 'group' => 'Lainnya'],
    ['key' => 'database-backup.restore', 'label' => 'Backup & Restore Database — Restore', 'group' => 'Lainnya'],
    ['key' => 'database-backup.delete', 'label' => 'Backup & Restore Database — Hapus', 'group' => 'Lainnya'],
];
