---
title: WebScraping-12
date: 2019-08-02 00:17:14
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

JavaScript一直以来都是web爬行器的祸根。在internet的古老历史上，您可以保证向web服务器发出的请求将获取与用户发出相同请求时在web浏览器中看到的相同的数据。随着JavaScript和Ajax内容生成和加载变得越来越普遍，这种情况变得越来越不常见。在第11章中，您了解了解决这个问题的一种方法:使用Selenium自动化浏览器并获取数据。这是一件容易的事。它几乎一直都在工作。问题是，当您有一个像Selenium一样强大和有效的锤子时，每个web刮削问题看起来都很像钉子。在本章中，您将看到完全删除JavaScript(不需要执行甚至加载它!)，直接进入数据的来源:生成它的API。

<!--more-->

### A Brief Introduction to APIs

尽管有无数的书籍、演讲和指南都写过关于REST、GraphQL、JSON和XML api的复杂之处，他们的核心都基于一个简单的概念。API定义了一种标准化的语法，允许软件的一个部分与另一个部分通信，即使它们可能是用不同的语言编写的，或者以其他不同的结构编写的。

本节重点介绍web API(特别是允许web服务器与浏览器通信的API)，并使用术语API专门指代这种类型。但是您可能要记住，在其他上下文中，API也是一个通用术语，例如，它允许Java程序与运行在同一台机器上的Python程序通信。API并不总是“跨internet”的，也不一定涉及任何web技术。

Web api通常由使用经过良好宣传和文档化的公共服务的开发人员使用。例如，ESPN为运动员信息、比赛分数等提供api。谷歌在其开发人员部分中有几十个api，用于语言翻译、分析和地理定位。

例如，下面提供pathparam作为路由路径中的参数：

```
http://example.com/the-api-route/pathparam
```

这提供了pathparam作为参数param1的值：

```
http://example.com/the-api-route?param1=pathparam
```

这两种将变量数据传递给API的方法都经常被使用，尽管像计算机科学中的许多主题一样，关于变量应该在何时何地通过路径或参数传递的哲学争论也很激烈。

来自API的响应通常以JSON或XML格式返回。JSON在现代比XML流行得多，但是您可能仍然会看到一些XML响应。许多api允许您更改响应类型，通常使用另一个参数来定义您想要的响应类型。

下面是一个json格式的API响应示例:

```python
{"user":{"id": 123, "name": "Ryan Mitchell", "city": "Boston"}}
```

下面是一个xml格式的API响应示例:

```python
<user><id>123</id><name>Ryan Mitchell</name><city>Boston</city></user>
```

#### HTTP Methods and APIs

在前一节中，您了解了向服务器发出GET请求以获取信息的api。通过HTTP从web服务器请求信息有四种主要方法:

- GET
- POST
- PUT
- DELETE

从技术上讲，这四个选项不止一个(如HEAD、OPTIONS和CONNECT)，但是它们很少在api中使用，您不太可能看到它们。绝大多数api都将自己局限于这四个方法，甚至是这四个方法的子集。通常可以看到只使用GET或只使用GET和POST的api。

`GET`是通过浏览器中的地址栏访问网站时使用的工具。GET是在调用`http://freegeoip.net/json /50.78.253.58`时使用的方法。您可以将GET看作是这样说的:“嘿，web服务器，请检索/获取此信息。”，**注意**：此写法已经失效。详细见下方代码。

根据定义，`GET`请求不更改服务器数据库中的信息。没有什么是存储;没有修改。信息只被读取。

`POST`是您在填写表单或提交信息时使用的工具，这些信息可能是提供给服务器上的后端脚本的。每次你登录一个网站，你都在用你的用户名和(希望是)加密密码发出一个帖子请求。如果您使用API发出`POST`请求，您的意思是“请将此信息存储在数据库中”。

`PUT`在与网站交互时不太常用，但有时在api中使用。PUT请求用于更新对象或信息。例如，一个API可能需要一个POST请求来创建一个新用户，但是如果您想要更新该用户的电子邮件地址，它可能需要一个PUT请求。

`DELETE`用于删除对象。例如，如果将DELETE请求发送到`http://myapi.com/user/23`，它将删除具有ID的用户在公共api中不经常遇到`DELETE`方法，公共api主要用于传播信息或允许用户创建或发布信息，而不是允许用户从数据库中删除这些信息。

与`GET`请求不同，`POST`、`PUT`和`DELETE`请求允许您在请求体中发送信息，除了您请求数据的URL或路由之外。

就像您从web服务器接收到的响应一样，主体中的数据通常被格式化为JSON，或者不太常见的XML格式，并且该数据的格式由API的语法定义。例如，如果您正在使用在博客文章上创建评论的API，您可能会向其发出PUT请求:

```
http://example.com/comments?post=123
```

request body 如下：

```python
{"title": "Great post about APIs!", "body": "Very informative. Really helped me
out with a tricky technical challenge I was facing. Thanks for taking the time
to write such a detailed blog post about PUT requests!", "author": {"name": "Ryan
Mitchell", "website": "http://pythonscraping.com", "company": "O'Reilly Media"}}
```

注意，blog post(123)的ID作为URL中的一个参数传递，您正在创建的新评论的内容将在请求体中传递。参数和数据可以同时在参数和主体中传递。需要哪些参数以及传递这些参数的位置同样由API的语法决定。

### Parsing JSON

在本章中，您已经了解了各种类型的api及其功能，并了解了来自这些api的JSON响应示例。现在让我们看看如何解析和使用这些信息。

在本章的开头，您看到了freegeoip.net IP的示例，它将IP地址解析为物理地址

**注意**：此域名已经修改成

```
http://api.ipstack.com/134.201.250.155?access_key = YOUR_ACCESS_KEY
```

其中`YOUR_ACCESS_KEY`是注册后可获得的准许码。

您可以获取该请求的输出，并使用Python的json解析函数对其进行解码:

```python
import json
from urllib.request import urlopen
access_key = "your access key"
def getCountry(ipAddress):
    response = urlopen('http://api.ipstack.com/'+ipAddress+'?access_key=' + access_key).read().decode('utf-8')
    responseJson = json.loads(response)
    return responseJson.get('country_code')
print(getCountry('50.78.253.58'))
```

输出为：`US`

使用的`JSON`解析库是Python核心库的一部分。只要在顶部输入`import json`，一切就都设置好了!与许多可能将`JSON`解析为特殊`JSON`对象或`JSON`节点的语言不同，Python使用了一种更灵活的方法将`JSON`对象放入字典，将`JSON`数组放入列表，将`JSON`字符串放入字符串，等等。通过这种方式，访问和操作存储在其中的值非常容易。

下面快速演示了Python的JSON库如何处理JSON字符串中可能遇到的值:

```python
import json
jsonString = '{"arrayOfNums":[{"number":0},{"number":1},{"number":2}],
"arrayOfFruits":[{"fruit":"apple"},{"fruit":"banana"},
{"fruit":"pear"}]}'
jsonObj = json.loads(jsonString)
print(jsonObj.get('arrayOfNums'))
print(jsonObj.get('arrayOfNums')[1])
print(jsonObj.get('arrayOfNums')[1].get('number') +
jsonObj.get('arrayOfNums')[2].get('number'))
print(jsonObj.get('arrayOfFruits')[2].get('fruit'))
```

输出如下：

```python
[{'number': 0}, {'number': 1}, {'number': 2}]
{'number': 1}
3
pear
```

### Undocumented APIs

到目前为止，在本章中，我们只讨论了文档化的api。它们的开发人员希望它们被公众使用，发布关于它们的信息，并假设api将被其他开发人员使用。但是绝大多数api根本没有任何已发布的文档。
但是为什么要创建一个没有任何公共文档的API呢?正如本章开头所提到的，这一切都与JavaScript有关。

传统上，当用户请求页面时，动态网站的web服务器有几个任务:

- 处理用户请求网站页面的GET请求
- 从出现在该页面的数据库中检索数据
- 将数据格式化为页面的HTML模板
- 将格式化的HTML发送给用户

随着JavaScript框架变得越来越普遍，由服务器处理的许多HTML创建任务转移到了浏览器中。服务器可能发送硬编码将HTML模板加载到用户的浏览器中，但是会发出单独的Ajax请求来加载内容并将其放入该HTML模板中的正确位置。所有这些都将发生在浏览器/客户机端。

这最初是web抓取器的一个问题。他们习惯于向HTML页面发出请求，然后返回一个包含所有内容的HTML页面。相反，他们现在得到了一个没有任何内容的HTML模板。Selenium被用来解决这个问题。现在，程序员的web scraper可以成为浏览器，请求HTML模板，执行任何JavaScript，允许所有数据加载到它的位置，然后再从页面中抓取数据。由于HTML都已加载完毕，因此它本质上简化为一个以前解决过的问题，即解析和格式化现有HTML的问题。

然而，由于整个内容管理系统(过去只驻留在web服务器中)已经从本质上转移到浏览器客户机，即使是最简单的网站也可能膨胀为几兆字节的内容和十几个HTTP请求。

此外，当使用Selenium时，用户不必关心的所有“附加功能”都会加载。调用跟踪程序，加载侧边栏广告，调用跟踪程序为侧边栏广告。图像，CSS，第三方字体数据-所有这些都需要加载。这似乎好当你使用浏览器浏览网页的时候,但是,如果您正在编写一个web刮刀需要快速行动,收集具体数据,并将尽可能少的web服务器上的负载,可以装载一百倍比你需要的数据。

但是，所有这些JavaScript、Ajax和web现代化都有一线希望:因为服务器不再将数据格式化为HTML，所以它们常常充当数据库本身的瘦包装器。这个薄薄的包装器只是从数据库中提取数据，然后通过API将数据返回给页面。

当然，除了网页本身，任何人或任何东西都不打算使用这些api，因此开发人员将它们放在文档中，并假设(或希望)没有人会注意到它们。但它们确实存在。

例如，纽约时报网站通过JSON加载所有搜索结果。如果你访问链接：

```
https://query.nytimes.com/search/sitesearch/#/python
```

这将显示搜索词“python”的最新新闻文章。“如果你使用`urllib`或请求库来抓取这个页面，你将不会找到任何搜索结果。它们分别通过API调用加载:

```
https://query.nytimes.com/svc/add/v1/sitesearch.json
?q=python&spotlight=true&facet=true
```

如果您要用`Selenium`加载这个页面，那么您将发出大约100个请求，并在每次搜索中传输600 - 700kb的数据。直接使用API，您只发出一个请求，并且只传输大约60kb的格式化良好的数据。

在前几章中，您已经使用了Chrome检查器来检查HTML页面内容，但是现在您将把它用于一个稍微不同的目的:检查用于构造该页面的调用的请求和响应。

为此，打开Chrome inspector窗口并单击Network选项卡:

![](WebScraping12\1.bmp)

注意，您需要在加载页面之前打开此窗口。它在关闭时不跟踪网络呼叫。当页面加载时，每当浏览器回调web服务器以获取呈现页面的附加信息时，您将看到实时出现一行。
这可能包括一个API调用。

寻找未文档化的api可能需要一些侦探工作(要完成侦探工作，一般来说，当你看到它的时候你就知道了。

API调用往往有几个特性，这些特性对于在网络调用列表中定位它们很有用:

- 它们通常包含JSON或XML。您可以使用search/filter字段过滤请求列表。
- 对于GET请求，URL将包含传递给它们的参数值。例如，如果您正在寻找返回搜索结果的API调用，或者正在加载特定页面的数据，那么这将非常有用。只需使用您使用的搜索词、页面ID或其他标识信息过滤结果。
- 它们通常是XHR类型。

#### Documenting Undocumented APIs

api可能并不总是显而易见的，特别是在具有许多特性的大型站点中，这些特性可能在加载单个页面时进行数百次调用。然而，只要稍加练习，就能更容易地在大海捞针。

在您发现正在进行API调用之后，在某种程度上对它进行文档化通常是很有用的，特别是当您的抓取器严重依赖于该调用时。您可能希望在网站上加载几个页面，在inspector console network选项卡中过滤目标API调用。通过这样做，您可以看到调用如何在页与页之间更改，并标识它接受和返回的字段。

每个API调用都可以通过注意以下字段来识别和记录:

- HTTP method used
- Inputs
  - Path parameters
  - Headers(including cookies)
  - Body content (for PUT and POST calls)
- Outputs
  - Response headers (including cookies set)
  - Response body type
  - Response body fields

#### Finding and Documenting APIs Automatically

定位和记录api的工作看起来有些单调和算法化。这主要是因为事实就是如此。虽然一些网站可能会试图混淆浏览器获取数据的方式，这让任务变得有点棘手，但寻找和记录api基本上是一个程序化的任务。

书的作者在`https://github.com/chell/apiscraper`创建了一个GitHub存储库，它尝试从这个任务中去掉一些繁重的工作。

它使用Selenium、ChromeDriver和一个名为BrowserMob Proxy的库来加载页面、抓取域中的页面、分析页面加载期间发生的网络流量，并将这些请求组织成可读的API调用。

- apicall.py

  包含定义API调用(路径、参数等)的属性，以及决定两个API调用是否相同的逻辑。

- apiFinder.py

  主要的爬行class。py和consoleservice.py用于启动查找api的过程。

- browser.py

  只有三种方法——initialize、get和close——但是包含相对复杂的功能，可以将BrowserMob代理服务器和硒。滚动整个页面，以确保整个页面已加载、保存HTTP Archive (HAR)文件到适当的位置进行处理。

- consoleservice.py

  处理来自控制台的命令并启动主APIFinder类。

- harParser.py

  解析HAR文件并提取API调用。

- html_template.html

  提供用于在浏览器中显示API调用的模板。

- README.md

- Git自述文件页面。

从`https://bmp.lightbody.net/`下载BrowserMob代理二进制文件，并将提取的文件放在apiscraper项目目录中。

在撰写本文时，BrowserMob代理的当前版本是2.1.4，因此该脚本将假定二进制文件位于相对于根项目目录的browsermob-proxy- Proxy -2.1.4/bin/browsermob-proxy。如果不是这样，您可以在运行时提供一个不同的目录，或者(可能更容易)修改apiFinder.py中的代码。

下载ChromeDriver并将其放在apiscraper项目目录中。

你需要安装以下Python库:

- tldextract
- selebium
- browsermob-proxy

设置完成后，就可以开始收集API调用了。打字:

```
python consoleservice.py -h
```

会给你一个列表的选择开始:

usage: consoleService.py [-h] [-u [U]] [-d [D]] [-s [S]] [-c [C]] [--p]

<p>
optional arguments:<br>

  -h, --help  show this help message and exit

  -u [U]      Target URL. If not provided, target directory will be scanned
              for har files.

  -d [D]      Target directory (default is "hars"). If URL is provided,
              directory will store har files. If URL is not provided,
              directory will be scanned.

  -s [S]      Search term

  -c [C]      Count of pages to crawl (with target URL only)

  --p         Flag, remove unnecessary parameters (may dramatically increase
              run time)

您可以为单个搜索项在单个页面上搜索API调用。例如，您可以在`http://target.com`上搜索一个返回产品数据的API页面，以填充产品页面:

```
$ python consoleservice.py -u https://www.target.com/p/rogue-one-a-star-wars-\story-blu-ray-dvd-digital-3-disc/-/A-52030319 -s "Rogue One: A Star Wars Story"
```

这返回的信息，包括一个URL，为一个API返回该页面的产品数据:

```
URL: https://redsky.target.com/v2/pdp/tcin/52030319
METHOD: GET
AVG RESPONSE SIZE: 34834
SEARCH TERM CONTEXT: c":"786936852318","product_description":{"title":
"Rogue One: A Star Wars Story (Blu-ray + DVD + Digital) 3 Disc",
"long_description":...
```

使用`-i`标志，可以从提供的URL开始爬取多个页面(默认为一个页面)。这对于搜索特定关键字的所有网络流量非常有用，或者，通过省略-s搜索词标志，收集加载每个页面时发生的所有API流量。

所有收集到的数据都存储为一个`HAR`文件，存储在项目根目录的默认目录`/ HAR`中，不过可以使用`-d`标志更改该目录。

如果没有提供URL，还可以传入一个预先收集的HAR文件目录，用于搜索和分析。

本项目提供了许多其他功能，包括:

- 不必要的参数删除(删除不影响API调用返回值的GET或POST参数)
- 多种API输出格式(命令行、HTML、JSON)
- 区分表示单独API路由的路径参数和仅作为相同API路由的GET参数的路径参数

随着我和其他人继续使用它进行web抓取和API收集，还计划进行进一步的开发。

### Combining APIs with Other Data Sources

尽管许多现代web应用程序存在的理由是采用现有数据并以更吸引人的方式对其进行格式化，但我认为在大多数情况下，这样做并不有趣。如果您使用API作为惟一的数据源，那么您所能做的最好的事情就是复制其他人已经存在的数据库，而且基本上已经发布了。更有趣的是，以一种新颖的方式将两个或多个数据源组合在一起，或者使用API作为一种工具，从一个新的角度查看被抓取的数据。

让我们看一个例子，看看如何将来自api的数据与web抓取结合使用，以了解世界上哪些地方对Wikipedia贡献最大。

如果你在维基百科上花了很多时间，你可能会看到一篇文章的修订历史页面，其中显示了最近的编辑列表。如果用户在编辑时登录到Wikipedia，则显示他们的用户名。如果没有登录，则记录它们的IP地址，如图。

![](WebScraping12\2.bmp)

历史页面上提供的IP地址是121.97.110.145。通过使用freegeoip.net API，在撰写本文时，该IP地址来自菲律宾的奎松(IP地址有时会在地理上发生变化)。

这些信息本身并不那么有趣，但是如果您可以收集关于Wikipedia编辑的许多地理数据点，以及它们发生在哪里，情况会怎样呢?几年前，我就是这么做的，并使用谷歌的地理图库创建了一个有趣的图表，显示了在英文维基百科上编辑的位置，以及维基百科是用其他语言编写的。

![](WebScraping12\3.bmp)

创建一个基本脚本来抓取Wikipedia，查找修订历史页面，然后在这些修订历史页面上查找IP地址并不困难。使用第3章修改过的代码，下面的脚本就可以做到这一点:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
import datetime
import random
import re

random.seed(datetime.datetime.now())
def getLinks(articleUrl):
    html = urlopen('http://en.wikipedia.org{}'.format(articleUrl))
    bs = BeautifulSoup(html, 'html.parser')
    return bs.find('div', {'id':'bodyContent'}).findAll('a', 
        href=re.compile('^(/wiki/)((?!:).)*$'))

def getHistoryIPs(pageUrl):
    #Format of revision history pages is: 
    #http://en.wikipedia.org/w/index.php?title=Title_in_URL&action=history
    pageUrl = pageUrl.replace('/wiki/', '')
    historyUrl = 'http://en.wikipedia.org/w/index.php?title={}&action=history'.format(pageUrl)
    print('history url is: {}'.format(historyUrl))
    html = urlopen(historyUrl)
    bs = BeautifulSoup(html, 'html.parser')
    #finds only the links with class "mw-anonuserlink" which has IP addresses 
    #instead of usernames
    ipAddresses = bs.findAll('a', {'class':'mw-anonuserlink'})
    addressList = set()
    for ipAddress in ipAddresses:
        addressList.add(ipAddress.get_text())
    return addressList

links = getLinks('/wiki/Python_(programming_language)')

while(len(links) > 0):
    for link in links:
        print('-'*20) 
        historyIPs = getHistoryIPs(link.attrs['href'])
        for historyIP in historyIPs:
            print(historyIP)

    newLink = links[random.randint(0, len(links)-1)].attrs['href']
    links = getLinks(newLink)
```

输出为：

```
history url is: http://en.wikipedia.org/w/index.php?title=Programming_paradigm&action=history
223.104.186.241
213.207.90.158
92.115.222.143
213.108.115.55
2605:a601:e0c:6300:996d:68c0:fb03:af2c
192.117.105.47
31.203.136.191
168.216.130.133
2a02:c7d:a492:f200:e126:2b36:53ca:513a
37.238.238.36
197.255.127.246
110.55.67.15
193.80.242.220
42.111.56.168
223.230.96.108
113.162.8.249
39.36.182.41
--------------------
history url is: http://en.wikipedia.org/w/index.php?title=Object-oriented_programming&action=history
113.199.249.237
205.251.185.250
1.22.150.73
121.58.212.157
217.225.8.24
162.204.116.16
112.200.199.62
117.239.185.50
103.252.25.104
103.74.23.139
103.241.244.36
2605:a601:474:600:2088:fbde:7512:53b2
122.181.5.162
24.93.131.140
119.152.87.84
93.136.125.208
27.251.109.234
223.230.215.145
103.16.68.215
170.142.177.246
--------------------
```

这个程序使用了两个主要功能:`getLinks`(同时也是用于第三章),和新的`getHistoryIPs`搜索所有链接的内容与类`mw-anonuserlink`(表明一个匿名用户提供一个IP地址,而不是用户名)并返回一组。

这段代码还使用了一种有点随意的(但对于本例来说是有效的)搜索模式来查找可以从中检索修订历史的文章。它首先检索由起始页面链接到的所有Wikipedia文章的历史记录
(在本例中，是关于Python编程语言的文章)。然后，它随机选择一个新的起始页面，并检索该页面链接到的所有文章的修订历史页面。它将一直持续到没有链接的页面。

现在您已经有了以字符串形式检索IP地址的代码，您可以将其与上一节中的getCountry函数结合使用，以便将这些IP地址解析为国家。您将稍微修改getCountry，以便解释导致404 Not Found错误的无效或格式错误的IP地址(例如，在撰写本文时，FreeGeoIP无法解决IPv6，这可能会触发这样的错误):

```python
def getCountry(ipAddress):
    try:
        response = urlopen(
            'http://freegeoip.net/json/{}'.format(ipAddress)).read().decode('utf-8')
    except HTTPError:
        return None
    responseJson = json.loads(response)
    return responseJson.get('country_code')
    
links = getLinks('/wiki/Python_(programming_language)')

while(len(links) > 0):
    for link in links:
        print('-'*20) 
        historyIPs = getHistoryIPs(link.attrs["href"])
        for historyIP in historyIPs:
            country = getCountry(historyIP)
            if country is not None:
                print('{} is from {}'.format(historyIP, country))

    newLink = links[random.randint(0, len(links)-1)].attrs['href']
    links = getLinks(newLink)
```

Here’s the sample output:

```
-------------------
history url is: http://en.wikipedia.org/w/index.php?title=Programming_
paradigm&action=history
68.183.108.13 is from US
86.155.0.186 is from GB
188.55.200.254 is from SA
108.221.18.208 is from US
141.117.232.168 is from CA
76.105.209.39 is from US
182.184.123.106 is from PK
212.219.47.52 is from GB
72.27.184.57 is from JM
49.147.183.43 is from PH
209.197.41.132 is from US
174.66.150.151 is from US
```

### More About APIs

本章介绍了现代api通常用于访问web上的数据的几种方法，以及如何使用这些api构建更快更强大的web抓取器。如果您正在寻找构建api而不是仅仅使用它们，或者如果您想了解更多关于它们的构造和语法的理论，我推荐Leonard Richardson、Mike Amundsen和Sam Ruby (O Reilly)编写的RESTful Web api。本书对在web上使用api的理论和实践提供了一个强有力的概述。此外，Mike Amundsen有一个很有意思的视频系列，为Web设计api (O Reilly)，它教你如何创建自己的api，如果你决定以一种方便的格式向公众提供你的抓取数据，这是一件很有用的事情。

虽然有些人可能会哀叹JavaScript和动态网站的无所不在，使传统的抓取和解析HTML页面的做法过时了，但我对我们的新机器人统治者表示欢迎。由于动态网站不太依赖HTML页面供人使用，而更多地依赖严格格式化的JSON文件供HTML使用，这为每个试图获得干净、格式良好的数据的人提供了便利。web不再是偶尔带有多媒体和CSS装饰的HTML页面的集合。它是数百种文件类型和数据格式的集合，一次可以快速生成数百个页面，您可以通过浏览器使用这些页面。真正的技巧通常是越过你面前的页面，抓住数据的来源。更多的