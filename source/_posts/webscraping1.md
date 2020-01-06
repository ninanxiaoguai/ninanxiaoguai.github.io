---
title: Webscraping-1
date: 2019-07-12 11:29:14
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

创建爬虫专题，完全出于自己的爱好兴趣，可能与学业无关。因此，所记录的会尽量精简，只作为我的学习笔记。

<!--more-->

建议环境：python3，jupyter notebook

### 初入

最初的样例如下，函数`urlopen(url)`：打开网站

```python
from urllib.request import urlopen
html = urlopen('http://pythonscraping.com/pages/page1.html')
print(html.read())
```

输出是这样的：

```html
b'<html>\n<head>\n<title>A Useful Page</title>\n</head>\n<body>\n<h1>An Interesting Title</h1>\n<div>\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n</div>\n</body>\n</html>\n
```



可以再通过`BeautifulSoup`对网站进行解析

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://www.pythonscraping.com/pages/page1.html')
bs = BeautifulSoup(html.read(), 'html.parser')
print(bs.h1)

output:
<h1>An Interesting Title</h1> 
```

其中，`bs`为：

```html
<html>
<head>
<title>A Useful Page</title>
</head>
<body>
<h1>An Interesting Title</h1>
<div>
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>
</body>
</html>
```

此网页的结构如下：

``` html
- html ->  <html><head>...</head><body>...</body></html>
  - head ->  <head><title>A Useful Page<title></head>
    - title ->  <title>A Useful Page</title>
- body ->  <body><h1>An Int...</h1><div>Lorem ip...</div></body>
  - h1 ->  <h1>An Interesting Title</h1>
  - div ->  <div>Lorem Ipsum dolor...</div>
```
因此对于这个实例，`bs.h1`、`bs.html.body.h1`、`bs.body.h1`、`bs.html.h1`，这四个的结果是相同的。

对于`BeautifulSoup`函数，第一个参数是指定的HTML文本，第二个参数是为了选择不同的解析器。其他的还有`lxml`、`html5lib`等，可以自行查询其利弊。

### 连接的可靠性与处理异常

网络是混乱的。数据格式很差，网站崩溃，关闭标签丢失。最令人沮丧的经历之一在web抓取运行，在你睡觉的时候来抓取数据，在第二天却发现爬虫因为一些意想不到的错误数据格式而停止执行。在这种情况下，你可能会想咒骂创建网站的开发人员的名字(以及格式奇怪的数据)，但是你真正应该责备的是您自己，因为你一开始就没有预料到异常。

爬虫的第一步，就可能会有异常出现：

```python
html = urlopen('http://www.pythonscraping.com/pages/page1.html'
```

- 在服务器上找不到该页面(或者检索时出错)。
- 找不到服务器

#### HTTPError

第一种情况，将返回一个`HTTPerror`，可能是404 Page Not Found，也可能是500 Internal Server Error等等。在所有这些情况下，`urlopen`函数都会抛出通用异常`HTTPError`，具体解决办法如下：

```python
from urllib.request import urlopen
from urllib.error import HTTPError
try:
    html = urlopen('http://www.pythonscraping.com/pages/page1.html')
except HTTPError as e:
    print(e)
    # return null, break, or do some other "Plan B"
else:
    # program continues. Note: If you return or break in the
    # exception catch, you do not need to use the "else" statement
```

如果返回HTTP错误代码，程序现在打印错误，并且不执行else语句下程序的其余部分。

#### URLError

##### no server

如果根本找不到服务器(例如，"http://www.pythonscraping.com" 宕机了，或者URL输入错误)，`urlopen`将抛出一个`URLError`。这表明根本无法访问任何服务器，而且由于远程服务器负责返回HTTP状态码，不能抛出`HTTPError`，必须捕获更严重的`URLError`。你可以添加一个检查，看看是不是这样:

```python
from urllib.request import urlopen
from urllib.error import HTTPError
from urllib.error import URLError
try:
    html = urlopen('https://pythonscrapingthisurldoesnotexist.com')
except HTTPError as e:
	print(e)
except URLError as e:
	print('The server could not be found!')
else:
	print('It Worked!')
    
output:
The server could not be found!

# be compared with HTTPError
# ”http://www.pythonscraping.com“ works well but no page1000
try:
    html = urlopen('http://www.pythonscraping.com/pages/page1000.html')
except HTTPError as e:
	print(e)         # this line runs
except URLError as e:
	print('The server could not be found!')
else:
	print('It Worked!')
output:
HTTP Error 404: Not Found    
```

##### no tag

当然，如果从服务器成功检索到页面，仍然存在页面上的内容不完全符合你的预期的问题。每次访问`BeautifulSoup`对象中的标记时，添加一个检查以确保标记确实存在是明智的。如果你试图访问一个不存在的标签，`BeautifulSoup`将返回一个没有对象。问题是：试图访问None对象本身上的标记将导致抛出`AttributeError`。

`print(bs.nonExistentTag)`，其中，`nonExistentTag`是一个虚构的标记，而不是`BeautifulSoup`函数的真实名称。返回一个None对象。这个对象是完全合理的处理和检查。如果不检查它，而是继续尝试在None对象上调用另一个函数，`print(bs.nonExistentTag.someTag)`就会出现问题，如下所示:

```python
AttributeError: 'NoneType' object has no attribute 'someTag'
```

对于no tag的这两种情况，最简单的处理方式：

```python
try:
	badContent = bs.nonExistingTag.anotherTag
except AttributeError as e:
	print('nonExistingTag was not found')
else:
	if badContent == None:
		print ('anotherTag was not found')
	else:
		print(badContent)
```

对每个错误的检查和处理一开始看起来确实很费力，但是很容易在代码中添加一些重组，从而降低编写的难度(更重要的是，降低阅读的难度)。例如，这段代码是我们用稍微不同的方式编写的相同的scraper:

```python
from urllib.request import urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup
def getTitle(url):
	try:
		html = urlopen(url)
	except HTTPError as e:
		return None
	try:
		bs = BeautifulSoup(html.read(), 'html.parser')
		title = bs.body.h1
	except AttributeError as e:
		return None
	return title
title = getTitle('http://www.pythonscraping.com/pages/page1.html')
if title == None:
	print('Title could not be found')
else:
	print(title)
```

在本例中，将创建一个`getTitle`函数，该函数将返回页面的标题，如果检索有问题，则返回一个None对象。在`getTitle`中，检查`HTTPError`，就像前面的示例一样，并将两个BeautifulSoup封装在一个try语句中。可以从这两行抛出`AttributeError`(如果服务器不存在、`html`将是一个None对象、`html.read()`将抛出`AttributeError`)。实际上，可以在一个try语句中包含任意多行，或者完全调用另一个函数，这是可以做到的。

以下为测试

```python
from urllib.request import urlopen
from urllib.error import HTTPError
from urllib.error import URLError
from bs4 import BeautifulSoup
def getTitle(url):
    try:
        html = urlopen(url)
    except URLError as e:
        return e
    except HTTPError as e:
        return e
    try:
        bs = BeautifulSoup(html.read(), 'html.parser')
        title = bs.body.h1
    except AttributeError as e:
        return e
    return title
title = getTitle('http://www.pythonscraping.com/pages/page1.html')
print(title)
output:
<h1>An Interesting Title</h1>

title = getTitle('http://www.pythonscraping11111.com/pages/page1.html')
print(title)
output:
<urlopen error [Errno 11001] getaddrinfo failed>

title = getTitle('http://www.pythonscraping.com/pages/page10000.html')
print(title)
output:
HTTP Error 404: Not Found
```

