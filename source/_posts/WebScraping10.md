---
title: WebScraping-10
date: 2019-07-29 23:23:04
categories: Web-Scraping
tags:
- Web-Scraping
- python
mathjax: true
---

当抓取的基础知识时，首先出现的问题之一是:“我如何在登录屏幕后访问信息?”“互联网正日益向互动、社交媒体和用户生成内容迈进。表单和登录是这类站点的一个组成部分，几乎不可能避免。幸运的是，它们也相对容易处理。

在此之前，我们与示例抓取器中的web服务器的大多数交互都是使用HTTP `GET`请求信息。本章重点介绍`POST`方法，它将信息推送到web服务器进行存储和分析。

<!--more-->

表单基本上为用户提供了一种提交`POST`请求的方法，web服务器可以理解和使用该方法。就像网站上的链接标签帮助用户格式化请求一样，HTML表单帮助他们格式化POST请求。当然，只要编写一点代码，就可以自己创建这些请求并使用scraper提交它们。

### Python Requests Library

虽然只使用Python核心库就可以导航web表单，但是有时候稍微添加一点语法糖份会让您的生活更加甜蜜。当您开始使用urllib执行比基本GET请求更多的操作时，查看Python核心库之外的内容可能会有所帮助。

请求库非常擅长处理复杂的HTTP请求、cookie、标头等等。以下是创建者Kenneth Reitz对Python核心工具的一些要求:

- Python的标准urllib2模块提供了您需要的大部分HTTP功能，但是API已经完全被破坏了。它是为不同的时代和不同的网络而建的。它需要大量的工作(甚至方法覆盖)来执行最简单的任务。

  事情不应该是这样的。在Python中不

### Submitting a Basic Form

大多数web表单由几个HTML字段、一个submit按钮和一个action页面组成，实际的表单处理就是在这个页面上完成的。HTML字段通常由文本组成，但也可能包含文件上载或其他非文本内容。

大多数流行的网站在他们的robots.txt文件(章节)中为了安全起见而阻止访问他们的登录表单，我构建了一系列不同类型的表单和`pythonscraping.com`的登录，您可以在这些表单上运行web scraper。`http://pythonscraping.com/pages/files/form.html`是这些表单中最基本的位置。

整个表格内容如下:

```xml
<form method="post" action="processing.php">
First name: <input type="text" name="firstname"><br>
Last name: <input type="text" name="lastname"><br>
<input type="submit" value="Submit">
</form>
```

这里需要注意几件事:首先，两个输入字段的名称分别是`firstname`和`lastname`。这是很重要的。这些字段的名称决定了提交表单时提交到服务器的变量参数的名称。如果希望模拟表单在发布自己的数据时所采取的操作，则需要确保变量名匹配。

需要注意的第二件事是，表单的操作位于`processing.php`(绝对路径是`http://pythonscraping.com/files/processing.php`)。**对表单的任何POST请求都应该在这个页面上发出，而不是在表单*本身*所在的页面上**。记住:HTML表单的目的只是帮助网站访问者格式化正确的请求，以便发送到执行实际操作的页面。除非您正在对请求本身进行格式化研究，否则不需要在表单所在的页面上花费太多精力。使用请求库提交表单可以用四行代码完成，包括导入和打印内容的指令(是的，很简单):

```python
import requests
params = {'firstname': 'Ryan', 'lastname': 'Mitchell'}
r = requests.post("http://pythonscraping.com/pages/processing.php", data=params)
print(r.text)
```

提交表单后，脚本应返回页面内容:

```
Hello there, Ryan Mitchell!
```

这个脚本可以应用于internet上遇到的许多简单表单。例如，O 'Reilly Media newsletter的注册表单如下:

```xml
<form action="http://post.oreilly.com/client/o/oreilly/forms/ quicksignup.cgi" id="example_form2" method="POST">
	<input name="client_token" type="hidden" value="oreilly"/>
	<input name="subscribe" type="hidden" value="optin"/>
	<input name="success_url" type="hidden" value="http://oreilly.com/store/ newsletter-thankyou.html"/>
	<input name="error_url" type="hidden" value="http://oreilly.com/store/ newsletter-signup-error.html"/>
	<input name="topic_or_dod" type="hidden" value="1"/>
	<input name="source" type="hidden" value="orm-home-t1-dotd"/>
	<fieldset>
		<input class="email_address long" maxlength="200" name="email_addr" size="25" type="text" value="Enter your email here"/>
		<button alt="Join" class="skinny" name="submit" onclick="return addClickTracking('orm','ebook','rightrail','dod' );" value="submit">Join</button>
	</fieldset>
</form>
```

尽管一开始看起来很吓人，但请记住，在大多数情况下(我们将在稍后讨论例外情况)，您只需要寻找两件事:

- 要与数据一起提交的字段(或多个字段)的名称(在本例中，名称为`email_addr`)
- 表单本身的动作属性;也就是表单发布到的页面(在本例中是`http://post.oreilly.com/client/o/oreilly/forms/quicksignup.cgi`)

需添加所需的信息，并运行它:

```python
import requests
params = {'email_addr': 'ryan.e.mitchell@gmail.com'}
r = requests.post("http://post.oreilly.com/client/o/oreilly/forms/quicksignup.cgi",
data=params)
print(r.text)
```

在本例中，返回的网站是另一个需要填写的表单，然后才能将其添加到O 'Reilly的邮件列表中，但是同样的概念也可以应用到该表单中。但是，如果您想在家里尝试此功能，我要求您永远使用您的权限，而不是用无效的注册向发布者发送垃圾邮件。

### Radio Buttons, Checkboxes, and Other Inputs

并非所有web表单都是文本字段的集合，然后是submit按钮。标准HTML包含各种可能的表单输入字段:单选按钮、复选框和选择框等等。HTML5添加了滑块(范围输入字段)、电子邮件、日期等等。有了自定义JavaScript字段，有了颜色选择器、日历和开发人员接下来想到的任何其他东西，可能性是无限的。

对应于Python参数对象：

```python
{'thing1':'foo', 'thing2':'bar'}
```

如果您被一个看起来很复杂的POST表单困住了，并且想要确切地看到浏览器正在向服务器发送哪些参数，最简单的方法是使用浏览器的inspector或developer工具来查看它们:

![](WebScraping10\1.bmp)

可以通过菜单访问Chrome开发工具View $\rightarrow$ Developer$\rightarrow$  Developer Tools.。它提供了浏览器在与当前网站交互时生成的所有查询的列表，可以作为详细查看这些查询组成的好方法

### Submitting Files and Images

虽然文件上传在互联网上很常见，但文件上传并不经常用于web抓取。但是，您可能希望为自己的站点编写一个包含文件上载的测试。无论如何，知道如何做是件有用的事。

在`http://pythonscraping/files/form2.html`中有一个练习文件上传表单。该页面的表格有以下标记:

```xml
<form action="processing2.php" method="post" enctype="multipart/form-data">
Submit a jpg, png, or gif: <input type="file" name="uploadFile"><br>
<input type="submit" value="Upload File">
</form>
```

除了具有type属性文件的`<input>`标记外，它基本上与前面示例中使用的基于文本的表单相同。幸运的是，Python请求库使用表单的方式也很相似:

```python
import requests
files = {'uploadFile': open('files/python.png', 'rb')}
r = requests.post('http://pythonscraping.com/pages/processing2.php',
files=files)
print(r.text)
```

### Handling Logins and Cookies

到目前为止，我们主要讨论的是允许您向站点提交信息或在表单之后立即在页面上查看所需信息的表单。这与登录表单有何不同?登录表单允许您在访问站点期间以永久登录状态存在。大多数现代网站都使用cookie来跟踪登录者和未登录者。站点对您的登录凭证进行身份验证后，将它们存储在浏览器的cookie中，cookie通常包含服务器生成的令牌、超时和跟踪信息。然后，站点使用这个cookie作为身份验证的一种证明，它会显示在您访问站点期间访问的每个页面上。在上世纪90年代中期cookie被广泛使用之前，让用户安全地进行身份验证并跟踪他们是网站面临的一个巨大问题。虽然cookie对于web开发人员来说是一个很好的解决方案，但是对于爬虫来说，它可能会有问题。你可以一整天都提交一个登录表单，但是如果你不跟踪表单发送给你的cookie，你访问的下一个页面就会表现得好像你从来没有登录过一样。

`http://pythonscraping.com/pages/cookies/login.html`中创建了一个简单的登录表单(用户名可以是任何东西，但是密码必须是“password”)。这个表单在`http://pythonscraping.com/pages/cookies/welcome.php`中处理，其中包含到主页面的链接`http://pythonscraping.com/pages/cookies/profile.php`。

如果您尝试在不先登录的情况下访问欢迎页面或配置文件页面，您将得到一条错误消息和指示，以便在继续之前先登录。在配置文件页面上，将对浏览器的cookie进行检查，查看其cookie是否设置在登录页面上。

```python
import requests

params = {'username': 'Ryan', 'password': 'password'}
r = requests.post('http://pythonscraping.com/pages/cookies/welcome.php', params)
print('Cookie is set to:')
print(r.cookies.get_dict())
print('Going to profile page...')
r = requests.get('http://pythonscraping.com/pages/cookies/profile.php', 
                 cookies=r.cookies)
print(r.text)

```

这里，您将登录参数发送到welcome页面，该页面充当登录表单的处理器。您可以从最后一个请求的结果中检索cookie，打印结果进行验证，然后通过设置cookie参数将其发送到配置文件页面。

这对于简单的情况非常有效，但是如果您处理的是一个更复杂的站点，它经常在没有警告的情况下修改cookie，或者您甚至不愿意一开始就考虑cookie，情况又会如何呢?请求`session`函数在这种情况下工作得很好:

```python
import requests

session = requests.Session()

params = {'username': 'username', 'password': 'password'}
s = session.post('http://pythonscraping.com/pages/cookies/welcome.php', params)
print("Cookie is set to:")
print(s.cookies.get_dict())
print('Going to profile page...')
s = session.get('http://pythonscraping.com/pages/cookies/profile.php')
print(s.text)

```

在本例中，会话对象(通过调用`request` . `session()`检索)跟踪会话信息，比如cookie、头，甚至关于可能运行在HTTP之上的协议的信息，比如`httpadapter`。

`session()`是一个非常棒的库，仅次于Selenium，在不需要程序员思考或自己编写代码的情况下，它所处理内容的完整性。尽管坐下来让库完成所有工作可能很诱人，但是在编写时，始终注意cookie的外观和它们所控制的内容是非常重要的。它可以节省许多小时的痛苦调试或找出为什么一个网站的行为奇怪!