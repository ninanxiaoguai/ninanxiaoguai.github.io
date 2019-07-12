---
title: "QIs for All Quality Aspects"
date: 2019-03-06 17:21:13
categories: indicators
tags: 
- MOEA
- indicator
- AllaspectsQI
mathjax: true
---

一方面一拖再拖，一方面后面的 indicators 很多都是单独的一整篇论文，并非后面的一小部分，阅读并理解起来比较吃力，也有很多地方只看了算法步骤，而没有细看具体推导与证明，其中一篇，记忆很深刻，姚老师的 DoM-indicator 行文很严谨，并且断断续续看了四天才大概理解。

<!--more-->

这类中的质量指标在文献中最常用，因为它们涵盖了解决方案集质量的所有四个方面。表2中的75-100项列出了这些QIs。一般可分为两类:基于距离的QIs(项目75-91)和基于容量的QIs(项目92-100)。

distance-based QIs：

![](allaspects\1.png)

volume-based QIs：

![](allaspects\2.png)

## Distance-based QIs

基于距离的QIs的基本思想是测量PF到所考虑解集的距离。因此，需要一个能很好地表示PF的参考集(reference set)。只有接近参考集的每个成员的解集才能有一个好的评估值，从而反映所有质量方面的收敛性、扩散性、一致性和基数性。这个想法可以通过平均(或累加)引用集的成员到解集中它们最近的解的距离，或者从这些距离中找到最大值来实现。对于前者，反向代际距离(IGD)是一个典型的例子，它考虑了平均值欧氏距离。其他的例子包括Dist1(D1)和一些IGD的变异。他们使用差异距离度量(如Tchebycheff distance和Hausdorff distance)，或者在评价中引入支配关系或附加点。

测量帕累托前沿到解集的最大差分(距离)可以很容易地识别出它们之间的差距，从而判断解集在前沿是否具有良好的覆盖性。Dist2(D2)和$\epsilon$-indicator就是这样的QIs。Dist2指标考虑Tchebycheff距离，而$\epsilon$-indicator考虑的是在目标上的最大区别：参考集的点优越于所考虑的解。与averaging difference-based QIs不同，maximum difference-based QIs可能具有明确的物理意义；例如，$\epsilon$-indicator是测量最小值添加到任何的解将使它被至少一个参考点集所weakly dominated。然而，他们的结果通常只涉及到一个特定目标的一个特解，因此自然会有大量的信息丢失。

最近提出了一种质量指标，称为优势移动(DoM)，它可以看作是上述两种QIs的组合。具体地说，给定两个解集A和B，A到B的DoM是移动A中一些点以便B中的任意一点都至少由A中的一点所支配。这种直观的指标具有许多可取的性质，如两种解决方案比较的自然延伸，符合帕累托优势，不需要问题知识和参数。然而，它的计算并不简单。虽然提出了一种双目标情况下的高效计算方法，但如何在有三个或三个以上目标的情况下高效计算仍有待探索。值得一提的是，早期的质量指标[126]可以看作是DoM的简化版本。它划分了引用集(即，$A\cup B$)为许多集群,将A对每个簇的最大差分累加。这使得计算变得高效，但是自然地失去了它的物理意义。

### Inverted Generational Distance(IGD)

它是最常用的指标之一，尽管之前提出了一些类似的观点。顾名思义，IGD是GD指标的反演，即测量从帕累托前沿到解集的距离。

形式上，给定解集A和参考集 $R=\{ r_1,r_2,...,r_M  \}$
$$
IGD(A,R) = \frac{1}{M} \sum_{i=1}^M \min_{a \in A} d_2(r_i,a)
$$
$d_2(r_i,a)$ 表示 $r_i$ 与 $a$  的欧式距离。IGD值越低越好，说明该集合具有较好的收敛性、扩散性、均匀性和基数性的组合特性。

然而，IGD评估的准确性在很大程度上取决于参考集对帕累托前沿的逼近质量。不同的参考集可以使指标偏好不同的解集。通常建议对帕累托前沿采用高分辨率的大参考集。如[89,92]所示，集合中点数不足很容易导致反直觉的评价。此外，由优化器生成的所有非支配解决方案组成的引用集也可能导致误导结果，尽管这种做法在实际问题中得到了广泛采用。

### Front to set distance

**看了好几遍，没有发现和IGD有什么不同，，，笨死了** 

为了度量MOEA的性能，我们只考虑运行MOEA所产生的最终总体中包含的所有非支配解决方案的子集。我们称这样的子集为近似集并用 $S$ 表示。近似集的大小取决于用于运行MOEA的设置。此指标计算离散帕累托最优集中每个解到近似集S中最近解的距离，并取平均值作为指标值：
$$
D_{P_F \rightarrow S}(S) = \frac{1}{|P_S|} \sum_{z^1 \in P_S}\min_{z^0 \in S}\{ d(z^0,z^1) \}
$$
由于我们感兴趣的是在目标空间中测量性能，两个多目标解 $z^0$ 和 $z^1$ 之间的距离就是它们的目标值 $f(z^0)$ 和 $f(z^1)$ 之间的欧氏距离。$D_{P_F \rightarrow S}(S) $ 指标既表示接近帕累托最优前沿的目标，也表示得到一个diverse、wide-spread 解决方案前沿的目标。这个性能指标的值越小越好。一个与此indicator密切相关的性能指标的hypervolume指标。在hypervolume指示器中，选择目标空间中的一个点，使其由需要测量的近似集中的所有点支配。然后，指示值等于由逼近集和所选参考点包围的多维区域的超体积。这个值是由近似集支配的目标空间中区域的指标。hypervolume 指示器和 $D_{P_F \rightarrow S} $ 指示器之间的主要区别在于，对于 hypervolume 指示器，必须选择一个参考点。不同的参考点导致不同的指示值。此外，不同的参考点可能导致指示值表明对不同的近似集的偏好。由于在 $D_{P_F \rightarrow S} $ 指标中使用了真正的帕累托最优前沿，因此 $D_{P_F \rightarrow S} $ 指标并不适用于此缺点。当然， $D_{P_F \rightarrow S} $ 指标的一个主要缺点是，在实际应用中，真正的帕累托最优前沿是未知的。在这种情况下，所有逼近集的帕累托前缘可以用来代替实际的帕累托最优前缘。

### Delineation of Pareto Optimal Front

介绍了描述度量 $\Phi$ 评价收敛性和多样性的程度一个已知的帕累托最优。本研究的目标是确定一组能够很好地表示帕累托最优。这个度量背后的思想是在帕累托最优前沿上的每个解能被已得到的非支配解有多好的表示出来。计算描述度量 $\Phi$ ，大量的H等间隔的解必须知道以反映真实帕累托最优前沿的帕累托最优集。用于计算的距离度量 $\gamma$ 同一组 $H$ 解决方案使用。从每个帕累托最优解到以获得的解 $l_i$ 的欧氏距离,这距离的平均值作为描述度量 $\Phi$,也就是说:
$$
\Phi(P_T) = \frac{1}{H} \sum_{i=1}^H l_i
$$
需要注意的是，在计算这个度量时，要考虑算法获得的所有解，包括那些受支配的解。

### Dist1(D1)

我们假设 $M$ 是一个好的 $R$ 的近似解，如果它可以给 $R$ 中的所有地区的重要信息，换句话说，如果对于每一个解 $y \in R$ ，这里都有一个比较接近的解 $x \in M$ 。我们建议用以下基于成就尺度函数的度量方法来度量两个解的亲密性：
$$
c(x,y) = \max_{j=0,...,J}\{0,w_j(f_j(y)-f(j(x) )\}
$$
$J$ 为目标函数的个数。因此，如果在所有目标上x达到解y的值，则测量值为0。否则，它取特定目标相对于y的最大加权偏差值。上述表达式中使用的权重设置为：
$$
w_j = 1 / \Delta_j
$$
其中，$\Delta_j$ 是在reference set的 $f_j$ 的范围。
$$
Dist1=\frac{1}{card\{R\}}  \sum_{y \in R} \{ min_{x \in M} \{c(x,y)\} \}
$$

### Dist2(D2)

$$
Dist2=  \max_{y \in R} \{ min_{x \in M} \{c(x,y)\} \}
$$

第一个度量给出关于 $y \in R$ 到 $M$ 中最接近解的平均距离的信息，而第二个度量给出关于最坏情况的信息。值越低，集合 $M$ 越接近集合 $R$。而且，$Dist2/Dist1$ 比值越低，从集合 $M$ 到集合 $R$ 的解分布越均匀。

### $\epsilon$-indicator

$\epsilon$-indicator 考虑sets之间的最大差异，它是受$\epsilon$-approximation所感，著名的测量设计和比较近似优化算法,运筹学和理论计算机科学。给定两个解集，$\epsilon$-indicator是一个集合在目标中被转换(以加法或乘法的方式)以弱支配另一个集合的最小因子。这就产生了两个版本:加法$\epsilon$-indicator和乘法$\epsilon$-indicator。数学上，解集A对于解集B的加法$\epsilon$-indicator定义如下：
$$
\epsilon_+(A,B) = \max_{b \in B} \min_{a \in A} \max_{j \in \{1...m\}} a_j - b_j
$$
$a_j$ 是 $a$ 的第 j 个目标，$m$ 是目标函数的个数。解集A对于解集B的乘法$\epsilon$-indicator定义如下：
$$
\epsilon_\times(A,B) = \max_{b \in B} \min_{a \in A} \max_{j \in \{1...m\}} \frac{a_j}{ b_j}
$$
这两个indicators都是越小越好。$\epsilon_+(A,B) \leq 0$ 或者 $\epsilon_\times(A,B) \leq 1$ 意味着 A weakly dominate B。当用代表PF的参考集R替换B时，$\epsilon$-indicator可以用作一元指标。它衡量的是被考虑的集合到帕累托前沿的距离。但是，由于返回的值只涉及两个集合中一个特解的一个特定目标(其中最大的差异)，指示器可能会忽略大量集合的差异。这可能导致不同执行的解决方案集具有相同/类似的评估结果。

(前提每个目标都是越小越好)对于加法拆解理解：设 $k = \min_{a \in A} \max_{j \in \{1...m\}} a_j - b_j$ 就是说对于B中指定一个解 $B_i$ ,把A中所有的解都减 $k$，那么A中**至少**(意味着min)存在一个解可以 weakly dominate $B_i$ ；如果遍历所有的$B$，那么需要取最大的那个 $k$，才能满足把 $A$ 中所有解都减掉 $k$ ，对于B**任意**一个解，A中都**存在**解可以 weakly dominate。对于乘法同理。

具体例子如图：

![](allaspects\3.png)

![](allaspects\4.png)

可知：$\epsilon_+(A_1,A_2) = 1$,$\epsilon_+(A_1,A_3) = 9/10$,$\epsilon_+(A_1,P) = 4$

$A_1$=(4,7),(5,6),(7,5),(8,4),(9,2)

$A_3$=(6,8),(7,7)(8,6)(9,5)(10,4)

因为，想求 $\epsilon_+(A_1,A_3) $ 因此，先遍历 $A_3$ 中的元素，定性上说，在 $A_1$ 中里此元素越远，$k = \min_{a \in A_1} \max_{j \in \{1...m\}} a_j / b_j$越难被选上。  最后可以看到，(9,2)  与 (10,4) 的距离为标准，求得的结果，(10,4) 刚好在边缘上，且也可以看到，横轴间的距离差会比纵轴间的间隔会更大，因为横轴的数值就大。

### ObjIGD

Objective-wise Inverse Generational Distance(ObjIGD)

ObjIGD度量评估MaOOA在每个目标上的收敛性和分布性能。ObjIGD的主要思想类似于IGD度量，然而ObjIGD测量的是PF与最接近的解决方案之间基于一个目标的距离。第i个目标的对象定义如下：
$$
ObjIGD_i(S,P)=\frac{ \sum_{j=1}^{|P|} \min_{s \in S}|F_i(p_j)-F_i(s)| }{|P|}
$$
$P$ 是 reference($PF_{true}$)。$S$ 是 $PF$ 近似集。$F_i(p_j)$ 是第$ i$ 个目标的第 $j$ 个解，$F_i(s)$ 是近似解的第 $i$ 个目标，因此，整体$ObjIGD$为：
$$
ObjIGD(S,P)=\frac{\sum_{i=1}^M ObjIGD_i(S,P)}{M}
$$
其中，$ObjIGD_i(S,P)$ 是第 $i$ 个目标的 $ObjIGD$ 的值，$M$ 是目标函数的个数。测度值越低，表明目标的收敛性和分布性越好。

### IGD-NS

在 IGD 计算中，我们经常发现，一些非支配解往往被忽略，因为它们不是均匀地从Pareto optimal front选取的计算 IGD 的任意参考点的最近邻。这意味着这些非支配解集中的解对集合的IGD值没有任何贡献，因此在逼近帕累托最优前沿方面，它们的重要性低于集合中其他非支配解。因此，我们将这些解称为非支配解集中的无贡献解(noncontributing)。具体地说，无贡献解的定义如下。

解 $y'$ 被认为在解集 $P$ 中，对于解 $P^\*$是无贡献解，满足：
$$
\nexists x \in P^*:dist(x,y')=\min_{y \in P}dist(x,y)
$$
其中，$P^\*$ 是一组参考点均匀采样的帕累托最优。从上面的方程,它可以学到无贡献解不是 $P^\*$ 中任意点的最近邻点。

在考虑无贡献解的情况下，将提出的性能度量，即带无贡献解检测的IGD的度量(IGD-NS)，定义如下：
$$
IGD-NS(P,P^*)=\sum_{x \in P^*}\min_{y \in P} dis(x,y) + \sum_{y' \in P'}\min_{x \in P^*} dis(x,y')
$$
$P'$ 是population中无贡献解，上式的第一部分与IGD类似，控制了 $P$ 的多样性和收敛性；然而第二部分是对于每一个无贡献解到 $P^\*$ 中点的最小距离的总和。因此，当且仅当满足以下两个条件时，可以得到一个较小(良好)的IGD-NS度规值:首先，种群具有良好的收敛性和多样性;第二，总体包含尽可能少的无贡献解。

个人理解：就是遍历 $P^\*$ 中的每一个点，找到与此点距离最近的 $P$ 中的点都删掉，$P$ 中剩下的就是 $P'$

### $IGD_p$

$$
IGD_p(X,Y) = \left( \frac{1}{M}\sum_{i=1}^M dist(y_i,X)^p \right)^{1/p}
$$

这个就没有什么好说的了。。。

### $\Delta_p$

$$
\Delta_p(X,Y)=\max(GD_p(X,Y),IGD_p(X,Y))\\
=\max \left( \left( \frac{1}{N}\sum_{i=1}^N dist(x_i,Y)^p \right)^{1/p}, \left( \frac{1}{M}\sum_{i=1}^M dist(y_i,X)^p \right)^{1/p}  \right)
$$

这个也是。。。。

### $\epsilon$-performance

ε-dominance是一个概念,用户可以指定他们想要的精度得到帕累托最优解决方案的多目标问题,在本质上给他们的能力来分配每个目标的相对重要性。这是通过应用一个网格(由用户指定大小的值)问题的搜索空间。$\epsilon$ 值较大导致巨大网格(和最终减少解决方案),而较小的 $\epsilon$ 值产生一个更精细的网格。每种解决方案的健身然后映射到一个盒子健身根据指定的 $\epsilon$ 值。

- $\epsilon$-dominance适用于一套参考解根据用户指定的ε值
- 在每一代,匹配算法生成的每个解决方案,其相应的 $\epsilon$-nondominated参考集解。每个参考解只能有一个与之相关的算法解。如果存在多个解在 $\epsilon$-nondominated 参考集解，然后用欧氏距离最小的解来选择。这考虑了在参考解中的 $\epsilon$ 重叠地区，并且腾出额外的解与其他 $\epsilon$-nondominated参考解。
- Each $\epsilon$-nondominated reference solution that has a corresponding algorithm solution receives a score of **one**, while each reference solution that has no corresponding algorithm solution receives a score of **zero**. ：

$$
\epsilon(P) = \sum_{i=1}^n h_i/n
$$

$h_i$ 是 对于 $\epsilon$-nondominated reference set 的第 $i$ 个解，并且 n 是reference set的个数。

这个指标测量了**收敛性**通过考虑,聚集在 $\epsilon$ 的引用集的解。**多样性**是占每个$\epsilon$-nondominated引用包括只有一个解决方案的解决方案,不管$\epsilon$-block额外的解的存在性。这可以确保集群解决方案不会对度量的计算产生影响。

说实话没太看懂，，，怎么个对应(corresponding algorithm)法子。

### $I_{SDE}$

$$
I_{SDE}(x,y) = \sqrt{\sum_{1 \leq i \leq m }sd(f_i(x),f_i(y))^2}
$$

其中：
$$
sd(f_i(x),f_i(y))=\begin{cases}
f_i(y)-f_i(x) & if \ f_i(x) < f_i(y)\\
0 & otherwise
\end{cases}
$$
m 为目标函数个数。需要计算所有的 x 与 y 对。

### PCI

**定义1：**p 为一个点，Q为一组点$\{ q_1,q_2,..,q_k \}$ 。p 对 Q 的支配距离定义为p在目标空间中满足 p weakly dominate 所有的 Q 的最小距离：
$$
D(p,Q) = \sqrt{\sum_{i=1}^m(p^{(i)}-d(p^{(i)},Q))^2}
$$
其中：
$$
d(p^{(i)},Q) = \begin{cases}
min\{ q_1^{(i)},q_2^{(i)},...,q_k^{(i)} \},&if \ p^{(i)} > min\{ q_1^{(i)},q_2^{(i)},...,q_k^{(i)} \}\\
p^{(i)},&otherwise
\end{cases}
$$
$p^{(i)}$ 是 解 p 的第 i 个目标，m 为目标函数的个数。

$D(p,Q)$ 只考虑了 Q 中优于 p 的解，无关差于 p 的解。这可以使指标不受收敛性差的参考点的影响，如优势抵抗解。$D(p,Q)$ 的范围是0到无穷，越小越好。如果 p 在少数的目标函数中，轻微差于 Q ，$D(p,Q)$ 会很小，只有 p weakly dominate Q ：$D(p,Q)=0$ 

易证：
$$
\max\{D(p,q_1),...,D(p,q_k)\} \leq D(p,Q) < D(p,q_1)+...+D(p,q_k)
$$
**定义2：** P，Q为两个解集。P 对 Q 的支配解集 $D(P,Q)$ 。定义如下：对于任意点 $q \in Q$ 中 P 的最小的总距离，使得至少有一个点 $p \in P$  weakly dominate q。

在该指标中，由于参考集由所有的近似集组成，因此一个聚类可以包含来自不同近似集的点。让一个聚类 C 包含 P 和 Q。$P = \{ p_1,...,p_i \}$ 与 $Q = \{ q_1,...,q_j \}$，显然 $D(P,C) = D(P,Q)$ 。当 $i=1$ 时，$D(P,C)$ 是 $p_1$ 对 C 的理想点的支配距离。当 $i \geq 2$ 时，$D(P,C)$ 可以小于 $\min\{D(p_1,C),...,D(p_i,C)\}$。

![](allaspects\5.png)

如上图：ideal point 代表了 每个cluster中每个函数的最小值

- cluster $C_1$ ：$P_1$ 只有一个点，因此 $D(P_1,C_1) = (0.5^2 + 0.5^2)^{0.5} = 0.707$
- cluster $C_2$ ：$P_2$ 有两个点，为 $D(P_2,C_2)= 0.559 < \min\{1.031,1.25\}$ ,其中1.031与1.25是 $P_2$中的点分别到ideal point的点的距离。
- cluster $C_3$： $P_3$ 是一个极端情况， $D(P_2,C_2)=0$，但是如果单个计算的话均为 1。

由此可以知道：当 $i \geq 2$ 时，$D(P,C)$ 可以小于 $\min\{D(p_1,C),...,D(p_i,C)\}$。这是因为共有 $i^j$ 种可能性，对于$p_1,p_2,...,p_i$ 去分开 $q_1,q_2,...,q_j$ ，就是对于每一个 $q$ 都有 $i$ 个可能性被 $p$ weakly dominate。因此，粗略计算如下：
$$
D'(P,C) = \max\{ \min\{ D(p_1,q_1),...,D(p_i,q_1) \},\\
...\min\{ D(p_1,q_j),...,D(p_i,q_j) \} \}
$$
当 $i \geq 2$ 时，这仅仅有 $i \times j$ 个比较，尽管 $D'(P,C) \leq D(P,C)$ ，但是当 $C$ 的尺寸小时差距是很小的，例如：$D'(P_2,C_2) = 0.5 < D(P_2,C_2)=0.559$ 与 $D'(P_3,C_3) = D(P_3,C_3) = 0$ 。

![](allaspects\6.png)

![](allaspects\7.png)

首先。所有的解集都要归一化，

- 如果评估的近似解小于两个，PCI考虑 the minimum move of one solution in the approximation set to weakly dominate the cluster (Step 8
- 否则计算the minimum move of the set's solutions in the cluster to weakly dominate the cluster (Step 10

在 cluster 算法中：使用贪心的方法来逐步合并点根据他们的优势距离。设为归一化超平面上具有N个点理想分布的两个相邻点的区间(优势距离的意义)，其中N为参考集的大小。在这种情况下，$\sigma = 1/h$ 与 $N=C_{m-1+h}^{m-1}$ 其中，$h$ 为每个目标的分支，$m$ 为目标函数的个数，因为：
$$
(h+m-1)\times (h+m-2)\times ...\times (h+1) \approx (h + m/2)^{m-1} 
$$
因此：
$$
\sigma \approx \frac{1}{\sqrt[m-1]{N(m-1)!}-(m/2)}
$$

### G-Metric

规定：$A_1,A_2,...,A_m$ 是 m 个NSs(non-dominated sets)：

1. Scale the values of the vectors in the NSs
2. Group the NSs by levels of complete outperformance
3. For each level of complete outperformance and for every $A_i$ in the level, calculate the zone of infuence $I_{A_i}$
4. For every $A_i$, combine its convergence and DE to create a number that represents its relative performance respect to the other NSs

#### Scale and normalization 

- Take the union of the m sets, $C = \cup_{i=1}^m A_i$

- From C take its non-dominated elements.$C^\*=ND(C)$

- Find $max_j$ and $min_j$ as the max and min value respectively, for the component j for all points $p \in C$ 

  暗指在known pareto front 中挑选。

- Using $max_j$ and $min_j$ make a **linear normalization** of all points in all $A_i$ .

#### Convergence Component

已知 $D={A_1,A_2,...,A_m}$ ，其中 $A_i$ 是一个NS

- 令 $j=1$
- 令 $L_j=\{\}$
- 从 D 中提取出，并放入 $L_j$ 中，这些 $A_i$ 满足 $ \urcorner ((\bigcup_{A_k \in D }A_k)  \  O_C \  A_i)$ 
- 如果 D 不空，那么 j = j + 1，返回到第二步
- 结束

注意：这是以每一个NS作为整体的。

$L_1$ 是不能被 D 中除了 $L_1$ 的解所completely outperform。如果$A\in L_j$ ,$B \in L_k$ 并且 $j < k$ ，我们可以知道 A 要好于 B，如下图，这有5个NSs ：A，B，C，D 和 E。我们分三个层次： $L_1 = \{A\}$，$L_2 = \{B,C\}$，$L_3 = \{D,E\}$

![](allaspects\8.png)

#### Dispersion–Extension Component

定义1：$I_{p_i}$ 是一些据点 $p_i$ 的距离小于或等于一个正实数 $U$ 的一些点集，U 可以当作为半径。

定义2：$I_S$ 是 $I_{p_i}$ 的并集，$for \ all \ p_i \in S $ 

一般来说(对于点或集合)，我们将影响区域称为I。

$I$ 的测量 $\mu(I)$ ：它是对一个点或NS的注入带的测量。它是对一个点或NS的测量。对于 2d 它意味着是面积，在 3d中意味着体积，依次类推。

如果 S 有一个较差的 DE(Dispersion–Extension)，那么他们中的许多都挨着很近，并且相互交叉，结果 $\mu(I_S)$ 就会变小。现在假设我们重新定位S的元素以改进DE。我们通过增加元素之间的扩展和距离，以及/或使它们的距离更均匀来实现这一点(如下图)。随着我们提高了 DE，$I_{p_i}$ 会下降，与此同时，DE 与 $\mu(I_S)$ 都会增加，因此，$\mu(I_S)$ 正比于DE，并且 $\mu(I_S)$ 是一个好的 DE indicator。

$I_S$ 也正比于 $I_{p_i}$ 之间的交叠。具有良好DE的NSs比具有不良DE的NSs重叠更少。

![](allaspects\9.png)

#### Computing the G–Metric

已知 m 个 非支配解集，$A_1,A_2,...,A_m$

- 归一化所有的解集

- 把所有的解集分类成$A_k$

- for k = 1~Q ，其中，Q 是等级的数量。

  - 对于每一个 $A_i \in L_k$ ，消除所有的点 $p \in A_i$，满足 $p$ 被另一个点 $q$ 所支配，$q \in A_j$ 对于任意 $A_j \in L_k$ 翻译一下就是：在 $L_k$ 中留下非支配解，其他的都删去。
  - 计算基于所有的 $A_i \in L_k$  的 U (下面会详细说)
  - 计算 $\mu(I_{A_i})$ 对每一个 $A_i \in L_k$  (下面会详细说)

- 对于每一个 k = 1~Q-1

  - 对于所有的 $A_i \in L_k$ :
    $$
    G(A_i) = \mu(I_{A_i}) + \sum_{j = k + 1} ^Q \mu_{max}(L_j)
    $$
    其中，$\mu_{max}(L_j)$ 是 对于 $A_i \in L_j$ 最大的 $\mu(I_{A_i})$ .

例如下图：

![](allaspects\10.png)

![](allaspects\11.png)

![](allaspects\12.png)

![](allaspects\13.png)

![](allaspects\14.png)

![](allaspects\15.png)

![](allaspects\16.png)



这段有点不会了，索性直接贴图了。。。。

### Dominance move(DoM)

我看了四天！！！ 好多证明和推导，在这里就不解释了....

定义：$n_R(q)$ ，为在 $R$ 中最接近点 $q$ 的点。

距离测量：
$$
D(P,Q) = \min_{P' \preceq Q} \sum_{i = 1}^n d(p_i,p_i')\\
d(p_i,p_i') = \sum_{j=1}^m |p^j_i - p_i'^j|
$$
$p_i^j$ 是 在 $P$ 中第 $i$ 个解的第 $j$ 个目标函数。$p'$ 是 $p$ 转移到 $p$ 试支配 $Q$，使得：$Q$ 中的任意一点都可以被 $P^‘$ 支配。$m$ 是目标函数的个数。
$$
d(p,Q_s) = \sum_{j=1}^m(p^j - \min\{ p^j,q^j_{s1},q^j_{s2},...,q^j_{sk} \})
$$
m$ 是目标函数的个数。

假设计算 $D(P,Q)$ 

1. 删除 $Q$,$P$ 个子中的被支配的解，再删除 $Q$ 中被 $P$ 支配(存在一个就行)的点。
2. 设 $R = P \bigcup Q$ ，首先把 $Q$ 中的每一个点当作一组，然后对于 $Q$ 中的每一个点，在 $R$ 中寻找它的最近邻点；对 $Q$ 中的每一个点，寻找到一个 $ r \in R$ ，使 $r = n_R(q)$ ，如果 $r \in P$ ，那么把 $r$ 归为此 $q$ 一组；如果 $ r \in Q$ ，如果 $q$ 和 $r$ 已经在一组，什么都不需要做，否则，把这两组归为一组。
3. 如果在任何组中不存在 $q \in Q$ ，满足：$q = n_R(n_R(q))$ ，即这两个点互为最近邻，那么结束；
4. 对于有环(互为最近邻)的组，用这两个点的理想点取代这两个点，产生新的集合名为 $Q'$ ，寻找在 $P \bigcup Q'$ 中此理想点的最近邻点，并归类为一组，转向，Step.3

举例：

![](allaspects\17.png)

![](allaspects\18.png)

以下为 在收敛性，一致性，延展性，基数性，四个方面做出比较，效果都不错，但有一个很大的问题就是，只能比较二元问题，对于二元以上的存在一些漏洞，证明上不是充要条件。

![](allaspects\19.png)

![](allaspects\20.png)

![](allaspects\21.png)

![](allaspects\22.png)

## Volume-based QIs

### Hypervolume(HV)

HV首次作为空间的大小所展示，然后被用作几个专业术语hyperarea metric，S-metric，Lebesgue measure。由于HV指标具有理想的实际可用性和理论特性，因此可以说是最常用的QIs。计算HV不需要表示帕累托前沿的参考集，这使得它适合于许多实际的优化场景。HV结果对帕累托优势集的任何改进都是敏感的。当一个集合A优于另一个集合B时(即,一个A◁B)，然后HV返回A的质量值高于B。因此，对于给定的问题，达到最大HV值的集合将包含所有帕累托最优解。

HV indicator 的定义如下。已知解集A和参考点r, HV可计算为：
$$
HV(A) = \lambda(\cup\{ x | a \prec x \prec r \})
$$
$\lambda$ 表示勒贝格测度，简而言之，一个集合的HV值可以看作是由每个解和参考点(分别为左底顶点和右顶顶点)确定的超立方体的并集的体积。

HV的局限性是它的数量关于目标数而指数增加的运行时间(除非P=NP)。HV的另一个问题是其参考点的设置。对于如何为给定的问题选择合适的参考点仍然没有共识，尽管有一些常见的实践，例如帕累托前沿的最低点或比较解集集合的最低点的1.1倍。不同的参考点会导致HV评价结果不一致[110]。除了少数特殊情况外，关于高压参考点的选择缺乏系统的研究/理论指导。Recently,have demonstrated a clear difference of specifying the proper reference point for problems with a simplex-like Pareto front and an inverted simplex-like Pareto front.   他们还通过实验表明，一个比最低点稍差的参考点并不总是合适的，特别是在多目标优化和/或小群体规模的情况下。此外，HV指标偏向膝关节区域，偏向凸区域多于凹区域。证明，一组达到最大HV值的解的分布很大程度上取决于帕累托前缘的斜率。例如，HV可能倾向于高度非线性帕累托前缘上非常不均匀的解集。这已经得到证明。

### hyperarea ratio

hyperarea 定义为 $PF_{known}$ 值所包含的空间，例如，在二维目标优化中，就是原点和函数值所覆盖的矩形面积：
$$
H = \{ \bigcup_i a_i | v_i \in PF_{known} \}
$$
其中，$v_i$ 是 $PF_{known}$ 中的非支配解向量，$a_i$ 是由 $v_i$ 分量和原点确定的超面积。

以下图为例：

![](allaspects\23.png)

被(0,0) 与 (4,4) 所围成的矩形的面积是 16。被 (0,0) 与 (3,6) 所围成的为 (3 x (6-4)) = 6个，依次...结果：

$P_{true}$ 's H = 16 + 6 + 4 + 3 = 29.   $PF_{true}$ 's H = 20 + 6 + 7.5 = 33.5. 

同时，也注意到：如果 $PF_{true}$ 是 non-convex ，这种测量方法会有错误。它们还隐式地假设MOP的目标空间原点坐标为(0..，0)，但情况并非总是如此。$PF_{known}$ 中的向量可以转换为以零为中心的原点，但是由于MOPs之间每个目标的范围可能完全不同，因此最佳 $H$ 值可能相差很大。也定义了 $hyperarea \ ratio$ 定义如下：  
$$
HR = \frac{H_1}{H_2}
$$
$H_1$ 为 $PF_{known}$ 的超面积，$H_2$ 为 $PF_{true}$ 的超面积。在极小化问题里：ratio 值为 1，当 $PF_{known} = PF_{true}$ ；如果大于 1，即为 $PF_{known}$ 的超面积大于 $PF_{true}$ ，上例中，$HR = \frac{33.5}{29} = 1.155$ 。



### Hyperarea Difference (HD)

使 $A,B \subseteq X $ 是两个decision vectors，那么，函数 $D$ 定义如下：
$$
D(A,B):= \xi (A+B) - \xi (B)
$$
所给的是被 $A$ weakly dominate 但是不被 B weakly dominate 的空间的大小(objective space)。

![](allaspects\24.png)

如上右图，A 为 前沿1，B 为前沿2。一方面，$\alpha $ 是被前沿1但不被前沿2所占的大小。另一方面，$\beta$ 是被前沿2但是不被前沿1所占的大小，黑色的区域是被两个都占的大小，因此，$D(A,B) = \alpha$ ，$D(B,A) = \beta$ 。因为：
$$
\alpha + \beta + \gamma = l(A+B)\\
\alpha + \beta = l(A)\\
\alpha + \gamma = l(B)\\
$$
在这个例子中，$D(B,A) > D(A,B)$ 意味着与C度量相比，这两个方面的差异体现。另外，它给出了集合是否完全支配另一个集合的信息，例如 $D(A,B) = 0$，$D(B,A) >0$ 意味着 $A$ 支配 $B$。 

理想下，D 测量常用于被 $V$ 归一化的 $l$ 指标，对于应该最大化问题： 
$$
V = \prod_{i = 1}^k (f_i^{max} - f_i^{min})
$$
$f_i^{max},f_i^{min}$ 是 目标 $f_i$ 的最大值，最小值。可是，也有其他的情况，$V = l(X_p)$ ，表现得也不错。结果，四个值被考虑，当考虑两个解集时，$A,B \in X_f$:

- $l(A) / V$ ，它给出了目标空间中被 $A$ 弱支配的区域的相对大小。
- $l(B) / V$ ，它给出了目标空间中被 $B$ 弱支配的区域的相对大小。
- $D(A,B) / V$ ，她给了被 $A$ 弱支配但不被 $B$ 弱支配的区域的相对大小。
- $D(B,A) / V$ ，她给了被 $B$ 弱支配但不被 $A$ 弱支配的区域的相对大小。

由于 $D$ 度量是在 $l$ 度量的基础上定义的，因此不需要额外的实现工作。



### Volume measure

粗略的说$ \mathcal{V}(A,B) $ 是包含严格由 $A$ 的元素支配但不受 $B$ 的元素支配的两条边的最小超立方体的体积的分数(并且在[0,1]区间内)。如下图所示，两个连续的前沿 $A$ 和 $B$ 在目标空间的不同区域存在不同程度的差异，并且相互支配。(目标函数最小化)

![](allaspects\25.png)

$\mathcal{V}(A,B)$ 定义如下，对任何D维的向量 $Y$ ，$H_Y$ 为包括 $Y$ 的最小的轴平行超立方体。
$$
H_Y=\{ z \in R^D:a_i \leq z_i \leq b_i \ for \ some \ a,b \in Y \ i=1,...,D \}
$$
现在用映射到单位超立方体上的规格化缩放和平移来表示$h_Y(y):H_Y \rightarrow [0,1]^D$。此转换用于消除目标伸缩的影响。相当于 $k =  h_Y(y)$ 把原来的点 $y$ 通过缩放与平移到单位超立方体中的点 $k$ 。
$$
D_Y(A)=\{ z \in [1,0]^D:z \prec h_Y(a) \ for \ some \ a \in A \}
$$
上式为超立方体中被归一化控制的点的集合，那么$\mathcal{V}(A,B)$定义如下：
$$
\mathcal{V}(A,B)=\lambda(D_{A \cup B}(A) \backslash D_{A \cup B}(B) )
$$
其中，$\lambda(A)$ 是 $A$ 的勒贝格测量。个人认为：

​          绿色的部分为$\mathcal{V}(B,A)$ 。

​          红色的部分为$\mathcal{V}(A,B)$ 。

![](allaspects\26.png)

尽管这个描述相当繁琐，但是 $\mathcal{V}(A,B)$ 和 $\mathcal{V}(B,A)$ 很容易通过对 $H_{A \cup B}$ 的蒙特卡罗抽样来计算，并计算A或b占绝对优势的样本的比例。本研究选取5万个样本进行蒙特卡罗估计。体积测量 $\mathcal{V}$ 的好处是,它将奖励设置更大的区段当这些区段是前面的比较,而不是当他们在后面,不受点分布方面,而且它也给信息多远一组(平均)面前的另一个地方。

不幸的是，这个测度 $\mathcal{V}$ ，像原来的度规$\mathcal{C}$ 一样，具有这样的性质，如果$\mathcal{W}$ 是一个非支配集，并且 $A \subseteq W$，$B \subseteq W$ ，$\mathcal{V}(A,B)$ 与 $\mathcal{V}(B,A)$ 两者都是积极的。



### Integrated Preference Functional (IPF)

作为一组在运筹学上已建立完善的QIs，IPF测量由集合中的每个非支配解和给定的效用函数在相应的最优权值上确定的polytopes的体积。它可以被理解为表示解决方案集为DM[16]所携带的预期实用程序。IPF指标的计算分为两个步骤:1)找出每个非优解的最优权重区间;2)对这些最优权重区间上的效用函数进行积分。

形式上，$A \subset \mathcal{R}^m$ 是非支配解集，其中 m 是目标函数个数。考虑一个参数化的效用函数族 $u (a,w)$，其中给定的权重 $w$ 产生一个要优化的值函数，其中 $a \subset A$ 和 $w \in W \subset \mathcal{R}^m$ ,对于给定的 $w$，让 $𝑢^\*(A,𝑤)$ 为在A中最好的效用函数值的解决方案。给定权重密度函数$h:W \rightarrow \mathcal{R}^+$ ，表示未知权重w的概率分布，并且$\int_{w \in W}h(w)dw=1$，那么集合A的IPF值为：
$$
IPF(A)=\int_{w\in W} h(w)u^*(A,w)dw
$$
效用函数可以表示作为目标的凸组合(即加权线性和函数)或加权Tchebycheff函数。前者只考虑受支持的解决方案，而后者则涵盖所有非支配的解决方案。IPF indicator可以在/不需要 DM 的输入的情况下使用。当DM的偏好可以按照某个部分权重空间来表达时，IPF衡量的是该集合在部分帕累托前沿所代表的偏好的好坏。当没有可用的偏好信息时，可以假设所有的权重都是相等的(即$h(W)=1,\forall w \in W$)，IPF 衡量的是这组数据如何很好地代表整体帕累托。较低的IPF值为佳。然而，使用IPF指标的一个限制是，随着目标数量的增加，其计算复杂度呈指数级增长，因为它需要在(连续的)权重空间上进行积分。

**以下为论文原文：**

对于多目标优化问题，经常使用值(utility)函数法将各种目标函数组合成输入的一个标量函数。这个组合目标可以表示为参数化函数族 $g(x;α)$，一个给定的值参数向量 $\alpha$ 在它的领域 **A** 中代表一个特定的标量目标，并且目标是最小化。在二元目标的情况下0和1之间的 $\alpha$ 是一个标量,凸组合的情况下的目标。

对于给定的集合 $X$ (多目标函数的非支配解)，对于任意给定 $\alpha$ ，通过 $g(x;\alpha)$ 至少存在一个最优解。对于给定的 $g$ ，定义一个函数 $x_g:A \rightarrow X$，它把参数值( $\alpha$ )映射到 $X$ 中的相应解上。这个函数 $x_g(\alpha)$ 很清晰的把 $A$ 分成了几个区域，反函数 $x_g^{-1}(x)$ ，随着 $x \in X$，定义参数空间 A 在解上的分区，其中 $x_g$ 是常量： 
$$
A = \bigcup_{x \in X}x^{-1}_g(x) = \bigcup_{x \in X} A_x
$$
对于，$x_1 \neq x_2$ ，其中，$A_{x_1} \ and \ A_{x_2}$ ，在二元目标例子中，至多有一个值相同。通常情况下，$A_{x_1} \bigcap A_{x_2}$ 是 对于 $x_1 \ and \ x_2$ 最优解时，两个区域间的边界。在所有实际情况下，这将是一组测度零，不会影响指规数的计算。给定: $h:A \rightarrow R_+$ ,$\int_{\alpha \in A} h(\alpha) d \alpha = 1$,
$$
IPF(X) = \int h(\alpha) g(x_g(\alpha);\alpha)d\alpha
$$
将解集映射到实数的积分偏好函数。因为 $x_g$ 是(piecewise)分开的常量，上式的积分可以分解成与 $x \in X$ 相对应的 $x_g^{-1}(x)$ 的不同区域。
$$
IPF(X) = \int_{\alpha \in A} h(\alpha) g(x_g(\alpha);\alpha)d\alpha = \sum_{x \in X}\left[ \int_{\alpha \in x^{-1}_g(x)} h(\alpha) g(x;\alpha)d\alpha \right]
$$
因此,给定一个 $\alpha$ 的值产生一个特定的目标函数，因为至少有一个最优解在集 $x_g(\alpha)$ 。密度函数 $h(\alpha)$ 分配不同的值给权重向量 $\alpha$ 值,然后 $IPF$ 提供了一个通用的“最优”的解决方案,在已选择权重密度函数。

最后形式的方程表明,我们只需要能够评估积分 $h(\alpha)$ ,因此目标函数的形式是无关紧要的。此外，这里提出的 $IPF$ 测度没有考虑到决策者的任何个人偏好结构，因此可以认为是一般性的。当然，所有这些的主要困难是计算出 $x_g$ 为分段常数的 $A$ 的适当区域，以及计算式(2)中的积分。这些困难取决于函数g、函数h的类型和考虑的目标的数量。

$h(\alpha)$ 如下图：

![](allaspects\27.png)

![](allaspects\28.png)

在实际问题中应用IPF测量，需要对每个目标进行适当的标度。当所考虑的目标是不可比较的(例如，延迟作业的数量和总完成时间)，则无法解释混合的目标值。此外，当每个目标值的范围之间的差异非常大，以至于一个目标值可以被另一个目标值抵消时，将多个目标混合到一个合理的标量值需要适当的缩放。Schenkerman(1990)提出在缩放目标值时，合适的最小值和最大值分别是最大化问题中近似集的非支配最小值和理想点。他还坚持认为，其他的最低要求可能会阻止决策者做出自己喜欢的决定。De et al.(1992)在比较最小化问题的近似集与面积和长度度量时采用了相同的比例方法。正如Gershon(1984)所指出的，规模可以衡量目标的重要性，这影响所考虑的权重。

另外下面是在另一个论文里对 $IPF$ 的介绍，觉得更通俗，就摘过来了。

![](allaspects\29.png)

### IPF(Tchebycheff)

如Carlyle et al.(2003)所述，决策者的价值函数可以表示为目标的凸组合这一假设意味着只有支持的点才有助于IPF度量。一般来说，当决策者的隐式值函数是非线性的时，这是一个严重的限制，因此，在非支配解集中某些不受支持的点实际上可能是更可取的。在极端情况下，可能会出现这样的问题:受支持的有效解决方案非常少，而绝大多数有效解决方案可能不受支持。在评估非支配点集时，考虑不支持点的影响的一个好方法是使用加权的Tchebycheff函数来表示决策者的价值函数。Tchebycheff函数对应于权重规度$L_p​$ ,在下式中，当 $p = \infty​$  :
$$
minimize_{i \in I} \left( \sum_{j \in J} \alpha^p_j (z_j^i - z_j ^{**})^p \right)^{1/p}
$$
其中，$I=\{ 1,2,...,n \}$ 是解集的索引，$J=\{ 1,2,...,m \}$ 是目标的索引，$\alpha_j$ 是第 j 个目标的权重，并且 $\alpha_j \geq 0$，同时，$\sum_{j \in J} \alpha_j = 1$ ，$z^i_j$ 是第 i 个解的第 j 个目标函数值，$z^{\*\*}_j$ 是第 j 个目标的理想值。注意到这一点可以通过最小化第 j 个目标本身来找到。当 $p =  1$ 时，测度对应于目标函数的凸组合当 $z^{\*\*}_j = 0$ 时。当 $p = \infty$ 时，权重测度 $L_{\infty}$ 测度为：
$$
minimize_{i \in I} [ \max_{j \in J}\{ \alpha_j(z^i_j - z^{**}_j) \} ]
$$
加权Tchebycheff函数可用于生成所有非支配点，支持点和不支持点，因此在多目标优化问题中得到了广泛的应用。当使用加权Tchebycheff函数时，集合中的每个非支配点都有一个最优权区间。本文给出加权契比雪夫函数的IPF测度的计算方法。如果我们假设所有的权值都是等可能发生的($h(\alpha ) =  1 ,for \ all \ \alpha \in A​$)。当考虑二元函数时：
$$
minimize_{i \in I} [ \max \{ \alpha z^i_1, (1-\alpha) z^i_2 \} ]
$$
其中，$0 \leq \alpha \leq 1$ ，

并且考虑两个问题，1). 找出每个非支配点的最优权区间。2).在分解后的最优权值区间上对标量值函数积分。 

以下的 Step.1~Srep.3可解释第一个问题，Step.4解释第二个问题。

- Step.1：按照解的第一维度升序排好解如下：
  $$
  z_1^1 < z_1 ^2<...<z_1^n \quad and \quad z_2^1 > z_2^2>...>z_2^n
  $$

- Step.2：获得 break-even 权重，$\alpha ^i_b$ 对于每一个点 $i \in I$ ，其中，关系如下：
  $$
  \alpha_b^iz_1^i = (1-\alpha_b^i)z_2^i
  $$
  下图a，有在目标空间中的一个点，虚线表示一个break-even点 $\alpha ^i_b$ 。满足上式，并从图b，看出所有的点 $z^i,i \in I$ 满足如下：
  $$
  \alpha^b_i = \frac{z^i_2}{z^1_1 + z_2^i}
  $$
  使用break-even权重，$\max\{ \alpha z^i_1, (1-\alpha) z^i_2 \}$ 对每一个非支配点都可以如下这样：
  $$
  \max\{  \alpha z^i_1, (1-\alpha) z^i_2  \} = \begin{cases}
  \alpha z_1^i &\alpha \geq \alpha_b^i\\
  (1-\alpha_b^i)z_2^i &\alpha \leq \alpha_b^i
  \end{cases}
  $$
  ![](allaspects\30.png)

  定理一：对于所有的不等式，均满足：$\alpha_b^1 > \alpha_b^2>...>\alpha_b^n$ ，具体推导见原论文。

- Step.3：对于每一个非支配解，获得一个上界，$\alpha_U^i$，获得一个下界，$\alpha_L^i$ 。
  $$
  \alpha_U^1 = 1\\
  \alpha_L^1 = \alpha_U^2 = \frac{z_2^1}{z_1^2 + z_2^1}\\
  .\\
  .\\
  \alpha_L^i = \alpha_U^{i+1} = \frac{z_2^i}{z_1^{i+1} + z_2^i}\\
  .\\
  .\\
  \alpha_L^n = 0
  $$

- Step.4：在步骤3分解的最优权重区间上对加权Tchebycheff函数进行积分，对在 Z 中每一个点有如下：
  $$
  IPF(Z) = \int^1_0 h(\alpha) \min_{i \in I}[\max\{ \alpha z^i_1,(1-\alpha)z_2^i \}]d \alpha\\
  =\sum_{i \in I} \left( \int_{\alpha^i_L}^{\alpha^i_b} h(\alpha)(1-\alpha)z_2^i d \alpha\\+ \int_{\alpha^i_b}^{\alpha^i_U} h(\alpha)\alpha z_1^i d \alpha   \right)
  $$

下面为一个实例：

![](allaspects\31.png)

![](allaspects\32.png)

![](allaspects\33.png)

![](allaspects\34.png)







### R Family

与IPF指标类似，R族[73]也将DM s偏好纳入评价。然而，与IPF不同的是，R质量指标中的集成是基于效用函数(而不是权重空间)的。给定两个解集A和B，一个效用函数空间R和一个效用密度函数(U)，可以定义为
$$
R(A,B,U) = \int_{u \in U} h(u)x(A,B,u)du
$$
根据结果函数 $x(A,B,u)$，R家族有三个指标。R1考虑DM优先选择其中一个的概率，R2考虑效用函数的期望值(就像IPF指标)，R3引入了基于R2的比值。其中R2使用频率最高，可以表示为
$$
R2(A,B,U) = \int_{u\in U}h(u)u^*(A)du - \int_{u \in U}h(u)u^*(B)du
$$
其中，$u^\*(A)$ 表示A在此特定效用函数上所获得的最佳值。可以看出，两个集合的R2值可以单独计算。与IPF指标一样，当偏好信息不可用时，$h(u)$可以均匀分布在 $u$ 上。然而，计算中通常使用离散有限集 $U$，这与IPF中考虑的连续集$W$相反。这可以使R2的计算变得友好。特别地，如果效用函数 $u$ 的集合可以用权值 $W$ 的集合和这些权值上的参数化效用函数来表示，那么R2可以进一步计算为
$$
R2(A) = \frac{1}{|W|}\sum_{w \in W} u^*(A,w)
$$
与IPF一样，$u(A,w)$ 的物化过程中也存在多项选择，如加权线性和函数和加权Tchebycheff函数，但后者在实践中应用较为广泛。

当h(w)设为1时，将式(13){R2(A)}与式(10)(IPF(A))进行比较，R2和IPF指标表现得非常相似。IPF指标考虑的是一个连续的权值空间，它需要相对于目标维数呈指数增长的计算时间，而R2指标考虑的是一组离散的权值，它的计算速度很快，但其精度自然低于IPF。





















































