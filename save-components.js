var mysql = require('mysql');
var db = require('./configs/dbConnect');
const fs = require('fs');
var htmlParser = require('node-html-parser');
const folder = '/Users/romio/Downloads/dashforge/components';
var rs = [];
var files = fs.readdirSync(folder);

var regex = /<footer class="content-footer">(.|\n)*?<\/footer>/ig;
Promise.all(files.map(file => {
    return new Promise((resolve, reject) => {
        var name = file.replace('.html', '');
        if(name.startsWith('el-')){
            var pathFile = [folder, file].join('/');
            var html = fs.readFileSync(pathFile, 'utf8');
            const root = htmlParser.parse(html);
            var contentHtml = root.querySelector('.content-components');
            contentHtml = contentHtml.toString().replace(regex, '');
            rs.push({ name:name.replace('el-',''), html : contentHtml});
        }
        resolve('ok');
    });
}))
    .then(
        results => {
            sql(rs);
        }
    );




function sql(data) {
    if (data.length > 0) {

        // // console.log(data);
        let records = data.map(item => [item.name, item.html]);
        var con = mysql.createConnection({
            host: db.host,
            user: db.user,
            password: db.password,
            database: db.database,
            port: db.port,
            insecureAuth: true
        });
        con.connect();

        console.log("Connected to Mysql");

        var sql = "INSERT INTO components (name, html) VALUES ?";

        var query = con.query(sql, [records], function (err, result) {
            console.log(result);
        });

        con.end();
    }
   
}
