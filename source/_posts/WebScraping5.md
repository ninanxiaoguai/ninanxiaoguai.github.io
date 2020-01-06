---
title: WebScraping-5
date: 2019-07-21 22:06:34
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

前一章介绍了构建大型、可伸缩和(最重要的是)可维护的web爬虫程序的一些技术和模式。虽然这很容易手工完成，但是许多库、框架，甚至基于GUI的工具都可以为您完成这一任务，或者至少尝试让您的生活变得更简单一些。

本章介绍了开发爬行器的最佳框架之一：`Scrapy`。编写web爬虫程序的一个挑战是，您经常一次又一次地执行相同的任务：查找页面上的所有链接，评估内部和外部链接之间的差异，转到新页面。了解这些基本模式并能够从头开始编写非常有用，但是Scrapy库为您处理了其中的许多细节。

<!--more-->

当然，`Scrapy`并不是一个读心者。您仍然需要定义页面模板，给它提供开始抓取的位置，并为您要查找的页面定义URL模式。但是在这些情况下，它提供了一个干净的框架来保持代码的组织性。

我是用`anaconda`来安装的，很简单，在库里找到，并且下载就好。可能是网络问题，我也是下载了好几次才成功。其中最新版的文档[在此](/download/scrapy.pdf)。

### Initializing a New Spider

安装了`Scrapy`框架之后，需要为每个爬行器进行少量的设置。蜘蛛是一个杂乱的项目，就像它的同名蛛形纲动物一样，它的设计目的是爬网。在本章中，我特别用“spider”来描述一个杂乱的项目，用“crawler”来表示“任何爬行web的通用程序，不管使用与否”。

要在当前目录中创建一个新的爬行器，可以从命令行运行以下命令：

```
$ scrapy startproject wikiSpider
```

这将在创建项目的目录中创建一个新的子目录，标题为wikiSpider。在这个目录中是以下文件结构：

- scrapy.cfg
- wikiSpider
  - spiders
    -  \_\_init.py\_\_
  - items.py
  - middlewares.py
  - settings.py
  - _\_init.py\_\_

### Writing a Simple Scraper

要创建爬行器，您将在spider目录中的`wikiSpider/ wikiSpider/article.py`中添加一个新文件。在您新创建的`article.py`文件中，编写以下内容：

```python
import scrapy

class ArticleSpider(scrapy.Spider):
    name='article'

    def start_requests(self):
        urls = [
            "http://en.wikipedia.org/wiki/Python_%28programming_language%29",
            "https://en.wikipedia.org/wiki/Functional_programming",
            "https://en.wikipedia.org/wiki/Monty_Python"]
        return [scrapy.Request(url=url, callback=self.parse) for url in urls]

    def parse(self, response):
        url = response.url
        title = response.css('h1::text').extract_first()
        print('URL is: {}'.format(url))
        print('Title is: {}'.format(title))
```

这个类的名称(ArticleSpider)与目录的名称不同(wikiSpider)，表示这个类特别负责在wikiSpider这个更广泛的类别下搜索文章页面，您稍后可能希望使用它搜索其他页面类型。

对于包含多种类型内容的大型站点，您可能为每种类型(博客文章、新闻稿、文章等)都有单独的剪贴项目，每个项目都有不同的字段，但是都运行在相同的剪贴项目下。每个爬行器的名称在项目中必须是惟一的。

关于这个爬行器需要注意的另一个关键问题是两个函数`start_request`s和`parse`。

`start_requests`是用于生成程序的入口点请求`Scrapy`用于抓取网站的对象。

`parse`是由用户定义的回调函数，并通过`callback=self.parse`传递给请求对象。稍后，您将看到使用parse函数可以完成的更强大的功能，但是现在它打印页面的标题。

您可以通过导航到wikiSpider/wikiSpider目录运行本文spider，并运行：

```
scrapy runspider article.py
```

默认的杂乱输出相当冗长。除了调试信息外，还应该打印如下行：

```
2019-07-21 20:47:55 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://en.wikipedia.org/robots.txt> (referer: None)
2019-07-21 20:47:56 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://en.wikipedia.org/wiki/Functional_programming> (referer: None)
URL is: https://en.wikipedia.org/wiki/Functional_programming
Title is: Functional programming
2019-07-21 20:47:56 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://en.wikipedia.org/wiki/Monty_Python> (referer: None)
URL is: https://en.wikipedia.org/wiki/Monty_Python
Title is: Monty Python
2019-07-21 20:47:58 [scrapy.downloadermiddlewares.redirect] DEBUG: Redirecting (301) to <GET https://en.wikipedia.org/wiki/Python_%28programming_language%29> from <GET http://en.wikipedia.org/wiki/Python_%28programming_language%29>
2019-07-21 20:47:58 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://en.wikipedia.org/wiki/Python_%28programming_language%29> (referer: None)
URL is: https://en.wikipedia.org/wiki/Python_%28programming_language%29
Title is: Python (programming language)
```

`scraper`转到作为`start_urls`列出的三个页面，收集信息，然后终止。

### Spidering with Rules

前一节中的爬行器并不是爬行器，仅限于抓取它提供的`ur`l列表。它没有能力自己寻找新的页面。把它要成为一个成熟的爬虫程序，您需要使用由Scrapy。

不幸的是，这种杂乱的框架不能很容易地在`jupyter notebook`中运行，这使得代码的线性进展难以捕捉。为了在文本中显示所有代码示例，本文存储了上一节中的`scraper.py`文件，而下面的示例创建了一个遍历多个页面的杂乱爬行器，存储在`article .py`中(注意复数形式的使用)。

后面的示例也将存储在单独的文件中，每个部分都给出了新的文件名。运行这些示例时，请确保使用了正确的文件名。

```python
# 注意：以下两行已经不支持###############
from scrapy.contrib.linkextractors import LinkExtractor
from scrapy.contrib.spiders import CrawlSpider, Rule
# 注意：以上两行已经不支持###############

#改成:

from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spiders import CrawlSpider,Rule
```

创建文件名`articles.py`，并写入：

```python
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spiders import CrawlSpider,Rule

class ArticleSpider(CrawlSpider):
    name = 'articles'
    allowed_domains = ['wikipedia.org']
    start_urls = ['https://en.wikipedia.org/wiki/Benevolent_dictator_for_life']
    rules = [Rule(LxmlLinkExtractor(allow=r'.*'), callback='parse_items', follow=True)]

    def parse_items(self, response):
        url = response.url
        title = response.css('h1::text').extract_first()
        text = response.xpath('//div[@id="mw-content-text"]//text()').extract()
        lastUpdated = response.css('li#footer-info-lastmod::text').extract_first()
        lastUpdated = lastUpdated.replace('This page was last edited on ', '')
        print('URL is: {}'.format(url))
        print('title is: {} '.format(title))
        print('text is: {}'.format(text))
        print('Last updated: {}'.format(lastUpdated))
```

这个新的`ArticleSpider`扩展了`CrawlSpider`类。它没有提供`start_requests`函数，而是提供了`start_urls`和`allowed_domains`的列表。这将告诉爬虫从哪里开始爬行，以及它应该遵循还是忽略基于域的链接。

还提供了`rules`列表。这进一步说明了哪些链接可以遵循或忽略(在本例中，您允许使用正则表达式`. *`的所有URLs)。

除了提取每个页面上的标题和URL外，还添加了几个新项。使用`XPath`选择器提取每个页面的文本内容。`XPath`通常用于检索文本内容，包括子标记中的文本(例如，文本块中的`<a>`标记)。如果使用CSS选择器来实现这一点，子标记中的所有文本都将被忽略。

最后更新的日期字符串也从页脚解析并存储在`lastUpdated`变量中。

让我们使用Scrapy 's Rule和`LinkExtractor`仔细看看这行代码:

```python
rules = [Rule(LinkExtractor(allow=r'.*'), callback='parse_items',follow=True)]
```

这一行提供了一个杂乱`Rule`对象列表，这些对象定义了所有找到的链接都要经过过滤的规则。当有多个规则时，按顺序根据规则检查每个链接。第一个匹配的规则用于确定如何处理链接。如果链接不匹配任何规则，则忽略它。它有六个参数：

- link_extractor

  唯一的强制参数是`LxmlLinkExtractor`对象

- callback

  用于解析页面内容的函数

- cb_kwargs

  要传递给`callback`函数的参数的字典。该字典的格式为{arg_name1: arg_value1, arg_name2: arg_value2}，可以作为一个方便的工具，重用相同的解析函数，用于稍微不同的任务。

- follow

  指示是否希望在将来的爬行中包含在该页面中找到的链接。如果没有提供回调函数，则默认值为True(毕竟，如果您没有对页面做任何操作，那么您至少应该使用它来继续在站点中爬行)。如果提供回调函数，则默认为False。

`LxmlLinkExtractor`r是一个简单的类，专门用于根据提供给它的规则识别和返回`HTML`内容页面中的链接。它有许多参数，可用于接受或拒绝基于`CSS`和`XPath`选择器的链接、标记(您可以在不仅仅是锚标记中寻找链接!)、域等等。

`LxmlLinkExtractor`类甚至可以扩展，并且可以创建自定义参数。有关更多信息，请参阅有关链接提取器的Scrapy文档。

- allow

  允许与提供的正则表达式匹配的所有链接

- deny

  拒绝与提供的正则表达式匹配的所有链接

使用两个单独的规则和一个解析函数的`LinkExtractor`类，您可以创建一个爬行`Wikipedia`的爬行器，识别所有文章页面并标记非文章页面(`articlesmorerulls .py`)：

```python
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spiders import CrawlSpider,Rule

class ArticleSpider(CrawlSpider):
    name = 'articles'
    allowed_domains = ['wikipedia.org']
    start_urls = ['https://en.wikipedia.org/wiki/Benevolent_dictator_for_life']
    rules = [
        Rule(LxmlLinkExtractor(allow='^(/wiki/)((?!:).)*$'), callback='parse_items', follow=True, cb_kwargs={'is_article': True}),
        Rule(LxmlLinkExtractor(allow='.*'), callback='parse_items', cb_kwargs={'is_article': False})
    ]

    def parse_items(self, response, is_article):
        print(response.url)
        title = response.css('h1::text').extract_first()
        if is_article:
            url = response.url
            text = response.xpath('//div[@id="mw-content-text"]//text()').extract()
            lastUpdated = response.css('li#footer-info-lastmod::text').extract_first()
            lastUpdated = lastUpdated.replace('This page was last edited on ', '')
            print('Title is: {} '.format(title))
            print('title is: {} '.format(title))
            print('text is: {}'.format(text))
        else:
            print('This is not an article: {}'.format(title))


```

回想一下，这些规则按照它们在列表中显示的顺序应用于每个链接。所有文章页面(以`/wiki/`开头且不包含冒号的页面)首先传递给`parse_items`函数，默认参数为`is_arti cle=True`。然后，将所有其他的非article链接传递给parse_items函数，参数为`is_article=False`。

当然，如果您希望只收集文章类型的页面而忽略其他所有页面，那么这种方法是不切实际的。如果忽略与文章URL模式不匹配的页面，并完全忽略第二条规则(以及`is_arti cle`变量)，则会容易得多。然而，这种方法在URL信息或爬行过程中收集的信息影响页面解析方式的奇怪情况下可能很有用。

### Creating Items

到目前为止，您已经了解了许多查找、解析和爬行网站的方法。但是，Scrapy还提供了一些有用的工具，用于将收集到的项组织起来，并将其存储在具有定义良好字段的自定义对象中。

要帮助组织正在收集的所有信息，您需要创建一个`Article`对象。在`items.py`文件中定义一个名为`Article`的新项目。
当您打开`items.py`文件时，它应该是这样的:

```python
# -*- coding: utf-8 -*-
# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html
import scrapy
class WikispiderItem(scrapy.Item):
	# define the fields for your item here like:
	# name = scrapy.Field()
	pass
```

用一个扩展了`Scrapy.Item`的新Article类替换这个默认的`Item`存根。

```python
import scrapy
class Article(scrapy.Item):
	url = scrapy.Field()
	title = scrapy.Field()
	text = scrapy.Field()
	lastUpdated = scrapy.Field()
```

您正在定义将从每个页面收集的三个字段：标题、URL和页面最后一次编辑的日期。

如果要为多个页面类型收集数据，应该在`items.py`中将每个单独的类型定义为它自己的类。如果您的项比较大，或者您开始将更多的解析功能转移到项对象中，您还可能希望将每个项提取到自己的文件中。然而，尽管这些项目很小，但我喜欢将它们保存在一个文件中。

在文件`ArticleSpider .py`中，注意为了创建新的文章项，对`ArticleSpider`类所做的更改:

```python
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spiders import CrawlSpider,Rule
from wikiSpider.items import Article

class ArticleSpider(CrawlSpider):
    name = 'articleItems'
    allowed_domains = ['wikipedia.org']
    start_urls = ['https://en.wikipedia.org/wiki/Benevolent_dictator_for_life']
    rules = [
        Rule(LxmlLinkExtractor(allow='(/wiki/)((?!:).)*$'), callback='parse_items', follow=True),
    ]

    def parse_items(self, response):
        article = Article()
        article['url'] = response.url
        article['title'] = response.css('h1::text').extract_first()
        article['text'] = response.xpath('//div[@id="mw-content-text"]//text()').extract()
        lastUpdated = response.css('li#footer-info-lastmod::text').extract_first()
        article['lastUpdated'] = lastUpdated.replace('This page was last edited on ', '')
        return article
```

它将输出通常杂乱的调试数据以及每个项目Python字典:

```

```

用杂乱的条目不仅仅是为了促进良好的代码组织，或者以一种可读的方式进行布局。项目提供了许多用于输出和处理数据的工具，这些工具将在下一节中介绍。

### Outputting Items

Scrapy使用`Item`对象来确定应该从它访问的页面中保存哪些信息。这些信息可以通过多种方式保存，如`CSV`、`JSON`或`XML`文件，使用以下命令:

```
$ scrapy runspider articleItems.py -o articles.csv -t csv
$ scrapy runspider articleItems.py -o articles.json -t json
$ scrapy runspider articleItems.py -o articles.xml -t xml
```

每一个都运行scraper `articleItems`项，并将指定格式的输出写入提供的文件。如果该文件不存在，将创建该文件。

您可能已经注意到，在前面的示例中创建的文章spider中，文本变量是字符串列表，而不是单个字符串。这个列表中的每个字符串表示单个HTML元素中的文本，而`<div id="mwcontent- text">`中的内容(您从其中收集文本数据)由许多子元素组成。Scrapy很好地管理了这些更复杂的值。例如，在CSV格式中，它将列表转换为字符串并转义所有逗号，以便在单个CSV单元格中显示文本列表。

在XML中，这个列表的每个元素都保存在子值标签中：

```xml
<items>
<item>
   <url>https://en.wikipedia.org/wiki/Benevolent_dictator_for_life</url>
   <title>Benevolent dictator for life</title>
   <text>
       <value>For the political term, see </value>
       <value>Benevolent dictatorship</value>
       ...
   </text>
    <lastUpdated> 13 December 2017, at 09:26.</lastUpdated>
</item>
....
```

在JSON格式中，列表保存为列表。
当然，您可以自己使用Item对象，并以您想要的任何方式将它们写入文件或数据库，只需在爬虫程序的解析函数中添加适当的代码即可。

### The Item Pipeline

虽然Scrapy是单线程的，但它能够异步地发出和处理许多请求。这使得它比本书目前所写的scraper更快，尽管我一直坚信，对于web抓取来说，速度并不总是越快越好。

使用`item pipeline`可以在等待请求返回的同时执行所有数据处理，而不是在发出另一个请求之前等待数据处理，从而进一步提高web scraper的速度。当数据处理需要大量时间或必须执行处理器密集型计算时，有时甚至需要这种类型的优化。要创建项目管道，请重新访问本章开头创建的`settings.py`文件。您应该看到以下注释行

```
# Configure item pipelines
# See http://scrapy.readthedocs.org/en/latest/topics/item-pipeline.html
#ITEM_PIPELINES = {
# 'wikiSpider.pipelines.WikispiderPipeline': 300,
#}
```

取消最后三行注释，代之以：

```
ITEM_PIPELINES = {
	'wikiSpider.pipelines.WikispiderPipeline': 300,
}
```

这提供了一个Python类 `wikispider .pipeline`。`WikispiderPipeline`将用于处理数据，如果有多个处理类，则使用一个整数表示运行管道的顺序。虽然这里可以使用任何整数，但通常使用0-1000，并且将按升序运行。

现在，您需要添加管道类并重写原始爬行器，以便爬行器收集数据，而管道将执行繁重的数据处理工作。在原始爬行器中编写`parse_items`方法来返回响应并让管道创建`Article`对象，这可能很有吸引力：

```python
def parse_items(self, response):
	return response
```

但是，`Scrapy`框架不允许这样做，并且不允许一个`Item`对象(例如必须返回`Article`，它扩展`Item`)。所以`parse_items`现在的目标是提取原始数据，尽可能少的处理，这样它就可以传递给管道:

```python
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spiders import CrawlSpider,Rule
from wikiSpider.items import Article

class ArticleSpider(CrawlSpider):
    name = 'articlePipelines'
    allowed_domains = ['wikipedia.org']
    start_urls = ['https://en.wikipedia.org/wiki/Benevolent_dictator_for_life']
    rules = [
        Rule(LxmlLinkExtractor(allow='(/wiki/)((?!:).)*$'), callback='parse_items', follow=True),
    ]

    def parse_items(self, response):
        article = Article()
        article['url'] = response.url
        article['title'] = response.css('h1::text').extract_first()
        article['text'] = response.xpath('//div[@id="mw-content-text"]//text()').extract()
        article['lastUpdated'] = response.css('li#footer-info-lastmod::text').extract_first()
        return article
```



当然，现在需要通过添加管道将`settings.py`文件和更新后的爬行器绑定在一起。当Scrapy项目第一次初始化时，在`wikiSpider/wikiSpider/pipelines.py`文件中创建了一个文件:

```python
# -*- coding: utf-8 -*-
# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
class WikispiderPipeline(object):
	def process_item(self, item, spider):
		return item
```

应该用新的管道代码替换这个存根类。在前面的部分中，您已经以原始格式收集了两个字段，这些字段可以使用额外的处理：`lastUpdated`(这是一个格式很差的字符串对象，表示一个日期)和`text`(一组杂乱的字符串片段)。

应该使用以下代码替换`wikiSpider/wikiSpider/ pipelines.py`中的存根代码:

```python
from datetime import datetime
from wikiSpider.items import Article
from string import whitespace

class WikispiderPipeline(object):
    def process_item(self, article, spider):
        article['lastUpdated'] = article['lastUpdated'].replace('This page was last edited on', '')
        article['lastUpdated'] = article['lastUpdated'].strip()
        article['lastUpdated'] = datetime.strptime(article['lastUpdated'], '%d %B %Y, at %H:%M.')
        article['text'] = [line for line in article['text'] if line not in whitespace]
        article['text'] = ''.join(article['text'])
        return article
```

类`WikispiderPipeline`有一个`process_item`方法，该方法接收`Article`对象，将最后更新的字符串解析为`Python datetime`对象，并将文本从字符串列表中清理并连接到单个字符串中。

`process_item`是每个管道类的强制方法。Scrapy使用此方法异步传递爬行器收集的`Item`。例如，如果您像上一节那样将条目输出到`JSON`或`CSV`，那么这里返回的已解析的Article对象将被Scrapy记录或打印。

现在，在决定在何处进行数据处理时，您有两种选择:爬行器中的`parse_items`方法，或者管道中的`process_items`方法。

可以在settings.py文件中声明具有不同任务的多个管道。然而，Scrapy按顺序将所有项目(无论项目类型如何)传递到每个管道。在数据到达管道之前，项目特定的解析可能在爬行器中得到更好的处理。但是，如果这种解析需要很长时间，您可能需要考虑将其移动到管道(在管道中可以异步处理它)，并添加对项类型的检查:

```python
def process_item(self, item, spider):
	if isinstance(item, Article):
	# Article-specific processing here
```

在编写杂乱的项目，尤其是大型项目时，要考虑哪些处理和在哪里处理。

### Logging with Scrapy

由Scrapy生成的调试信息可能很有用，但是，正如您可能已经注意到的，它通常过于冗长。你可以很容易地调整日志记录的水平，在你的Scrapy项目的settings.py文件中添加一行:

```python
LOG_LEVEL = 'ERROR'
```

Scrapy使用了日志级别的标准层次结构，如下所示:

- CRITICAL
- ERROR
- WARNING
- DEBUG
- INFO

如果日志设置为`ERROR`，则只显示`CRITICAL`和`ERROR`日志。如果日志设置为`INFO`，那么将显示所有日志，依此类推。

除了通过`settings.py`文件控制日志记录之外，还可以从命令行控制日志的位置。若要将日志输出到单独的日志文件而不是终端，请在从命令行运行时定义一个日志文件:

```
$ scrapy crawl articles -s LOG_FILE=wiki.log
```

这将在当前目录中创建一个新的日志文件(如果不存在)，并将所有日志输出到该文件中，从而使终端只显示手动添加的Python print语句。

### More Resources

Scrapy是一个强大的工具，可以处理与web爬行相关的许多问题。它自动收集所有url并将它们与预定义的规则进行比较，确保所有url都是惟一的，在需要的地方对相对url进行规范化，并递归更深入地进入页面。

尽管本章几乎没有触及到Scrapy功能的表面，但我鼓励您查看Dimitrios编写的[Scrapy文档](/download/scrapy.pdf)，并学习一下它库兹-劳卡斯(O 'Reilly)编写的[Learning Scrapy](/download/Learning Scrapy.pdf)，提供了关于该框架的全面论述。

Scrapy是一个非常大且不断扩展的库，具有许多特性。它的功能可以无缝地协同工作，但有许多重叠的领域，使用户可以轻松地在其中开发自己的特定样式。如果有什么你想做的
这里没有提到，可能有一种(或几种)方法可以做到！