const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const {Client} = require('pg'); // napravljeno za posebnu bazu mora se promijeniti
const client = new Client ({
    host: "localhost",
    user: "myuser",
    port: 5433,
    password: "mysecretpwd",
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
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

    const query = `SELECT COUNT(*) AS count FROM login WHERE email=$1 AND password=$2`;
    client.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    });
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

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const sql = "insert into mydb values(?,?)";
  
  const query = `INSERT INTO login (email, password) VALUES ($1, $2) RETURNING *`;
    client.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }
        return res.json({ success: true, user: result.rows[0] });
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})