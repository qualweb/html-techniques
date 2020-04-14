const path = require('path')

module.exports = {
  entry: './dist/index.js',
  node: {
    net: true
  },
  output: {
    filename: 'html.js',
    path: path.resolve(__dirname, 'distWebPack'),
    libraryTarget: 'var',
    library: 'HTMLTechniques'
  },
  target: 'node-webkit',
}
