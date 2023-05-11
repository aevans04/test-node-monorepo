/*
let package_a = require('./packages/package-a');
let package_b = require('./packages/package-b');
let package_c = require('./packages/package-c');
 */

let package_a = require('@aevans04/test-node-monorepo-a');
let package_b = require('@aevans04/test-node-monorepo-b');
let package_c = require('@aevans04/test-node-monorepo-c');

console.log('package a');
console.log(package_a.hello());
console.log('package b');
console.log(package_b.greet());
console.log('package c');
console.log(package_c.greet());
console.log(package_c.bid_adieu());

(async function() {
    try {
        let devLink = require('@aevans04/dev-link');
        console.log(devLink);
        await devLink.run({cmd:"link"});
    } catch (ex) {
        console.error(ex);
    }

})();
