const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const {Client} = require('pg');
const client = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "bazepodataka",
    database: "FlipMemo"
});
client.connect();

client.query(`Select * from login`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    client.end;
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  client.query(`SELECT COUNT(*) AS count FROM login WHERE email=${email} AND password=${password}`, (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ success: false });
    }
    console.log(result);
    if (result.length > 0) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  });

  // const sql = "SELECT COUNT(*) AS count FROM login WHERE email = ? AND password = ?";
  
  // con.query(sql, [email, password], (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ success: false });
  //   }

  //   if (result.length > 0) {
  //     return res.json({ success: true });
  //   } else {
  //     return res.json({ success: false });
  //   }
  // });
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const sql = "insert into mydb values(?,?)";
  
  con.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    if (result.length > 0) {
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