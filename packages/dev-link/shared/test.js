function hi(x) {
    return 'hi ' + x;
}
let a = 77;

let test = {
    a,
    hi
};

//exports.a = a;
//exports.hi = hi;

module.exports = test;