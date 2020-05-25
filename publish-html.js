var fs = require('fs');


var fs = require('fs');
var dir = './publish/template';
var dir2 = './publish/components';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

if (!fs.existsSync(dir2)){
    fs.mkdirSync(dir2);
}


function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        onFileContent(filenames);
    });
}
function copyFile(source, target, cb) {
    var cbCalled = false;
    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}
readFiles('resources/', function (listFiles) {
    if (listFiles.length > 0)
        listFiles.forEach(function (file) {
            var splitString = file.split("_");
            if (splitString.length > 0) {
                var fileName = file.replace(`${splitString[0]}_`, '');
                copyFile(`resources/${file}`, `publish/${splitString[0]}/${fileName}`, (err) => {

                })

            }
        })

}, function (err) {
    throw err;
});
console.log('---------------------------- Publish html successfully ----------------------------')