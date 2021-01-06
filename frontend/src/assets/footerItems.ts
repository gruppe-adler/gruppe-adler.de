export interface FooterItem {
    name: string;
    url: string;
    image: string;
}

const footerItems: FooterItem[] = [
    {
        name: 'Discord',
        image: 'discord',
        url: 'https://discord.gg/ZDqp45q'
    },
    {
        name: 'YouTube',
        image: 'youtube',
        url: 'https://www.youtube.com/user/gruppeadler'
    },
    {
        name: 'Twitter',
        image: 'twitter',
        url: 'https://twitter.com/gruppe_adler'
    },
    {
        name: 'GitHub',
        image: 'github',
        url: 'https://github.com/gruppe-adler'
    },
    {
        name: 'Steam',
        image: 'steam',
        url: 'https://steamcommunity.com/groups/gruppe-adler'
    },
    {
        name: 'Spreadshirt',
        image: 'spreadshirt',
        url: 'https://shop.spreadshirt.de/gruppe-adler'
    }
];

export default footerItems;
