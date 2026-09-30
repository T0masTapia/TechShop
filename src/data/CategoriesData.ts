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
                    
                    { name: 'Sillas Gamer', slug: 'silla-gamer-profesional' }, 
                    { name: 'Alfombras Gamer', slug: 'alfombras-gamer' },
                    { name: 'Escritorios Gamer', slug: 'escritorios-gamer' }
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
                    { name: 'Microfono Streaming', slug: 'microfonos-streaming' },
                    { name: 'Iluminacion', slug: 'iluminacion' },
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
                title: 'Mouses Y Teclados Gamer',
                items: [
                    { name: 'Mouse Gamer', slug: 'mouse-gamer' },
                    { name: 'Teclado Gamer', slug: 'teclado-gamer' },
                    { name: 'Mousepad Gamer', slug: 'mousepad-gamer' },
                    {name: 'Combos Mouse/Teclado', slug: 'mouse-teclado'}
                ]
            }
        ]
    },
    {
        name: 'Componentes',
        hoverColor: 'hover:text-purple-400',
        section: []
    }
]