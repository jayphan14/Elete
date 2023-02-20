const Pool = require("pg").Pool;

const pool1 = new Pool({
    user: 'postgres',
    password:'password',
    host:'localhost',
    port: 5433,
    database: 'players'
});

// const pool2 = new Pool({
//     user: 'postgres',
//     password:'password',
//     host:'localhost',
//     port: 5433,
//     database: 'players'
// });

// const pool3 = new Pool({
//     user: 'postgres',
//     password:'password',
//     host:'localhost',
//     port: 5433,
//     database: 'connection'
// });
// const pool4 = new Pool({
//     user: 'postgres',
//     password:'password',
//     host:'localhost',
//     port: 5433,
//     database: 'endorsement'
// });

module.exports = {pool1}