let utilities = {};

utilities.Deferred = class Deferred {
    constructor(options) {
        this.status = "pending";
        this.value;
        this.resolve;
        this.reject;
        //Also store the status and value to expose to outside
        this.promise = new Promise((resolve,reject)=>{
            this.resolve = function (result) {
                this.status = "resolved";
                this.value = result;
                resolve(result);
            };
            this.reject = function (error) {
                this.status = "rejected";
                this.value = error;
                reject(error);
            };
        });
    }
};

utilities.execExternalCommand = function execExternalCommand({cmd,dir}) {
    const child_process = require('child_process');
    const pathLib = require('path');
    //pass log if you want to log the results. by default it is true
    let defer = new utilities.Deferred();

    let cmdFull = cmd;
    if (dir) {
        let fullPath = pathLib.isAbsolute(dir) ? dir : appRoot + '\\' + dir;
        cmdFull = 'cd ' + fullPath + ' && ' + cmd;
    }

    console.log(cmdFull)
    child_process.exec(cmdFull, function(ex, stdout, stderr) {
        if (ex) {
            defer.reject({ex,stdout,stderr});
        }

        //send back both stdout and stderr to let consumer decide what to do with them.
        //Don't consider stderr messages to mean we will reject or throw and error that will be caught necessarily
        defer.resolve({stdout,stderr});
    });

    return defer.promise;
};

module.exports = utilities;
