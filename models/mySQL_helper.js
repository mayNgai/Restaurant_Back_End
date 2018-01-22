var db = require('../dbconnection');

var my_helper={
    callAPI:function(sql,callback){
        // db.query(sql).then(function(recordset){
        //     if (typeof recordset.recordset === 'undefined') {
        //         callback('oK');
        //         return;
        //     } else{
        //         callback(recordset.recordsets[0]);
        //         return;
        //     }
        //     db.close();
        // }).catch(function (err) {
        //     console.log(err);
        //     db.close();
        // });
        
        return db.query(sql,callback);
    }
    
};

module.exports = my_helper;