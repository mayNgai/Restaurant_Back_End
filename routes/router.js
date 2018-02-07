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

router.get('/api/file', function (req, res) {
    res.render('uploadImages')
})

const upload = multer({
    dest: 'uploads/'
})

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

router.post('/api/file', function (req, res) {
    console.log('OK')
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)
        }
    }).single('image');
    upload(req, res, function (err) {
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

    res.writeHead(200, { 'Content-Type': mime })
    res.end(image, 'binary')
})

/************INSERT */

router.post('/new_company', function (req, res, next) {
    var t = req.body
    if (!t.company_name) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getCompany(t, function (err, result) {
        if (result.length) {
            res.send({ "success": "0", "message": "Duplicate Company name." });
        } else {
            my_helper.addCompany(t, function (err, result) {
                if (result) {
                    my_helper.getCompany(sql, function (err, result) {
                        if (result.length) {
                            result[0].success = '1'
                            result[0].message = 'success'
                            res.send(result[0]);
                        }else{
                            res.send({ "success": "0", "message": "fail." });
                        }
                    })
                } else {
                    res.send({ "success": "0", "message": "fail." });
                }
            })
        }
    })
});

router.post('/register_member', function (req, res, next) {
    var t = req.body
    if (!t.user_name || !t.password || !t.tel || !t.email) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getMemberByEmail(t, function (err, result) {
        if (result.length) {
            res.send({ "success": 0, "message": "Duplicate member." })
        } else {
            my_helper.addMember(t, function (err, result) {
                if (result) {
                    my_helper.getMemberByUsername(t, function (err, result) {
                        if (result.length) {
                            result[0].success = 1
                            result[0].message = "Register success."
                            res.send(result[0]);
                        } else {
                            res.send({ "success": 0, "message": "error." });
                        }
                    })
                } else {
                    res.send({ "success": 0, "message": "Register fail." });
                }
            })
        }
    })
});

router.post('/product_type', function (req, res, next) {
    var t = req.body
    if (!t.product_type_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getProductTypeName(t, function (err, result) {
        if (result.length) {
            res.send({ "success": 0, "message": "Duplicate ProductType name." });
        } else {
            my_helper.addProductType(t, function (err, result) {
                if (result) {
                    my_helper.getProductTypeName(t, function (err, result) {
                        if (result.length) {
                            result[0].success = 1
                            result[0].message = 'create success.'
                            res.send(result[0]);
                        } else {
                            res.send({ "success": 0, "message": "error." });
                        }
                    })
                } else {
                    res.send({ "success": 0, "message": "error." });
                }
            })
        }
    })
});

router.post('/product', function (req, res, next) {
    var t = req.body
    if (!t.product_name || !t.company_id || !t.product_type_id || !t.price) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getProductByName(t, function (err, result) {
        if (result.length) {
            res.send({ "success": 0, "message": "Duplicate Product name." });
        } else {
            my_helper.addProduct(t, function (err, result) {
                if (result) {
                    my_helper.getProductByName(t, function (err, result) {
                        if (result.length) {
                            result[0].success = 1
                            result[0].message = 'create success.'
                            res.send(result[0]);
                        } else {
                            res.send({ "success": 0, "message": "error." });
                        }
                    })
                } else {
                    res.send({ "success": 0, "message": "fail." });
                }
            })
        }
    })
});

router.post('/discount', function (req, res, next) {
    var t = req.body
    if (!t.discount_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getDiscountByName(t, function (err, result) {
        if (result.length) {
            res.send({ "success": 0, "message": "Duplicate name." });
        } else {
            my_helper.addDiscount(t, function (err, result) {
                if (result) {
                    my_helper.getDiscountByName(t, function (err, result) {
                        if (result.length) {
                            result[0].success = 1
                            result[0].message = 'create success.'
                            res.send(result[0]);
                        } else {
                            res.send({ "success": 0, "message": "error." });
                        }
                    })
                } else {
                    res.send({ "success": 0, "message": "error." });
                }
            })
        }
    })

});

router.post("/tables", function (req, res, next) {
    var t = req.body
    if (!t.table_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteTables(t, function (err, result) {
        if (result) {
            for (let i = 0; i < t.length; ++i) {
                my_helper.addTable(t[i], function (err, result) {
                    if (i === t.length - 1) {
                        my_helper.getTables(t[0], function (err, result) {
                            if (result.length) {
                                res.send(result);
                            } else {
                                res.send([]);
                            }
                        })
                    }
                })
            }
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })
});

/*************UPDATE */
router.post('/update_company', function (req, res, next) {
    var t = req.body
    if (!t.company_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.updateCompany(t, function (err, result) {
        if (result) {
            my_helper.getCompany(t, function (err, result) {
                if (result.length) {
                    result[0].success = 1
                    result[0].message = 'success'
                    res.send(result[0]);
                } else {
                    res.send({ "success": 0, "message": "Update fail." });
                }
            })
        } else {
            res.send({ "success": 0, "message": "Update fail." });
        }
    });
});

router.post('/update_member', function (req, res, next) {
    var t = req.body
    if (!t.member_id || !t.user_name || !t.password || !t.email || !t.first_name || !t.last_name || !t.tel || !t.member_type || !t.authority) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.updateMember(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Update success." });
        } else {
            res.send({ "success": 0, "message": "Update fail." });
        }
    });
});

router.post('/update_product_type', function (req, res, next) {
    var t = req.body
    if (!t.product_type_name || !t.product_type_id || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.updateProductType(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "edit success." });
        } else {
            res.send({ "success": 0, "message": "edit fail." });
        }
    });
});

router.post('/update_product', function (req, res, next) {
    var t = req.body
    if (!t.product_id || !t.product_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.updateProduct(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "edit success." });
        } else {
            res.send({ "success": 0, "message": "edit fail." });
        }
    });

});

router.post('/update_discount', function (req, res, next) {
    var t = req.body
    if (!t.discount_id || !t.discount_name || !t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.updateDiscount(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "edit success." });
        } else {
            res.send({ "success": 0, "message": "edit fail." });
        }
    });
});


/************DELETE */
router.post("/delete_member", function (req, res, next) {
    var t = req.body
    if (!t.member_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteMember(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Delete success." });
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })

});

router.post("/delete_company", function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteCompany(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Delete success." });
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })
});

router.post("/delete_product_type", function (req, res, next) {
    var t = req.body
    if (!t.company_id || !t.product_type_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteProductType(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Delete success." });
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })
});

router.post("/delete_product", function (req, res, next) {
    var t = req.body
    if (!t.company_id || !t.product_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteProduct(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Delete success." });
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })

});

router.post("/delete_discount", function (req, res, next) {
    var t = req.body
    if (!t.company_id || !t.discount_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.deleteDiscount(t, function (err, result) {
        if (result) {
            res.send({ "success": 1, "message": "Delete success." });
        } else {
            res.send({ "success": 0, "message": "Delete fail." });
        }
    })

});

router.post("/delete_table", function (req, res, next) {
    var t = req.body
    if (!t.company_id || !t.table_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    } else {
        let sqlQuery = "DELETE FROM tables WHERE company_id = '" + t.company_id + "' and table_id = '" + t.table_id + "'";
        my_helper.callAPI(sqlQuery, function (err, result) {
            if (result) {
                res.send({ "success": 1, "message": "Delete success." });
            } else {
                res.send({ "success": 0, "message": "Delete fail." });
            }
        })
    }
});

/***********SELECE */

router.post('/get_login', function (req, res, next) {
    var t = req.body
    if (!t.user_name || !t.password || !t.authen) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getMemberByUsername(t, function (err, result) {
        if (result.length) {
            result[0].success = 1
            result[0].message = 'login success.'
            res.send(result[0]);
        } else {
            res.send({ "success": 0, "message": "Login fail." });
        }
    });
});

router.post('/get_data_login', function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getProducts(t, function (err, res_product) {
        if (!res_product.length) {
            res_product = []
        }
        my_helper.getProductTypes(t, function (err, res_product_type) {
            if (!res_product_type.length) {
                res_product_type = []
            }
            my_helper.getStores(function (err, res_store) {
                if (!res_store.length) {
                    res_store = []
                }
                my_helper.getDiscounts(t, function (err, res_discount) {
                    if (!res_discount.length) {
                        res_discount = []
                    }
                    my_helper.getTables(t, function (err, res_tables) {
                        if (!res_tables.length) {
                            res_tables = []
                        }
                        res.send({ "success": 1, "message": "OK", "products": res_product, "productTypes": res_product_type, "stores": res_store, "discounts": res_discount, "tables": res_tables });
                    })
                })
            })
        })
    })
});


router.post('/get_product', function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getProducts(t, function (err, result) {
        if (result.length) {
            res.send(result);
        } else {
            res.send([]);
        }
    })

});

router.post('/get_product_type', function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getProductTypes(t, function (err, result) {
        if (result.length) {
            res.send(result);
        } else {
            res.send([]);
        }
    })

});

router.post('/get_store', function (req, res, next) {
    my_helper.getStores(function (err, result) {
        if (result.length) {
            res.send(result);
        } else {
            res.send([]);
        }
    })

});

router.post('/get_discount', function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getDiscounts(t, function (err, result) {
        if (result.length) {
            res.send(result);
        } else {
            res.send([]);
        }
    })
});

router.post('/get_tables', function (req, res, next) {
    var t = req.body
    if (!t.company_id) {
        return res.send({ "success": 0, "message": "missing a parameter" });
    }
    my_helper.getTables(t, function (err, result) {
        if (result.length) {
            res.send(result);
        } else {
            res.send([]);
        }
    })

});

router.post("/test", function (req, res, next) {
    var t = req.body
    let sqlQuery = "SELECT * FROM authen";
    my_helper.callAPI(sqlQuery, function (err, result) {
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