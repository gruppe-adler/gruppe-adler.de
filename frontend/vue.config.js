module.exports = {
    pwa: {
        themeColor: '#F0EEEC',
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