import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import idID from 'antd/locale/id_ID';

const appName = import.meta.env.VITE_APP_NAME || 'Kementan';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ConfigProvider
                locale={idID}
                theme={{
                    token: {
                        colorPrimary: '#10b981',
                        borderRadius: 8,
                        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                    },
                    components: {
                        Menu: {
                            darkItemBg: 'transparent',
                            darkSubMenuItemBg: 'rgba(0,0,0,0.15)',
                        },
                        Layout: {
                            siderBg: 'transparent',
                        },
                    },
                }}
            >
                <App {...props} />
            </ConfigProvider>,
        );
    },
    progress: {
        color: '#10b981',
    },
});

