const {Client} = require('pg');
const client = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5433,
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