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
                        res.json({count: count, docLicenses: docLicenses});
                    }
                })
                .skip((page - 1) * pageLength)
                .limit(pageLength)
                .sort(optionSort);
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
        db.License.create(license)
            .then(docLicense => {
                res.json({
                    _id: docLicense._id
                })
            });
    } catch (ex) {
        res.status(400);
        return res.json({
            error: ex.message
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
            if (!err) {
                res.json(updateLicense);
            } else {
                res.json(err.message);
            }
        });
    } catch (ex) {
        res.status(400);
        res.json({
            error: ex.message
        });
    }
})

router.delete('/license/:id', verifyToken, function (req, res) {
    db.License.findByIdAndRemove(req.params.id, (err, docLicense) => {
        if (err) {
            res.json({
                error: err.message
            });
        } else {
            res.json(docLicense);
        }
    })
})

//#endregion

//#region "Authoriztion"

router.post('/login', (req, res) => {
    let userData = req.body;
    if (!userData || !userData.email) {
        res.json({
            error: 'User information is empty!!!'
        });
        return;
    }
    const errmessage = "The Username or Password is incorrect!"
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
                    token: token
                });
            }
        });
})

//#endregion

router.get('/license', function (req, res) {
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