#!/usr/bin/env node

import { createRequire } from "module";
//console.log(import.meta.url);
//const require = createRequire(import.meta.url);
import minimist from 'minimist';
import fs from 'fs';

//import test from './shared/test.mjs';
import * as test from './shared/test.js';
console.log(test);
import {hi} from './shared/test.mjs';
//let {default:{hi}} = test;

console.log(hi('aaron'));
(async function () {
    let test2 = await import('./shared/test.mjs');
    console.log(test2);

    let help = [];
    help.push('This tool sets up links of local files being developed using pnpm --global and pnpm --global <package>');
    help.push('When run WITHOUT register argument, it looks for devLinks in current directory package.json and links them from global link store to current directory node_modules');
    help.push('When run WITH the register argument, it loads current pacakge into global link store');
    help.push('It always process package.json of in directory where command called:');
    help.push('npx @aevans04/dev-link <cmd>');
    help.push('cmd =');
    help.push('link: link packages in packag.json devLinks from global link store to current directory node_modules');
    help.push('register: register the package in the directory in the global link store to be consumed as a linked local dependency');

    let availableCmds = {"link":true,"register":true};


    //let args = require('minimist')(process.argv.slice(2));
    let args = minimist(process.argv.slice(2));

    let cmd = "link";
    if (args._.length>0) cmd = args._[0];
    console.log("cmd = " + cmd);
    if (!availableCmds[cmd]) {
        console.error(cmd + ' is not a valid cmd');
        process.exit();
    }

    console.log(process.cwd() + '/package.json');

    let packageJSON = await fs.promises.readFile(process.cwd() + '/package.json','utf-8');
    let packageInfo = JSON.parse(packageJSON);
    //let packageInfo = require(process.cwd() + '/package.json');

    console.log(packageInfo);
    console.log("package name = " + packageInfo.name);
    console.log("package version = " + packageInfo.version);
    process.exit();

})();

//Note: this command shows where global links are stored so we can check if the exist
// pnpm root -g
//To unlink everything in a package directory
//But if say original version 1.0.0 when you did the original link it will change the version in pacakge.json to that version in the linked package
// Then when you do unlink it reinstall from remote npm and will install the new version that package.json was changed to
// This can cause a problem if the version in the pacakge being developed isn't released to npm yet and when that version tries to get installed an error occurs
//I think it is kind of buggy actually that you need to do pnpm unlink * because supposed to just be pnpm unlink
//Also you can pretty much add anything after unlink instead of * and it does same thing
// pnpm unlink *