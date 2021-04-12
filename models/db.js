const mysql = require('mysql');
const dbConfig = require('../config/db.config.js'); // gets DB credentials
const connection = mysql.createConnection({
host: dbConfig.HOST,
user: dbConfig.USER,
password: dbConfig.PASSWORD,
database: dbConfig.DB
});
connection.connect(function (err) {
if (err) throw err;
console.log(`Database ${dbConfig.DB} @ ${dbConfig.HOST} is connected successfully !`);
});
module.exports = connection;