---
title: WebScraping-2
date: 2019-07-13 23:15:05
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

没什么好说的，觉得学的太基础，想快快学，但是在家就很懈怠，一直看剧看剧。。。

对了，忘记声明：此系列参照了《Web Scraping with Python, 2nd Edition》------Ryan Mitchell

<!--more-->

假设你有一些目标内容。可能是一个名称、统计数据或文本块。也许它将20层标签在HTML代码中，没有任何有用的标签或HTML属性。假设您决定将警告抛到九霄云外，并编写类似下面这样的代码来尝试提取:

```python
bs.find_all('table')[4].find_all('tr')[2].find('td').find_all('div')[1].find('a')
```

看起来不太好。除了线条的美观之外，站点管理员对网站的任何微小更改都可能彻底破坏web scraper。

对于已下这种文本，可以用`find_all()`来提取绿色的文本：

```html
<span class="red">Heavens! what a virulent attack!</span> replied
<span class="green">the prince</span>, not in the least disconcerted by this reception.
```

具体代码：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://www.pythonscraping.com/pages/page1.html')
bs = BeautifulSoup(html.read(), 'html.parser')
nameList = bs.findAll('span', {'class':'green'})
for name in nameList:
	print(name.get_text())
```

其中，`.get_text()`从正在处理的文档中删除所有标记，并返回只包含文本的Unicode字符串。例如，如果您正在处理一个包含许多超链接、段落和其他标记的大文本块，那么所有这些都将被删除，只剩下一个无标记的文本块。请记住，在一个`BeautifulSoup`对象中查找要比在一个文本块中查找容易得多。在打印、存储或操作最终数据之前，调用`.get_text()`应该是您做的最后一件事。一般来说，应该尽可能长地保存文档的标记结构。

## Another serving of BeautifulSoup

### find/find_all() with BeautifulSoup

`find()`与`find_all()`非常相似。它们的细节如下：

```python
find_all(tag, attributes, recursive, text, limit, keywords)
find(tag, attributes, recursive, text, keywords)
```

`tag`是之前见过的，可以传递标记的字符串名称，甚至是字符串标记名称的Python列表。例如

```python
.find_all(['h1','h2','h3','h4','h5','h6'])
```

`attributes`参数接受一个Python属性字典，并匹配包含其中任何一个属性的标记。例如，下面的函数将返回HTML文档中的绿色和红色span标记:

```python
.find_all('span', {'class':{'green', 'red'}})
```

`recursive`是一个 布尔值。您想要深入到文档的哪个部分?如果将recursive设置为True, find_all函数将查看children、children‘s children...用于匹配参数的标记。如果为False，它将只查看文档中的顶级标记。默认情况下，find_all是递归工作的(recursive设置为True)；一般来说，保持现状是一个好主意，除非真正知道需要做什么，并且性能是个问题。

`text`参数的不同寻常之处在于，它是基于标记的文本内容而不是标记本身的属性进行匹配的。例如，如果想在示例页面上找到“prince”被标记包围的次数，可以用以下行替换前面示例中的.find_all()函数：

```python
nameList = bs.find_all(text='the prince')
print(len(nameList))
```

`limit`参数只在`find_all`方法中使用；`find`等价于相同的`find_all`调用，限制为1。如果只对从页面中检索前x项感兴趣，可以设置此选项。但是，请注意，这将按出现的顺序显示页面上的第一项，而不一定是您想要的第一项。

`keyword`参数允许您选择包含特定属性或一组属性的标记。例如：

```python
title = bs.find_all(id='title', class_='text')
```

这将返回class_属性中带有单词“text”和id属性中带有单词“title”的第一个标记。注意，按照惯例，id的每个值在页面上只能使用一次。因此，在实际中，这样一行字可能不是特别有用，应相当于下列案文:

```python
title = bs.find(id='title')
```

`keyword`参数在某些情况下是有用的。然而，作为一个BeautifulSoup特性，它在技术上是多余的。请记住，任何可以使用关键字完成的事情也可以使用本章后面介绍的技术来完成
(参见`regular_express`和`lambda_express`)。例如，以下是相同的：

```python
bs.find_all(id='text')
bs.find_all('', {'id':'text'})
```

此外，您可能偶尔会遇到使用`keyword`的问题，最明显的是当根据类属性搜索元素时，因为`class`在Python中是受保护的关键字。也就是说，`class`是Python中不能使用的保留字作为变量或参数名(与前面讨论的`beautiful .find_all()`关键字参数没有关系)。例如，如果您尝试以下调用，由于类的非标准使用，您将得到一个语法错误:

```python
bs.find_all(class='green')

 File "<ipython-input-1-6de1a859337f>", line 7
    bs.find_all(class = 'green')
                    ^
SyntaxError: invalid syntax
```

而以下便可以，加入一个下划线：

```python
bs.find_all(class_='green')
```

当然，以下也是可以的：

```python
bs.find_all('', {'class':'green'})
```

回想一下，通过属性列表将标记列表传递给`.find_all()`就像一个“**或**”过滤器(它选择包含`tag1`、`tag2`或`tag3`…的所有标记的列表)。如果你有一个很长的标签列表，你可能会得到很多你不想要的东西。`keyword`参数允许您为此添加一个额外的“**和**”过滤器。

### other BeautifulSoup objects

到目前为止，已经在BeautifulSoup库中看到了两种类型的对象:

- BeautifulSoup objects

  在前面的代码示例中看到的实例作为变量`bs`

- 在列表中检索，或通过在`BeautifulSoup `上调用`find`和`find_all`分别检索或向下搜索，如下:

  ```python
  bs.div.h1
  ```

然而，库中还有另外两个对象，虽然不太常用，但仍然需要了解:

- NavigableString objects

  用于表示标记内的文本，而不是标记本身(一些函数操作并生成navigablestring，而不是标记对象)。

- Comment object

  用于在注释标签中查找HTML注释，如：

  ```html
  <!----like this one---->
  ```

  这四个对象是在BeautifulSoup库中(此版本时)将遇到的惟一对象。

### navigating trees

`find_all`函数负责根据标签的名称和属性查找标签。但是，如果需要根据文档中的位置查找标记，该怎么办？这就是树导航(navigating trees)派上用场的地方。之前我们的老师方法如下：

```python
bs.tag.subTag.anotherSubTag
```

现在，让我们看看如何向上、跨界和对角地导航HTML树。您将使用我们非常可疑的在线购物网站http://www.pythonscraping.com/pages/page3.html ，作为一个用于抓取的示例页面，如图下图所示：

![](WebScraping2\1.jpg)

具体的html树是这样的：

![](WebScraping2\2.jpg)

#### children and descendants

此时要区分`children`与 `descendants`。

`children`：是一个标签的孩子，例如，在上图中，`tr`是`table`的孩子。

`descendants`：是一个标签的后代，例如，在上图中，`tr`，`th`，`td`，`img`和`span`都是`table`的后代。

因此，对于一个标签，它的所有的`children`都是`decendants`，但反之未必。

通常，`BeautifulSoup`函数总是处理所选当前标记的`descendants`。例如，`bs.body.h1`选择主体标记的后代的第一个`h1`标记。它不会找到位于主体之外的标记。

同样的，`bs.div.find_all('img')`也是查找文档中的第一个`div`，并且返回此`div`的 `descendants`中的的所有`img`的标签。

如果你只想输出只是`children`的标签：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://www.pythonscraping.com/pages/page3.html')
bs = BeautifulSoup(html, 'html.parser')
for child in bs.find('table',{'id':'giftList'}).children:
	print(child)
```

如果是`children`，那么输出的，如下：

![](WebScraping2\3.jpg)

同样的，如果输出后代，只要把`children`换成`descendants`即可。

如果，是`descendants`，输入，类似如下

```html
<tr class="gift" id="gift1">
	<td>
		Vegetable Basket
	</td>
	<td>
		This vegetable basket is the perfect gift for your health conscious (or overweight) friends!
		<span 
			class="excitingNote">Now with super-colorful bell peppers!
		</span>
	</td>
	<td>
		$15.00
	</td>
	<td>
		<img src="../img/gifts/img1.jpg"/>
	</td>
</tr>
```

那么输出如下：

```html
<td>
	Vegetable Basket
</td>

Vegetable Basket

<td>
	This vegetable basket is the perfect gift for your health conscious (or overweight) friends!
	<span class="excitingNote">Now with super-colorful bell peppers!</span>
</td>

This vegetable basket is the perfect gift for your health conscious (or overweight) friends!

<span class="excitingNote">Now with super-colorful bell peppers!</span>
Now with super-colorful bell peppers!

<td>
$15.00
</td>

$15.00

<td>
<img src="../img/gifts/img1.jpg"/>
</td>

<img src="../img/gifts/img1.jpg"/>
```

#### next_siblings()

有了子孙后代，当然还有同辈之间函数：`next_siblings()`，具体实例如下：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://www.pythonscraping.com/pages/page3.html')
bs = BeautifulSoup(html, 'html.parser')
for sibling in bs.find('table', {'id':'giftList'}).tr.next_siblings:
	print(sibling)
```

这段代码的输出是打印商品表中的所有产品行，除了第一行标题行。为什么标题行被跳过？对象不能是它们自己的兄弟姐妹。任何时候，只要对象有兄弟姐妹，该对象本身就不会包含在列表中。正如函数的名称所示，它只调用`next sibling()`。例如，如果您要选择列表中间的一行，并在其上调用`next_sibling()`，那么只会返回后面的兄弟姐妹。因此，通过选择标题行并调用`next_sibling()`，可以选择表中的所有行，而不需要选择标题行本身。

作为`next_sibling()`的一个补充，如果希望获得的同级标记列表的末尾有一个易于选择的标记，那么`previous_sibling()`函数通常会很有帮助。

#### parents

在抓取页面时，您可能会发现，与查找标记的孩子或兄弟姐妹相比，查找标记的父母的频率要低一些。通常，当您以爬行为目标查看HTML页面时，首先要查看标签的顶层，然后找出如何深入到所需的确切数据块。然而，偶尔会发现自己处于一些奇怪的情况，需要BeautifulSoup的父类查找功能.parent和.parents。例如：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen('http://www.pythonscraping.com/pages/page3.html')
bs = BeautifulSoup(html, 'html.parser')
print(bs.find('img',{'src':'../img/gifts/img1.jpg'}).parent.previous_sibling.get_text())
```

这段代码将打印由该位置的图像表示的对象的价格
`../img/gifts/img1.jpg`(本例中价格为15.00美元)。

具体过程如下：

```html
<tr>
    - td
    - td
    - td 《3》
    	- "$15.00" 《4》
    	- td 《2》
    		- <img src="../img/gifts/img1.jpg"> 《1》
```

《1》图像 `../img/gifts/img1.jpg`首先被选择

《2》选择它的父母，此例中为`td`

《3》选择`td`的`previous_sibling`，此例中是价钱的那个`td`

《4》选择这个标签的文本"$15.00"

## Regular expressions

这是一个很重要的模块！

我用了正则字符串这个短语。什么是常规字符串?它是任何可以由一系列线性规则生成的字符串，例如:

- 至少出现一个字母`a`
- 再加上准确的5次字母`b`
- 再加上任何偶数个的字母`c`
- 以`d`或者`e`为结尾

用正则表达式写出：`aa*bbbbb(cc)*(d|e)`

| 符号  | 含义                                                         | 举例             | 实例                           |
| ----- | ------------------------------------------------------------ | ---------------- | ------------------------------ |
| *     | 匹配**前面的字符**，**子表达式**或**括起来的字符**，0或者更多次 | a\*b\*           | aaaaa, aabbb, bbbb             |
| +     | 匹配**前面的字符**，**子表达式**或**括起来的字符**，1或者更多次 | a+b+             | aaaab, aaabb, abbb             |
| []    | 匹配括号里的任何**一个**字符，                               | [A-Z]\*          | APPLE, HELLO                   |
| ()    | 变成一个**子表达式**(优先按照正则表达式的“操作顺序”计算这些值) | (a\*b)\*         | aaabaab, abaaab, ababaaab      |
| {m,n} | 匹配**前面的字符**，(优先按照正则表达式的“操作顺序”计算这些值) | a{2,3}b{2,3}     | aabbb, aaabbb, aabb            |
| \[^\] | 匹配任何一个不在括号的字符                                   | \[^A-Z\]\*       | apple, nihao                   |
| I | 匹配由I分隔的**任何字符**、**字符串**或子**表达式**          | b(aIiIe)d     | bad, bid, bed                  |
| .   | 匹配任何一个字符(包括符号，数字，空格等)                     | b.d              | bad, b d, b$d                  |
| ^     | 指示字符或子表达式出现在字符串的开头                         | ^a               | apple, asdf, a                 |
| \ | 转义字符(这允许您使用特殊字符作为其字面含义)                 | \\.\I\\ |\.I\       |
| $     | 通常在正则表达式的末尾使用，它的意思是“将这个匹配到字符串的末尾”。没有它，每个正则表达式都有一个事实，".*“在它的末尾，接受只有字符串的第一部分匹配的字符串。这可以看作类似于^符号。 | [A-Z]\*[a-z]\*$  | ABCabc, zzzyx, Bob             |
| ?!    | ”不包含。这是个奇怪的符号，紧接在一个字符(或正则表达式)前面，表示这个字符不应该在字符串的特定位置找到。这可能很难使用；毕竟，字符可能在字符串的不同部分找到。如果试图完全消除一个字符，请与连用^和$在两端。 | ^((?![A-Z]).)\*$ | no-caps-here, $ymb0ls a4e f!ne |

当然，这是简略版，还有很多的符号，在此就先不解释了。

## Regular expressions and BeautifulSoup

因此，如果想应用在`BeautifulSoup`函数中，已上例中，想要输出所有的

```html
<img src="../img/gifts/img3.jpg">
```

在使用`find_all("img")`的时候，也会把其他的多余项加进来，代码如下：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
html = urlopen('http://www.pythonscraping.com/pages/page3.html')
bs = BeautifulSoup(html, 'html.parser')
images = bs.find_all('img',{'src':re.compile('\.\.\/img\/gifts/img.*\.jpg')})
for image in images:
	print(image['src'])
    
output:
../img/gifts/img1.jpg
../img/gifts/img2.jpg
../img/gifts/img3.jpg
../img/gifts/img4.jpg
../img/gifts/img6.jpg
```

## Accessing attributes 

标题翻译为：访问属性

到目前为止，已经了解了如何访问和过滤标签以及访问其中的内容。然而，通常在web抓取中，并不寻找标记的内容；你在寻找它的属性。这对于`a`之类的标记尤其有用，其中它所指向的URL包含在`href`属性中；或者`img`标记，其中目标图像包含在`src`属性中。

使用标签对象，可以通过调用以下命令自动访问Python属性列表:

```python
myTag.attrs
```

请记住，这实际上返回了一个Python dictionary对象，这使得检索和操作这些属性变得非常简单。例如，可以使用以下行找到图像的源位置：

```python
myImgTag.attrs['src']
```

## Lambda expressions

`lambda`表达式是作为变量传递给另一个函数的函数;您可以将函数定义为f(g(x) y)，甚至f(g(x),h(x))，而不是f(x, y)。

`BeautifulSoup`允许您将某些类型的函数作为参数传递给`find_all`函数。

唯一的限制是这些函数必须接受一个标记对象作为参数并返回一个布尔值。在这个函数中，`BeautifulSoup`遇到的每个标记对象都被求值，求值为True的标记被返回，其余的则被丢弃。

例如，下面的代码检索所有恰好具有两个属性的标签：

```python
bs.find_all(lambda tag: len(tag.attrs) == 2)
```

这里，作为参数传递的函数是`len(tag.attrs) == 2`。如果为真，`find_all`函数将返回标记。也就是说，它会找到具有两个属性的标签，例如：

```html
<div class="body" id="content"></div>
<span style="color:red" class="title"></span>
```

`Lambda`函数非常有用，你甚至可以用它们来替换现有的`BeautifulSoup`函数:

```python
bs.find_all(lambda tag: tag.get_text() =='Or maybe he\'s only resting?')
```

这也可以在没有lambda函数的情况下完成:

```python
bs.find_all('', text='Or maybe he\'s only resting?')
```

但是，如果您记住`lambda`函数的语法，以及如何访问标记属性，那么您可能再也不需要记住任何其他`BeautifulSoup`语法了!

因为所提供的`lambda`函数可以是返回True或的任何函数False值，您甚至可以将它们与正则表达式组合起来，以查找具有匹配特定字符串模式的属性的标记。






















