const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'html', 'json'];

module.exports = {
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