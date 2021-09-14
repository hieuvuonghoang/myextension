const mongoose = require('mongoose');

const licenseShcema = new mongoose.Schema({
    phone: String,
    email: String,
    uuid: String,
    licensekey: String,
    fromdate: String,
    todate: String,
    isactive: String,
    createdate: String,
})

const License = mongoose.model('License', licenseShcema);

module.exports = License;