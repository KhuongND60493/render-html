var mysql = require('mysql');
var db = require('./configs/dbConnect');
const fs = require('fs');
sql();
function sql() {
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

    var sql = "SELECT * FROM components";
    con.query(sql, function (err, results) {
        if (err) throw err;
        write(results);
    })

    con.end();
}
function write(data) {

    var promises = data.map(element => {
        return new Promise((resolve, reject) => {
            if(element.name!=null){
                // console.log('"'+element.name+'"=>"'+element.name+'.html",');
                fs.writeFile(["components",element.name+'.html'].join('/'),
                ["<?php include_once '../includes/component-header.php'?>",
                 element.html,
                "<?php include_once '../includes/component-footer.php'?>"].join("\r\n"), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                }); 
                

                resolve('OK');
            }
         
        });
    });
    Promise.all(promises)
        .then(
            results => {
                console.log('render component successfully');
            }
        );


}