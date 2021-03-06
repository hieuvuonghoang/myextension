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
                    mes = "K??ch ho???t License th??nh c??ng!";
                } else {
                    mes = "H???y k??ch ho???t License th??nh c??ng!";
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
                    mes: 'Th??m m???i th??ng tin license th??nh c??ng!',
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
                    mes: 'C???p nh???t th??ng tin license th??nh c??ng!',
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
                mes: 'X??a license th??nh c??ng!',
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
            error: 'Kh??ng ???????c b??? tr???ng th??ng tin ng?????i d??ng!'
        });
        return;
    }
    const errmessage = "Th??ng tin t??i kho???n ho???c m???t kh???u kh??ng ch??nh x??c!"
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
    let uuid = req.query.uuid;
    let key = req.query.key;
    console.log(uuid);
    console.log(key);
    //-3: L???i m??y ch???
    //0: Kh??ng t???n t???i license
    //1: C??n hi???u l???c
    //2: H???t hi???u l???c
    //3: License kh??ng ch??nh ch???
    //4: UUID ch??a ???????c c???p license
    //5: License b??? kh??a
    if(!uuid || !key) {
        res.send('#-3');
        return;
    }
    db.License.findOne({uuid: uuid}, function(err, docLicense) {
        if(err) {
            res.send('#-3');
        } else {
            if(docLicense === null) {
                res.send('#4');
            } else {
                if(docLicense.licensekey !== key) {
                    res.send('#0');
                } else {
                    if(docLicense.isactive !== 'true') {
                        res.send('#5');
                    } else {
                        let toDate = Date.parse(docLicense.todate);
                        let currentDate = Date.parse(new Date());
                        console.log(toDate);
                        console.log(currentDate);
                        if(toDate >= currentDate) {
                            res.send('#1');
                        } else {
                            res.send('#2');
                        }
                    }
                }
            }
        }
    })
})

module.exports = router