let availableCmds = {"link":true,"register":true};

async function run({cmd}={}) {
//cache pnpm root here for this run. we don't need to keep getting it
    let pnpmRoot;

    console.log("cmd = " + cmd);
    if (!availableCmds[cmd]) {
        throw cmd + ' is not a valid cmd';
    }

    let packageFile = process.cwd() + '/package.json';

    console.log(`Running dev-link for cmd = ${cmd} and package file =`);
    console.log(packageFile);

    let packageInfo = require(packageFile);

//        console.log(packageInfo);
//        console.log("package name = " + packageInfo.name);
//        console.log("package version = " + packageInfo.version);

    const utilities = require('./shared/utilities');

    //Now check for .dev-link file
    let configFile = process.cwd() + '/.dev-link';
    let config;
    try {
        config = require(configFile);
    }catch(ex) {
//            console.error(ex);
    }

    if (config) {
        if (cmd==="link") {
            await linkDependencies();
        } else if (cmd==="register") {
            await registerDependency();
        }
    } else {
        console.log('.dev-link config file not found.')
    }

    async function registerDependency() {
        try {
            let out = await utilities.execExternalCommand({cmd:'pnpm link --global',dir:process.cwd()});
            if (out.stdout && out.stdout!=='\n') {
//                        console.log('stdout:');
                console.log(out.stdout);
            }
            if (out.stderr) {
//                        console.log('stderr:');
                console.log(out.stderr);
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    async function linkDependencies() {
        let includeLinks = [];
        let excludeLinks = [];
        let unRegisteredLinks = [];

        let exclude = config.exclude ? true : false;
        let devLinks = config.devLinks || {};
        let dependencies = config.exclude ? packageInfo.dependencies : devLinks;
        for (let dependencyName of Object.keys(dependencies) ) {
            let depConfig = devLinks[dependencyName];
            let depConfigEnabled = depConfig && !depConfig.disabled ? true : false;
            //if excluding true then depConfigEnabled false means we include link
            //if excluding false then depConfigEnabled true means we include link
            if (!depConfigEnabled===exclude) {
                //include after checking if registered
                let success = await linkDependency(dependencyName)
                if (success) {
                    includeLinks.push(dependencyName);
                } else {
                    unRegisteredLinks.push(dependencyName);
                }
            } else {
                //exclude
                excludeLinks.push(dependencyName);
            }
        }

        if (includeLinks.length) {
            console.log('The following packages were linked:');
            for (let packageName of includeLinks) {
                console.log(packageName);
            }
        }

        /* Don't need to show what wasn't installed
         if (excludeLinks.length) {
         console.log('The following packages were excluded from being linked:');
         for (let packageName of excludeLinks) {
         console.log(packageName);
         }
         }
         */

        if (unRegisteredLinks.length) {
            console.log('The following packages do not have local versions registerd in global store:');
            for (let packageName of unRegisteredLinks) {
                console.log(packageName);
            }
        }

    }

    async function linkDependency(packageName) {
        //now check if this dependency is in global link store so we don't try to link remote npm modules
        if (await checkPackageInGlobalLinkStore(packageName)) {
            try {
                let out = await utilities.execExternalCommand({cmd:'pnpm link --global ' + packageName,dir:process.cwd()});
                if (out.stdout && out.stdout!=='\n') {
//                        console.log('stdout:');
                    console.log(out.stdout);
                }
                if (out.stderr) {
//                        console.log('stderr:');
                    console.log(out.stderr);
                }
                return true;
            } catch (ex) {
                console.error(ex);
            }
        }
        return false;
    }
    async function checkPackageInGlobalLinkStore(packageName) {
        let fs = require('fs');
        if (!pnpmRoot) {
            let out = await utilities.execExternalCommand({cmd:'pnpm root -g'});
            pnpmRoot = out.stdout.replace(/\n$/,'');
        }
        try {
            await fs.promises.access(`${pnpmRoot}/${packageName}`);
            return true
        } catch (ex) {
//              console.error(ex);
            return false;
        }
    }
}

module.exports = {run};

//Note: this command shows where global links are stored so we can check if the exist
// pnpm root -g
//To unlink everything in a package directory
//But if say original version 1.0.0 when you did the original link it will change the version in pacakge.json to that version in the linked package
// Then when you do unlink it reinstall from remote npm and will install the new version that package.json was changed to
// This can cause a problem if the version in the pacakge being developed isn't released to npm yet and when that version tries to get installed an error occurs
//I think it is kind of buggy actually that you need to do pnpm unlink * because supposed to just be pnpm unlink
//Also you can pretty much add anything after unlink instead of * and it does same thing
// pnpm unlink *

