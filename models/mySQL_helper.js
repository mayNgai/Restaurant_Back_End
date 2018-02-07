var db = require('../dbconnection');

var app={
    callAPI:function(sql,callback){
        return db.query(sql,callback);
    },

    /************INSERT ************/
    addCompany:function(t,callback){
        return db.query("INSERT INTO company (company_name,date_create,last_date,status,status_id) VALUES ('" + t.company_name + "', NOW(),NOW(),'wait active','0')",callback);
    },

    addMember:function(t,callback){
        return db.query("INSERT INTO member (first_name,last_name,date_create,last_date,tel,user_name,password,email,authen,company_id) VALUES ('" + t.first_name + "' , '" + t.last_name + "' ,NOW(), NOW(),'" + t.tel + "','" + t.user_name + "','" + t.password + "','" + t.email + "','" + t.authen + "','" + t.company_id + "')",callback);
    },

    addProductType:function(t,callback){
        return db.query("INSERT INTO product_type (product_type_name,date_create,last_date,status,status_id,company_id) VALUES ('" + t.product_type_name + "', NOW(),NOW(),'online','1','" + t.company_id + "')",callback);
    },

    addProduct:function(t,callback){
        return db.query("INSERT INTO product (product_type_id,date_create,last_date,status,status_id,company_id,price,product_name) VALUES ('" + t.product_type_id + "', NOW(),NOW(),'online','1','" + t.company_id + "','" + t.price + "','" + t.product_name + "')",callback);
    },

    addDiscount:function(t,callback){
        return db.query("INSERT INTO discount (discount_name,date_create,last_date,percent,company_id) VALUES ('" + t.discount_name + "', NOW(),NOW(),'" + t.percent + "','" + t.company_id + "')",callback);
    },

    addTable:function(t,callback){
        return db.query("INSERT INTO tables (table_name,date_create,last_date,status,status_id,company_id) VALUES ('" + t.table_name + "', NOW(),NOW(),'online','1','" + t.company_id + "')",callback);
    },

    /*************UPDATE **************/
    updateCompany:function(t,callback){
        return db.query("UPDATE company SET company_name = '" + t.company_name + "' , last_date = NOW() WHERE company_id = '" + t.company_id + "'",callback);
    },

    updateMember:function(t,callback){
        return db.query("UPDATE MEMBER SET user_name = '" + t.user_name + "' , password = '" + t.password + "' , email = '" + t.email + "' , first_name = '" + t.first_name + "' , last_name= '" + t.last_name + "', tel = '" + t.tel + "', member_type = '" + t.member_type + "', date_member_last_edit = GETDATE(), authority = '" + t.authority + "' WHERE member_id = '" + t.member_id + "'",callback);
    },

    updateProductType:function(t,callback){
        return db.query("UPDATE product_type SET product_type_name = '" + t.product_type_name + "' WHERE product_type_id = '" + t.product_type_id + "' AND company_id = '" + t.company_id + "'",callback);
    },

    updateProduct:function(t,callback){
        return db.query("UPDATE product SET product_type_id = '" + t.product_type_id + "' , price = '" + t.price + "' , product_name = '" + t.product_name + "' WHERE product_id = '" + t.product_id + "' AND company_id = '" + t.company_id + "'",callback);
    },

    updateDiscount:function(t,callback){
        return db.query("UPDATE discount SET discount_name = '" + t.discount_name + "' , percent = '" + t.percent + "' WHERE discount_id = '" + t.discount_id + "' AND company_id = '" + t.company_id + "'",callback);
    },

    /************DELETE **************/
    deleteMember:function(t,callback){
        return db.query("DELETE FROM MEMBER WHERE member_id = '" + t.member_id + "'",callback);
    },

    deleteCompany:function(t,callback){
        return db.query("DELETE FROM company WHERE company_id = '" + t.company_id + "'",callback);
    },

    deleteProductType:function(t,callback){
        return db.query("DELETE FROM product_type WHERE company_id = '" + t.company_id + "' and product_type_id = '" + t.product_type_id + "'",callback);
    },

    deleteProduct:function(t,callback){
        return db.query("DELETE FROM product WHERE company_id = '" + t.company_id + "' and product_id = '" + t.product_id + "'",callback);
    },

    deleteDiscount:function(t,callback){
        return db.query("DELETE FROM discount WHERE company_id = '" + t.company_id + "' and discount_id = '" + t.discount_id + "'",callback);
    },

    deleteTables:function(t,callback){
        return db.query("DELETE FROM tables WHERE company_id = '" + t[0].company_id + "'",callback);
    },
    
    /***********SELECE ****************/
    getCompany:function(t,callback){
        return db.query("SELECT * FROM company WHERE company_name = '" + t.company_name + "'",callback);
    },

    getMemberByEmail:function(t,callback){
        return db.query("SELECT * FROM member WHERE email = '" + t.email + "' and user_name = '" + t.user_name + "'",callback);
    },

    getMemberByUsername:function(t,callback){
        return db.query("SELECT * FROM member WHERE user_name = '" + t.user_name + "' AND password = '" + t.password + "' AND authen = '" + t.authen + "'",callback);
    },

    getProductByName:function(t,callback){
        return db.query("SELECT * FROM product WHERE company_id = '" + t.company_id + "' and product_type_id = '" + t.product_type_id + "' and product_name = '" + t.product_name + "'",callback);
    },

    getProducts:function(t,callback){
        return db.query("SELECT * FROM product WHERE company_id = '" + t.company_id + "'",callback);
    },

    getProductTypeName:function(t,callback){
        return db.query("SELECT * FROM product_type WHERE company_id = '" + t.company_id + "' and product_type_name = '" + t.product_type_name + "'",callback);
    },

    getProductTypes:function(t,callback){
        return db.query("SELECT * FROM product_type WHERE company_id = '" + t.company_id + "'",callback);
    },

    getStores:function(callback){
        return db.query("SELECT * FROM store",callback);
    },

    getDiscountByName:function(t,callback){
        return db.query("SELECT * FROM discount WHERE company_id = '" + t.company_id + "' and discount_name = '" + t.discount_name + "'",callback);
    },

    getDiscounts:function(t,callback){
        return db.query("SELECT * FROM discount WHERE company_id = '" + t.company_id + "'",callback);
    },
    
    getTables:function(t,callback){
        return db.query("SELECT * FROM tables WHERE company_id = '" + t.company_id + "' ORDER BY table_name",callback);
    }
};

module.exports = app;