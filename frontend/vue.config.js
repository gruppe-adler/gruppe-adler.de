module.exports = {
    pwa: {
        themeColor: '#000000',
        name: 'Gruppe Adler'
    },
    chainWebpack: config => {
        config.plugin('prefetch').tap(options => {
            options[0].fileBlacklist = options[0].fileBlacklist || [];
            options[0].fileBlacklist.push(/\/admin/)
            return options
        });
    }
}