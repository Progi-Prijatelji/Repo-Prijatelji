const express = require('express');
const app = express();
import { browserHistory } from 'react-router';
let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

function CheckLoginInput(email, password) {
    if(con.connect(function(err) {
        if (err) throw err;
        con.query(`select count() from login where email= ${email} and 
                password = ${password}`, function (err, result, fields) {
                if (err) throw "Email i lozinka se ne podudaraju!"
                return result != null;});
    }));
}

function LoginAttempt(email, password){
     if(CheckLoginInput(email, password))
    browserHistory.push("/home");
}

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})