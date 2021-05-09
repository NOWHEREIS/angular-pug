const {AngularWebpackPlugin} = require('@ngtools/webpack/src/ivy/plugin');
const {SourceMapDevToolPlugin} = require('webpack');

module.exports = (config) => {
  // add rule to convert pug into html files
  config.module.rules.push({
    test: /\.pug$/,
    use: [
      {loader: 'apply-loader'},
      {loader: 'pug-loader'},
    ],
  })

  const indexForAngularWebpackPlugin = config.plugins?.findIndex((plugin) => {
    return plugin instanceof AngularWebpackPlugin;
  });

  if (indexForAngularWebpackPlugin > -1) {
    const oldOptions = config.plugins?.[indexForAngularWebpackPlugin].pluginOptions;
    oldOptions.directTemplateLoading = false;
    config.plugins?.splice(indexForAngularWebpackPlugin);
    config.plugins?.push(new AngularWebpackPlugin(oldOptions));
  }
  // if you start tests, you have to add config for plugin Source Map Dev Tool
  if (config.entry?.main?.includes('test')) {
    const indexForSourceMapDevToolPlugin = config.plugins?.findIndex(plugin => {
      return plugin instanceof SourceMapDevToolPlugin;
    })

    //config to add source map on tests
    const configPluginSourceMapDevToolPlugin = {
      filename: "[file].map",
      include: [
        /js$/, /css$/
      ],
      sourceRoot: "webpack:///",
      moduleFilenameTemplate: "[resource-path]"
    }

    if (indexForSourceMapDevToolPlugin > -1) {
      config.plugins?.splice(indexForSourceMapDevToolPlugin);
    } else {
      config.plugins?.push(new SourceMapDevToolPlugin(configPluginSourceMapDevToolPlugin));
    }

  }

  return config;
}
