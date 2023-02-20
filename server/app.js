const express = require('express');
const multer  = require('multer');
const app = express();
const cors = require('cors');
const AWS = require('aws-sdk');
const playerRouter = require('./routes/player');
const scoutRouter = require('./routes/scout');
const endorsementRouter = require('./routes/endorsement');
const loginRouter = require('./routes/login');

// Middleware
app.use(cors());
app.use(express.json());


app.use('', playerRouter);
app.use('', scoutRouter);
app.use('', endorsementRouter);
app.use('', loginRouter);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

