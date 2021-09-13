const express = require('express');
const router = express.Router();

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