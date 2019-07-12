---
title: MOEA/D算法(二)
date: 2019-01-01 09:17:02
categories: MOEA
tags: 
- MOEA
- MOEA\D
mathjax: true
description:
---

“MOEA/D: A Multiobjective Evolutionary Algorithm Based on Decomposition”第二部分，算法的流程框架。

<!--more-->

### 规定

本文提出的基于分解的多目标进化算法(MOEA/D)需要对MOPs进行分解。任何分解方法都可以达到这个目的。在下面的描述中，我们假设使用了Tchebycheff方法。在使用其他分解方法时，修改下面的MOEA/D也非常简单。

$\lambda^1​$,...$\lambda^N​$ 是均匀分布的权值向量

$z^\*$ 是reference point

选用Tchebycheff Approach把多目标问题拆成N个标量优化子问题，表达式如下:

$$
g^{te}(x|\lambda^j,z^*)=\max\limits_{1\leq i \leq m}\{\lambda_i^j|f_i(x)-z_i^*|\}
$$

- 其中 $\lambda ^j=(\lambda_1^j,...\lambda_m^j)^T$.        $\lambda=(\lambda^1,...,\lambda^N)$ 

可知$g^{te}$是关于$\lambda$连续的，当$\lambda^i$与$\lambda^j$彼此接近，那么接近$\lambda ^i$向量的$g^{te}$权向量的信息也对最优解$g^{te}(x|\lambda^j,z^\*)$有一定的作用。这也是MOEA/D的理论基础。

在MOEA/D中，权向量的邻域被定义为它的几个最近的权向量的集合。第$i$个子问题的邻域由所有的子问题组成，这些子问题的权向量来自于第$i$个子问题的邻域。在MOEA/D中，只有相邻子问题的当前解被用来优化子问题。

切比雪夫法的MOEA/D算法中，有以下规定：

- $x^1,...x^N \in \Omega$  $x^i$是当前的第i个子问题
- $FV^1,...,FV^N$ ，其中 $FV^i = F(x^i)$  $ x \in [1,N]$ 
- $z=(z_1,...z_m)^T $ ，$z_i$ 是目前对目标$f_i$所找到的最好的点。


### Input

- MOP(1)
- 一个终止准则
- N：子问题的个数
- N 个均匀分布的权值向量$\lambda_1,...\lambda_N$
- T 每一个权值向量的邻居的数量
### Output: EP

#### STEP 1) Initialization:

**Step 1.1)**  使EP为空集

**Step 1.2)**  计算任意两个权值向量间的欧式距离，并找到离每个权值距离最近的T个点

​                  $B(i)=\{i_i,...i_T\}$ ，其中，$\lambda^{i_1},...\lambda^{i_T}$就是T个最近的权值向量

**Step 1.3)**  随机产生初始化种群 $x^1,...,x^N$  ，规定$FV^i=F(x^i).$

**Step 1.4)**  初始化 $z=(z_1,...z_m)^T $

#### STEP 2) Update:

for i=1,...N

- **Step 2.1)** 复制 ：从$B(i)$随机产生两个索引$k,l$ ，然后通过遗传算子从$x_k,x_l$ 中产生新的子代$y$

- **Step 2.2)** 提升 ：通过提升或者修理来启发式的由$y$产生$y'$ 

- **Step 2.3)** 更新参考点$z$：if $z_j < f_j(y')$ then $z_j = f_j(y')$   $j \in 1,...m$

- **Step 2.4)** 更新相邻解：对于每一个$j \in B(i)$,if $g^{te}(y'|\lambda^j,z)\leq g^{te}(x^j|\lambda^j,z)$ then $x^j=y', FV^j=F(y')$

- **Step 2.5)** 更新EP：
  ​                                --  从 EP中移除被 $F(y’)$支配的所有向量
  ​                                --  如果 EP中没有向量支配 $F(y’)​$，就将 F(y’)加入到EP中
#### STEP 3) Stopping Criteria

如果停止准则满足，并输出EP。否则，转向 **STEP 2)**。











