
var config = require('./data');
var ncp = require('ncp').ncp;

ncp.limit = 16;

var dir = __dirname;
var listarFolder = config.urlSoure;
var folders = config.folderCopy;
folders.forEach(function (e) {
    var source = [listarFolder, e].join('/');
    var destination = [dir, 'publish', e].join('/');
    ncp(source, destination, function (err) {
        if (err) {
            return console.error(err);
        }
    });
})
console.log('---------------------------- Publish libs successfully ----------------------------')