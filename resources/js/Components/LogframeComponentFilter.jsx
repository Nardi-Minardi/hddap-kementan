import { router } from '@inertiajs/react';
import { Button, Space, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const COMPONENT_OPTIONS = [
    { label: 'Component 1', value: '1' },
    { label: 'Component 2', value: '2' },
    { label: 'Component 3', value: '3' },
    { label: 'Component 4', value: '4' },
];

export default function LogframeComponentFilter({ filters = {}, routeName }) {
    const applyFilter = (component) => {
        const params = { page: 1 };

        if (filters.search) {
            params.search = filters.search;
        }

        if (filters.tahap) {
            params.tahap = filters.tahap;
        }

        if (component) {
            params.component = component;
        }

        router.get(route(routeName), params, { preserveState: true, replace: true });
    };

    const isActive = (value) => String(filters.component ?? '') === value;
    const isGeneralView = routeName === 'logframe' && !filters.component;

    return (
        <Space wrap className="mb-4">
            {COMPONENT_OPTIONS.map((option) => (
                <Button
                    key={option.value}
                    type={isActive(option.value) ? 'primary' : 'default'}
                    className={isActive(option.value) ? '!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600' : ''}
                    onClick={() => applyFilter(option.value)}
                >
                    {option.label}
                </Button>
            ))}
            <Tooltip title={routeName === 'logframe' ? 'Indikator umum (Component -)' : 'Reset filter'}>
                <Button
                    icon={<ReloadOutlined />}
                    type={isGeneralView ? 'primary' : 'default'}
                    className={isGeneralView ? '!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600' : ''}
                    onClick={() => applyFilter(null)}
                    aria-label={routeName === 'logframe' ? 'Indikator umum' : 'Reset filter'}
                />
            </Tooltip>
        </Space>
    );
}
