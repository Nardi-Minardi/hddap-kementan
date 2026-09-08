import { Form, Input, InputNumber, Select, Switch, Upload, Typography, Button } from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

export const FOTO_KEGIATAN_SLOTS = 5;

export function emptyFotoKegiatanState() {
    return {
        files: Array(FOTO_KEGIATAN_SLOTS).fill(null),
        remove: Array(FOTO_KEGIATAN_SLOTS).fill(false),
    };
}

export function fotoKegiatanFormFromRecord(fotoKegiatan = []) {
    return {
        files: Array(FOTO_KEGIATAN_SLOTS).fill(null),
        remove: Array(FOTO_KEGIATAN_SLOTS).fill(false),
        existing: Array.from({ length: FOTO_KEGIATAN_SLOTS }, (_, index) => fotoKegiatan[index] ?? null),
    };
}

export function transformBeritaForm(formData) {
    const { foto_kegiatan, image, _method, ...rest } = formData;
    const payload = {
        ...rest,
        is_published: formData.is_published ? '1' : '0',
    };

    if (_method) {
        payload._method = _method;
    }

    if (image instanceof File) {
        payload.image = image;
    }

    const uploads = {};
    foto_kegiatan?.files?.forEach((file, index) => {
        if (file instanceof File) {
            uploads[index] = file;
        }
    });

    if (Object.keys(uploads).length > 0) {
        payload.foto_kegiatan = uploads;
    }

    const removeFlags = {};
    foto_kegiatan?.remove?.forEach((removed, index) => {
        if (removed) {
            removeFlags[index] = '1';
        }
    });

    if (Object.keys(removeFlags).length > 0) {
        payload.foto_kegiatan_remove = removeFlags;
    }

    return payload;
}

export default function BeritaFormFields({
    data,
    setData,
    errors = {},
    existingImageUrl = null,
    existingFotoKegiatan = [],
    tipeOptions = [],
    showKabKota = true,
    kabKotaOptions = [],
    defaultKodeKota = null,
}) {
    const imagePreview = data.image instanceof File
        ? URL.createObjectURL(data.image)
        : existingImageUrl;

    const setFotoKegiatanFile = (index, file) => {
        const files = [...(data.foto_kegiatan?.files ?? emptyFotoKegiatanState().files)];
        const remove = [...(data.foto_kegiatan?.remove ?? emptyFotoKegiatanState().remove)];

        files[index] = file;
        remove[index] = false;

        setData('foto_kegiatan', {
            ...data.foto_kegiatan,
            files,
            remove,
        });
    };

    const removeFotoKegiatan = (index) => {
        const files = [...(data.foto_kegiatan?.files ?? emptyFotoKegiatanState().files)];
        const remove = [...(data.foto_kegiatan?.remove ?? emptyFotoKegiatanState().remove)];

        files[index] = null;
        remove[index] = true;

        setData('foto_kegiatan', {
            ...data.foto_kegiatan,
            files,
            remove,
        });
    };

    const getFotoKegiatanPreview = (index) => {
        const file = data.foto_kegiatan?.files?.[index];
        if (file instanceof File) {
            return URL.createObjectURL(file);
        }

        if (data.foto_kegiatan?.remove?.[index]) {
            return null;
        }

        return data.foto_kegiatan?.existing?.[index]
            ?? existingFotoKegiatan[index]
            ?? null;
    };

    return (
        <>
            <Form.Item
                label="Judul Berita / Agenda"
                required
                validateStatus={errors.judul ? 'error' : ''}
                help={errors.judul}
            >
                <Input
                    value={data.judul}
                    onChange={(e) => setData('judul', e.target.value)}
                    placeholder="Contoh: Program HDDAP Tingkatkan Produktivitas Hortikultura"
                    size="large"
                    maxLength={255}
                />
            </Form.Item>

            <Form.Item
                label="Tipe"
                required
                validateStatus={errors.tipe ? 'error' : ''}
                help={errors.tipe}
            >
                <Select
                    size="large"
                    value={data.tipe || 'berita'}
                    onChange={(val) => setData('tipe', val)}
                    options={tipeOptions}
                />
            </Form.Item>

            {(showKabKota || defaultKodeKota) && (
                <Form.Item
                    label="Kab/Kota"
                    required={showKabKota}
                    validateStatus={errors.kode_kota ? 'error' : ''}
                    help={errors.kode_kota || (!showKabKota && defaultKodeKota ? 'Otomatis sesuai penugasan Anda.' : undefined)}
                >
                    {showKabKota ? (
                        <Select
                            allowClear={!defaultKodeKota}
                            size="large"
                            placeholder="Pilih kab/kota"
                            value={data.kode_kota ?? undefined}
                            onChange={(val) => setData('kode_kota', val ?? null)}
                            options={kabKotaOptions.map((item) => ({
                                value: Number(item.value),
                                label: item.label,
                            }))}
                        />
                    ) : (
                        <Input
                            size="large"
                            readOnly
                            value={kabKotaOptions.find((item) => Number(item.value) === Number(defaultKodeKota))?.label ?? '-'}
                        />
                    )}
                </Form.Item>
            )}

            <Form.Item
                label="Tanggal Publikasi"
                validateStatus={errors.published_at ? 'error' : ''}
                help={errors.published_at}
            >
                <Input
                    type="date"
                    size="large"
                    value={data.published_at ?? ''}
                    onChange={(e) => setData('published_at', e.target.value || null)}
                />
            </Form.Item>

            <Form.Item
                label="Ringkasan"
                validateStatus={errors.ringkasan ? 'error' : ''}
                help={errors.ringkasan || 'Tampil di kartu berita (maks. 500 karakter).'}
            >
                <TextArea
                    value={data.ringkasan}
                    onChange={(e) => setData('ringkasan', e.target.value)}
                    placeholder="Cuplikan singkat berita..."
                    rows={3}
                    maxLength={500}
                    showCount
                />
            </Form.Item>

            <Form.Item
                label="Konten Lengkap"
                validateStatus={errors.konten ? 'error' : ''}
                help={errors.konten || 'Tampil saat pengunjung klik "Baca selengkapnya". Pisahkan paragraf dengan baris kosong — foto kegiatan otomatis diselipkan seperti layout surat kabar. Opsional: [[foto1]] … [[foto5]] untuk posisi manual.'}
            >
                <TextArea
                    value={data.konten}
                    onChange={(e) => setData('konten', e.target.value)}
                    placeholder="Isi berita lengkap..."
                    rows={8}
                />
            </Form.Item>

            <Form.Item
                label="Gambar Cover"
                validateStatus={errors.image || errors.image_url ? 'error' : ''}
                help={errors.image || errors.image_url || 'Foto utama/cover berita (JPG/PNG/WebP, maks. 4MB) atau isi URL gambar.'}
            >
                <Upload.Dragger
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    maxCount={1}
                    beforeUpload={(file) => {
                        setData('image', file);
                        setData('image_url', '');
                        return false;
                    }}
                    onRemove={() => setData('image', null)}
                    fileList={data.image ? [{ uid: '-1', name: data.image.name, status: 'done' }] : []}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Klik atau seret gambar ke sini</p>
                </Upload.Dragger>

                {!data.image && (
                    <Input
                        className="mt-3"
                        value={data.image_url}
                        onChange={(e) => setData('image_url', e.target.value)}
                        placeholder="Atau tempel URL gambar (https://...)"
                    />
                )}

                {imagePreview && (
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                        <img src={imagePreview} alt="Preview" className="max-h-48 w-full object-cover" />
                    </div>
                )}
            </Form.Item>

            <Form.Item
                label="Foto Kegiatan"
                help="Upload dokumentasi kegiatan (terpisah dari gambar cover). Tersedia 5 slot foto."
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: FOTO_KEGIATAN_SLOTS }).map((_, index) => {
                        const preview = getFotoKegiatanPreview(index);
                        const file = data.foto_kegiatan?.files?.[index];
                        const errorKey = errors[`foto_kegiatan.${index}`];

                        return (
                            <div
                                key={index}
                                className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3"
                            >
                                <Text strong className="mb-2 block text-sm">
                                    Foto Kegiatan {index + 1}
                                </Text>

                                {preview ? (
                                    <div className="space-y-2">
                                        <div className="overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={preview}
                                                alt={`Foto kegiatan ${index + 1}`}
                                                className="h-32 w-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeFotoKegiatan(index)}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                ) : (
                                    <Upload
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        showUploadList={false}
                                        beforeUpload={(uploadFile) => {
                                            setFotoKegiatanFile(index, uploadFile);
                                            return false;
                                        }}
                                    >
                                        <Button icon={<InboxOutlined />} block>
                                            Pilih Foto
                                        </Button>
                                    </Upload>
                                )}

                                {file instanceof File && (
                                    <Text type="secondary" className="mt-2 block text-xs">
                                        {file.name}
                                    </Text>
                                )}

                                {errorKey && (
                                    <Text type="danger" className="mt-1 block text-xs">
                                        {errorKey}
                                    </Text>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Form.Item>

            <Form.Item
                label="Urutan Tampil"
                validateStatus={errors.urutan ? 'error' : ''}
                help={errors.urutan || 'Angka lebih besar tampil lebih dulu di homepage (0 = default).'}
            >
                <InputNumber
                    className="w-full"
                    min={0}
                    max={9999}
                    value={data.urutan ?? 0}
                    onChange={(val) => setData('urutan', val ?? 0)}
                />
            </Form.Item>

            <Form.Item
                label="Status Publikasi"
                help="Hanya berita yang dipublikasikan yang tampil di halaman depan."
            >
                <Switch
                    checked={!!data.is_published}
                    onChange={(checked) => setData('is_published', checked)}
                    checkedChildren="Publish"
                    unCheckedChildren="Draft"
                />
                <Text type="secondary" className="ml-3">
                    {data.is_published ? 'Tampil di website' : 'Disimpan sebagai draft'}
                </Text>
            </Form.Item>
        </>
    );
}
