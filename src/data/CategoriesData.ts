export interface MenuItem {
    name: string;
    slug: string; 
}

export interface SubSection {
    title: string;
    items: MenuItem[]; 
}

export interface MegaCategory {
    name: string;
    section: SubSection[];
    hoverColor: string;
}

export const categories: MegaCategory[] = [
    {
        name: 'Gaming y Streaming',
        hoverColor: 'hover:text-purple-400',
        section: [
            {
                title: 'Sillas y Escritorios',
                items: [
                    { name: 'Sillas Gamer', slug: 'silla-gamer' }, 
                    { name: 'Escritorios Gamer', slug: 'escritorio-gamer' }
                ]
            },
            {
                title: 'PC y Notebook Gamer',
                items: [
                    { name: 'PC Gamer', slug: 'pc-gamer' },
                    { name: 'Notebook Gamer', slug: 'notebook-gamer' },
                    { name: 'Outlet SP Labs', slug: 'outlet-sp-labs' }
                ]
            },
            {
                title: 'Streaming',
                items: [
                    { name: 'WebCam', slug: 'webcam' },
                    { name: 'Micrófono Streaming', slug: 'microfonos-streaming' },
                    { name: 'Iluminación', slug: 'iluminacion' },
                    { name: 'Accesorios Streaming', slug: 'accesorios-streaming' }
                ]
            },
            {
                title: 'Consolas y Controles',
                items: [
                    { name: 'Consolas y Accesorios', slug: 'consolas-accesorios' },
                    { name: 'Realidad Virtual', slug: 'realidad-virtual' }
                ]
            },
        ]
    },
    {
        name: 'Periféricos',
        hoverColor: 'hover:text-cyan-400',
        section: [
            {
                title: 'Mouses y Teclados',
                items: [
                    { name: 'Mouse Gamer', slug: 'mouse-gamer' },
                    { name: 'Teclado Gamer', slug: 'teclado-gamer' },
                    { name: 'Mousepad Gamer', slug: 'mousepad-gamer' },
                    { name: 'Combos Mouse/Teclado', slug: 'mouse-teclado' },
                    { name: 'Switches y Keycaps', slug: 'switches-keycaps' }
                ]
            },
            {
                title: 'Audio Gamer',
                items: [
                    { name: 'Audífonos Gamer', slug: 'audifono-gamer' },
                    { name: 'Audífonos In-Ear', slug: 'audifonos-in-ear' },
                    { name: 'Parlantes y Soundbars', slug: 'parlantes' },
                    { name: 'Soportes de Audífonos', slug: 'soportes-audifonos' }
                ]
            },
            {
                title: 'Monitores y Pantallas',
                items: [
                    { name: 'Monitores Gamer', slug: 'monitores-gamer' },
                    { name: 'Monitores 144Hz a 240Hz+', slug: 'monitores-alta-tasa' },
                    { name: 'Brazos y Soportes Monitor', slug: 'soportes-monitor' }
                ]
            },
            {
                title: 'Conectividad y Redes',
                items: [
                    { name: 'Adaptadores Wi-Fi y Bluetooth', slug: 'adaptadores-red' },
                    { name: 'Routers Gamer', slug: 'routers-gamer' },
                    { name: 'Cables HDMI y DisplayPort', slug: 'cables-video' }
                ]
            }
        ]
    },
    {
        name: 'Componentes',
        hoverColor: 'hover:text-emerald-400',
        section: [
            {
                title: 'Procesamiento y Gráficos',
                items: [
                    { name: 'Tarjetas de Video (GPU)', slug: 'tarjetas-de-video' },
                    { name: 'Procesadores (CPU)', slug: 'procesadores' },
                    { name: 'Placas Madre (Motherboards)', slug: 'placas-madre' }
                ]
            },
            {
                title: 'Memoria y Almacenamiento',
                items: [
                    { name: 'Memorias RAM DDR4 / DDR5', slug: 'memorias-ram' },
                    { name: 'Unidades SSD M.2 NVMe', slug: 'ssd-m2' },
                    { name: 'Discos Duros (HDD)', slug: 'discos-duros' }
                ]
            },
            {
                title: 'Energía y Gabinetes',
                items: [
                    { name: 'Fuentes de Poder (PSU)', slug: 'fuentes-de-poder' },
                    { name: 'Gabinetes Gamer', slug: 'gabinetes' },
                    { name: 'Cables y Extensiones Modulares', slug: 'cables-fuente' }
                ]
            },
            {
                title: 'Refrigeración',
                items: [
                    { name: 'Refrigeración Líquida (AIO)', slug: 'refrigeracion-liquida' },
                    { name: 'Coolers por Aire (CPU)', slug: 'coolers-cpu' },
                    { name: 'Ventiladores de Gabinete', slug: 'ventiladores' },
                    { name: 'Pastas Térmicas', slug: 'pastas-termicas' }
                ]
            }
        ]
    }
];