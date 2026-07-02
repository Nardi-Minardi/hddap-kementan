<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $berita = [
            [
                'judul' => 'Program HDDAP Tingkatkan Produktivitas Hortikultura di Lahan Kering',
                'ringkasan' => 'Kementerian Pertanian meluncurkan program pendampingan teknis bagi petani hortikultura di wilayah lahan kering.',
                'konten' => 'Program Horticulture Development in Dryland Areas Project (HDDAP) terus digencarkan untuk meningkatkan produktivitas dan kesejahteraan petani hortikultura. Kegiatan meliputi pelatihan budidaya, bantuan benih unggul, serta pendampingan pengelolaan hasil panen.',
                'image_url' => 'https://picsum.photos/id/292/800/450',
                'published_at' => now()->subDays(1),
            ],
            [
                'judul' => 'Pendataan Petani dan Kelompok Tani Semakin Terintegrasi',
                'ringkasan' => 'Platform digital HDDAP mempermudah pencatatan data petani, kelompok tani, dan kartu keluarga petani secara nasional.',
                'konten' => 'Integrasi data petani dan kelompok tani menjadi fondasi perencanaan program pertanian yang lebih tepat sasaran. Melalui platform HDDAP, data dapat diakses dan diperbarui secara real-time oleh petugas lapangan maupun administrator.',
                'image_url' => 'https://picsum.photos/id/1074/800/450',
                'published_at' => now()->subDays(3),
            ],
            [
                'judul' => 'Panen Raya Cabai Merah di NTT Capai Target Produksi',
                'ringkasan' => 'Petani cabai merah di Nusa Tenggara Timur mencatatkan peningkatan hasil panen berkat intervensi teknologi irigasi tetes.',
                'konten' => 'Intervensi teknologi irigasi tetes dan pendampingan budidaya intensif terbukti meningkatkan produktivitas cabai merah di lahan kering. Hasil ini menjadi contoh replikasi program serupa di wilayah lain.',
                'image_url' => 'https://picsum.photos/seed/hddap-berita-cabai-ntt/800/450',
                'published_at' => now()->subDays(5),
            ],
            [
                'judul' => 'Pelatihan GAP Hortikultura untuk 500 Petani Muda',
                'ringkasan' => 'Good Agricultural Practices (GAP) menjadi fokus pelatihan generasi muda petani hortikultura di tiga provinsi prioritas.',
                'konten' => 'Pelatihan GAP mencakup sanitasi lahan, penggunaan pestisida aman, dan standar keamanan pangan. Peserta juga dibekali keterampilan pemasaran digital untuk memperluas jangkauan pasar hasil panen.',
                'image_url' => 'https://picsum.photos/seed/hddap-berita-gap-petani/800/450',
                'published_at' => now()->subDays(7),
            ],
            [
                'judul' => 'Kemitraan Poktan dan Offtaker Perkuat Rantai Pasok Hortikultura',
                'ringkasan' => 'Kelompok tani hortikultura menjalin kemitraan dengan offtaker untuk menjamin harga dan penyerapan hasil panen yang stabil.',
                'konten' => 'Skema kemitraan ini membantu petani mendapatkan kepastian pasar sebelum musim tanam. Offtaker berperan memastikan standar kualitas produk dan jadwal pengambilan hasil panen secara berkala.',
                'image_url' => 'https://picsum.photos/id/137/800/450',
                'published_at' => now()->subDays(10),
            ],
            [
                'judul' => 'Dashboard Statistik HDDAP Hadirkan Data Pertanian Real-Time',
                'ringkasan' => 'Fitur dashboard statistik memungkinkan pemantauan data petani, kelompok tani, dan capaian program secara visual.',
                'konten' => 'Dashboard statistik HDDAP menampilkan agregasi data per wilayah, jenis komoditas, dan indikator kinerja program. Informasi ini mendukung pengambilan keputusan cepat bagi pemangku kebijakan pertanian.',
                'image_url' => 'https://picsum.photos/id/186/800/450',
                'published_at' => now()->subDays(12),
            ],
        ];

        foreach ($berita as $item) {
            Berita::updateOrCreate(
                ['slug' => Str::slug($item['judul'])],
                [
                    ...$item,
                    'slug' => Str::slug($item['judul']),
                    'is_published' => true,
                ],
            );
        }
    }
}
