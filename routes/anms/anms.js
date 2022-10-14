const request_promise = require('request-promise');
const mysql_connect = require('../mysql/mysql_connect');

const pool = mysql_connect.pool;

exports.list_anms = async (req, res) => {  
    let options = {
        method: 'GET',
        uri: 'http://monster1.distronix.in:2100/anms/sens/get_device_list_int',
        json: true
    }
    // res.send(body["data"]);
    request_promise(options).then((parsedBody) => {
        for(let i=0; i<parsedBody["data"].length; i++){
            let first_query = "Select * from anms_list where dev_id=\""+parsedBody["data"][i]["dev_id"]+"\";";
            pool.query(first_query, function(err, rows, fields){
                console.log(err);
                if(rows.length==0){
                    let query = "Insert into anms_list (id, dev_id, location, street, zone, createdAt, updatedAt, latitude, longitude, is_enabled_int, district, is_enabled_ext, laeqt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                    let values = [parsedBody["data"][i]["id"], parsedBody["data"][i]["dev_id"], parsedBody["data"][i]["location"],parsedBody["data"][i]["street"], parsedBody["data"][i]["zone"], parsedBody["data"][i]["createdAt"], parsedBody["data"][i]["updatedAt"], parsedBody["data"][i]["lat"], parsedBody["data"][i]["long"], parsedBody["data"][i]["is_enabled_int"], parsedBody["data"][i]["district"], parsedBody["data"][i]["is_enabled_ext"], parsedBody["data"][i]["laeqt"]];

                    pool.query(query, values, function(err, rows, fields) {
                        console.log(err);
                        if(err){
                            console.log(parsedBody["data"][i]["location"]);
                        }
                    })
                }
            })
        }
        res.send(parsedBody);
    })
}

exports.update_anms_board = async (req, res) => {
    let first_query = "update anms_list set dev_id = '" + req.body.dev_id + "' where location in (select location from anms_list where dev_id='"+req.params.dev_id+"'))";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "Device Id changed from " + req.params.dev_id + " to " + req.body.dev_id;
        let second_query = "Insert into anms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        }) 
    })
}

exports.update_anms_not_replaced = async (req, res) => {
    let str = req.body.text;
    let second_query = "Insert into anms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
    pool.query(second_query, (err, rows, field) => {
        console.log(err);
    })
}

exports.update_anms_cirrus = async (req, res) => {
    let first_query = "insert into cirrus(old_device, new_device, place, timestamp) values ('" + req.body.old_cirrus_id + "', '" + req.body.new_cirrus_id + "', '" + req.body.location + "', CURRENT_TIMESTAMP);";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        let str = "Cirrus changed. Previous id:" + req.body.old_cirrus_id + ", New id:" + req.body.new_cirrus_id;
        let second_query = "Insert into anms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        })
    })
}

exports.previous_transactions = async (req, res) => {
    let first_query = "select * from anms_logs where location='" + req.body.location + "' order by createdAt limit 10";
    // let first_query = "select * from anms_logs order by createdAt limit 10";
    var str="";
    try{
        pool.query(first_query, (err, rows, field) => {
            console.log(rows);
            res.send({"status": 200, "data": rows});
        });
    } catch(err){
        console.log(err);
        res.send({"status": 200, "data": "No recent data found"});
    }
    // res.send({"status": "200", "data": str});
}

