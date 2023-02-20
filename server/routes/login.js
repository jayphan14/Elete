const express = require('express');
const router = express.Router();
const { pool1 } = require('../db');
const bcrypt = require('bcrypt');



// // LOG IN SCOUT
// router.post('/login/player', async (req, res) => {
//     const { email, password } = req.body;
//     // handle login request
//     const query = `SELECT password FROM player WHERE email = '${email}'`;
//     try {
//         const queryResult = await pool1.query(query);
//         console.log((await queryResult).rows);
//         if (queryResult.rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         const storedPasswordHash = queryResult.rows[0];
//         console.log(storedPasswordHash);
//         if (!bcrypt.compareSync(password, storedPasswordHash)) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         const authToken = generateAuthToken(user);
//         return res.json({ authToken });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error' });
//     }
// });

module.exports = router;