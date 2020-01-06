---
title: WebScraping-13
date: 2019-08-05 23:34:49
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

从谷歌的自动驾驶汽车到识别假币的自动售货机，机器视觉是一个有着深远目标和影响的巨大领域。本章主要关注该领域的一个小方面:文本识别——具体地说，如何识别和使用通过使用各种Python库在网上找到的基于文本的图像。

<!--more-->

当您不希望文本被机器人发现和读取时，使用图像代替文本是一种常见的技术。当电子邮件地址部分或全部呈现为图像时，经常可以在联系人表单中看到这一点。这取决于它的技巧，甚至可能不会被人类观众注意到，但机器人很难阅读这些图像，而这项技术足以阻止大多数垃圾邮件发送者获取你的电子邮件地址。

当然，验证码利用了这样一个事实:用户可以读取安全图像，但大多数机器人不能。有些验证码比其他的更难，这个问题我们将在本书后面讨论。

但验证码并不是抓取器需要图片到文本翻译帮助的唯一地方。即使在今天这个时代，许多文件都是从硬拷贝中扫描出来放到网上的，这就使得这些文件即使“隐藏在普通的视线中”，对大多数互联网来说也是不可访问的。“如果没有图像-文本功能，让人们能够访问这些文件的唯一方法就是手工输入——没有人有时间这么做。

将图像转换成文本被称为光学字符识别(OCR)。一些主要的库可以执行OCR，许多其他库支持它们或构建在它们之上。这个库系统有时会变得相当复杂，所以我建议您在尝试本章中的任何练习之前阅读下一节。

### Overview of Libraries

Python是一种出色的语言，用于图像处理和读取、基于图像的机器学习，甚至图像创建。虽然许多库可以用于图像处理，但我们将重点关注两个库:Pillow和Tesseract。在处理和处理web上的图像时，这两个库构成了一个强大的互补组合。Pillow执行第一次扫描、清洗和过滤图像，Tesseract试图将这些图像中的形状与它的已知文本库匹配起来。本章将介绍它们的安装和基本用法，以及一些示例

#### Pillow

尽管Pillow可能不是功能最齐全的图像处理库，但它拥有你可能需要的所有功能，而且有些——除非你打算用Python重写Photoshop，在这种情况下，你读错了书!Pillow还有一个优势，就是它是文档更丰富的第三方库之一，而且非常容易开箱即用。

从python2的Python图像库(PIL)中分离出来。x，枕头增加支持Python 3. x。和它的前辈一样，Pillow可以让你很容易地导入和操作各种各样的滤镜、蒙版，甚至是像素特定的转换图像:

```python
from PIL import Image, ImageFilter
kitten = Image.open('kitten.jpg')
blurryKitten = kitten.filter(ImageFilter.GaussianBlur)
blurryKitten.save('kitten_blurred.jpg')
blurryKitten.show()
```

在前面的示例中，图像kitten.jpg将在您的默认图像查看器中打开，其中添加了一个blur，并且还将以更模糊的状态保存为同一目录中的kitten_blur .jpg。
您将使用Pillow对图像进行预处理，使其更具机器可读性，但是正如前面提到的，除了这些简单的过滤器应用程序外，您还可以使用库做许多其他事情。要了解更多信息，请查看Pillow文档。

#### Tesseract

Tesseract是一个OCR库。由谷歌(一家以OCR和机器学习技术闻名的公司)赞助，Tesseract被广泛认为是可用的最好的、最准确的开源OCR系统。除了准确，它还非常灵活。可以训练它识别任意数量的字体(只要这些字体内部相对一致，您很快就会看到)。还可以扩展它来识别任何Unicode字符。本章使用命令行程序Tesseract及其第三方Python包装器pytesseract。两者都将被显式地命名为这两个中的一个，所以要知道，当您看到Tesseract时，我指的是命令行软件，当您看到pytesseract时，我特别指的是它的第三方Python包装器。

- 在CMD中运行，`pip install pytesseract `，我的文件会放在`D:\Anaconda3\Lib\site-packages\pytesseract`中
- 打开`Tesseract`window下载[链接](https://digi.bib.uni-mannheim.de/tesseract/) ，下载最新版本，下载时会有语言选项，按需求来选择语言数据。我下载到了`D:\Tesseract-OCR`这里，因此，打开`D:\Anaconda3\Lib\site-packages\pytesseract\pytesseract.py`，如下代码修改一下。

```python
tesseract_cmd = 'pytesseract.exe'
#修改成一下
tesseract_cmd = 'D:/Tesseract-OCR/tesseract.exe'
```

就大功告成了。`Pytesseract`除了返回如上面的代码示例所示的图像的OCR结果外，还有几个有用的特性。它可以估计框文件(每个字符边界的像素位置):

```python
print(pytesseract.image_to_boxes(Image.open('files/text_2.png')))
```

```
T 23 60 34 77 0
h 23 60 36 77 0
i 39 60 49 77 0
s 52 60 67 77 0
i 76 60 78 77 0
s 80 60 91 73 0
s 99 60 109 73 0
o 111 60 122 73 0
m 125 60 142 73 0
e 144 60 156 73 0
t 164 56 172 77 0
e 164 60 170 77 0
x 171 60 182 73 0
t 184 60 195 73 0
, 196 56 206 77 0
w 216 60 229 77 0
r 216 60 233 73 0
i 235 60 241 73 0
t 243 60 252 77 0
t 253 60 259 77 0
e 260 60 272 73 0
n 275 60 285 73 0
i 295 60 297 77 0
n 300 60 310 73 0
A 317 56 329 77 0
r 317 60 333 77 0
i 335 60 341 73 0
a 343 60 345 77 0
l 347 60 363 77 0
, 367 56 369 62 0
t 378 60 384 77 0
h 387 60 397 77 0
a 399 60 410 73 0
t 412 60 418 77 0
w 425 60 437 77 0
i 425 60 442 73 0
l 444 60 451 77 0
l 455 60 457 77 0
b 467 60 477 77 0
e 479 60 491 73 0
r 500 60 506 73 0
e 507 60 519 73 0
a 520 60 532 73 0
d 534 60 545 77 0
b 555 60 565 77 0
y 567 55 578 73 0
T 23 31 36 48 0
e 35 31 46 44 0
s 48 31 59 44 0
s 50 31 71 48 0
e 60 31 71 44 0
r 72 31 84 44 0
a 87 31 93 44 0
c 94 31 105 44 0
t 107 31 118 44 0
. 118 31 130 48 0
H 140 31 153 48 0
e 156 31 168 44 0
r 171 31 177 44 0
e 178 31 189 44 0
a 198 31 209 44 0
r 212 31 218 44 0
e 219 31 230 44 0
s 239 31 249 44 0
o 251 31 262 44 0
m 265 31 282 44 0
e 284 31 296 44 0
s 304 31 315 44 0
y 316 26 327 44 0
m 329 31 346 44 0
b 334 26 355 48 0
o 349 31 360 48 0
l 362 31 373 44 0
s 376 31 378 48 0
: 380 31 396 44 0
! 407 31 410 48 0
| 409 26 420 49 0
@ 413 26 435 48 0
# 436 31 449 48 0
$ 451 29 462 49 0
% 464 31 482 48 0
* 485 39 494 48 0
& 496 31 510 48 0
* 512 41 519 48 0
( 512 26 528 49 0
) 522 26 536 48 0
```

它还可以返回所有数据的完整输出，如置信度评分、页码、行号、框号等信息:

```python
print(pytesseract.image_to_data(Image.open('files/text_2.png')))
```

![](WebScraping13\1.png)

后两个文件的默认输出是空格或制表符分隔的字符串文件，但也可以作为字典或字节字符串(如果UTF-8解码不够)得到输出:

```python
from PIL import Image
import pytesseract
from pytesseract import Output


print(pytesseract.image_to_data(Image.open('files/textOriginal.png'),output_type=Output.DICT))
print('-------------------')
print(pytesseract.image_to_string(Image.open('files/textOriginal.png'), output_type=Output.BYTES))
```

图片是这样的：

![](WebScraping13\textOriginal.png)

输入结果:

```
{'level': [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5], 'page_num': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'block_num': [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'par_num': [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'line_num': [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2], 'word_num': [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6], 'left': [0, 23, 23, 23, 23, 76, 99, 164, 215, 295, 317, 378, 425, 467, 500, 555, 23, 23, 140, 198, 239, 304, 407], 'top': [0, 26, 26, 26, 26, 26, 30, 26, 26, 26, 26, 26, 26, 26, 26, 26, 54, 55, 55, 59, 59, 55, 54], 'width': [600, 555, 555, 555, 44, 15, 57, 42, 70, 15, 52, 40, 32, 24, 45, 23, 513, 107, 49, 32, 57, 92, 129], 'height': [103, 51, 51, 22, 17, 17, 13, 21, 17, 17, 21, 17, 17, 17, 17, 22, 23, 17, 17, 13, 13, 22, 23], 'conf': ['-1', '-1', '-1', '-1', 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, '-1', 96, 96, 96, 96, 90, 64], 'text': ['', '', '', '', 'This', 'is', 'some', 'text,', 'written', 'in', 'Arial,', 'that', 'will', 'be', 'read', 'by', '', 'Tesseract.', 'Here', 'are', 'some', 'symbols:', '!|@#$%&*()']}
-------------------
b'This is some text, written in Arial, that will be read by\nTesseract. Here are some symbols: !|@#$%&*()\n\x0c'
```

本章结合使用了`pytesseract`库和命令行以及通过子进程库从Python触发`Tesseract`。虽然`pytesseract`库非常有用和方便，但是它不能执行一些`Tesseract`函数，所以最好熟悉所有方法。

#### NumPy

虽然对于简单的OCR并不需要NumPy，但是如果您想训练Tesseract识别本章后面介绍的其他字符集或字体，就需要它。在后面的一些代码示例中，您还将使用它来完成简单的数学任务(比如加权平均)。

即使您不打算运行任何使用它的代码示例，我也强烈建议安装它或将它添加到您的Python库中。它使Python的内置数学库更加完善，并具有许多有用的特性，特别是对于数字列表的操作。

```python
import numpy as np
numbers = [100, 102, 98, 97, 103]
print(np.std(numbers))
print(np.mean(numbers))
```

### Processing Well-Formatted Text

如果幸运的话，您需要处理的大部分文本将相对干净，格式也很好。格式良好的文本通常满足几个要求，尽管“混乱”和“格式良好”之间的界限可能是主观的。

一般来说，格式良好的文本:

- 用一种标准字体书写(不包括手写字体、草书字体或过分装饰的字体);
- 如复制或拍照，线条极清晰，无复制伪影或暗斑;
- 排列整齐，没有倾斜的字母;和
- 不运行的图像，也没有切断文字或边缘的图像

有些东西可以在预处理中固定下来。例如，可以将图像转换为灰度，可以调整亮度和对比度，还可以根据需要裁剪和旋转图像。然而，一些基本的限制可能需要更广泛的培训。

您可以从命令行运行Tesseract来读取这个文件，并将结果写入文本文件:

```
tesseract text.tif textoutput | cat textoutput.txt
```

输出是关于Tesseract库的一行信息，表示它正在运行，然后是新创建的`textoutput.txt`的内容:

```
Tesseract Open Source OCR Engine v3.02.02 with Leptonica
This is some text, written in Arial, that will be read by
Tesseract. Here are some symbols: !@#$%"&‘()
```

您可以看到，虽然符号^和*分别被解释为双引号和单引号，但是结果基本上是准确的。不过，总的来说，这可以让你相当舒服地阅读文本。

在模糊图像文本、创建一些JPG压缩工件并添加一个轻微的背景渐变之后，结果会变得更糟

![](WebScraping13\2.bmp)

Tesseract无法很好地处理这幅图像，主要是由于背景渐变，产生如下输出:

```
This is some text, written In Arlal, that"
Tesseract. Here are some symbols: _
```

请注意，一旦背景渐变使文本更难区分，文本就会被切断，而且每一行的最后一个字符都是错误的，因为`Tesseract`徒劳地试图理解它。此外，JPG构件和模糊使得`Tesseract`很难区分小写i和大写i以及数字1。

这就是使用Python脚本首先清理图像的地方。使用`Pillow`库，您可以创建一个阈值过滤器来去除背景中的灰色，显示文本，并使图像更清晰，以便`Tesseract`读取。

```python
from PIL import Image
import pytesseract
def cleanFile(filePath, newFilePath):
	image = Image.open(filePath)
	#Set a threshold value for the image, and save
	image = image.point(lambda x: 0 if x < 143 else 255)
	image.save(newFilePath)
	return image
image = cleanFile('files/textBad.png', 'files/textCleaned.png')
#call tesseract to do OCR on the newly created image
print(pytesseract.image_to_string(image))
```

生成的图像，自动创建为`textclean.png`，如图所示:

![](WebScraping13\3.bmp)

除了一些难以辨认或缺少标点符号外，文本至少对我们来说是可读的。Tesseract竭尽全力:

```
This us some text‘ written In Anal, that will be read by
Tesseract Here are some symbols: !@#$%"&'()
```

句号和逗号非常小，它们是这幅图像争吵的第一个受害者，几乎从我们和Tesseract的视野中消失。还有一个不幸的误解是把Arial误译成Anal，这是Tesseract把r和i解释成单个字符n的结果。

尽管如此，这还是比之前的版本有了改进，在之前的版本中，几乎有一半的文本被剪掉了。Tesseract最大的缺点似乎是背景亮度不同。Tesseract的算法试图在阅读文本之前自动调整图像的对比度，但是您可以使用Pillow library这样的工具自己完成这项工作，从而获得更好的结果。

在提交到Tesseract之前，您一定要修复那些倾斜的、大面积非文本的或有其他问题的图像。

#### Adjusting Images Automatically

在前面的例子中，为了让`Tesseract`读取图像，实验中选择143作为理想阈值，将所有图像像素调整为黑色或白色。但是，如果您有许多图像，所有的图像都有稍微不同的灰度问题，并且无法合理地手动调整所有这些图像，情况会怎样呢?找到最好的解决方案的一种方法(或者至少是一个很好的一个)是运行超正方体对一系列图像调整到不同的价值观和算法选择一个最好的结果,以某种组合的字符串的字符数和/或超正方体可以阅读,和信心,它读取这些字符。

确切地说，您使用的算法可能会因应用程序的不同而略有不同，但这是迭代图像处理阈值以找到“最佳”设置的一个例子:

```python
import pytesseract
from pytesseract import Output
from PIL import Image
import numpy as np

def cleanFile(filePath, threshold):
    image = Image.open(filePath)
    #Set a threshold value for the image, and save
    image = image.point(lambda x: 0 if x<threshold else 255)
    return image

def getConfidence(image):
    data = pytesseract.image_to_data(image, output_type=Output.DICT)
    text = data['text']
    confidences = []
    numChars = []
    
    for i in range(len(text)):
        if int(data['conf'][i]) > -1:
            confidences.append(data['conf'][i])
            numChars.append(len(text[i]))
            
    return np.average(confidences, weights=numChars), sum(numChars)
    
filePath = 'files/textBad.png'

start = 80
step = 5
end = 200

for threshold in range(start, end, step):
    image = cleanFile(filePath, threshold)
    scores = getConfidence(image)
    print('threshold: {}, confidence: {}, numChars '.format(str(threshold), str(scores[0]), str(scores[1])))

```

这个脚本有两个功能:

- cleanFile

  接受一个原始的“坏”文件和一个阈值变量来运行PIL阈值工具。它处理文件并返回PIL图像对象。

- getConfidence

  接受清洗后的PIL图像对象，并通过Tesseract运行它。它计算每个已识别字符串的平均置信度(由该字符串中的字符数加权)，以及已识别字符的数量。

  通过改变阈值，得到每个值的置信度和识别字符的个数，得到输出:

```
threshold: 80, confidence: 61.8333333333 numChars 18
threshold: 85, confidence: 64.9130434783 numChars 23
threshold: 90, confidence: 62.2564102564 numChars 39
threshold: 95, confidence: 64.5135135135 numChars 37
threshold: 100, confidence: 60.7878787879 numChars 66
threshold: 105, confidence: 61.9078947368 numChars 76
threshold: 110, confidence: 64.6329113924 numChars 79
threshold: 115, confidence: 69.7397260274 numChars 73
threshold: 120, confidence: 72.9078947368 numChars 76
threshold: 125, confidence: 73.582278481 numChars 79
threshold: 130, confidence: 75.6708860759 numChars 79
threshold: 135, confidence: 76.8292682927 numChars 82
threshold: 140, confidence: 72.1686746988 numChars 83
threshold: 145, confidence: 75.5662650602 numChars 83
threshold: 150, confidence: 77.5443037975 numChars 79
threshold: 155, confidence: 79.1066666667 numChars 75
threshold: 160, confidence: 78.4666666667 numChars 75
threshold: 165, confidence: 80.1428571429 numChars 70
threshold: 170, confidence: 78.4285714286 numChars 70
threshold: 175, confidence: 76.3731343284 numChars 67
threshold: 180, confidence: 76.7575757576 numChars 66
threshold: 185, confidence: 79.4920634921 numChars 63
threshold: 190, confidence: 76.0793650794 numChars 63
threshold: 195, confidence: 70.6153846154 numChars 65
```

无论是对结果的平均信心，还是识别的字符数，都有一个明显的趋势。两者都趋向于在145的阈值附近达到峰值，这接近手动找到的143的“理想”结果。

阈值为140和145都给出了可识别字符的最大数量(83)，但是对于那些找到的字符，阈值145给出了最高的可信度，因此您可能希望使用该结果并返回在该阈值下识别的文本，该文本是图像包含哪些文本的“最佳猜测”。

当然，仅仅找到“大多数”字符并不一定意味着所有这些字符都是真实的。在某些阈值下，Tesseract可以将单个字符分割成多个字符，或者将图像中的随机噪声解释为实际上不存在的文本字符。在这种情况下，您可能希望更多地依赖于每个得分的平均信心。

例如，如果您发现以下结果(部分):

```
threshold: 145, confidence: 75.5662650602 numChars 83
threshold: 150, confidence: 97.1234567890 numChars 82
```

如果只丢失一个字符，您的信心就增加了20%以上，并且假设阈值为145的结果是不正确的，或者可能分割了一个字符，或者发现了一些不存在的东西，那么您很可能会毫不犹豫地接受这个结果。

这是一些预先的实验，以完善您的阈值选择算法可能会派上用场。例如,你可能想要选择的分数的乘积的信心和字符的数量最大化(在这种情况下,145仍然赢得了6272的产物,和在我们的虚构的示例中,阈值150会赢的产品7964)和其他指标。注意，这种类型的选择算法也适用于任意的PIL工具值，而不仅仅是阀值。此外，您还可以使用它来选择两个或多个值，方法是改变每个值的值，并以类似的方式选择最佳结果得分。显然，这种类型的选择算法是计算密集型的。你在每张图片上运行PIL和Tesseract很多次，但是如果你提前知道理想的阈值，你只需要运行一次。

请记住，当您开始处理正在处理的图像时，您可能会注意到理想值中的模式。实际上，您可能只需要尝试130到180之间的阈值，而不是尝试80到200之间的每个阈值。您甚至可以采用另一种方法，选择阈值，例如，第一次迭代间隔20个阈值，然后使用贪婪算法，通过减小在前一次迭代中找到的最佳解决方案之间阈值的步长，来获得最佳结果。当您处理多个变量时，这也可能是最有效的。

#### Scraping Text from Images on Websites

使用Tesseract从硬盘上的图像中读取文本似乎并不那么令人兴奋，但是当与web scraper一起使用时，它可以成为一个强大的工具。图像可能会无意中混淆网站上的文本(与本地餐馆网站上菜单的JPG副本一样)，但它们也可能有意地隐藏文本，在下一个示例中我将展示这一点。尽管Amazon的robots.txt文件允许抓取站点的产品页面，但通常不会被路过的机器人获取图书预览。这是因为图书预览是通过用户触发的Ajax脚本加载的，图像被小心地隐藏在div层之下。对于一般的网站访问者来说，它们可能更像Flash演示而不是图像文件。当然，即使你能看到这些图片，作为文本来阅读也不是一件小事。下面的脚本完成了这一壮举:它导航到托尔斯泰《伊凡·伊里奇之死》的大字印刷版本，打开阅读器，收集图像url，然后系统地下载、阅读和打印每个url的文本。请注意，这段代码依赖于Amazon清单以及Amazon网站的几个架构特性才能正确运行。如果该列表下降或被替换，请使用预览功能免费替换另一本书的URL(我发现大字体、无衬线字体工作得很好)。

因为这是一个相对复杂的代码，它借鉴了前几章的多个概念，所以我在整个代码中添加了注释，以便更容易理解正在发生的事情:

```python
import time
from urllib.request import urlretrieve
from PIL import Image
import pytesseract
from selenium import webdriver
from PIL import Image

# Create new Selenium driver
driver = webdriver.Chrome(executable_path='C:\Program Files (x86)\Google\Chrome\Application\chromedriver')

driver.get(
    'https://www.amazon.com/Death-Ivan-Ilyich-Nikolayevich-Tolstoy/dp/1427027277')
time.sleep(2)

# Click on the book preview button
driver.find_element_by_id('imgBlkFront').click()
imageList = []

# Wait for the page to load
time.sleep(5)

while 'pointer' in driver.find_element_by_id('sitbReaderRightPageTurner').get_attribute('style'):
    # While the right arrow is available for clicking, turn through pages
    driver.find_element_by_id('sitbReaderRightPageTurner').click()
    time.sleep(2)
    # Get any new pages that have loaded (multiple pages can load at once,
    # but duplicates will not be added to a set)
    pages = driver.find_elements_by_xpath(
        '//div[@class=\'pageImage\']/div/img')
    if not len(pages):
        print('No pages found')
    for page in pages:
        image = page.get_attribute('src')
        print('Found image: {}'.format(image))
        if image not in imageList:
            urlretrieve(image, 'page.jpg')
            imageList.append(image)
            print(pytesseract.image_to_string(Image.open('page.jpg')))

driver.quit()
```

虽然这个脚本理论上可以在任何类型的Selenium webdriver上运行，但我发现它目前在Chrome上运行得最可靠。正如您以前使用Tesseract阅读器时所经历的那样，它打印了本书的许多长段落，大部分都很清晰，如第一章的预览所示

```
Chapter I
During an Interval In the Melvmskl trial In the large
building of the Law Courts the members and public
prosecutor met in [van Egorowch Shebek‘s private
room, where the conversation turned on the celebrated
Krasovski case. Fedor Vasillevich warmly maintained
that it was not subject to their jurisdiction, Ivan
Egorovich maintained the contrary, while Peter
ivanowch, not havmg entered into the discussmn at
the start, took no part in it but looked through the
Gazette which had Just been handed in.
“Gentlemen,” he said, “Ivan Ilych has died!"
```

然而，很多单词都有明显的错误，比如“Melvmsl”而不是“Melvinski”，“discussmn”而不是“discussion”。许多这类错误都可以通过根据字典上的单词列表进行猜测来纠正(也许还可以根据相关专有名词如“Melvinski”进行添加)。

偶尔一个错误可能跨越整个单词，如在文本的第3页:

```
it is he who is dead and not 1.
```

在这种情况下，单词“I”被字符“1”替换。“除了单词字典，马尔科夫链分析在这里可能很有用。如果文本的任何部分包含一个非常不常见的短语(“and not 1”)，那么可以假定文本实际上是更常见的短语(“and not I”)。

当然，这些字符替换遵循可预测的模式是有帮助的:vi变成w, I变成1。如果这些替换在您的文本中频繁发生，您可能会创建一个列表，用于尝试新单词和短语，选择最有意义的解决方案。一种方法可能是替换经常混淆的字符，并使用与字典中的单词匹配的解决方案，或者使用可识别(或最常见)的n-gram。如果您采用这种方法，请务必阅读第9章，以获得更多关于文本处理和自然语言处理的信息。虽然本例中的文本是一种常见的sans-serif字体，并且Tesseract应该能够相对轻松地识别它，但是有时进行一些再培训也有助于提高准确性。下一节将讨论另一种方法，使用少量的前期投资来解决文本混乱的问题。通过向Tesseract提供大量具有已知值的文本图像集合，可以教会Tesseract在未来以更高的精度和准确度识别相同的字体，即使文本中偶尔会出现背景和定位问题。

### Reading CAPTCHAs and Training Tesseract

尽管大多数人都熟悉CAPTCHA这个词，但是很少有人知道它代表什么:(Completely Automated Public Turing Test to Tell Computers and Humans Apart)完全自动化的公共图灵测试来告诉计算机和人类分开。它笨拙的首字母缩略词暗示了它在阻碍完全可用的web界面方面所扮演的相当笨拙的角色，因为人类和非人类机器人常常难以解决CAPTCHA测试。

具有讽刺意味的是，在过去的60年里，我们从使用这些测试来测试机器到使用它们来测试我们自己，结果好坏参半。谷歌最近关闭了他们臭名昭著的困难的reCAPTCHA，这在很大程度上是因为它倾向于屏蔽合法的网站用户。其他大多数验证码都比较简单。例如，Drupal是一个流行的基于php的内容管理系统，它有一个流行的CAPTCHA模块，可以生成不同难度的CAPTCHA图像。默认图像如图所示。

![](WebScraping13\1.bmp)

与其他验证码相比，是什么让这个验证码对人类和机器来说如此容易阅读?

- 字符之间不会重叠，也不会横向交叉到彼此的空间中。也就是说，可以在每个字符周围绘制一个整洁的矩形，而不重叠任何其他字符。
- 没有任何背景图像、线条或其他干扰OCR程序的垃圾。
- 从这张图中并不明显，但是在字体上有一些变化验证码使用。它在干净的无衬线字体之间交替使用(如字符中所示)“4”和“M”)以及手写字体(如字符“M”所示，“C”和“3”)。
- 白色的背景与深色的文字形成了强烈的对比。

不过，这个验证码确实抛出了一些曲线，这使得OCR程序阅读起来很有挑战性:

- 同时使用字母和数字，增加了潜在字符的数量。
- 字母的随机倾斜可能会让OCR软件感到困惑，但对人类来说仍然很容易阅读。
- 相对奇怪的手写字体带来了特殊的挑战，“C”和“3”多了几行，小写字母“m”也小得不寻常，需要额外的训练才能让电脑熟悉。

当您使用命令在此映像上运行Tesseract时

```
tesseract captchaExample.png output
```

你得到这个output.txt文件:

```
4N\,,,C<3
```

它得到了正确的4、C和3，但是它显然不能很快填满CAPTCHAprotected字段。

#### Training Tesseract

为了训练Tesseract识别文字，无论是晦涩难读的字体还是验证码，你需要给每个字符提供多个例子。这部分你可能会想要排一个好的播客或电影，因为这将是几个小时相当无聊的工作。第一步是将验证码的多个示例下载到一个目录中。编译的示例数量将取决于验证码的复杂性;我在CAPTCHA培训中使用了100个样本文件(总共500个字符，平均每个符号大约有8个示例)，这似乎非常有效。

我建议用它所代表的CAPTCHA解决方案(例如，4MmC3.jpg)来命名图像。我发现这有助于在大量文件之间进行快速的错误检查;您可以以缩略图的形式查看所有文件，并轻松地将图像与其图像名称进行比较。这也大大有助于后续步骤中的错误检查。

第二步是准确地告诉Tesseract每个字符是什么以及它在图像中的位置。这包括为每个CAPTCHA映像创建一个框文件。一个框文件是这样的:

```
4 15 26 33 55 0
M 38 13 67 45 0
m 79 15 101 26 0
C 111 33 136 60 0
3 147 17 176 45 0
```

第一个符号是所表示的字符，接下来的四个数字表示勾勒出图像的矩形框的坐标，最后一个数字是用于使用多页文档进行培训的页码(对于我们来说是0)。

显然，手工创建这些box文件并不有趣，但是各种工具可以帮助您解决这个问题。我喜欢在线工具`Tesseract OCR Chopper`，因为它不需要安装或额外的库，可以在任何有浏览器的机器上运行，而且相对容易使用。上传图片，如果需要额外的框，单击底部的Add按钮，如果需要，调整框的大小，并将新的.box文件文本复制粘贴到一个新文件中。

框文件必须以纯文本形式保存，扩展名为`. Box`。与图像文件一样，根据它们所代表的CAPTCHA解决方案(例如，4mmc .box)来命名框文件也很方便。同样，这使得根据文件名对`.box`文件文本的内容进行双重检查变得很容易，如果按照文件名对数据目录中的所有文件进行排序，则再次针对与之匹配的图像文件进行检查。同样，您需要创建大约100个这样的文件，以确保您拥有足够的数据。此外，Tesseract有时会因为不可读而丢弃文件，所以您可能希望在此之上有一些缓冲空间。如果你发现你的OCR结果不像你想的那么好，或者Tesseract被某些字符绊倒，这是一个很好的调试步骤，创建额外的训练数据，然后再试一次。

在创建一个充满.box文件和图像文件的数据文件夹之后，将该数据复制到备份文件夹中，然后再对其进行任何操作。尽管在数据上运行培训脚本不太可能删除任何内容，但是如果要在.box文件的创建中花费数小时的时间，那么这比后悔要安全得多。此外，能够删除一个充满已编译数据的杂乱目录，然后重试也是一件好事。

执行所有数据分析和创建Tesseract所需的培训文件需要六个步骤。有一些工具可以为您提供相应的源映像和.box文件，但遗憾的是，目前还没有针对Tesseract 3.02的工具。
我用Python编写了一个解决方案，它对一个包含图像和框文件的文件进行操作，并自动创建所有必要的培训文件。

这个程序的初始设置和步骤可以在类的`_init__`和`runAll`方法中看到:

```python
def __init__(self):
	languageName = 'eng'
	fontName = 'captchaFont'
	directory = '<path to images>'
def runAll(self):
	self.createFontFile()
	self.cleanImages()
	self.renameFiles()
	self.extractUnicode()
	self.runShapeClustering()
	self.runMfTraining()
	self.runCnTraining()
	self.createTessData()
```

这里只需要设置三个变量，它们非常简单:

- languageName

  Tesseract使用三个字母的语言代码来理解它所查看的语言。在大多数情况下，您可能希望使用英语的eng。

- fontName

  所选字体的名称。这可以是任何东西，但必须是一个没有空格的单词。

- directory

  包含所有映像和框文件的目录。我建议您将此路径设置为绝对路径，但如果使用相对路径，则需要将其设置为运行Python代码的位置的相对路径。如果它是绝对的，则可以在机器上的任何位置运行代码。

让我们看一下使用的各个函数。

`createFontFile`创建一个必要的文件，`font_properties`，让Tesseract知道您正在创建的新字体:

```
captchaFont 0 0 0 0 0
```

该文件由字体名称组成，后跟1和0，表示是否应该考虑斜体、粗体或其他版本的字体。(使用这些属性训练字体是一项有趣的练习，但不幸超出了本书的范围。)

`cleanImages` 创建所有找到的图像文件的高对比度版本，将它们转换为灰度，并执行其他操作，使OCR程序更容易读取图像文件。如果您正在处理CAPTCHA图像中的视觉垃圾，这些垃圾在后期处理中可能很容易过滤掉，那么可以在这里添加额外的处理。

`renameFiles` 用Tesseract要求的名称重命名所有.box文件及其对应的图像文件(这里的文件编号是连续的数字，以便将多个文件分开):

- `<languageName>.<fontName>.exp<fileNumber>.box`
- `<languageName>.<fontName>.exp<fileNumber>.tiff`

`extractUnicode`查看所有创建的`.box`文件，并确定要训练的可用字符的总数。生成的Unicode文件将告诉您找到了多少个不同的字符，这可能是快速查看是否遗漏了什么内容的好方法。

接下来的三个函数`runshapeclu`、`runMfTraining`和`runCtTraining`分别创建文件`shapetable`、`pfftable`和`normproto`。这些都提供了关于每个字符的几何形状和形状的信息，还提供了统计信息，Tesseract使用这些信息来计算给定字符是一种或另一种类型的概率。

最后，Tesseract对每个编译后的数据文件夹重新命名，以所需的语言名称作为前缀(例如，`shapetable`被重命名为`eng.shapetable`)，并将所有这些文件编译成最终的培训数据文件`eng.traineddata`。

这一小节我是真没看懂。。。代码也没跑通，放弃了

### Retrieving CAPTCHAs and Submitting Solutions

许多流行的内容管理系统经常被预先编程为具有这些用户注册页面的已知位置的机器人的注册发送垃圾邮件。例如，在`http://pythonscraping.com`网站上，即使是验证码(公认的弱验证码)也无法抑制注册的涌入。那么这些机器人是怎么做到的呢?我们已经成功地解决了硬盘上的图像验证码问题，但是我们如何才能制造出一个功能齐全的机器人呢?本节结合了前几章中介绍的许多技术。如果你还没有读过，你至少应该浏览一下第十章。

大多数基于图像的验证码有以下几个特性:

- 它们是由服务器端程序动态生成的图像。它们可能具有与传统图像不同的图像源，比如`<img src="WebForm.aspx? "id=8AP85CQKE9TJ">`，但可以像任何其他图像一样下载和操作。
- 图像的解决方案存储在服务器端数据库中。
- 如果你花了太长时间来解决验证码，很多验证码都会失效。这对于机器人来说通常不是问题，但是排队验证码解决方案供以后使用，或者其他可能会延迟验证码被请求到提交解决方案之间的时间的实践，可能不会成功。

实现此目的的一般方法是将CAPTCHA图像文件下载到您的硬盘驱动器，清除它，使用Tesseract解析图像，并在适当的表单参数下返回解决方案。

作者在`http://pythonscraping.com/humans-only`上创建了一个页面，其中只有`CAPTCHAprotected`注释表单，用于编写一个要击败的机器人。这个机器人使用命令行Tesseract库，而不是pytesseract包装器(尽管它也可以很容易地使用)，看起来像这样:

```python
from urllib.request import urlretrieve
from urllib.request import urlopen
from bs4 import BeautifulSoup
import subprocess
import requests
from PIL import Image
from PIL import ImageOps

def cleanImage(imagePath):
    image = Image.open(imagePath)
    image = image.point(lambda x: 0 if x<143 else 255)
    borderImage = ImageOps.expand(image,border=20,fill='white')
    borderImage.save(imagePath)

html = urlopen('http://www.pythonscraping.com/humans-only')
bs = BeautifulSoup(html, 'html.parser')
#Gather prepopulated form values
imageLocation = bs.find('img', {'title': 'Image CAPTCHA'})['src']
formBuildId = bs.find('input', {'name':'form_build_id'})['value']
captchaSid = bs.find('input', {'name':'captcha_sid'})['value']
captchaToken = bs.find('input', {'name':'captcha_token'})['value']

captchaUrl = 'http://pythonscraping.com'+imageLocation
urlretrieve(captchaUrl, 'captcha.jpg')
cleanImage('captcha.jpg')
p = subprocess.Popen(['tesseract', 'captcha.jpg', 'captcha'], stdout=
    subprocess.PIPE,stderr=subprocess.PIPE)
p.wait()
f = open('captcha.txt', 'r')

#Clean any whitespace characters
captchaResponse = f.read().replace(' ', '').replace('\n', '')
print('Captcha solution attempt: '+captchaResponse)

if len(captchaResponse) == 5:
    params = {'captcha_token':captchaToken, 'captcha_sid':captchaSid,   
              'form_id':'comment_node_page_form', 'form_build_id': formBuildId, 
              'captcha_response':captchaResponse, 'name':'Ryan Mitchell', 
              'subject': 'I come to seek the Grail', 
              'comment_body[und][0][value]': 
               '...and I am definitely not a bot'}
    r = requests.post('http://www.pythonscraping.com/comment/reply/10', 
                          data=params)
    responseObj = BeautifulSoup(r.text, 'html.parser')
    if responseObj.find('div', {'class':'messages'}) is not None:
        print(responseObj.find('div', {'class':'messages'}).get_text())
else:
    print('There was a problem reading the CAPTCHA correctly!')
```

输出为：

```
Captcha solution attempt: EM3;y楼
There was a problem reading the CAPTCHA correctly!
```

注意，这个脚本在两种情况下失败:如果Tesseract没有从图像中提取恰好五个字符(因为您知道这个CAPTCHA的所有有效解决方案都必须有五个字符)，或者它提交了表单，但是CAPTCHA被错误地解决了。第一种情况发生的概率大约为50%，此时它不需要提交表单，并且会出现错误消息。第二种情况发生的概率约为20%，总准确率约为30%(或遇到的每个字符的准确率约为80%，超过5个字符)。

尽管这看起来很低，但请记住，通常不限制用户尝试验证码的次数，而且大多数不正确的尝试都可以在不需要实际发送表单的情况下终止。当发送表单时，验证码在大多数情况下是准确的。如果这还不能使您信服，还请记住，简单的猜测将使您的准确率达到0.00001%。
运行一个程序三到四次而不是猜测9亿次是相当节省时间的检索!





