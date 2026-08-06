<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data sample lama dari seeder sebelumnya
        Berita::whereIn('slug', [
            'program-hddap-tingkatkan-produktivitas-hortikultura-di-lahan-kering',
            'pendataan-petani-dan-kelompok-tani-semakin-terintegrasi',
            'panen-raya-cabai-merah-di-ntt-capai-target-produksi',
            'pelatihan-gap-hortikultura-untuk-500-petani-muda',
            'kemitraan-poktan-dan-offtaker-perkuat-rantai-pasok-hortikultura',
            'dashboard-statistik-hddap-hadirkan-data-pertanian-real-time',
        ])->delete();

        $berita = [
            [
                'judul' => 'HDDAP Perkuat Produktivitas Hortikultura di 13 Kabupaten Lahan Kering',
                'tipe' => 'berita',
                'ringkasan' => 'Program Horticulture Development in Dryland Areas Project (HDDAP) Kementerian Pertanian terus digencarkan di 13 kabupaten prioritas untuk meningkatkan produktivitas dan kesejahteraan petani hortikultura.',
                'konten' => 'Program Horticulture Development in Dryland Areas Project (HDDAP) merupakan inisiatif strategis Kementerian Pertanian dalam mengembangkan hortikultura di wilayah lahan kering. Program ini beroperasi di 13 kabupaten prioritas, meliputi Dairi, Karo, Pakpak Bharat, Sumedang, Wonosobo, Batang, Lumajang, Gresik, Sumenep, Buleleng, Ende, Gowa, dan Enrekang.

Melalui pendekatan terintegrasi, HDDAP menyediakan pendampingan teknis budidaya, bantuan sarana produksi, serta fasilitasi akses pasar bagi petani hortikultura. Fokus pengembangan meliputi komoditas strategis seperti cabai, tomat, bawang merah, kentang, dan sayuran lainnya yang memiliki potensi pasar tinggi.

Direktur Jenderal Hortikultura menegaskan bahwa HDDAP bukan sekadar program bantuan, melainkan investasi jangka panjang untuk membangun kapasitas petani dan kelompok tani agar mampu berdaya saing di pasar domestik maupun ekspor. Capaian program dipantau secara berkala melalui platform digital HDDAP yang mencatat data petani, kelompok tani, dan indikator kinerja per wilayah.

Petani di lokasi intervensi melaporkan peningkatan hasil panen hingga 30–40 persen setelah menerapkan teknologi irigasi tetes dan pola tanam yang direkomendasikan. Program ini diharapkan menjadi model replikasi pengembangan hortikultura berkelanjutan di wilayah lahan kering se-Indonesia.',
                'image_url' => '/images/berita/01-hortikultura-lahan-kering.jpg',
                'published_at' => now()->subDays(2),
            ],
            [
                'judul' => 'Pelatihan Good Agricultural Practices (GAP) Hortikultura di Kabupaten Batang',
                'tipe' => 'agenda',
                'ringkasan' => 'Tim Fasilitator Kelompok (FASKEL) HDDAP Kabupaten Batang menggelar pelatihan GAP hortikultura bagi 120 petani cabai dan tomat selama tiga hari.',
                'konten' => 'Kabupaten Batang, sebagai salah satu lokasi intervensi HDDAP di Jawa Tengah, kembali menjadi tuan rumah kegiatan pelatihan Good Agricultural Practices (GAP) hortikultura. Pelatihan yang diikuti 120 petani anggota delapan kelompok tani ini berlangsung selama tiga hari di Balai Pelatihan Pertanian setempat.

Materi pelatihan mencakup sanitasi lahan, pengelolaan hama terpadu (PHT), penggunaan pestisida sesuai rekomendasi, pencatatan kegiatan pertanian, hingga standar keamanan pangan untuk persiapan sertifikasi. Peserta juga diajak praktik langsung di lahan percobaan untuk menerapkan teknik pemupukan berimbang dan sistem irigasi tetes.

Koordinator FASKEL Batang menjelaskan bahwa penerapan GAP menjadi syarat penting bagi petani untuk memasuki rantai pasok modern, termasuk supermarket dan industri pengolahan. "Petani yang sudah GAP-certified memiliki nilai jual lebih tinggi dan akses pasar yang lebih luas," ujarnya.

Sebagai tindak lanjut, setiap kelompok tani peserta akan menerima pendampingan lapangan selama satu musim tanam. Tim FASKEL akan memantau penerapan GAP dan membantu petani menyelesaikan dokumen persyaratan sertifikasi. Kegiatan ini dijadwalkan diulang pada kuartal berikutnya untuk kelompok tani baru.',
                'image_url' => '/images/berita/02-pelatihan-gap-petani.jpg',
                'published_at' => now()->subDays(4),
            ],
            [
                'judul' => 'Panen Raya Cabai Merah HDDAP Ende Catatkan Produksi 12 Ton per Hektar',
                'tipe' => 'berita',
                'ringkasan' => 'Kelompok Tani Makmur Sejahtera di Kabupaten Ende, NTT, mencatatkan hasil panen cabai merah rata-rata 12 ton per hektar berkat intervensi teknologi HDDAP.',
                'konten' => 'Kabupaten Ende, Nusa Tenggara Timur, menjadi sorotan setelah kelompok tani binaan HDDAP sukses mencapai produktivitas cabai merah rata-rata 12 ton per hektar pada musim panen kali ini. Angka tersebut jauh melampaui produktivitas rata-rata nasional cabai merah di lahan kering yang hanya sekitar 6–8 ton per hektar.

Keberhasilan ini tidak lepas dari paket intervensi HDDAP yang meliputi instalasi sistem irigasi tetes, penyediaan benih unggul varietas lokal adaptif, pendampingan pola tanam intensif, serta pelatihan pengendalian hama terpadu. Petani anggota Kelompok Tani Makmur Sejahtera menerapkan jadwal tanam terprogram sehingga pasokan cabai tetap stabil sepanjang tahun.

Ketua kelompok tani, Bapak Markus Leba, mengungkapkan bahwa sebelum program HDDAP, hasil panen sering fluktuatif akibat ketergantungan pada musim hujan dan serangan antraknosa. "Sekarang kami punya jadwal tanam, air irigasi cukup, dan tahu cara menangani hama tanpa boros pestisida," katanya.

Dinas Pertanian Kabupaten Ende berencana menjadikan lokasi ini sebagai demo plot untuk replikasi ke empat kecamatan lain. Panen raya dihadiri perwakilan Balai Pengkajian Teknologi Pertanian (BPTP) NTT dan off-taker lokal yang telah sepakat menyerap produksi cabai dengan harga floor price yang menguntungkan petani.',
                'image_url' => '/images/berita/03-panen-cabai-merah.jpg',
                'published_at' => now()->subDays(6),
            ],
            [
                'judul' => 'Workshop Pengembangan Rantai Pasok Hortikultura HDDAP di Gresik',
                'tipe' => 'agenda',
                'ringkasan' => 'HDDAP Kabupaten Gresik mengadakan workshop penghubung petani, kelompok tani, dan off-taker untuk memperkuat rantai pasok hortikultura yang berkelanjutan.',
                'konten' => 'Workshop Pengembangan Rantai Pasok Hortikultura HDDAP resmi dibuka di Kabupaten Gresik, Jawa Timur. Acara yang dihadiri 80 peserta — terdiri dari petani, pengurus kelompok tani, off-taker, dan perwakilan dinas pertanian setempat — bertujuan mempererat kemitraan bisnis agar hasil panen hortikultura terserap dengan harga yang adil.

Workshop membahas empat pilar utama: perencanaan produksi berbasis permintaan pasar, standar mutu dan grading produk, skema kontrak farming, serta mekanisme pembiayaan usaha tani hortikultura. Narasumber dari koperasi off-taker dan lembaga keuangan mikro agro berbagi pengalaman praktis dalam membangun kemitraan yang saling menguntungkan.

Salah satu keluaran workshop adalah penandatanganan Letter of Intent (LoI) antara tiga kelompok tani binaan HDDAP dengan off-taker sayuran segar yang melayani pasar Surabaya dan sekitarnya. LoI tersebut mengatur volume serah terima, standar kualitas, dan mekanisme penyelesaian harga.

Kepala Dinas Pertanian Gresik menekankan pentingnya perencanaan tanam kolektif agar pasokan tidak berlebihan di satu waktu sehingga harga di petani tetap stabil. Tim FASKEL Gresik akan memfasilitasi koordinasi jadwal tanam antar kelompok tani dan memantau kepatuhan standar mutu sebelum produk dikirim ke off-taker.',
                'image_url' => '/images/berita/04-rantai-pasok-sayuran.jpg',
                'published_at' => now()->subDays(8),
            ],
            [
                'judul' => 'Platform Digital HDDAP Permudah Pendataan Petani dan Kelompok Tani Nasional',
                'tipe' => 'berita',
                'ringkasan' => 'Sistem informasi HDDAP kini terintegrasi untuk pencatatan data petani, kelompok tani, pendamping, dan kartu keluarga petani di seluruh lokasi intervensi program.',
                'konten' => 'Kementerian Pertanian melalui program HDDAP terus meningkatkan kapasitas platform digital untuk mendukung pendataan dan monitoring petani hortikultura secara nasional. Sistem informasi terbaru memungkinkan petugas lapangan, fasilitator kelompok, dan administrator pusat mengakses serta memperbarui data secara real-time.

Platform HDDAP mencatat profil lengkap petani meliputi identitas, lahan, komoditas yang dibudidayakan, riwayat pelatihan, dan keanggotaan kelompok tani. Data kelompok tani (Poktan) juga terintegrasi, mencakup struktur organisasi, lokasi, komoditas unggulan, dan capaian produksi. Fitur kartu keluarga petani memudahkan pendataan anggota keluarga yang terlibat dalam usaha tani hortikultura.

Dashboard statistik yang tersedia di portal admin menampilkan agregasi data per kabupaten, jenis komoditas, jenis kelamin petani, dan indikator capaian program. Visualisasi peta sebaran CPCL (Calon Peserta Community Livelihood) membantu perencanaan intervensi yang lebih tepat sasaran.

Tim pengembang sistem menegaskan bahwa keamanan data menjadi prioritas, dengan mekanisme autentikasi dan otorisasi berbasis peran. Petugas kabupaten hanya dapat mengakses data dalam wilayah kewenangannya, sementara administrator pusat memiliki akses agregat nasional. Pelatihan penggunaan platform telah dilaksanakan di seluruh 13 kabupaten intervensi HDDAP.',
                'image_url' => '/images/berita/05-teknologi-pertanian-digital.jpg',
                'published_at' => now()->subDays(10),
            ],
            [
                'judul' => 'Kunjungan Lapangan Monev HDDAP ke Lokasi Intervensi Wonosobo dan Sumedang',
                'tipe' => 'agenda',
                'ringkasan' => 'Tim monitoring dan evaluasi (monev) HDDAP melakukan kunjungan lapangan ke Kabupaten Wonosobo dan Sumedang untuk menilai capaian program dan kendala di tingkat petani.',
                'konten' => 'Tim Monitoring dan Evaluasi (Monev) program HDDAP melaksanakan kunjungan lapangan ke dua kabupaten intervensi di Jawa Tengah dan Jawa Barat, yaitu Wonosobo dan Sumedang. Kunjungan yang berlangsung selama empat hari ini melibatkan perwakilan Biro Perencanaan Kementerian Pertanian, BPTP setempat, dinas pertanian kabupaten, dan koordinator FASKEL.

Di Wonosobo, tim monev meninjau lahan bawang merah binaan tiga kelompok tani yang telah menerapkan sistem irigasi tetes dan mulsa plastik perak. Petani melaporkan pengurangan kebutuhan air hingga 40 persen dan peningkatan ukuran umbi bawang merah. Tim juga melakukan wawancara mendalam dengan 25 petani untuk mengidentifikasi kendala teknis dan kebutuhan pelatihan lanjutan.

Sementara di Sumedang, fokus kunjungan adalah program pengembangan tomat dan cabai di dataran tinggi. Tim mengevaluasi efektivitas pendampingan FASKEL, kelengkapan pencatatan data di platform HDDAP, serta tingkat kepuasan petani terhadap bantuan sarana produksi yang diterima. Hasil monev akan menjadi bahan laporan triwulanan dan rekomendasi kebijakan perbaikan program.

Koordinator monev menegaskan bahwa partisipasi aktif petani dalam sesi feedback sangat krusial agar intervensi HDDAP benar-benar responsif terhadap kebutuhan di lapangan. Laporan hasil kunjungan dijadwalkan diserahkan kepada pimpinan Kementerian Pertanian dalam waktu dua minggu.',
                'image_url' => '/images/berita/06-kunjungan-lapangan-petani.jpg',
                'published_at' => now()->subDays(12),
            ],
            [
                'judul' => 'Petani Kentang Karo Raih Penghargaan Produsen Terbaik HDDAP Sumatera Utara',
                'tipe' => 'berita',
                'ringkasan' => 'Kelompok Tani Tiga Dara di Kabupaten Karo, Sumatera Utara, meraih penghargaan produsen kentang terbaik dalam ajang HDDAP Regional Sumatera.',
                'konten' => 'Kabupaten Karo kembali menorehkan prestasi dalam program HDDAP setelah Kelompok Tani Tiga Dara meraih penghargaan Produsen Kentang Terbaik pada ajang HDDAP Regional Sumatera Utara. Penghargaan diberikan berdasarkan kriteria produktivitas, kualitas produk, penerapan GAP, dan keaktifan dalam pelaporan data di platform HDDAP.

Kelompok tani yang beranggotakan 45 petani ini mampu menghasilkan kentang super grade A dengan rata-rata 18 ton per hektar pada lahan dataran tinggi Karo. Penerapan teknologi benih sehat, rotasi tanaman, dan pengendalian busuk awet (Phytophthora infestans) menjadi kunci keberhasilan mereka.

Bupati Karo dalam sambutannya menyampaikan apresiasi kepada petani dan tim FASKEL yang telah konsisten mendampingi. "Prestasi ini membuktikan bahwa lahan kering dataran tinggi Karo memiliki potensi besar untuk hortikultura berkualitas ekspor," ujarnya.

Sebagai bagian dari penghargaan, Kelompok Tani Tiga Dara akan menerima bantuan mesin sortir dan packing kentang serta fasilitasi akses pasar ke distributor Jakarta. Pengalaman best practice dari Karo akan didokumentasikan sebagai bahan pelatihan replikasi untuk kabupaten intervensi HDDAP lainnya di Indonesia.',
                'image_url' => '/images/berita/07-panen-kentang.jpg',
                'published_at' => now()->subDays(14),
            ],
            [
                'judul' => 'Pelatihan Teknologi Irigasi Tetes untuk Petani HDDAP Kabupaten Lumajang',
                'tipe' => 'agenda',
                'ringkasan' => 'Sebanyak 75 petani cabai dan tomat di Kabupaten Lumajang mengikuti pelatihan instalasi dan perawatan sistem irigasi tetes binaan program HDDAP.',
                'konten' => 'Kabupaten Lumajang, Jawa Timur, yang kerap menghadapi keterbatasan air di musim kemarau, menjadi lokasi pelatihan teknologi irigasi tetes HDDAP. Sebanyak 75 petani anggota lima kelompok tani cabai dan tomat mengikuti pelatihan teknis selama dua hari, diawali teori dan dilanjutkan praktik instalasi di lahan contoh.

Materi pelatihan meliputi perhitungan kebutuhan air tanaman, perancangan layout jaringan irigasi tetes, pemasangan pipa dan emitter, pengaturan tekanan air, hingga perawatan rutin untuk mencegah penyumbatan. Peserta dibekali panduan praktis yang dapat digunakan sebagai referensi saat memasang sistem di lahan masing-masing.

Penggunaan irigasi tetes terbukti mampu menghemat air hingga 50–60 persen dibandingkan irigasi tabur manual, sekaligus menjaga kelembaban tanah optimal untuk tanaman hortikultura. Petani di Lumajang yang sudah lebih dulu menerapkan teknologi ini melaporkan peningkatan hasil panen cabai sebesar 25 persen dan pengurangan biaya tenaga kerja untuk penyiraman.

Tim FASKEL Lumajang akan mendampingi 20 petani prioritas dalam instalasi irigasi tetes di lahan produktifnya masing-masing selama bulan berikutnya. Bantuan paket irigasi tetes dari program HDDAP akan disalurkan bertahap berdasarkan kesiapan lahan dan komitmen kelompok tani.',
                'image_url' => '/images/berita/08-irigasi-tetes-hortikultura.jpg',
                'published_at' => now()->subDays(16),
            ],
            [
                'judul' => 'HDDAP Buleleng Kembangkan Agrowisata Hortikultura Berbasis Kelompok Tani',
                'tipe' => 'berita',
                'ringkasan' => 'Program HDDAP Kabupaten Buleleng mengembangkan konsep agrowisata hortikultura yang melibatkan petani strawberry, jeruk, dan sayuran organik binaan kelompok tani.',
                'konten' => 'Kabupaten Buleleng, Bali, yang dikenal sebagai destinasi wisata, kini mengembangkan potensi agrowisata hortikultura melalui program HDDAP. Tiga kelompok tani binaan di kawasan dataran tinggi Bedugul dan Pancasari telah menjadikan kebun strawberry, jeruk keprok, dan sayuran organik sebagai destinasi wisata edukasi pertanian.

Konsep agrowisata ini dirancang untuk menambah pendapatan petani di luar musim panen, sekaligus mengedukasi masyarakat urban tentang proses budidaya hortikultura berkelanjutan. Pengunjung dapat memetik strawberry langsung di kebun, mengikuti tour budidaya jeruk, dan membeli produk segar hasil petani lokal.

Koordinator FASKEL Buleleng menjelaskan bahwa pengembangan agrowisata didukung pelatihan manajemen usaha, pelayanan pelanggan, dan pemasaran digital. "Kami ingin petani tidak hanya jago bertani, tapi juga mampu mengelola usaha agrowisata yang profesional," ujarnya.

Dinas Pariwisata Kabupaten Buleleng menyambut positif inisiatif ini dan berencana mempromosikan destinasi agrowisata HDDAP melalui kanal digital pariwisata Bali. Program ini diharapkan menjadi model pengembangan ekonomi pertanian terintegrasi pariwisata di wilayah lahan kering lainnya.',
                'image_url' => '/images/berita/09-agrowisata-stroberi.jpg',
                'published_at' => now()->subDays(18),
            ],
            [
                'judul' => 'Forum Komunikasi FASKEL HDDAP Seluruh Indonesia Digelar di Makassar',
                'tipe' => 'agenda',
                'ringkasan' => 'Forum komunikasi tahunan Fasilitator Kelompok (FASKEL) HDDAP dari 13 kabupaten intervensi digelar di Makassar untuk berbagi pengalaman dan strategi pendampingan petani.',
                'konten' => 'Forum Komunikasi Fasilitator Kelompok (FASKEL) HDDAP tingkat nasional resmi dibuka di Makassar, Sulawesi Selatan. Acara tiga hari ini dihadiri 65 fasilitator kelompok dari 13 kabupaten intervensi HDDAP, perwakilan BPTP, dinas pertanian provinsi, serta tim teknis Kementerian Pertanian.

Forum membahas berbagai topik strategis, antara lain: teknik pendampingan partisipatif petani, penggunaan platform digital HDDAP untuk pelaporan lapangan, penanganan hama dan penyakit utama hortikultura di lahan kering, serta strategi membangun kemitraan dengan off-taker. Sesi sharing best practice menjadi highlight acara, dengan FASKEL dari Ende, Batang, dan Karo mempresentasikan keberhasilan intervensi di wilayahnya masing-masing.

Salah satu rekomendasi forum adalah penyusunan modul pendampingan terstandar yang dapat disesuaikan dengan kondisi agroekosistem lokal. Peserta juga sepakat untuk memperkuat jejaring komunikasi antar-FASKEL melalui grup koordinasi digital agar pertukaran informasi teknis berlangsung lebih cepat.

Direktur Program HDDAP dalam sambutan pembukaan menekankan peran krusial FASKEL sebagai ujung tombak program di lapangan. "Keberhasilan HDDAP ditentukan oleh kualitas pendampingan yang diberikan FASKEL kepada petani dan kelompok tani setiap hari," tegasnya. Forum dijadwalkan diadakan setiap tahun sebagai wadah sinergi dan peningkatan kapasitas fasilitator kelompok se-Indonesia.',
                'image_url' => '/images/berita/10-forum-petani-kelompok-tani.jpg',
                'published_at' => now()->subDays(20),
            ],
        ];

        foreach ($berita as $index => $item) {
            Berita::updateOrCreate(
                ['slug' => Str::slug($item['judul'])],
                [
                    ...$item,
                    'slug' => Str::slug($item['judul']),
                    'urutan' => count($berita) - $index,
                    'is_published' => true,
                ],
            );
        }
    }
}
