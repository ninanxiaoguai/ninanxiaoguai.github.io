---
title: WebScraping-4
date: 2019-07-21 14:07:02
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

当您能够控制数据和输入时，编写干净且可伸缩的代码就已经非常困难了。为web爬虫程序编写代码通常会带来独特的组织挑战，因为web爬虫程序可能需要从程序员无法控制的不同站点集合中抓取和存储各种数据。

<!--more-->

可能被要求从各种各样的网站收集新闻文章或博客文章，每个网站都有不同的模板和布局。一个网站的`h1`标签包含文章的标题，另一个网站的`h1`标签包含网站本身的标题，文章标题在`<span id="title">`中。

可能需要灵活地控制哪些网站被擦除，以及它们如何被擦除，以及一种快速添加新网站或修改现有网站的方法，尽可能快，而不需要编写多行代码。

可能会被要求从不同的网站上搜集产品的价格，最终目的是比较相同产品的价格。也许这些价格以不同的货币表示，也许还需要将其与来自其他非web源的外部数据相结合。

尽管web爬虫程序的应用程序几乎是无穷无尽的，但是大型可伸缩爬虫程序往往会陷入以下几种模式之一。通过学习这些模式并识别它们适用的情况，可以极大地提高web爬行器的可维护性和健壮性。

本章主要关注web爬虫程序，这些爬虫程序从各种网站收集有限数量的数据类型(如餐馆评论、新闻文章、公司简介)，并将这些数据类型存储为Python对象，从数据库中读写数据。

### Planning and Defining Objects

web抓取的一个常见陷阱是完全根据眼前可用的内容定义要收集的数据。例如，如果你想收集产品数据，你可以先去服装店看看，然后决定你刮下来的每一件产品都需要有以下几个字段：

-  产品名字
- 价格
- 描述
- 尺寸
- 颜色
- 材质
- 客户评价

查看另一个网站，您会发现页面上列出了sku(用于跟踪和订购商品的库存单位)。想必肯定也想收集这些数据，即使它没有出现在第一个站点上!添加这个字段：

- SKU

虽然服装可能是一个很好的开始，但您也希望确保可以将这个爬虫扩展到其他类型的产品。你开始浏览其他网站的产品部分，并决定你也需要收集这些信息：

显然，这是一种不可持续的做法。每次在网站上看到新信息时，只要向产品类型添加属性，就会导致太多字段无法跟踪。不仅如此，每次抓取一个新网站时，都将被迫对该网站的字段和到目前为止积累的字段进行详细分析，并可能添加新字段(修改的Python对象类型和数据库结构)。这将导致混乱和难以阅读的数据集，可能导致使用它的问题。

在决定收集哪些数据时，最好的方法之一就是完全忽略这些网站。你不会通过浏览一个网站，然后说:“存在什么?但是通过说，“我需要什么?”然后想办法从那里找到你需要的信息。

也许您真正想做的是比较多个商店之间的产品价格，并随着时间的推移跟踪这些产品的价格。在这种情况下，你需要足够的信息来唯一地识别产品，就是这样：

- 商品名称
- 制造商
- 产品编号(如适用/相关)

需要注意的是，这些信息都不是特定于特定存储的。例如，产品评论、评级、价格，甚至描述都是特定于特定商店中该产品的实例的。可以单独存储。

其他信息(产品的颜色、材质)是特定于产品的，但可能很少——它并不适用于所有产品。重要的是退后一步，为你考虑的每一项都列一个清单，然后问自己以下问题：

- 这些信息对项目目标有帮助吗？如果我没有它，它会成为一个障碍吗？或者它只是“拥有它很好”，但最终不会影响任何东西？
- 如果这在将来可能有帮助，但我不确定，在以后的时间返回并收集数据会有多难？
- 这些数据与我已经收集到的数据是否冗余？
- 将数据存储在这个特定对象中合乎逻辑吗？(如前所述，如果同一产品的描述在不同站点之间发生变化，那么在产品中存储描述就没有意义了。)

如果你决定你需要收集数据，重要的是问几个问题，然后决定如何存储和处理它的代码：

- 这些数据是稀疏的还是密集的?它是相关的，并在每个列表中填充，还是只包含少数列表？
- 数据有多大？
- 特别是在大数据的情况下，我是否需要在每次运行分析时定期检索它，或者只是偶尔检索？
- 这类数据的变量有多大?我是否需要定期添加新属性、修改类型(比如可能经常添加的织物图案)，或者设置为石头(鞋码)？

假设计划围绕产品属性和价格进行一些元分析：例如，一本书的页数，或者一件衣服的面料类型，以及将来可能与价格相关的其他属性。您将遍历这些问题并意识到这些数据是稀疏的(很少有产品具有这些属性)，并且您可能决定频繁地添加或删除这些属性。在这种情况下，创建这样的产品类型可能是有意义的：

- 商品名字
- 制造商
- 产品编号(如适用/相关)
- 属性(可选列表或字典)

属性类型是这样的：

- 属性名字
- 属性值

这允许操作者随着时间的推移灵活地添加新产品属性，而不需要重新设计数据模式或重写代码。在决定如何在数据库中存储这些属性时，可以将`JSON`写入属性字段，或者将每个属性存储在一个单独的表中，并使用产品`ID`。有关实现这些类型的数据库模型的更多信息，请参见第6章。

您也可以将上述问题应用于您需要存储的其他信息。为了跟踪每种产品的价格，您可能需要以下工具：

- 产品编号
- 商店编号
- 价钱
- 日期/时间戳价格见

但是，如果产品的属性实际上改变了产品的价格，情况又会怎样呢?例如，商店可能会对一件大衬衫比一件小衬衫要价更高，因为大衬衫需要更多的劳动力或材料。在这种情况下，您可以考虑将单个衬衫产品拆分为每个尺寸的单独产品列表(以便每个衬衫产品可以独立定价)，或者创建一个新的项目类型来存储关于产品实例的信息，其中包含以下字段：

- 产品编号
- 实例类型(本例中为衬衫的大小)

每个价格是这样的：

- 产品实例ID
- 商店编号
- 价钱
- 日期/时间戳价格见

虽然“产品和价格”的主题似乎过于具体，但是您需要问自己的基本问题，以及在设计Python对象时使用的逻辑，几乎适用于所有情况。

如果您正在抓取新闻文章，您可能需要以下基本信息：

- 题目
- 作者
- 日期
- 内容

但是说一些文章包含修改日期，或者相关文章，或者一些社交媒体分享。你需要这些吗？它们与项目相关吗？如果不是所有的新闻网站都使用所有形式的社交媒体，而且社交媒体网站的受欢迎程度可能会随着时间的推移而上升或下降，你如何有效和灵活地存储社交媒体分享的数量？

当面对一个新项目时，立即开始编写Python来抓取网站是很有诱惑力的。数据模型(放在后面考虑)常常会受到第一个站点上数据的可用性和格式的强烈影响。

然而，数据模型是使用它的所有代码的基础。模型中的错误决策很容易导致编写和维护代码的问题，或者难以提取和有效地使用结果数据。特别是在处理各种已知和未知的网站时
——认真考虑和计划你到底需要收集什么，以及如何储存，变得至关重要。

### Dealing with Different Websites Layouts

像谷歌这样的搜索引擎最令人印象深刻的功绩之一是，它能够从各种各样的网站中提取相关和有用的数据，而不需要预先了解网站结构本身。尽管我们人类能够立即识别页面的标题和主要内容(除非web设计非常糟糕)，但是让机器人做同样的事情要困难得多。

幸运的是，在大多数web爬行的情况下，不是要从从未见过的站点收集数据，而是要从几个或几十个由人类预先选择的站点收集数据。这意味着不需要使用复杂的算法或机器学习来检测页面上哪些文本看起来最像标题，或者哪些可能是主要内容。

可以手动确定这些元素是什么。最明显的方法是为每个网站编写一个单独的web爬虫程序或页面解析器。每个对象都可以接受URL、字符串或`BeautifulSoup`对象，并为被抓取的对象返回一个Python对象。

下面是内容类(表示网站上的一段内容，比如一篇新闻文章)和两个scraper函数的示例，它们接收一个`BeautifulSoup`对象并返回一个内容实例

```python
import requests

class Content:
    def __init__(self, url, title, body):
        self.url = url
        self.title = title
        self.body = body


def getPage(url):
    req = requests.get(url)
    return BeautifulSoup(req.text, 'html.parser')


def scrapeNYTimes(url):
    bs = getPage(url)
    title = bs.find('h1').text
    lines = bs.select('div.StoryBodyCompanionColumn div p')
    body = '\n'.join([line.text for line in lines])
    return Content(url, title, body)

def scrapeBrookings(url):
    bs = getPage(url)
    title = bs.find('h1').text
    body = bs.find('div', {'class', 'post-body'}).text
    return Content(url, title, body)


url = 'https://www.brookings.edu/blog/future-development/2018/01/26/delivering-inclusive-urban-access-3-uncomfortable-truths/'
content = scrapeBrookings(url)
print('Title: {}'.format(content.title))
print('URL: {}\n'.format(content.url))
print(content.body)

url = 'https://www.nytimes.com/2018/01/25/opinion/sunday/silicon-valley-immortality.html'
content = scrapeNYTimes(url)
print('Title: {}'.format(content.title))
print('URL: {}\n'.format(content.url))
print(content.body)
```

当您开始为其他新闻站点添加scraper功能时，您可能会注意到模式正在形成。每个网站的解析功能本质上都是一样的：

- 选择title元素并提取标题的文本
- 选择文章的主要内容
- 根据需要选择其他内容项
- 返回使用前面找到的字符串实例化的`Content`对象

这里唯一真正的站点相关变量是用于获取每条信息的CSS选择器。`BeautifulSoup`的`find`和`find_all`函数接受两个参数—一个标记字符串和一个键/值属性字典—因此您可以将这些参数作为参数传递进来，这些参数定义站点本身的结构和目标数据的位置。

解释以下`requests`的用法。

```python
r=requests.get(url,params,**kwargs)
```

- `url`: 需要爬取的网站地址。
- `params`: 翻译过来就是参数， `url`中的额外参数，字典或者字节流格式，可选。
- `**kwargs` : 12个控制访问的参数

而对于输出`r`，它的用法如下：

| **属性**            | **说明**                                         |
| ------------------- | ------------------------------------------------ |
| r.status_code       | http请求的返回状态，若为200则表示请求成功。      |
| r.text              | http响应内容的字符串形式，即返回的页面内容       |
| r.encoding          | 从http header 中猜测的相应内容编码方式           |
| r.apparent_encoding | 从内容中分析出的响应内容编码方式（备选编码方式） |
| r.content           | http响应内容的二进制形式                         |

具体例子：(其中有的输出太多，已删除部分)

```python
import requests
r=requests.get("http://www.baidu.com")

r.status_code
200

r.encoding
'ISO-8859-1'

r.apparent_encoding
'utf-8'

r.text
'<!DOCTYPE html>\r\n<!--STATUS OK--><html> <head><meta http-equiv=content-type content=text/html;charset=utf-8>ipt> <a href=//www.baidu.com/more/ name=tj_briicon class=bri style="display: block;">æ\x9b´å¤\x9aäº§å\x93\x81</a> </div> </div> </div> <div id=ftCon> <div id=ftConw> <p id=lh> <a com/ class=cp-feedback>æ\x84\x8fè§\x81å\x8f\x8dé¦\x88</a>&nbsp;äº¬ICPè¯\x81030173å\x8f·&nbsp; <img src=//www.baidu.com/img/gs.gif> </p> </div> </div> </div> </body> </html>\r\n'

r.encoding='utf-8'
r.text
'<!DOCTYPE html>\r\n<!--STATUS OK--><html> <head><meta http-equiv=content-type content=text/html;charset=utf-8><meta http-equiv=X-UA-Compatible content=IE=Edge><meta chref=http://s1.bdstatic.com/r/www/cache/bdorz/baidu.min.css="h读</a>&nbsp; <a href=http://jianyi.baidu.com/ class=cp-feedback>意见反馈</a>&nbsp;京ICP证030173号&nbsp; <img src=//www.baidu.com/img/gs.gif> </p> </div> </div> </div> </body> </html>\r\n'
```

还有，`join(iterable)`函数，用于以指定分隔符将可迭代对象【成员必须为`str`类型】连接为一个新的字符串,分隔符可以为空，返回值位字符串

```python
import os
string = "test"
lis = ['w', 'e', 'q']
tpl = ('w', 'e', 'q')
dic = {"55": 5, "44": 4, "22": 2, "33": 3, "11": 1}

print("11".join(string))
t11e11s11t

print("".join(tpl))
weq

print(" ".join(lis))
w e q

print("key is : [%s] " % (",".join(dic)))
key is : [55,44,22,33,11]
    
# 字符串去重并按从大到小排列
words = "wsasdeddcewtttwssa"
words_set = set(words)  # 集合特性实现去重 字符串集合化
words_list = list(words_set)  # 集合列表化
words_list.sort(reverse=True)  # 设置排序为从大到小
new_words = "".join(words_list)  # join方法以空位分隔符拼接列表元素位新字符串

print(words_list)
['w', 't', 's', 'e', 'd', 'c', 'a']

print(new_words)
wtsedca

print(os.path.join("/home/", "test/", "python"))  
/home/test/python

print(os.path.join("/home", "/test", "/python"), end="")
/python
```

为了让事情变得更方便，你可以使用BeautifulSoup select函数，为你想要收集的每条信息添加一个CSS选择器字符串，然后把所有这些选择器都放到dictionary对象中，而不是处理所有这些标签参数和键/值对：

```python
class Content:
    """
    Common base class for all articles/pages
    """
    def __init__(self, url, title, body):
        self.url = url
        self.title = title
        self.body = body

    def print(self):
        """
        Flexible printing function controls output
        """
        print('URL: {}'.format(self.url))
        print('TITLE: {}'.format(self.title))
        print('BODY:\n{}'.format(self.body))

class Website:
    """ 
    Contains information about website structure
    """

    def __init__(self, name, url, titleTag, bodyTag):
        self.name = name
        self.url = url
        self.titleTag = titleTag
        self.bodyTag = bodyTag
```

请注意，网站类并不存储从各个页面本身收集的信息，而是存储关于如何收集数据的说明。它不存储标题“My Page title”。它只存储字符串标签h1，表示可以在哪里找到标题。这就是为什么这个类被称为网站(这里的信息属于整个网站)，而不是内容(仅包含来自单个页面的信息)。

```python
import requests
from bs4 import BeautifulSoup


class Crawler:

    def getPage(self, url):
        try:
            req = requests.get(url)
        except requests.exceptions.RequestException:
            return None
        return BeautifulSoup(req.text, 'html.parser')

    def safeGet(self, pageObj, selector):
        """
        Utilty function used to get a content string from a Beautiful Soup
        object and a selector. Returns an empty string if no object
        is found for the given selector
        """
        selectedElems = pageObj.select(selector)
        if selectedElems is not None and len(selectedElems) > 0:
            return '\n'.join([elem.get_text() for elem in selectedElems])
        return ''

    def parse(self, site, url):
        """
        Extract content from a given page URL
        """
        bs = self.getPage(url)
        if bs is not None:
            title = self.safeGet(bs, site.titleTag)
            body = self.safeGet(bs, site.bodyTag)
            if title != '' and body != '':
                content = Content(url, title, body)
                content.print()
```

下面的代码定义了网站对象，并开始了这个过程：

```python
crawler = Crawler()

siteData = [
    ['O\'Reilly Media', 'http://oreilly.com', 'h1', 'section#product-description'],
    ['Reuters', 'http://reuters.com', 'h1', 'div.StandardArticleBody_body_1gnLA'],
    ['Brookings', 'http://www.brookings.edu', 'h1', 'div.post-body'],
    ['New York Times', 'http://nytimes.com', 'h1', 'div.StoryBodyCompanionColumn div p']
]
websites = []
for row in siteData:
    websites.append(Website(row[0], row[1], row[2], row[3]))

crawler.parse(websites[0], 'http://shop.oreilly.com/product/0636920028154.do')
crawler.parse(
    websites[1], 'http://www.reuters.com/article/us-usa-epa-pruitt-idUSKBN19W2D0')
crawler.parse(
    websites[2],
    'https://www.brookings.edu/blog/techtank/2016/03/01/idea-to-retire-old-methods-of-policy-education/')
crawler.parse(
    websites[3], 
    'https://www.nytimes.com/2018/01/28/business/energy-environment/oil-boom.html')
```

虽然这个新方法乍一看似乎并不比为每个新站点编写一个新的Python函数简单多少，但是想象一下，当从一个有4个站点源的系统切换到一个有20或200个源的系统时会发生什么。每个字符串列表相对容易编写。它不占太多空间。它可以从数据库或CSV文件加载。它可以从远程源代码导入，也可以交给有一些前端经验的非程序员填写和添加新网站，而且他们永远不必看一行代码。当然，缺点是正在放弃一定程度的灵活性。在第一个例子中，每个网站都有自己的自由形式函数来选择和解析HTML，以获得最终结果。在第二个例子中，每个网站都需要有一个特定的结构，保证字段的存在，字段中的数据必须是干净的，每个目标字段必须有一个唯一的和可靠的CSS选择器。

然而，我认为这种方法的威力和相对灵活性超过了弥补其真实的或察觉到的缺点。下一节将详细介绍这个基本模板的应用程序和扩展，例如，可以处理缺少的字段、收集不同类型的数据、仅遍历网站的特定部分以及存储关于页面的更复杂的信息。

### Structuring Crawlers

如果你仍然需要手工查找每个链接，那么创建灵活的、可修改的网站布局类型并没有多大用处。前一章展示了各种各样的方法，可以自动地在网站上爬行并找到新的页面。本节将展示如何将这些方法合并到一个结构良好且可扩展的网站爬虫程序中，该爬虫程序可以以自动化的方式收集链接和发现数据。我在这里只介绍了三种基本的web爬虫结构，尽管我相信它们适用于您在野外爬行站点时可能需要的大多数情况，只是在这里和那里做了一些修改。如果你遇到一个不寻常的情况与你自己的爬行问题，我也希望你将使用这些结构作为灵感，以创造一个优雅和强大的爬虫设计。

#### Crawling Sites Through Search

抓取网站最简单的方法之一就是使用与人类相同的方法:使用搜索栏。虽然搜索一个网站的关键字或主题，并收集搜索结果列表的过程可能看起来像一项任务，在不同的网站之间有很大的可变性，但有几个关键点使这一点变得非常简单：

- 大多数站点检索特定主题的搜索结果列表，方法是通过URL中的参数将该主题作为字符串传递。例如:`http://example.com?search=myTopic`。URL的第一部分可以保存为网站对象的属性，主题可以简单地附加到它。
- 搜索之后，大多数站点将结果页面呈现为一个易于识别的链接列表，通常带有一个方便的周围标记，如`<span class="result">`，其确切格式也可以作为网站对象的属性存储。
- 每个结果链接要么是相对URL(例如`/articles/page.html`)，要么是绝对URL
  URL(例如,`http://example.com/articles/page.html`)。无论期望的是绝对URL还是相对URL，都可以存储为网站对象的属性。

让我们看看这个算法在代码中的实现。Content类与前面的示例非常相似。正在添加URL属性，以跟踪内容是在哪里找到的：

```python
class Content:
	"""Common base class for all articles/pages"""
	def __init__(self, topic, url, title, body):
		self.topic = topic
		self.title = title
		self.body = body
		self.url = url
        
	def print(self):
		"""
		Flexible printing function controls output
		"""
		print("New article found for topic: {}".format(self.topic))
		print("TITLE: {}".format(self.title))
		print("BODY:\n{}".format(self.body))
		print("URL: {}".format(self.url))
```

网站类添加了一些新属性。`searchUrl`定义了如果您附加了要查找的主题，应该到哪里获取搜索结果。`resultListing`定义了一个“框”，其中包含关于每个结果的信息，`resultUrl`定义了这个框中的标记，它将为您提供结果的确切URL。`absoluteUrl`属性是一个布尔值，它告诉您这些搜索结果是绝对链接还是相对链接。

```python
class Website:
	"""Contains information about website structure"""
	def __init__(self, name, url, searchUrl, resultListing,
		resultUrl, absoluteUrl, titleTag, bodyTag):
		self.name = name
		self.url = url
		self.searchUrl = searchUrl
		self.resultListing = resultListing
		self.resultUrl = resultUrl
		self.absoluteUrl=absoluteUrl
		self.titleTag = titleTag
		self.bodyTag = bodyTag
```

已经扩展了一些，包含了我们的网站数据、要搜索的主题列表和一个循环，该循环遍历所有主题和所有网站。它还包含一个搜索功能，可以导航到特定网站和主题的搜索页面，并提取该页面上列出的所有结果链接。

```python
import requests
from bs4 import BeautifulSoup

class Crawler:

    def getPage(self, url):
        try:
            req = requests.get(url)
        except requests.exceptions.RequestException:
            return None
        return BeautifulSoup(req.text, 'html.parser')

    def safeGet(self, pageObj, selector):
        childObj = pageObj.select(selector)
        if childObj is not None and len(childObj) > 0:
            return childObj[0].get_text()
        return ''

    def search(self, topic, site):
        """
        Searches a given website for a given topic and records all pages found
        """
        bs = self.getPage(site.searchUrl + topic)
        searchResults = bs.select(site.resultListing)
        for result in searchResults:
            url = result.select(site.resultUrl)[0].attrs['href']
            # Check to see whether it's a relative or an absolute URL
            if(site.absoluteUrl):
                bs = self.getPage(url)
            else:
                bs = self.getPage(site.url + url)
            if bs is None:
                print('Something was wrong with that page or URL. Skipping!')
                return
            title = self.safeGet(bs, site.titleTag)
            body = self.safeGet(bs, site.bodyTag)
            if title != '' and body != '':
                content = Content(topic, title, body, url)
                content.print()


crawler = Crawler()

siteData = [
    ['O\'Reilly Media', 'http://oreilly.com', 'https://ssearch.oreilly.com/?q=',
        'article.product-result', 'p.title a', True, 'h1', 'section#product-description'],
    ['Reuters', 'http://reuters.com', 'http://www.reuters.com/search/news?blob=', 'div.search-result-content',
        'h3.search-result-title a', False, 'h1', 'div.StandardArticleBody_body_1gnLA'],
    ['Brookings', 'http://www.brookings.edu', 'https://www.brookings.edu/search/?s=',
        'div.list-content article', 'h4.title a', True, 'h1', 'div.post-body']
]
sites = []
for row in siteData:
    sites.append(Website(row[0], row[1], row[2],
                         row[3], row[4], row[5], row[6], row[7]))

topics = ['python', 'data science']
for topic in topics:
    print('GETTING INFO ABOUT: ' + topic)
    for targetSite in sites:
        crawler.search(topic, targetSite)
```

这个脚本循环遍历主题列表中的所有主题，并在开始抓取主题之前声明:

```
GETTING INFO ABOUT python
```

然后它循环遍历站点列表中的所有站点，并为每个特定的主题抓取每个特定的站点。每当它成功地抓取到关于页面的信息时，就会将其打印到控制台:

```
New article found for topic: python
URL: http://example.com/examplepage.html
TITLE: Page Title Here
BODY: Body content is here
```

注意，它循环遍历所有主题，然后在内部循环遍历所有网站。为什么不反过来，从一个网站收集所有的主题，然后从下一个网站收集所有的主题?首先遍历所有主题是一种更均匀地分配任何一台web服务器上的负载的方法。如果有一个包含数百个主题和数十个网站的列表，这一点尤其重要。你不会一次对一个网站发出成千上万的请求;你发出10个请求，等待几分钟，再发出10个请求，等待几分钟，等等。

尽管请求的数量最终是相同的，但通常情况下，在合理的时间内尽可能多地分发这些请求会更好。注意循环的结构是一种简单的方法。

其中函数解释如下：



#### Crawling Sites Through Links

前一章介绍了一些方法来识别web页面上的内部和外部链接，然后使用这些链接在站点上爬行。在本节中，您将把这些相同的基本方法组合成一个更灵活的网站爬虫程序，它可以遵循任何匹配特定URL模式的链接。

当希望从站点收集所有数据，而不仅仅是从特定的搜索结果或页面列表中收集数据时，这种类型的爬虫非常适合于项目。当站点的页面可能杂乱无章或广泛分散时，它也可以很好地工作。这些类型的爬虫程序不需要结构化的方法来定位链接，就像前一节在搜索页面中爬行一样，因此描述搜索页面的属性在`Website`对象中不需要。但是，因为爬虫没有为它正在寻找的链接的位置提供特定的指令，所以您确实需要一些规则来告诉它应该选择什么样的页面。您提供`targetPattern`(目标`URLs`的正则表达式)，并留下布尔值 `absoluteUrl`变量来完成此操作：

```python
class Website:
	def __init__(self, name, url, targetPattern, absoluteUrl,
		titleTag, bodyTag):
		self.name = name
		self.url = url
		self.targetPattern = targetPattern
		self.absoluteUrl=absoluteUrl
		self.titleTag = titleTag
		self.bodyTag = bodyTag
class Content:
	def __init__(self, url, title, body):
		self.url = url
		self.title = title
		self.body = body
	def print(self):
		print("URL: {}".format(self.url))
		print("TITLE: {}".format(self.title))
		print("BODY:\n{}".format(self.body))
```

Content类与第一个爬虫程序示例中使用的是同一个类。
爬虫类从每个站点的主页开始，定位内部链接，解析找到的每个内部链接的内容：

```python
import re


class Crawler:
    def __init__(self, site):
        self.site = site
        self.visited = []

    def getPage(self, url):
        try:
            req = requests.get(url)
        except requests.exceptions.RequestException:
            return None
        return BeautifulSoup(req.text, 'html.parser')

    def safeGet(self, pageObj, selector):
        selectedElems = pageObj.select(selector)
        if selectedElems is not None and len(selectedElems) > 0:
            return '\n'.join([elem.get_text() for elem in selectedElems])
        return ''

    def parse(self, url):
        bs = self.getPage(url)
        if bs is not None:
            title = self.safeGet(bs, self.site.titleTag)
            body = self.safeGet(bs, self.site.bodyTag)
            if title != '' and body != '':
                content = Content(url, title, body)
                content.print()

    def crawl(self):
        """
        Get pages from website home page
        """
        bs = self.getPage(self.site.url)
        targetPages = bs.findAll('a', href=re.compile(self.site.targetPattern))
        for targetPage in targetPages:
            targetPage = targetPage.attrs['href']
            if targetPage not in self.visited:
                self.visited.append(targetPage)
                if not self.site.absoluteUrl:
                    targetPage = '{}{}'.format(self.site.url, targetPage)
                self.parse(targetPage)


reuters = Website('Reuters', 'https://www.reuters.com', '^(/article/)',
                  False, 'h1', 'div.StandardArticleBody_body_1gnLA')
crawler = Crawler(reuters)
crawler.crawl()
```

这里还有一个以前示例中没有使用的更改：`Website`对象(在本例中是变量`reuters`)是`Crawler`程序对象本身的属性。这对于在爬虫程序中存储已访问页面(已访问`visited`)很有效，但是这意味着必须为每个网站实例化一个新的爬虫程序，而不是重用同一个爬虫程序来抓取一个网站列表。不管您是选择使爬行器网站不可知，还是选择使网站成为爬行器的一个属性，这都是一个设计决策，您必须根据自己的特定需求来权衡。两种方法都可以。

另一件需要注意的事情是，这个爬虫程序将从主页获取页面，但是在所有这些页面都被记录之后，它将不会继续爬行。您可能想编写一个包含第3章中的模式之一的爬行器，并让它在访问的每个页面上查找更多的目标。您甚至可以跟踪每个页面上的所有url(不仅仅是匹配目标模式的url)来查找包含目标模式的`URLs`。

#### Crawling  Multiple Page Types

不像爬行通过预定的一组页面，爬行通过一个网站的所有内部链接可以提出一个挑战，因为你永远不知道你到底得到了什么。幸运的是，有一些基本的方法可以识别页面类型：

- By the URL

网站上的所有博客文章都可能包含一个URL(例如`http://example.com/blog/titl-of-post`)。

- By the presence or lack of certain fields on a site

如果一个页面有日期，但是没有作者的名字，您可以将其归类为新闻稿。如果它有标题、主图像、价格，但没有主内容，那么它可能是一个产品页面。

- By the presence of certain tags on the page to identify the page

即使没有在标记中收集数据，也可以利用标记。您的爬虫程序可能会查找诸如`<div id="relatedproducts">`这样的元素来将页面标识为产品页面，即使爬虫程序对相关产品的内容不感兴趣。

要跟踪多个页面类型，您需要在Python中拥有多个类型的页面对象。这可以通过两种方式实现：

如果所有页面都是相似的(它们的内容类型基本相同)，您可能想要向现有的网站页面对象添加`pageType`属性：

```python
class Website:
	"""Common base class for all articles/pages"""
	def __init__(self, type, name, url, searchUrl, resultListing,
		resultUrl, absoluteUrl, titleTag, bodyTag):
		self.name = name
		self.url = url
		self.titleTag = titleTag
		self.bodyTag = bodyTag
		self.pageType = pageType
```

如果您将这些页面存储在类似sql的数据库中，这种类型的模式表明所有这些页面可能都存储在同一个表中，并且会添加一个额外的`pageType`列。

如果您正在抓取的页面/内容彼此之间有足够的差异(它们包含不同类型的字段)，这可能需要为每种页面类型创建新的对象。当然，有些东西对所有web页面都是通用的，它们都有一个URL，并且很可能还有一个名称或页面标题。这是使用子类的理想情况：

```python
class Webpage:
	"""Common base class for all articles/pages"""
	def __init__(self, name, url, titleTag):
		self.name = name
		self.url = url
		self.titleTag = titleTag
```

这不是一个对象，您的爬虫程序将直接使用，但对象将被您的页面类型引用：

```python
class Product(Website):
	"""Contains information for scraping a product page"""
	def __init__(self, name, url, titleTag, productNumber, price):
		Website.__init__(self, name, url, TitleTag)
		self.productNumberTag = productNumberTag
		self.priceTag = priceTag
        
class Article(Website):
	"""Contains information for scraping an article page"""
	def __init__(self, name, url, titleTag, bodyTag, dateTag):
		Website.__init__(self, name, url, titleTag)
		self.bodyTag = bodyTag
		self.dateTag = dateTag
```

这个产品页面扩展了网站基类，并添加了只适用于产品的属性`productNumbe`r和`price`，而`Article`类添加了不适用于产品的属性`body`和`date`。
您可以使用这两个类来抓取，例如，商店网站除了产品外，可能还包含博客文章或新闻稿。

### Thinking About Web Crawler Models

从互联网上收集信息就像从消防水管里喝水一样。外面有很多东西，你需要什么或者如何需要并不总是很清楚。任何大型web抓取项目(甚至一些小型web抓取项目)的第一步都应该是回答这些问题。

当跨多个域或从多个源收集类似数据时，您的目标几乎总是要将其标准化。处理具有相同和可比字段的数据要比处理完全依赖于原始源格式的数据容易得多。

在许多情况下，您应该构建scraper，并假定将来会向其中添加更多的数据源，并以最小化添加这些新数据源所需的编程开销为目标。即使一个网站乍一看不符合你的模型，它也可能以更微妙的方式符合你的模型。能够看到这些潜在的模式可以节省您的时间、金钱和很多头痛。

数据块之间的连接也不应该被忽略。你希望对于具有“类型”、“大小”或“主题”等跨属性的信息数据来源？如何存储、检索和概念化这些属性软件架构是一个广泛而重要的主题，可能需要整个职业生涯的主人。幸运的是，用于web抓取的软件架构要有限得多一组相对容易掌握的技能。当你继续刮除数据后，您可能会发现相同的基本模式反复出现。创建一个结构良好的web刮刀不需要很多神秘的知识，但是它确实需要花点时间退后一步想想你的项目。