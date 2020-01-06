---
title: WebScraping-19
date: 2019-08-21 14:24:43
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

偶然间看到一本书《Python3网络爬虫开发实战》，作者还特别地写了一系列的[博客](https://cuiqingcai.com/5500.html)，本篇论文，几乎参照他的博客写的，作为学习笔记。

<!--more-->

## urllib

python3的urllib库[官方文档](https://docs.python.org/3/library/urllib.html)，分为四个模块：

- request：它是最基本的HTTP 请求模块，可以用来模拟发送请求。就像在浏览器里输入网址然后回车一样，只需要给库方法传入URL 以及额外的参数，就可以模拟实现这个过程了。
- error：异常处理模块，如果出现请求错误， 我们可以捕获这些异常，然后进行重试或其他操作以保证程序不会意外终止。
- parse：一个工具模块，提供了许多URL 处理方法，比如拆分、解析、合并等。
- robotparser：主要是用来识别网站的robots.txt 文件，然后判断哪些网站可以爬，哪些网站不可以爬，它其实用得比较少。

### request

`urllib.request`模块提供了最基本的构造HTTP 请求的方法，利用它可以模拟浏览器的一个请求发起过程， 同时它还带有处理授权验证(authenticaton)、重定向(redirection) 、浏览器Cookies 以及其他内容。

#### urlopen

```python
import urllib.request
response = urllib.request.urlopen("https://www.python.org")
print(type(response))
```

输出的为：

```
<class 'http.client.HTTPResponse'>
```

可以发现，它是一个`HTTPResposne`类型的对象。它主要包含`read()`、`readinto()`、`getheader(name)`、`getheaders()`、`fileno()`等**方法**，以及`msg`、`version`、`status`、`reason`、`debuglevel`、`closed`等**属性**。

实例：

```python
import urllib.request
 
response = urllib.request.urlopen('https://www.python.org')
print(response.status)
print(response.getheaders())
print(response.getheader('Server'))

# 输出:
200
[('Server', 'nginx'), ('Content-Type', 'text/html; charset=utf-8'), ('X-Frame-Options', 'SAMEORIGIN'), ('X-Clacks-Overhead', 'GNU Terry Pratchett'), ('Content-Length', '47397'), ('Accept-Ranges', 'bytes'), ('Date', 'Mon, 01 Aug 2016 09:57:31 GMT'), ('Via', '1.1 varnish'), ('Age', '2473'), ('Connection', 'close'), ('X-Served-By', 'cache-lcy1125-LCY'), ('X-Cache', 'HIT'), ('X-Cache-Hits', '23'), ('Vary', 'Cookie'), ('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')]
nginx
```

可见，前两个输出分别输出了响应的状态码和响应的头信息，最后一个输出通过调用`getheader()`方法并传递一个参数`Server`获取了响应头中的`Server`值，结果是`nginx`，意思是服务器是用Nginx搭建的。

利用最基本的`urlopen()`方法，可以完成最基本的简单网页的GET请求抓取。

如果想给链接传递一些参数，该怎么实现呢？首先看一下`urlopen()`函数的API：

```python
urllib.request.urlopen(url, data=None, [timeout, ]*, cafile=None, capath=None, cadefault=**False**, context=None)
```

可以发现，除了第一个参数可以传递URL之外，我们还可以传递其他内容，比如`data`（附加数据）、`timeout`（超时时间）等。

下面我们详细说明下这几个参数的用法。

##### `data`参数

`data`参数是可选的。如果要添加该参数，并且如果它是字节流编码格式的内容，即`bytes`类型，则需要通过`bytes()`方法转化。另外，如果传递了这个参数，则它的请求方式就不再是GET方式，而是POST方式。

下面用实例来看一下：

```python
import urllib.parse
import urllib.request

data = bytes(urllib.parse.urlencode({'word': 'hello'}), encoding='utf8')
response = urllib.request.urlopen('http://httpbin.org/post', data=data)
print(response.read())
```

这里我们传递了一个参数`word`，值是`hello`。它需要被转码成`bytes`（字节流）类型。其中转字节流采用了`bytes()`方法，该方法的第一个参数需要是`str`（字符串）类型，需要用`urllib.parse`模块里的`urlencode()`方法来将参数字典转化为字符串；第二个参数指定编码格式，这里指定为`utf8`。

这里请求的站点是`httpbin.org`，它可以提供HTTP请求测试。本次我们请求的URL为`http://httpbin.org/post`，这个链接可以用来测试POST请求，它可以输出请求的一些信息，其中包含我们传递的`data`参数。

运行结果如下：

```
{
     "args": {},
     "data": "",
     "files": {},
     "form": {
         "word": "hello"
     },
     "headers": {
         "Accept-Encoding": "identity",
         "Content-Length": "10",
         "Content-Type": "application/x-www-form-urlencoded",
         "Host": "httpbin.org",
         "User-Agent": "Python-urllib/3.5"
     },
     "json": null,
     "origin": "123.124.23.253",
     "url": "http://httpbin.org/post"
}
```

我们传递的参数出现在了`form`字段中，这表明是模拟了表单提交的方式，以POST方式传输数据。

##### `timeout`参数

`timeout`参数用于设置超时时间，单位为秒，意思就是如果请求超出了设置的这个时间，还没有得到响应，就会抛出异常。如果不指定该参数，就会使用全局默认时间。它支持HTTP、HTTPS、FTP请求。

下面用实例来看一下：

```python
import urllib.request
 
response = urllib.request.urlopen('http://httpbin.org/get', timeout=1)
print(response.read())
```

运行结果如下：

```
---------------------------------------------------------------------------
timeout                                   Traceback (most recent call last)
<ipython-input-16-59340fde1030> in <module>
----> 1 response = urllib.request.urlopen('http://httpbin.org/get', timeout=1)

D:\Anaconda3\lib\urllib\request.py in urlopen(url, data, timeout, cafile, capath, cadefault, context)
...
timeout: timed out
```

这里我们设置超时时间是1秒。程序1秒过后，服务器依然没有响应，于是抛出了`URLError`异常。该异常属于`urllib.error`模块，错误原因是超时。

因此，可以通过设置这个超时时间来控制一个网页如果长时间未响应，就跳过它的抓取。这可以利用`try except`语句来实现，相关代码如下：

```python
import socket
import urllib.request
import urllib.error
 
try:
    response = urllib.request.urlopen('http://httpbin.org/get', timeout=0.1)
except urllib.error.URLError as e:
    if isinstance(e.reason, socket.timeout):
        print('TIME OUT')
```

这里我们请求了`http://httpbin.org/get`测试链接，设置超时时间是0.1秒，然后捕获了`URLError`异常，接着判断异常是`socket.timeout`类型（意思就是超时异常），从而得出它确实是因为超时而报错，打印输出了`TIME OUT`。

运行结果如下：

```
TIME OUT
```

按照常理来说，0.1秒内基本不可能得到服务器响应，因此输出了`TIME OUT`的提示。

通过设置`timeout`这个参数来实现超时处理，有时还是很有用的。

##### 其他

初了`data`参数和`timeout`参数外，还有`context`参数，它必须是`ssl.SSLContext`类型，用来指定SSL设置。

此外，`cafile`和`capath`这两个参数分别指定CA证书和它的路径，这个在请求HTTPS链接时会有用。

`cadefault`参数现在已经弃用了，其默认值为`False`。

前面讲解了`urlopen()`方法的用法，通过这个最基本的方法，我们可以完成简单的请求和网页抓取。若需更加详细的信息，可以参见[官方文档](https://docs.python.org/3/library/urllib.request.html)。

#### Request

我们知道利用`urlopen()`方法可以实现最基本请求的发起，但这几个简单的参数并不足以构建一个完整的请求。如果请求中需要加入Headers等信息，就可以利用更强大的`Request`类来构建。

首先，我们用实例来感受一下`Request`的用法：

```python
import urllib.request
 
request = urllib.request.Request('https://python.org')
response = urllib.request.urlopen(request)
print(response.read().decode('utf-8'))
```

可以发现，我们依然是用`urlopen()`方法来发送这个请求，只不过这次该方法的参数不再是URL，而是一个`Request`类型的对象。通过构造这个**数据结构**，一方面我们可以将请求独立成一个对象，另一方面可更加丰富和灵活地配置参数。

下面我们看一下`Request`可以通过怎样的参数来构造，它的构造方法如下：

```python
class urllib.request.Request(url, data=None, headers={}, origin_req_host=None, unverifiable=False, method=None)
```

- 第一个参数`url`用于请求URL，这是必传参数，其他都是可选参数。
- 第二个参数`data`如果要传，必须传`bytes`（字节流）类型的。如果它是字典，可以先用`urllib.parse`模块里的`urlencode()`编码。
- 第三个参数`headers`是一个字典，它就是请求头，我们可以在构造请求时通过`headers`参数直接构造，也可以通过调用请求实例的`add_header()`方法添加。

添加请求头最常用的用法就是通过修改`User-Agent`来伪装浏览器，默认的`User-Agent`是Python-urllib，我们可以通过修改它来伪装浏览器。比如要伪装火狐浏览器，你可以把它设置为：

```
Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11
```

- 第四个参数`origin_req_host`指的是请求方的host名称或者IP地址。
- 第五个参数`unverifiable`表示这个请求是否是无法验证的，默认是`False`，意思就是说用户没有足够权限来选择接收这个请求的结果。例如，我们请求一个HTML文档中的图片，但是我们没有自动抓取图像的权限，这时unverifiable`的值就是`True`。
- 第六个参数`method`是一个字符串，用来指示请求使用的方法，比如GET、POST和PUT等。

下面我们传入多个参数构建请求来看一下：

```python
from urllib import request, parse
 
url = 'http://httpbin.org/post'
headers = {
    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)',
    'Host': 'httpbin.org'
}
dict = {
    'name': 'Germey'
}
data = bytes(parse.urlencode(dict), encoding='utf8')
req = request.Request(url=url, data=data, headers=headers, method='POST')
response = request.urlopen(req)
print(response.read().decode('utf-8'))
```

这里我们通过4个参数构造了一个请求，其中`url`即请求URL，`headers`中指定了`User-Agent`和`Host`，参数`data`用`urlencode()`和`bytes()`方法转成字节流。另外，指定了请求方式为POST。

运行结果如下：

```
{
  "args": {},
  "data": "",
  "files": {},
  "form": {
    "name": "Germey"
  },
  "headers": {
    "Accept-Encoding": "identity",
    "Content-Length": "11",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "httpbin.org",
    "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)"
  },
  "json": null,
  "origin": "117.179.104.211, 117.179.104.211",
  "url": "https://httpbin.org/post"
}
```

观察结果可以发现，我们成功设置了`data`、`headers`和`method`。

另外，`headers`也可以用`add_header()`方法来添加：

```python
req = request.Request(url=url, data=data, method='POST')
req.add_header('User-Agent', 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)')
```

如此一来，我们就可以更加方便地构造请求，实现请求的发送啦。

#### 高级用法

在上面的过程中，我们虽然可以构造请求，但是对于一些更高级的操作（比如Cookies处理、代理设置等），我们该怎么办呢？

接下来，就需要更强大的工具Handler登场了。简而言之，我们可以把它理解为各种处理器，有专门处理登录验证的，有处理Cookies的，有处理代理设置的。利用它们，我们几乎可以做到HTTP请求中所有的事情。

首先，介绍一下`urllib.request`模块里的`BaseHandler`类，它是所有其他`Handler`的父类，它提供了最基本的方法，例如`default_open()`、`protocol_request()`等。

接下来，就有各种`Handler`子类继承这个`BaseHandler`类，举例如下。

- **HTTPDefaultErrorHandler**：用于处理HTTP响应错误，错误都会抛出`HTTPError`类型的异常。
- **HTTPRedirectHandler**：用于处理重定向。
- **HTTPCookieProcessor**：用于处理Cookies。
- **ProxyHandler**：用于设置代理，默认代理为空。
- **HTTPPasswordMgr**：用于管理密码，它维护了用户名和密码的表。
- **HTTPBasicAuthHandler**：用于管理认证，如果一个链接打开时需要认证，那么可以用它来解决认证问题。

另外，还有其他的`Handler`类，这里就不一一列举了，详情可以参考[官方文档](https://docs.python.org/3/library/urllib.request.html#urllib.request.BaseHandler)。

关于怎么使用它们，现在先不用着急，后面会有实例演示。

另一个比较重要的类就是`OpenerDirector`，我们可以称为`Opener`。我们之前用过`urlopen()`这个方法，实际上它就是urllib为我们提供的一个`Opener`。

那么，为什么要引入`Opener`呢？因为需要实现更高级的功能。之前使用的`Request`和`urlopen()`相当于类库为你封装好了极其常用的请求方法，利用它们可以完成基本的请求，但是现在不一样了，我们需要实现更高级的功能，所以需要深入一层进行配置，使用更底层的实例来完成操作，所以这里就用到了`Opener`。

`Opener`可以使用`open()`方法，返回的类型和`urlopen()`如出一辙。那么，它和`Handler`有什么关系呢？简而言之，就是利用`Handler`来构建`Opener`。

下面用几个实例来看看它们的用法。

有些网站在打开时就会弹出提示框，直接提示你输入用户名和密码，验证成功后才能查看页面，如图3-2所示。

![](WebScraping19\1.jpg)

那么，如果要请求这样的页面，该怎么办呢？借助`HTTPBasicAuthHandler`就可以完成，相关代码如下：

```python
from urllib.request import HTTPPasswordMgrWithDefaultRealm, HTTPBasicAuthHandler, build_opener
from urllib.error import URLError
 
username = 'username'
password = 'password'
url = 'http://localhost:5000/'
 
p = HTTPPasswordMgrWithDefaultRealm()
p.add_password(None, url, username, password)
auth_handler = HTTPBasicAuthHandler(p)
opener = build_opener(auth_handler)
 
try:
    result = opener.open(url)
    html = result.read().decode('utf-8')
    print(html)
except URLError as e:
    print(e.reason)
```

这里首先实例化`HTTPBasicAuthHandler`对象，其参数是`HTTPPasswordMgrWithDefaultRealm`对象，它利用`add_password()`添加进去用户名和密码，这样就建立了一个处理验证的`Handler`。

接下来，利用这个`Handler`并使用`build_opener()`方法构建一个`Opener`，这个`Opener`在发送请求时就相当于已经验证成功了。

接下来，利用`Opener`的`open()`方法打开链接，就可以完成验证了。这里获取到的结果就是验证后的页面源码内容。



##### 代理

```python
from urllib.error import URLError
from urllib.request import ProxyHandler, build_opener
 
proxy_handler = ProxyHandler({
    'http': 'http://127.0.0.1:9743',
    'https': 'https://127.0.0.1:9743'
})
opener = build_opener(proxy_handler)
try:
    response = opener.open('https://www.baidu.com')
    print(response.read().decode('utf-8'))
except URLError as e:
    print(e.reason)
```

这里我们在本地搭建了一个代理，它运行在9743端口上。

这里使用了`ProxyHandler`，其参数是一个字典，键名是协议类型（比如HTTP或者HTTPS等），键值是代理链接，可以添加多个代理。

然后，利用这个Handler及`build_opener()`方法构造一个`Opener`，之后发送请求即可。

#### Cookies

Cookies的处理就需要相关的`Handler`了。

我们先用实例来看看怎样将网站的Cookies获取下来，相关代码如下：

```python
import http.cookiejar, urllib.request
 
cookie = http.cookiejar.CookieJar()
handler = urllib.request.HTTPCookieProcessor(cookie)
opener = urllib.request.build_opener(handler)
response = opener.open('http://www.baidu.com')
for item in cookie:
    print(item.name+"="+item.value)
```

先，我们必须声明一个`CookieJar`对象。接下来，就需要利用`HTTPCookieProcessor`来构建一个`Handler`，最后利用`build_opener()`方法构建出`Opener`，执行`open()`函数即可。

运行结果如下:

```python
BAIDUID=32ED45BB4CAA948553F9E9C25E67DF57:FG=1
BIDUPSID=32ED45BB4CAA948553F9E9C25E67DF57
H_PS_PSSID=1420_21122_18560_29523_29519_29098_29568_29220_29461
PSTM=1566277884
delPer=0
BDSVRTM=0
BD_HOME=0
```

可以看到，这里输出了每条Cookie的名称和值。

不过既然能输出，那可不可以输出成文件格式呢？我们知道Cookies实际上也是以文本形式保存的。

答案当然是肯定的，这里通过下面的实例来看看：

```python
filename = 'cookies.txt'
cookie = http.cookiejar.MozillaCookieJar(filename)
handler = urllib.request.HTTPCookieProcessor(cookie)
opener = urllib.request.build_opener(handler)
response = opener.open('http://www.baidu.com')
cookie.save(ignore_discard=True, ignore_expires=True)
```

这时`CookieJar`就需要换成`MozillaCookieJar`，它在生成文件时会用到，是`CookieJar`的子类，可以用来处理Cookies和文件相关的事件，比如读取和保存Cookies，可以将Cookies保存成Mozilla型浏览器的Cookies格式。

运行之后，可以发现生成了一个cookies.txt文件，其内容如下：

```
# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file!  Do not edit.

.baidu.com	TRUE	/	FALSE	3713761816	BAIDUID	A1EB1A2981419DCB5E77E799ACECE43C:FG=1
.baidu.com	TRUE	/	FALSE	3713761816	BIDUPSID	A1EB1A2981419DCB5E77E799ACECE43C
.baidu.com	TRUE	/	FALSE		H_PS_PSSID	1465_21100_29073_29523_29520_29099_29568_29221_29458_29588
.baidu.com	TRUE	/	FALSE	3713761816	PSTM	1566278169
.baidu.com	TRUE	/	FALSE		delPer	0
www.baidu.com	FALSE	/	FALSE		BDSVRTM	0
www.baidu.com	FALSE	/	FALSE		BD_HOME	0
```

另外，`LWPCookieJar`同样可以读取和保存Cookies，但是保存的格式和`MozillaCookieJar`不一样，它会保存成libwww-perl(LWP)格式的Cookies文件。

要保存成LWP格式的Cookies文件，可以在声明时就改为：

```python
cookie = http.cookiejar.LWPCookieJar(filename)
```

由此看来，生成的格式还是有比较大差异的。

那么，生成了Cookies文件后，怎样从文件中读取并利用呢？

下面我们以`LWPCookieJar`格式为例来看一下：

```python
cookie = http.cookiejar.LWPCookieJar()
cookie.load('cookies.txt', ignore_discard=True, ignore_expires=True)
handler = urllib.request.HTTPCookieProcessor(cookie)
opener = urllib.request.build_opener(handler)
response = opener.open('http://www.baidu.com')
print(response.read().decode('utf-8'))
```

可以看到，这里调用`load()`方法来读取本地的Cookies文件，获取到了Cookies的内容。不过前提是我们首先生成了LWPCookieJar格式的Cookies，并保存成文件，然后读取Cookies之后使用同样的方法构建Handler和Opener即可完成操作。

运行结果正常的话，会输出百度网页的源代码。

通过上面的方法，我们可以实现绝大多数请求功能的设置了。

这便是urllib库中`request`模块的基本用法，如果想实现更多的功能，可以参考[官方文档](https://docs.python.org/3/library/urllib.request.html#basehandler-objects)。



### error

如果出现了异常，该怎么办呢？这时如果不处理这些异常，程序很可能因报错而终止运行，所以异常处理还是十分有必要的。

urllib的`error`模块定义了由`request`模块产生的异常。如果出现了问题，`request`模块便会抛出`error`模块中定义的异常。

####  URLError

URLError类来自urllib库的error模块，它继承自OSError类，是error异常模块的基类，由request模块生的异常都可以通过捕获这个类来处理。

它具有一个属性reason，即返回错误的原因。

下面用一个实例来看一下：

```python
from urllib import request, error
try:
    response = request.urlopen('http://cuiqingcai.com/index.htm')
except error.URLError as e:
    print(e.reason)
```

我们打开一个不存在的页面，照理来说应该会报错，但是这时我们捕获了URLError这个异常，运行结果如下：

```
Not Found
```

程序没有直接报错，而是输出了如上内容，这样通过如上操作，我们就可以避免程序异常终止，同时异常得到了有效处理。

#### HTTPError

它是`URLError`的子类，专门用来处理HTTP请求错误，比如认证请求失败等。它有如下3个属性。

- **code**：返回HTTP状态码，比如404表示网页不存在，500表示服务器内部错误等。
- **reason**：同父类一样，用于返回错误的原因。
- **headers**：返回请求头。

下面我们用几个实例来看看：

```python
from urllib import request,error
try:
    response = request.urlopen('http://cuiqingcai.com/index.htm')
except error.HTTPError as e:
    print(e.reason, e.code, e.headers, sep='\n')
```

运行结果如下：

```
Not Found
404
Server: nginx/1.10.3 (Ubuntu)
Date: Wed, 21 Aug 2019 06:42:29 GMT
Content-Type: text/html; charset=UTF-8
Transfer-Encoding: chunked
Connection: close
Set-Cookie: PHPSESSID=jjamgq0r0ts5rur6ab5fjtp140; path=/
Pragma: no-cache
Vary: Cookie
Expires: Wed, 11 Jan 1984 05:00:00 GMT
Cache-Control: no-cache, must-revalidate, max-age=0
Link: <https://cuiqingcai.com/wp-json/>; rel="https://api.w.org/"
```

依然是同样的网址，这里捕获了`HTTPError`异常，输出了`reason`、`code`和`headers`属性。

因为`URLError`是`HTTPError`的父类，所以可以先选择捕获子类的错误，再去捕获父类的错误，所以上述代码更好的写法如下：

```python
from urllib import request, error
 
try:
    response = request.urlopen('http://cuiqingcai.com/index.htm')
except error.HTTPError as e:
    print(e.reason, e.code, e.headers, sep='\n')
except error.URLError as e:
    print(e.reason)
else:
    print('Request Successfully')
```

这样就可以做到先捕获`HTTPError`，获取它的错误状态码、原因、`headers`等信息。如果不是`HTTPError`异常，就会捕获`URLError`异常，输出错误原因。最后，用`else`来处理正常的逻辑。这是一个较好的异常处理写法。

有时候，`reason`属性返回的不一定是字符串，也可能是一个对象。再看下面的实例：

```python
import socket
import urllib.request
import urllib.error
 
try:
    response = urllib.request.urlopen('https://www.baidu.com', timeout=0.01)
except urllib.error.URLError as e:
    print(type(e.reason))
    if isinstance(e.reason, socket.timeout):
        print('TIME OUT')
```

这里我们直接设置超时时间来强制抛出`timeout`异常。

运行结果如下：

```
<class 'socket.timeout'>
TIME OUT
```

可以发现，`reason`属性的结果是`socket.timeout`类。所以，这里我们可以用`isinstance()`方法来判断它的类型，作出更详细的异常判断。

本节中，我们讲述了`error`模块的相关用法，通过合理地捕获异常可以做出更准确的异常判断，使程序更加稳健。

### parse

前面说过，urllib库里还提供了`parse`这个模块，它定义了处理URL的标准接口，例如实现URL各部分的抽取、合并以及链接转换。它支持如下协议的URL处理：file、ftp、gopher、hdl、http、https、imap、mailto、 mms、news、nntp、prospero、rsync、rtsp、rtspu、sftp、 sip、sips、snews、svn、svn+ssh、telnet和wais。本节中，我们介绍一下该模块中常用的方法来看一下它的便捷之处。

#### urlparse()

该方法可以实现URL的识别和分段，这里先用一个实例来看一下：

```python
from urllib.parse import urlparse
 
result = urlparse('http://www.baidu.com/index.html;user?id=5#comment')
print(type(result), result)
```


这里我们利用`urlparse()`方法进行了一个URL的解析。首先，输出了解析结果的类型，然后将结果也输出出来。

运行结果如下：

```python
<class 'urllib.parse.ParseResult'> ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html', params='user', query='id=5', fragment='comment')
```

可以看到，返回结果是一个`ParseResult`类型的对象，它包含6部分，分别是`scheme`、`netloc`、`path`、`params`、`query`和`fragment`。

观察一下该实例的URL：

```
http://www.baidu.com/index.html;user?id=5#comment
```

可以发现，`urlparse()`方法将其拆分成了6部分。大体观察可以发现，解析时有特定的分隔符。比如，://前面的就是`scheme`，代表协议；第一个/前面便是`netloc`，即域名；分号;前面是`params`，代表参数。

所以，可以得出一个标准的链接格式，具体如下：

```
scheme://netloc/path;parameters?query#fragment
```

一个标准的URL都会符合这个规则，利用`urlparse()`方法可以将它拆分开来。

除了这种最基本的解析方式外，`urlparse()`方法还有其他配置吗？接下来，看一下它的API用法：

```python
urllib.parse.urlparse(urlstring, scheme='', allow_fragments=True)
```

可以看到，它有3个参数。

- **urlstring**：这是必填项，即待解析的URL。
- **scheme**：它是默认的协议（比如`http`或`https`等）。假如这个链接没有带协议信息，会将这个作为默认的协议。我们用实例来看一下：

```python
from urllib.parse import urlparse
 
result = urlparse('www.baidu.com/index.html;user?id=5#comment', scheme='https')
print(result)
```

运行结果如下：

```
ParseResult(scheme='https', netloc='', path='www.baidu.com/index.html', params='user', query='id=5', fragment='comment')
```

可以发现，我们提供的URL没有包含最前面的`scheme`信息，但是通过指定默认的`scheme`参数，返回的结果是`https`。

假设我们带上了`scheme`：

```python
	result = urlparse('http://www.baidu.com/index.html;user?id=5#comment', scheme='https')
```

则结果如下：

```
ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html', params='user', query='id=5', fragment='comment')
```



可见，`scheme`参数只有在URL中不包含`scheme`信息时才生效。如果URL中有`scheme`信息，就会返回解析出的`scheme`。

- **allow_fragments**：即是否忽略`fragment`。如果它被设置为`False`，`fragment`部分就会被忽略，它会被解析为`path`、`parameters`或者`query`的一部分，而`fragment`部分为空。下面我们用实例来看一下：

```python
from urllib.parse import urlparse
 
result = urlparse('http://www.baidu.com/index.html;user?id=5#comment', allow_fragments=False)
print(result)
```

运行结果如下：

```
ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html', params='user', query='id=5#comment', fragment='')
```

假设URL中不包含`params`和`query`，我们再通过实例看一下：

```python
from urllib.parse import urlparse
 
result = urlparse('http://www.baidu.com/index.html#comment', allow_fragments=False)
print(result)
```

运行结果如下：

```
ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html#comment', params='', query='', fragment='')
```

可以发现，当URL中不包含`params`和`query`时，`fragment`便会被解析为`path`的一部分。

返回结果`ParseResult`实际上是一个元组，我们可以用索引顺序来获取，也可以用属性名获取。示例如下：

```python
from urllib.parse import urlparse
 
result = urlparse('http://www.baidu.com/index.html#comment', allow_fragments=False)
print(result.scheme, result[0], result.netloc, result[1], sep='\n')
```

这里我们分别用索引和属性名获取了`scheme`和`netloc`，其运行结果如下：

```
http
http
www.baidu.com
www.baidu.com
```

可以发现，二者的结果是一致的，两种方法都可以成功获取。

#### urlsplit()

这个方法和`urlparse()`方法非常相似，只不过它不再单独解析`params`这一部分，只返回5个结果。上面例子中的`params`会合并到`path`中。示例如下：

```python
from urllib.parse import urlsplit
 
result = urlsplit('http://www.baidu.com/index.html;user?id=5#comment')
print(result)
```

运行结果如下：

```
SplitResult(scheme='http', netloc='www.baidu.com', path='/index.html;user', query='id=5', fragment='comment')
```

可以发现，返回结果是`SplitResult`，它其实也是一个元组类型，既可以用属性获取值，也可以用索引来获取。示例如下：

```python
from urllib.parse import urlsplit
 
result = urlsplit('http://www.baidu.com/index.html;user?id=5#comment')
print(result.scheme, result[0])
```

运行结果如下：

```
http http
```

#### urlunsplit()

与`urlunparse()`类似，它也是将链接各个部分组合成完整链接的方法，传入的参数也是一个可迭代对象，例如列表、元组等，唯一的区别是长度必须为5。示例如下：

```python
from urllib.parse import urlunsplit
 
data = ['http', 'www.baidu.com', 'index.html', 'a=6', 'comment']
print(urlunsplit(data))
```

运行结果如下：

```
http://www.baidu.com/index.html?a=6#comment
```

#### urljoin()

有了`urlunparse()`和`urlunsplit()`方法，我们可以完成链接的合并，不过前提必须要有特定长度的对象，链接的每一部分都要清晰分开。

此外，生成链接还有另一个方法，那就是`urljoin()`方法。我们可以提供一个`base_url`（基础链接）作为第一个参数，将新的链接作为第二个参数，该方法会分析`base_url`的`scheme`、`netloc`和`path`这3个内容并对新链接缺失的部分进行补充，最后返回结果。

下面通过几个实例看一下：

```python
from urllib.parse import urljoin
 
print(urljoin('http://www.baidu.com', 'FAQ.html'))
print(urljoin('http://www.baidu.com', 'https://cuiqingcai.com/FAQ.html'))
print(urljoin('http://www.baidu.com/about.html', 'https://cuiqingcai.com/FAQ.html'))
print(urljoin('http://www.baidu.com/about.html', 'https://cuiqingcai.com/FAQ.html?question=2'))
print(urljoin('http://www.baidu.com?wd=abc', 'https://cuiqingcai.com/index.php'))
print(urljoin('http://www.baidu.com', '?category=2#comment'))
print(urljoin('www.baidu.com', '?category=2#comment'))
print(urljoin('www.baidu.com#comment', '?category=2'))
```

运行结果如下：

```
http://www.baidu.com/FAQ.html
https://cuiqingcai.com/FAQ.html
https://cuiqingcai.com/FAQ.html
https://cuiqingcai.com/FAQ.html?question=2
https://cuiqingcai.com/index.php
http://www.baidu.com?category=2#comment
www.baidu.com?category=2#comment
www.baidu.com?category=2
```

可以发现，`base_url`提供了三项内容`scheme`、`netloc`和`path`。如果这3项在新的链接里不存在，就予以补充；如果新的链接存在，就使用新的链接的部分。而`base_url`中的`params`、`query`和`fragment`是不起作用的。

通过`urljoin()`方法，我们可以轻松实现链接的解析、拼合与生成。

#### urlencode()

这里我们再介绍一个常用的方法——`urlencode()`，它在构造GET请求参数的时候非常有用，示例如下：

```python
from urllib.parse import urlencode
 
params = {
    'name': 'germey',
    'age': 22
}
base_url = 'http://www.baidu.com?'
url = base_url + urlencode(params)
print(url)
```

这里首先声明了一个字典来将参数表示出来，然后调用`urlencode()`方法将其序列化为GET请求参数。

运行结果如下：

```
http://www.baidu.com?name=germey&age=22
```

可以看到，参数就成功地由字典类型转化为GET请求参数了。

这个方法非常常用。有时为了更加方便地构造参数，我们会事先用字典来表示。要转化为URL的参数时，只需要调用该方法即可。

#### parse_qs()

有了序列化，必然就有反序列化。如果我们有一串GET请求参数，利用`parse_qs()`方法，就可以将它转回字典，示例如下：

```python
from urllib.parse import parse_qs
 
query = 'name=germey&age=22'
print(parse_qs(query))
```

运行结果如下：

```
1{'name': ['germey'], 'age': ['22']}
```

#### parse_qsl()

另外，还有一个`parse_qsl()`方法，它用于将参数转化为元组组成的列表，示例如下：

```python
from urllib.parse import parse_qsl
 
query = 'name=germey&age=22'
print(parse_qsl(query))
```

运行结果如下：

```
[('name', 'germey'), ('age', '22')]
```

可以看到，运行结果是一个列表，而列表中的每一个元素都是一个元组，元组的第一个内容是参数名，第二个内容是参数值。

#### quote()

该方法可以将内容转化为URL编码的格式。URL中带有中文参数时，有时可能会导致乱码的问题，此时用这个方法可以将中文字符转化为URL编码，示例如下：

```python
from urllib.parse import quote
 
keyword = '壁纸'
url = 'https://www.baidu.com/s?wd=' + quote(keyword)
print(url)
```

这里我们声明了一个中文的搜索文字，然后用`quote()`方法对其进行URL编码，最后得到的结果如下：

```
https://www.baidu.com/s?wd=%E5%A3%81%E7%BA%B8
```

可以看到，利用`unquote()`方法可以方便地实现解码。

本节中，我们介绍了`parse`模块的一些常用URL处理方法。有了这些方法，我们可以方便地实现URL的解析和构造，建议熟练掌握。

### Robots

Robots协议也称作爬虫协议、机器人协议，它的全名叫作网络爬虫排除标准（Robots Exclusion Protocol），用来告诉爬虫和搜索引擎哪些页面可以抓取，哪些不可以抓取。它通常是一个叫作robots.txt的文本文件，一般放在网站的根目录下。

#### robots.txt

当搜索爬虫访问一个站点时，它首先会检查这个站点根目录下是否存在robots.txt文件，如果存在，搜索爬虫会根据其中定义的爬取范围来爬取。如果没有找到这个文件，搜索爬虫便会访问所有可直接访问的页面。

下面我们看一个robots.txt的样例：

```
User-agent: *
Disallow: /
Allow: /public/
```

这实现了对所有搜索爬虫只允许爬取public目录的功能，将上述内容保存成robots.txt文件，放在网站的根目录下，和网站的入口文件（比如index.php、index.html和index.jsp等）放在一起。

上面的`User-agent`描述了搜索爬虫的名称，这里将其设置为*则代表该协议对任何爬取爬虫有效。比如，我们可以设置：

```
User-agent: Baiduspider
```

这就代表我们设置的规则对百度爬虫是有效的。如果有多条`User-agent`记录，则就会有多个爬虫会受到爬取限制，但至少需要指定一条。

`Disallow`指定了不允许抓取的目录，比如上例子中设置为/则代表不允许抓取所有页面。

`Allow`一般和`Disallow`一起使用，一般不会单独使用，用来排除某些限制。现在我们设置为`/public/`，则表示所有页面不允许抓取，但可以抓取public目录。

下面我们再来看几个例子。禁止所有爬虫访问任何目录的代码如下：

```
User-agent: * 
Disallow: /
```

允许所有爬虫访问任何目录的代码如下：

```
User-agent: *
Disallow:
```

另外，直接把robots.txt文件留空也是可以的。

禁止所有爬虫访问网站某些目录的代码如下：

```
User-agent: *
Disallow: /private/
Disallow: /tmp/
```

只允许某一个爬虫访问的代码如下：

```
User-agent: WebCrawler
Disallow:
User-agent: *
Disallow: /
```

这些是robots.txt的一些常见写法。

#### name of Spider

大家可能会疑惑，爬虫名是哪儿来的？为什么就叫这个名？其实它是有固定名字的了，比如百度的就叫作BaiduSpider。表3-1列出了一些常见的搜索爬虫的名称及对应的网站。

|  爬虫名称   |   名称    |       网站        |
| :---------: | :-------: | :---------------: |
| BaiduSpider |   百度    |   www.baidu.com   |
|  Googlebot  |   谷歌    |  www.google.com   |
|  360Spider  |  360搜索  |    www.so.com     |
|  YodaoBot   |   有道    |  www.youdao.com   |
| ia_archiver |   Alexa   |   www.alexa.cn    |
|   Scooter   | altavista | www.altavista.com |

####  robotparser

了解Robots协议之后，我们就可以使用`robotparser`模块来解析robots.txt了。该模块提供了一个类`RobotFileParser`，它可以根据某网站的robots.txt文件来判断一个爬取爬虫是否有权限来爬取这个网页。

该类用起来非常简单，只需要在构造方法里传入robots.txt的链接即可。首先看一下它的声明：

```python
urllib.robotparser.RobotFileParser(url='')
```

当然，也可以在声明时不传入，默认为空，最后再使用`set_url()`方法设置一下也可。

下面列出了这个类常用的几个方法。

- **set_url()**：用来设置robots.txt文件的链接。如果在创建`RobotFileParser`对象时传入了链接，那么就不需要再使用这个方法设置了。
- **read()**：读取robots.txt文件并进行分析。注意，这个方法执行一个读取和分析操作，如果不调用这个方法，接下来的判断都会为`False`，所以一定记得调用这个方法。这个方法不会返回任何内容，但是执行了读取操作。
- **parse()**：用来解析robots.txt文件，传入的参数是robots.txt某些行的内容，它会按照robots.txt的语法规则来分析这些内容。
- **can_fetch()**：该方法传入两个参数，第一个是`User-agent`，第二个是要抓取的URL。返回的内容是该搜索引擎是否可以抓取这个URL，返回结果是`True`或`False`。
- **mtime()**：返回的是上次抓取和分析robots.txt的时间，这对于长时间分析和抓取的搜索爬虫是很有必要的，你可能需要定期检查来抓取最新的robots.txt。
- **modified()**：它同样对长时间分析和抓取的搜索爬虫很有帮助，将当前时间设置为上次抓取和分析robots.txt的时间。

下面我们用实例来看一下：

```python
from urllib.robotparser import RobotFileParser
 
rp = RobotFileParser()
rp.set_url('http://www.jianshu.com/robots.txt')
rp.read()
print(rp.can_fetch('*', 'http://www.jianshu.com/p/b67554025d7d'))
print(rp.can_fetch('*', "http://www.jianshu.com/search?q=python&page=1&type=collections"))
```

这里以简书为例，首先创建`RobotFileParser`对象，然后通过`set_url()`方法设置了robots.txt的链接。当然，不用这个方法的话，可以在声明时直接用如下方法设置：

```python
rp = RobotFileParser('http://www.jianshu.com/robots.txt')
```

接着利用`can_fetch()`方法判断了网页是否可以被抓取。

运行结果如下：

```
True
False
```

这里同样可以使用`parse()`方法执行读取和分析，示例如下：

```python
from urllib.robotparser import RobotFileParser
from urllib.request import urlopen
 
rp = RobotFileParser()
rp.parse(urlopen('http://www.jianshu.com/robots.txt').read().decode('utf-8').split('\n'))
print(rp.can_fetch('*', 'http://www.jianshu.com/p/b67554025d7d'))
print(rp.can_fetch('*', "http://www.jianshu.com/search?q=python&page=1&type=collections"))
```

运行结果一样：

```
True
False
```

## request

上一节中，我们了解了urllib的基本用法，但是其中确实有不方便的地方，比如处理网页验证和Cookies时，需要写`Opener`和`Handler`来处理。为了更加方便地实现这些操作，就有了更为强大的库requests，有了它，Cookies、登录验证、代理设置等操作都不是事儿。

接下来，让我们领略一下它的强大之处吧。

### 实例引入

urllib库中的`urlopen()`方法实际上是以GET方式请求网页，而requests中相应的方法就是`get()`方法，是不是感觉表达更明确一些？下面通过实例来看一下：

```python
import requests
 
r = requests.get('https://www.baidu.com/')
print(type(r))
print(r.status_code)
print(type(r.text))
print(r.text)
print(r.cookies)
```

运行结果如下：

```
<class 'requests.models.Response'>
200
<class 'str'>
<!DOCTYPE html>
<!--STATUS OK--><html> <head><meta http-equiv=content-type content=text/html;charset=utf-8><meta http-equiv=X-UA-Compatible content=IE=Edge><meta content=always name=referrer><link rel=stylesheet type=text/css href=https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/bdorz/baidu.min.css><title>ç¾åº¦ä¸ä¸ï¼ä½ å°±ç¥é</title></head> <body link=#0000cc> <div id=wrapper> <div id=head> <div class=head_wrapper> <div class=s_form> <div class=s_form_wrapper> <div id=lg> <img hidefocus=true src=//www.baidu.com/img/bd_logo1.png width=270 height=129> </div> <form id=form name=f action=//www.baidu.com/s class=fm> <input type=hidden name=bdorz_come value=1> <input type=hidden name=ie value=utf-8> <input type=hidden name=f value=8> <input type=hidden name=rsv_bp value=1> <input type=hidden name=rsv_idx value=1> <input type=hidden name=tn value=baidu><span class="bg s_ipt_wr"><input id=kw name=wd class=s_ipt value maxlength=255 autocomplete=off autofocus=autofocus></span><span class="bg s_btn_wr"><input type=submit id=su value=ç¾åº¦ä¸ä¸ class="bg s_btn" autofocus></span> </form> </div> </div> <div id=u1> <a href=http://news.baidu.com name=tj_trnews class=mnav>æ°é»</a> <a href=https://www.hao123.com name=tj_trhao123 class=mnav>hao123</a> <a href=http://map.baidu.com name=tj_trmap class=mnav>å°å¾</a> <a href=http://v.baidu.com name=tj_trvideo class=mnav>è§é¢</a> <a href=http://tieba.baidu.com name=tj_trtieba class=mnav>è´´å§</a> <noscript> <a href=http://www.baidu.com/bdorz/login.gif?login&amp;tpl=mn&amp;u=http%3A%2F%2Fwww.baidu.com%2f%3fbdorz_come%3d1 name=tj_login class=lb>ç»å½</a> </noscript> <script>document.write('<a href="http://www.baidu.com/bdorz/login.gif?login&tpl=mn&u='+ encodeURIComponent(window.location.href+ (window.location.search === "" ? "?" : "&")+ "bdorz_come=1")+ '" name="tj_login" class="lb">ç»å½</a>');
                </script> <a href=//www.baidu.com/more/ name=tj_briicon class=bri style="display: block;">æ´å¤äº§å</a> </div> </div> </div> <div id=ftCon> <div id=ftConw> <p id=lh> <a href=http://home.baidu.com>å³äºç¾åº¦</a> <a href=http://ir.baidu.com>About Baidu</a> </p> <p id=cp>&copy;2017&nbsp;Baidu&nbsp;<a href=http://www.baidu.com/duty/>ä½¿ç¨ç¾åº¦åå¿è¯»</a>&nbsp; <a href=http://jianyi.baidu.com/ class=cp-feedback>æè§åé¦</a>&nbsp;äº¬ICPè¯030173å·&nbsp; <img src=//www.baidu.com/img/gs.gif> </p> </div> </div> </div> </body> </html>

<RequestsCookieJar[<Cookie BDORZ=27315 for .baidu.com/>]>
```

这里我们调用`get()`方法实现与`urlopen()`相同的操作，得到一个`Response`对象，然后分别输出了`Response`的类型、状态码、响应体的类型、内容以及Cookies。

通过运行结果可以发现，它的返回类型是`requests.models.Response`，响应体的类型是字符串`str`，Cookies的类型是`RequestsCookieJar`。

使用`get()`方法成功实现一个GET请求，这倒不算什么，更方便之处在于其他的请求类型依然可以用一句话来完成，示例如下：

```python
r = requests.post('http://httpbin.org/post')
r = requests.put('http://httpbin.org/put')
r = requests.delete('http://httpbin.org/delete')
r = requests.head('http://httpbin.org/get')
r = requests.options('http://httpbin.org/get')
```

这里分别用`post()`、`put()`、`delete()`等方法实现了POST、PUT、DELETE等请求。是不是比urllib简单太多了？

其实这只是冰山一角，更多的还在后面。

### GET 请求

#### 基本实例

首先，构建一个最简单的GET请求，请求的链接为`http://httpbin.org/get`，该网站会判断如果客户端发起的是GET请求的话，它返回相应的请求信息：

```python
import requests
 
r = requests.get('http://httpbin.org/get')
print(r.text)
```

运行结果如下：

```
{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Host": "httpbin.org", 
    "User-Agent": "python-requests/2.21.0"
  }, 
  "origin": "117.179.245.150, 117.179.245.150", 
  "url": "https://httpbin.org/get"
}
```

可以发现，我们成功发起了GET请求，返回结果中包含请求头、URL、IP等信息。

那么，对于GET请求，如果要附加额外的信息，一般怎样添加呢？比如现在想添加两个参数，其中`name`是`germey`，`age`是22。要构造这个请求链接，是不是要直接写成：

```python
r = requests.get('http://httpbin.org/get?name=germey&age=22')
```

这样也可以，但是是不是有点不人性化呢？一般情况下，这种信息数据会用字典来存储。那么，怎样来构造这个链接呢？

这同样很简单，利用`params`这个参数就好了，示例如下：

```python
import requests
 
data = {
    'name': 'germey',
    'age': 22
}
r = requests.get("http://httpbin.org/get", params=data)
print(r.text)
```

运行结果如下：

```
{
  "args": {
    "age": "22", 
    "name": "germey"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Host": "httpbin.org", 
    "User-Agent": "python-requests/2.21.0"
  }, 
  "origin": "117.179.245.150, 117.179.245.150", 
  "url": "https://httpbin.org/get?name=germey&age=22"
}
```

通过运行结果可以判断，请求的链接自动被构造成了：`http://httpbin.org/get?age=22&name=germey`。

另外，网页的返回类型实际上是`str`类型，但是它很特殊，是JSON格式的。所以，如果想直接解析返回结果，得到一个字典格式的话，可以直接调用`json()`方法。示例如下：

```python
import requests
 
r = requests.get("http://httpbin.org/get")
print(type(r.text))
print(r.json())
print(type(r.json()))
```

运行结果如下：

```
<class 'str'>
{'args': {}, 'headers': {'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate', 'Host': 'httpbin.org', 'User-Agent': 'python-requests/2.21.0'}, 'origin': '117.179.245.150, 117.179.245.150', 'url': 'https://httpbin.org/get'}
<class 'dict'>
```

可以发现，调用`json()`方法，就可以将返回结果是JSON格式的字符串转化为字典。

但需要注意的书，如果返回结果不是JSON格式，便会出现解析错误，抛出`json.decoder.JSONDecodeError`异常。

#### 抓取网页

上面的请求链接返回的是JSON形式的字符串，那么如果请求普通的网页，则肯定能获得相应的内容了。下面以“知乎”$\rightarrow$“发现”页面为例来看一下：

```python
import requests
import re
 
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
}
r = requests.get("https://www.zhihu.com/explore", headers=headers)
pattern = re.compile('explore-feed.*?question_link.*?>(.*?)</a>', re.S)
titles = re.findall(pattern, r.text)
print(titles)
```

这里我们加入了`headers`信息，其中包含了`User-Agent`字段信息，也就是浏览器标识信息。如果不加这个，知乎会禁止抓取。

接下来我们用到了最基础的正则表达式来匹配出所有的问题内容。关于正则表达式的相关内容，我们会在3.3节中详细介绍，这里作为实例来配合讲解。

运行结果如下：

```

```

#### 抓取二进制数据

在上面的例子中，我们抓取的是知乎的一个页面，实际上它返回的是一个HTML文档。如果想抓去图片、音频、视频等文件，应该怎么办呢？

图片、音频、视频这些文件本质上都是由二进制码组成的，由于有特定的保存格式和对应的解析方式，我们才可以看到这些形形色色的多媒体。所以，想要抓取它们，就要拿到它们的二进制码。

下面以GitHub的站点图标为例来看一下：

```python
import requests
 
r = requests.get("https://github.com/favicon.ico")
print(r.text)
print(r.content)
```

这里抓取的内容是站点图标，也就是在浏览器每一个标签上显示的小图标，

![](WebScraping19\2.png)

这里打印了`Response`对象的两个属性，一个是`text`，另一个是`content`。

运行结果如图3-4所示，其中前两行是`r.text`的结果，最后一行是`r.content`的结果。

![](WebScraping19\3.png)

可以注意到，前者出现了乱码，后者结果前带有一个`b`，这代表是`bytes`类型的数据。由于图片是二进制数据，所以前者在打印时转化为`str`类型，也就是图片直接转化为字符串，这理所当然会出现乱码。

接着，我们将刚才提取到的图片保存下来：

```python
import requests
 
r = requests.get("https://github.com/favicon.ico")
with open('favicon.ico', 'wb') as f:
    f.write(r.content)
```

这里用了`open()`方法，它的第一个参数是文件名称，第二个参数代表以二进制写的形式打开，可以向文件里写入二进制数据。

运行结束之后，可以发现在文件夹中出现了名为favicon.ico的图标，如图3-5所示。

![](WebScraping19\4.png)

同样地，音频和视频文件也可以用这种方法获取。

#### 添加headers

与`urllib.request`一样，我们也可以通过`headers`参数来传递头信息。

比如，在上面“知乎”的例子中，如果不传递`headers`，就不能正常请求：

```python
import requests
 
r = requests.get("https://www.zhihu.com/explore")
print(r.text)
```

运行结果如下：

```html
<html>
<head><title>400 Bad Request</title></head>
<body bgcolor="white">
<center><h1>400 Bad Request</h1></center>
<hr><center>openresty</center>
</body>
</html>
```

但如果加上`headers`并加上`User-Agent`信息，那就没问题了：

```python
<!doctype html>
<html lang="zh" data-hairline="true" data-theme="light"><head><meta name="description" property="og:description" content="有问题，上知乎。知乎，可信赖的问答社区，以让每个人高效获得可信赖的解答为使命。知乎凭借认真、专业和友善的社区氛围，结构化、易获得的优质内容，基于问答的内容生产方式和独特的社区机制，吸引、聚集了各行各业中大量的亲历者、内行人、领域专家、领域爱好者，将高质量的内容透过人的节点来成规模地生产和分享。用户通过问答等交流方式建立信任和连接，打造和提升个人影响力，并发现、获得新机会。"src="https://static.zhihu.com/heifetz/main.app.7c8634e8d9de8fd5d961.js"></script><script src="https://static.zhihu.com/heifetz/main.explore-routes.d628322decb4a68a77e7.js"></script></body></html>
```

当然，我们可以在`headers`这个参数中任意添加其他的字段信息。

#### POST请求

前面我们了解了最基本的GET请求，另外一种比较常见的请求方式是POST。使用`requests`实现POST请求同样非常简单，示例如下：

```python
import requests
 
data = {'name': 'germey', 'age': '22'}
r = requests.post("http://httpbin.org/post", data=data)
print(r.text)
```

这里还是请求`http://httpbin.org/post`，该网站可以判断如果请求是POST方式，就把相关请求信息返回。

运行结果如下：

```python
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "age": "22", 
    "name": "germey"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Content-Length": "18", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "python-requests/2.21.0"
  }, 
  "json": null, 
  "origin": "117.179.245.150, 117.179.245.150", 
  "url": "https://httpbin.org/post"
}
```

可以发现，我们成功获得了返回结果，其中`form`部分就是提交的数据，这就证明POST请求成功发送了。

#### 响应

发送请求后，得到的自然就是响应。在上面的实例中，我们使用`text`和`content`获取了响应的内容。此外，还有很多属性和方法可以用来获取其他信息，比如状态码、响应头、Cookies等。示例如下：

```python
import requests
 
r = requests.get('http://www.jianshu.com')
print(type(r.status_code), r.status_code)
print(type(r.headers), r.headers)
print(type(r.cookies), r.cookies)
print(type(r.url), r.url)
print(type(r.history), r.history)
```

这里分别打印输出`status_code`属性得到状态码，输出`headers`属性得到响应头，输出`cookies`属性得到Cookies，输出`url`属性得到URL，输出`history`属性得到请求历史。

运行结果如下：

```
<class 'int'> 403
<class 'requests.structures.CaseInsensitiveDict'> {'Server': 'Tengine', 'Content-Type': 'text/html', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Date': 'Wed, 21 Aug 2019 10:57:51 GMT', 'Vary': 'Accept-Encoding', 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload', 'Content-Encoding': 'gzip', 'x-alicdn-da-ups-status': 'endOs,0,403', 'Via': 'cache25.l2nu16-1[3,0], cache4.cn1252[27,0]', 'Timing-Allow-Origin': '*', 'EagleId': '6f28b09815663850714812872e'}
<class 'requests.cookies.RequestsCookieJar'> <RequestsCookieJar[]>
<class 'str'> https://www.jianshu.com/
<class 'list'> [<Response [301]>]
```

因为`session_id`过长，在此简写。可以看到，`headers`和`cookies`这两个属性得到的结果分别是`CaseInsensitiveDict`和`RequestsCookieJar`类型。

状态码常用来判断请求是否成功，而requests还提供了一个内置的状态码查询对象`requests.codes`，示例如下

```python
import requests
 
r = requests.get('http://www.jianshu.com')
exit() if not r.status_code == requests.codes.ok else print('Request Successfully')
```

这里通过比较返回码和内置的成功的返回码，来保证请求得到了正常响应，输出成功请求的消息，否则程序终止，这里我们用`requests.codes.ok`得到的是成功的状态码200。

那么，肯定不能只有`ok`这个条件码。下面列出了返回码和相应的查询条件：

```
# 信息性状态码
100: ('continue',),
101: ('switching_protocols',),
102: ('processing',),
103: ('checkpoint',),
122: ('uri_too_long', 'request_uri_too_long'),
 
# 成功状态码
200: ('ok', 'okay', 'all_ok', 'all_okay', 'all_good', '\\o/', '✓'),
201: ('created',),
202: ('accepted',),
203: ('non_authoritative_info', 'non_authoritative_information'),
204: ('no_content',),
205: ('reset_content', 'reset'),
206: ('partial_content', 'partial'),
207: ('multi_status', 'multiple_status', 'multi_stati', 'multiple_stati'),
208: ('already_reported',),
226: ('im_used',),
 
# 重定向状态码
300: ('multiple_choices',),
301: ('moved_permanently', 'moved', '\\o-'),
302: ('found',),
303: ('see_other', 'other'),
304: ('not_modified',),
305: ('use_proxy',),
306: ('switch_proxy',),
307: ('temporary_redirect', 'temporary_moved', 'temporary'),
308: ('permanent_redirect',
      'resume_incomplete', 'resume',), # These 2 to be removed in 3.0
 
# 客户端错误状态码
400: ('bad_request', 'bad'),
401: ('unauthorized',),
402: ('payment_required', 'payment'),
403: ('forbidden',),
404: ('not_found', '-o-'),
405: ('method_not_allowed', 'not_allowed'),
406: ('not_acceptable',),
407: ('proxy_authentication_required', 'proxy_auth', 'proxy_authentication'),
408: ('request_timeout', 'timeout'),
409: ('conflict',),
410: ('gone',),
411: ('length_required',),
412: ('precondition_failed', 'precondition'),
413: ('request_entity_too_large',),
414: ('request_uri_too_large',),
415: ('unsupported_media_type', 'unsupported_media', 'media_type'),
416: ('requested_range_not_satisfiable', 'requested_range', 'range_not_satisfiable'),
417: ('expectation_failed',),
418: ('im_a_teapot', 'teapot', 'i_am_a_teapot'),
421: ('misdirected_request',),
422: ('unprocessable_entity', 'unprocessable'),
423: ('locked',),
424: ('failed_dependency', 'dependency'),
425: ('unordered_collection', 'unordered'),
426: ('upgrade_required', 'upgrade'),
428: ('precondition_required', 'precondition'),
429: ('too_many_requests', 'too_many'),
431: ('header_fields_too_large', 'fields_too_large'),
444: ('no_response', 'none'),
449: ('retry_with', 'retry'),
450: ('blocked_by_windows_parental_controls', 'parental_controls'),
451: ('unavailable_for_legal_reasons', 'legal_reasons'),
499: ('client_closed_request',),
 
# 服务端错误状态码
500: ('internal_server_error', 'server_error', '/o\\', '✗'),
501: ('not_implemented',),
502: ('bad_gateway',),
503: ('service_unavailable', 'unavailable'),
504: ('gateway_timeout',),
505: ('http_version_not_supported', 'http_version'),
506: ('variant_also_negotiates',),
507: ('insufficient_storage',),
509: ('bandwidth_limit_exceeded', 'bandwidth'),
510: ('not_extended',),
511: ('network_authentication_required', 'network_auth', 'network_authentication')
```



比如，如果想判断结果是不是404状态，可以用`requests.codes.not_found`来比对。