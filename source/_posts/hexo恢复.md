---
title: hexo恢复
date: 2018-12-22 15:17:37
categories: hexo 
tags: hexo 教程
mathjax: false
description:
---
想重新开始写博客，第一件事当然是恢复博客的正常使用啦！搜了小半天终于找到了符合我条件的教程。

背景：起初已配置好，但之后从未使用，期间重新做了一次系统。待我有时间再查询一下如何备份至云端。(已完成)

<!--more-->

## 恢复

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

## 云备份至Github

为了以后更方便的从云端备份下来，我又查了一些教程，下面便是详细步骤

### 基本原理 
网站的部署其实就是生成静态文件，hexo下所有生成的静态文件会放在`public/`文件夹中，所谓部署deploy其实就是 将`public/`文件夹中内容上传到git仓库`myname.github.io`中。 
也就是说，你的仓库`myname.github.io`中的文件只是blog（或者命名为hexo）文件夹下的`public/`下的文件。
本背景下，方便放在`myname.github.io`的`repository`下创建一个分支来管理

### 建立分支hexo
- 在本地磁盘下（位置任意）`右键 -> Git bash here`，执行以下指令将`myname.github.io`项目文件克隆到本地：
  ```
  git clone git@github.com:myname/myname.github.io.git
  ```

- 此目录下便有`myname.github.io`文件夹，把此文件夹中除了`.git`之外的所有文件删掉

- 把blog中所有文件复制到`myname.github.io` 文件夹中，其中会提示是否替换，选择**跳过**。

- 如果有`.gitignore`文件，把里面的内容修改成

  ```
  .DS_Store
  Thumbs.db
  db.json
  *.log
  node_modules/
  public/
  .deploy*/
  ```

  如果没有此文件，便在`git bash`中输入`touch .gitignore` 

- 在`myname.github.io` 文件夹中`右键 -> Git bash here`

- 创建一个叫hexo的分支并切换到这个分支上

  `git checkout -b hexo`
- 提交复制过来的文件到暂存区
  `git add --all`
- 提交
  `git commit -m "" `
- 推送分支到github 
  `git push --set-upstream origin hexo`
在github上可以看到 `branch`中有`master`和`hexo`，至此，已经成功。并且`hexo`中的文件便在`.gitirnore`所忽略而剩下需要备份的文件，

### 更新文章，修改主题等步骤

```
git checkout hexo #切换分支至hexo
```

```
hexo clean
hexo generate
hexo deploy
git add .
git commit -m ""
git push origin hexo
```
### 从github上还原
配置好基本的环境，npm install 安装依赖，然后克隆分支到本地
```
git clone -b hexo git@github.com:myname/myname.github.io.git
```



END

















