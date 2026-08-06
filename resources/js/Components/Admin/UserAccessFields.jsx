import { Checkbox, Divider, Form, Select, Switch, Typography } from 'antd';

const { Text } = Typography;

export default function UserAccessFields({
    data,
    setData,
    errors = {},
    permissionGroups = [],
    kabKotaOptions = [],
    canManagePusat = false,
}) {
    const togglePermission = (key, checked) => {
        const current = data.permission_keys ?? [];
        setData(
            'permission_keys',
            checked ? [...new Set([...current, key])] : current.filter((item) => item !== key),
        );
    };

    const toggleGroup = (permissions, checked) => {
        const keys = permissions.map((item) => item.key);
        const current = data.permission_keys ?? [];

        if (checked) {
            setData('permission_keys', [...new Set([...current, ...keys])]);
            return;
        }

        setData('permission_keys', current.filter((item) => !keys.includes(item)));
    };

    return (
        <>
            {canManagePusat && (
                <Form.Item
                    label="Akses Pusat"
                    help="User pusat dapat melihat semua kabupaten/kota dan mengelola user lain secara penuh."
                    validateStatus={errors.is_pusat ? 'error' : ''}
                >
                    <Switch
                        checked={!!data.is_pusat}
                        onChange={(checked) => {
                            setData('is_pusat', checked);
                            if (checked) {
                                setData('kab_kota_codes', []);
                            }
                        }}
                        checkedChildren="Pusat"
                        unCheckedChildren="Lapangan"
                    />
                </Form.Item>
            )}

            {!data.is_pusat && (
                <Form.Item
                    label="Kabupaten/Kota Penugasan"
                    required
                    validateStatus={errors.kab_kota_codes ? 'error' : ''}
                    help={errors.kab_kota_codes || 'Data yang tampil dan dapat diinput dibatasi pada kabupaten/kota ini.'}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Pilih kabupaten/kota"
                        value={data.kab_kota_codes ?? []}
                        onChange={(values) => setData('kab_kota_codes', values)}
                        options={kabKotaOptions}
                        size="large"
                    />
                </Form.Item>
            )}

            <Divider orientation="left" plain>Hak Akses Menu</Divider>

            <Form.Item
                validateStatus={errors.permission_keys ? 'error' : ''}
                help={errors.permission_keys || 'Centang menu dan aksi yang boleh diakses user ini.'}
            >
                <div className="space-y-4">
                    {permissionGroups.map((group) => {
                        const groupKeys = group.permissions.map((item) => item.key);
                        const selected = data.permission_keys ?? [];
                        const allChecked = groupKeys.length > 0 && groupKeys.every((key) => selected.includes(key));
                        const indeterminate = groupKeys.some((key) => selected.includes(key)) && !allChecked;

                        return (
                            <div key={group.group} className="rounded-lg border border-gray-200 p-4">
                                <Checkbox
                                    indeterminate={indeterminate}
                                    checked={allChecked}
                                    onChange={(e) => toggleGroup(group.permissions, e.target.checked)}
                                >
                                    <Text strong>{group.group}</Text>
                                </Checkbox>
                                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {group.permissions.map((permission) => (
                                        <Checkbox
                                            key={permission.key}
                                            checked={(data.permission_keys ?? []).includes(permission.key)}
                                            onChange={(e) => togglePermission(permission.key, e.target.checked)}
                                        >
                                            {permission.label}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Form.Item>
        </>
    );
}
