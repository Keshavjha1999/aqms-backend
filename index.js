const Pool = require('pg-pool');
var msg91 = require("msg91-api")("334776AxGI30wecx6082a90bP1");
const express = require("express");
const bodyparser = require("body-parser");
const path = require('path');

// const request = require("request");
const http = require('http');
const { response } = require('express');

const pool = new Pool({
    // host: '172.12.0.1',
    host: 'localhost',
    user: 'postgres',
    // password: 'root',
    // port: 4700,
    database: 'internal_dashboard'
});

pool.connect(() => console.log("Connected to Database"));

var app = express();

app.use(bodyparser.json())


app.post('/anms/list', async function(req, res){
    var body;
    
    http.get('http://monster1.distronix.in:2100/anms/sens/get_device_list_int', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        })

        // resp.on('end', () =>{
            // console.log(data);
        // } )

        console.log("Data is: " + data)

        // res.send(JSON.parse(data));
    })
    // res.send(body["data"]);
})


app.post('/send', function(req, res){
    mobile = `91${req.body.mobile_no}`
    otp = Math.floor(100000 + Math.random() * 900000);

    var args = {
        "flow_id": "61496c61077f54786422a1ac",
        "sender": "DISIOT",
        "mobiles": mobile,
        "otp": otp,
    };
    msg91.setOtpExpiry(300);
    msg91.setOtpLength(6);
      
    msg91.sendSMS(args, function(err, response){
        console.log(err);
        console.log(response);
    });


    no_entry = false;

    first_query = "Select * from user_otp where mobile_number=\""+mobile+"\"";
    pool.query(first_query, function(err, rows, fields){
        console.log(err);
        console.log(rows);
    });
    if(no_entry==true){
        second_query = "Insert into user_otp (mobile_number, otp) values (\""+mobile+"\", \""+otp+"\")";
        print(second_query)
        pool.query(second_query, (err, rows, fields) => {
            console.log(err);
            no_entry = false;
        })
    } else {
        third_query = "update user_otp set otp=\""+otp+"\" where mobile_number=\""+mobile+"\"";
        pool.query(third_query, (err, rows, fields) => {
            console.log(err);
        })
    }

    // pool.getConnection(function(err, conn) {
    //     // Do something with the connection
    //     conn.query("select * from user_otp");
    //     pool.releaseConnection(conn);
    // })
})

app.post('/verify', (req, res) => {

    mobile =`91${req.body.mobile_no}`

    console.log(mobile,req.body.otp)
    
    first_query = "select otp from user_otp where mobile_number=\""+mobile+"\"";
    pool.query(first_query, (err, rows, fields) => {
        console.log("query:",first_query, "result",rows[0].otp)
        if(rows[0].otp==`${req.body.otp}`){
            console.log("Verified Successfully");
        } else {
            console.log("Verification failed");
        }
        console.log(rows);
    })
    // msg91.verifyOTP("919040713766", "123456", (err, response) => {
    //     console.log(err);
    //     console.log(response);
    // })
});

app.listen(3000);