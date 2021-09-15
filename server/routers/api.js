const {
    json
} = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mongoose = require('mongoose')
const connectString = "mongodb://hieuvh:hieu2111@localhost:27017/licensemanager"

const db = require('../models');

mongoose.connect(connectString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connect to MongoDB'))
    .catch(err => console.error('Connection error', err));

//#region Token

const SECRET_KEY = "mySecretKey";

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401)
        res.json({
            error: 'Authorization is empty'
        })
        return;
    }
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) {
            res.status(401);
            res.json({
                error: 'Unauthorized request'
            })
            return;
        } else {
            req.userId = decode.subject
            next()
        }
    });
}

function getUserIDFromReq(req) {
    let userId = "";
    if (!req.headers.authorization) {
        return userId;
    }
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (!err) {
            userId = decode.subject;
        }
    });
    return userId;
}

//#endregion

//#region License

router.get('/license', verifyToken, function (req, res) {
    try {
        let page = req.query.page ? parseInt(req.query.page, 10) : 1;
        if (!page) {
            page = 1;
        }
        let pageLength = req.query.pageLength ? parseInt(req.query.pageLength, 10) : 10;
        if (!pageLength) {
            pageLength = 10;
        }
        let field = req.query.field;
        if (!field) {
            field = '';
        }
        let sort = req.query.sort ? parseInt(req.query.sort, 10) : 1;
        if (!sort) {
            sort = 1;
        }
        let optionSort = {};
        if (field !== '') {
            optionSort[field] = sort;
        }
        db.License.countDocuments({}, function (err, count) {
            db.License
                .find({}, function (err, docLicenses) {
                    if (err) {
                        res.json({
                            error: err.message
                        });
                    } else {
                        res.json({
                            count: count,
                            docLicenses: docLicenses
                        });
                    }
                })
                .skip((page - 1) * pageLength)
                .limit(pageLength)
                .sort(optionSort)
                .select('phone uuid licensekey isactive');
        })
    } catch (ex) {
        res.json({
            error: ex.message
        });
    }
})

router.get('/license/:id', verifyToken, function (req, res) {
    db.License.findById(req.params.id, (err, docLicense) => {
        if (err) {
            res.json({
                error: err.message
            });
        } else {
            res.json(docLicense);
        }
    })

})

router.put('/license/isactive/:id', verifyToken, function (req, res) {
    try {
        db.License.findByIdAndUpdate(req.params.id, {
            $set: {
                isactive: req.body.isactive
            }
        }, {
            "fields": {
                "phone": 1,
                "uuid": 1,
                "licensekey": 1,
                "isactive": 1
            },
            "new": true
        }, function (err, updateLicense) {
            if (err) {
                res.json({
                    error: err.message,
                    mes: '',
                });
            } else {
                let mes = "";
                if (updateLicense.isactive === "true") {
                    mes = "Kích hoạt License thành công!";
                } else {
                    mes = "Hủy kích hoạt License thành công!";
                }
                res.json({
                    error: '',
                    mes: mes,
                    license: updateLicense,
                });
            }
        })
    } catch (ex) {
        res.json({
            error: ex.message,
            mes: '',
        });
    }
})

router.post('/license', verifyToken, function (req, res) {
    try {
        let license = {
            phone: req.body.phone,
            email: req.body.email,
            uuid: req.body.uuid,
            licensekey: req.body.licensekey,
            fromdate: req.body.fromdate,
            todate: req.body.todate,
            isactive: req.body.isactive,
            createdate: new Date().toISOString()
        }
        db.License.create(license, function(err, docLicense) {
            if(err) {
                res.json({
                    error: err,
                    mes: ''
                })
            } else {
                res.json({
                    error: '',
                    mes: 'Thêm mới thông tin license thành công!',
                    license: docLicense
                })
            }
        });
    } catch (ex) {
        return res.json({
            error: ex.message,
            mes: '',
        });
    }
})

router.put('/license/:id', verifyToken, function (req, res) {
    try {
        db.License.findByIdAndUpdate(req.params.id, {
            $set: {
                phone: req.body.phone,
                email: req.body.email,
                uuid: req.body.uuid,
                licensekey: req.body.licensekey,
                fromdate: req.body.fromdate,
                todate: req.body.todate,
                isactive: req.body.isactive,
            }
        }, {
            new: true
        }, (err, updateLicense) => {
            if (err) {
                res.json({
                    error: err.message,
                    mes: ''
                });
            } else {
                res.json({
                    error: '',
                    mes: 'Cập nhật thông tin license thành công!',
                    license: updateLicense,
                });
            }
        });
    } catch (ex) {
        res.json({
            error: ex.message,
            mes: '',
        });
    }
})

router.delete('/license/:id', verifyToken, function (req, res) {
    db.License.findByIdAndRemove(req.params.id, (err, docLicense) => {
        if (err) {
            res.json({
                error: err.message,
                mes: '',
            });
        } else {
            res.json({
                error: '',
                mes: 'Xóa license thành công!',
                license: docLicense,
            });
        }
    })
})

//#endregion

//#region "Authoriztion"

router.post('/login', (req, res) => {
    let userData = req.body;
    if (!userData || !userData.email) {
        res.json({
            error: 'Không được bỏ trống thông tin người dùng!'
        });
        return;
    }
    const errmessage = "Thông tin tài khoản hoặc mật khẩu không chính xác!"
    db.User.findOne({
            email: userData.email
        },
        (err, user) => {
            if (err) {
                res.json({
                    error: errmessage
                });
                return;
            }
            if (!user) {
                res.json({
                    error: errmessage
                });
                return;
            }
            if (user.password !== userData.pass) {
                res.json({
                    error: errmessage
                })
            } else {
                let payload = {
                    subject: user._id
                };
                let token = jwt.sign(payload, SECRET_KEY);
                res.json({
                    error: '',
                    token: token
                });
            }
        });
})

//#endregion

router.get('/check-license', function (req, res) {
    let mac = req.query.mac;
    let key = req.query.key;
    console.log(mac);
    console.log(key);
    //0: Không tồn tại license
    //1: Còn hiệu lực
    //2: Hết hiệu lực
    //3: License không chính chủ
    res.send('#1');
})

module.exports = router