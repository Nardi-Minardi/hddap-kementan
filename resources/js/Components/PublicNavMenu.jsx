import { useEffect, useRef, useState } from 'react';
import { isPublicNavGroupActive, isPublicNavItemActive, publicNavItems } from '@/config/publicNav';

function ChevronDownIcon({ className = '' }) {
    return (
        <svg className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function useNavStyles({ variant = 'default', scrolled = false, activeSection = null }) {
    const desktopLinkClass = (item, isGroup = false) => {
        const active = isGroup ? isPublicNavGroupActive(item) : isPublicNavItemActive(item, activeSection);

        if (variant === 'welcome') {
            if (scrolled) {
                return active
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-600 hover:border-green-300 hover:text-green-600';
            }

            return active
                ? 'border-green-400 text-white'
                : 'border-transparent text-white/80 hover:border-green-300 hover:text-green-400';
        }

        return active
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-gray-600 hover:border-green-300 hover:text-green-600';
    };

    const mobileLinkClass = (item, isChild = false) => {
        const active = isPublicNavItemActive(item, activeSection);

        if (isChild) {
            return active
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700';
        }

        return active
            ? 'border-green-600 bg-green-50 text-green-700'
            : 'border-transparent text-gray-700 hover:bg-green-50 hover:text-green-700';
    };

    return { desktopLinkClass, mobileLinkClass };
}

export function PublicNavDesktop({
    items = publicNavItems,
    variant = 'default',
    scrolled = false,
    activeSection = null,
}) {
    const [openGroup, setOpenGroup] = useState(null);
    const closeTimerRef = useRef(null);
    const { desktopLinkClass } = useNavStyles({ variant, scrolled, activeSection });

    const openDropdown = (label) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        setOpenGroup(label);
    };

    const scheduleClose = () => {
        closeTimerRef.current = setTimeout(() => {
            setOpenGroup(null);
        }, 200);
    };

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            if (!event.target.closest('[data-public-nav-dropdown]')) {
                setOpenGroup(null);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    return items.map((item) => {
        if (item.children) {
            const isOpen = openGroup === item.label;

            return (
                <div
                    key={item.label}
                    data-public-nav-dropdown
                    className="relative"
                    onMouseEnter={() => openDropdown(item.label)}
                    onMouseLeave={scheduleClose}
                >
                    <button
                        type="button"
                        className={`inline-flex h-10 items-center gap-1 border-b-2 text-base font-medium transition ${desktopLinkClass(item, true)}`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    >
                        {item.label}
                        <ChevronDownIcon className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>

                    <div
                        className={`absolute left-0 top-full z-50 pt-2 transition ${
                            isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="min-w-[220px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                            {item.children.map((child) => (
                                <a
                                    key={child.label}
                                    href={child.href}
                                    className={`block px-4 py-2.5 text-sm font-medium transition ${
                                        isPublicNavItemActive(child)
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                    }`}
                                >
                                    {child.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <a
                key={item.label}
                href={item.href}
                className={`inline-flex h-10 items-center border-b-2 text-base font-medium transition ${desktopLinkClass(item)}`}
            >
                {item.label}
            </a>
        );
    });
}

export function PublicNavMobile({
    items = publicNavItems,
    activeSection = null,
    onNavigate = () => {},
}) {
    const [openGroup, setOpenGroup] = useState(null);
    const { mobileLinkClass } = useNavStyles({ activeSection });

    return items.map((item) => {
        if (item.children) {
            const expanded = openGroup === item.label;

            return (
                <div key={item.label} className="mb-1">
                    <button
                        type="button"
                        onClick={() => setOpenGroup(expanded ? null : item.label)}
                        className={`flex w-full items-center justify-between rounded-lg border-b-2 px-3 py-3 text-base font-medium transition ${mobileLinkClass(item)}`}
                    >
                        <span>{item.label}</span>
                        <ChevronDownIcon className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>

                    {expanded && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-green-100 pl-3">
                            {item.children.map((child) => (
                                <a
                                    key={child.label}
                                    href={child.href}
                                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${mobileLinkClass(child, true)}`}
                                    onClick={onNavigate}
                                >
                                    {child.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <a
                key={item.label}
                href={item.href}
                className={`block rounded-lg border-b-2 px-3 py-3 text-base font-medium transition ${mobileLinkClass(item)}`}
                onClick={onNavigate}
            >
                {item.label}
            </a>
        );
    });
}
