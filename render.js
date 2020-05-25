var config = require('./data');
var http = require('http');
var path = require('path');
var fs = require('fs');

function Fail(reason) { this.reason = reason; };
const isFail = x => (x && x.constructor) === Fail;
const entry = config.folder;
var re = new RegExp(config.special_char.join('|'), 'g');
var dir = './publish';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


if (!fs.existsSync(entry)) {
    fs.mkdirSync(entry);
    render_html();
} else {
    var list = fs.readdirSync(entry);
    Promise.all(list.map(element => {
        return new Promise((resolve, reject) => {
            var filename = path.join(entry, element);
            var stat = fs.statSync(filename);

            if (filename == "." || filename == "..") {
            } else if (stat.isDirectory()) {
                rmdir(filename);
            } else {
                fs.unlinkSync(filename);
            }
            resolve('ok');
        });
    }))
        .then(
            results => {
                render_html();
            }
        );
}
function render_html() {
    if (config.pages.length > 0) {
        var promises = config.pages.map(element => {
            return new Promise((resolve, reject) => {
                const url = [config.host, element].join('/');
                const name = element.replace(re, '_');
                var dest = [entry, name].join('/');
                const file = fs.createWriteStream(dest);
                const request = http.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        resolve(url);
                    });
                }).on('error', function (err) {
                    fs.unlink(dest);
                    reject(`cant render for ${url}`)
                });
            });
        });
        Promise.all(promises)
            .then(
                results => {
                    const failed = results.filter(isFail);
                    if (failed.length !== 0) {
                        console.log("Some url(s) failed:");
                        console.log(failed.map(([err, url]) => url));
                        console.log("Errors:");
                        console.log(failed.map(([err, url]) => err));
                    } else {
                        console.log('---------------------------- Render html successfully ----------------------------')
                    }
                }
            );
    }
}



