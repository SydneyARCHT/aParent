
// index.js


const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();

const serviceAccount = require(path.resolve(__dirname, './aparent-1eec9-firebase-adminsdk-p7lon-38285c8fa7.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aparent-1eec9.firebaseio.com'
});


app.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('your-collection').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.send(data);
  } catch (error) {
    res.status(500).send('Error connecting to Firebase: ' + error.message);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});