const express = require('express');
const router = express.Router();
const { pool1 } = require('../db');

// Create 
router.post('/endorsement', async (req, res) => {
    const {scout_id, player_id, description} = req.body;
    try {
        query = 'INSERT INTO endorsement (scout_id, player_id, description) VALUES ($1, $2, $3)'
        values = [scout_id, player_id, description]
        await pool1.query(query, values);
        res.status(200).send("Created Connection Sucessfully")
    } catch (error) {
        console.message(error);
        res.status(500).send('Error creating the endorsement');
    }
});


// Create 
router.get('/endorsement/:player_id', async (req, res) => {
    const {player_id} = req.params;
    try {
        query = `SELECT * FROM endorsement WHERE player_id = ${player_id}`;
        const result = await pool1.query(query);
        res.json(result.rows);
    } catch (error) {
        console.message(error);
        res.status(500).send('Error creating the endorsement');
    }
});
module.exports = router;