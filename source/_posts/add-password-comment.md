---
title: add_password_comment
date: 2019-07-26 19:29:56
categories: hexo
tags: 
- hexo
- 教程
mathjax: false
---

闲来无事，计划把我的博客在修饰一下，因此添加了**文章加密**与**评论功能**。

<!--more-->

### 文章加密

文章加密有很多方法，我比较喜欢这个[Encrypt](https://github.com/MikeCoder/hexo-blog-encrypt/blob/master/ReadMe.zh.md)，不易破解，设置也简单。

#### 下载插件

先在git命令行上输入`npm install --save hexo-blog-encrypt`，下载插件。

#### 修改配置

在最初始的`_config.yml`上最后添加

```
# Security
##
encrypt:
    enable: true
```

#### 如何使用

在创建新的md文件后，格式修改成如下：

```
---
title: test
date: 2019-07-26 14:18:02
tags:
    - hexo
password: mimamima
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---
```

**注意**，内容不允许为空

- password: 是该博客加密使用的密码
- abstract: 是该博客的摘要，会显示在博客的列表页
- message: 这个是博客查看时，密码输入框上面的描述性文字

当然，还有许多高级的操作，我的需求就这么多，就不继续研究了，有兴趣可以看官网

### 评论功能

我用的是`Valine`，首先在[LeanCloud](https://leancloud.cn/)进行注册认证，其中认证需要手持身份证什么的，很麻烦。。。

#### 创建应用

名字随便起，接着点击设置：



![](add-password-comment\1.png)

然后在`应用Key`中进行复制，`App ID`与`App Key`两项，一会会用到。

![](add-password-comment\2.png)

#### 修改配置

打开`..\themes\next\_config.yml`找到`valine`处，具体设置如下：

```
# Valine.
# You can get your appid and appkey from https://leancloud.cn
# more info please open https://valine.js.org
valine:
  enable: true # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version.
  appid:  
  appkey:  
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: 有话您请说~ # comment box placeholder
  avatar: mm # gravatar style
  guest_info: nick,mail,link # custom comment header
  pageSize: 10 # pagination size
  visitor: true # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
  comment_count: true # if false, comment count will only be displayed in post page, not in home page
```

其中`appid`与`appkey`处填写刚刚存好的字符串。

#### 修改网页

打开`..\themes\next\layout\_partials\comments.swig`，因为我只用了这一个评论系统，因此，以下为全部代码：

```
{% if page.comments %}
  <div class="comments" id="comments"></div>
    {% if (theme.valine and theme.valine.enable)%}
    <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/valine@1.1.6/dist/Valine.min.js"></script>
    <script>
        new Valine({
            av: AV,
            el: '.comments',
            notify: true, // 邮件提醒 v1.1.4新增，下一步中有具体的邮箱设置
            verify: true,
            app_id: '{{ theme.valine.appId }}',
            app_key: '{{ theme.valine.appKey }}',
            placeholder: 'ヾﾉ≧∀≦)o来啊，快活啊!'
        });
    </script>
    {% endif %}
{% endif %}
```

至此设置完毕。

#### 邮件提醒

我是按照某个[大佬](http://www.zhaojun.im/hexo-valine-admin/)一步一步走的，很顺利。

在`云引擎\设置\代码库`中，输入`https://github.com/zhaojun1998/Valine-Admin`

![](add-password-comment\3.png)

在`云引擎\部署`选择 `Git源码部署`

![](add-password-comment\95.png)

在`云引擎\部署\源码部署\分支或版本号`中，输入`master`，点击`部署`

![](add-password-comment\94.png)

在`云引擎\设置\自定义环境变量`中，添加一些变量名，以此博客为参考，设置如下：

![](add-password-comment\96.png)

- SITE_NAME： 网站名称
- SITE_URL： 网站地址, **最后不要加**`/`
- SMTP_USER：SMTP 服务用户名，一般为邮箱地址。
- SMTP_PASS：SMTP 密码，一般为授权码，而不是邮箱的登陆密码，请自行查询对应邮件服务商的获取方式
- SENDER_NAME：随意
- SMTP_SERVICE：邮件服务提供商，支持 `QQ`、`163`、`126`、`Gmail`、`"Yahoo"`、`......` 
- TEMPLATE_NAME：有`rainbow`与`default`
- ADMIN_URL： 网站名称

对于163邮箱的`SMTP_PASS`，寻找方式如下：

进入163邮箱，选择:

![](add-password-comment\97.png)

对于箭头指的进行勾选，系统会自动让你填写授权码：

![](add-password-comment\98.png)

#### 休眠策略

**新版本与更改环境变量均需要重启容器后生效。**

**部署最新代码 :**

![](add-password-comment\5.png)

**重启容器:**

![](add-password-comment\6.png)

免费版的 LeanCloud 容器，是有强制性休眠策略的，不能 24 小时运行：

- 每天必须休眠 6 个小时
- 30 分钟内没有外部请求，则休眠。
- 休眠后如果有新的外部请求实例则马上启动（但激活时此次发送邮件会失败）。

分析了一下上方的策略，如果不想付费的话，最佳使用方案就设置**定时器**，每天 7 - 23 点每 20 分钟访问一次，这样可以保持每天的绝大多数时间邮件服务是正常的。

首先需要添加环境变量，`ADMIN_URL`：`Web主机域名`，如图所示（添加后重启容器才会生效）：

然后点击`云引擎 -\定时任务`，新增定时器，按照图片上填写,`0 */20 7-23 * * ?`：

![](add-password-comment\99.png)

添加后要记得**点击启用**：

![](add-password-comment\100.png)

启用成功后，每 20 分钟在云引擎的 - 应用日志中可以看到提示：

![](add-password-comment\4.png)

如果有后续的更新，鄙人不才，只能看[大佬](http://www.zhaojun.im/hexo-valine-admin/)的更新了。