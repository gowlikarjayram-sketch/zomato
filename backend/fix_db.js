const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect('mongodb://127.0.0.1:27017/foodnest');
  console.log('Connected to DB');
  try {
    await mongoose.connection.collection('menuitems').dropIndex('id_1');
    console.log('Dropped id_1 index successfully.');
  } catch (err) {
    console.log('Index might not exist or already dropped:', err.message);
  }
  process.exit(0);
}

fix();
