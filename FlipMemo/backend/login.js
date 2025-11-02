const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT COUNT(*) AS count FROM login WHERE email = ? AND password = ?";
  
  con.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    
    if (result[0].count > 0) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})