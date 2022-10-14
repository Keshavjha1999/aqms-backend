var msg91 = require("msg91-api")("334776AxGI30wecx6082a90bP1");
const jwt = require("jsonwebtoken");
const mysql_connect = require('../mysql/mysql_connect');

const pool = mysql_connect.pool;

const AccessToken=(mobile,otp)=>{

    return jwt.sign({ username:mobile, otp: otp},"MySecretKeyForSomething",
            {expiresIn:"43200000"}
        )
}

exports.otp_send = (req, res) => {
    mobile = `91${req.body.mobile_no}`
    otp = Math.floor(100000 + Math.random() * 900000);

    let fourth_query  = "Select * from master_table where mobile_number = '" + mobile + "';";
    pool.query(fourth_query, (err, rows, fields) => {
        if(rows.length == 0){
            res.send({"remark": "You are not a member", "code": 200});
        } else {
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
                if(rows.length==0){
                    second_query = "Insert into user_otp (mobile_number, otp) values (\""+mobile+"\", \""+otp+"\")";
                    // console.log(second_query)
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
            });
            res.send({"status": "successful", code: 200});
        }
    })
}

exports.otp_verify = (req, res) => {

    mobile =`91${req.body.mobile_no}`

    console.log(mobile,req.body.otp)
    
    first_query = "select otp from user_otp where mobile_number=\""+mobile+"\"";
    pool.query(first_query, (err, rows, fields) => {
        console.log("query:",first_query, "result",rows[0].otp)
        if(rows[0].otp==`${req.body.otp}`){
            console.log("Verified Successfully");
            let access_token = AccessToken(mobile, rows[0].otp);
            res.send({"status": "Verification Successful", "access_token": access_token, "code": 200});
            
        } else {
            console.log("Verification failed");
            res.send({"status": "Incorrect OTP", "code": 400});
        }
        console.log(rows);
    })
}


