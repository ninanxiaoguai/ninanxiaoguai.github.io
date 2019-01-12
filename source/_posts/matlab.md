---
title: matlab
date: 2019-01-02 23:44:47
categories: matlab
tags: 
- 教程
- matlab
mathjax: false
description:
---

此文会持续更新，记录一些在matlab中的一些常用函数。

<!--more-->

### repmat
```matlab
>> a = [1 2 3];
>> repmat(a,2,3) %把矩阵整体堆叠成新矩阵
ans =

     1     2     3     1     2     3     1     2     3
     1     2     3     1     2     3     1     2     3
```

### sort

```matlab
>> a = [6 3 2 1 4 5];
>> [~,ans] = sort(a) % 默认从小到大的索引值
ans =

     4     3     2     5     6     1
>> a(ans)

ans =

     1     2     3     4     5     6
```

### 尺寸扩展

```matlab
>> a = ones(3);
>> a(1,(4:5)) = 10

a =

     1     1     1    10    10
     1     1     1     0     0
     1     1     1     0     0
```