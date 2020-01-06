---
title: WebScraping-16
date: 2019-08-16 22:05:46
categories: Web-Scraping
tags: 
- Web-Scraping
- python
mathjax: true
---

网络爬行速度很快。至少，它通常比雇佣一打实习生手工从互联网上复制数据快得多!当然，技术的进步和享乐跑步机要求在某一时刻，即使是这样也“不够快”。“这就是人们开始关注分布式计算的时候。

<!--more-->

与大多数其他技术领域不同，web爬行通常不能仅仅通过“在问题上投入更多的周期”来改进。“运行一个进程非常快;运行两个进程的速度不一定是原来的两倍。运行三个进程可能会禁止您访问正在处理所有请求的远程服务器!

然而，在某些情况下，并行web爬行或运行并行线程/进程仍然是有益的:

- 从多个源(多个远程服务器)而不是单个源收集数据
- 对收集的数据执行长时间/复杂的操作(例如进行图像分析或OCR)，这些操作可以与获取数据并行完成
- 从为每个查询付费的大型web服务收集数据，或者在使用协议的范围内创建到服务的多个连接

### Processes versus Threads

Python同时支持多处理和多线程。多处理和多线程都实现了相同的最终目标:同时执行两个编程任务，而不是以更传统的线性方式运行程序。

在计算机科学中，在操作系统上运行的每个进程可以有多个线程。每个进程都有自己分配的内存，这意味着多个线程可以访问相同的内存，而多个进程不能而且必须显式地通信信息。
使用多线程编程在具有共享内存的单独线程中执行任务通常被认为比多进程编程更容易。但这种便利是有代价的。

Python的全局解释器锁(或GIL)的作用是防止线程同时执行同一行代码。GIL确保所有进程共享的公共内存不会被破坏(例如，内存中的字节一半用一个值写，一半用另一个值写)。这种锁定使编写多线程程序成为可能，并且知道在同一行中您将得到什么，但是它也有可能产生瓶颈。

### Multithreaded Crawling

Python 3.x使用`_thread`模块;不推荐使用`thread`程模块。

下面的例子说明了如何使用多个线程执行任务:

```python
import _thread
import time
def print_time(threadName, delay, iterations):
	start = int(time.time())
	for i in range(0,iterations):
		time.sleep(delay)
		seconds_elapsed = str(int(time.time()) - start)
		print ("{} {}".format(seconds_elapsed, threadName))
try:
	_thread.start_new_thread(print_time, ('Fizz', 3, 33))
	_thread.start_new_thread(print_time, ('Buzz', 5, 20))
	_thread.start_new_thread(print_time, ('Counter', 1, 100))
except:
	print ('Error: unable to start thread')
while 1:
	pass
```

这是对经典FizzBuzz编程测试的一个参考，输出有点冗长:

```
1 Counter
2 Counter
3 Fizz
3 Counter
4 Counter
5 Buzz
5 Counter
6 Fizz
6 Counter
7 Counter
...
15 Buzz
15 Fizz
15 Counter
...
```

脚本启动三个线程，一个线程每三秒打印“Fizz”，另一个线程每五秒打印“Buzz”，第三个线程每秒钟打印“Counter”。

启动线程后，主执行线程将执行while 1循环，该循环将保持程序(及其子线程)执行，直到用户按Ctrl-C停止执行。

其中，代码解释：`time.time()`读取当前时间，`time.sleep(1)`，延时1s再进行下一行代码，因此，会每隔1s中输出一个数字，依次为`1 2 3 4 5`，如果将第三行注释掉，因为处理过快，将输出`0 0 0 0 0`。

```python
start = int(time.time())
for i in range(0,5):
    time.sleep(1)
    now = str(int(time.time()) - start)
    print(now)
```

可以在线程中执行一个有用的任务，而不是打印嘶嘶声和嗡嗡声，例如爬行一个网站:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import random

import _thread
import time

visited = []
def getLinks(thread_name, bsObj):
    print('Getting links in {}'.format(thread_name))
    links = bsObj.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
    return [link for link in links if link not in visited]

def scrape_article(thread_name, path):
    visited.append(path)
    html = urlopen('http://en.wikipedia.org{}'.format(path))
    time.sleep(5)
    bsObj = BeautifulSoup(html, 'html.parser')
    title = bsObj.find('h1').get_text()
    print('Scraping {} in thread {}'.format(title, thread_name))
    links = getLinks(thread_name, bsObj)
    if len(links) > 0:
        newArticle = links[random.randint(0, len(links)-1)].attrs['href']
        print(newArticle)
        scrape_article(thread_name, newArticle)


try:
   _thread.start_new_thread(scrape_article, ('Thread 1', '/wiki/Kevin_Bacon',))
   _thread.start_new_thread(scrape_article, ('Thread 2', '/wiki/Monty_Python',))
except:
   print ('Error: unable to start threads')

while 1:
    pass
```

输出：

```
Scraping Monty Python in thread Thread 2
Getting links in Thread 2
/wiki/International_Standard_Name_Identifier
Scraping Kevin Bacon in thread Thread 1
Getting links in Thread 1
/wiki/Critics%27_Choice_Movie_Award_for_Best_Actor
Scraping International Standard Name Identifier in thread Thread 2
Getting links in Thread 2
/wiki/ISO_639-3
Scraping Critics' Choice Movie Award for Best Actor in thread Thread 1
Getting links in Thread 1
/wiki/Darkest_Hour_(film)
Scraping ISO 639-3 in thread Thread 2
Getting links in Thread 2
```

因为爬行Wikipedia的速度几乎是单线程爬行速度的两倍，所以包含`time.sleep(5)`这一行可以防止脚本在Wikipedia的服务器上增加太多的负载。实际上，当运行在请求数量不成问题的服务器上时，应该删除这一行。

如果您想稍微重写一下这个代码，以跟踪到目前为止线程已经共同看到的文章，这样就不会有文章被访问两次了，那该怎么办?您可以在多线程环境中使用列表，就像在单线程环境中使用列表一样:

```python
visited = []
def getLinks(thread_name, bsObj):
    print('Getting links in {}'.format(thread_name))
    links = bsObj.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
    return [link for link in links if link not in visited]

def scrape_article(thread_name, path):
    visited.append(path)
```

注意，您正在将路径附加到已访问路径列表中，作为`scrape_article`采取的第一个操作。这减少了，但并没有完全消除，它将被抓取两次的机会。

如果您运气不好，两个线程可能仍然在同一时刻偶然遇到相同的路径，两个线程都将看到它不在已访问列表中，然后两个线程都将随后将其添加到列表中并同时删除。然而，实际上，由于执行速度和Wikipedia包含的页面数量，这种情况不太可能发生。

这是竞态条件的一个例子。竞态条件调试起来很棘手，即使对于经验丰富的程序员也是如此，因此针对这些潜在的情况评估代码、估计其可能性并预测其影响的严重性是非常重要的。在这种特殊的竞争条件下，爬虫在同一页面上重复运行两次，可能不值得到处写。

#### Race Conditions and Queues

虽然您可以使用列表在线程之间进行通信，但是列表并不是专门为线程之间的通信而设计的，滥用列表很容易导致程序执行缓慢，甚至由于竞争条件而导致错误。列表非常适合添加或从列表中读取内容，但不适合在任意点删除项目，特别是从列表的开头删除项目。例如：`myList.pop(0)`，实际上需要Python重写整个列表，从而降低程序执行速度。

更危险的是，列表还可以方便地意外地在不线程安全的行中编写。例如：

```python
myList[len(myList)-1]
```

实际上，在多线程环境中可能不会得到列表中的最后一项，或者在另一个操作修改列表之前立即计算`len(myList)-1`的值时，它甚至可能引发异常。

有人可能会争辩说，前面的语句可以更“python化”地写成`myList[-1]`，当然，没有人曾经在虚弱的时候意外地编写了非python代码(尤其是Java开发人员回想起他们使用`myList[myList.length-1]`,长度是1)!但是，即使您的代码无可挑剔，也请考虑其他形式的非线程安全行，包括列表:

```python
my_list[i] = my_list[i] + 1
my_list.append(my_list[-1])
```

这两种情况都可能导致竞态条件，从而导致意想不到的结果。因此，让我们放弃列表，使用非列表变量将消息传递给线程!

```python
# Read the message in from the global list
my_message = global_message
# Write a message back
global_message = "I've retrieved the message"
# do something with my_message

```

这似乎很好，直到您意识到您可能无意中覆盖了来自另一个线程的另一条消息，即在第一行和第二行之间的那一瞬间，“我收到了您的消息”。“所以现在您只需要为每个线程构造一系列精心设计的个人消息对象，并使用一些逻辑来确定谁得到了什么……或者您可以使用为此目的构建的队列模块。

队列是类似列表的对象，可以使用先进先出(FIFO)方法或后进先出(LIFO)方法进行操作。队列通过队列接收来自任何线程的消息。`put('My message')`可以将消息传输到调用`queue.get()`的任何线程。队列的设计目的不是存储静态数据，而是以线程安全的方式传输它。从队列中检索后，它应该只存在于检索它的线程中。因此，它们通常用于委托任务或发送临时通知。

这在web爬行中非常有用。例如，假设您希望将scraper收集的数据持久化到数据库中，并且希望每个线程都能够快速地持久化它的数据。为所有线程提供一个共享连接可能会导致问题(单个连接不能并行处理请求)，但是为每个抓取线程提供自己的数据库连接没有任何意义。随着scraper的增长(您可能最终要在100个不同的线程中从100个不同的网站收集数据)，这可能会转化为大量的数据库连接，这些连接大部分是空闲的，在页面加载之后，它们只会偶尔执行一次写操作。

相反，您可以使用数量更少的数据库线程，每个线程都有自己的连接，可以从队列中取出项目并存储它们。这提供了一组更易于管理的数据库连接。

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import random
import _thread
from queue import Queue
import time
import pymysql


def storage(queue):
    conn = pymysql.connect(host='127.0.0.1', unix_socket='/tmp/mysql.sock', user='root', passwd='', db='mysql', charset='utf8')
    cur = conn.cursor()
    cur.execute('USE wiki_threads')
    while 1:
        if not queue.empty():
            article = queue.get()
            cur.execute('SELECT * FROM pages WHERE path = %s', (article["path"]))
            if cur.rowcount == 0:
                print("Storing article {}".format(article["title"]))
                cur.execute('INSERT INTO pages (title, path) VALUES (%s, %s)', (article["title"], article["path"]))
                conn.commit()
            else:
                print("Article already exists: {}".format(article['title']))

visited = []
def getLinks(thread_name, bsObj):
    print('Getting links in {}'.format(thread_name))
    links = bsObj.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
    return [link for link in links if link not in visited]

def scrape_article(thread_name, path, queue):
    visited.append(path)
    html = urlopen('http://en.wikipedia.org{}'.format(path))
    time.sleep(5)
    bsObj = BeautifulSoup(html, 'html.parser')
    title = bsObj.find('h1').get_text()
    print('Added {} for storage in thread {}'.format(title, thread_name))
    queue.put({"title":title, "path":path})
    links = getLinks(thread_name, bsObj)
    if len(links) > 0:
        newArticle = links[random.randint(0, len(links)-1)].attrs['href']
        scrape_article(thread_name, newArticle, queue)

queue = Queue()
try:
   _thread.start_new_thread(scrape_article, ('Thread 1', '/wiki/Kevin_Bacon', queue,))
   _thread.start_new_thread(scrape_article, ('Thread 2', '/wiki/Monty_Python', queue,))
   _thread.start_new_thread(storage, (queue,))
except:
   print ('Error: unable to start threads')

while 1:
    pass

```

这个脚本创建了三个线程:两个线程从Wikipedia中随机抓取页面，第三个线程将收集到的数据存储在MySQL数据库中。有关MySQL和数据存储的更多信息，请参见第6章。

#### The threading Module

Python `_thread`模块是一个相当底层的模块，它允许您对线程进行微管理，但是没有提供很多高级函数来简化工作。`threading `模块是一个高级接口，它允许您干净地使用线程，同时仍然公开底层_thread的所有特性。

例如，您可以使用enumerate等静态函数来获得通过线程模块初始化的所有活动线程的列表，而不需要自己跟踪它们。activeCount函数同样提供线程总数。_thread中的许多函数都被赋予了更方便或更容易记住的名称，比如currentThread而不是get_ident来获取当前线程的名称。

```python
import threading
import time

def print_time(threadName, delay, iterations):
    start = int(time.time())
    for i in range(0,iterations):
        time.sleep(delay)
        seconds_elapsed = str(int(time.time()) - start)
        print ('{} {}'.format(seconds_elapsed, threadName))

t = threading.Thread(target=print_time, args=('Fizz', 3, 33)).start()
t = threading.Thread(target=print_time, args=('Buzz', 5, 20)).start()
t = threading.Thread(target=print_time, args=('Counter', 1, 100)).start()

```

它生成与前面简单`_thread`示例相同的“FizzBuzz”输出。

线程模块的优点之一是易于创建其他线程不可用的本地线程数据。如果您有多个线程，每个线程都抓取不同的网站，并且每个线程都跟踪自己的本地访问页面列表，那么这可能是一个很好的特性。

这个本地数据可以通过调用`thread .local()`在thread函数的任何位置创建:

```python
import threading
def crawler(url):
	data = threading.local()
	data.visited = []
	# Crawl site
threading.Thread(target=crawler, args=('http://brookings.edu')).start()

```

这解决了线程中共享对象之间发生竞争条件的问题。当一个对象不需要被共享时，它不应该被共享，而应该保存在本地线程内存中。为了在线程之间安全地共享对象，仍然可以使用上一节中的队列。	

通常情况下，爬行器的设计运行时间很长。isAlive方法可以确保，如果线程崩溃，它会重新启动:

```python
threading.Thread(target=crawler)
t.start()
while True:
	time.sleep(1)
	if not t.isAlive():
		t = threading.Thread(target=crawler)
		t.start()

```

可以通过扩展线程添加其他监视方法。`threading.Thread`对象:

```python
import threading
import time

class Crawler(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.done = False

    def isDone(self):
        print("exe isDone")
        return self.done

    def run(self):
        print("exe run")
        time.sleep(5)
        self.done = True
        raise Exception('Something bad happened!')

tim = int(time.time())
t = Crawler()
t.start()

while True:
    print("loop------")
    now = str(int(time.time())-tim)
    print(now)
    time.sleep(1)
    if t.isDone():
        print('Done')
        break
    if not t.isAlive():
        t = Crawler()
        t.start()



```

这是我加入调试输出的，因此输出如下：

```
exe run
loop------
0
exe isDone
loop------
1
exe isDone
loop------
2
exe isDone
loop------
3
exe isDone
loop------
4
exe isDone
Done
Exception in thread Thread-1:
Traceback (most recent call last):
  File "D:\Anaconda3\lib\threading.py", line 917, in _bootstrap_inner
    self.run()
  File "threading_crawler.py", line 17, in run
    raise Exception('Something bad happened!')
Exception: Something bad happened!

```



这个新的爬虫类包含一个`isDone`方法，可以用来检查爬虫程序是否完成了爬行。如果需要完成一些额外的日志记录方法，使线程无法关闭，但是爬行工作的大部分已经完成，那么这可能是有用的。通常，`isDone`可以替换为某种状态或进度度量——例如，记录了多少页面，或者当前页面。

`Crawler.run`所引发的任何异常都会导致类被重新启动，直到`isDone`为真且程序退出为止。

扩展`threading.Thread`在您的爬虫类可以提高他们的健壮性和灵活性，以及您的能力，以监测任何属性的许多爬虫一次。

### Multiprocess Crawling

Python`Processing`处理模块创建了可以从主进程启动和连接的新进程对象。下面的代码使用了线程进程一节中的FizzBuzz示例来演示。

```python
from multiprocessing import Process
import time
from multiprocessing import freeze_support



def print_time(threadName, delay, iterations):
    start = int(time.time())
    for i in range(0,iterations):
        time.sleep(delay)
        seconds_elapsed = str(int(time.time()) - start)
        print (threadName if threadName else seconds_elapsed)


processes = []
processes.append(Process(target=print_time, args=(None, 1, 100)))
processes.append(Process(target=print_time, args=("Fizz", 3, 33)))
processes.append(Process(target=print_time, args=("Buzz", 5, 20)))

if __name__ == '__main__':
    freeze_support()

    for p in processes:
        p.start()

    for p in processes:
        p.join()
    
print("Program complete")

```

请记住，每个进程都被操作系统。如果您通过OS的活动监视器或任务管理器查看流程，您应该会看到这一点，如图16-1所示

![](WebScraping16\1.png)

#### Multiprocess Crawling

多线程Wikipedia爬行示例可以修改为使用单独的进程，而不是单独的线程:

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import random

from multiprocessing import Process, Queue
import os
import time
import Thread

def getLinks(bsObj, queue):
    print('Getting links in {}'.format(os.getpid()))
    links = bsObj.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
    return [link for link in links if link not in queue.get()]

def scrape_article(path, queue):
    queue.get().append()
    print("Process {} list is now: {}".format(os.getpid(), visited))
    html = urlopen('http://en.wikipedia.org{}'.format(path))
    time.sleep(5)
    bsObj = BeautifulSoup(html, 'html.parser')
    title = bsObj.find('h1').get_text()
    print('Scraping {} in process {}'.format(title, os.getpid()))
    links = getLinks(bsObj)
    if len(links) > 0:
        newArticle = links[random.randint(0, len(links)-1)].attrs['href']
        print(newArticle)
        scrape_article(newArticle)

processes = []
queue = Queue()
processes.append(Process(target=scrape_article, args=('/wiki/Kevin_Bacon', queue,)))
processes.append(Process(target=scrape_article, args=('/wiki/Monty_Python', queue,)))

for p in processes:
    p.start()


```

同样，通过包含`time.sleep(5)`，您可以人为地减慢scraper的进程，这样就可以在不给Wikipedia的服务器增加不合理的高负载的情况下使用它。
在这里，您将用`os.getpid()`替换用户定义的`thread_name`(作为参数传递)，它不需要作为参数传递，并且可以在任何时候访问。

```
Scraping Kevin Bacon in process 84275
Getting links in 84275
/wiki/Philadelphia
Scraping Monty Python in process 84276
Getting links in 84276
/wiki/BBC
Scraping BBC in process 84276
Getting links in 84276
/wiki/Television_Centre,_Newcastle_upon_Tyne
Scraping Philadelphia in process 84275

```

从理论上讲，在单独的进程中爬行比在单独的线程中爬行稍微快一些，主要有两个原因:

- 进程不受GIL的锁定限制，可以执行相同的代码行并同时修改相同的对象(实际上是相同对象的单独实例化)。
- 进程可以运行在多个CPU内核上，如果每个进程或线程都是处理器密集型的，那么这可能会提供速度优势。

然而，这些优势伴随着一个主要的缺点。在前面的程序中，所有找到的url都存储在一个全局访问列表中。当您使用多个线程时，此列表在所有线程之间共享;在没有罕见竞争条件的情况下，一个线程不能访问已经被另一个线程访问过的页面。但是，每个进程现在都有自己独立的已访问列表版本，并且可以自由访问其他进程已经访问过的页面。

#### Communicating Between Processes

进程在它们自己的独立内存中运行，如果希望它们共享信息，这可能会导致问题。

修改前一个例子，打印当前输出的访问列表，你可以看到这个原则的行动:

```python
def scrape_article(path):
	visited.append(path)
	print("Process {} list is now: {}".format(os.getpid(), visited))

```

这将导致如下输出:

```
Process 84552 list is now: ['/wiki/Kevin_Bacon']
Process 84553 list is now: ['/wiki/Monty_Python']
Scraping Kevin Bacon in process 84552
Getting links in 84552
/wiki/Desert_Storm
Process 84552 list is now: ['/wiki/Kevin_Bacon', '/wiki/Desert_Storm']
Scraping Monty Python in process 84553
Getting links in 84553
/wiki/David_Jason
Process 84553 list is now: ['/wiki/Monty_Python', '/wiki/David_Jason']

```

但是有一种方法可以通过两种类型的Python对象(队列和管道)在同一台机器上的进程之间共享信息。队列类似于前面看到的线程队列。信息可以由一个进程放入其中，然后由另一个进程删除。删除此信息后，它将从队列中删除。因为队列被设计为“临时数据传输”，它们不太适合保存静态引用，如“已访问的网页列表”。

但是，如果这个静态的web页面列表被某种类型的抓取委托器所替代呢?刮刀可以弹出一个任务队列的形式从一个路径刮(例如,/ wiki / Monty_Python)作为回报,添加一个列表,发现url回到一个单独的队列处理刮的全权代表,因此只有新url添加到第一个任务队列。

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import random
from multiprocessing import Process, Queue
import os
import time


def task_delegator(taskQueue, foundUrlsQueue):
    #Initialize with a task for each process
    visited = ['/wiki/Kevin_Bacon', '/wiki/Monty_Python']
    taskQueue.put('/wiki/Kevin_Bacon')
    taskQueue.put('/wiki/Monty_Python')

    while 1:
        #Check to see if there are new links in the foundUrlsQueue for processing
        if not foundUrlsQueue.empty():
            links = [link for link in foundUrlsQueue.get() if link not in visited]
            for link in links:
                #Add new link to the taskQueue
                taskQueue.put(link)
                #Add new link to the visited list
                visited.append(link)

def get_links(bsObj):
    links = bsObj.find('div', {'id':'bodyContent'}).find_all('a', href=re.compile('^(/wiki/)((?!:).)*$'))
    return [link.attrs['href'] for link in links]

def scrape_article(taskQueue, foundUrlsQueue):
    while 1:
        while taskQueue.empty():
            #Sleep 100 ms while waiting for the task queue 
            #This should be rare
            time.sleep(.1)
        path = taskQueue.get()
        html = urlopen('http://en.wikipedia.org{}'.format(path))
        time.sleep(5)
        bsObj = BeautifulSoup(html, 'html.parser')
        title = bsObj.find('h1').get_text()
        print('Scraping {} in process {}'.format(title, os.getpid()))
        links = get_links(bsObj)
        #Send these to the delegator for processing
        foundUrlsQueue.put(links)


processes = []
taskQueue = Queue()
foundUrlsQueue = Queue()
processes.append(Process(target=task_delegator, args=(taskQueue, foundUrlsQueue,)))
processes.append(Process(target=scrape_article, args=(taskQueue, foundUrlsQueue,)))
processes.append(Process(target=scrape_article, args=(taskQueue, foundUrlsQueue,)))

for p in processes:
    p.start()


```

此爬虫与最初制造的铲运机在结构上存在一些差异。不是每个进程或线程从它们被分配的起点开始按照自己的随机游走，而是一起对网站进行完整的覆盖爬行。每个进程都可以从队列中提取任何“任务”，而不仅仅是它们自己找到的链接。

### Multiprocess Crawling—Another Approach

所有讨论的多线程和进程爬行的方法都假定您需要对子线程和进程进行某种“父级指导”。
您可以同时启动它们，也可以同时结束它们，还可以在它们之间发送消息或共享内存。

但是，如果您的爬虫的设计方式是不需要指导或通信的呢?也许没有什么理由开始疯狂`
import _thread`。

例如，假设您想并行爬行两个类似的网站。您已经编写了一个爬行器，它可以爬行这两个网站中的任何一个，由一个小的配置更改或命令行参数决定。你完全没有理由不能简单地做以下事情:

```
$ python my_crawler.py website1
$ python my_crawler.py website2

```

瞧，您刚刚启动了一个多进程web爬虫程序，同时节省了您的CPU维护要引导的父进程的开销!

当然，这种方法也有缺点。如果您想以这种方式在同一个网站上运行两个web爬虫程序，您需要某种方法来确保它们不会意外地开始抓取相同的页面。解决方案可能是创建一个URL规则(“爬虫1抓取博客页面，爬虫2抓取产品页面”)或以某种方式分割站点。

或者，您可以通过某种中间数据库来处理这种协调。在进入一个新的链接之前，爬虫程序可能会向数据库发出一个请求，询问这个页面是否已被爬行?爬虫程序使用数据库作为进程间通信系统。当然，如果没有仔细考虑，如果数据库连接很慢，这种方法可能会导致竞争条件或延迟(只有在连接到远程数据库时才可能出现问题)。

您可能还会发现，这种方法的可伸缩性不太好。使用Process模块可以动态地增加或减少爬行站点的进程数量，甚至可以存储数据。手动启动它们需要一个人亲自运行脚本或一个单独的管理脚本(无论是bash脚本、cron作业还是其他东西)来完成此任务。
然而，这是我过去成功地使用过的一种方法。对于小型的one - off项目，它是快速获取大量信息的好方法，尤其是跨多个网站。