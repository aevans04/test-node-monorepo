//import { createRequire } from "module";
//console.log(import.meta.url);
//const require = createRequire(import.meta.url);
//let packageInfo = require('../package.json');
console.log('test ' + process.cwd());

export function hi(x) {
    return 'hi ' + x;
}
export let a = 77;

let test = {
    a:77,
    hi
};

//export default {hi,a}