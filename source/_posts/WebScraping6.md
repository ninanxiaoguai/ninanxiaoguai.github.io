---
title: WebScraping-6
date: 2019-07-23 10:51:14
categories:  Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

尽管将数据打印到终端非常有趣，但在数据聚合和分析方面，它并不是非常有用。要使大多数远程有用，您需要能够保存它们所抓取的信息。本章介绍了三种主要的数据管理方法，这些方法几乎适用于任何可以想象的应用程序。您是否需要为网站的后端供电或创建自己的API?您可能希望写入数据库。需要一个快速和简单的方法来收集文件从互联网上，并把他们放在您的硬盘驱动器?您可能想为此创建一个文件流。需要偶尔的提醒，或者每天一次聚合数据?给自己发一封电子邮件!除了web抓取之外，存储和与大量数据交互的能力对于任何现代编程应用程序都非常重要。事实上，本章中的信息对于实现本书后面章节中的许多示例是必要的。如果您不熟悉自动数据存储，我强烈建议您至少浏览一下这一章。

<!--more-->

### Media Files

您可以通过两种主要方式存储媒体文件:引用和下载文件本身。通过存储文件所在的URL，可以通过引用存储文件。
这有几个优点：

- 运行得更快，当他们不需要下载文件时，需要更少的带宽。
- 通过只存储url，您可以在自己的机器上节省空间。
- 编写只存储url且不需要处理额外文件下载的代码会更容易。
- 您可以通过避免大型文件下载来减轻主机服务器上的负载。

缺点如下:

- 将这些url嵌入到您自己的网站或应用程序中称为盗链，这样做是让您在internet上陷入困境的一种快速方法。
- 您不希望使用其他人的服务器周期为自己的应用程序托管媒体。
- 位于任何特定URL的文件都可能发生更改。这可能会导致尴尬的效果，例如，如果你在一个公共博客中嵌入一个热链接图像。如果您存储url的目的是为了稍后存储该文件，以便进行进一步的研究，那么它可能最终会丢失，或者在稍后被更改为完全不相关的内容。
- 真正的web浏览器不只是请求页面的HTML然后继续前进。它们还下载页面所需的所有资产。下载文件可以看起来像一个人在浏览网站，这可能是一个优势。

如果你辩论是否存储文件或URL到一个文件,你应该问问你自己你是否可能视图或读到文件不止一次或两次,或如果该数据库文件是围坐在收集电子尘埃的大部分生活。如果答案是后者，那么最好只存储URL。如果是前者，请继续阅读：

用于检索网页内容的`urllib`库还包含检索文件内容的函数。下面的程序使用`urlib .request.urlretrieve`下载图片从一个远程URL：

```python
from urllib.request import urlretrieve
from urllib.request import urlopen
from bs4 import BeautifulSoup

html = urlopen('http://www.pythonscraping.com')
bs = BeautifulSoup(html, 'html.parser')
imageLocation = bs.find('a', {'id': 'logo'}).find('img')['src']
urlretrieve (imageLocation, 'logo.jpg')
```

这将从`http://pythonscraping.com`下载徽标，并将其作为`logo.jpg`存储在运行脚本的同一目录中。如果您只需要下载一个文件，并且知道如何调用它，以及文件扩展名是什么，那么这种方法非常有效。但大多数抓取器不会下载一个文件，然后就挂掉。下面从`http://pythonscraping.com`的主页下载所有内部文件，这些文件由任何标记的src属性链接到:

```python
import os
from urllib.request import urlretrieve
from urllib.request import urlopen
from bs4 import BeautifulSoup

downloadDirectory = 'downloaded'
baseUrl = 'http://pythonscraping.com'

def getAbsoluteURL(baseUrl, source):
    if source.startswith('http://www.'):
        url = 'http://{}'.format(source[11:])
    elif source.startswith('http://'):
        url = source
    elif source.startswith('www.'):
        url = source[4:]
        url = 'http://{}'.format(source)
    else:
        url = '{}/{}'.format(baseUrl, source)
    if baseUrl not in url:
        return None
    return url

def getDownloadPath(baseUrl, absoluteUrl, downloadDirectory):
    path = absoluteUrl.replace('www.', '')
    path = path.replace(baseUrl, '')
    path = downloadDirectory+path
    directory = os.path.dirname(path)

    if not os.path.exists(directory):
        os.makedirs(directory)

    return path

html = urlopen('http://www.pythonscraping.com')
bs = BeautifulSoup(html, 'html.parser')
downloadList = bs.findAll(src=True)

for download in downloadList:
    fileUrl = getAbsoluteURL(baseUrl, download['src'])
    if fileUrl is not None:
        print(fileUrl)

urlretrieve(fileUrl, getDownloadPath(baseUrl, fileUrl, downloadDirectory))
```

你知道所有那些关于从网上下载未知文件的警告吗?这个脚本将它遇到的所有内容下载到您的计算机硬盘上。这包括随机的`bas`h脚本、`.exe`文件和其他潜在的恶意软件。认为你是安全的，因为你从来没有真正执行任何发送到你的下载文件夹?尤其是如果你以管理员的身份运行这个程序，你就是在自找麻烦。如果你在网站上偶然看到一个文件，它把自己发送到`../../../../usr/bin/ python`吗?下一次从命令行运行Python脚本时，您可能正在您的机器上部署恶意软件!本程序仅为说明目的而编写;它不应该在没有更广泛的文件名检查的情况下随机部署，而且它应该只在具有有限权限的帐户中运行。像往常一样，备份文件、不在硬盘上存储敏感信息，以及使用一点常识，这些都大有帮助。

这个脚本使用一个`lambda`函数(在第2章中介绍)来选择首页上所有具有`src`属性的标记，然后清理和规范url，以获得每个下载的绝对路径(确保丢弃外部链接)。然后，将每个文件下载到您自己机器上下载的本地文件夹中的自己的路径。注意，Python s `os`模块被简单地用于检索每次下载的目标目录，并在需要时沿着路径创建丢失的目录。`os`模块充当Python和操作系统之间的接口，允许它操作文件路径、创建目录、获取有关运行进程和环境变量的信息，以及许多其他有用的东西。

### Storing Data to CSV

CSV(comma-separated values逗号分隔值)是存储电子表格数据的最流行的文件格式之一。由于其简单性，它受到Microsoft Excel和许多其他应用程序的支持。下面是一个完全有效的CSV文件示例:

```
fruit,cost
apple,1.00
banana,0.30
pear,1.25
```

与Python一样，这里的空格也很重要:每一行由换行符分隔，而行中的列由逗号分隔(因此得名csv)。其他形式的CSV文件(有时称为字符分隔值文件)使用制表符或其他字符分隔行，但是这些文件格式不太常见，也不太受广泛支持。

如果您希望直接从web下载CSV文件并将其存储在本地，而不需要进行任何解析或修改，则不需要本节。像下载其他文件一样下载它们，并使用上一节描述的方法以CSV文件格式保存它们。

使用Python的CSV库，修改CSV文件，甚至完全从零开始创建CSV文件都非常容易:

```python
import csv

csvFile = open('test.csv', 'w+')
try:
    writer = csv.writer(csvFile)
    writer.writerow(('number', 'number plus 2', 'number times 2'))
    for i in range(10):
        writer.writerow( (i, i+2, i*2))
finally:
    csvFile.close()
```

警告:用Python创建文件是非常可靠的。如果test.csv还不存在，Python将自动创建文件(而不是目录)。如果已经存在，Python将使用新数据覆盖test.csv。

运行后，你应该看到一个CSV文件:

```
number,number plus 2,number times 2
0,2,0
1,3,2
2,4,4
...
```

个常见的web抓取任务是检索`HTML`表并将其编写为CSV文件。Wikipedia对文本编辑器的比较提供了一个相当复杂的HTML表，其中包含颜色编码、链接、排序和其他HTML垃圾，在将其写入CSV之前需要丢弃这些垃圾。使用`BeautifulSoup`和`get_text()`函数，你可以在20行之内完成:

```python
import csv
from urllib.request import urlopen
from bs4 import BeautifulSoup

html = urlopen('http://en.wikipedia.org/wiki/Comparison_of_text_editors')
bs = BeautifulSoup(html, 'html.parser')
# The main comparison table is currently the first table on the page
table = bs.findAll('table',{'class':'wikitable'})[0]
rows = table.findAll('tr')

csvFile = open('editors.csv', 'wt+',encoding='utf-8')
writer = csv.writer(csvFile)
try:
    for row in rows:
        csvRow = []
        for cell in row.findAll(['td', 'th']):
            csvRow.append(cell.get_text())
        writer.writerow(csvRow)
finally:
    csvFile.close()
```

如果遇到许多HTML表需要转换为CSV文件，或者许多HTML表需要收集到一个CSV文件中，那么这个脚本非常适合集成到scraper中。然而，如果你只需要做一次，有一个更好的工具:复制和粘贴。选择并复制HTML表的所有内容，并将其粘贴到Excel或谷歌文档中，就可以得到您正在寻找的CSV文件，而无需运行脚本。

### MySQL

这个就偷懒了，觉得小项目不太会用到数据库，如果后期用到我再不上。

### Email

这个就偷懒了，觉得小项目不太会用到数据库，如果后期用到我再不上。