const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
        extraNodeModules: {
            'react-native': require.resolve('react-native'),
        },
        resolveRequest: (context, moduleName, platform) => {
            if (
                moduleName.startsWith('react-native/Libraries/DeprecatedPropTypes/DeprecatedViewPropTypes')
            ) {
                return {
                    filePath: require.resolve('deprecated-react-native-prop-types'),
                    type: 'sourceFile',
                };
            }
            return context.resolveRequest(context, moduleName, platform);
        },
    },
};

module.exports = mergeConfig(defaultConfig, config);
