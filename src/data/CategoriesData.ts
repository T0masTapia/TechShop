export interface SubSection {
    title: string,
    items: string[]
}

export interface MegaCategory {
    name: string,
    section: SubSection[],
    hoverColor: string
}


export const categories: MegaCategory[] = [
    {
        name: 'Gaming y Streaming',
        hoverColor: 'hover:text-purple-400',
        section: [
            {
                title: 'Sillas y Escritorios',
                items: ['Silla Gamer', 'Alfombra Gamer', 'Escritorio Gamer']
            },
            {
                title: 'PC y Notebook Gamer',
                items: ['PC Gamer', 'Notebook Gamer', 'Outlet SP Labs']
            },
            {
                title: 'Streaming',
                items: ['WebCam', 'Microfono Streaming', 'Iluminacion', 'Accesorios Streaming']
            },
            {
                title: 'Consolas y Controles',
                items: ['Consolas y Accesorios', 'Realidad Virtual']
            },
        ]
    },
    {
        name: 'Periféricos',
        hoverColor: 'hover:text-cyan-400',
        section: []
    },
    {
        name: 'Componentes',
        hoverColor: 'hover:text-purple-400',
        section: []
    }
]