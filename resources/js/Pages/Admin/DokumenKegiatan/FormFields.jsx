import { Form, Input, InputNumber, Switch, Upload, Button, Select } from 'antd';
import { UploadOutlined, FilePdfOutlined } from '@ant-design/icons';

export default function DokumenKegiatanFormFields({
    data,
    setData,
    errors,
    subMenuOptions = [],
    existingFileUrl = null,
    existingCoverUrl = null,
    isEdit = false,
}) {
    return (
        <>
            <Form.Item
                label="Sub Menu Dokumen"
                required
                validateStatus={errors.sub_menu_dokumen_id ? 'error' : ''}
                help={errors.sub_menu_dokumen_id || 'Pilih kategori sub menu tempat dokumen ini ditampilkan.'}
            >
                <Select
                    size="large"
                    placeholder="Pilih sub menu dokumen"
                    value={data.sub_menu_dokumen_id || undefined}
                    onChange={(val) => setData('sub_menu_dokumen_id', val)}
                    options={subMenuOptions}
                    showSearch
                    optionFilterProp="label"
                />
            </Form.Item>

            <Form.Item
                label="Judul Dokumen"
                required
                validateStatus={errors.judul ? 'error' : ''}
                help={errors.judul}
            >
                <Input
                    value={data.judul}
                    onChange={(e) => setData('judul', e.target.value)}
                    placeholder="Contoh: Laporan Kegiatan HDDAP Q1 2026"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Deskripsi"
                validateStatus={errors.deskripsi ? 'error' : ''}
                help={errors.deskripsi}
            >
                <Input.TextArea
                    value={data.deskripsi}
                    onChange={(e) => setData('deskripsi', e.target.value)}
                    placeholder="Ringkasan singkat isi dokumen..."
                    rows={3}
                    showCount
                    maxLength={1000}
                />
            </Form.Item>

            <Form.Item
                label={isEdit ? 'Ganti File PDF' : 'File PDF'}
                required={!isEdit}
                validateStatus={errors.file ? 'error' : ''}
                help={errors.file || (isEdit ? 'Kosongkan jika tidak ingin mengganti file PDF.' : 'Format PDF, maksimal 20 MB.')}
            >
                {existingFileUrl && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                        <FilePdfOutlined className="text-red-500" />
                        <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 hover:underline">
                            Lihat PDF saat ini
                        </a>
                    </div>
                )}
                <Upload
                    accept=".pdf,application/pdf"
                    maxCount={1}
                    beforeUpload={(file) => {
                        setData('file', file);
                        return false;
                    }}
                    onRemove={() => setData('file', null)}
                    fileList={data.file ? [{ uid: '-1', name: data.file.name, status: 'done' }] : []}
                >
                    <Button icon={<UploadOutlined />}>Pilih File PDF</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                label="Cover / Thumbnail (opsional)"
                validateStatus={errors.cover ? 'error' : ''}
                help={errors.cover || 'Gambar sampul untuk daftar dokumen. JPG/PNG/WebP, maks. 4MB.'}
            >
                {existingCoverUrl && !data.cover && (
                    <img
                        src={existingCoverUrl}
                        alt="Cover"
                        className="mb-3 h-24 w-36 rounded-lg object-cover ring-1 ring-gray-200"
                    />
                )}
                <Upload
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    maxCount={1}
                    listType="picture-card"
                    beforeUpload={(file) => {
                        setData('cover', file);
                        return false;
                    }}
                    onRemove={() => setData('cover', null)}
                    fileList={data.cover ? [{ uid: '-1', name: data.cover.name, status: 'done', url: URL.createObjectURL(data.cover) }] : []}
                >
                    {!data.cover && <div><UploadOutlined /><div className="mt-1 text-xs">Upload</div></div>}
                </Upload>
            </Form.Item>

            <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item
                    label="Tanggal Publikasi"
                    validateStatus={errors.published_at ? 'error' : ''}
                    help={errors.published_at}
                >
                    <Input
                        type="date"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Urutan Tampil"
                    validateStatus={errors.urutan ? 'error' : ''}
                    help={errors.urutan || 'Angka lebih besar = lebih atas.'}
                >
                    <InputNumber
                        min={0}
                        max={9999}
                        value={data.urutan}
                        onChange={(val) => setData('urutan', val ?? 0)}
                        className="!w-full"
                    />
                </Form.Item>
            </div>

            <Form.Item label="Publish di website">
                <Switch
                    checked={data.is_published}
                    onChange={(checked) => setData('is_published', checked)}
                    checkedChildren="Ya"
                    unCheckedChildren="Draft"
                />
            </Form.Item>
        </>
    );
}
