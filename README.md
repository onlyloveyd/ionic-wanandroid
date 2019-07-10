# ionic-wanandroid
基于ionic4 + ng7构建一个ionic WanAndroid.com客户端
使用到阿里移动端组件库[ng-zorro-antd-mobile](https://github.com/NG-ZORRO/ng-zorro-antd-mobile)，

## 功能点
- 首页轮播图
- 首页公众号，导航数据
- 最新项目
- 搜索
- 知识体系

## Native插件
- [Http](https://ionicframework.com/docs/native/http)
- [Device](https://ionicframework.com/docs/native/device)
- [File](https://ionicframework.com/docs/native/file)
- [InAppBrowser](https://ionicframework.com/docs/native/in-app-browser)
- [AppMinimize](https://ionicframework.com/docs/native/app-minimize)
- [ionic-Keyboard](https://ionicframework.com/docs/native/keyboard)
- [ionic-Webview](https://ionicframework.com/docs/native/ionic-webview)
- [SplashScreen](https://ionicframework.com/docs/native/splash-screen)
- [StatusBar](https://ionicframework.com/docs/native/status-bar)
- [Whitelist](https://github.com/apache/cordova-plugin-whitelist)

## 项目运行
```bash
npm install -g cordova ionic // 需要全局安装cordova ionic

git clone https://github.com/onlyloveyd/ionic-wanandroid.git 

cd ionic-wanandroid

npm install

ionic cordova platform add android

# android运行
ionic cordova platform run android --prod

# 浏览器运行
ionic serve

```

## 截图
![首页](/screenshots/home.png)
![最新项目](/screenshots/project.png)
![搜索](/screenshots/search.png)
![体系](/screenshots/system.png)
![搜索结果](/screenshots/search_result.png)
![体系文章列表](/screenshots/system_list.png)

