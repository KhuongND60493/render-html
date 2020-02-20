var config = require('./data');
var fs = require('fs');
const format = require('html-format');

function Fail(reason) { this.reason = reason; };
const isFail = x => (x && x.constructor) === Fail;

const entry = config.folder;
if (config.pages.length > 0) {
    var promises = config.pages.map(element => {
        return new Promise((resolve, reject) => {
            const file = [__dirname,entry, element].join('/');
            fs.readFile(file, 'utf8', function (err, html) { 
                if (err) {
                    reject(`cant read html`);
                  }
                fs.writeFile(file, format(html, ' '.repeat(4)), 'utf8', function (err) {
                    if (err) reject(`cant format and write html`);
                    resolve(file);
                });
            })
        });
    });
    Promise.all(promises)
        .then(
            results => {
                const failed = results.filter(isFail);
                if (failed.length !== 0) {
                    console.log("Format fail");
                } else {
                    console.log('---------------------------- Format html successfully ----------------------------')
                }
            }
        );

}
