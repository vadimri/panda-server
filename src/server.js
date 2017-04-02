'use strict';
const config = require('./config.json');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const feed = require('./comments');
const mongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const port = process.env.PORT || config.port;  // set our port
const morgan = require('morgan');
app.use(morgan('combined'));

let mongoConnection;
// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

app.options('*', cors()); // enable pre-flight request for DELETE request
app.use('/feeds/', router);

router
  .get('/',  cors(), (req, res) => {
      feed.fetch(mongoConnection, (feed) => {
        res.status(200).json({feeds: feed || []});
      });
  })

  .post('/', cors(),  async (req, res) => {
    const comment = req.body.comment;
    feed.insert(mongoConnection, comment, (feed) => {
      res.status(200).json({feeds: feed || []});
    });
    // console.log(comment);
    // res.status(200).json({feeds: feed.add(comment)});
  });


// START THE SERVER
// =============================================================================
mongoClient.connect(config.mongodb.uri, (err, db) => {
    console.log("Mongodb connected successfully ...");
    mongoConnection = db;
    app.listen(port, () => {
      console.log('info', 'listening port:', port);
    });
});