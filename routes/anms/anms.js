const mysql = require('mysql2');
const request_promise = require('request-promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_dashboard'
});


exports.list_anms = async (req, res) => {  
    var options = {
        method: 'GET',
        uri: 'http://monster1.distronix.in:2100/anms/sens/get_device_list_int',
        json: true
    }
    // res.send(body["data"]);
    request_promise(options).then((parsedBody) => {
        for(let i=0; i<parsedBody["data"].length; i++){
            var first_query = "Select * from anms_list where dev_id=\""+parsedBody["data"][i]["dev_id"]+"\";";
            pool.query(first_query, function(err, rows, fields){
                console.log(err);
                if(rows.length==0){
                    var query = "Insert into anms_list (id, dev_id, location, street, zone, createdAt, updatedAt, latitude, longitude, is_enabled_int, district, is_enabled_ext, laeqt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                    var values = [parsedBody["data"][i]["id"], parsedBody["data"][i]["dev_id"], parsedBody["data"][i]["location"],parsedBody["data"][i]["street"], parsedBody["data"][i]["zone"], parsedBody["data"][i]["createdAt"], parsedBody["data"][i]["updatedAt"], parsedBody["data"][i]["lat"], parsedBody["data"][i]["long"], parsedBody["data"][i]["is_enabled_int"], parsedBody["data"][i]["district"], parsedBody["data"][i]["is_enabled_ext"], parsedBody["data"][i]["laeqt"]];

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

exports.update_anms_replaced = async (req, res) => {
    first_query = "update anms_list set dev_id = '" + req.body.dev_id + "' where location in (select location from anms_list where dev_id='"+req.params.dev_id+"'))";
    pool.query(first_query, (err, rows, field) => {
        console.log(err);
        var str = "Device Id changed from " + req.params.dev_id + " to " + req.body.dev_id;
        second_query = "Insert into anms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
        pool.query(second_query, (err, rows, field) => {
            console.log(err);
        }) 
    })
}

exports.update_anms_not_replaced = async (req, res) => {
    var str = req.body.text;
    second_query = "Insert into anms_logs(location, remarks, createdAt) values ('" + req.body.location + "', '" + str + "', CURRENT_TIMESTAMP);";
    pool.query(second_query, (err, rows, field) => {
        console.log(err);
    })
}