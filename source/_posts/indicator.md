---
title: 毕设
date: 2019-01-12 19:16:55
categories: indicators
tags: 
- indicators
- MOEA
mathjax: true
description:
---

放假回家了也要准备准备我的毕业设计，题目是《基于自适应的indicators的多目标优化算法》，如题古老的多目标优化的题目，首先当然是要先了解了解indicators，老师就把他最近写好的关于indicators的综述发给了我，真可谓综述啊！足足100个indicators，路漫漫。。。。。

<!--more-->

### 概念介绍

以下是解与解、集合与集合之间的关系：

![](indicator\1.png)

把解与解的总结到表格里：

![](indicator\relation.png)

![](indicator\2.png)

一般来说，解集的质量可以解释为它如何很好地表示帕累托前沿，可以分为四个方面:收敛性(convergence)、扩散性(spread)、一致性(uniformity)和基数性(cardinality)。

解集的收敛性(convergence)是指解集与帕累托前缘的距离。解集的扩展考虑集覆盖的区域。它涉及到集合的外部和内部部分。这不同于只考虑集合的边界的质量的广泛性(extensity)。注意，在存在问题帕累托前沿的情况下，解集的扩展也称为集的覆盖(coverage)。集的均匀性(uniformity)是指解分布在集中的均匀程度;解决方案之间的等距间距是所希望的。传播和均匀性是密切相关的,他们共同被称为一组的多样性(diversity)。解集的基数(cardinality)是指解决方案集的数量。总的来说,我们的期望足够的解决方案明确地描述集,但不是太多,可能会损害DM与选择。然而，如果使用相同数量的计算资源生成两个集，则认为具有更多解决方案的集是首选的。

比较解决方案集的质量的一种直接方法是将这些集可视化，并直观地判断一个集相对于另一个集的优越性。这种目视比较是最常用的方法之一，非常适用于双目标拖把或三目标拖把。当目标个数大于3时，解决方案集的直接观察不可用时(散点图),人们可能会求助于从数据分析领域的工具。然而，这些可视化方法可能无法清晰地反映解决方案集质量的所有方面;例如，常用的平行坐标只能部分反映收敛性、扩散性和均匀性。此外，可视化比较不能量化解决方案集之间的差异，因此不能用于指导最优化。

质量指标(Quality indicators, QIs)通过将解决方案集映射为实数来克服可视化比较的问题，从而提供解决方案集之间的数量差异。QIs能够提供解决方案集质量的精确表述，例如，在这些表述中，一个集的质量优于另一个集，以及一个集在某些方面比另一个集好多少。原则上，将一组向量映射成标量值的任何函数都可以看作是一个潜在的质量指示器，但通常它可能需要反映集合质量的一个或多个方面:收敛性、扩展性、一致性和基数性。注意，当比较由精确方法生成的解集时，由于生成的解集是问题的帕累托前沿的子集，所以不考虑解集的收敛性评价。

本节根据Qls主要捕获的质量方面来审查Qls。一般来说，QIs可分为六类:1)QIs用于收敛，2)QIs用于扩展，3)QIs用于均匀性，1)QIs用于基数性，5)QIs用于扩展和均匀性，6)Qls用于四个质量方面的组合质量。在每个类别中，我们还详细介绍了一个或几个示例指示器。这些QIs通常在文献中使用，并且/或在它们的类别中具有代表性。表2总结了所有100篇文献。请注意，它不包括由多个QIs组合而成的度量。

当当当！！！这是论文中总结的100个indicators！！WTF！！！老师让了解了解的时候我是崩溃的。我慢慢来...

加黑加粗的是我已经整理好的~

![](indicator\3.png)

![](indicator\4.png)

![](indicator\5.png)

### QIs用于收敛性

收敛性作为解集质量的一个重要方面，在集的评价中受到了广泛的关注。文献中存在两类收敛QIs。一是考虑解或集之间的帕累托支配关系(表2项目1-9);另一种方法是考虑解集到帕累托前的距离，或者从帕累托前导出的一个/多个点(项目10 -22)。

#### Dominance-based QIs

A type of frequently-used dominance-based QIs is to consider  the <u>dominance relation between solutions of two sets</u> , such as the **C indicator** , $\widetilde{C}$ **indicator**, $\sigma- \tau- and \ \kappa-$ **metrics** , and **contribution indicator**. 
Other QIs concerning <u>solutions’ dominance</u> include wave metric, **purity**, Pareto dominance indicator, and dominance-based quality. 

The wave metric crunches the number of the nondominated fronts in a solution set. 

**The purity** indicator counts nondominated solutions of the considered set over the combined collection of all the candidate sets. 

The Pareto dominance indicator measures the ratio of the combined set’s nondominated solutions that are contributed by a particular set. 

The dominance-based quality considers the dominance relation between a solution and its neighbours in the set.

此内容见另一篇博客《Dominance-based QIs》













































