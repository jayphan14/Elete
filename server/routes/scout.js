const express = require('express');
const router = express.Router();
const { pool1 } = require('../db');
const AWS = require('aws-sdk');
const multer  = require('multer');
const bcrypt = require('bcrypt');


//Create s3 instance
AWS.config.update({
    accessKeyId: 'AKIAWAO6MXXQXHQBFSKH',
    secretAccessKey: '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'
});   
var s3 = new AWS.S3({
    params: {
        Bucket: "eleteheadshot"
    },
    region: 'us-east-2'
});

// Hash Password:
function encryptPasswordSync(plainPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
}

// Multer Instance to Handle Images Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

// Endpoints

// Player Database
// Create 
router.post('/scout', upload.single('headshot'), async (req, res) => {
    try {
        const scout_information = req.body;
        const headshot = req.file;
        var values = [];
        var query = 'INSERT INTO scout (';
        var query2 = 'VALUES (';
        var counter = 1;
        
        const s3params = {
            Bucket: s3.config.Bucket,
            Key: headshot.filename,
            Body: headshot.buffer,
        };
    
        // upload file to AWS S3
        const s3data = await s3.putObject(s3params).promise();
        const bucket = 'eleteheadshot'
        const headshot_url = `https://${bucket}.s3.${s3.config.region}.amazonaws.com/${s3params.Key}`;
        
        //Building query:
        for (const field in scout_information){
            query += `${field}, `;
            query2 += `$${counter}, `;
            counter+=1;
            if (field === "headshot"){
                continue;
            }
            if (field === "password") {
                const password = scout_information["password"];
                values.push(encryptPasswordSync(password));
            }
            else {
                values.push(scout_information[field]);
            }
        }
        query += 'headshot_url) ';
        query2 += `$${counter} )`;
        query += query2;
        values.push(headshot_url);
        console.log(query);
        console.log(values);

        const result = await pool1.query(query, values);

        res.send('Scout created successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating scout');
    }
});

// Read
router.get('/scout', async (req, res) => {
    try {
        const query = "SELECT * FROM scout";
        const result = await pool1.query(query);
        res.json(result.rows);
    } catch (error) {
        console.message(error);
        res.status(500).send('Error querying the database');
    }
});

// Read Specific
router.get('/scout/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM scout WHERE id = ${id}`;
        const result = await pool1.query(query);
        res.json(result.rows);
    } catch (error) {
        console.message(error);
        res.status(500).send('Error querying the database');
    }
});

// Update a scout info by id:
router.put('/scout/:id', async (req, res) => {
    const { id } = req.params;
    var query = 'UPDATE scout SET '
    var values = [];
    var counter = 1;
    for (const field in req.body){
        query += `${field} = $${counter}, `;
        counter+=1;
        values.push(req.body[field]);
    }
    query = query.slice(0, -2); 
    query += ` WHERE id = $${counter}`
    values.push(id);
    console.log(query);
    console.log(values);
    pool1.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating scout');
        } else {
            res.send('Scout updated successfully');
        }
    });
});
// Delete
router.delete('/scout/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM scout WHERE id = $1'
        const values = [id];
        const result = await pool1.query(query, values);

        if (result.rowCount === 0){
            return res.status(404).send('Row not found');
        }
        res.send('Row deleted sucessfully');

    } catch (error) {
        console.error(error);
        res.json(500).send("Can't Delete Item")
    }
});

module.exports = router;