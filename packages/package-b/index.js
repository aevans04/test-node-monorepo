//let package_a = require('../package-a');
let package_a = require('@aevans04/test-node-monorepo-a');
module.exports = {
	greet: (name='aaron')=> `${package_a.hello()} ${name} from package b`
};