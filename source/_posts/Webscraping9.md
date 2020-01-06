---
title: Webscraping-9
date: 2019-07-27 16:22:41
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

到目前为止，您使用的数据通常都是数字或可数值的形式。在大多数情况下，您只是简单地存储了数据，而没有在事后进行任何分析。这一章试图解决英语这个棘手的问题。当你在图片搜索中输入可爱的小猫时，谷歌怎么知道你在寻找什么?因为文字围绕着可爱的小猫形象。当你在搜索栏中输入“死鹦鹉”时，YouTube怎么知道会弹出某个巨蟒剧团(Monty Python)的素描?因为每个上传的视频都有标题和描述文字。事实上，即使输入像“已故的鸟儿”这样的术语，python也会立即显示出同样的“死去的鹦鹉”草图，即使页面本身没有提到“已故的鸟儿”或“死去的鸟儿”。谷歌知道热狗是一种食物，而一只沸腾的小狗是完全不同的东西。如何?都是统计数字!虽然您可能不认为文本分析与您的项目有任何关系，但是理解它背后的概念对于各种机器学习都非常有用，对于用概率和算法术语建模真实世界问题的更一般的能力也非常有用。

<!--more-->

例如，音乐服务可以识别包含特定歌曲录制的音频，即使该音频包含环境噪声或失真。谷歌的工作是基于图像本身自动字幕图像。通过比较已知的图片，例如热狗和其他热狗的图片，搜索引擎可以逐渐了解热狗的样子，并在显示的其他图片中观察这些模式。

### Summarizing Data

在第8章中，您研究了如何将文本内容分解为n-gram，即长度为n个单词的短语集。在一个基本的层次上，这可以用来确定哪些单词和短语在一段文本中最常用。此外，它还可以通过返回原始文本并围绕这些最流行的短语提取句子，从而创建听起来很自然的数据摘要。你将用来做这件事的一个例子文本是美国第九任总统威廉·亨利·哈里森的就职演说。哈里森的总统任期创造了白宫历史上的两项纪录:一项是最长的就职演说，另一项是任期最短的，只有32天。您将使用本文的全文作为本章中许多代码示例的源代码。

您将使用本文的全文作为本章中许多代码示例的源代码。

稍微修改第8章中用于查找代码的n-gram，您可以生成寻找2-gram集合的代码，并返回一个包含所有2-gram的计数器对象：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import string
from collections import Counter

def cleanSentence(sentence):
    sentence = sentence.split(' ')
    sentence = [word.strip(string.punctuation+string.whitespace) for word in sentence]
    sentence = [word for word in sentence if len(word) > 1 or (word.lower() == 'a' or word.lower() == 'i')]
    return sentence

def cleanInput(content):
    content = content.upper()
    content = re.sub('\n', ' ', content)
    content = bytes(content, 'UTF-8')
    content = content.decode('ascii', 'ignore')
    sentences = content.split('. ')
    return [cleanSentence(sentence) for sentence in sentences]

def getNgramsFromSentence(content, n):
    output = []
    for i in range(len(content)-n+1):
        output.append(content[i:i+n])
    return output

def getNgrams(content, n):
    content = cleanInput(content)
    ngrams = Counter()
    ngrams_list = []
    for sentence in content:
        newNgrams = [' '.join(ngram) for ngram in getNgramsFromSentence(sentence, n)]
        ngrams_list.extend(newNgrams)
        ngrams.update(newNgrams)
    return(ngrams)


content = str(
      urlopen('http://pythonscraping.com/files/inaugurationSpeech.txt').read(),
              'utf-8')
ngrams = getNgrams(content, 3)
print(ngrams)
```

输出产生，部分：

```
Counter({'OF THE': 213, 'IN THE': 65, 'TO THE': 61, 'BY THE': 41,
'THE CONSTITUTION': 34, 'OF OUR': 29, 'TO BE': 26, 'THE PEOPLE': 24,
'FROM THE': 24, 'THAT THE': 23,...
```

在这2-gram中，“宪法”在演讲中似乎是一个相当受欢迎的主题，但“of the”、“to the”和“in the”似乎并不特别值得注意。你怎样才能以准确的方式自动删除不需要的单词?

幸运的是，有些人仔细研究了两者之间的差异“有趣”和“不有趣”的单词，他们的研究可以帮助我们做到这一点。杨百翰大学语言学教授马克·戴维斯坚持认为当代美国英语语料库(Corpus of Contemporary American English)，收录了近十年来美国流行出版物中的4.5亿多个单词。

5000个最常被发现的单词列表是免费的，幸运的是，这已经足够作为一个基本的过滤器来过滤掉最常见的2-gram单词。仅仅前100个单词就能极大地提高搜索结果，并添加了一个isCommon函数:

```python

def isCommon(ngram):
    commonWords = ['THE', 'BE', 'AND', 'OF', 'A', 'IN', 'TO', 'HAVE', 'IT', 'I', 'THAT', 'FOR', 'YOU', 'HE', 'WITH', 'ON', 'DO', 'SAY', 'THIS', 'THEY', 'IS', 'AN', 'AT', 'BUT', 'WE', 'HIS', 'FROM', 'THAT', 'NOT', 'BY', 'SHE', 'OR', 'AS', 'WHAT', 'GO', 'THEIR', 'CAN', 'WHO', 'GET', 'IF', 'WOULD', 'HER', 'ALL', 'MY', 'MAKE', 'ABOUT', 'KNOW', 'WILL', 'AS', 'UP', 'ONE', 'TIME', 'HAS', 'BEEN', 'THERE', 'YEAR', 'SO', 'THINK', 'WHEN', 'WHICH', 'THEM', 'SOME', 'ME', 'PEOPLE', 'TAKE', 'OUT', 'INTO', 'JUST', 'SEE', 'HIM', 'YOUR', 'COME', 'COULD', 'NOW', 'THAN', 'LIKE', 'OTHER', 'HOW', 'THEN', 'ITS', 'OUR', 'TWO', 'MORE', 'THESE', 'WANT', 'WAY', 'LOOK', 'FIRST', 'ALSO', 'NEW', 'BECAUSE', 'DAY', 'MORE', 'USE', 'NO', 'MAN', 'FIND', 'HERE', 'THING', 'GIVE', 'MANY', 'WELL']
    for word in ngram:
        if word in commonWords:
            return True
    return False

def getNgramsFromSentence(content, n):
    output = []
    for i in range(len(content)-n+1):
        if not isCommon(content[i:i+n]):
            output.append(content[i:i+n])
    return output

ngrams = getNgrams(content, 3)
print(ngrams)

```

这就产生了在正文中出现两次以上的2-gram文字:

```
Counter({'UNITED STATES': 10, 'EXECUTIVE DEPARTMENT': 4,
'GENERAL GOVERNMENT': 4, 'CALLED UPON': 3, 'CHIEF MAGISTRATE': 3,
'LEGISLATIVE BODY': 3, 'SAME CAUSES': 3, 'GOVERNMENT SHOULD': 3,
'WHOLE COUNTRY': 3,...
```

需要注意的是，您使用的是相对现代的常用单词列表来过滤结果，考虑到文本编写于1841年，这可能并不合适。然而,因为你只使用第一个100个左右的单词列表你可以假设更稳定的随着时间的推移,说,过去100的字眼你似乎得到令人满意的结果,你可能能拯救自己的努力跟踪或创建一个从1841年最常见的单词列表(尽管这样的努力可能很有趣)。

既然已经从文本中提取了一些关键主题，那么这如何帮助您编写文本摘要呢?一种方法是搜索包含每个流行n-gram的第一个句子，理论是第一个实例将生成内容主体的令人满意的概述。最受欢迎的前五种2克格式会给出这些要点:

- 美国宪法是包含授予构成政府的几个部门权力的文书。
- 《宪法》所设的行政部门负责这一问题。
- 总政府没有利用各州的任何保留权利。
- 从退休,我总以为是我生命继续的残渣来填补这个伟大的首席执行官办公室和自由的国家,我出现在你面前,同胞们,把宪法规定的誓言作为其职责的性能的必要条件;我谨按照我国政府的惯例，并按照我认为是你们的期望，向你们简要介绍将指导我履行应尽职责的原则。
- 印刷机在必要时不得使用政府来“洗清罪行或粉饰罪行”。

当然，它可能不会很快在CliffsNotes上发表，但是考虑到最初的文档有217个句子长，而第4个句子(从退休后调用…)把主要的主题浓缩得相当好，这对第一次来说不算太糟。

对于较长的文本块，或者更多不同的文本，在检索一篇文章中最重要的句子时，查看3-gram甚至4-gram可能是值得的。在这种情况下，只有一个3-gram被多次使用，这是唯一的金属货币很难定义一个总统就职演说。对于较长的段落，使用3-gram可能是合适的。另一种方法是寻找包含最流行的n-gram的句子。当然，这些往往是较长的句子，所以如果这成为一个问题，您可以查找流行n-gram中单词百分比最高的句子，或者结合几种技术创建自己的评分指标。

### Markow Models

您可能听说过Markov文本生成器。他们已经成为流行的娱乐目的，因为在这可以是我的下一个推特!应用程序，以及他们用来产生真实的垃圾邮件来欺骗检测系统。所有这些文本生成器都基于马尔可夫模型，马尔可夫模型通常用于分析大量随机事件，其中一个离散事件之后是另一个具有一定概率的离散事件。例如，您可以构建天气系统的Markov模型，如图9-1所示。

![](Webscraping9\1.bmp)



在这个模型中，每一个晴天都有70%的机会第二天也是晴天，有20%的机会第二天是阴天，只有10%的机会下雨。如果当天下雨，那么第二天下雨的几率为50%，出现太阳的几率为25%，出现云层的几率为25%。

你可能会注意到这个马尔可夫模型中的几个属性:

- 所有指向任何一个节点的百分比之和必须精确到100%。不管这个系统有多复杂，它总是有100%的机会引领下一步走向其他地方。
- 虽然在任何给定的时间内，天气只有三种可能，但是您可以使用这个模型生成一个无限的天气状态列表。
- 只有当前节点的状态才会影响下一个节点的位置。如果你在阳光充沛的节点上，无论之前的100天是晴天还是雨天，第二天出现阳光的几率都是一样的:70%。
- 到达某些节点可能比到达其他节点更困难。这背后的数学原理相当复杂，但是应该很容易看出，在这个系统中，在任何给定的时间点上，雨天(少于“100%”的箭头指向雨天)比晴天或阴天更不可能达到这种状态。

显然，这是一个简单的系统，马尔可夫模型可以任意变大。谷歌页面排名算法部分基于马尔可夫模型，网站表示为节点，入站/出站链接表示为节点之间的连接。登陆特定节点的可能性表示站点的相对受欢迎程度。也就是说，如果我们的天气系统代表一个非常小的互联网，雨天的页面排名会很低，而多云的页面排名会很高。

记住所有这些，让我们回到一个更具体的例子:分析和编写文本。再次使用前面例子中分析过的William Henry Harrison的就职演说，您可以编写以下代码，根据文本的结构生成任意长的Markov链(链长设置为100)

```python
from urllib.request import urlopen
from random import randint

def wordListSum(wordList):
    sum = 0
    for word, value in wordList.items():
        sum += value
    return sum

def retrieveRandomWord(wordList):
    randIndex = randint(1, wordListSum(wordList))
    for word, value in wordList.items():
        randIndex -= value
        if randIndex <= 0:
            return word

def buildWordDict(text):
    # Remove newlines and quotes
    text = text.replace('\n', ' ');
    text = text.replace('"', '');

    # Make sure punctuation marks are treated as their own "words,"
    # so that they will be included in the Markov chain
    punctuation = [',','.',';',':']
    for symbol in punctuation:
        text = text.replace(symbol, ' {} '.format(symbol));

    words = text.split(' ')
    # Filter out empty words
    words = [word for word in words if word != '']

    wordDict = {}
    for i in range(1, len(words)):
        if words[i-1] not in wordDict:
                # Create a new dictionary for this word
            wordDict[words[i-1]] = {}
        if words[i] not in wordDict[words[i-1]]:
            wordDict[words[i-1]][words[i]] = 0
        wordDict[words[i-1]][words[i]] += 1
    return wordDict

text = str(urlopen('http://pythonscraping.com/files/inaugurationSpeech.txt')
          .read(), 'utf-8')
wordDict = buildWordDict(text)

#Generate a Markov chain of length 100
length = 100
chain = ['I']
for i in range(0, length):
    newWord = retrieveRandomWord(wordDict[chain[-1]])
    chain.append(newWord)

print(' '.join(chain))
```

这段代码的输出每次运行时都会发生变化，但下面是它将生成的荒谬文本的一个例子:

```
I consider the operation . Without denying that celebrated Confederacy is a full participation in expressing to bring under a man , even by whatever pretense imposed , and that he is a man , and more wholesome the divorce , I consider it to limit the danger to them his objections . The idea of the public virtue , some of that in our citizens , compensated for a sovereignty acknowledged property of one measure of the evils of a free operations of the spirit which are others . It was wanting no other , and of Representatives with our
```

函数`buildWordDict`接收从internet检索到的文本字符串。然后，它会进行一些清理和格式化，删除引号，并在其他标点符号周围加上空格，以便有效地将其视为一个单独的单词。在此之后，它构建了一个二维字典—字典中的字典—其形式如下:

```python
{word_a : {word_b : 2, word_c : 1, word_d : 1},
word_e : {word_b : 5, word_d : 2},...}
```

在这个示例字典中，“word_a”被找到了四次，其中两个实例后面跟着“word_b”，一个实例后面跟着“word_c”，一个实例后面跟着“word_d”。“Word_e”后面跟了7次，“word_b”后面跟了5次，“word_d”后面跟了2次。

如果我们要为这个结果绘制一个节点模型，表示word_a的节点将有50%的箭头指向word_b(四分之二的概率紧随其后)，25%的箭头指向word_c, 25%的箭头指向word_d。

在建立了这个字典之后，它可以用作一个查询表来查看下一步要做什么，无论您使用的是文本中的哪个单词。使用字典的示例字典，您当前可能使用word_e，这意味着您将把字典{word_b: 5, word_d: 2}传递给retrieveRandomWord函数。这个函数依次从字典中检索一个随机单词，并根据它出现的次数进行加权。

通过从一个随机的开始单词开始(在本例中是无所不在的I)，您可以轻松地遍历马尔可夫链，生成任意多的单词。这些马尔可夫链倾向于提高他们的现实主义，因为更多的文本收集，特别是从类似的写作风格的来源。虽然本例使用2- g来创建链(前一个单词预测下一个单词)，但是可以使用3克或更高阶的n-g，其中两个或多个单词预测下一个单词。

虽然很有趣，而且对于您在web抓取期间可能积累的兆字节的文本有很大的用处，但是像这样的应用程序会使您很难看到Markov链的实际一面。正如本节前面提到的，Markov chain模型描述了网站如何从一个页面链接到下一个页面。作为指针的这些链接的大量集合可以形成类似web的图，这些图对于存储、跟踪和分析非常有用。通过这种方式，马尔科夫链为如何考虑web爬行和web爬行器如何思考奠定了基础。

### Natural Language Toolkit

到目前为止，本章主要集中于文本正文中词语的统计分析。哪些词最受欢迎?哪些词是不寻常的?哪些单词可能会跟在其他单词后面?它们是如何组合在一起的?你所缺少的是理解，在你所能理解的范围内，这些词代表什么。自然语言工具包(NLTK)是一套Python库，用于识别和标记自然英语文本中的部分语音。它的发展始于2000年以来，在过去的15年里，世界各地的几十位开发商都做出了贡献

#### Statistical Analysis with NLTK

NLTK非常适合在文本的各个部分中生成关于单词数量、单词频率和单词多样性的统计信息。如果您所需要的只是一个相对简单的计算(例如，在一段文本中使用的惟一单词的数量)，那么导入nltk可能有些多余——它是一个大型模块。然而，如果您需要对文本进行相对广泛的分析，您手边就有函数，可以提供您想要的任何度量。

NLTK的分析总是从`Text`对象开始。`Text`对象可以通过以下方式从简单的Python字符串创建:

```python
from nltk import word_tokenize
from nltk import Text
tokens = word_tokenize('Here is some not very interesting text')
text = Text(tokens)
```

`word_tokenize`函数的输入可以是任何Python文本字符串。如果你手头没有长字符串，但仍然想尝试一下这些特性，NLTK的库中已经内置了相当多的书，可以使用导入函数来访问这些书:

```python
from nltk.book import *
```

这装载了九本书:

```
*** Introductory Examples for the NLTK Book ***
Loading text1, ..., text9 and sent1, ..., sent9
Type the name of the text or sentence to view it.
Type: 'texts()' or 'sents()' to list the materials.
text1: Moby Dick by Herman Melville 1851
text2: Sense and Sensibility by Jane Austen 1811
text3: The Book of Genesis
text4: Inaugural Address Corpus
text5: Chat Corpus
text6: Monty Python and the Holy Grail
text7: Wall Street Journal
text8: Personals Corpus
text9: The Man Who Was Thursday by G . K . Chesterton 1908
```

您将在以下所有示例中使用text6、“巨蟒与圣杯”(1975年电影的剧本)。

文本对象可以像普通Python数组一样进行操作，就好像它们是包含文本单词的数组一样。使用此属性，您可以计算文本中唯一的单词数量，并将其与总单词数量进行比较(请记住Python集合只包含唯一的值):

```python
>>> len(text6)/len(set(text6))
7.833333333333333
```

上面显示，脚本中的每个单词平均使用了大约8次。您还可以将文本放入频率分布对象中，以确定一些最常见的单词和各种单词的频率:

```python
>>> from nltk import FreqDist
>>> fdist = FreqDist(text6)
>>> fdist.most_common(10)
[(':', 1197), ('.', 816), ('!', 801), (',', 731), ("'", 421), ('[', 3
19), (']', 312), ('the', 299), ('I', 255), ('ARTHUR', 225)]
>>> fdist["Grail"]
34
```

因为这是一个剧本，它是如何写的一些人工制品可以弹出。例如，所有大写字母中的“ARTHUR”经常出现，因为它出现在每个字母之前
剧本中亚瑟王的台词。此外，冒号(:)出现在每一行之前，充当字符名称和字符行之间的分隔符。利用这个事实，我们可以看到电影中有1197行!

在前面的章节中，我们称之为2-gram，NLTK指的是`bigram`，您也可能听到3-gram被称为`trigram`。你可以创建，搜索，并列出2克非常容易:

```python
>>> from nltk import bigrams
>>> bigrams = bigrams(text6)
>>> bigramsDist = FreqDist(bigrams)
>>> bigramsDist[('Sir', 'Robin')]
18
```

要搜索2-gram的"Sir Robin"，您需要将其分解为元组("Sir", "Robin")，以匹配2-gram在频率分布中表示的方式。还有一个`trigrams`，其工作原理完全相同。对于一般情况，还可以导入`ngrams`模块

```python
>>> from nltk import ngrams
>>> fourgrams = ngrams(text6, 4)
>>> fourgramsDist = FreqDist(fourgrams)
>>> fourgramsDist[('father', 'smelt', 'of', 'elderberries')]
1
```

在这里，调用`ngrams`函数将文本对象分解为n克，大小不限，由第二个参数控制。在本例中，您将文本分解为4-gram。然后，你可以证明“father smelt of elderberries”这句话在剧本中只出现过一次。

频率分布、文本对象和n-gram也可以在循环中迭代和操作。以下打印出所有以这个单词开头的4-grams单词“椰子”,例如:

```python
from nltk.book import *
from nltk import ngrams
fourgrams = ngrams(text6, 4)
for fourgram in fourgrams:
	if fourgram[0] == 'coconut':
		print(fourgram)
```

NLTK库有大量的工具和对象，用于组织、计数、排序和度量大量文本。尽管我们仅仅触及了它们的使用的表面，但是这些工具中的大多数都是精心设计的，并且对于熟悉Python的人来说操作起来相当直观

#### Lexicographical Analysis with NLTK

到目前为止，您已经比较并分类了所有遇到的单词，这些单词仅基于它们本身所代表的值。同音异义词和使用这些词的上下文之间没有区别。

尽管有些人可能会认为同音异义词很少有问题，但你可能会对它们出现的频率感到惊讶。大多数以英语为母语的人可能并不经常意识到一个单词是一个同音字，更不用说考虑到它可能会与另一个单词在不同的上下文中混淆。

“He was objective in achieving his objective of writing an objective philosophy, primarily
using verbs in the objective case”对人类来说很容易分析，但可能会使web scraper认为同一个单词被使用了四次，从而导致它简单地丢弃关于每个单词背后含义的所有信息。

除了找出词性之外，能够区分一个词以一种方式和另一种方式使用可能也很有用。例如，您可能想要查找由普通英语单词组成的公司名称，或者分析某人对公司的看法。“ACME Products is good”和“ACME Products not bad”可以具有相同的基本含义，即使其中一个句子使用“good”，而另一个句子使用“good”“坏”。

**Penn Treebank’s Tags**

NLTK默认使用由宾夕法尼亚大学的Penn Treebank项目。虽然有些标签是有意义的(例如，CC是一个coordinating conjunction（协调的连词）)，但是其他的标签可能会让人混淆(例如，RP是一个particle粒子)。使用以下资料作为本节所述标签的参考:

```
CC Coordinating conjunction
CD Cardinal number
DT Determiner
EX Existential “there”
FW Foreign word
IN Preposition, subordinating conjunction
JJ Adjective
JJR Adjective, comparative
JJS Adjective, superlative
LS List item marker
MD Modal
NN Noun, singular or mass
NNS Noun, plural
NNP Proper noun, singular
NNPS Proper noun, plural
PDT Predeterminer
POS Possessive ending
PRP Personal pronoun
PRP$ Possessive pronoun
RB Adverb
RBR Adverb, comparative
RBS Adverb, superlative
RP Particle
SYM Symbol
TO “to”
UH Interjection
VB Verb, base form
VBD Verb, past tense
VBG Verb, gerund or present participle
VBN Verb, past participle
VBP Verb, non-third-person singular present
VBZ Verb, third person singular present
WDT wh-determiner
WP Wh-pronoun
WP$ Possessive wh-pronoun
WRB Wh-adverb
```

了测量语言之外，NLTK还可以根据上下文和它自己的大型字典帮助查找单词中的含义。在基本水平上，NLTK可以识别词类:

```python
>>> from nltk.book import *
>>> from nltk import word_tokenize
>>> text = word_tokenize('Strange women lying in ponds distributing swords'\
'is no basis for a system of government.')
>>> from nltk import pos_tag
>>> pos_tag(text)
[('Strange', 'JJ'),
 ('women', 'NNS'),
 ('lying', 'VBG'),
 ('in', 'IN'),
 ('ponds', 'NNS'),
 ('distributing', 'VBG'),
 ('swords', 'NNS'),
 ('is', 'VBZ'),
 ('no', 'DT'),
 ('basis', 'NN'),
 ('for', 'IN'),
 ('a', 'DT'),
 ('system', 'NN'),
 ('of', 'IN'),
 ('government', 'NN'),
 ('.', '.')]
```

每个单词都被分成一个元组tuple，其中包含单词和标识词性的标记(有关这些标记的更多信息，请参阅前面的侧栏)。虽然这看起来像是一个简单的查找，但是通过下面的例子，正确执行任务所需的复杂性变得显而易见:

```python
text = word_tokenize('The dust was thick so he had to dust')
pos_tag(text)
[('The', 'DT'),
 ('dust', 'NN'),
 ('was', 'VBD'),
 ('thick', 'RB'),
 ('so', 'RB'),
 ('he', 'PRP'),
 ('had', 'VBD'),
 ('to', 'TO'),
 ('dust', 'VB')]
```

请注意，单词“dust”在句子中使用了两次:一次用作名词，一次用作动词。NLTK根据句子中的上下文正确识别这两种用法。NLTK通过使用由英语定义的上下文无关语法来识别词性。上下文无关语法是一组规则，这些规则定义了在有序列表中哪些内容可以遵循哪些内容。在本例中，它们定义了允许哪些词性跟随哪些词性。当遇到诸如dust之类的歧义词时，就会参考上下文无关语法的规则，并选择符合这些规则的适当词性。

web抓取中的一个常见问题是处理搜索。您可能正在从站点上抓取文本，希望能够搜索单词“谷歌”的实例，但是只有当它用作动词而不是专有名词时才可以。或者，您可能只查找公司谷歌的实例，而不希望依赖于人们正确使用大写字母来查找这些实例。这里，`pos_tag`函数非常有用:

```python
from nltk import word_tokenize, sent_tokenize, pos_tag
sentences = sent_tokenize('Google is one of the best companies in the world. I constantly google myself to see what I\'m up to.')
nouns = ['NN', 'NNS', 'NNP', 'NNPS']
for sentence in sentences:
	if 'google' in sentence.lower():
		taggedWords = pos_tag(word_tokenize(sentence))
		for word in taggedWords:
			if word[0].lower() == 'google' and word[1] in nouns:
				print(sentence)
```

其中，调试过程：

```python
>>> pos_tag(word_tokenize(sentence))
[('Google', 'NNP'),
 ('is', 'VBZ'),
 ('one', 'CD'),
 ('of', 'IN'),
 ('the', 'DT'),
 ('best', 'JJS'),
 ('companies', 'NNS'),
 ('in', 'IN'),
 ('the', 'DT'),
 ('world', 'NN'),
 ('.', '.')]
```

这只打印包含单词“谷歌”(或“谷歌”)作为某种名词而不是动词的句子。当然，您可以更具体地要求只打印带有“NNP”(专有名词)标记的谷歌实例，但是即使是NLTK有时也会出错，根据应用程序的不同，最好给自己留一点余地。

自然语言的模糊性可以用NLTK的pos_tag函数来解决。通过搜索文本，不仅要搜索目标单词或短语的实例，还要搜索目标单词或短语的实例及其标记，您可以大大提高scraper搜索的准确性和有效性。



















