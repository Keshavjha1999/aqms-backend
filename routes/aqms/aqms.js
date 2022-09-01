const mysql = require('mysql2');
const request_promise = require('request-promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_dashboard'
});


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