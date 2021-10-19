var zillow = require("./zillow.js");

var mysql = require('mysql2/promise');

// data database connect
let con = mysql.createPool({
    host: 'localhost',
    user: 'programmerext',
    password: '$mChEP1295',
    database: '3invest_data_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function scraperStart(){
    await zillow.zillowStart(con);
}
scraperStart();