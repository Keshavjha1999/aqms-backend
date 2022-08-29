// const Pool = require('pg-pool');
const mysql = require('mysql2');
var msg91 = require("msg91-api")("334776AxGI30wecx6082a90bP1");
const express = require("express");
const bodyparser = require("body-parser");
const path = require('path');
const request_promise = require('request-promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_dashboard'
});

// pool.connect(() => console.log("Connected to Database"));

var app = express();

app.use(bodyparser.json())


app.post('/anms/list', async function(req, res){    
    var options = {
        method: 'GET',
        uri: 'http://monster1.distronix.in:2100/anms/sens/get_device_list_int',
        json: true
    }
    // res.send(body["data"]);
    request_promise(options).then((parsedBody) => {
        console.log(parsedBody);
        res.send(parsedBody);
        // console.log(parsedBody["data"][0]["id"]);
        for(let i=0; i<parsedBody["data"].length; i++){
            var no_entry = false;
            first_query = "Select * from anms_list where dev_id=\""+parsedBody["data"][i]["dev_id"]+"\"";
            pool.query(first_query, function(err, rows, fields){
                console.log(err);
                console.log(rows);
                if(rows.length==0){
                    no_entry = true;
                }
            });
            if(no_entry = true){
                second_query = "Insert into anms_list (id, dev_id, location, street, zone, createdAt, updatedAt, latitude, longitude, is_enabled_int, district, is_enabled_ext, laeqt) values ("+ parsedBody["data"][i]["id"] + ", '" + parsedBody["data"][i]["dev_id"] + "', '" + parsedBody["data"][i]["location"] + "', '" + parsedBody["data"][i]["street"] + "', '" + parsedBody["data"][i]["zone"] + "', '" + parsedBody["data"][i]["createdAt"] + "', '" + parsedBody["data"][i]["updatedAt"] + "', '" + parsedBody["data"][i]["lat"] + "', '" + parsedBody["data"][i]["long"] + "', " + parsedBody["data"][i]["is_enabled_int"] + ", '" + parsedBody["data"][i]["district"] + "', " + parsedBody["data"][i]["is_enabled_ext"] + ", '" + parsedBody["data"][i]["laeqt"] + "');"
                pool.query(second_query, (err, rows, fields) => {
                    console.log("Insertion Complete");   
                })
            }
        }
    })
})

app.post('/anms/list/:dev_id', async function(req, res){
    first_query = "update anms_list set dev_id = '" + req.body.dev_id + "' where location in (select location from anms_list where dev_id='"+req.params.dev_id+"'))";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
    })
})

app.post('/aqms/list', async function(req, res){
    var body;
    
    var options = {
        method: 'POST',
        uri: 'http://monster1.distronix.in:1100/v1.0/sens/get_device_list_int',
        json: true
    }
    // res.send(body["data"]);
    request_promise(options).then((parsedBody) => {
        console.log(parsedBody);
        res.send(parsedBody);
        for(let i=0; i<parsedBody["data"].length; i++){
            first_query = "Insert into aqms_list (id, dev_id, location, stncode, lat, long, district, aqi, last_online) values ("+ parsedBody["data"][i]["id"] + ", '" + parsedBody["data"][i]["dev_id"] + "', '" + parsedBody["data"][i]["location"] + "', '" + parsedBody["data"][i]["stncode"] + "', '" + parsedBody["data"][i]["lat"] + "', '" + parsedBody["data"][i]["long"] + "', '" + parsedBody["data"][i]["district"] + "', " + parsedBody["data"][i]["aqi"] + ", '" + parsedBody["data"][i]["last_online"] + "');";
            pool.query(first_query, (err, rows, fields) => {
                console.log(err);
            });
        }
    })
})

app.post('/aqms/list/:dev_id', async function(req, res){
    first_query = "update aqms_list set dev_id = '" + req.body.dev_id + "' where location in (select location from aqms_list where dev_id='" + req.params.dev_id+"'))"
    pool.query(first_query, (err, rows, field) => {
        console.log("Update Complete");
    })
    var location = "";
    third_query = "select location from aqms_list where dev_id = '" + req.body.dev_id + "');";
    pool.query(third_query, (err, rows,field) => {
        location = rows[0];
    })
    second_query = "insert into aqms_logs(location, remarks, createdAt) values (" + location + ", 'AQMS Board Change', CURRENT_TIMESTAMP);";
    pool.query(second_query, (err, rows, field) => {
        console.log(err);
    })
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