---
title: vscode配置c环境
date: 2018-12-22 20:52:07
categories: vscode
tags: 
- vscode
- 教程
mathjax: false
description:
---
在sublime和vscode的权衡下，选择了vscode，毕竟之前一直用的是sublime，想换一换了。于是就遇到一个老问题，配环境！

<!--more-->

此内容几乎完全来自于[某乎](https://www.zhihu.com/question/30315894) 

### 安装

- [vscode](https://code.visualstudio.com/)

- [LLVM](http://releases.llvm.org/download.html)

  选`Pre-Built Binaries`中的`Clang for Windows (64-bit)`，**不需要下.sig文件**

  添加环境变量：`Add LLVM to the system PATH for all users`

  安装路径推荐：`C:\LLVM`

  工具链：MinGW

  其他默认

- [MinGW-w64 - for 32 and 64 bit Windows](https://sourceforge.net/projects/mingw-w64/)

   [链接](https://pan.baidu.com/s/1V59NSNc3UbdCxvzus_vStQ )，提取码：`dclo`

下好后，把`x86_64-7.2.0-posix-seh-rt_v5-rev0.7z\mingw64` 中所有的文件都复制到 `C:\LLVM`中
 检验：打开cmd 输入`gcc`，如果为`no input files`而不是其他，即为成功。
   ​	                     输入`clang`，如果为`no input files`而不是其他，即为成功。
   ​	        

### 插件

一定要下：
- C/C++
- C/C++ Clang Command Adapter
- Code Runner

自由推荐：
- Bracket Pair Colorizer：彩虹花括号
- Include Autocomplete：提供头文件名字的补全
- One Dark Pro：VS Code安装量最高的主题

### 环境配置
打开vscode，一定要选 `open folder` 选择刚才那个文件夹，点VS Code上的新建文件夹，名称为`.vscode`（这样做的原因是Windows的Explorer不允许创建的文件夹第一个字符是点），然后创建 `launch.json`，`tasks.json`，`settings.json`，`c_cpp_properties.json`放到`.vscode`文件夹下

`launch.json`:
```
// https://github.com/Microsoft/vscode-cpptools/blob/master/launch.md
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Launch", // 配置名称，将会在启动配置的下拉菜单中显示
            "type": "cppdbg", // 配置类型，这里只能为cppdbg
            "request": "launch", // 请求配置类型，可以为launch（启动）或attach（附加）
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe", // 将要进行调试的程序的路径
            "args": [], // 程序调试时传递给程序的命令行参数，一般设为空即可
            "stopAtEntry": false, // 设为true时程序将暂停在程序入口处，我一般设置为true
            "cwd": "${workspaceFolder}", // 调试程序时的工作目录
            "environment": [], // （环境变量？）
            "externalConsole": true, // 调试时是否显示控制台窗口，一般设置为true显示控制台
            "internalConsoleOptions": "neverOpen", // 如果不设为neverOpen，调试时会跳到“调试控制台”选项卡，你应该不需要对gdb手动输命令吧？
            "MIMode": "gdb", // 指定连接的调试器，可以为gdb或lldb。但目前lldb在windows下没有预编译好的版本。
            "miDebuggerPath": "gdb.exe", // 调试器路径，Windows下后缀不能省略，Linux下则去掉
            "setupCommands": [ // 用处未知，模板如此
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": false
                }
            ],
            "preLaunchTask": "Compile" // 调试会话开始前执行的任务，一般为编译程序。与tasks.json的label相对应
        }
    ]
}
```



`tasks.json`:
命令行参数方面，-std根据自己的需要修改。
如果使用Clang编写C语言，把command的值改成clang。
如果使用MinGW，编译C用gcc，编译c++用g++，并把-target和-fcolor那两条删去。

```
// https://code.visualstudio.com/docs/editor/tasks
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Compile", // 任务名称，与launch.json的preLaunchTask相对应
            "command": "clang++", // 要使用的编译器
            "args": [
                "${file}",
                "-o", // 指定输出文件名，不加该参数则默认输出a.exe，Linux下默认a.out
                "${fileDirname}/${fileBasenameNoExtension}.exe",
                "-g", // 生成和调试有关的信息
                "-Wall", // 开启额外警告
                "-static-libgcc", // 静态链接
                "-fcolor-diagnostics", // 彩色的错误信息？但貌似clang默认开启而gcc不接受此参数
                "--target=x86_64-w64-mingw", // clang的默认target为msvc，不加这一条就会找不到头文件；Linux下去掉这一条
                "-std=c++17" // C语言最新标准为c11，或根据自己的需要进行修改
            ], // 编译命令参数
            "type": "shell", // 可以为shell或process，前者相当于先打开shell再输入命令，后者是直接运行命令
            "group": {
                "kind": "build",
                "isDefault": true // 设为false可做到一个tasks.json配置多个编译指令，需要自己修改本文件，我这里不多提
            },
            "presentation": {
                "echo": true,
                "reveal": "always", // 在“终端”中显示编译信息的策略，可以为always，silent，never。具体参见VSC的文档
                "focus": false, // 设为true后可以使执行task时焦点聚集在终端，但对编译c和c++来说，设为true没有意义
                "panel": "shared" // 不同的文件的编译信息共享一个终端面板
            }
            // "problemMatcher":"$gcc" // 如果你不使用clang，去掉前面的注释符，并在上一条之后加个逗号。照着我的教程做的不需要改（也可以把这行删去)
        }
    ]
}
```



`settings.json`:

Code Runner的命令行和某些选项可以根据自己的需要在此处修改，用法还是参见此扩展的文档和百度gcc使用教程。如果你要使用其他地方的头文件和库文件，可能要往clang.cflags和clang.cxxflags里加-I和-L，用法百度gcc使用教程。
```
{
    "files.defaultLanguage": "cpp", // ctrl+N新建文件后默认的语言
    "editor.formatOnType": true, // 输入时就进行格式化，默认触发字符较少，分号可以触发
    "editor.snippetSuggestions": "top", // snippets代码优先显示补全

    "code-runner.runInTerminal": true, // 设置成false会在“输出”中输出，无法输入
    "code-runner.executorMap": {
        "c": "cd $dir && clang $fileName -o $fileNameWithoutExt.exe -Wall -g -Og -static-libgcc -fcolor-diagnostics --target=x86_64-w64-mingw -std=c11 && $dir$fileNameWithoutExt",
        "cpp": "cd $dir && clang++ $fileName -o $fileNameWithoutExt.exe -Wall -g -Og -static-libgcc -fcolor-diagnostics --target=x86_64-w64-mingw -std=c++17 && $dir$fileNameWithoutExt"
    }, // 设置code runner的命令行
    "code-runner.saveFileBeforeRun": true, // run code前保存
    "code-runner.preserveFocus": true, // 若为false，run code后光标会聚焦到终端上。如果需要频繁输入数据可设为false
    "code-runner.clearPreviousOutput": false, // 每次run code前清空属于code runner的终端消息

    "C_Cpp.clang_format_sortIncludes": true, // 格式化时调整include的顺序（按字母排序）
    "C_Cpp.intelliSenseEngine": "Default", // 可以为Default或Tag Parser，后者较老，功能较简单。具体差别参考cpptools扩展文档
    "C_Cpp.errorSquiggles": "Disabled", // 因为有clang的lint，所以关掉
    "C_Cpp.autocomplete": "Disabled", // 因为有clang的补全，所以关掉

    "clang.cflags": [ // 控制c语言静态检测的参数
        "--target=x86_64-w64-mingw",
        "-std=c11",
        "-Wall"
    ],
    "clang.cxxflags": [ // 控制c++静态检测时的参数
        "--target=x86_64-w64-mingw",
        "-std=c++17",
        "-Wall"
    ],
    "clang.completion.enable":true // 效果效果比cpptools要好
}
```



`c_cpp_properties.json`:

```
{
    "configurations": [
        {
            "name": "MinGW",
            "intelliSenseMode": "clang-x64",
            "compilerPath": "C:/LLVM/bin/gcc.exe",
            "includePath": [
                "${workspaceFolder}"
            ],
            "defines": [],
            "browse": {
                "path": [
                    "${workspaceFolder}"
                ],
                "limitSymbolsToIncludedHeaders": true,
                "databaseFilename": ""
            },
            "cStandard": "c11",
            "cppStandard": "c++17"
        }
    ],
    "version": 4
}
```



### 编译技巧

- ctrl+shift+B单纯编译
- 按F5为运行并调试（运行前会自动编译）
- 加断点在列号前面点一下就行，如果想从一开始就停下来，可以加在main函数那里，或者`launch.json`中设置`"stopAtEntry": true`。
- 按f11可以一步一步进行，箭头所指的那行代码就是下一步要运行的代码。
- 左边有个调试栏，可以看到变量的值,自动栏没有的可以手动添加表达式
- 把鼠标放到变量上可以看到变量的值，但是只能识别简单的表达式
- 栈帧对于递归很有用；在某些时候还可以抓取“异常”。
- 如果你不需要调试，可以直接右键选run code。
- 输出端可以输入，在`settings.json`中添加`"code-runner.runInTerminal": true`

