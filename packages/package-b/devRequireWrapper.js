//This is a file you can copy into projects/packages to wrap around dev-require to make using dev-require.require easier
//This way you don't have to do all the boiler plate in every file you can just require this
//Best way to get config file into dev-require is to set env var called devRequireConfigPath

//can probably use npm link for this for just comment and uncomment because can't use dev-require for dev-require!
//if hard coding like this might have to update the path of local dev-require below
let devRequireFactory = require('../dev-require');
//    let devRequireFactory = require('@aevans04/dev-require');

let devRequire = devRequireFactory();

function devRequireWrapper(packageName) {
    //this if we want to just require remote from npm in here instead of inside dev-require
    let packageInstance = devRequire.require(packageName,{settingName:'alt'}) || require(packageName);

    return packageInstance
}


module.exports = devRequireWrapper;