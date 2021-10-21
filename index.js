var zillow = require("./zillow.js");

var mysql = require('mysql2/promise');

// data database connect
let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function scraperStart(){
    await zillow.zillowStart(con);
}
scraperStart();