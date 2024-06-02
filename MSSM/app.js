// server.js or app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const pizzasRouter = require('./routes/pizzas');
const emailRouter = require('./routes/send-email');

const app = express();
const port = process.env.PORT || 5237;//ctyxjt

app.use(bodyParser.json());
app.use('/api', emailRouter); // Adjusted path to use the emailRouter correctly
app.use('/pizzas', pizzasRouter);

db.sequelize.sync();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
