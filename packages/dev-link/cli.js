#!/usr/bin/env node

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

let args = require('minimist')(process.argv.slice(2));
let cmd = "link";
if (args._.length>0) cmd = args._[0];
console.log("cmd = " + cmd);
if (!availableCmds[cmd]) {
    console.error(cmd + ' is not a valid cmd');
    process.exit();
}

console.log(process.cwd() + '/package.json');

let packageInfo = require(process.cwd() + '/package.json');

console.log(packageInfo);
console.log("package name = " + packageInfo.name);
console.log("package version = " + packageInfo.version);

//Note: this command shows where global links are stored so we can check if the exist
// pnpm root -g