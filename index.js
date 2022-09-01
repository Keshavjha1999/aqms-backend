const mysql = require('mysql2');
const express = require("express");
const bodyparser = require("body-parser");
const path = require('path');

const admin_function = require('./routes/admin/admin');

const otp_function = require('./routes/otp_send/otp_send');

const anms_function = require('./routes/anms/anms');

const aqms_function = require('./routes/aqms/aqms');

const verify_token = require('./routes/otp_send/otp_send');

var app = express();

app.use(bodyparser.json())

// ANMS Related Functions
app.post('/anms/list',verify_token.verify,anms_function.list_anms);

app.post('/anms/list/update_replaced/:dev_id', verify_token.verify,anms_function.update_anms_replaced);

app.post('/anms/list/update_not_replaced/', verify_token.verify,anms_function.update_anms_not_replaced);


// AQMS Related Functions
app.post('/aqms/list', verify_token.verify,aqms_function.aqms_list);

app.post('/aqms/list/update_replaced/:dev_id', verify_token.verify,aqms_function.update_aqms_replaced);

app.post('/aqms/list/update_not_replaced/', verify_token.verify,anms_function.update_anms_not_replaced);


// OTP function
app.post('/send', otp_function.otp_send)

app.post('/verify', otp_function.otp_verify);


// User addition in the master table
app.post("/admin", verify_token.verify,admin_function.admin_user_add);

app.post("/admin/verify", verify_token.verify, admin_function.is_user_admin);

app.listen(3000);