---
title: WebScraping-8
date: 2019-07-25 19:16:16
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
comments: true
---

到目前为止，在本书中，您已经忽略了格式糟糕的数据的问题，而是使用了一般格式良好的数据源，如果数据偏离了您的预期，则完全删除数据。但通常，在web抓取中，您不能对数据的来源或外观过于挑剔。由于标点符号错误、大小写不一致、换行符和拼写错误，脏数据在web上可能是一个大问题。本章将介绍一些工具和技术，通过改变编写代码的方式，以及在数据库中清理数据，帮助您从源头上预防问题。

<!--more-->

### Cleaning in Code

在语言学中，`n-gram`是在文本或言语中使用的n个单词的序列。在进行自然语言分析时，通过查找常用的`n-gram`或经常一起使用的重复单词集，通常可以方便地分解一段文本。

本节的重点是获取格式正确的`n-gram`，而不是使用它们进行任何分析。稍后，在第9章中，您可以看到`2-gram`和`3-gram`在执行文本摘要和分析。
下面返回了在Wikipedia关于Python编程语言的文章中找到的2克的列表:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup

def getNgrams(content, n):
  content = content.split(' ')
  output = []
  for i in range(len(content)-n+1):
    output.append(content[i:i+n])
  return output

html = urlopen('http://en.wikipedia.org/wiki/Python_(programming_language)')
bs = BeautifulSoup(html, 'html.parser')
content = bs.find('div', {'id':'mw-content-text'}).get_text()
ngrams = getNgrams(content, 2)
print(ngrams)
print('2-grams count is: '+str(len(ngrams)))
```

`getNgrams`函数接受一个输入字符串，并将其分解为一系列单词(假设所有单词都用空格分隔)，并将每个单词开头的n-gram(在本例中为2- gram)添加到数组中。

这将从文本中返回一些真正有趣和有用的2- gram：

```python
['of', 'free'], ['free', 'and'], ['and', 'open-source'], ['open-source', 'software']
```

但它也会返回很多垃圾：

```python
['software\nOutline\nSPDX\n\n\n\n\n\n\n\n\nOperating', 'system\nfamilies\n\n\n\nAROS\nBSD\nDarwin\neCos\nFreeDOS\nGNU\nHaiku\nInferno\nLinux\nMach\nMINIX\nOpenSolaris\nPlan'], ['system\nfamilies\n\n\n\nAROS\nBSD\nDarwin\neCos\nFreeDOS\nGNU\nHaiku\nInferno\nLinux\nMach\nMINIX\nOpenSolaris\nPlan', '9\nReactOS\nTUD:OS\n\n\n\n\n\n\n\n\nDevelopment\n\n\n\nBasic'], ['9\nReactOS\nTUD:OS\n\n\n\n\n\n\n\n\nDevelopment\n\n\n\nBasic', 'For']
```

此外，由于为遇到的每个单词都创建了2-gram(除了最后一个单词)，所以在撰写本文时，本文中有7,411个2-gram。不是一个非常容易管理的数据集！

使用正则表达式删除转义字符(比如\n)和过滤删除任何Unicode字符，您可以稍微清理一下输出：

```python
import re

def getNgrams(content, n):
    content = re.sub('\n|[[\d+\]]', ' ', content)
    content = bytes(content, 'UTF-8')
    content = content.decode('ascii', 'ignore')
    content = content.split(' ')
    content = [word for word in content if word != '']
    output = []
    for i in range(len(content)-n+1):
        output.append(content[i:i+n])
    return output
html = urlopen('http://en.wikipedia.org/wiki/Python_(programming_language)')
bs = BeautifulSoup(html, 'html.parser')
content = bs.find('div', {'id':'mw-content-text'}).get_text()
ngrams = getNgrams(content, 2)
print(ngrams)
print('2-grams count is: '+str(len(ngrams)))
```

这将用空格替换换行符的所有实例，删除诸如[123]之类的引用，并过滤行中多个空格导致的所有空字符串。然后，使用`UTF-8`编码内容，消除转义字符。

需要解释以下

```python
content = re.sub('\n|[[\d+\]]', ' ', content)
```

其中，`\n|[[\d+\]]`或前面是换行字符，后面的`[[\d+\]]`是说的是`\[|\d+|\]`这三个相或，为什么只有`]`前面加一个`\`这个是规定，表示对这个字符进行操作，但为什么`[`没有这样的讲究，只能说规定如此，而且我觉得`[[\d+\]\n]`也是等价的。

这些步骤大大提高了函数的输出，但仍存在一些问题：

```
['years', 'ago('], ['ago(', '-'], ['-', '-'], ['-', ')'], [')', 'Stable']
```

您可以通过删除每个单词前后的所有标点符号来改进这一点标点符号(剥离)。这保留了单词中的连字符，但是消除了空字符串之后只包含一个标点符号的字符串。

当然，标点符号本身是有意义的，简单地去掉它可能会丢失一些有价值的信息。例如，句点后面的空格可以被认为是一个完整句子或语句的结尾。您可能想要禁止n-gram在这样的stop上桥接，并且只考虑在句子中创建的那些。

例如，给定文本：

```
Python features a dynamic type system and automatic memory management. It supports multiple programming paradigms...
```

2-gram['memory', 'management']是有效的，但是2-gram['management', 'It']无效。

现在，您有了一个更长的“清洁任务”列表，您正在介绍“清洁任务”的概念“句子”，你的程序已经变得越来越复杂，最好把它们移到四个不同的函数中:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import string

def cleanSentence(sentence):
    sentence = sentence.split(' ')
    sentence = [word.strip(string.punctuation+string.whitespace) for word in sentence]
    sentence = [word for word in sentence if len(word) > 1 or (word.lower() == 'a' or word.lower() == 'i')]
    return sentence

def cleanInput(content):
    content = content.upper()
    content = re.sub('\n|[[\d+\]]', ' ', content)
    content = bytes(content, "UTF-8")
    content = content.decode("ascii", "ignore")
    sentences = content.split('. ')
    return [cleanSentence(sentence) for sentence in sentences]

def getNgramsFromSentence(content, n):
    output = []
    for i in range(len(content)-n+1):
        output.append(content[i:i+n])
    return output

def getNgrams(content, n):
    content = cleanInput(content)
    ngrams = []
    for sentence in content:
        ngrams.extend(getNgramsFromSentence(sentence, n))
    return(ngrams)

html = urlopen('http://en.wikipedia.org/wiki/Python_(programming_language)')
bs = BeautifulSoup(html, 'html.parser')
content = bs.find('div', {'id':'mw-content-text'}).get_text()
print(getNgrams(content, 2))
print(len(getNgrams(content, 2)))
```

其中，`.strip()`，是只能删除开头或是结尾的字符，不能删除中间部分的字符。

`getNgrams`仍然是您进入程序的基本入口点。`cleanInput`和前面一样删除了换行和引用，但也根据句点和空格的位置将文本分割为“句子”。它还调用了`cleanSentence`，它将句子分成单词，去掉标点符号和空格，并删除除`I`和`a`之外的单个字符。

创建n个gram的关键行被移动到`getNgramsFromSentence`中，`getngram`对每个句子调用这个函数。这确保不会创建跨多个句子的`n-gram`。
注意`string.punctuation`和`string.whitespace`的使用。获取Python中所有标点符号的列表。您可以查看字符串的输出。Python终端中的标点符号:

```python
>>> import string
>>> print(string.punctuation)
!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

通过在循环中遍历内容中的所有单词时使用`item.strip(string. +string.whitespace)`，单词两边的任何标点符号都将被删除，而连字符(标点符号被两边的字母包围)将保持不变。

这种努力的结果是更干净的2-gram：

```python
[['Python', 'Paradigm'], ['Paradigm', 'Object-oriented'], ['Object-oriented','imperative'], ['imperative', 'functional'], ['functional', 'procedural'],['procedural', 'reflective'],...
```

### Data Normalization

每个人都遇到过设计糟糕的web表单:“输入您的电话号码。您的电话号码必须是‘xxx- xxxx -xxxx’格式。”

作为一名优秀的程序员，您可能会想，为什么他们不去掉我输入的非数字字符，然后自己来做呢?数据规范化是确保在语言或逻辑上彼此等价的字符串(如电话号码(555)123-4567和555.123.4567)显示为等价字符串，或至少将其进行比较的过程。

使用上一节中的n-gram代码，您可以添加数据规范化特性。这段代码的一个明显问题是它包含许多重复的2-gram。它每遇到2-gram就会被添加到列表中，没有记录它的频率。记录这些2-gram的频率(而不仅仅是它们的存在)不仅很有趣，而且在绘制清洗和数据归一化算法更改的效果时也很有用。如果数据被成功归一化，那么唯一n-gram的总数将减少，而找到的n-gram总数(即，确定为n--gram的唯一或非唯一项的数目)不会减少。换句话说，对于相同数量的n克，“木桶”会更少。

您可以通过修改收集n个g的代码来实现这一点，将它们添加到计数器对象而不是列表中：

```python
from collections import Counter

def getNgrams(content, n):
    content = cleanInput(content)
    ngrams = Counter()
    ngrams_list = []
    for sentence in content:
        newNgrams = [' '.join(ngram) for ngram in getNgramsFromSentence(sentence, n)]
        ngrams_list.extend(newNgrams)
        ngrams.update(newNgrams)
    return(ngrams)
print(getNgrams(content, 2))
```

还有许多其他方法可以做到这一点，比如向dictionary对象添加n-grams，其中list的值按其被看到的次数计数。这有一个缺点，它需要更多的管理，并使排序变得棘手。但是，使用计数器对象也有一个缺点：它不能存储列表(列表是不可缓存的)，所以您需要首先在每个n-gram的列表理解中使用' '.join(n-gram)将它们转换为字符串。

这里是结果：

```
Counter({'Python Software': 37, 'Software Foundation': 37, 'of the': 34,'of Python': 28, 'in Python': 24, 'in the': 23, 'van Rossum': 20, 'to the':20, 'such as': 19, 'Retrieved February': 19, 'is a': 16, 'from the': 16,'Python Enhancement': 15,...
```

在撰写本文时，总共有7275个2克，5628个独特的2克，其中最流行的2克是“软件基础”，其次是“Python Software.””。然而，对结果的分析表明，“Python Software.””以“Python软件”另外两次。同样的，" vanRossum "和" vanRossum”单独出现在列表中。

添加一行:

```
content = content.upper()
```

对于`cleanInput`函数，保持找到的2-gram的总数稳定在7,275，同时将惟一的2-gram的数量减少到5,479。

除此之外，通常最好停下来，考虑一下需要花费多少计算能力来规范化数据。在许多情况下，单词的不同拼写是等价的，但是为了解决这种等价性，您需要检查每个单词，看看它是否匹配任何预编程的等价。

例如，Python first和Python 1st都出现在2-gram的列表中。然而，如果要制定一个总括规则，即all first、second、third等等都将被解析为1st、2nd、3rd等等(反之亦然)，那么每个单词将会被额外检查10次左右。同样，不一致地使用连字符(coordination对co-ordination)、拼写错误和其他自然语言的不一致也会影响n-gram的分组，如果这些不一致足够常见，可能会混淆输出的结果。对于带连字符的单词，一种解决方案可能是完全删除连字符，将单词视为一个字符串，这只需要一个操作。然而，这也意味着连字符短语(非常常见的现象)将被视为一个单词。走另一条路，将连字符作为空格可能是更好的选择。只是为偶尔的配合和配合攻击做好准备。

### Cleaning After the Fact

在代码中，您只能(或想)做这么多。此外，您可能正在处理一个没有创建的数据集，或者一个甚至在没有先查看数据集的情况下就知道如何清理的数据集。许多程序员在这种情况下的下意识反应是编写一个脚本，这可能是一个很好的解决方案。然而，第三方工具，如`OpenRefine`，不仅能够快速轻松地清理数据，而且允许非程序员轻松地查看和使用数据。

#### OpenRefine

`OpenRefine`是一个开源项目，由Metaweb公司于2009年启动。谷歌于2010年收购Metaweb，将项目名称从Freebase Gridworks改为谷歌Refine。2012年，谷歌放弃了对Refine的支持，再次将名称更改为`OpenRefine`，欢迎任何人为项目的开发做出贡献。

要使用OpenRefine，需要将数据保存为CSV文件，或者，如果您将数据存储在数据库中，则可以将其导出到CSV文件。

#### Using OpenRefine

在下面的例子中，您将使用从Wikipedia的“比较”中提取的数据文本编辑器”表;见图8 - 1。虽然这个表的格式相对较好，但是它包含了人们在很长一段时间内进行的许多编辑，因此它有一些格式上的小矛盾。此外，由于它的数据是由人而不是机器读取的，所以一些格式选择(例如，使用“Free”而不是“$0.00”)不适合编程输入。

![](WebScraping8\1.bmp)

关于OpenRefine要注意的第一件事是，每个列标签旁边都有一个箭头。此箭头提供了一个工具菜单，可与该列一起用于筛选、排序、转换或删除数据。

**Filtering** 数据过滤可以使用两种方法执行:`Filters`和`facets`。过滤器适用于使用正则表达式对数据进行过滤;例如，在“编程语言”列中，只显示包含三种或更多逗号分隔的编程语言的数据，如图8-2所示。可以通过操作右栏中的块轻松地组合、编辑和添加过滤器。它们还可以与`facets`组合。

![](WebScraping8\2.bmp)



可以通过操作右栏中的块轻松地组合、编辑和添加过滤器。它们还可以与facet组合。

`faces`t非常适合包含或排除基于列的整个内容的数据。(例如，“显示所有使用GPL或MIT许可的行，这些行在2005年后首次发布”，如图8-3所示)。他们有内置的过滤工具。例如，对数值进行筛选可以使用幻灯片条选择要包含的值范围。

![](WebScraping8\3.bmp)

无论您如何过滤数据，它都可以在任何时候导出到OpenRefine支持的几种格式之一。这包括CSV, HTML(一个HTML表)，Excel和其他几种格式。

**cleaning** 只有在开始时数据相对干净时，才能成功地进行数据过滤。例如，在前一节的facet示例中，“First public release”facet中不会选择发布日期为01-01-2006的文本编辑器，该文本编辑器正在寻找一个值为2006的值，并忽略了看起来不像这个值的值。

使用OpenRefine表达式在OpenRefine中执行数据转换语言，称为GREL (G是OpenRefine的前一个名称遗留下来的，谷歌优化)。此语言用于创建基于简单规则转换单元格中的值的短lambda函数。例如:

```
if(value.length() != 4, "invalid", value)
```

当这个函数应用于“第一个稳定版本”列时，它将保存日期为YYYY格式的单元格的值，并将所有其他列标记为无效(图8-4)。

可以通过单击任何列标签旁边的下箭头并选择Edit cells$\rightarrow$Transform来应用任意的GREL语句。
然而，将所有不太理想的值标记为无效，同时使它们易于发现，这对您没有多大好处。如果可能，最好尝试从格式糟糕的值中回收信息。这可以通过使用GREL的match函数来实现：

```
value.match(".*([0-9]{4}).*").get(0)
```

这将尝试将字符串值与给定的正则表达式匹配。如果正则表达式与字符串匹配，则返回一个数组。任何与正则表达式中的捕获组匹配的子字符串(由表达式中的括号分隔，在本例中为[0-9]{4})都作为数组值返回。实际上，这段代码将在一行中找到四个小数的所有实例，并返回第一个实例。这通常足以从文本或格式糟糕的日期中提取年份。它还具有为不存在的日期返回null的优点。(在对空变量执行操作时，GREL不会抛出空指针异常。)使用单元格编辑和GREL可以进行许多其他数据转换。在OpenRefine的[GitHub](https://github.com/OpenRefine/OpenRefine/wiki/Documentation-For-Users)页面上可以找到该语言的完整指南。



