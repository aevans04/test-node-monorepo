const merge = require('merge');

let devRequireFactory = function (args={}) {
    let self = merge.recursive(true, args);

    self.configPath = process.env.devRequireConfigPath;

    if (self.configPath) {
        try {
            self.config = require(self.configPath);
        } catch (ex) {
        }

    }

    self.require = function (packageName,options={}) {
        //if no config is set up via env var then just return null
        if (!self.config) return null;

        let defaultConfig = merge(true,self.config);
        delete defaultConfig.alternates;

        let alternateConfig;
        if (options.alternateName) {
            alternateConfig = self.config && self.config.alternates && self.config.alternates[options.alternateName];
            if (!alternateConfig) throw new Error(`The alternate config = ${options.alternateName} does not exist`)
        }

        let currentConfig;
        if (alternateConfig) {
            if (alternateConfig.merge) {
                currentConfig = merge(defaultConfig,alternateConfig);
            } else {
                currentConfig = alternateConfig;
            }
        } else {
            currentConfig = defaultConfig;
        }
        let packageConfig = currentConfig && currentConfig.packages && currentConfig.packages[packageName];
		//use local version if config set up to do so
		let packageInstance;
 		if (packageConfig && packageConfig.disabled!==true) {
            packageInstance = require(packageConfig.path);
		} else {
 		    //return null if using remote package from npm and let caller handle it
            packageInstance = null;
//            packageInstance = require(self.appRoot + '/node_modules/' + packageName);
		}
		return packageInstance;
	};

    return self;
};

module.exports = devRequireFactory;