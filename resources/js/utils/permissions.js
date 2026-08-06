import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props;

    const can = (permissionKey) => !!auth?.can?.[permissionKey];

    return {
        can,
        isPusat: !!auth?.isPusat,
        menuKeys: auth?.menuKeys ?? [],
    };
}
