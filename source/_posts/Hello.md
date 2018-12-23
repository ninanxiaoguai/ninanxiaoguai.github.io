---
title: Hello
date: 2018-08-22 10:19:37
categories: hexo
tags: 
- hexo
- 教程
mathjax: false
description:
---
大学已然过三年，也浑浑噩噩过了三年。一时兴起，想搞一个属于自己的博客，把未来生活与学习路上的点点滴滴记录下来，万事开头难，于是偷个懒，就把建这个网站的过程来作为我的第一篇博客吧，记录一下，哈哈哈哈哈

<!--more-->
## 安装

### 安装[git](https://git-scm.com/)、[node.js](https://nodejs.org/en/)

### 新建一个储存博客的文件夹(blogblog)

### 打开后`右键`-`选择`-`Git Bash Here`

### 输入

```
  npm install hexo -g  
  hexo init
```

- -g表示全局安装, npm默认为当前项目安装
- node_modules：是依赖包
- public：存放的是生成的页面
- source：用命令创建的各种文章
- themes：主题
- _config.yml：整个博客的配置
- db.json：source解析所得到的
- package.json：项目所需模块项目的配置信息

### 输入

```
  hexo clean
  hexo generate
  hexo server
```

  游览器打开 `http://localhost:4000` 

  但是只能在本地登录，下一步便是可以从其他地点登录

### 搭桥到github

- 选择`New repository/myname.github.io`
  `myname` 必须为github的账号名

- 输入 

  ```
  git config --global user.name "my name"
  git config --global user.email "my email"
  ```

- 创建SSH
  输入 `ssh-keygen -t rsa -C "myemail@example.com"` 再按两次回车
  输入 `cd ~/.ssh` 再
  输入 `cat id_rsa.pub`
  会输出

  ```
  ssh-rsa xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  myemail@example.com
  ```

  把`ssh-rsa xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`输入到key位置
  输入`ssh -T git@github.com` 可验证时候正确

- 打开在blogblog目录下的`_config.yml` 注意冒号后有一个空格

  ```
  deploy:
    type: git
    repo: https://github.com/mygithubName/mygithubName.github.io.git
    branch: master
  ```

  注意：如果同一个电脑建第二个hexo需要如下：

  ```
  deploy:
    type: git
    repo: git@github.com:mygithubName/mygithubName.github.io.git
    branch: master
  ```

  在blogblog目录中打开 `gitbash`执行`npm i hexo-server`
  再执行`npm install hexo-deployer-git --save`
  执行 

  ```
   hexo clean
   hexo generate
   hexo deploy
  ```

  打开 myname.github.io 就可以看到了~

### 绑定域名

- 买一个域名，我是在阿里云买的

- 在项目的source文件夹中新建一个名为CNAME的文件(不需要文件后缀)，编辑文档时把所购     买的域名添加其中，注意，只可添加一个

- 在DNS中添加一条记录，也可以直接通过新手引导设置，其中所需的地址只需在cmd中执行

  `ping myname.github.io`

- 再执行一次

  ```
  hexo clean
  hexo generate
  hexo deploy
  ```

## 更换主题

可以访问hexo的主题[官网](https://hexo.io/themes/)，我选择的是NexT主题，一来好看实用；二来很多功能都已经写好，添加功能时会更方便一些(渣渣没办法...)，因此以下为安装NexT主题为例。

   执行`$ git clone https://github.com/theme-next/hexo-theme-next-themes/next` 
  打开blogblog目录的`_config.yml`  ,其中，修改为 `theme: next` 
  emmmmm.... 没错 主题就换完了，打开试试，突然就高大上了~ 

### 修改blogblog下``_config.yml``的:

```
  title: 清 泉
  subtitle:
  description:
  keywords:
  author: spring
  language: zh-CN
  timezone:
```

  修改`blogblog/themes/next/_config.yml`:

```
  menu:
    home: / || home
    #about: /about/ || user
    #tags: /tags/ || tags
    #categories: /categories/ || th
    archives: /archives/ || archive
    #schedule: /schedule/ || calendar
    #sitemap: /sitemap.xml || sitemap
    #commonweal: /404/ || heartbeat
```

  我习惯修改为

```
  menu:
      home: / || home
      #about: /about/ || user
      tags: /tags/ || tags
      categories: /categories/ || th
      archives: /archives/ || archive
      #schedule: /schedule/ || calendar
      #sitemap: /sitemap.xml || sitemap
      #commonweal: /404/ || heartbeat
```

  想要选择哪个把前面的`#`去掉即可

  对于`tags`项：

- 执行`hexo new page "tags"` 
  打开`\source\tags\index.md`

```
   ---
   title:
   date: 2018-08-21 14:56:51
   type: "tags"
   comments: false
   ---
```

  对于`categories`项：

- 执行`hexo new page "categories"` 

  打开`\source\categories\index.md`

```
   ---
    title:
    date: 2018-08-21 14:57:23
    type: "categories"
    comments: false
    ---
```

### Next主题

  又分为四种形式，可自选：

```
  # Schemes
  scheme: Muse
  #scheme: Mist
  #scheme: Pisces
  #scheme: Gemini
```

### 头像

```
  avatar:
    url: #/images/avatar.gif 你的头像图片的路径
    # If true, the avatar would be dispalyed in circle.
    rounded: false
    # The value of opacity should be choose from 0 to 1 to set the opacity of the avatar.
    opacity: 1
    # If true, the avatar would be rotated with the cursor.
    rotated: false
```

### 删除底部隐藏由Hexo强力驱动、主题--NexT.Mist

  打开`blogblog/themes/next/layout/_partials/footer.swig`，注释掉相应代码 

```
  //用下面的符号注释，注释代码用下面括号括起来
   <!-- -->
   <!--
   <span class="post-meta-divider">|</span>
   {% if theme.footer.powered %}
   <div class="powered-by">{#
   #}{{ __('footer.powered', '<a class="theme-link" target="_blank"           href="https://hexo.io">Hexo</a>') }}{#
  #}</div>
  {% endif %}
  {% if theme.footer.powered and theme.footer.theme.enable %}
    <span class="post-meta-divider">|</span>
  {% endif %}
  {% if theme.footer.theme.enable %}
    <div class="theme-info">{#
    #}{{ __('footer.theme') }} &mdash; {#
    #}<a class="theme-link" target="_blank"                 href="https://github.com/iissnan/hexo-theme-next">{#
    #}NexT.{{ theme.scheme }}{#
   #}</a>{% if theme.footer.theme.version %} v{{ theme.version }}{% endif     %}{#
  #}</div>
   {% endif %}
   {% if theme.footer.custom_text %}
    <div class="footer-custom">{#
    #}{{ theme.footer.custom_text }}{#
  #}</div>
  {% endif %}
  -->
```

### 背景动态 canvas_nest

  `git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest`

  把`<script type="text/javascript" src="//cdn.bootcss.com/canvas-nest.js/1.0.0/canvas-nest.min.js"></script>` 插入至`\blogblog\themes\next\layout\_layout.swig`如下：

```
  <html>
  <head>
      ...
  </head>
  <body>
      ...
      ...
      ...
      插入到这里
  </body>
  </html>
```

  再修改主题配置文件

  打开`/next/_config.yml `,修改如下：

```
  # Canvas-nest
  # Dependencies: https://github.com/theme-next/theme-next-canvas-nest
  canvas_nest: true
```

### 添加DaoVoice在线联系

- 首先到[DaoVoice](https://www.daocloud.io/)注册账号，[邀请码](http://dashboard.daovoice.io/get-started?invite_code=0f81ff2f)是`0f81ff2f` ，登录成过后，进入到后台管理，点击**应用设置——>安装到网站**查看安装代码和AppID。

- 找到app_id ，在主题配置文件中找到(没有的话添加)

  ```
  # Online contact 
  daovoice: true
  daovoice_app_id: 这里填你的刚才获得的 app_id
  ```

- 打开`/themes/next/layout/_partials/head.swig ` ,代码放进去，哪行都可以

  ```
  {% if theme.daovoice %}
    <script>
    (function(i,s,o,g,r,a,m){i["DaoVoiceObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.charset="utf-8";m.parentNode.insertBefore(a,m)})(window,document,"script",('https:' == document.location.protocol ? 'https:' : 'http:') + "//widget.daovoice.io/widget/0f81ff2f.js","daovoice")
    daovoice('init', {
        app_id: "{{theme.daovoice_app_id}}"
      });
    daovoice('update');
    </script>
  {% endif %}
  ```

- 在DaoVoice中找到**聊天设置**调节窗口的颜色以及位置 
  我的参数：右侧像素20.0，下侧像素：80.0

### 在右上角或者左上角实现fork me on github

- 点击[这里](https://github.com/blog/273-github-ribbons) 或者 [这里](http://tholman.com/github-corners/)挑选自己喜欢的样式，并复制代码。

- 然后粘贴刚才复制的代码到`themes/next/layout/_layout.swig`文件中(放在`<div class="headband"></div>`的下面)，并把`href`改为你的github地址 。

### 添加RSS

  - 在blogblog中打开githash 执行

    `npm install --save hexo-generator-feed `

  - 在`blogblog/_config.yml`中添加

    ```
    # Extensions
    ## Plugins: http://hexo.io/plugins/
    plugins: hexo-generate-feed
    ```

  - 在主题配置文件中修改为：

    ```
    # Set rss to false to disable feed link.
    # Leave rss as empty to use site's feed link.
    # Set rss to specific value if you have burned your feed already.
    rss: /atom.xml
    ```

### 添加音乐

- 在博客配置文件中执行`npm install hexo-tag-aplayer@2.0.1 ` 

- 新建`themes\next\source\dist\music.js ` ,添加内容：

  ```
  const ap = new APlayer({
      container: document.getElementById('aplayer'),
      fixed: true,
      autoplay: false,
      audio: [
        {
          name: "Dream It Possible",
          artist: 'Delacey',
          url: 'http://www.ytmp3.cn/down/47868.mp3',
          cover: 'http://oeff2vktt.bkt.clouddn.com/image/84.jpg',
        },
        {
          name: 'いとしすぎて',
          artist: 'KG',
          url: 'http://www.ytmp3.cn/down/35726.mp3',
          cover: 'http://oeff2vktt.bkt.clouddn.com/image/8.jpg',
        },
        {
          name: '茜さす',
          artist: 'Aimer',
          url: 'http://www.ytmp3.cn/down/44578.mp3',
          cover: 'http://oeff2vktt.bkt.clouddn.com/image/96.jpg',
        }
      ]
  });
  ```

### 修改网站主题字体大小
在主题配置文件中
```
font:
  enable: true
  # Uri of fonts host. E.g. //fonts.googleapis.com (Default)
  # 亲测这个可用，如果不可用，自己搜索 [Google 字体 国内镜像]，找个能用的就行
  host: https://fonts.cat.net
  # Global font settings used on <body> element.
    # 全局字体，应用在 body 元素上
  global:
    external: true
    family: Lato
    size: 16
    #csdn上就是16看着舒服多了

  # 标题字体 (h1, h2, h3, h4, h5, h6)
  headings:
    external: true
    family: Roboto Slab

  # 文章字体
  posts:
    external: true
    family:

  # Logo 字体
  logo:
    external: true
    family: Lobster Two
    size: 24

  # 代码字体，应用于 code 以及代码块
  codes:
    external: true
    family: Roboto Mono
```

 ### 站点收录

#### 百度收录

在主题配置文件中修改成：

```
baidu_site_verification: true
```

进入[百度站点检验网站](https://ziyuan.baidu.com/) ，选择`http://` ,`purespring.top` `信息技术`

由于前两个验证一直通过不了，所以我选择了`CNAME验证` 

- 进入阿里云 我是在阿里云买的域名，所以进入那里。

-  进入解析设置
-  添加记录
   - 类型： `CNAME`
   - 主机记录： `xxxxx.purespring.top`(这个会告诉你)
   - 记录值：`zz.baidu`(这个会告诉你)

- 就可以完成确认

### 更改细节主题

`在文件\themes\next\source\css\_custom\custom.styl中，放入如下代码：`

```css
// Custom styles
//首页头部样式
.header {
    background: url("/images/header-bk.jpg");
}
.site-meta {
    margin-left: 0px;
    text-align: center;
}
.site-meta .site-title {
    font-size: 20px;
    font-family: 'Comic Sans MS', sans-serif;
    color: #fff;
	letter-spacing: 1px;
	width: 81%;
}
// 点文章进去的页面背景色
.container {
    background-color: rgba(255, 255, 255, 0.747);
}
// 页面留白更改
.header-inner {
    padding-top: 0px;
    padding-bottom: 0px;
}
.posts-expand {
    padding-top: 80px;
}
.posts-expand .post-meta {
    margin: 5px 0px 0px 0px;
}
.post-button {
    margin-top: 0px;
}
// 顶栏宽度
.container .header-inner {
    width: 100%;
}
// 站点名背景
.brand{
    background-color: rgb(56, 53, 53);
    margin-top: 15px;
    padding: 0px;
}
// 站点名字体
.site-title {
    line-height: 35px;
    letter-spacing: 3px;
}
// 站点子标题
.site-subtitle{ 
    margin: 0px;
    font-size: 16px;
    letter-spacing: 1px;
    padding-bottom: 3px;
    font-weight: bold;
    color: rgb(219, 95, 95);
    border-bottom-width: 3px;
    border-bottom-style: solid;
    border-bottom-color: rgb(161, 102, 171);
}
.logo-line-after {
    display: none;
}
.logo-line-before {
    display: none;
}
// 菜单
.menu {
    float: none;
}

// 菜单超链接字体大小
.menu .menu-item a {
    font-size: 14px;
    color: rgb(15, 46, 65);
    border-radius: 4px;
}
// 菜单各项边距
.menu .menu-item {
    margin: 5px 15px;
}
// 菜单超链接样式
.menu .menu-item a:hover {
    border-bottom-color: rgba(161, 102, 171, 0);
}
// 文章
.post {
    margin-bottom: 50px;
    padding: 45px 36px 36px 36px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
}
// 文章标题字体
.posts-expand .post-title {
    font-size: 26px;
    font-weight: 700;
}
// 文章标题动态效果
.posts-expand .post-title-link::before {
    background-image: linear-gradient(90deg, #a166ab 0%, #ef4e7b 25%, #f37055 50%, #ef4e7b 75%, #a166ab 100%);
}
// 文章元数据（meta）留白更改
.posts-expand .post-meta {
    margin: 10px 0px 20px 0px;
}
// 文章的描述description
.posts-expand .post-meta .post-description {
    font-style: italic;
    font-size: 14px;
    margin-top: 30px;
    margin-bottom: 0px;
    color: #666;
}
// [Read More]按钮样式
.post-button .btn {
    color: rgba(219, 210, 210, 0.911)!important;
    background-color: rgba(56, 52, 52, 0.911);
    border-radius: 3px;
    font-size: 15px;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
    border: none !important;
    transition-property: unset;
    padding: 0px 15px;
}
.post-button .btn:hover {
    color: rgba(219, 210, 210, 0.911) !important;
    border-radius: 3px;
    font-size: 15px;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
    background-image: linear-gradient(100deg, #a166ab 0%, #ef4e7b 25%, #f37055 50%, #ef4e7b 75%, #a166ab 100%);
}
// 去除在页面文章之间的分割线
.posts-expand .post-eof {
    margin: 0px;
    background-color: rgba(255, 255, 255, 0);
}
// 去除页面底部页码上面的横线
.pagination {
    border: none;
    margin: 0px;
}
// 页面底部页码
.pagination .page-number.current {
    border-radius: 100%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgba(255, 255, 255, 0.35);
}
.pagination .prev, .pagination .next, .pagination .page-number {
    margin-bottom: 10px;
    border: none;
}
.pagination .space {
    color: rgb(255, 255, 255);
}
// 页面底部页脚
.footer {
    line-height: 1.5;
    background-color: rgba(255, 255, 255, 0.75);
    color: #333;
    border-top-width: 3px;
    border-top-style: solid;
    border-top-color: rgb(161, 102, 171);
    box-shadow: 0px -10px 10px 0px rgba(0, 0, 0, 0.15);
}
// 文章底部的tags
.posts-expand .post-tags a {
    border-bottom: none;
    margin-right: 0px;
    font-size: 13px;
    padding: 0px 5px;
    border-radius: 3px;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}
.posts-expand .post-tags a:hover {
    background: #eee;
}
// 文章底部留白更改
.post-widgets {
    padding-top: 0px;
}
.post-nav {
    margin-top: 30px;
}
// 文章底部页面跳转
.post-nav-item a {
    color: rgb(80, 115, 184);
    font-weight: bold;
}
.post-nav-item a:hover {
    color: rgb(161, 102, 171);
    font-weight: bold;
}
// 文章底部评论
.comments {
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
    margin: 80px 0px 40px 0px;
}
// 超链接样式
a {
    color: rgb(80, 115, 184);
    border-bottom-color: rgb(80, 115, 184);
}
a:hover {
    color: rgb(161, 102, 171);
    border-bottom-color: rgb(161, 102, 171);
}
// 分割线样式
hr {
    margin: 10px 0px 30px 0px;
}
// 文章内标题样式（左边的竖线）
.post-body h2, h3, h4, h5, h6 {
    border-left: 4px solid rgb(161, 102, 171);
    margin-left: -36px;
    padding-left: 32px;
}
// 去掉图片边框
.posts-expand .post-body img {
    border: none;
    padding: 0px;
}
.post-gallery .post-gallery-img img {
    padding: 3px;
}
// 文章``代码块的自定义样式
code {
    margin: 0px 4px;
}
// 文章```代码块顶部样式
.highlight figcaption {
    margin: 0em;
    padding: 0.5em;
    background: #eee;
    border-bottom: 1px solid #e9e9e9;
}
.highlight figcaption a {
    color: rgb(80, 115, 184);
}
// 文章```代码块diff样式
pre .addition {
    background: #e6ffed;
}
pre .deletion {
    background: #ffeef0;
}
// 右下角侧栏按钮样式
.sidebar-toggle {
    right: 10px;
    bottom: 43px;
    background-color: rgba(247, 149, 51, 0.75);
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
}
.page-post-detail .sidebar-toggle-line {
    background: rgb(17, 185, 163);
}
// 右下角返回顶部按钮样式
.back-to-top {
    line-height: 1.5;
    right: 10px;
    padding-right: 5px;
    padding-left: 5px;
    padding-top: 2.5px;
    padding-bottom: 2.5px;
    background-color: rgba(247, 149, 51, 0.75);
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
}
.back-to-top.back-to-top-on {
    bottom: 10px;
}
// 侧栏
.sidebar {
    box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.75);
}
.sidebar-inner {
    margin-top: 30px;
}
// 侧栏顶部文字
.sidebar-nav li {
    font-size: 15px;
    font-weight: bold;
    color: rgb(7, 179, 155);
}
.sidebar-nav li:hover {
    color: rgb(161, 102, 171);
}
.sidebar-nav .sidebar-nav-active {
    color: rgb(7, 179, 155);
    border-bottom-color: rgb(161, 102, 171);
    border-bottom-width: 1.5px;
}
.sidebar-nav .sidebar-nav-active:hover {
    color: rgb(7, 179, 155);
}
// 侧栏站点概况行高
.site-overview {
    line-height: 1.3;
}
// 侧栏头像（圆形以及旋转效果）
.site-author-image {
    border: 2px solid rgb(255, 255, 255);
    border-radius: 100%;
    transition: transform 1.0s ease-out;
}
img:hover {
    transform: rotateZ(360deg);
}
.posts-expand .post-body img:hover {
    transform: initial;
}
// 侧栏站点作者名
.site-author-name {
    display: none;
}
// 侧栏站点描述
.site-description {
    letter-spacing: 5px;
    font-size: 15px;
    font-weight: bold;
    margin-top: 15px;
    margin-left: 13px;
    color: rgb(243, 112, 85);
}
// 侧栏站点文章、分类、标签
.site-state {
    line-height: 1.3;
    margin-left: 12px;
}
.site-state-item {
    padding: 0px 15px;
    border-left: 1.5px solid rgb(161, 102, 171);
}
// 侧栏RSS按钮样式
.feed-link {
    margin-top: 15px;
    margin-left: 7px;
}
.feed-link a {
    color: rgb(255, 255, 255);
    border: 1px solid rgb(158, 158, 158) !important;
    border-radius: 15px;
}
.feed-link a:hover {
    background-color: rgb(161, 102, 171);
}
.feed-link a i {
    color: rgb(255, 255, 255);
}
// 侧栏社交链接
.links-of-author {
    margin-top: 0px;
}
// 侧栏友链标题
.links-of-blogroll-title {
    margin-bottom: 10px;
    margin-top: 15px;
    color: rgba(7, 179, 156, 0.74);
    margin-left: 6px;
    font-size: 15px;
    font-weight: bold;
}
// 侧栏超链接样式（友链的样式）
.sidebar a {
    color: #ccc;
    border-bottom: none;
}
.sidebar a:hover {
    color: rgb(255, 255, 255);
}
// 自定义的侧栏时间样式
#days {
    display: block;
    color: rgb(7, 179, 155);
    font-size: 13px;
    margin-top: 15px;
}
// 侧栏目录链接样式
.post-toc ol a {
    color: rgb(75, 240, 215);
    border-bottom: 1px solid rgb(96, 125, 139);
}
.post-toc ol a:hover {
    color: rgb(161, 102, 171);
    border-bottom-color: rgb(161, 102, 171);
}
// 侧栏目录链接样式之当前目录
.post-toc .nav .active > a {
    color: rgb(161, 102, 171);
    border-bottom-color: rgb(161, 102, 171);
}
.post-toc .nav .active > a:hover {
    color: rgb(161, 102, 171);
    border-bottom-color: rgb(161, 102, 171);
}
/* 修侧栏目录bug，如果主题配置文件_config.yml的toc是wrap: true */
.post-toc ol {
    padding: 0px 10px 5px 10px;
}
/* 侧栏目录默认全展开，已注释
.post-toc .nav .nav-child {
    display: block;
}
*/
// 时间轴样式
.posts-collapse {
    margin: 50px 0px;
}
@media (max-width: 1023px) {
    .posts-collapse {
        margin: 50px 20px;
    }
}
// 时间轴左边线条
.posts-collapse::after {
    margin-left: -2px;
    background-image: linear-gradient(180deg,#f79533 0,#f37055 15%,#ef4e7b 30%,#a166ab 44%,#5073b8 58%,#1098ad 72%,#07b39b 86%,#6dba82 100%);
}
// 时间轴左边线条圆点颜色
.posts-collapse .collection-title::before {
    background-color: rgb(255, 255, 255);
}
// 时间轴文章标题左边圆点颜色
.posts-collapse .post-header:hover::before {
    background-color: rgb(161, 102, 171);
}
// 时间轴年份
.posts-collapse .collection-title h1, .posts-collapse .collection-title h2 {
    color: rgb(255, 255, 255);
}
// 时间轴文章标题
.posts-collapse .post-title a {
    color: rgb(80, 115, 184);
}
.posts-collapse .post-title a:hover {
    color: rgb(161, 102, 171);
}
// 时间轴文章标题底部虚线
.posts-collapse .post-header:hover {
    border-bottom-color: rgb(161, 102, 171);
}
// archives页面顶部文字
.page-archive .archive-page-counter {
    color: rgb(255, 255, 255);
}
// archives页面时间轴左边线条第一个圆点颜色
.page-archive .posts-collapse .archive-move-on {
    top: 10px;
    opacity: 1;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}
// 分类页面
.post-block.page {
    margin-top: 40px;
}
.category-all-page {
    margin: -80px 50px 40px 50px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
    padding: 86px 36px 36px 36px;
}
@media (max-width: 767px) {
    .category-all-page {
        margin: -73px 15px 50px 15px;
    }
    .category-all-page .category-all-title {
        margin-top: -5px;
    }
}
// 标签云页面
.tag-cloud {
    margin: -80px 50px 40px 50px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
    padding: 86px 36px 36px 36px;
}
.tag-cloud-title {
    margin-bottom: 15px;
}
@media (max-width: 767px) {
    .tag-cloud {
        margin: -73px 15px 50px 15px;
        padding: 86px 5px 36px 5px;
    }
}
// 自定义的TopX页面样式
#top {
    display: block;
    text-align: center;
    margin: -100px 50px 40px 50px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
    padding: 106px 36px 10px 36px;
}
@media (max-width: 767px) {
    #top {
        margin: -93px 15px 50px 15px;
        padding: 96px 10px 0px 10px;
    }
}
// 自定义ABOUT页面的样式
.about-page {
    margin: -80px 0px 60px 0px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
    padding: 106px 36px 36px 36px;
}
@media (max-width: 767px) {
    .about-page {
        margin: -73px 0px 50px 0px;
        padding: 96px 15px 20px 15px;
    }
}
h2.about-title {
    border-left: none !important;
    margin-left: 0px !important;
    padding-left: 0px !important;
    text-align: center;
    background-image: linear-gradient(90deg, #a166ab 0%, #a166ab 40%, #ef4e7b 45%, #f37055 50%, #ef4e7b 55%, #a166ab 60%, #a166ab 100%);
    background-size: cover;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    user-select: none;
}
// 本地搜索框
.local-search-popup .search-icon, .local-search-popup .popup-btn-close {
    color: rgb(247, 149, 51);
    margin-top: 7px;
}
.local-search-popup .local-search-input-wrapper input {
    padding: 9px 0px;
    height: 21px;
    background-color: rgb(255, 255, 255);
}
.local-search-popup .popup-btn-close {
    border-left: none;
}
// 选中文字部分的样式
::selection {
    background-color: rgb(255, 241, 89);
    color: #555;
}
/* 设置滚动条的样式 */
/* 参考https://segmentfault.com/a/1190000003708894 */
::-webkit-scrollbar {
    height: 5px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    background: #eee;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #ccc;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgb(247, 149, 51);
}
// 音乐播放器aplayer
.aplayer {
    font-family: Lato, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Heiti SC", STHeiti, "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", "Droid Sans Fallback", "Microsoft YaHei", sans-serif !important;
}
.aplayer-withlrc.aplayer .aplayer-info {
    background-color: rgb(255, 255, 255);
}
// 音乐播放器aplayer歌单
.aplayer .aplayer-list ol {
    background-color: rgb(255, 255, 255);
}
// 修视频播放器dplayer页面全屏的bug
.use-motion .post-body {
    transform: inherit !important;
}
// 自定义emoji样式
img#github-emoji {
    margin: 0px;
    padding: 0px;
    display: inline !important;
    vertical-align: text-bottom;
    border: none;
    cursor: text;
    box-shadow: none;
}

.site-meta .brand {   
    width: 10%;
}

// 页面最顶部的横线
.headband {
    height: 1.5px;
    background-image: linear-gradient(90deg, #F79533 0%, #F37055 15%, #EF4E7B 30%, #A166AB 44%, #5073B8 58%, #1098AD 72%, #07B39B 86%, #6DBA82 100%);
}
```



### 打开网站缓冲条式特效

打开`\themes\next\layout\_partials\head\head.swig`文件

在下面增加如下代码

```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<!-- S 新增代码 -->
<script src="//cdn.bootcss.com/pace/1.0.2/pace.min.js"></script>
<link href="//cdn.bootcss.com/pace/1.0.2/themes/pink/pace-theme-flash.css" rel="stylesheet">
<style>
    .pace .pace-progress {
        background: #24292e; /*进度条颜色*/
        height: 3px;
    }
    .pace .pace-progress-inner {
         box-shadow: 0 0 10px #1E92FB, 0 0 5px     #1E92FB; /*阴影颜色*/
    }
    .pace .pace-activity {
        border-top-color: #1E92FB;    /*上边框颜色*/
        border-left-color: #1E92FB;    /*左边框颜色*/
    }
</style>
<!-- E 新增代码 -->
```

 至此，网站已基本配置完成。