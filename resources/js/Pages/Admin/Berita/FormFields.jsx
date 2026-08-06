import { Form, Input, InputNumber, Select, Switch, Upload, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

export default function BeritaFormFields({
    data,
    setData,
    errors = {},
    existingImageUrl = null,
    tipeOptions = [],
}) {
    const imagePreview = data.image instanceof File
        ? URL.createObjectURL(data.image)
        : existingImageUrl;

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
                help={errors.konten || 'Tampil saat pengunjung klik "Baca selengkapnya".'}
            >
                <TextArea
                    value={data.konten}
                    onChange={(e) => setData('konten', e.target.value)}
                    placeholder="Isi berita lengkap..."
                    rows={8}
                />
            </Form.Item>

            <Form.Item
                label="Gambar Utama"
                validateStatus={errors.image || errors.image_url ? 'error' : ''}
                help={errors.image || errors.image_url || 'Upload gambar (JPG/PNG/WebP, maks. 4MB) atau isi URL gambar.'}
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
