---
title: WebScraping-7
date: 2019-07-24 22:30:07
categories:  Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

本章将介绍如何处理文档，无论您是将它们下载到本地文件夹，还是阅读它们并提取数据。您还将了解如何处理各种类型的文本编码，这甚至可以使阅读外语成为可能HTML页面。

<!--more-->

人们很容易认为互联网主要是一个基于文本的网站集合，其中点缀着新颖的web 2.0多媒体内容，这些内容在web抓取的目的中基本上可以忽略。然而，这忽略了internet最基本的特性:传输文件的内容无关工具。

尽管互联网自20世纪60年代末以来就以某种形式存在，HTML直到1992年才首次出现。在那之前，互联网主要由电子邮件和文件传输组成;我们今天所知道的web页面的概念并不存在。换句话说，internet不是HTML文件的集合。它是许多类型的文档的集合，HTML文件通常用作展示它们的框架。由于无法读取各种文档类型，包括文本、PDF、图像、视频、电子邮件等，我们将丢失大量可用数据。

### Document Encoding

文档的编码告诉应用程序——无论它们是您计算机的操作系统还是您自己的Python代码——如何读取它。这种编码通常可以从它的文件扩展名推断出来，尽管这个文件扩展名不是由它的编码强制的。例如，我可以毫无问题地将`myImage.jpg`保存为`myImage.txt`—至少在我的文本编辑器尝试打开它之前是这样。幸运的是，这种情况很少见，为了正确读取文档，通常只需要知道文档的文件扩展名。

在基本级别上，所有文档都是用0和1编码的。最重要的是，编码算法定义了诸如“每个字符有多少位”或“每个像素有多少位代表颜色”之类的东西(对于图像文件)。除此之外，您可能还有一层压缩，或者一些空间缩减算法，就像PNG文件的情况一样。

尽管一开始处理非html文件可能看起来有些吓人，但是请放心，使用正确的库，Python将能够正确地处理任何格式的信息。文本文件、视频文件和图像文件之间的唯一区别是如何解释它们的0和1。本章介绍几种常见的文件类型:文本、CSV、pdf和Word文档。

注意，这些基本上都是存储文本的文件。有关处理图像的信息，我建议您通读本章，以便习惯处理和存储不同类型的文件，然后阅读第13章，了解关于图像处理的更多信息!

### Text

将文件以纯文本形式存储在网上有些不同寻常，但在一些基本的网站或老式网站中，拥有大型文本文件存储库很受欢迎。例如，Internet Engineering Task Force (IETF)将其所有已发布的文档存储为HTML、PDF和文本文件(参见`https://www.ietf.org/rfc/rfc1149.txt`)。大多数浏览器都会很好地显示这些文本文件，您应该能够毫无问题地抓取它们。

```python
from bs4 import BeautifulSoup
from urllib.request import urlopen
textPage = urlopen('http://www.pythonscraping.com/pages/warandpeace/chapter1.txt')
print(textPage.read())
```

通常，当您使用`urlopen`检索页面时，您将它转换为一个`BeautifulSoup`对象来解析HTML。在这种情况下，您可以直接读取页面。虽然完全有可能将其转换为一个`BeautifulSoup`对象，但这只会适得其反——因为没有HTML要解析，所以库将毫无用处。一旦文本文件以字符串的形式读入，您只需像将任何其他字符串读入Python那样分析它。当然，这里的缺点是您没有能力使用HTML标记作为上下文线索，指向实际文本的方向

#### Text Encoding and the Global Internet

还记得我之前说过，正确读取文件只需要一个文件扩展名吗？奇怪的是，这个规则并不适用于所有最基本的文档:.txt文件。10次中有9次，使用前面描述的方法阅读文本会很好。然而，处理互联网上的文本可能是一件棘手的事情。接下来，我们将介绍英语和外语编码的基础知识，从`ASCII`到`Unicode`到`ISO`，以及如何处理它们。

**a history of text encoding**

ASCII最早出现在20世纪60年代，当时比特非常昂贵，除了拉丁字母和一些标点符号外，没有理由对任何东西进行编码。由于这个原因，总共只有7位被用于编码128个大写字母、小写字母和标点符号。即使有这么多的创意，他们仍然留下了33个非打印字符，其中一些被使用，取代，和/或成为过时的技术变化多年。每个人都有足够的空间，对吧?

任何程序员都知道，7是一个奇怪的数字。它不是一个很好的2次方，但是它非常接近。在20世纪60年代，计算机科学家们就是否应该增加额外的位进行了争论，到底是为了方便得到一个漂亮的整数，还是为了实际的文件需要更少的存储空间。最后，7位赢了。然而，在现代计算中，每个7位序列的开头都加了一个额外的0，这就给我们留下了两个世界中最糟糕的情况——14%的文件变大了，而且只缺少128个字符的灵活性。

在20世纪90年代初，人们意识到存在着比英语更多的语言，如果电脑能显示这些语言那就太好了。一个名为Unicode联盟试图通过为任何文本文档、任何语言中需要使用的每个字符建立编码来实现一个通用的文本编码器。目标是包括从拉丁字母编写的这本书是,西里尔,中国象形图,数学和逻辑符号，甚至表情符号和各种各样的符号,如生物危害和标志。

您可能已经知道，生成的编码器被命名为`UTF-8`，它的意思是“通用字符集转换格式8位”。这里的8位并不是指每个字符的大小，而是指一个字符需要显示的最小大小。

`UTF-8`字符的实际大小是灵活的。它们的范围从1字节到4字节，这取决于它们在可能的字符列表中的位置(更流行的字符用更少的字节编码，更不常见的字符需要更多的字节)。

如何实现这种灵活的编码？使用7位加上最终无用的前导0起初看起来像是ASCII中的一个设计缺陷，但事实证明`UTF-8`具有巨大的优势。由于`ASCII`非常流行，`Unicode`决定利用这个领先的0位，以0开头声明所有字节，以表示字符中只使用一个字节，并使`ASCII`和`UTF-8`的两种编码方案相同。因此，以下字符在`UTF-8`和`ASCII`中都是有效的。

```
01000001 - A
01000010 - B
01000011 - C
```

以下字符仅在`UTF-8`中有效，如果将文档解释为ASCII文档，则将呈现为不可打印：

![](WebScraping7\1.png)

除了UTF-8之外，还存在其他UTF标准，如UTF-16、UTF-24和UTF-32，尽管以这些格式编码的文档很少出现，除非在不寻常的情况下，这超出了本书的范围。

虽然`ASCII`的这个原始设计缺陷对`UTF-8`有一个主要的优势，但是这个劣势并没有完全消失。每个字符的前8位信息仍然只能编码128($2^7$)个字符，而不能编码完整的256个字符。在需要多个字节的`UTF-8`字符中，额外的前导位不是用于字符编码，而是用于防止损坏的检查位。在4字节字符中的32位(8 $\times$ 4)中，只有21位用于字符编码，总共有2,097,152个可能的字符，其中当前分配了1,114,112个。当然，所有通用语言编码标准的问题在于，任何用一种外语编写的文档都可能比必须的大得多。虽然您的语言可能只有100个左右的字符，但是每个字符需要16位，而不是像特定于英语的`ASCII`那样只需要8位。这使得`UTF-8`中的外语文本文档的大小大约是英语文本文档的两倍，至少对于不使用拉丁字符集的外语来说是这样。

`ISO`通过为每种语言创建特定的编码来解决这个问题。与`Unicode`一样，它具有与`ASCII`相同的编码，但是在每个字符的开头使用填充0位，以便为所有需要它们的语言创建128个特殊字符。这对于严重依赖拉丁字母(在编码中仍处于0 127的位置)，但需要额外特殊字符的欧洲语言最有效。这允许`ISO-8859-1**`**

**Encodings in action**

在上一节中，您使用了urlopen的默认设置来读取可能在internet上遇到的文本文档。这对大多数英语文本都很有用。然而，当你遇到俄语、阿拉伯语，甚至像“resume”这样的单词时，你可能会遇到问题。

以下面的代码为例:

```python
from urllib.request import urlopen
textPage = urlopen('http://www.pythonscraping.com/pages/warandpeace/chapter1-ru.txt')
print(textPage.read())
```

这读在第一章的原始战争与和平(写在俄罗斯和并将其打印到屏幕上。这个屏幕文本的部分内容如下:

```
b"\xd0\xa7\xd0\x90\xd0\xa1\xd0\xa2\xd0\xac \xd0\x9f\xd0\x95\xd0\xa0\xd0\x92\xd0\x90\xd0\xaf\n\nI\n\n\xe2\x80\x94 Eh bien, mon prince.
```

此外，在大多数浏览器中访问这个页面会导致胡言乱语。

即使对母语为俄语的人来说，这也可能有点难以理解。问题是Python试图将文档读取为ASCII文档，而浏览器则试图将其读取为ISO-8859-1编码的文档。
当然，双方都没有意识到这是一个UTF-8文档。您可以显式地将字符串定义为UTF-8，它可以正确地将输出格式化为Cyrillic字符:

```python
from urllib.request import urlopen

textPage = urlopen(
             'http://www.pythonscraping.com/pages/warandpeace/chapter1-ru.txt')
print(str(textPage.read(), 'utf-8'))
```

在`BeautifulSoup`和Python 3.x中使用这个概念是这样的:

```python
from urllib.request import urlopen
html = urlopen("http://en.wikipedia.org/wiki/Python_(programming_language)")
bs = BeautifulSoup(html, "html.parser")
content = bs.find("div", {"id":"mw-content-text"}).get_text()
content = bytes(content, "UTF-8")
content = content.decode("UTF-8")
print(content)
```

Python 3.默认情况下，将所有字符编码为`UTF-8`。您可能会忍不住不去管它，而是为您编写的每个web scraper使用`UTF-8`编码。毕竟，`UTF-8`还可以流畅地处理`ASCII`字符和外语。然而，重要的是要记住9%的网站使用的是`ISO`编码也一样，所以你永远无法完全避免这个问题。

幸运的是，对于HTML页面，编码通常包含在站点的<head>部分中找到的标记中。大多数网站，尤其是英语网站，都有这样的标签：

```html
<meta charset="utf-8" />
```

而ECMA国际的网站上有这个标签：

```html
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-8859-1">
```

如果您计划进行大量的web抓取，特别是国际站点，那么在阅读页面内容时，最好查找这个元标记并使用它推荐的编码。

### CSV

当web抓取时，您可能会遇到CSV文件或喜欢这种格式的数据的同事。幸运的是，Python有一个非常棒的库，可以读取和写入CSV文件。尽管这个库能够处理CSV的许多变体，但本节主要关注标准格式。如果您有特殊情况需要处理，请参考文档!

**Reading CSV Files**

Python的csv库主要用于处理本地文件，假设您需要的csv数据存储在您的机器上。不幸的是，情况并非总是如此，尤其是在web抓取时。有几种方法可以解决这个问题:

- 手工下载文件并将Python指向本地文件位置
- 编写一个Python脚本来下载文件、读取文件，并(可选地)在检索后删除文件。
- 从web中以字符串的形式检索该文件，并将该字符串包装在StringIO对象中，这样它的行为就像一个文件。

虽然前两个选项是可行的，但是当您可以轻松地将文件保存在内存中时，占用硬盘空间是一种不好的做法。更好的方法是将文件读入字符串并将其封装在一个对象中，该对象允许Python将其视为文件，而无需保存文件。下面的脚本从internet检索CSV文件
(在本例中，Monty Python相册列表位于`http://pythonscraping.com/files/Monty‐PythonAlbums.csv`然后一行一行地打印到终端:

```python
from urllib.request import urlopen
from io import StringIO
import csv

data = urlopen('http://pythonscraping.com/files/MontyPythonAlbums.csv').read().decode('ascii', 'ignore')
dataFile = StringIO(data)
csvReader = csv.reader(dataFile)

for row in csvReader:
    print(row)
    print("The album \""+row[0]+"\" was released in "+str(row[1]))

```

输出类似如下：

```
['Name', 'Year']
The album "Name" was released in Year
["Monty Python's Flying Circus", '1970']
The album "Monty Python's Flying Circus" was released in 1970
['Another Monty Python Record', '1971']
The album "Another Monty Python Record" was released in 1971
["Monty Python's Previous Record", '1972']
...

```

注意第一行:专辑“Name”是在那年发行的。虽然在编写示例代码时，这可能是一个容易忽略的结果，但您不希望在现实世界中将其放入数据中。级别较低的程序员可能只是跳过`csvReade`r对象中的第一行，或者用特殊的情况编写来处理它。幸运的是，csv的替代品。reader函数会自动为您处理所有这些。输入`DictReader`:

```python
from urllib.request import urlopen
from io import StringIO
import csv

data = urlopen("http://pythonscraping.com/files/MontyPythonAlbums.csv").read().decode('ascii', 'ignore')
dataFile = StringIO(data)
dictReader = csv.DictReader(dataFile)

print(dictReader.fieldnames)

for row in dictReader:
    print(row)

```

输出类似如下：

```
['Name', 'Year']
OrderedDict([('Name', "Monty Python's Flying Circus"), ('Year', '1970')])
OrderedDict([('Name', 'Another Monty Python Record'), ('Year', '1971')])
OrderedDict([('Name', "Monty Python's Previous Record"), ('Year', '1972')])
OrderedDict([('Name', 'The Monty Python Matching Tie and Handkerchief'), ('Year', '1973')])
OrderedDict([('Name', 'Monty Python Live at Drury Lane'), ('Year', '1974')])
...

```

`csv.DictReader`返回CSV文件中每一行的值作为`dictionary`对象而不是list对象，字段名存储在变量`DictReader`中。字段名和键在每个`dictionary`对象:

当然，与`csvReader`相比，它的缺点是创建、处理和打印这些DictReader对象所需的时间稍微长一些，但是其方便性和可用性通常值得额外的开销。也要记住,当涉及到web抓取请求所需的开销和检索网站数据从外部服务器几乎总是会不可避免的限制因素在任何程序编写,所以担心技术可能刮微秒你总运行时通常是一个有争议的问题！

### PDF

作为一名Linux用户，我知道被发送一个.docx文件的痛苦，我的非微软软件把这个文件弄得一团糟，而且我还在努力寻找代码编解码器来解释一些新的苹果媒体格式。在某种程度上，Adobe在1993年创建其可移植文档格式方面是革命性的。pdf允许不同平台上的用户以完全相同的方式查看图像和文本文档，而不管他们是在哪个平台上查看的。尽管在web上存储pdf有点过时(当您可以将其编写为HTML时，为什么要以静态、慢加载的格式存储内容?)，但是pdf仍然无处不在，尤其是在处理官方表单和归档时。2009年，一位名叫尼克·英尼斯(Nick Innes)的英国人因为要求白金汉郡市议会提供公开的学生考试成绩信息而上了新闻。根据英国版的《信息自由法》(Freedom of information Act)，白金汉郡市议会可以获得学生的考试成绩信息。在多次请求和拒绝之后，他终于收到了184份PDF文件，这是他要找的资料。尽管Innes坚持了下来，并最终获得了一个格式更合适的数据库，但如果他是一个专业的web scraper，他很可能会在法庭上节省很多时间，直接使用PDF文档，使用Python的许多PDF解析模块之一。

不幸的是，许多pdf解析库都是为python2构建的。没有随着Python 3.x的发布而升级。不过，因为PDF是相对而言的简单和开放源码的文档格式，许多体面的Python库，甚至在
Python 3.x，可以读出来。

`PDFMiner3K`就是这样一个相对容易使用的库。它是灵活的，允许命令行使用或集成到现有代码中。它还可以处理各种语言编码——同样，这在web上经常派上用场。

这里是一个基本的实现，允许你读取任意的pdf到一个字符串，给定一个本地文件对象：

这个PDF阅读器的好处是，如果你在本地处理文件，你可以用一个普通的Python文件对象替换urlopen返回的文件对象，并使用下面这行代码:

```python
pdfFile = open('../pages/warandpeace/chapter1.pdf', 'rb')

```

输出可能并不完美，特别是对于带有图像、格式奇怪的文本或表或图表中的文本的pdf。但是，对于大多数纯文本PDF，输出应该与PDF是文本文件时的输出没有什么不同。

### Microsoft Word and .docx

冒着冒犯微软朋友的风险:我不喜欢微软Word。不是因为它一定是一个坏软件，而是因为它的用户滥用它的方式。它有一种特殊的天赋，可以将原本应该是简单的文本文档或pdf文件转换成大型、缓慢、难以打开的文件，这些文件在不同机器之间常常会失去所有格式，而且由于某种原因，当内容通常是静态的时候，这些文件是可以编辑的。Word文件是为内容创建而设计的，而不是为内容共享而设计的。然而，它们在某些网站上是无处不在的，包括重要的文件、信息，甚至图表和多媒体;简而言之，所有可以而且应该用HTML创建的东西。大约在2008年以前，Microsoft Office产品使用专有的.doc文件格式。这种二进制文件格式很难阅读，而且其他文字处理程序也不支持这种格式。为了顺应时代潮流，采用许多其他软件都使用的标准，微软决定使用基于xml的Open Office标准，该标准使文件与开源和其他软件兼容。不幸的是，Python对这种文件格式的支持(谷歌Docs、Open Office和Microsoft Office都使用这种格式)仍然不是很好。有python-docx库，但这只允许用户创建文档并只读取基本的文件数据，比如文件的大小和标题，而不是实际内容。要读取Microsoft Office文件的内容，您需要滚动自己的解决方案。

第一步是从文件中读取XML:

```python
from zipfile import ZipFile
from urllib.request import urlopen
from io import BytesIO
from bs4 import BeautifulSoup

wordFile = urlopen('http://pythonscraping.com/pages/AWordDocument.docx').read()
wordFile = BytesIO(wordFile)
document = ZipFile(wordFile)
xml_content = document.read('word/document.xml')

wordObj = BeautifulSoup(xml_content.decode('utf-8'), 'xml')
textStrings = wordObj.find_all('w:t')

for textElem in textStrings:
    print(textElem.text)

```

它将远程Word文档读取为二进制文件对象(BytesIO类似于使用Python的核心zipfile库解压缩它(所有.docx文件都被压缩以节省空间)，然后读取未压缩的文件XML。

读取我的简单Word文档的Python脚本输出如下:

```xml
<!--?xml version="1.0" encoding="UTF-8" standalone="yes"?-->
<w:document mc:ignorable="w14 w15 wp14" xmlns:m="http://schemas.openx
mlformats.org/officeDocument/2006/math" xmlns:mc="http://schemas.open
xmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-micros
oft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/off
iceDocument/2006/relationships" xmlns:v="urn:schemas-microsoft-com:vm
l" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/m
ain" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="htt
p://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://
schemas.microsoft.com/office/word/2012/wordml" xmlns:wne="http://sche
mas.microsoft.com/office/word/2006/wordml" xmlns:wp="http://schemas.o
penxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:wp14="h
ttp://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" x
mlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessin
gCanvas" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wor
dprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word
/2010/wordprocessingInk" xmlns:wps="http://schemas.microsoft.com/offi
ce/word/2010/wordprocessingShape"><w:body><w:p w:rsidp="00764658" w:r
sidr="00764658" w:rsidrdefault="00764658"><w:ppr><w:pstyle w:val="Tit
le"></w:pstyle></w:ppr><w:r><w:t>A Word Document on a Website</w:t></
w:r><w:bookmarkstart w:id="0" w:name="_GoBack"></w:bookmarkstart><w:b
ookmarkend w:id="0"></w:bookmarkend></w:p><w:p w:rsidp="00764658" w:r
sidr="00764658" w:rsidrdefault="00764658"></w:p><w:p w:rsidp="0076465
8" w:rsidr="00764658" w:rsidrdefault="00764658" w:rsidrpr="00764658">
<w: r> <w:t>This is a Word document, full of content that you want ve
ry much. Unfortunately, it’s difficult to access because I’m putting
it on my website as a .</w:t></w:r><w:prooferr w:type="spellStart"></
w:prooferr><w:r><w:t>docx</w:t></w:r><w:prooferr w:type="spellEnd"></
w:prooferr> <w:r> <w:t xml:space="preserve"> file, rather than just p
ublishing it as HTML</w:t> </w:r> </w:p> <w:sectpr w:rsidr="00764658"
w:rsidrpr="00764658"> <w:pgszw:h="15840" w:w="12240"></w:pgsz><w:pgm
ar w:bottom="1440" w:footer="720" w:gutter="0" w:header="720" w:left=
"1440" w:right="1440" w:top="1440"></w:pgmar> <w:cols w:space="720"><
/w:cols&g; <w:docgrid w:linepitch="360"></w:docgrid> </w:sectpr> </w:
body> </w:document>

```

这里显然有很多元数据，但是您想要的实际文本内容被隐藏了。幸运的是，文档中的所有文本，包括顶部的标题，都包含在`w:t`标签中，便于抓取:

```python
from zipfile import ZipFile
from urllib.request import urlopen
from io import BytesIO
from bs4 import BeautifulSoup

wordFile = urlopen('http://pythonscraping.com/pages/AWordDocument.docx').read()
wordFile = BytesIO(wordFile)
document = ZipFile(wordFile)
xml_content = document.read('word/document.xml')

wordObj = BeautifulSoup(xml_content.decode('utf-8'), 'xml')
textStrings = wordObj.find_all('w:t')

for textElem in textStrings:
    print(textElem.text)

```

注意这里不是html。解析器解析器通常与`BeautifulSoup`一起使用，您将把`xml`解析器传递给它。这是因为冒号在HTML标记名中是不标准的，比如`w:t`和HTML。解析器不能识别它们。输出并不完美，但它已经达到了这个目标，将每个`w:t`标记打印在新行上可以很容易地看到单词是如何分割文本的

```
A Word Document on a Website
This is a Word document, full of content that you want very much. Unfortunately,
it’s difficult to access because I’m putting it on my website as a .
docx
file, rather than just publishing it as HTML

```

请注意，单词“`docx`”位于它自己的行上。在原始XML中，它被标记`<w:proofErrw:type="spellStart"/`>包围。这是Word的突出显示方式“`docx`”下划线为红色，表示它认为自己的文件格式的名称存在拼写错误。

文档的标题前面有样式描述符标签`<w:pstyle w:val=" title ">`。尽管这并不能让我们非常容易地识别标题(或其他样式的文本)，使用`BeautifulSoup`的导航功能可以很有用:

```python
textStrings = wordObj.find_all('w:t')

for textElem in textStrings:
    style = textElem.parent.parent.find('w:pStyle')
    if style is not None and style['w:val'] == 'Title':
        print('Title is: {}'.format(textElem.text))
    else:
        print(textElem.text)

```

可以很容易地扩展此函数，以便围绕各种文本样式打印标记，或者以其他方式标记它们。









