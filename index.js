
const express = require('express');
const Router = express.Router();
const app = express();
const cors = require('cors');

const apiList  = require('./src/apiList')

const port = 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("Content-Type", "application/json;charset=utf-8");
  // 允许证书 携带cookie
  res.header("Access-Control-Allow-Credentials", "true")
  res.set('Access-Control-Allow-Origin', req.headers.origin)
  next()
});

app.use(cors());

// 挂载路由
app.use(apiList(Router))

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`);
});