export interface GradLink {
    text: string;
    url: string;
    sublinks?: GradLink[];
}

const links: GradLink[] = [
    {
        text: 'Home',
        url: '/home'
    },
    {
        text: 'Über uns',
        url: '/ueber-uns',
        sublinks: [
            {
                text: 'Miteinander',
                url: '/miteinander'
            },
            {
                text: 'Struktur',
                url: '/struktur'
            },
            {
                text: 'Historie',
                url: '/historie'
            },
            {
                text: 'Eindrücke',
                url: '/eindruecke'
            }
        ]
    },
    {
        text: 'Technik',
        url: '/technik',
        sublinks: [
            {
                text: 'Server',
                url: '/server'
            },
            {
                text: 'Missionsbau',
                url: '/missionsbau'
            },
            {
                text: 'Modding',
                url: '/modding'
            }
        ]
    },
    {
        text: 'Mitspielen',
        url: '/mitspielen',
        sublinks: [
            {
                text: 'Allgemeines',
                url: '/allgemeines'
            },
            {
                text: 'Checkliste',
                url: '/checkliste'
            }
        ]
    },
    {
        text: 'Konakt',
        url: '/konakt'
    },
    {
        text: 'Forum',
        url: '/forum'
    },
    {
        text: 'Wiki',
        url: '/wiki'
    }
];

export default links;
