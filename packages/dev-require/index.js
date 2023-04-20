const merge = require('merge');

let devRequireFactory = function (args={}) {
    let self = merge.recursive(true, args);

    self.configPath = process.env.devRequireConfigPath;
    if (!self.configPath) throw new Error('configPath is required. Set env var called devRequireConfigPath.');
    self.config = require(self.configPath);

    if (!self.config) throw new Error('config is required');

    self.require = function (packageName,options={}) {
        if (!options.settingName) options.settingName = 'main';
		//use local version if config set up to do so
		let packageInstance;

		let settingConfig = self.config && self.config.settings[options.settingName];
		let packageConfig = settingConfig && settingConfig.packages && settingConfig.packages[packageName];
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