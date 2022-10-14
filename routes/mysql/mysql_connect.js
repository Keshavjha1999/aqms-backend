const mysql = require('mysql2');

exports.pool = mysql.createPool({
    host: '172.17.0.1',
    user: 'root',
    password: 'toor',
    port: '4800',
    database: 'internal_dashboard'
});