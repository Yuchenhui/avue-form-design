const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'packages'),
        '@components': path.resolve(__dirname, 'packages/components'),
        '@utils': path.resolve(__dirname, 'packages/utils'),
        '@mixins': path.resolve(__dirname, 'packages/mixins')
      }
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
      },
      'element-ui': 'ELEMENT'
    }
  }
}
