---
title: WebScraping-14
date: 2019-08-07 21:01:22
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

没有什么比抓取一个站点、查看输出以及在浏览器中看不到清晰可见的数据更令人沮丧的了。或者提交一个应该完全没问题但被web服务器拒绝的表单。或者你的IP地址被不明原因的网站屏蔽。这是一些最困难的错误来解决,不仅因为它们可以意想不到的(一个脚本,很好的工作在一个站点可能不会工作在另一个,看似相同,网站),而是因为他们故意不要有任何的错误消息或使用堆栈跟踪。你被认定为一个机器人，被拒绝了，你不知道为什么。

<!--more-->

在这本书中，我写了很多在网站上做棘手事情的方法(提交表单、提取和清理困难的数据、执行JavaScript等等)。本章有点包罗万象，因为这些技术源自各种各样的主题(HTTP头文件、CSS和HTML表单等)。然而，它们都有一个共同点:它们都是为了克服设置的一个障碍，该障碍的唯一目的是防止站点的自动web抓取。无论这些信息现在对您有多有用，我强烈建议您至少浏览一下这一章。你永远不知道什么时候它可能会帮助你解决一个困难的bug或者完全阻止一个问题。

### A Note on Ethics

在本书的前几章中，我讨论了web抓取所存在的法律灰色地带，以及一些道德准则。老实说，这一章在道德上可能是我最难写的一章。我的网站一直被机器人、垃圾邮件发送者、网页抓取器和各种各样不受欢迎的虚拟访客所困扰，也许你们的网站就是这样。那么，为什么要教人们如何建造更好的机器人呢?

我认为这一章很重要，包括以下几个原因:

- 抓取一些不想被抓取的网站，完全有道德和法律上合理的理由。在我之前的一份工作中，我是一名网络搜集者，我从一些网站上自动收集信息，这些网站在未经客户同意的情况下将客户的姓名、地址、电话号码和其他个人信息发布到互联网上。我使用这些抓取的信息向网站发出正式的请求来删除这些信息。为了避免竞争，这些网站警惕地保护这些信息。然而,我的工作,以确保我公司年代的匿名客户(其中一些缠扰者,是家庭暴力的受害者,或者有其他很好的理由要保持低调)web抓取一个令人信服的理由,我很感激我有必要的技能来做这项工作。
- 尽管建立一个防抓取网站几乎是不可能的(或者至少是一个合法用户仍然可以轻松访问的网站)，我希望本章的信息将帮助那些想要保护自己的网站免受恶意攻击的人。在整个过程中，我将指出每种web抓取技术的一些弱点，您可以使用它们来保护自己的站点。请记住，今天web上的大多数机器人只是在广泛地扫描信息和漏洞，即使使用本章描述的几个简单技术，也可能会阻止99%的机器人。然而，它们每个月都在变得越来越复杂，最好做好准备。
- 和大多数程序员一样，我不认为隐瞒任何教育信息是一件绝对积极的事情。

当您阅读本章时，请记住，其中许多脚本和描述的技术不应该在您能找到的每个站点上运行。这不仅不是一件好事，而且你可能会收到一封警告信，甚至更糟(有关收到警告信后该怎么办的更多信息，请参阅第18章)。但是，每次我们讨论一项新技术的时候，我不会用这个问题来反复强调你。所以，在本章剩下的部分，正如哲学家阿甘曾经说过的:这就是我要说的。That’s all I have to say about that

### Looking Like a Human

对于不想被抓取的网站来说，最根本的挑战是如何区分机器人和人类。尽管许多站点使用的技术(例如，你可以做一些相当简单的事情，让你的机器人看起来更像人类。

#### Adjust Your Headers

在本书中，您已经使用了Python请求库来创建、发送和接收HTTP请求，例如在第10章中处理网站上的表单。请求库也非常适合设置头文件。HTTP头是属性或首选项的列表，在每次向web服务器发出请求时由您发送。HTTP定义了几十种模糊的头类型，其中大多数都不常用。然而，大多数主流浏览器在启动任何连接时都一致使用以下7个字段(用我自己浏览器中的示例数据显示)

- `Host` https://www.google.com/
- `Connection` keep-alive
- `Accept` text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
- `User-Agent` Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36
- `Referrer` https://www.google.com/
- `Accept-Encoding` gzip, deflate, sdch
- `Accept-Language` en-US,en;q=0.8

下面是使用默认urllib库的典型Python scraper可能发送的头文件:

- `Accept-Encoding` identity
- `User-Agent` Python-urllib/3.4

如果你是一个网站管理员，试图阻止刮板，你更可能让哪一个?

幸运的是，可以使用请求库完全定制头文件。网站`https://www.whatismybrowser.com`非常适合测试服务器可以查看的浏览器属性。您将刮这个网站，以验证您的cookie设置与以下脚本:

```python
import requests
from bs4 import BeautifulSoup

session = requests.Session()
headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5)'\
           'AppleWebKit 537.36 (KHTML, like Gecko) Chrome',
           'Accept':'text/html,application/xhtml+xml,application/xml;'\
           'q=0.9,image/webp,*/*;q=0.8'}
url = 'https://www.whatismybrowser.com/'\
'developers/what-http-headers-is-my-browser-sending'
req = session.get(url, headers=headers)

bs = BeautifulSoup(req.text, 'html.parser')
print(bs.find('table',{'class':'table-striped'}).get_text)
```

输出：

```html
<bound method Tag.get_text of <table class="table table-striped">
<tr>
<th>ACCEPT</th>
<td>text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8</td>
</tr>
<tr>
<th>ACCEPT_ENCODING</th>
<td>gzip, deflate</td>
</tr>
<tr>
<th>CONNECTION</th>
<td>keep-alive</td>
</tr>
<tr>
<th>HOST</th>
<td>www.whatismybrowser.com</td>
</tr>
<tr>
<th>USER_AGENT</th>
<td>Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5)AppleWebKit 537.36 (KHTML, like Gecko) Chrome</td>
</tr>
</table>>
```

输出应该显示头现在是代码中的headers dictionary对象中设置的相同的头。

虽然网站可以根据HTTP头文件中的任何属性来检查人性化，但我发现，通常唯一真正重要的设置是用户代理。不管你在做什么项目，最好把这个设置为比Python-urllib/3.4更不显眼的东西。此外，如果你遇到一个非常可疑的网站，填充一个常用但很少检查的标题，比如Accept-Language，可能是让它相信你是一个人的关键。

**标题改变你看世界的方式**

假设您想为一个研究项目编写一个机器学习语言翻译程序，但是缺少大量的可测试的翻译文本。许多大型站点根据标题中指定的语言首选项提供相同内容的不同翻译。简单地改变接受语言: 改变 `Accept-Language: en-US`，为` Accept-Language: fr`可能会让你从那些有规模和预算来处理翻译的网站上获得一个Bonjour(大型国际公司通常是一个不错的选择)。标题还可以提示网站更改其显示内容的格式。例如，移动设备在浏览网页时经常看到一个精简版的网站，缺少横幅广告、Flash和其他干扰。如果您尝试将用户代理更改为类似于下面的内容，您可能会发现站点变得更容易抓取，如：

```
User-Agent:Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X)
AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257
Safari/9537.53
```

#### Handing Cookies with JavaScript

正确处理cookie可以缓解许多刮擦问题，尽管cookie也可能是一把双刃剑。使用cookie跟踪网站进程的网站可能会试图切断显示异常行为的抓取器，比如过快填写表单或访问过多页面。虽然这些行为可以通过关闭和重新打开站点的连接来伪装，甚至更改IP地址(有关如何做到这一点的更多信息，请参阅第17章)，但是如果cookie泄露了您的身份，那么您的伪装可能是徒劳的。

cookie也可以用于抓取站点。如第10章所示，在站点上保持登录要求您能够在页面之间保存和呈现cookie。有些网站甚至不要求你每次登录时都要获得一个新版本的cookie，只要持有一个旧版本的登录cookie并访问该网站就足够了。如果您正在抓取单个目标网站或少量目标网站，我建议检查这些网站生成的cookie，并考虑您可能希望您的scraper处理哪些cookie。各种浏览器插件可以在您访问和移动站点时显示cookie是如何设置的。[EditThisCookie](http://www.editthiscookie.com/)是我最喜欢的Chrome扩展之一。

当然,因为它是无法执行的JavaScript,请求图书馆将无法处理许多饼干由现代跟踪软件,比如Google Analytics设置只有在执行客户端脚本(或有时基于页面的事件,例如单击按钮,浏览页面时发生)。要处理这些问题，您需要使用`Selenium`和`PhantomJS`包(我们在第11章介绍了它们的安装和基本用法)。

您可以通过访问任何站点(本例中为`http://pythonscraping.com`)并在webdriver上调用`get_cookies()`来查看cookie:

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe', 
    chrome_options=chrome_options)
driver.get('http://pythonscraping.com')
driver.implicitly_wait(1)
print(driver.get_cookies())
```

输出：

```
[{'domain': 'pythonscraping.com', 'expiry': 1565265310, 'httpOnly': False, 'name': '_gid', 'path': '/', 'secure': False, 'value': 'GA1.2.1307876323.1565178910'}, {'domain': 'pythonscraping.com', 'expiry': 1628250910, 'httpOnly': False, 'name': '_ga', 'path': '/', 'secure': False, 'value': 'GA1.2.2125567117.1565178910'}, {'domain': 'pythonscraping.com', 'expiry': 1565178970, 'httpOnly': False, 'name': '_gat', 'path': '/', 'secure': False, 'value': '1'}, {'domain': 'pythonscraping.com', 'httpOnly': False, 'name': 'has_js', 'path': '/', 'secure': False, 'value': '1'}]
```

要操作cookie，可以调用`delete_cookie()`、`add_cookie()`和`delete_all_cookie()`函数。此外，您还可以保存和存储cookie，以便在其他web刮削器中使用。下面是一个例子，让你了解这些功能是如何协同工作的:

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")

driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe', 
    chrome_options=chrome_options)
driver.get('http://pythonscraping.com')
driver.implicitly_wait(1)

savedCookies = driver.get_cookies()
print(savedCookies)

driver2 = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
    chrome_options=chrome_options)

driver2.get('http://pythonscraping.com')
driver2.delete_all_cookies()
for cookie in savedCookies:
    driver2.add_cookie(cookie)

driver2.get('http://pythonscraping.com')
driver.implicitly_wait(1)
print(driver2.get_cookies())
```

输出：

```
[{'domain': 'pythonscraping.com', 'expiry': 1565265912, 'httpOnly': False, 'name': '_gid', 'path': '/', 'secure': False, 'value': 'GA1.2.872837726.1565179512'}, {'domain': 'pythonscraping.com', 'expiry': 1628251512, 'httpOnly': False, 'name': '_ga', 'path': '/', 'secure': False, 'value': 'GA1.2.1200894088.1565179512'}, {'domain': 'pythonscraping.com', 'expiry': 1565179572, 'httpOnly': False, 'name': '_gat', 'path': '/', 'secure': False, 'value': '1'}, {'domain': 'pythonscraping.com', 'httpOnly': False, 'name': 'has_js', 'path': '/', 'secure': False, 'value': '1'}]

[{'domain': 'pythonscraping.com', 'httpOnly': False, 'name': 'has_js', 'path': '/', 'secure': False, 'value': '1'}, {'domain': 'pythonscraping.com', 'httpOnly': False, 'name': 'has_js', 'path': '/', 'secure': False, 'value': '1'}, {'domain': 'pythonscraping.com', 'expiry': 1565179572, 'httpOnly': False, 'name': '_gat', 'path': '/', 'secure': False, 'value': '1'}, {'domain': 'pythonscraping.com', 'expiry': 1628251530, 'httpOnly': False, 'name': '_ga', 'path': '/', 'secure': False, 'value': 'GA1.2.1200894088.1565179512'}, {'domain': 'pythonscraping.com', 'expiry': 1565265930, 'httpOnly': False, 'name': '_gid', 'path': '/', 'secure': False, 'value': 'GA1.2.872837726.1565179512'}]
```

在本例中，第一个webdriver检索一个网站，打印cookie，然后将它们存储在变量savedcookie中。第二个webdriver加载相同的网站，删除自己的cookie，并添加来自第一个webdriver的cookie。这里有一些技术说明:

- 在添加cookie之前，第二个web驱动程序必须先加载网站。这使得Selenium知道cookie属于哪个域，即使加载网站的行为对scraper没有任何用处。
- 在加载每个cookie之前进行检查，看看域是否以句点(.)字符开始。这是PhantomJS的一个怪处，添加cookie中的所有域都必须以句点开头(例如，.pythonscraping.com)，即使 PhantomJS web驱动程序中的所有cookie实际上都遵循这条规则。如果您正在使用其他浏览器驱动程序，如Chrome或Firefox，则不需要这样做。

完成此操作后，第二个web驱动程序应该具有与第一个相同的cookie。根据谷歌分析，第二个webdriver现在与第一个相同，它们将以相同的方式被跟踪。如果第一个webdriver已登录到站点，第二个webdriver也将登录。

#### Timing Is Everything

如果您做得太快，一些保护良好的网站可能会阻止您提交表单或与网站交互。即使这些安全功能没有到位，从一个网站上下载大量信息的速度明显快于普通人，这是一个让你自己被注意到并被屏蔽的好方法。

因此，尽管多线程编程可能是加载页面更快的好方法，允许您在一个线程中处理数据，而在另一个线程中重复加载页面，但这对于编写好的抓取器来说是一个糟糕的策略。您应该始终将单个页面的负载和数据请求保持在最低限度。如果可能的话，试着把它们间隔几秒钟，即使你不得不添加额外的：

```python
import time
time.sleep(3)
```

在页面加载之间是否需要这额外的几秒钟通常可以通过实验找到。很多次我从一个网站,努力获取数据不得不证明自己不是“机器人”每隔几分钟(用手解决验证码,粘贴我的新获得的饼干在刮刀的网站将抓取本身视为“证明其人性”),但添加一个时间。睡眠解决了我的问题，让我可以无限期地勉强度日。
有时候你必须放慢速度才能走得快! Sometimes you have to slow down to go fast!

### Common Form Security Features

多年来，人们已经使用了许多litmus测试，并在不同程度上成功地将web抓取器与使用浏览器的人分离开来。尽管如果一个机器人下载了一些对公众开放的文章和博客文章并没有什么大不了的，但是如果一个机器人创建了成千上万的用户帐户并开始向你的站点的所有成员发送垃圾邮件，这将是一个大问题。Web表单,特别是形式处理帐户创建和登录,对美国国家安全构成了重大威胁和计算开销,如果他们容易受到机器人的滥用,因此它在许多网站所有者的利益(或至少他们认为)试图限制访问网站。这些以表单和登录为中心的反机器人安全措施可能对web抓取器构成重大挑战。请记住，这只是在为这些表单创建自动化机器人时可能遇到的一些安全措施的部分概述。复习第13章，关于处理验证码和图像处理，以及第17章，关于处理头和IP地址，以获得更多关于处理保护良好的表单的信息。

#### Hidden Input Field Values

HTML表单中的隐藏字段允许浏览器可以查看字段中包含的值，但用户不可见(除非他们查看站点的源代码)。随着越来越多的人使用cookie来存储变量，并在网站上传递这些变量，隐藏字段一度不再受欢迎，直到人们发现了它们的另一个优秀用途:防止抓取器提交表单。

在Facebook登录页面上显示这些隐藏字段的工作示例。虽然表单只有三个可见字段(用户名、密码和提交按钮)，但它在后台向服务器传递了大量信息。

![](C:\Users\QingQuan\Desktop\1.bmp)

隐藏字段用于防止web抓取，主要有两种方式:可以在表单页面上使用随机生成的变量填充字段，服务器希望将该变量发布到表单处理页面。如果表单中没有这个值，服务器可以合理地假设提交不是从表单页面有机地发起的，而是由机器人直接发布到处理页面的。规避此度量的最佳方法是首先抓取表单页面，收集随机生成的变量，然后从那里发布到处理页面。第二种方法是某种蜜罐。如果表单包含一个具有无害名称(如用户名或电子邮件地址)的隐藏字段，那么编写得不好的机器人可能会填写该字段并试图提交它，而不管该字段是否对用户隐藏。任何具有实际值(或与表单提交页面上的默认值不同的值)的隐藏字段都应该被忽略，用户甚至可能被从站点中屏蔽。

简而言之:有时有必要检查表单所在的页面，看看是否遗漏了服务器可能期望的内容。如果您看到几个隐藏字段，通常带有大量随机生成的字符串变量，web服务器可能会在表单提交时检查它们的存在。此外，可能还有其他检查，以确保表单变量最近只被使用过一次(这消除了将它们简单地存储在脚本中并在一段时间内反复使用它们的可能性)，或者两者都使用。

#### Avoiding Honeypots

虽然CSS在很大程度上使区分有用信息和无用信息(例如，通过读取`id`和`class_tags`)变得非常简单，但是对于web scraper来说，它有时也会有问题。如果web表单上的字段通过CSS对用户隐藏，那么可以合理地假设访问该站点的普通用户将无法填写它，因为它不会显示在浏览器中。如果填充了表单，则很可能有一个机器人在工作，并且post将被丢弃。

这不仅适用于表单，还适用于链接、图像、文件和站点上的任何其他项目，这些项目可以由机器人读取，但是一般通过浏览器访问站点的用户是看不到的。对站点上“隐藏”链接的页面访问可以很容易地触发服务器端脚本，该脚本将阻塞用户的IP地址，将该用户记录到站点之外，或者采取一些其他操作来防止进一步访问。事实上，许多商业模式正是基于这个概念。

以位于`http://pythonscraping.com/pages/itsatrap.html`的页面为例。这个页面包含两个链接，一个被CSS隐藏，另一个可见。此外，它还包含一个包含两个隐藏字段的表单:

```html
<html>
<head>
<title>A bot-proof form</title>
</head>
<style>
body {
overflow-x:hidden;
}
.customHidden {
position:absolute;
right:50000px;
}
</style>
<body>
<h2>A bot-proof form</h2>
<a href=
"http://pythonscraping.com/dontgohere" style="display:none;">Go here!</a>
<a href="http://pythonscraping.com">Click me!</a>
<form>
<input type="hidden" name="phone" value="valueShouldNotBeModified"/><p/>
<input type="text" name="email" class="customHidden"
value="intentionallyBlank"/><p/>
<input type="text" name="firstName"/><p/>
<input type="text" name="lastName"/><p/>
<input type="submit" value="Submit"/><p/>
</form>
</body>
</html>
```

这三个元素以三种方式对用户隐藏:

- 第一个链接隐藏在一个简单的`CSS display:none`属性中。
- 电话字段是一个隐藏的输入字段。
- 将电子邮件字段向右移动5万像素(大概是从所有人的显示器屏幕上移开的)，并隐藏显示信息的滚动条，这样就隐藏了电子邮件字段。

幸运的是，由于Selenium呈现它访问的页面，所以它能够区分页面上可视的元素和不可见的元素。元素是否出现在页面上可以由`is_display()`函数确定。

```python
from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.chrome.options import Options

driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
    chrome_options=chrome_options)
driver.get('http://pythonscraping.com/pages/itsatrap.html')
links = driver.find_elements_by_tag_name('a')
for link in links:
    if not link.is_displayed():
        print('The link {} is a trap'.format(link.get_attribute('href')))

fields = driver.find_elements_by_tag_name('input')
for field in fields:
    if not field.is_displayed():
        print('Do not change value of {}'.format(field.get_attribute('name')))
```

输出：

```
The link http://pythonscraping.com/dontgohere is a trap
Do not change value of phone
Do not change value of email
```

尽管您可能不希望访问您找到的任何隐藏链接，但是您将希望确保提交任何预先填充的隐藏表单值(或者让Selenium为您提交它们)和表单的其余部分。总而言之，忽略隐藏字段是危险的，尽管在与它们交互时必须小心。

### The Human Checklist

在这一章里有很多信息，事实上在这本书里，关于如何建造一个看起来不那么像铲运机而更像人的铲运机。如果你一直被网站屏蔽，你不知道为什么，这里有一个清单，你可以用来补救这个问题:

- 首先，如果从web服务器接收到的页面是空白的、缺少信息，或者不是您所期望的(或者在您自己的浏览器中已经看到)，那么很可能是由于在站点上执行JavaScript来创建页面造成的。审查第十一章。
- 如果您正在向网站提交表单或发出`POST`请求，请检查页面以确保网站期望您提交的所有内容都以正确的格式提交。使用Chrome的Inspector面板等工具查看发送到站点的实际`POST`请求，以确保您拥有所有内容，并且“有机”请求看起来与机器人发送的请求相同。
- 如果您试图登录一个网站，但无法使登录“坚持”，或者该网站正在经历其他奇怪的“状态”行为，请检查您的cookie。确保在每次页面加载之间都正确地保存了cookie，并且每个请求都将您的cookie发送到站点。
- 如果您从客户端收到HTTP错误，特别是403个禁止错误，这可能表明网站已经将您的IP地址标识为bot，并且不愿意接受任何其他请求。您将需要等待直到您的IP地址从列表中删除，或者获得一个新的IP地址(移动到别的地方或见第17章)。为了确保您不会再次被阻塞，请尝试以下操作:
  - 确保你的爬虫不会在网站上移动得太快。快速抓取是一种不好的做法，它给web管理员的服务器带来了沉重的负担，可能会让您陷入法律麻烦，而且是抓取器被列入黑名单的头号原因。给刮刀添加延迟，让它们在夜间运行。记住:匆忙编写程序或收集数据是糟糕的项目管理的标志;提前计划，避免像这样的混乱。
  - 最明显的一条:改变你的标题!有些网站会屏蔽任何自称为scraper的东西。如果你不确定什么是合理的标题值，复制你自己浏览器的标题。
  - 确保你没有点击或访问任何人类通常无法访问的东西(有关更多信息“Avoiding Honeypots”)。
  - 如果你发现自己要通过许多困难的障碍才能进入网站，可以考虑联系网站管理员，让他们知道你在做什么。尝试给`webmaster@<domain name>`或`admin@<domain name>`发送电子邮件，以获得使用抓取器的许可。管理员也是人，您可能会对他们共享数据的顺从程度感到惊讶。





















