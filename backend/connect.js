var mysql = require('mysql');
var db = require('./db'); // Database info JSON

var con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
});

// Function call example
//
// getAllQuestions( function(res) {
//     console.log(res.length); // Print the results
// });

function getAllQuestions (callback) {
    con.connect(function(err) { // Connect to the database
        if (err) throw err;
        console.log("Connected!");
        
        con.query("select * from questions", function(err, localResult) { // Send query
            if (err) throw err;
            callback(localResult); // Pass back info
        });
    });
}

function getQuestionFromId (id, callback) {
    con.connect(function(err) { // Connect to the database
        if (err) throw err;
        console.log("Connected!");
        
        con.query("SELECT * FROM questions WHERE Question_Id = ?", [id], function(err, localResult) { // Send query
            if (err) throw err;
            callback(localResult); // Pass back info
        });
    });
}

function getQuestionFromCategory (category, callback) {
    con.connect(function(err) { // Connect to the database
        if (err) throw err;
        console.log("Connected!");
        
        con.query("SELECT * FROM questions WHERE Category = ?", [category], function(err, localResult) { // Send query
            if (err) throw err;
            callback(localResult); // Pass back info
        });
    });
}

function getCategories(callback) {
    con.connect(function(err) { // Connect to the database
        if (err) throw err;
        console.log("Connected!");
        
        con.query("SELECT * FROM categories", function(err, localResult) { // Send query
            if (err) throw err;
            callback(localResult); // Pass back info
        });
    });
}