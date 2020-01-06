---
title: WebScraping-3
date: 2019-07-14 23:39:23
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

到目前为止，已经看到了带有一些静态页面。在本章中，将开始研究实际的问题，抓取会遍历多个页面，甚至多个站点。

Web爬虫之所以这样命名，是因为它们在Web上爬行。它们的核心是递归的一个元素。它们必须为URL检索页面内容，为另一个URL检查该页面，并检索该页面，一直到无穷。

<!--more-->

但是要注意：仅仅因为你能在网上爬行并不意味着你总是应该这么做。在前面的示例中使用的爬虫在所有需要的数据都在一个页面上的情况下工作得非常好。使用爬虫程序时，必须非常注意所使用的带宽，并尽一切努力确定是否有一种方法可以使目标服务器的加载更容易。

### Traversing a Single Domain

应该已经知道如何编写检索任意值的Python脚本Wikipedia页面，并在该页面上生成链接列表：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://en.wikipedia.org/wiki/Kevin_Bacon')
bs = BeautifulSoup(html, 'html.parser')
for link in bs.find_all('a'):
	if 'href' in link.attrs:
		print(link.attrs['href'])
```

其中，会出现一些你并不像出现的输出，例如：

```html
//wikimediafoundation.org/wiki/Privacy_policy
//en.wikipedia.org/wiki/Wikipedia:Contact_us
```

事实上，Wikipedia充满了出现在每个页面上的边栏、页脚和页眉链接，以及指向类别页面、谈话页面和其他不包含不同文章的页面的链接：

```html
/wiki/Category:Articles_with_unsourced_statements_from_April_2014
/wiki/Talk:Kevin_Bacon
```

最近，我的一个朋友在做一个类似的维基百科抓取项目时，提到他写了一个很大的过滤函数，有100多行代码，用来判断一个内部的维基百科链接是否是一个文章页面。不幸的是，他并没有花太多的时间去寻找两者之间的规律“文章链接”和“其他链接”，或者他可能已经发现了这个技巧。如果你查看指向文章页面的链接(相对于其他内部页面)，你会发现它们都有三个共同点:

- 它们驻留在`div`中，`id`设置为`bodyContent`
- 链接中不包含冒号
- 链接以`/wiki/`开头

可以使用正则表达式`^(/wiki/)((?!:).)*$"):`使用这些规则稍微修改代码，只检索所需的文章链接：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
html = urlopen('http://en.wikipedia.org/wiki/Kevin_Bacon')
bs = BeautifulSoup(html, 'html.parser')
for link in bs.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$')):
	if 'href' in link.attrs:
		print(link.attrs['href'])
```

当然，一个脚本可以在一篇硬编码的Wikipedia文章中找到所有的文章链接，虽然很有趣，但在实践中却毫无用处。需要能够采取这段代码，并将其转换成类似于以下内容：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import random
import re
random.seed(datetime.datetime.now())
def getLinks(articleUrl):
	html = urlopen('http://en.wikipedia.org{}'.format(articleUrl))
	bs = BeautifulSoup(html, 'html.parser')
	return bs.find('div', {'id':'bodyContent'}).find_all('a',
href=re.compile('^(/wiki/)((?!:).)*$'))
links = getLinks('/wiki/Kevin_Bacon')
while len(links) > 0:
	newArticle = links[random.randint(0, len(links)-1)].attrs['href']
	print(newArticle)
	links = getLinks(newArticle)
```

在导入所需的库之后，程序要做的第一件事是用当前系统时间设置随机数生成器种子。这实际上确保了每次运行程序时，都能在Wikipedia文章中找到一个新的、有趣的随机路径。

接下来，程序定义`getLinks`函数，该函数接受表单`/wiki/…`，然后加上Wikipedia域名`http://en.wikipedia.org`，并在该域中检索HTML的`BeautifulSoup`对象。然后根据前面讨论的参数提取文章链接标记列表，并返回它们。

程序的主体从设置文章链接标签列表开始，然后进入一个循环，在页面中找到一个随机的文章链接标记，从中提取`href`属性，打印页面，并从提取的URL中获得一个新的链接列表。

### Crawling an Entire Site

在上一节中，随意浏览了一个网站，从一个链接到另一个链接。但是，如果需要系统地编目或搜索站点上的每个页面，该怎么办呢？爬行整个站点，特别是大型站点，是一个内存密集型的过程，最适合存储爬行结果的数据库随时可用的应用程序。但是，可以在不全面运行这些类型的应用程序的情况下研究它们的行为。

什么时候爬行整个网站是有用的，什么时候是有害的？遍历整个站点的抓取有很多好处，包括以下内容：

- 生成站点地图

几年前，我遇到了一个问题:一个重要的客户希望对网站的重新设计进行评估，但他不想让我的公司访问他们当前内容管理系统的内部结构，也没有公开可用的网站地图。我能够使用爬行器覆盖整个站点，收集所有内部链接，并将页面组织到站点上使用的实际文件夹结构中。这使我能够快速找到我甚至不知道存在的站点部分，并准确地计算需要多少页面设计和需要迁移多少内容。(不是我，是这个书的作者。。)

- 数据采集

我的另一个客户想收集文章(故事、博客文章、新闻文章等)，以便创建一个专门搜索平台的工作原型。虽然这些网站抓取不需要是详尽的，但它们确实需要相当广泛的(我们只对从几个站点获取数据感兴趣)。我能够创建爬虫程序，递归遍历每个站点，只收集在文章页面上找到的数据。

彻底搜索站点的一般方法是从顶级页面(如主页)开始，搜索该页面上所有内部链接的列表。然后爬行其中的每个链接，并在每个链接上找到附加的链接列表，从而触发另一轮爬行。但是这便是一个指数级的工作量！

为了避免在同一个页面上爬行两次，非常重要的一点是，发现的所有内部链接都要保持一致的格式，并在程序运行时保存在一个运行集中，以便于查找。集合类似于列表，但是元素没有特定的顺序，只存储惟一的元素，这非常适合我们的需要。只有新的链接才应该被抓取和搜索额外的链接：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
pages = set()
def getLinks(pageUrl):
	global pages
	html = urlopen('http://en.wikipedia.org{}'.format(pageUrl))
	bs = BeautifulSoup(html, 'html.parser')
	for link in bs.find_all('a', href=re.compile('^(/wiki/)')):
		if 'href' in link.attrs:
			if link.attrs['href'] not in pages:
			#We have encountered a new page
			newPage = link.attrs['href']
			print(newPage)
			pages.add(newPage)
			getLinks(newPage)
getLinks('')
```

为了展示爬虫业务如何工作的全部效果，我放松了构成内部链接的标准(来自前面的示例)。它不是将scraper限制为文章页面，而是查找以/wiki/开头的所有链接，而不管它们在页面的什么位置，也不管它们是否包含冒号。
记住：文章页面不包含冒号，但是文件上传页面、谈话页面等在URL中包含冒号。

最初，使用空URL调用`getLinks`。只要空URL前面加上`http://en.wikipedia`，这就被翻译为“Wikipedia的首页。然后，遍历第一个页面上的每个链接，并检查它是否在全局页面集中(脚本已经遇到的一组页面)。如果没有，则将其添加到列表中，并将其打印到屏幕上，然后在其上递归调用`getLinks`函数。

#### Collecting Data Across an Entire Site

如果Web爬行器所做的只是从一个页面跳转到另一个页面，那么它们将非常无聊。为了使它们有用，需要能够在页面上做一些事情。让我们看看如何构建一个scraper，它收集标题、内容的第一段和编辑页面的链接(如果有的话)。

像往常一样，确定如何最好地做到这一点的第一步是查看站点的几个页面并确定一个模式。看看维基百科上的一些页面(包括文章和非文章页面，如隐私政策页面)，以下内容应该清楚:

- 所有标题(在所有页面上，无论它们作为文章页面、编辑历史页面或任何其他页面的状态如何)都有标题位于`h1->span`标记之下，这些是页面上惟一的`h1`标记。
- 如前所述，所有正文都位于`div#bodyContent`标记之下。但是，如果希望获得更具体的信息，并且只访问文本的第一段，那么最好使用d`iv#mw-content-text→p`(只选择第一段标记)。对于除文件页面(例如，`https://en.wikipedia.org/wiki/File:Orbit_of_274301_Wikipedia.svg`)之外的所有内容页面都是如此，这些页面没有内容文本的部分。
- 编辑链接只出现在文章页面上。如果它们发生了，它们将在`li#ca-edit`标签下的`li#ca-edit→span→a`中找到。

修改后，如下：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
pages = set()
def getLinks(pageUrl):
	global pages
	html = urlopen('http://en.wikipedia.org{}'.format(pageUrl))
	bs = BeautifulSoup(html, 'html.parser')
	try:
		print(bs.h1.get_text())
		print(bs.find(id ='mw-content-text').find_all('p')[0])
		print(bs.find(id='ca-edit').find('span').find('a').attrs['href'])
	except AttributeError:
		print('This page is missing something! Continuing.')
	for link in bs.find_all('a', href=re.compile('^(/wiki/)')):
		if 'href' in link.attrs:
			if link.attrs['href'] not in pages:
				#We have encountered a new page
				newPage = link.attrs['href']
				print('-'*20)
				print(newPage)
				pages.add(newPage)
				getLinks(newPage)
getLinks('')
```

这个程序中的for循环本质上与原始爬行程序中的for循环相同(为了清晰起见，添加了打印破折号，将打印的内容分隔开)。

因为您永远无法完全确定所有的数据都在每个页面上，所以每个print语句都按照最有可能出现在站点上的顺序排列。也就是说，`h1`标题标签出现在每个页面上(至少就我所知)，所以您首先尝试获取数据。文本内容出现在大多数页面上(文件页面除外)，因此这是检索到的第二段数据。`Edit`按钮只出现在标题和文本内容都已经存在的页面上，但不会出现在所有这些页面上。

显然，在异常处理程序中封装多行涉及一些危险。首先，您不知道哪一行抛出了异常。此外，如果由于某种原因，一个页面包含一个Edit按钮，但是没有标题，那么Edit按钮将永远不会被记录。然而，在许多情况下，如果站点上出现了按顺序排列的条目，并且无意中丢失了一些数据点或保留了详细的日志，那么它就足够了。

重定向允许web服务器将一个域名或URL指向位于不同位置的内容块。有两种类型的重定向：

- server-side 服务器端重定向，即在加载页面之前更改URL
- client-side 客户端重定向，有时会出现“您将在10秒内重定向”类型的消息，在重定向到新消息之前，页面将加载到该消息

使用服务器端重定向，您通常不必担心。如果您在python3.x中使用`urllib`库，它自动处理重定向!如果您正在使用请求库，请确保将`allow- redirects`标志设置为True:

```python
r = requests.get('http://github.com', allow_redirects=True)
```

只是要注意，有时候，您正在爬行的页面的URL可能不是您输入页面的URL。

### Crawling across the Internet

在你开始编写一个爬虫程序，跟踪所有出站链接，不管你是否愿意，你应该问自己几个问题：

- 我要收集什么数据？这可以通过抓取几个预定义的网站来实现吗(几乎总是更容易的选项)，或者我的爬虫程序需要能够发现我可能不知道的新网站吗？
- 当我的爬虫到达一个特定的网站，它会立即跟随下一个出站链接到一个新的网站，还是会停留一段时间，并深入到当前的网站？
- 在什么情况下，我不想刮一个特定的网站?我对非英语内容感兴趣吗？
- 如果我的网络爬虫在某个网站上引起了站长的注意，我该如何保护自己免受法律诉讼？

因此，代码更新如下：

```python
from urllib.request import urlopen
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re
import datetime
import random
pages = set()
random.seed(datetime.datetime.now())
#Retrieves a list of all Internal links found on a page
def getInternalLinks(bs, includeUrl):
	includeUrl = '{}://{}'.format(urlparse(includeUrl).scheme,urlparse(includeUrl).netloc)
	internalLinks = []
	#Finds all links that begin with a "/"
	for link in bs.find_all('a',
		href=re.compile('^(/|.*'+includeUrl+')')):
		if link.attrs['href'] is not None:
			if link.attrs['href'] not in internalLinks:
				if(link.attrs['href'].startswith('/')):
        	        internalLinks.append(includeUrl+link.attrs['href'])
				else:
					internalLinks.append(link.attrs['href'])
	return internalLinks

#Retrieves a list of all external links found on a page
def getExternalLinks(bs, excludeUrl):
	externalLinks = []
	#Finds all links that start with "http" that do
	#not contain the current URL
	for link in bs.find_all('a',
		href=re.compile('^(http|www)((?!'+excludeUrl+').)*$')):
		if link.attrs['href'] is not None:
			if link.attrs['href'] not in externalLinks:
                externalLinks.append(link.attrs['href'])
	return externalLinks

def getRandomExternalLink(startingPage):
	html = urlopen(startingPage)
	bs = BeautifulSoup(html, 'html.parser')
	externalLinks = getExternalLinks(bs,urlparse(startingPage).netloc)
	if len(externalLinks) == 0:
		print('No external links, looking around the site for one')
        domain = '{}://{}'.format(urlparse(startingPage).scheme,urlparse(startingPage).netloc)
		internalLinks = getInternalLinks(bs, domain)
		return getRandomExternalLink(internalLinks[random.randint(0,len(internalLinks)-1)])
	else:
		return externalLinks[random.randint(0, len(externalLinks)-1)]

def followExternalOnly(startingSite):
	externalLink = getRandomExternalLink(startingSite)
	print('Random external link is: {}'.format(externalLink))followExternalOnly(externalLink)
    followExternalOnly('http://oreilly.com')
    followExternalOnly('http://oreilly.com')
```

前面的程序从`http://oreilly.com`开始，从外部链接随机跳转到外部链接。下面是它产生的输出示例:

```python
http://igniteshow.com/
http://feeds.feedburner.com/oreilly/news
http://hire.jobvite.com/CompanyJobs/Careers.aspx?c=q319
http://makerfaire.com/
```

外部链接并不总是保证能在网站的首页找到。在本例中，为了找到外部链接，使用了一种类似于前一个爬行示例中使用的方法来递归地深入到一个网站，直到找到一个外部链接。

具体的流程图，如下：

![](Webscraping3\1.bmp)

其中，有几个函数的意义需要解释一下：

`urlparse(link).scheme`与 `(urlparse(link).netloc`两个解析网址的函数：

```python
link = "https://www.baidu.com/baidu?isource=infinity&iname=baidu&itype=web&tn=02003390_42_hao_pg&ie=utf-8&wd=%E7%88%AC%E8%99%AB"
print(urlparse(link).scheme)
print(urlparse(link).netloc)

output:
https
www.baidu.com
```





我一直提到这一点，但是为了空间和可读性，本书中的示例程序并不总是包含代码所需的必要检查和异常处理。例如，如果在爬行器遇到的站点的任何地方都没有找到外部链接(不太可能，但是如果运行足够长的时间，它一定会在某个时刻发生)，这个程序将继续运行，直到达到Python的递归限制。增加这个爬虫程序健壮性的一个简单方法是将它与第1章中的连接异常处理代码结合起来。这将允许代码在检索页面时遇到HTTP错误或服务器异常时选择不同的URL。

增加这个爬虫程序健壮性的一个简单方法是将它与章节中的连接异常处理代码结合起来这将允许代码在检索页面时遇到HTTP错误或服务器异常时选择不同的URL。

在为任何重要目的运行这段代码之前，请确保您进行了检查，以处理潜在的陷阱。

将任务分解为简单的函数(如“查找此页面上的所有外部链接”)的好处是，稍后可以轻松重构代码来执行不同的爬行任务。例如，如果你的目标是抓取整个网站的外部链接，并记录下每一个链接，你可以添加以下功能：

```python
# Collects a list of all external URLs found on the site
allExtLinks = set()
allIntLinks = set()
def getAllExternalLinks(siteUrl):
	html = urlopen(siteUrl)
	domain = '{}://{}'.format(urlparse(siteUrl).scheme,urlparse(siteUrl).netloc)
	bs = BeautifulSoup(html, 'html.parser')
	internalLinks = getInternalLinks(bs, domain)
	externalLinks = getExternalLinks(bs, domain)
	for link in externalLinks:
		if link not in allExtLinks:allExtLinks.add(link)
			print(link)
	for link in internalLinks:
		if link not in allIntLinks:allIntLinks.add(link)
			getAllExternalLinks(link)
allIntLinks.add('http://oreilly.com')
getAllExternalLinks('http://oreilly.com')
```

这段代码可以被看作是两个循环—一个收集内部链接，一个收集外部链接—彼此协同工作。流程图如下：

![](Webscraping3\2.bmp)

在编写代码之前，将代码应该做的事情记录下来或绘制图表，这是一种非常好的习惯，可以在爬行器变得越来越复杂时为您节省大量时间和挫折。