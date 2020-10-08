var mysql = require('mysql');
var db = require('./db'); // Database info JSON

var con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
});

function getAllQuestions (callback) {
    con.connect(function(err) { // Connect to the database
        if (err) throw err;
        console.log("Connected!");
        
        con.query("select * from questions", function(err, localResult) { // Send query
            if (err && err.length != 0) throw err;
            callback(localResult); // Pass back info
        });
    });
}

getAllQuestions(function(res) {
    console.log(res); // Print the results
})