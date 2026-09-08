export const publicNavItems = [
    { label: 'Beranda', href: '/#beranda', sectionId: 'beranda' },
    { label: 'Fitur', href: '/#fitur', sectionId: 'fitur' },
    { label: 'Berita', href: '/#berita', sectionId: 'berita' },
    { label: 'Logframe', href: '/logframe', routeName: 'logframe' },
    {
        label: 'Dashboard',
        children: [
            { label: 'Sebaran CPCL', href: '/sebaran-cpcl', routeName: 'sebaran-cpcl' },
            { label: 'Statistik', href: '/statistik', routeName: 'statistik' },
        ],
    },
    { label: 'Dokumen', href: '/dokumen-kegiatan', routeName: 'dokumen-kegiatan' },
    { label: 'Tentang', href: '/#tentang', sectionId: 'tentang' },
];

export function isPublicNavItemActive(item, activeSection = null) {
    if (item.routeName && typeof route === 'function') {
        return route().current(item.routeName);
    }

    if (item.sectionId && activeSection) {
        return activeSection === item.sectionId;
    }

    return false;
}

export const welcomeNavItems = publicNavItems.map((item) => ({
    ...item,
    href: item.sectionId ? `#${item.sectionId}` : item.href,
}));

export function isPublicNavGroupActive(item) {
    if (!item.children) {
        return isPublicNavItemActive(item);
    }

    return item.children.some((child) => isPublicNavItemActive(child));
}
