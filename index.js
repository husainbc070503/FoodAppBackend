require('dotenv').config();
const express = require('express');
const ConnectDB = require('./connection/db');
const cors = require('cors');
const app = express();
const port = process.env.PORT

ConnectDB();
app.use(cors());

app.get('/', (req, res) => res.send("Hello Food App"));

app.use(express.json());
app.use('/api/user', require('./routes/Auth'))
app.use('/api/category', require('./routes/Category'))
app.use('/api/fooditem', require('./routes/FoodItems'))
app.use('/api/order', require('./routes/Order'))
app.use('/api/usercontact', require('./routes/Contact'))

app.listen(port, () => console.log(`Server running on port ${port}`));
