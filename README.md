# slide
## 这是一款基于es6写的一个图片拖拽验证的插件，可以放到任何的地方，前提是图片加载需要从后端请求，后续我会写个json文件给大家看Demo.

急于使用的朋友可以看下面

```javascript

  // 调用方法

     slideCaptcha.init({
      id: 'slideCaptcha', // 初始化验证图片的区域，使用id命名
      spiritUrl: '',
      slideBgUrl: '',
      defaultPoint: {
        x: 0,
        y: 0
      },
      validCheck: '/checkPoint',
      getResource: '/getVerifyImg'
    })  

  // 对应的Html为

  // <div id="slideCaptcha"></div>
  
  // 同一个页面可以调用多次该代码，目前还未实现，必须用异步来使用多个验证码功能，我会陆续的更新，直到该功能完全没有问题！
  
  
  对应的接口可以自己写，但是报文请求头和返回值需要指定的，请见下面：
  
  请求静态文件资源的接口请求报文用一个随机的数传过去
  // get the images
  // request body
  { flowId: 随机数}
  // response 
  { status: 0|, data: {
    newImage: 'base64',
    oriImageCopy:'base64',
    yPoint: Number // 拖拽图片的纵坐标
  }, statusText:''}
  
  // 检测验证通过接口
  request body
  {
     flowId: // 随机数
     yPoint: // 纵坐标，当前划到的位置
  }
  response 
  {
     code: 0|， // 如果code 为0证明验证成功，否则重新拖拽
  }
  
```
