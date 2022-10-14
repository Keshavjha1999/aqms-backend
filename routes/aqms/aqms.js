const request_promise = require('request-promise');
const mysql_connect = require('../mysql/mysql_connect');

const pool = mysql_connect.pool;

exports.aqms_list = async (req, res) => {    
    let options = {
        method: 'POST',
        uri: 'http://monster1.distronix.in:1100/v1.0/sens/get_device_list_int',
        json: true
    }
    // res.send(body["data"]);
    request_promise(options).then((parsedBody) => {
        for(let i=0; i<parsedBody["data"].length; i++){
            let first_query = "Select * from aqms_list where dev_id=\""+parsedBody["data"][i]["dev_id"]+"\";";
            pool.query(first_query, function(err, rows, fields){
                console.log(err);
                if(rows.length==0){
                    let second_query = "Insert into aqms_list (id, dev_id, location, stncode, latitude, longitude, district, aqi, last_online) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
                    let values = [parsedBody["data"][i]["id"], parsedBody["data"][i]["dev_id"], parsedBody["data"][i]["location"], parsedBody["data"][i]["stncode"], parsedBody["data"][i]["lat"], parsedBody["data"][i]["long"], parsedBody["data"][i]["district"], parsedBody["data"][i]["aqi"], parsedBody["data"][i]["last_online"]];
                    pool.query(first_query, values, (err, rows, fields) => {
                        console.log(err);
                    });
                }
            });
        }
    })
}

exports.update_aqms_replaced = async (req, res) => {
    let first_query = "update aqms_list set dev_id = '" + req.body.dev_id + "' where location in (select location from aqms_list where dev_id='"+req.params.dev_id+"'))";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "Device Id changed from " + req.params.dev_id + " to " + req.body.dev_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        }) 
    })
}

exports.update_aqms_not_replaced = async (req, res) => {
    let str = req.body.text;
    let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
    pool.query(second_query, (err, rows, field) => {
        console.log(err);
    })
}

exports.update_aqms_no2 = async (req, res) => {
    let first_query = "insert into no2(old_device, new_device, place, timestamp) values ('" + req.body.old_no2_id + "', '" + req.body.new_no2_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "NO2 changed. Previous id:" + req.body.old_no2_id + ", New id:" + req.body.new_no2_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.update_aqms_so2 = async (req, res) => {
    let first_query = "insert into so2(old_device, new_device, place, timestamp) values ('" + req.body.old_so2_id + "', '" + req.body.new_so2_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "SO2 changed. Previous id:" + req.body.old_so2_id + ", New id:" + req.body.new_so2_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.update_aqms_pm = async (req, res) => {
    let first_query = "insert into pm(old_device, new_device, place, timestamp) values ('" + req.body.old_pm_id + "', '" + req.body.new_pm_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "PM changed. Previous id:" + req.body.old_pm_id + ", New id:" + req.body.new_pm_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.update_aqms_sht20 = async (req, res) => {
    let first_query = "insert into sht20(old_device, new_device, place, timestamp) values ('" + req.body.old_sht20_id + "', '" + req.body.new_sht20_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "SHT20 changed. Previous id:" + req.body.old_sht20_id + ", New id:" + req.body.new_sht20_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.update_aqms_sht30 = async (req, res) => {
    let first_query = "insert into sht20(old_device, new_device, place, timestamp) values ('" + req.body.old_sht30_id + "', '" + req.body.new_sht30_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "SHT20 changed. Previous id:" + req.body.old_sht30_id + ", New id:" + req.body.new_sht30_id;
        let second_query = "Insert into aqms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.previous_transactions = async (req, res) => {
    let first_query = "select * from aqms_logs where location='" + req.body.location + "' order by createdAt desc limit 10";
    // let first_query = "select * from anms_logs order by createdAt limit 10";
    
    pool.query(first_query, (err, rows, field) => {
        console.log(rows);
        if(rows.length==0){
            res.send({"status": 200, "data": "No recent data found."});
        } else {
            res.send({"status": 200, "data": rows});
        }
    });
}

