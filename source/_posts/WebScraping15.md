---
title: WebScraping-15
date: 2019-08-09 14:48:41
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

当处理具有大型开发堆栈的web项目时，通常只有堆栈的后面才会定期进行测试。现在的大多数编程语言(包括Python)都有某种类型的测试框架，但是网站前端常常被排除在这些自动化测试之外，尽管它们可能是项目中唯一面向客户的部分。

<!--more-->

部分问题在于，网站常常是许多标记语言和编程语言的混合体。您可以为JavaScript的各个部分编写单元测试，但是如果与之交互的HTML发生了更改，以致JavaScript无法在页面上执行预期的操作，那么这是没有用的，即使它可以正常工作。

前端网站测试的问题常常被留到以后再考虑，或者委托给级别较低的程序员，他们最多配备一个检查表和一个bug跟踪器。然而，只要稍微提前一点努力，您就可以用一系列单元测试替换这个检查表，并使用web scraper替换人眼。

想象一下:web开发的测试驱动开发。每天进行测试，确保web界面的所有部分都按预期运行。每当有人添加新的网站功能或更改元素的位置时，都会运行一组测试。本章介绍了测试的基础知识，以及如何使用基于python的web scraper测试各种各样的网站，从简单到复杂。

### An Introduction to Testing

如果您以前从未为您的代码编写过测试，那么现在就开始吧。拥有一组可以运行的测试，以确保您的代码按照预期执行(至少，就您编写测试的目的而言)，可以节省您的时间和担心，并使发布新的更新变得容易。

#### What Are Unit Tests

单词test和单元测试(Unit Tests)经常可以互换使用。通常，当程序员提到“编写测试”时，他们真正的意思是“编写单元测试”。另一方面，当一些程序员提到编写单元测试时，他们实际上是在编写其他类型的测试。

虽然定义和实践往往因公司而异，但单元测试通常具有以下特征:

- 每个单元测试测试组件功能的一个方面。例如，如果从银行帐户中取出负数美元，它可能会确保抛出适当的错误消息。

  通常，单元测试根据它们所测试的组件分组在同一个类中。您可能要对从银行帐户中提取的负美元值进行测试，然后对透支银行帐户的行为进行单元测试。

- 每个单元测试都可以完全独立地运行，单元测试所需的任何设置或拆卸都必须由单元测试本身处理。类似地，单元测试不能干扰其他测试的成功或失败，并且它们必须能够以任何顺序成功运行。

- 每个单元测试都可以完全独立地运行，单元测试所需的任何设置或拆卸都必须由单元测试本身处理。类似地，单元测试不能干扰其他测试的成功或失败，并且它们必须能够以任何顺序成功运行。

- 每个单元测试通常至少包含一个断言。例如，单元测试可能断言2 + 2的答案是4。有时候，单元测试可能只包含一个失败状态。例如，如果抛出异常，它可能会失败，但是如果一切顺利，则默认通过。

- 单元测试与大部分代码是分开的。虽然它们必须导入和使用它们正在测试的代码，但是它们通常保存在单独的类和目录中。

尽管许多其他类型的测试可以编写—例如集成测试和验证测试—本章主要关注单元测试。随着最近的测试驱动开发的推进，单元测试不仅变得非常流行，而且它们的长度和灵活性使它们易于作为示例使用，而且Python具有一些内置的单元测试功能，您将在下一节中看到。

### Python unittest

Python的单元测试模块unittest随所有标准Python安装一起打包。只需导入并扩展unittest。TestCase，它将执行以下操作:

- 提供在每个单元测试之前和之后运行的`setUp`和`tearDown`函数
- 提供几种类型的“断言”语句，以允许测试通过或失败
- 运行所有以`test_`开头的函数作为单元测试，忽略那些没有作为测试前缀的函数

下面提供了一个简单的单元测试来确保2 + 2 = 4，Python:

```python
import unittest

class TestAddition(unittest.TestCase):
    def setUp(self):
        print('Setting up the test')

    def tearDown(self):
        print('Tearing down the test')

    def test_twoPlusTwo(self):
        total = 2+2
        self.assertEqual(4, total);

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
```

输出为：

```
.
Setting up the test
Tearing down the test

----------------------------------------------------------------------
Ran 1 test in 0.003s

OK
```

虽然`setUp`和`tearDown`在这里没有提供任何有用的功能，但是出于演示的目的，它们被包含了进来。注意，这些函数在每个单独的测试之前和之后运行，而不是在类中的所有测试之前和之后运行。

这表明测试运行成功，2 + 2确实等于4。

**Running unittest in Jupyter Notebooks**

只有当直接在其中执行时，`__name__ == '__main__'`才为true而不是通过import语句。这允许您使用`unittest.TestCase`，直接从命令行扩展的`TestCase`类。

在Jupyter Notebooks上，情况有点不同。由Jupyter创建的`argv`参数可能会在单元测试中导致错误，并且，由于unittest框架在测试运行后默认退出Python(这会在notebook内核中导致问题)，我们还需要防止这种情况发生。

在Jupyter Notebooks中，你将使用以下方法进行单元测试:

```python
if __name__ == '__main__':
	unittest.main(argv=[''], exit=False)
	%reset
```

*：*第二行将所有`argv`变量(命令行参数)设置为一个空字符串，`unnittest.main`将忽略这个空字符串。它还可以防止`unittest`在运行测试之后退出。

`%reset`行非常有用，因为它重置了内存并销毁了Jupyter Notebooks中所有用户创建的变量。如果没有它，您在记事本中编写的每个单元测试都将包含以前运行的所有测试的所有方法，这些测试也继承了`unittest.TestCase`，包括`setUp`和`tearDown`方法。这也意味着每个单元测试将运行之前单元测试中的所有方法!

使用`%reset`确实为用户在运行测试时创建了一个额外的手动步骤。运行测试时，笔记本会提示用户，询问他们是否确定要重置内存。只需输入y并按回车键即可。

#### Testing Wikipedia

测试你网站的前端(不包括JavaScript，我们将在下一篇文章中讨论)就像把Python unittest库和web scraper结合起来一样简单:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import unittest

class TestWikipedia(unittest.TestCase):
    bs = None
    def setUpClass():
        url = 'http://en.wikipedia.org/wiki/Monty_Python'
        TestWikipedia.bs = BeautifulSoup(urlopen(url), 'html.parser')

    def test_titleText(self):
        pageTitle = TestWikipedia.bs.find('h1').get_text()
        self.assertEqual('Monty Python', pageTitle);

    def test_contentExists(self):
        content = TestWikipedia.bs.find('div',{'id':'mw-content-text'})
        self.assertIsNotNone(content)


if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
    %reset

```

这一次有两个测试:第一个测试页面的标题是否是预期的“Monty Python”，第二个测试确保页面有一个内容div。

输出：

```
..
----------------------------------------------------------------------
Ran 2 tests in 3.263s

OK
Once deleted, variables cannot be recovered. Proceed (y/[n])? y
```

注意，页面的内容只加载一次，并且全局对象`bs`在测试之间共享。这是通过使用`unittest`指定的函数`setUpClass`来实现的，`setUpClass`在类的开始时只运行一次(与`setUp`不同，`setUp`在每个单独的测试之前运行)。使用`setUpClass`而不是`setUp`可以节省不必要的页面加载;您可以获取内容一次并对其运行多个测试。

`setUpClass`和`setUp`之间的一个主要架构区别是，`setUpClass`是一个静态方法，它属于类本身并具有全局类变量，而`setUp`是一个实例函数，它属于类的一个特定实例。这就是为什么`setUp`可以在self上设置属性，而`setUpClass`只能访问`TestWikipedia`类的静态类属性。

虽然一次测试一个页面可能并没有那么强大或有趣，但是您可能还记得第3章，构建能够迭代地遍历网站所有页面的web爬虫程序相对比较容易。当您将web爬虫程序与对每个页面作出断言的单元测试组合在一起时，会发生什么?

重复运行测试的方法有很多，但是对于要在页面上运行的每一组测试，必须小心地只加载每个页面一次，而且还必须避免一次在内存中保存大量信息。下面的设置就是这样做的:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import unittest
import re
import random
from urllib.parse import unquote

class TestWikipedia(unittest.TestCase):

    def test_PageProperties(self):
        self.url = 'http://en.wikipedia.org/wiki/Monty_Python'
        #Test the first 10 pages we encounter
        for i in range(1, 10):
            self.bs = BeautifulSoup(urlopen(self.url), 'html.parser')
            titles = self.titleMatchesURL()
            self.assertEqual(titles[0], titles[1])
            self.assertTrue(self.contentExists())
            self.url = self.getNextLink()
        print('Done!')

    def titleMatchesURL(self):
        pageTitle = self.bs.find('h1').get_text()
        urlTitle = self.url[(self.url.index('/wiki/')+6):]
        urlTitle = urlTitle.replace('_', ' ')
        urlTitle = unquote(urlTitle)
        return [pageTitle.lower(), urlTitle.lower()]

    def contentExists(self):
        content = self.bs.find('div',{'id':'mw-content-text'})
        if content is not None:
            return True
        return False

    def getNextLink(self):
        # Returns random link on page, using technique from Chapter 3
        links = self.bs.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
        randomLink = random.SystemRandom().choice(links)
        return 'https://wikipedia.org{}'.format(randomLink.attrs['href'])
    

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
    %reset
```

有几件事需要注意。首先，这个类中只有一个实际的测试。其他函数在技术上只是辅助函数，尽管它们要做大量的计算工作来确定测试是否通过。因为测试函数执行断言语句，所以测试的结果被传递回发生断言的测试函数。

此外，`contentExists`返回一个布尔值，而`titleMatchesURL`返回值本身进行计算。要查看为什么要返回值而不仅仅是布尔值，请比较布尔断言的结果:

```
======================================================================
FAIL: test_PageProperties (__main__.TestWikipedia)
----------------------------------------------------------------------
Traceback (most recent call last):
File "15-3.py", line 22, in test_PageProperties
self.assertTrue(self.titleMatchesURL())
AssertionError: False is not true
with the results of an assertEquals statement:
======================================================================
FAIL: test_PageProperties (__main__.TestWikipedia)
----------------------------------------------------------------------
Traceback (most recent call last):
File "15-3.py", line 23, in test_PageProperties
self.assertEquals(titles[0], titles[1])
AssertionError: 'lockheed u-2' != 'u-2 spy plane'
```

哪个更容易调试?(在本例中，当文章`http://wikipedia.org/wiki/u-2%20spy%20plane`重定向到标题为“Lockheed U-2”的文章时，错误是由于重定向而发生的。)

### Testing with Selenium

与第11章中的Ajax抓取一样，JavaScript在进行网站测试时也面临着特殊的挑战。幸运的是，Selenium有一个非常好的框架来处理特别复杂的网站;事实上，这个库最初是为网站测试而设计的!

虽然显然是用同一种语言编写的，但是Python单元测试和Selenium单元测试的语法却出奇地少有共同点。Selenium不要求它的单元测试作为函数包含在类中;它的断言语句不需要括号;测试无声地通过，只在失败时产生某种消息:

```python
driver = webdriver.PhantomJS()
driver.get('http://en.wikipedia.org/wiki/Monty_Python')
assert 'Monty Python' in driver.title
driver.close()
```

当运行时，这个测试应该不会产生任何输出。
通过这种方式，Selenium测试可以比Python单元测试更随意地编写，断言语句甚至可以集成到常规代码中，如果不满足某些条件，代码执行可以终止。

#### Interacting With the Site

最近，我想通过当地一家小企业的网站的联系方式联系它，但是发现HTML表单被破坏了;当我点击submit按钮时，什么也没有发生。经过一点调查，我发现他们使用了一个简单的mailto表单，这个表单的目的是向他们发送包含表单内容的电子邮件。幸运的是，我能够使用这些信息给他们发送电子邮件，解释他们表单的问题，并雇佣他们，尽管存在技术问题。如果我要编写一个使用或测试此表单的传统scraper，那么我的scraper很可能只是复制表单的布局，并直接发送一封电子邮件来绕过表单。我怎么能测试表单的功能,并确保它是完全通过浏览器工作吗?

虽然前几章已经讨论了导航链接、提交表单和其他类型的交互活动，但在其核心，我们所做的一切都是为了绕过浏览器界面，而不是使用它。另一方面，Selenium可以直接输入文本、单击按钮，并通过浏览器(在本例中是headless PhantomJS浏览器)执行所有操作，并检测诸如破损的表单、编码糟糕的JavaScript、HTML打印错误以及其他可能阻碍实际客户的问题。

这种测试的关键是Selenium elements。这个对象在第11章中被短暂地遇到，并通过如下调用返回:

```python
usernameField = driver.find_element_by_name('username')
```

正如您可以在浏览器中对网站的各个元素执行许多操作一样，Selenium也可以对任何给定元素执行许多操作。其中包括:

```python
myElement.click()
myElement.click_and_hold()
myElement.release()
myElement.double_click()
myElement.send_keys_to_element('content to enter')
```

除了对元素执行一次性操作外，还可以将操作字符串组合成操作链，这些操作链可以在程序中存储和执行一次或多次。操作链非常有用，因为它们可以方便地串接多个操作的长集合，但是它们在功能上与在元素上显式调用操作相同，如上面的示例所示。

要查看这种差异，请查看`http://pythonscraping.com/pages/files/form.html`中的表单页面(前面在第10章中用作示例)。我们可以通过以下方式填写表格并提交:

```python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")

driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
    options=chrome_options)
driver.get('http://pythonscraping.com/pages/files/form.html')

firstnameField = driver.find_element_by_name('firstname')
lastnameField = driver.find_element_by_name('lastname')
submitButton = driver.find_element_by_id('submit')

### METHOD 1 ###
firstnameField.send_keys('Ryan')
lastnameField.send_keys('Mitchell')
submitButton.click()
################

### METHOD 2 ###
#actions = ActionChains(driver).click(firstnameField).send_keys('Ryan').click(lastnameField).send_keys('Mitchell').send_keys(Keys.RETURN)
#actions.perform()
################

print(driver.find_element_by_tag_name('body').text)

driver.close()
```

方法1在两个字段上调用`send_keys`，然后单击`submit`按钮。
方法2使用一个操作链在每个字段中单击并输入文本，这在调用执行方法后按顺序进行。无论使用第一种方法还是第二种方法，该脚本都以相同的方式运行，并打印以下行:

```
Hello there, Ryan Mitchell!
```

除了用于处理命令的对象之外，这两个方法还有另一个变体:注意，第一个方法单击Submit按钮，而第二个方法在提交文本框时使用Return键提交表单。
因为有很多方法可以考虑完成相同操作的事件序列，所以有很多方法可以使用Selenium完成相同的操作。

**Drag and drop**

单击按钮并输入文本是一回事，但是Selenium真正的亮点在于它能够处理相对新颖的web交互形式。Selenium允许轻松地操作拖放接口。使用它的拖放函数需要指定一个源元素(要拖拽的元素)和一个偏移量来拖拽它，或者一个目标元素来拖拽它。

演示页面位于`http://pythonscraping.com/pages/javascript/draggable.html`展示了这类接口的一个例子:

```python
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
import unittest


class TestAddition(unittest.TestCase):
    driver = None

    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(
            executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
            options=chrome_options)
        url = 'http://pythonscraping.com/pages/javascript/draggableDemo.html'
        self.driver.get(url)

    def tearDown(self):
        self.driver.close()

    def test_drag(self):
        element = self.driver.find_element_by_id("draggable")
        target = self.driver.find_element_by_id("div2")
        actions = ActionChains(self.driver)
        actions.drag_and_drop(element, target).perform()
        self.assertEqual("You are definitely not a bot!",
                         self.driver.find_element_by_id("message").text)

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
    %reset
```

演示页面上的`message` div中打印出两条消息。第一个说:

```
Prove you are not a bot, by dragging the square from the blue area to the red area!
```

然后，快速地，在任务完成后，内容再次打印出来，现在读取:

```
You are definitely not a bot!
```

正如演示页面所示，在许多验证码中，拖拽元素来证明你不是机器人是一个常见的主题。尽管机器人能够拖拽物体已经有很长一段时间了(这只是一个点击、按住和移动的问题)，但不知何故，用拖拽来验证人性的想法不会消失。此外，这些可拖动的CAPTCHA库很少使用任何机器人难以执行的任务，比如将小猫的图片拖放到奶牛的图片上(这要求您在解析指令时将图片标识为小猫和奶牛);相反，它们通常涉及数字排序或其他一些相当琐碎的任务，如前面示例中的任务。

当然，它们的优势在于，它们有如此多的变体，但却很少被使用;没人会费心去做一个能打败所有对手的机器人。无论如何，这个例子应该足以说明为什么不应该在大型网站上使用这种技术。

**Taking screenshots**

除了通常的测试功能之外，Selenium还有一个有趣的技巧，它可能会让您的测试(或让您的老板印象深刻)变得更容易一些:截屏。是的，可以从单元测试运行中创建照片证据，而不需要实际按下`PrtScn`键:

```python
driver = webdriver.PhantomJS()
driver.get('http://www.pythonscraping.com/')
driver.get_screenshot_as_file('tmp/pythonscraping.png')
```

该脚本导航到`http://pythonscraping.com`，然后将主页的屏幕截图存储在本地tmp文件夹中(要正确存储此文件夹，必须已经存在该文件夹)。截图可以保存为多种图像格式。

### unittest or Selenium

Python `unittest`的语法严密性和冗长性可能是大多数大型测试套件所需要的，而Selenium测试的灵活性和强大功能可能是测试某些网站特性的唯一选择。那么该用哪个呢?秘诀是:你不必做出选择。Selenium可以很容易地获得关于网站的信息，而unittest可以评估这些信息是否符合通过测试的标准。您没有理由不能将Selenium工具导入到Python `unittest`中，将两者的优点结合起来。

例如，下面的脚本为网站的draggable界面创建了一个单元测试，断言它正确地说:“您不是一个机器人!“在一个元素被拖到另一个元素之后:

```python
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
import unittest

class TestDragAndDrop(unittest.TestCase):
    driver = None
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(
            executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
            options=chrome_options)
        url = 'http://pythonscraping.com/pages/javascript/draggableDemo.html'
        self.driver.get(url)

    def tearDown(self):
        self.driver.close()

    def test_drag(self):
        element = self.driver.find_element_by_id('draggable')
        target = self.driver.find_element_by_id('div2')
        actions = ActionChains(self.driver)
        actions.drag_and_drop(element, target).perform()
        self.assertEqual('You are definitely not a bot!',
            self.driver.find_element_by_id('message').text)

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
    %reset
```

实际上，网站上的任何内容都可以通过Python的`unittest`和`Selenium`的组合进行测试。事实上，结合第13章中的一些图像处理库，您甚至可以截屏并逐像素测试它应该包含什么内容!