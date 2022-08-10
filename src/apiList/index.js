
const fs = require('fs');
const path = require('path');

const request = require('../utils/request');

// 查找出当前文件夹所有的api文件名
const routes = fs.readdirSync(__dirname).filter(item => item.indexOf('index') != 0)
module.exports = (router) => {
  // 将请求放到每个实例中
  router.request = request;
  routes.forEach((item) => {
    console.log('--item---', path.resolve(__dirname, item))
    let routeFn = require(path.resolve(__dirname, item))
    routeFn(router)
  });
  return router;
}