const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = [{
  "entry": path.join(__dirname, 'src', 'client', 'client.js'),
  "output": {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  "target": "web",  
  "module": {
    "loaders": [
      { 
        "test": /\.css$/,
        "exclude": /(node_modules|bower_components)/,
        "loader": 'style!css' 
      },
      { 
        "test": /\.json$/,
        "exclude": /(node_modules|bower_components)/,
        "loader": 'json-loader'
      },
      { 
        "test": /\.jsx?$/,
        "resolve": {
          extensions: ['', '.js', '.jsx']
        },
        "exclude": /(node_modules|bower_components)/,
        "loader": 'babel',
        "query": {
          "presets": ['es2015', 'react']
        }
      },
    ]
  }
},
{
  "entry": path.join(__dirname, 'src', 'server', 'server.js'),
  "output": {
    path: __dirname,
    filename: 'index.js'
  },
  "target": 'node',
  "externals": [nodeExternals()],
  "module": {
    "loaders": [
      { 
        "test": /\.json$/,
        "exclude": /(node_modules|bower_components)/,
        "loader": 'json-loader'
      },    
      { 
        "test": /\.js$/,         
        "exclude": /(node_modules|bower_components)/,
        "loader": 'babel-loader',
        "query": {
          "presets": ['es2015', 'react']
        }
      },
    ]
  }
}];
