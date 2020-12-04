module.exports = {
    pwa: {
        themeColor: '#000000',
        name: 'Gruppe Adler'
    },
    chainWebpack: config => {
        config.plugin('preload').tap(options => {
            options[0].include = 'all';

            options[0].fileBlacklist = options[0].fileBlacklist || [];
            options[0].fileBlacklist.push(/\/admin/)
            return options
        });
    }
}