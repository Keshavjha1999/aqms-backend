exports.admin_user_add = (req, res) => {
    const user = req.body.username;
    const user_email = req.body.email;
    const mobile_number = "91"+req.body.mobile_number;
    const type = req.body.type;

    var first_query = "Insert into master_table(user, user_email, mobile_number, type) values("+user+", "+ user_email + ", " + mobile_number + ", "+ type + ");";
    pool.query(first_query, (err, rows, fields) => {
        console.log("New User Added");
    })
}


exports.is_user_admin = (req, res) => {
    const mobile = req.body.mobile_number;
    
    var first_query = "select type from master_table where mobile_number='"+mobile+"'";
    pool.query(first_query, (err, rows, fields) => {
        if(rows[0]=="admin"){
            res.send({"isAdmin": true, "code": 200});
        } else {
            res.send({"isAdmin": false, "code": 200});
        }
    })
}