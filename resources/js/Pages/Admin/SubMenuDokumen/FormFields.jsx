import { Form, Input, InputNumber, Switch } from 'antd';

export default function SubMenuDokumenFormFields({ data, setData, errors }) {
    return (
        <>
            <Form.Item
                label="Nama Sub Menu"
                required
                validateStatus={errors.nama ? 'error' : ''}
                help={errors.nama || 'Contoh: Juknis, Laporan Kegiatan, Publikasi'}
            >
                <Input
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    placeholder="Nama sub menu dokumen"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Urutan Tampil"
                validateStatus={errors.urutan ? 'error' : ''}
                help={errors.urutan || 'Angka lebih besar = lebih atas di menu Dokumen.'}
            >
                <InputNumber
                    min={0}
                    max={9999}
                    value={data.urutan}
                    onChange={(val) => setData('urutan', val ?? 0)}
                    className="!w-full"
                />
            </Form.Item>

            <Form.Item label="Aktif">
                <Switch
                    checked={data.is_active}
                    onChange={(checked) => setData('is_active', checked)}
                    checkedChildren="Ya"
                    unCheckedChildren="Tidak"
                />
            </Form.Item>
        </>
    );
}
