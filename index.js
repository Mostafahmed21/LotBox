import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./src/.config/.env') });
import express from 'express';
import bootstrap from './src/app.controller.js';
const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);

app.listen(port, () => {
    console.log(`server in running in port:${port}!`);
});
