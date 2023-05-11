#!/usr/bin/env node

const devLink = require('./index.js');

(async function () {
    try {
        let help = [];
        help.push('This tool sets up links of local files being developed using pnpm --global and pnpm --global <package>');
        help.push('When run WITHOUT register argument, it looks for devLinks in current directory package.json and links them from global link store to current directory node_modules');
        help.push('When run WITH the register argument, it loads current pacakge into global link store');
        help.push('It always process package.json of in directory where command called:');
        help.push('npx @aevans04/dev-link <cmd>');
        help.push('cmd =');
        help.push('link: link packages in packag.json devLinks from global link store to current directory node_modules');
        help.push('register: register the package in the directory in the global link store to be consumed as a linked local dependency');

        let args = require('minimist')(process.argv.slice(2));
//        let cmd = "link";
        let cmd = "register";
        if (args._.length>0) cmd = args._[0];

        await devLink.run({cmd});

    } catch (ex) {
        console.error('error running cmd:');
        console.error(ex);
    }

    process.exit();
})();

