var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');
var router = express.Router();
var my_helper = require('../models/mySQL_helper');
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')


router.get('/', function (req, res) {
    res.end("Node-File-Upload");

});

router.get('/register', function (req, res) {
    res.render('index');
});

router.get('/api/file', function(req, res) {
	res.render('uploadImages')
})

const upload = multer({
    dest:'uploads/'
})

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname)
	}
})

router.post('/api/file', function(req, res) {
    console.log('OK')
	var upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname)
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return callback(res.end('Only images are allowed'), null)
			}
			callback(null, true)
		}
	}).single('image');
	upload(req, res, function(err) {
        if (err) {
            console.log('Error')
            res.json({ 'response': "Error" });
        } else {
            console.log('File is uploaded')
            res.json({ 'response': "File is uploaded" });
        }
		
	})
})

router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
})

// router.post('/upload', function (req, res) {
//     console.log(req.files.image.originalFilename);
//     console.log(req.files.image.path);
//     fs.readFile(req.files.image.path, function (err, data) {
//         var dirname = "C:\\Image_node\\ImgUpLoad\\";
//         var newPath = dirname + "\\uploads\\" + req.files.image.originalFilename;
//         fs.writeFile(newPath, data, function (err) {
//             if (err) {
//                 res.json({ 'response': "Error" });
//             } else {
//                 res.json({ 'response': "Saved" });
//             }
//         });
//     });
// });


// router.get('/uploads/:file', function (req, res) {
//     file = req.params.file;
//     var dirname = "C:\\Image_node\\ImgUpLoad\\";
//     var img = fs.readFileSync(dirname + "\\uploads\\" + file);
//     res.writeHead(200, { 'Content-Type': 'image/jpg' });
//     res.end(img, 'binary');

// });

/************INSERT */

router.post('/new_company',function(req,res,next){
    try {
        var t = req.body
        if(!t.company_name) {
            return res.send({"success": 0, "message": "missing a parameter"});
        } else {
            let sql = "SELECT * FROM company WHERE company_name = '" + t.company_name + "'";
            my_helper.callAPI(sql,function(err,result) {
                if (result.length) {
                    res.send({"success": "0", "message": "Duplicate Company name."});
                } else {
                    sql = "INSERT INTO company (company_name,date_create,last_date,status,status_id) VALUES ('" + t.company_name + "', NOW(),NOW(),'wait active','0')";
                    my_helper.callAPI(sql,function(err,result) {
                        if (result) {
                            sql = "SELECT * FROM company WHERE company_name = '" + t.company_name + "'";
                            my_helper.callAPI(sql,function(err,result) {
                                if (result.length) {
                                    result[0].success = '1'
                                    result[0].message = 'success'
                                    res.send(result[0]);
                                }
                            })
                        } else {
                            res.send({"success": "0", "message": "fail."});
                        }
                    })
                }
            })
        }
    }catch(err) {
        res.send({"success": 0, "message": err.message})
    }
});

router.post('/register_member',function(req,res,next){
    try {
        var t = req.body
        if(!t.user_name || !t.password || !t.tel) {
            return res.send({"success": "0", "message": "missing a parameter"});
        } else {
            let sql = "SELECT * FROM member WHERE email = '" + t.email + "' and user_name = '" + t.user_name + "'";
            my_helper.callAPI(sql,function(err,result) {
                if (result.length) {
                    res.send({"success": "0", "message": "Duplicate member."})
                } else {
                    sql = "INSERT INTO member (first_name,last_name,date_create,last_date,tel,user_name,password,email,authen,company_id) VALUES ('" + t.first_name + "' , '" + t.last_name + "' ,NOW(), NOW(),'" + t.tel + "','" + t.user_name + "','" + t.password + "','" + t.email + "','" + t.authen + "','" + t.company_id + "')";
                    my_helper.callAPI(sql,function(err,result) {
                        if (result) {
                            sql = "SELECT * FROM member WHERE user_name = '" + t.user_name + "' AND authen = '" + t.authen + "' AND password = '" + t.password + "'";
                            my_helper.callAPI(sql,function(err,result) {
                                if (result.length) {
                                    result[0].success = "1"
                                    result[0].message = "Register success."
                                    res.send(result[0]);
                                } 
                            })
                        } else {
                            res.send({"success": "0", "message": "Register fail."});
                        }
                    })
                }
            })
        }
    }catch(err) {
        res.send({"success": 0, "message": err.message})
    }
});

router.post('/product_type',function(req,res,next){
    try {
        var t = req.body
        if(!t.product_type_name) {
            return res.send({"success": 0, "message": "missing a parameter"});
        } else {
            let sql = "SELECT * FROM product_type WHERE company_id = '" + t.company_id + "' and product_type_name = '" + t.product_type_name + "'";
            my_helper.callAPI(sql,function(err,result) {
                if (result.length) {
                    res.send({"success": "0", "message": "fail."});
                } else {
                    sql = "INSERT INTO product_type (product_type_name,date_create,last_date,status,status_id,company_id) VALUES ('" + t.product_type_name + "', NOW(),NOW(),'online','1','" + t.company_id + "')";
                    my_helper.callAPI(sql,function(err,result) {
                        if (result) {
                            sql = "SELECT * FROM product_type WHERE company_id = '" + t.company_id + "' and product_type_name = '" + t.product_type_name + "'";
                            my_helper.callAPI(sql,function(err,result) {
                                if (result.length) {
                                    result[0].success = '1'
                                    result[0].message = 'create success.'
                                    res.send(result[0]);
                                }else{
                                    res.send({"success": "0", "message": "error."});
                                }
                            })
                        } else {
                            res.send({"success": "0", "message": "error."});
                        }
                    })
                }
            })
        }
    }catch(err) {
        res.send({"success": 0, "message": err.message})
    }
});

router.post('/product',function(req,res,next){
    try {
        var t = req.body
        if(!t.product_name) {
            return res.send({"success": 0, "message": "missing a parameter"});
        } else {
            let sql = "SELECT * FROM product WHERE company_id = '" + t.company_id + "' and product_type_id = '" + t.product_type_id + "' and product_name = '" + t.product_name + "'";
            my_helper.callAPI(sql,function(err,result) {
                if (result.length) {
                    res.send({"success": "0", "message": "fail."});
                } else {
                    sql = "INSERT INTO product (product_type_id,date_create,last_date,status,status_id,company_id,price,product_name) VALUES ('" + t.product_type_id + "', NOW(),NOW(),'online','1','" + t.company_id + "','" + t.price + "','" + t.product_name + "')";
                    my_helper.callAPI(sql,function(err,result) {
                        if (result) {
                            sql = "SELECT * FROM product WHERE company_id = '" + t.company_id + "' and product_name = '" + t.product_name + "'";
                            my_helper.callAPI(sql,function(err,result) {
                                if (result.length) {
                                    result[0].success = '1'
                                    result[0].message = 'create success.'
                                    res.send(result[0]);
                                }else{
                                    res.send({"success": "0", "message": "error."});
                                }
                            })
                        } else {
                            res.send({"success": "0", "message": "fail."});
                        }
                    })
                }
            })
        }
    }catch(err) {
        res.send({"success": 0, "message": err.message})
    }
});

router.post('/discount',function(req,res,next){
    try {
        var t = req.body
        if(!t.discount_name) {
            return res.send({"success": 0, "message": "missing a parameter"});
        } else {
            let sql = "SELECT * FROM discount WHERE company_id = '" + t.company_id + "' and discount_name = '" + t.discount_name + "'";
            my_helper.callAPI(sql,function(err,result) {
                if (result.length) {
                    res.send({"success": "0", "message": "fail."});
                } else {
                    sql = "INSERT INTO discount (discount_name,date_create,last_date,percent,company_id) VALUES ('" + t.discount_name + "', NOW(),NOW(),'" + t.percent + "','" + t.company_id + "')";
                    my_helper.callAPI(sql,function(err,result) {
                        if (result) {
                            sql = "SELECT * FROM discount WHERE company_id = '" + t.company_id + "' and discount_name = '" + t.discount_name + "'";
                            my_helper.callAPI(sql,function(err,result) {
                                if (result.length) {
                                    result[0].success = '1'
                                    result[0].message = 'create success.'
                                    res.send(result[0]);
                                }else{
                                    res.send({"success": "0", "message": "error."});
                                }
                            })
                        } else {
                            res.send({"success": "0", "message": "error."});
                        }
                    })
                }
            })
        }
    }catch(err) {
        res.send({"success": 0, "message": err.message})
    }
});

router.post("/tables", function(req,res,next){
    var t = req.body
    let sqlQuery = ''
    sqlQuery = "DELETE FROM tables WHERE company_id = '" + t[0].company_id + "'";
    my_helper.callAPI(sqlQuery, function(err,result) {
        for (let i = 0; i < t.length; ++i) {
            sqlQuery = "INSERT INTO tables (table_name,date_create,last_date,status,status_id,company_id) VALUES ('" + t[i].table_name + "', NOW(),NOW(),'online','1','" + t[i].company_id + "')";
            my_helper.callAPI(sqlQuery, function(err,result)  {
                if(i === t.length-1){
                    sqlQuery = "SELECT * FROM tables WHERE company_id = '" + t[0].company_id + "' ORDER BY table_name";
                    my_helper.callAPI(sqlQuery, function(err,result)  {
                        if(result.length){
                            res.send(result);
                        }else{
                            res.send([]);
                        }
                    })
                }
            })
        }
    })
});

/*************UPDATE */
router.post('/update_company', function(req,res,next){
    var t = req.body
    if(!t.company_name ||!t.company_id){
        return res.send({"success": 0, "message": "missing a parameter"});
    }else{
        let sqlQuery = "UPDATE company SET company_name = '" + t.company_name + "' , last_date = NOW() WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sqlQuery,function(err,result) {
            if (result) {
                sql = "SELECT * FROM company WHERE company_name = '" + t.company_name + "'";
                my_helper.callAPI(sql,function(err,result) {
                    if (result.length) {
                        result[0].success = '1'
                        result[0].message = 'success'
                        res.send(result[0]);
                    }
                })
            } else {
                res.send({"success": "0", "message": "Update fail."});
            }
        });
    }

});

router.post('/update_authority', function(req,res,next){
    var t = req.body
    if(!t.member_id || !t.user_name || !t.password || !t.email || !t.first_name || !t.last_name || !t.tel || !t.member_type || !t.authority){
        return res.send({"success": 0, "message": "missing a parameter"});
    }else{
        let sqlQuery = "UPDATE MEMBER SET user_name = '" + t.user_name + "' , password = '" + t.password + "' , email = '" + t.email + "' , first_name = '" + t.first_name + "' , last_name= '" + t.last_name + "', tel = '" + t.tel + "', member_type = '" + t.member_type + "', date_member_last_edit = GETDATE(), authority = '" + t.authority + "' WHERE member_id = '" + t.member_id + "'";
        my_helper.callAPI(sqlQuery,function(err,result) {
            if (result) {
                res.send({"success": "true", "message": "Update success."});
            } else {
                res.send({"success": "false", "message": "Update fail."});
            }
        });
    }

});

router.post('/update_product_type',function(req,res,next){
    var t = req.body
    if(!t.product_type_name || !t.product_type_id || !t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "UPDATE product_type SET product_type_name = '" + t.product_type_name + "' WHERE product_type_id = '" + t.product_type_id + "' AND company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result) {
                res.send({"success": 1 , "message": "edit success."});
            }else{
                res.send({"success": 0 , "message": "edit fail."});
            } 
        });
    }
});

router.post('/update_product',function(req,res,next){
    var t = req.body
    if(!t.product_id || !t.product_name || !t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "UPDATE product SET product_type_id = '" + t.product_type_id + "' , price = '" + t.price + "' , product_name = '" + t.product_name + "' WHERE product_id = '" + t.product_id + "' AND company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result) {
                res.send({"success": 1 , "message": "edit success."});
            }else{
                res.send({"success": 0 , "message": "edit fail."});
            } 
        });
    }
});

router.post('/update_discount',function(req,res,next){
    var t = req.body
    if(!t.discount_id || !t.discount_name || !t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "UPDATE discount SET discount_name = '" + t.discount_name + "' , percent = '" + t.percent + "' WHERE discount_id = '" + t.discount_id + "' AND company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result) {
                res.send({"success": 1 , "message": "edit success."});
            }else{
                res.send({"success": 0 , "message": "edit fail."});
            } 
        });
    }
});


/************DELETE */
router.post("/delete_authority", function(req,res,next){
    var t = req.body
    if(!t.member_id){
        return res.send({"success": 0, "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM MEMBER WHERE member_id = '" + t.member_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "true", "message": "Delete success."});
            } else {
                res.send({"success": "false", "message": "Delete fail."});
            }
        })
    }
});

router.post("/delete_company", function(req,res,next){
    var t = req.body
    if(!t.company_id){
        return res.send({"success": 0, "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM company WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "1", "message": "Delete success."});
            } else {
                res.send({"success": "0", "message": "Delete fail."});
            }
        })
    }
});

router.post("/delete_product_type", function(req,res,next){
    var t = req.body
    if(!t.company_id || !t.product_type_id){
        return res.send({"success": "0", "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM product_type WHERE company_id = '" + t.company_id + "' and product_type_id = '" + t.product_type_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "1", "message": "Delete success."});
            } else {
                res.send({"success": "0", "message": "Delete fail."});
            }
        })
    }
});

router.post("/delete_product", function(req,res,next){
    var t = req.body
    if(!t.company_id || !t.product_id){
        return res.send({"success": "0", "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM product WHERE company_id = '" + t.company_id + "' and product_id = '" + t.product_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "1", "message": "Delete success."});
            } else {
                res.send({"success": "0", "message": "Delete fail."});
            }
        })
    }
});

router.post("/delete_discount", function(req,res,next){
    var t = req.body
    if(!t.company_id || !t.discount_id){
        return res.send({"success": "0", "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM discount WHERE company_id = '" + t.company_id + "' and discount_id = '" + t.discount_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "1", "message": "Delete success."});
            } else {
                res.send({"success": "0", "message": "Delete fail."});
            }
        })
    }
});

router.post("/delete_table", function(req,res,next){
    var t = req.body
    if(!t.company_id || !t.table_id){
        return res.send({"success": "0", "message": "missing a parameter"});
    }else{
        let sqlQuery = "DELETE FROM tables WHERE company_id = '" + t.company_id + "' and table_id = '" + t.table_id + "'";
        my_helper.callAPI(sqlQuery, function(err,result) {
            if (result) {
                res.send({"success": "1", "message": "Delete success."});
            } else {
                res.send({"success": "0", "message": "Delete fail."});
            }
        })
    }
});

/***********SELECE */

router.post('/get_login',function(req,res,next){
    var t = req.body
    let sql = "SELECT * FROM member WHERE user_name = '" + t.user_name + "' AND password = '" + t.password + "' AND authen = '" + t.authen + "'";
    my_helper.callAPI(sql,function(err,result){
        if(err){
            res.send(err);
        }else{
            if (result.length) {
                result[0].success = 1
                result[0].message = 'login success.'
                res.send(result[0]);
            }else{
                res.send({"success": 0, "message": "Login fail."});
            }
            
        }
    });
});

router.post('/get_data_login',function(req,res,next){
    var t = req.body
    let sql = ''
    if(!t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        sql = "SELECT * FROM product WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,res_product) {
            if (!res_product.length) {
                res_product = []
            }
            sql = "SELECT * FROM product_type WHERE company_id = '" + t.company_id + "'";
            my_helper.callAPI(sql,function(err,res_product_type) {
                if (!res_product_type.length) {
                    res_product_type = []
                }
                sql = "SELECT * FROM store ";
                my_helper.callAPI(sql,function(err,res_store) {
                    if (!res_store.length) {
                        res_store = []
                    }
                    sql = "SELECT * FROM discount WHERE company_id = '" + t.company_id + "'";
                    my_helper.callAPI(sql,function(err,res_discount) {
                        if (!res_discount.length) {
                            res_discount = []
                        }
                        sql = "SELECT * FROM tables WHERE company_id = '" + t.company_id + "' ORDER BY table_name";
                        my_helper.callAPI(sql,function(err,res_tables) {
                            if (!res_tables.length) {
                                res_tables = []
                            }
                            res.send({"success": 1, "message": "OK","products":res_product,"productTypes":res_product_type,"stores":res_store,"discounts":res_discount,"tables":res_tables});
                        })
                    })
                })
            })
        })
    }
});


router.post('/get_product',function(req,res,next){
    var t = req.body
    if(!t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "SELECT * FROM product WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result.length) {
                res.send(result);
            }else{
                res.send([]);
            }
        })
    }
});

router.post('/get_product_type',function(req,res,next){
    var t = req.body
    if(!t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "SELECT * FROM product_type WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result.length) {
                res.send(result);
            }else{
                res.send([]);
            }
        })
    }
});

router.post('/get_store',function(req,res,next){
    var t = req.body
    let sql = "SELECT * FROM store ";
    my_helper.callAPI(sql,function(err,result) {
        if (result.length) {
            res.send(result);
        }else{
            res.send([]);
        }
    })
    
});

router.post('/get_discount',function(req,res,next){
    var t = req.body
    if(!t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "SELECT * FROM discount WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result.length) {
                res.send(result);
            }else{
                res.send([]);
            }
        })
    }
});

router.post('/get_tables',function(req,res,next){
    var t = req.body
    if(!t.company_id) {
        return res.send({"success": 0, "message": "missing a parameter"});
    } else {
        let sql = "SELECT * FROM tables WHERE company_id = '" + t.company_id + "'";
        my_helper.callAPI(sql,function(err,result) {
            if (result.length) {
                res.send(result);
            }else{
                res.send([]);
            }
        })
    }
});

router.post("/test", function(req,res,next){
    var t = req.body
    let sqlQuery = "SELECT * FROM authen";
    my_helper.callAPI(sqlQuery, function(err,result)  {
        if (result.length) {
            res.send(result)
        } else {
            res.send([])
        }
    })
});

router.post('/send-email', function (req, res) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'devmobile54@gmail.com',
            pass: '54devmobile'
        }
    });
    let mailOptions = {
        from: '"Dev" <devmobile54@gmail.com>', // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body, // plain text body
        html: '<b>NodeJS Email Tutorial</b><br/><a href="http://192.168.1.36:3000/register" target="_top">Chenge Password</a>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('index');
        });
    });

module.exports = router;