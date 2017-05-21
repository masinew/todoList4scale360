import Express from 'express';
import router from './routers';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Multer from 'multer';

const app = new Express();
const multer = new Multer();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer.array());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todolist4scale360');

app.use(router);

app.listen(3000, function () {
  console.log('Server app listening on port 3000!')
})