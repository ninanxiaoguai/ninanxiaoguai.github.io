---
title: AR-MOEA
date: 2019-03-21 21:13:09
categories: indicator-based
tags: 
- MOEA
- indicator
mathjax: true
---

最近想要复现一个关于indicator-based的多目标优化算法，因此，选了一个容易入手的AR-MOEA算法，此算法，是由安徽大学的田野老师在2018年提出，选用的indicator是IGD。

An Indicator-Based Multiobjective Evolutionary Algorithm With Reference Point Adaptation for Better Versatility

*Ye Tian, Ran Cheng, Xingyi Zhang, Fan Cheng, and Yaochu Jin, Fellow, IEEE*

*<!--more-->*

### 算法规定

定义：无贡献解
$$
\nexists y \in Y \ satisfying \ dis(y,x') = \min_{x \in X} dis(y,x)
$$
其中，距离为欧式距离。例子如下图：

![](armoea\1.png)

适应度为：
$$
IGD-NS(X,Y) = \sum_{y \in Y} \min_{x \in X} dis(y,x) + \sum_{x \in X^*} \min_{y \in Y} dis(y,x')
$$
符号规定：

- the population **P** contains the candidate solutions as final output
- the initial reference point set **R** is used to guarantee uniform distribution of the candidate solutions in **P**
- the archive **A** reflects the Pareto front and guides the reference point adaptation
- the adapted reference point set **R‘** is used in the **IGD-NS**-based selection for truncating the population **P**

具体关系如下图：

![](armoea\2.png)

### 算法伪代码

![](armoea\3.png)

**MatingSelection(P,R')：** 

个体 p 的适应度，定义为：
$$
fitness_p = IGD-NS(P \backslash \{p\},R' )
$$


![](armoea\4.png)

![](armoea\5.png)



### 细节图示

以下为我的个人想法与心得：声明此代码借鉴PlatEMO中的算法

主函数以下为例

```matlab
N = 100;                        % 种群个数
D = 10;                         % 变量个数
M = 3;                          % 目标个数
name = 'DTLZ3';                 % 测试函数选择，目前只有：DTLZ1、DTLZ2、DTLZ3
[res,Population,PF] = funfun(); % 生成初始种群与目标值
REF = UniformPoint(N,M);        % 生成一致性参考解
[Archive,RefPoint,Range] = UpdateRefPoint(res,REF,[]);
PD_v = [];
for i = 1:400
    MatingPool = MatingSelection(Population,RefPoint,Range);  %已修改
    Offspring  = GA(Population(MatingPool,:));                %已修改
    Offspring_objs = CalObj(Offspring);
    [Archive,RefPoint,Range] = UpdateRefPoint([Archive;Offspring_objs([all(PopCon<=0,2)],:)],REF,Range);
    [Population,Range]       = EnvironmentalSelection([Population;Offspring],RefPoint,Range,N);
end
hold on
plot3(PF(:,1),PF(:,2),PF(:,3),'g*')
```

`UniformPoint.m` 此函数是产生一致性点，当参数如上图所示，那么，这些一致性点在目标空间中，分布如下：

![](armoea\6.png)

`UpdateRefPoint.m`，此算法就是根据目前的Archive，Poupulation和Reference points生成新的Archive与Reference points。

先要介绍一下`AdjustLocation.m`

图为此时刻下的调整之前的Reference Points：两个图是同一状态，只是视角不同

![](armoea\7.png)

![](armoea\8.png)

再加上蓝色的点，即为当前种群：

![](armoea\9.png)

红色的点即为调整之后的Reference Points：

![](armoea\10.png)

这么看可能会发现不了什么规律，其实根据公式也可以知道，如果开始时对所有点进行归一化，那么由原点连接每一个黑色的点，对应的调整后的点必定在这条射线上。就像算盘上的珠子一样，滑到与所有蓝色的点(当前种群)中与到射线最短的距离所对应的投影点上，也就是原论文中的$p \leftarrow argmin_{p \in P}||F(P)||sin(\vec{z^\*r},F(p))$，如下图：

(黄线穿过：原点-黑点-红点 )

![](armoea\11.png)

只画出部分射线：

![](armoea\12.png)

`AdjustLocation`解释完了，就容易理解`RefPointAdaption.m`了

注意一点，在`RefPointAdaption.m`中的Reference Points是一致性点，所以，应该是这样的：

![](armoea\13.png)

- 先对当前解、Reference点进行归一化，简单地说就是为了让射线从原点出发。
- 把ReferencePoint根据当前种群**Archive**进行调整，也就是上图的黑点变红点。
- 更新 Archive：
  - 删除重复和受支配的解(因为又添加了交叉变异的个体)
  - 滑动每一个Reference point到Archive中离它最近的的个体周围(映射点)，并且把这些新的个体称为 $A^{con}$，这样可以使得大多数个体多多少少周围都有几个Reference point，当然有的个体可能周围一个都没有。
  - 如果个数不够就要从剩下的Archive中来凑，找在离newAchieve夹角最小中所有最大的那个$argmax_{p \in A \backslash A'} \min_{q \in A'} arccos(F(p),F(q))$。我猜测是为了增大多样性。
- 更新Reference Points：
  - 根据之前找到的$A^{con}$ ，把离这些$A^{con}$ 中最近的Reference Point(调整后的)，作为newReferencePoint。
  - 如果个数不够就要从新产生的的newArchive中来凑。
  - 把newReferencePoint根据当前种群**Population**进行调整。

结果如下：

![](armoea\14.png)

![](armoea\15.png)

**蓝色**为一致性点

**绿色**为真实PF

**红色**为AR-MOEA算法结果

### 算法分析

![](armoea\7.png)

首先，它是用了IGD-indicator来计算每一个个体的适应度。其次，选用了Archive与ReferencePoint来一起维护收敛与一致性。期间只要有靠近新的ReferencePoint，就有很大的概率被留下来，R'也会不断的接近R，其中在那个平面的点，说明此参考点周围已经子代存在，而呈拱形的点便是从A'\A中选择出来的，随着种群进化过程，平面上的点会逐渐变多，拱形上的点逐渐减少，最后便会得出均匀且收敛性较好的解集。