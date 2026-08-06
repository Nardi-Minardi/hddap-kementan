import { Form, Input, Select } from 'antd';

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

export default function PendampingFormFields({
    data,
    setData,
    errors = {},
    kabKotaOptions = [],
    bidangOptions = [],
    pendampingOptions = [],
}) {
    return (
        <>
            <Form.Item
                label="Nama Fasilitator"
                required
                validateStatus={errors.nama_fasilitator ? 'error' : ''}
                help={errors.nama_fasilitator}
            >
                <Input
                    value={data.nama_fasilitator}
                    onChange={(e) => setData('nama_fasilitator', e.target.value)}
                    placeholder="Nama lengkap"
                    maxLength={150}
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Gender"
                validateStatus={errors.gender ? 'error' : ''}
                help={errors.gender}
            >
                <Select
                    allowClear
                    placeholder="Pilih gender"
                    size="large"
                    value={data.gender}
                    onChange={(value) => setData('gender', value ?? null)}
                    options={GENDER_OPTIONS}
                />
            </Form.Item>

            <Form.Item
                label="Tanggal Lahir"
                validateStatus={errors.tanggal_lahir ? 'error' : ''}
                help={errors.tanggal_lahir}
            >
                <Input
                    type="date"
                    value={data.tanggal_lahir}
                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Kota/Kabupaten"
                required
                validateStatus={errors.kode_kota ? 'error' : ''}
                help={errors.kode_kota}
            >
                <Select
                    showSearch
                    allowClear
                    placeholder="Pilih kota/kabupaten"
                    size="large"
                    value={data.kode_kota}
                    onChange={(value) => setData('kode_kota', value ?? null)}
                    options={kabKotaOptions}
                    optionFilterProp="label"
                />
            </Form.Item>

            <Form.Item
                label="Bidang"
                required
                validateStatus={errors.bidang ? 'error' : ''}
                help={errors.bidang}
            >
                <Select
                    allowClear
                    placeholder="Pilih bidang"
                    size="large"
                    value={data.bidang}
                    onChange={(value) => setData('bidang', value ?? null)}
                    options={bidangOptions}
                />
            </Form.Item>

            <Form.Item
                label="Pendamping"
                required
                validateStatus={errors.pendamping ? 'error' : ''}
                help={errors.pendamping}
            >
                <Select
                    allowClear
                    placeholder="Pilih pendamping"
                    size="large"
                    value={data.pendamping}
                    onChange={(value) => setData('pendamping', value ?? null)}
                    options={pendampingOptions}
                />
            </Form.Item>

            <Form.Item
                label="Domisili"
                validateStatus={errors.domisili ? 'error' : ''}
                help={errors.domisili}
            >
                <Input
                    value={data.domisili}
                    onChange={(e) => setData('domisili', e.target.value)}
                    placeholder="Domisili"
                    maxLength={100}
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Pendidikan Terakhir"
                validateStatus={errors.pendidikan_terakhir ? 'error' : ''}
                help={errors.pendidikan_terakhir}
            >
                <Input
                    value={data.pendidikan_terakhir}
                    onChange={(e) => setData('pendidikan_terakhir', e.target.value)}
                    placeholder="Contoh: S1 Pertanian"
                    maxLength={150}
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Alamat"
                validateStatus={errors.alamat ? 'error' : ''}
                help={errors.alamat}
            >
                <Input.TextArea
                    rows={3}
                    value={data.alamat}
                    onChange={(e) => setData('alamat', e.target.value)}
                    placeholder="Alamat lengkap"
                />
            </Form.Item>
        </>
    );
}
