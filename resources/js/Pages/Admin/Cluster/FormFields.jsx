import { Alert, Col, Divider, Form, Input, Row, Select } from 'antd';

export default function ClusterFormFields({
    data,
    setData,
    errors,
    kabKotaOptions = [],
    kumoditasOptions = [],
}) {
    const kabKotaSelected = Boolean(data.kode_kota);

    return (
        <>
            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Pilih Kab/Kota
            </Divider>

            {!kabKotaSelected && (
                <Alert
                    type="info"
                    showIcon
                    className="!mb-4"
                    message="Pilih Kab/Kota terlebih dahulu sebelum mengisi data cluster."
                />
            )}

            <Row gutter={[16, 0]}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Kab/Kota"
                        required
                        validateStatus={errors.kode_kota ? 'error' : ''}
                        help={errors.kode_kota}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Pilih Kab/Kota"
                            value={data.kode_kota ?? undefined}
                            onChange={(value) => setData('kode_kota', value ?? null)}
                            options={kabKotaOptions}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Data Cluster
            </Divider>

            <fieldset disabled={!kabKotaSelected} className="min-w-0 border-0 p-0 m-0">
                <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Nama Cluster"
                            required
                            validateStatus={errors.nama_cluster ? 'error' : ''}
                            help={errors.nama_cluster}
                        >
                            <Input
                                value={data.nama_cluster}
                                onChange={(event) => setData('nama_cluster', event.target.value)}
                                placeholder="Contoh: P1. Berkah 2"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Komoditas"
                            validateStatus={errors.kode_kumoditas ? 'error' : ''}
                            help={errors.kode_kumoditas}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Pilih komoditas (opsional)"
                                value={data.kode_kumoditas ?? undefined}
                                onChange={(value) => setData('kode_kumoditas', value ?? null)}
                                options={kumoditasOptions}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </fieldset>
        </>
    );
}
