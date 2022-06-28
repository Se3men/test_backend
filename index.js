require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/index');
const path = require('path');
const errorHandler = require('./middleware/ErrorHandlingMiddlware');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}
start();