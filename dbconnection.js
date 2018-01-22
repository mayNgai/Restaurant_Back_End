var mysql=require('mysql');
var connection=mysql.createPool({

    server: 'localhost',
    database: 'restaurant',
    user: 'root',
    password: ''

});
module.exports=connection;