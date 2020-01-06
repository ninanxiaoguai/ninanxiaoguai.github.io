---
title: WebScraping-11
date: 2019-07-30 22:42:02
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

客户端脚本语言是在浏览器本身中运行的语言，而不是在web服务器上运行的语言。客户端语言的成功取决于浏览器正确解释和执行该语言的能力。

部分原因是很难让每个浏览器制造商都同意一个标准，客户端语言比服务器端语言少得多。
对于web抓取来说，这是一件好事:需要处理的语言越少越好

<!--more-->

在大多数情况下，您在网上只会经常遇到两种语言:Action Script (Flash应用程序使用的脚本)和JavaScript。与10年前相比，ActionScript现在的使用频率要低得多，它经常被用来流媒体文件，作为在线游戏的平台，或者显示没有人想看介绍页面的网站的介绍页面。无论如何，由于对抓取Flash页面的需求不大，本章将重点放在现代web页面中普遍存在的客户端语言:JavaScript。

到目前为止，JavaScript是web上最常见、最受支持的客户端脚本语言。它可以用来收集用户跟踪的信息，无需重新加载页面即可提交表单，嵌入多媒体，甚至可以支持整个在线游戏。即使看起来很简单的页面也常常包含多个JavaScript片段。你可以发现它嵌入`script`标签之间的网页的源代码：

```javascript
<script>
    alert("This creates a pop-up using JavaScript");
</script>
```

### A Brief Introduction to JavaScript

至少对您正在抓取的代码中发生的事情有一些了解是非常有用的。记住这一点，熟悉自己是个好主意JavaScript

JavaScript是一种弱类型语言，其语法常常与c++和Java相比较。尽管语法的某些元素，如操作符、循环和数组，可能是类似的，但是这种语言的弱类型和类似脚本的性质可能使它成为一些程序员难以处理的问题。

例如，下面递归地计算斐波那契数列中的值，并将它们打印到浏览器的开发人员控制台：

```javascript
<script>
	function fibonacci(a, b){
		var nextNum = a + b;
		console.log(nextNum+" is in the Fibonacci sequence");
		if(nextNum < 100){
			fibonacci(b, nextNum);
		}
	}
	fibonacci(1, 1);
</script>
```

注意，所有变量都是通过在它们前面加上var来标识的。这类似于PHP中的$符号，或Java或c++中的类型声明(int、String、List等)。Python的不同寻常之处在于它没有这种显式的变量声明。

```javascript
<script>
var fibonacci = function() {
    var a = 1;
    var b = 1;
    return function() {
        var temp = b;
        b = a + b;
        a = temp;
        return b;
    }
}
var fibInstance = fibonacci();
console.log(fibInstance() + " is in the Fibonacci sequence");
console.log(fibInstance() + " is in the Fibonacci sequence");
console.log(fibInstance() + " is in the Fibonacci sequence");
</script>
```

乍一看，这似乎有点吓人，但是如果你从lambda表达式的角度来考虑(在第2章中讨论过)，它就会变得很简单，变量fibonacci被定义为一个函数。函数的值返回一个函数，该函数在斐波那契数列中打印越来越大的值。每次调用它时，它都会返回Fibonaccicalculating函数，该函数将再次执行并增加函数中的值。

虽然乍一看似乎有些复杂，但有些问题，比如计算斐波那契值，倾向于像这样的模式。在处理用户操作和回调时，将函数作为变量传递也是非常有用的，在阅读JavaScript时，熟悉这种编程风格是值得的。

#### Common JavaScript Libraries

##### jQuery

jQuery是一个非常常见的库，70%最流行的internet站点和大约30%的internet站点都使用它。使用jQuery的站点很容易识别，因为它的代码中包含了对jQuery的导入:

```javascript
<script 
src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
</script>
```

如果在站点上找到jQuery，在抓取它时必须小心。jQuery擅长动态创建仅在JavaScript执行后才出现的HTML内容。如果使用传统方法抓取页面内容，则只检索JavaScript创建内容之前出现的预加载页面(一会有更详细的介绍)。

此外，这些页面更可能包含动画、交互式内容和嵌入式媒体，这可能使抓取具有挑战性。

##### Google Analytics

大约50%的网站使用谷歌分析，这使得它可能是最常见的JavaScript库和互联网上最流行的用户跟踪工具。无论是`http://pythonscraping.com`还是`http://www.oreilly.com/`都使用了谷歌分析。

确定一个页面是否使用谷歌分析是很容易的。它将在底部有JavaScript，类似于以下内容(摘自O 'Reilly媒体网站):

```javascript
<!-- Google Analytics -->
<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-4591498-1']);
_gaq.push(['_setDomainName', 'oreilly.com']);
_gaq.push(['_addIgnoredRef', 'oreilly.com']);
_gaq.push(['_setSiteSpeedSampleRate', 50]);
_gaq.push(['_trackPageview']);
(function() { var ga = document.createElement('script'); ga.type =
'text/javascript'; ga.async = true; ga.src = ('https:' ==
document.location.protocol ? 'https://ssl' : 'http://www') +
'.google-analytics.com/ga.js'; var s =
document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s); })();
</script>
```

此脚本处理特定于谷歌分析程序的cookie，用于跟踪页面之间的访问。对于旨在执行JavaScript和处理cookie的web抓取器(如使用Selenium的web抓取器，本章稍后将对此进行讨论)，这有时可能是一个问题。

如果一个站点使用谷歌分析或类似的web分析系统，而您不希望该站点知道它正在被爬行或被刮除，请确保丢弃用于分析的任何cookie或完全丢弃cookie。

##### Google Maps

如果你在互联网上呆过一段时间，你几乎肯定会在一个网站上看到嵌入的谷歌地图。它的API使得在任何站点上嵌入带有自定义信息的地图变得极其简单。

如果您正在抓取任何类型的位置数据，了解谷歌映射的工作原理可以很容易地获得格式良好的经纬度坐标，甚至地址。在谷歌映射中，最常用的表示位置的方法之一是通过标记(也称为pin)。

使用如下代码，可以将标记插入任何谷歌映射:

```python
var marker = new google.maps.Marker({
	position: new google.maps.LatLng(-25.363882,131.044922),
	map: map,
	title: 'Some marker text'
});
```

Python使提取`google.maps`之间发生的所有坐标实例变得很容易。获取纬度/经度坐标列表。

### Ajax and Dynamic HTML

到目前为止，我们与web服务器通信的唯一方法是通过检索新页面向它发送某种HTTP请求。如果您曾经在没有重新加载页面的情况下提交过表单或从服务器检索过信息，那么您可能使用过使用Ajax的网站。

与一些人所认为的相反，Ajax不是一种语言，而是一组用于完成特定任务的技术(仔细想想，就像web抓取一样)。Ajax代表Asynchronous(异步)JavaScript和XML，用于从web服务器发送和接收信息，而不需要发出单独的页面请求。

You should never say, “This website will be written in Ajax.” It would be correct to say, “This form will use Ajax to communicate with the web server.”

与Ajax一样，动态HTML (DHTML)是一组用于共同目的的技术。DHTML是HTML代码、CSS语言，或者两者都随着客户机端脚本更改页面上的HTML元素而更改。按钮可能只在用户移动光标之后才出现，背景颜色可能在单击时发生变化，或者Ajax请求可能触发要加载的新内容块。

请注意，虽然“动态”这个词通常与“移动”或“更改”之类的词相关联，但是交互式HTML组件、移动图像或嵌入式媒体的出现并不一定使页面DHTML成为动态的，即使它看起来可能是动态的。此外，internet上一些最无趣、看起来静态的页面可以在后台运行DHTML进程，这些进程依赖于使用JavaScript来操纵HTML和CSS。

如果您抓取了许多网站，您很快就会遇到这样的情况:您在浏览器中查看的内容与您在从站点检索的sourcec ode中看到的内容不匹配。您可能会查看scraper的输出，然后挠挠头，试图找出浏览器中相同页面上所看到的所有内容都消失到哪里去了。

web页面也可能有一个加载页面，它会将您重定向到另一个结果页面，但是您会注意到，当重定向发生时，页面的URL不会更改。这两种情况都是由于scraper无法执行JavaScript而导致的，而JavaScript正是在页面上实现这一神奇的功能的原因。如果没有JavaScript, HTML就只是停留在那里，站点可能看起来与web浏览器中的非常不同，web浏览器执行JavaScript时没有问题。页面可能使用Ajax或DHTML来更改/加载内容，但在这种情况下，只有两种解决方案:直接从JavaScript中提取内容;或者使用能够执行JavaScript本身的Python包，并在浏览器中查看网站时对其进行抓取。

#### Executing JavaScript in Python with Selenium

Selenium是一个功能强大的web抓取工具，最初是为网站测试开发的。现在，当需要准确地描述web站点(如在浏览器中出现的站点)时，也可以使用它。Selenium通过自动化浏览器来加载网站、检索所需的数据，甚至可以截屏或断言网站上发生了某些操作。

Selenium不包含自己的web浏览器;它需要与第三方浏览器集成才能运行。例如，如果您使用Firefox运行Selenium，您将看到屏幕上打开一个Firefox实例，导航到网站，并执行代码中指定的操作。虽然这看起来很整洁，但是我更喜欢脚本在后台静静地运行，所以我使用了一个名为PhantomJS的工具来代替实际的浏览器。

PhantomJS是一种headless浏览器。它将网站加载到内存中，并在页面上执行JavaScript，但不向用户呈现网站的任何图形。通过将Selenium与PhantomJS结合起来，您可以运行一个非常强大的web scraper，它可以轻松地处理cookie、JavaScript、header和其他所有您需要的东西。

您可以从其网站下载Selenium库，或者使用第三方安装程序(如pip)从命令行安装它。

虽然很多页面都使用Ajax加载数据(尤其是谷歌)，但我在`http://pythonscraping.com/pages/javascript/ajaxDemo.html`中创建了一个示例页面来运行爬虫。这个页面包含一些示例文本，硬编码到页面HTML中，经过两秒钟的延迟后，这些文本将被ajax生成的内容所替代。如果您要使用传统方法抓取此页面的数据，您只会得到加载页面，而不会得到您想要的数据。

Selenium库是对象WebDriver上调用的API。WebDriver.程序有点像浏览器，因为它可以加载网站，但它也可以像BeautifulSoup对象一样被用来查找页面元素，与页面上的元素交互(发送文本、单击等)，以及执行其他操作来驱动web爬虫。

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe', 
    options=chrome_options)
driver.get('http://pythonscraping.com/pages/javascript/ajaxDemo.html')
time.sleep(3)
print(driver.find_element_by_id('content').text)
driver.close()
```

如果：`time.sleep(3)`运行，那么输出如下：

```
Here is some important text you want to retrieve!
A button to click!
```

如果注释掉`time.sleep(3)`，那么输出如下：

```
This is some content that will appear on the page while it's loading. You don't care about scraping this.
```

**Selenium Selectors**

前几章中，您已经使用`BeautifulSoup`选择器(如`find`和`find_all`)选择了页面元素。`Selenium`使用一组全新的选择器来查找web驱动程序DOM中的元素，尽管它们的名称相当简单。

在这个例子中，您使用了选择器`find_element_by_id`，尽管下面的其他选择器也可以工作:

```python
driver.find_element_by_css_selector('#content')
driver.find_element_by_tag_name('div')
```

当然，如果希望在页面上选择多个元素，这些元素选择器中的大多数都可以使用元素返回Python元素列表：

```python
driver.find_elements_by_css_selector('#content')
driver.find_elements_by_css_selector('div')
```

如果你仍然想使用`BeautifulSoup`来解析这些内容，你可以使用Web‐
方法所查看的，该函数返回页面的源代码

```python
pageSource = driver.page_source
bs = BeautifulSoup(pageSource, 'html.parser')
print(bs.find(id='content').get_text())
```



这将使用`PhantomJS`库创建一个新的`Selenium web`驱动程序，它告诉
`WebDriver`加载一个页面，然后暂停执行三秒钟，然后查看页面以检索(希望已加载)内容。

根据安装PhantomJS的位置，在创建新的PhantomJS Web驱动程序时，可能还需要显式地将Selenium指向正确的方向:

```python
driver = webdriver.PhantomJS(executable_path='path/to/driver/'\
        'phantomjs-1.9.8-macosx/bin/phantomjs')
```

虽然这个解决方案有效，但它的效率有些低，而且实现它可能会在很大程度上导致问题。页面加载时间是不一致的，这取决于任何特定毫秒的服务器负载，并且连接速度会发生自然的变化。虽然这个页面加载应该只需要2秒多一点的时间，但是您给了它整整3秒的时间来确保它完全加载。更有效的解决方案是反复检查已加载的页面上是否存在特定的元素，并仅在该元素存在时返回。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
    options=chrome_options)

driver.get('http://pythonscraping.com/pages/javascript/ajaxDemo.html')
try:
    element = WebDriverWait(driver, 10).until(
                       EC.presence_of_element_located((By.ID, 'loadedButton')))
finally:
    print(driver.find_element_by_id('content').text)
    driver.close()
```

个脚本有几个新的导入，最著名的是WebDriverWait和expected_con，这两个变量在这里组合在一起，形成Selenium所称的(implicit wait)隐式等待。

隐式等待与显式等待的区别在于，它在DOM在继续之前发生，而显式等待定义了硬编码时间，如前一个示例所示，它的等待时间为3秒。在隐式等待中，触发DOM状态由expected_condition定义(注意，这里的导入转换为EC，这是一种用于简洁的常见约定)。Selenium库中的预期条件可以有很多，包括以下内容:

- 弹出一个警告框。
- 元素(例如文本框)被放入选定的状态(selected state)。
- 页面的标题更改，或文本现在显示在页面或特定元素中。
- 元素现在对DOM可见，或者元素从DOM中消失。

大多数这些预期的条件要求您首先指定要监视的元素。元素是使用定位器指定的。注意，定位器与选择器不同(有关选择器的更多信息，请参阅刚刚介绍的“Selenium选择器”)。定位器是一种抽象的查询语言，使用By对象，可以以多种方式使用，包括创建选择器。

在下面的代码中，定位器用于查找ID `loadedButton`的元素：

```python
EC.presence_of_element_located((By.ID, 'loadedButton'))
```

定位器也可以用来创建选择器，使用`find_element WebDriver`函数:

```python
print(driver.find_element(By.ID, 'content').text)
```

当然，这在功能上相当于示例代码中的行:

```python
print(driver.find_element_by_id('content').text)
```

如果你不需要使用定位器，就不要使用;它将为您节省导入。然而，这个方便的工具用于各种应用程序，并且具有很大的灵活性。

以下定位器选择策略可以与`By`对象一起使用:

- ID : 在本例中使用;根据元素的HTML `id`属性查找元素。
- CLASS_NAME : 用于根据其HTML类属性查找元素。为什么这个函数是`CLASS_NAME`而不是`CLASS`?使用form `object.CLASS`会给Selenium的Java库带来问题，其中.class是一个保留方法。为了保持不同语言之间Selenium语法的一致性，使用了`CLASS_NAME`。
- CSS_SELECTOR : 使用#idName、. classname、tagName约定，根据类、id或标记名称查找元素。
- LINK_TEXT : 根据包含的文本查找HTML`<a>` 标记。例如，可以使用(By.LINK_TEXT, "NEXT")，"NEXT"标签会被选择出来。
- PARTIAL_LINK_TEXT : 类似于LINK_TEXT，但匹配部分字符串。
- NAME : 根据名称属性查找HTML标记。这对于HTML表单非常方便。
- TAG_NAME : 根据标记名称查找HTML标记。
- 使用XPath表达式(其语法将在下面描述)来选择匹配的元素。

**XPath Syntax**

XPath (XML Path的缩写)是一种查询语言，用于导航和选择XML文档的某些部分。W3C于1999年创建，在处理XML文档时，偶尔会在Python、Java和c#等语言中使用它。

虽然BeautifulSoup不支持XPath，但本书中的许多其他库(如Scrapy和Selenium)都支持。它通常可以与CSS选择器(如mytag#idname)以相同的方式使用，尽管它被设计用于更通用的情况
特别是XML文档而不是HTML文档。

XPath语法有四个主要概念:

- 根节点和非根节点
  - `/div`只有在div节点位于文档的根节点时才会选择它
  - `//div`选择文档中任何位置的所有div。
- 属性选择
  - `//@href`选择具有href属性的任何节点。
  - `//a[@href='http://google.com']`选择文档中指向谷歌的所有链接。
- 按位置选择节点
  - //a[3]选择文档中的第三个链接。
  - //table[last()]选择文档中的最后一个表。
  - //a[position() < 3]选择文档中的前三个链接。
- 星号(*)匹配任何一组字符或节点，可用于各种情况
  - `//table/tr/*`选择所有表中tr标记的所有子元素(这对于同时使用th和td标记选择单元格非常有用)。
  - `//div[@*]`选择所有具有任何属性的div标记。

XPath语法还有许多高级特性。多年来，它已经发展成为一种相对复杂的查询语言，具有布尔逻辑、函数(如`position()`)和这里没有讨论的各种操作符。

如果有HTML或XML选择问题无法通过这里显示的函数解决，请参阅Microsoft的XPath语法页面。

#### Additional Selenium Webdrivers

在前一节中，PhantomJS驱动程序与Selenium一起使用。在大多数情况下，没有什么理由让浏览器在屏幕上弹出并开始抓取web，所以像PhantomJS这样的无头网络驱动程序可以很方便。然而，使用不同类型的web浏览器可能对运行爬虫很有用，原因如下:

- 故障排除。如果您的代码正在运行PhantomJS，并且失败了，如果没有看到前面的页面，可能很难诊断失败。您还可以暂停代码执行，并像往常一样随时与web页面进行交互。
- 测试可能依赖于特定的浏览器来运行。
- 一个异常挑剔的网站或脚本在不同的浏览器上的表现可能略有不同。您的代码可能无法在PhantomJS中工作。

现在，许多官方和非官方的组织都参与了为每个主要浏览器创建和维护Selenium web驱动程序。Selenium组管理这些web驱动程序的集合，以便于参考。

```python
firefox_driver = webdriver.Firefox('<path to Firefox webdriver>')
chrome_driver = webdriver.Chrome('<path to Chrome webdriver>')
safari_driver = webdriver.Safari('<path to Safari webdriver>')
ie_driver = webdriver.Ie('<path to Internet Explorer webdriver>')
```

### Handling Redirects

客户端重定向是由JavaScript在浏览器中执行的页面重定向，而不是在发送页面内容之前在服务器上执行的重定向。在web浏览器中访问页面时，有时很难区分它们。重定向可能发生得非常快，以至于您没有注意到加载时间上的任何延迟，并且假设客户端重定向实际上是服务器端重定向。

然而，当抓取web时，差别是明显的。服务器端重定向，取决于它是如何处理的，可以很容易地由Python的urllib库遍历，而不需要Selenium的任何帮助(关于这方面的更多信息，请参阅第3章)。

Selenium能够像处理其他JavaScript执行一样处理这些JavaScript重定向;然而，这些重定向的主要问题是何时停止页面执行—也就是说，如何判断页面何时完成重定向。在`http://pythonscraping.com/pages/javascript/redirectDemo1.html`上的演示页面给出了这种重定向的示例，其中有一个两秒钟的暂停。

通过在页面初始加载时“监视”DOM中的元素，然后反复调用该元素，直到Selenium抛出`StaleElementReferenceException`，您可以以一种聪明的方式检测重定向;元素不再附加到页面的DOM，网站已重定向:

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.remote.webelement import WebElement
from selenium.common.exceptions import StaleElementReferenceException
import time

def waitForLoad(driver):
    elem = driver.find_element_by_tag_name("html")
    count = 0
    while True:
        count += 1
        if count > 20:
            print("Timing out after 10 seconds and returning")
            return
        time.sleep(.5)
        try:
            elem == driver.find_element_by_tag_name("html")
        except StaleElementReferenceException:
            return
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe',
    options=chrome_options)
driver.get("http://pythonscraping.com/pages/javascript/redirectDemo1.html")
waitForLoad(driver)
print(driver.page_source)
driver.close()
```

此脚本每半秒检查一次页面，超时时间为10秒，不过用于检查时间和超时的时间可以根据需要轻松地向上或向下调整。

或者，您可以编写一个类似的循环来检查页面的当前URL，直到URL发生更改，或者它匹配您正在寻找的特定URL。

等待元素出现和消失是Selenium中的一项常见任务，您还可以使用前面的按钮加载示例中使用的相同的WebDriverWait函数。在这里，您为它提供了一个15秒的超时和一个XPath选择器，该选择器查找页面主体内容来完成相同的任务:

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe', 
    options=chrome_options)
driver.get('http://pythonscraping.com/pages/javascript/redirectDemo1.html')
try:
    bodyElement = WebDriverWait(driver, 15).until(EC.presence_of_element_located(
        (By.XPATH, '//body[contains(text(), "This is the page you are looking for!")]')))
    print(bodyElement.text)
except TimeoutException:
    print('Did not find the element')
```

### A Final Note on JavaScript

现在大多数网站都使用JavaScript。对我们来说幸运的是，在许多情况下，这种Java脚本的使用不会影响您如何抓取页面。例如，JavaScript可能仅限于为其跟踪工具供电、控制站点的一小部分或操作下拉菜单。如果JavaScript确实影响了您抓取站点的方式，那么可以使用Selenium之类的工具轻松地执行JavaScript，以便生成您在本书第一部分中学习过的简单HTML页面。

**记住**:仅仅因为一个站点使用JavaScript并不意味着所有传统的web抓取工具都将消失。JavaScript的最终目的是生成可以由浏览器呈现的HTML和CSS代码，或者通过HTTP请求和响应与服务器进行动态通信。一旦使用了Selenium，页面上的HTML和CSS就可以像使用任何其他网站代码一样被读取和解析，HTTP请求和响应可以通过前面几章中的技术由代码发送和处理，甚至无需使用Selenium。

此外，JavaScript甚至可以成为web抓取器的一个优势，因为它作为一个浏览器端内容管理系统的使用可能会向外部世界公开有用的api，让您更直接地获取数据。有关这方面的更多信息，请参见第十二章。

如果您仍然难以处理特别复杂的JavaScript情况，您可以在第14章中找到关于Selenium的信息，并直接与动态网站交互，包括拖放界面。