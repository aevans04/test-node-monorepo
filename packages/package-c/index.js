//Adding change to test multiple commits before release
//Adding change for second commit
//let package_a = require('../package-a');
let package_a = require('@aevans04/test-node-monorepo-a');
module.exports = {
    greet: (name='evans')=> `${package_a.hello()} ${name} from package c`,
    bid_adieu: () => 'see ya later!'
};