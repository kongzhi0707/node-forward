
### nodeJS 实现接口转发

项目的目录结构如下：
```
｜--- node-forward
｜ |--- src
｜ | |--- appList
｜ | | |--- client_play_list_tag.js
｜ | | |--- xxx.js
｜ | |--- utils
｜ | | |--- request.js
｜ | | |--- userAgent.js
｜ |--- index.js
｜ |--- package.json
```
整个项目结构如上所示：

#### 1）配置入口文件

index.js: 是入口文件， 开启一个本地服务，使用cors包解决跨域问题， 挂载路由操作， 代码如下：
```
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
```
#### 2）axiox进行一些简易封装

我们在 src/utils/request.js 文件，使用axios做一些简单的封装。代码如下：
```
const axios = require('axios');
const userAgent = require('./userAgent');

const request = (paramInfo) => {
  function getDataFn(obj) {
    const getData = {
      url: obj.url,
      method: obj.method || 'post',
			baseURL: obj.baseURL || 'http://m.music.migu.cn/migu/remoting/',
      headers: {
				'User-Agent': userAgent(),
				'Content-Type':'application/json;charset=UTF-8'
  	  }
    };
    if (getData.method === 'get') {
  	  getData.params = obj.data;
  	} else {
  	  getData.data = obj.data;
  	}
  	return getData;
  }
  if (!Array.isArray(paramInfo)) {
  	return axios(getDataFn(paramInfo));
  } else {
  	const fetchArray = paramInfo.map(v => {
  	  return axios(getDataFn(v));
  	});
  	return new Promise((resolve, reject) => {
  	  axios.all(fetchArray)
  	  	.then(axios.spread(function(...arg){
  	  	  // 多个请求都执行完成
  	  	  resolve(arg);
  	  	})).catch(err => {
  	  	  console.log('请求异常:' +err);
  	  	})
  	});
  }
}

module.exports = request;
```
#### 3）创建随机User-Agent

在 src/utils/userAgent.js 文件中 返回一个随机的请求头 headers的UA。代码如下：
```
// 返回一个随机的请求头 headers 的 UA
const user_agent_list = [
  // 各种PC端
  // Safari
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
  // chrome
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11",
  "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.133 Safari/534.16",
  // 360
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
  // QQ浏览器
  "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)",
  "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)",
  // sogou浏览器
  "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0",
  "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SV1; QQDownload 732; .NET4.0C; .NET4.0E; SE 2.X MetaSr 1.0)",
   
   // 各种移动端
   // IPhone
   "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // IPod
   "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // IPAD
   "Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
   "Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // Android
   "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   // QQ浏览器 Android版本
   "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   // Android Opera Mobile
   "Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10",
   // Android Pad Moto Xoom
   "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
   // BlackBerry
   "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+",
   // WebOS HP Touchpad
   "Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0",
   // Nokia N97
   "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124",
   // Windows Phone Mango
   "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)",
   // UC浏览器
   "UCWEB7.0.2.37/28/999",
   "NOKIA5700/ UCWEB7.0.2.37/28/999",
   // UCOpenwave
   "Openwave/ UCWEB7.0.2.37/28/999",
   // UC Opera
   "Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999",
   // 一部分 PC端的
   "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",
   "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.0 Safari/536.3",
   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",
   "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24"
]

module.exports = () =>{
  const index = Math.floor(Math.random() * user_agent_list.length);
  return user_agent_list[index];
}
```
#### 4）apiList 目录下是存放对应的接口请求的。

比如 src/apiList/client_play_list_tag.js 是get请求接口， 那么基本代码如下：
```
module.exports = (app) => {
  app.get('/client_play_list_tag', async (req, res) => {
    try {
      let result = await app.request({
        url: "client_play_list_tag",
        data: {
          ...req.query
        }
      })
      res.send(result.data)
    } catch (err) {
      res.send({ code: -500, msg: err.message })
    }
  })
}
```
页面通过匹配 /client_play_list_tag 这个路由来发真正的ajax请求，因此内部使用了 app.request，发起真正的ajax请求。然后把数据返回回来。

如果是post请求的话， 也是一样的。 比如 src/apiList/getPowerHistoryData.js 就是封装post请求的方式：
```
module.exports = (app) => {
  console.log('---进来饿了---')
  app.post('/api/history/getPowerHistoryData', async (req, res) => {
    console.log('--2331213231---', req.header.cookie);
    try {
      let result = await app.request({
        url: "/api/history/getPowerHistoryData",
        method: 'post',
        data: {
          ...req.query
        }
      })
      res.send(result.data)
    } catch (err) {
      res.send({ code: -500, msg: err.message })
    }
  })
}
```
上面的参数可能不是这种形式哦， 这只是一个demo， 看具体需求。 

package.json 如下：
```
{
  "name": "forward",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.27.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "express-session": "^1.17.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}
```
因此我们可以执行 npm run dev 把项目运行起来。 然后我们可以直接访问 http://127.0.0.1:3001/client_play_list_tag, 就可以返回接口数据了。
访问 http://127.0.0.1:3001/api/history/getPowerHistoryData post 请求返回数据即可。

#### 注意：如果接口需要登录限制的话，需要传递token的话， 在接口数据联调的时候，可以叫开发把登录对应的代码注释掉即可。然后不会有token限制。