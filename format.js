
var pretty = require('pretty');
var fs = require('fs');


function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            fs.readFile(dirname + filename, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}

readFiles('resources/', function (filename, content) {
    var html = pretty(content, { ocd: true });
    fs.writeFile(`resources/${filename}`, html, 'utf8', function (err) {
        if (err) reject(`cant format and write html`);
    })

}, function (err) {
    throw err;
});

console.log('---------------------------- Format html successfully ----------------------------')