# 图片预览组件

基于纯javascript的图片预览组件.

## 快速入手

1. 在项目中引入该组件包
```
mkdir your_project && cd your_project
cnpm init
cnpm install @focus/imageviewer

// then create index.html and index.js

```

2. 在项目文件中引入该模块
```
// webpack + es6的项目中可通过import引入该组件模块源码和样式
// index.js 文件的代码如下
import '@front/ImageViewer/style.css';
import '@front/ImageViewer';

new ImageViewer({
    images: [
        { url: 'http://xx/xx.jpg', thumbUrl: 'http://xx/xx.jpg', name: 'xx.jpg' },
        { url: 'http://xx/xx.jpg', thumbUrl: 'http://xx/xx.jpg', name: 'xx.jpg' }
    ],
    zIndex: 9999
});


// 没有使用模块加载工具的项目如下所示
// index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Demo for ImageViewer</title>
    <link rel="stylesheet" href="./node_modules/@front/ImageViewer/style.css">
  </head>
  <body>
    <script src="./node_modules/@front/ImageViewer/index.js"></script>
    <script>
        new ImageViewer({
            images: [
                { url: 'http://xx/xx.jpg', thumbUrl: 'http://xx/xx.jpg', name: 'xx.jpg' },
                { url: 'http://xx/xx.jpg', thumbUrl: 'http://xx/xx.jpg', name: 'xx.jpg' }
            ],
            zIndex: 9999
        });
    </script>
  </body>
</html>

```

## 文档结构

```
├── README.md                   # Quick start document
├── package.json                # package definition
├── index.js                    # all source code written for this app
├── style.css                   # css file
└── demo.html                   # demo html using this component
```
