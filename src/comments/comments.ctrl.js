'use strict';
const assert = require('assert');

const pickMessage = (items) => items.map( ({email, message}) => {
  return { email, message };
});

export const fetch = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('comments');
  // Find some documents
  collection.find({}).toArray((err, docs) => {
    assert.equal(err, null);
    callback(pickMessage(docs));
  });
};

export const insert = (db, comment,  callback) => {
  const collection = db.collection('comments');
  // Find some documents
  collection.insertOne(comment, (err, result) => {
    assert.equal(err, null);
    assert.equal(result.insertedCount, 1);
    collection.find({}).toArray((err, docs) => {
      assert.equal(err, null);
      callback(pickMessage(docs));
    });
  });
};