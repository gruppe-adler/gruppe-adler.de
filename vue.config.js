const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'html', 'json'];

module.exports = {
    pwa: {
        name: 'Gruppe Adler',
        themeColor: '#D18D1F',
        msTileColor: '#D18D1F',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'public/service-worker.js',
        }
    },
    configureWebpack: {
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`,'i'),
                threshold: 10240,
                minRatio: 0.9
            })
        ]
    }
}