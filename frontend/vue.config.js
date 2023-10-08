// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
    pwa: {
        themeColor: '#F0EEEC',
        name: 'Gruppe Adler'
    },
    configureWebpack: {
        plugins: [
            new WebpackAssetsManifest({
                output: 'assets-manifest.json'
            })
        ]
    }
};
