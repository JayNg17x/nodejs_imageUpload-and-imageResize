const express = require('express');
const app = express();
const routes = require('./routes/web');

app.use(express.urlencoded({ extended: true}));
routes(app);

app.listen(3000, () => console.log('Server is running on port 3000...'));

