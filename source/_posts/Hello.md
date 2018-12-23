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















 至此，网站已基本配置完成。