---
title: hexo恢复
date: 2018-12-22 15:17:37
categories: hexo 
tags: hexo 教程
mathjax: false
description:
---
想重新开始写博客，第一件事当然是恢复博客的正常使用啦！搜了小半天终于找到了符合我条件的教程。

背景：起初已配置好，但之后从未使用，期间重新做了一次系统。待我有时间再查询一下如何备份至云端。

<!--more-->



### 安装[git](https://git-scm.com/)、[node.js](https://nodejs.org/en/)

### 在原来储存博客的文件夹中(blog)
    `右键`->`选择`->`Git Bash Here`

再输入：
```
npm install hexo -g
```

因为重装系统有可能删除了配置文件包括环境变量里面的，没有配置 name 和 email 的话，git 是无法正常工作的。所以首先得重新配置name跟email 
在git bash里面输入下面两行

```
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```
如果上面两条命令fail了的话，记得先用命令`git init`再输入上面两条命令

### 创建SSH
输入 `ssh-keygen -t rsa -C "myemail@example.com"` 再按两次回车
输入 `cd ~/.ssh` 再
输入 `cat id_rsa.pub`
会输出

```
ssh-rsa xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
myemail@example.com
```

### 登陆我的Github 

在`settings`中找到`ssh and GPG keys`点击`new ssh key`，`title`随意

把`ssh-rsa xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`输入到key位置
在`git bash`输入`ssh -T git@github.com` 可验证时候正确



### 修改blog目录下`_config.yml` 

如果执行`hexo deploy`提示

```
Logon failed, use ctrl+c to cancel basic credential prompt.
bash: /dev/tty: No such device or address
INFO  Catch you later
```

则需要把下方的

```
deploy:
  type: git
  repo: https://github.com/mygithubName/mygithubName.github.io.git
  branch: master
```

修改成：

```
deploy:
  type: git
  repo: ssh://git@github.com/mygithubName/mygithubName.github.io.git
  branch: master
```


 执行 

`hexo g -d`

大功告成

### 常规操作：

  ```
   hexo clean
   hexo generate
   hexo server(本地测试用)
   hexo deploy
  ```

  至此，网站已基本恢复。