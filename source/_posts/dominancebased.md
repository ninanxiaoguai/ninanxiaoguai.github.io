---
title: Convergence--Dominance-based QIs
date: 2019-01-14 19:31:40
categories: indicators
tags: 
- ConvergenceQI
- MOEA
- indicators
mathjax: true
description:
---

此篇介绍的是QIs for Convergence的第一部分《Dominance-based QIs》。看了一部分方法的论文，剩下一部分实在看不下去了，想继续看看别的，有时间有精神回来补一下~

<!--more-->

### $C-metric$

定义为：
$$
C(A,B)=\frac{|\{b\in B:\exists a \in A,a \preceq b \}|}{|B|}
$$
$C$一方面可以计算出$B$中的解被$A$中解所支配的比例部分，另一方面也可以计算出$A$相对于$B$的性能。

当$C(A,B)=1$时，意味着$B$中的所有解都被$A$中的所$\preceq$。

当$C(A,B)=0​$时，意味着$B​$中的所有解都无法被$A​$中的$\preceq​$。

注意：$C(A,B)  \ne 1-C(B,A)$

$ C(A,A)  \ne 0$ 

如果$W$是一个非支配解集，$A,B$满足$A \subseteq W$，$B \subseteq W$，但$C(A,B)$可为[0,1]中的任意一个值。

### $\widetilde{C}-metric$

多目标优化环境下的性能度量是评价优化器定量性能的数学工具，它通过单独考虑优化器或与其他优化器进行比较来评价的。这种方法可以与优化器在线评估和性能改进的优化器结合使用，也可以离线应用于两个或两个以上优化器的最终结果，以比较它们的性能、产生的结果的质量和/或要求的计算努力。

性能指标可以大致分为两类：

基本度量:一个标准度量满足一定要求的解决方案的数量或比例，比如度量关系。

序数或几何度量:这些方法不度量数量，而是通过考虑几何位置来度量。
$$
\widetilde{C}(A,B)=\frac{|\{b\in B:\exists a \in A,a \prec b \}|}{|B|}
$$
$ C(A,A)  = 0$ ，因为$A$是非支配解集。

对于$\widetilde{C}(A,B)$、$C(A,B)$，值越高说明B中的解受A所$\preceq$的比例越多。

如果$W$是一个非支配解集，$A,B$满足$A \subseteq W$，$B \subseteq W$，但$C(A,B)=0$。

$\widetilde{C}(A,B)$与$C(A,B)$都没有考虑到前沿的延展性(extent)与一致性(uniformity)。

![](dominancebased\c1.png)

上图可以看出(minimise)：A的一致性(uniformity)更好，而B集中聚到了一个区域。

但有：$ C(A,B)  = C(B,A)  =\widetilde{C}(A,B)  =\widetilde{C}(B,A)  =\frac{4}{12}$，即使A的元素在B的大部分区段上占主导地位。

![](dominancebased\c2.png)

上图，尽管B有很好的延展性(extent)，

但是：$ C(A,B)=\widetilde{C}(A,B) =\frac{2}{12}$ ，  $C(B,A)=\widetilde{C}(B,A) =\frac{0}{12}$ ，从$C$、$\widetilde{C}$中的值看出$A$优于$B$。

### Contribution indicator

The contribution of algorithm $PO_2$ relatively to $PO_2$ is roughly the ratio of non dominated solutions produced by $PO_2$.

规定：

- $C = PO_1 \cap PO_2$
- 集合$W_1$为$PO_1$中支配$PO_2$的解集，集合$W_2$为$PO_2$中支配$PO_1$的解集。
- 集合$L_1$为$PO_1$中被$PO_2$支配的解集，集合$L_2$为$PO_2$中被$PO_1$支配的解集，
- 集合$N_1$为$PO_1$中不可与$PO_2$构成不可比较的解集，即$PO_1 \backslash  (C \cup W_1 \cup L_1) $
-  集合$N_2$为$PO_2$中不可与$PO_1$构成不可比较的解集，即$PO_2 \backslash  (C \cup W_2 \cup L_2) $

表达式为：

$$
CONT(PO_1 / PO_2) = \frac{\frac{|C|}{2}+|W_1|+|N_1|}{|C|+|W_1|+|N_1|+|W_2|+|N_2|}
$$
可知：

​       如果$PO_1$与$PO_2$是相同的解集，那么$CONT(PO_1 / PO_2)=CONT(PO_2 / PO_1)=1/2$

​       如果$PO_2$中的所有解都被$PO_1$所支配，那么，$CONT(PO_2 / PO_1)=0$。

我的理解：
$$
CONT(PO_1 / PO_2) = \frac{\frac{|C|}{2}+|W_1|+|N_1|}{|C|+|W_1|+|N_1|+|W_2|+|N_2|}\\
=\frac{\frac{|C|}{2}+\frac{|W_1|+|W_1|}{2}+\frac{|N_1|+|N_1|}{2}}{|C|+|W_1|+|W_2|+|N_1|+|N_2|}\\
=\frac{1}{2}\frac{|C|+|W_1|+|W_1|+|N_1|+|N_1|}{|C|+|W_1|+|W_2|+|N_1|+|N_2|}
$$
也就是说：对于$CONT(PO_1 / PO_2)$，如果$|W_1|+|N_1| > |W_2|+|N_2|$，则大于0.5。

也就是说：$PO_1$中支配$PO_2$的解和不能与$PO_2$比较的解越多，$CONT(PO_1 / PO_2)$越大。

### $\sigma-\  \ \tau- \ \ \kappa- \  metric$ 

#### 前言

对于一个评价指标，无论是类别如何，想要使他可用，都要满足以下五个特征：

- Monotonicity/compatibility(单调性/兼容性)：对于两个PFs的支配关系，度量标准应该满足单调性/兼容性，例如，设度量标准为$\xi$，如果A支配B，A就应该比B好或至少不能差于B。因此 $A \succeq B \Rightarrow \xi (A) \geq \xi(B)$或严格单调$A \succ B \Rightarrow \xi (A) > \xi(B)$ 。
- Transitivity(传递性)：在所比较的所有PFs的完全顺序中，一个度量应该是可传递的。如果A优于B，B优于C，那么通过$\xi()$也应得出，A优于C。直接比较度量通常会在被比较的不同PFs之间产生不可传递关系。传递性通常只在引用度量和独立度量中得到保证。这是因为这两种方法都为每个PF分配一个数字，并且实数之间的比较是可传递的。
- Scaling/meaningfulness(缩放性/有意义性)：目标函数通常需要进行缩放，例如进行单调变换以映射给定范围内的目标值，例如在[0,1]中。在这种情况下，一个度量应该是缩放不变的或有意义的，即，该度量不应受任何缩放的影响。尺度不变度量通常只利用解之间的优势关系，而不是它们的绝对客观值。
- Computational effort(计算工作量)：此属性用于计算给定pf的度量值所需的计算资源。为了比较不同度量的性能，通常只考虑运行时复杂性作为所需的计算工作。
- Additional information(附加信息)：许多指标依赖于不同类型的附加问题信息。一些假设问题的POF是已知的，而另一些则依赖于一些用户定义的依赖于问题的引用目标向量或引用PFs。因此，希望一个度量具有尽可能少的参数。

#### $\sigma-metric$

规定：**a** dominates **b**  is  $a \succ b$

原文：

**Sigma-metric($\sigma $-metric): The performance value, $\sigma_{ij} $, assigned to the j-th PF of the i-th optimizeris the number of solutions of the r-th optimizer which are strictly dominated by at least one solution of that PF of the i-th optimizer,where $i,r \in {1,2}$ and $i \ne r$.**

公式：
$$
\sigma_{ij}=\sum_{s=1}^{F_r}\sum_{t=1}^{L_{rs}}\max_{k\in \{1,...L_{ij} \}}I(p_{ijk}\succ \succ p_{rst})
$$
具体规定如下：
$$
optimizer\  i_{th}=\begin{cases} 
PF_1 & |PF_1|=L_{i1} \\ 
PF_2 & |PF_2|=L_{i3} \\
...\\
PF_j & |PF_j|=L_{ij}\\
...\\
PF_{F_i} & |PF_{F_i}|=L_{i{F_i}} \\
\end{cases}\\
optimizer\  r_{th}=\begin{cases} 
PF_1 & |PF_1|=L_{r1} \\ 
PF_2 & |PF_2|=L_{r3} \\
...\\
PF_j & |PF_j|=L_{rj}\\
...\\
PF_{F_r} & |PF_{F_{r}}|=L_{rF_r}
\end{cases}
$$
有两个优化器(optimizer)，每个优化器都$F_i$个$PFs$，对于第$i$个优化器，第$j$个$PF$，它有$L_{ij}$个解(solutions)。而$p_{ijk}$则为第$i$个优化器，第$j$个$PF$的第$k$个解。

$I(\bullet)$如果内部true则返回1，否则返回0。
$$
\max_{k\in \{1,...L_{ij} \}}I(p_{ijk}\succ \succ p_{rst})
$$
翻译为：对于指定的解 $p_{rst}$ 如果在第$i$个优化器，第$j$个$PF$中有$\succ \succ p_{rst} $关系的解，就为1，都没有则为0。

整体来看：对于第$r$个优化器的所有解中，被第$i$个优化器的第$j$个$PF$的所有$L_{ij}$个解所支配的个数。

因此，最大值为$optimizer\  r_{th}$的所有解的个数。

ps.原论文写的是$F_rL_{rs}$,但是我不赞同.....我认为是$\sum_{s=1}^{F_r}{L_{rs}}$，当$L_{r1}=L_{r2}=...=L_{F_r}$时与原论文一致。

#### $\tau-metric$

原文：

**Tau-metric ($\tau -metric$): The performance value, $\tau_{ij}$, assigned to the j-th PF of the i-th optimizer is the number of solutions of the r-th optimizer which are weakly dominated by at least one solution of that PF of the i-th optimizer,where $i,r \in \{1,2\}$ and $i \ne r$. Further, $\tau_{ij} $may also be rewarded if the j-th PF of the i-th optimizer weakly outperforms a PF of the r-th optimizer. Since the metricis based on the concept of weak dominance,it may be done just as an attempt to take into account the compatibility of the metric with the ‘‘weak outperformance relation’’ given indefinition (8). However, it would be a new dimension of research in order to generalize the outperformance relations in terms of multiple(more than two) PFs.​**

公式：
$$
\tau_{ij}=\sum_{s=1}^{F_r}\{ [\sum_{t=1}^{L_{rs}}\max_{k\in \{1,...L_{ij} \}}I(p_{ijk}\succeq p_{rst})] + I(A_{ij} \ \vartheta_w \  A_{rs} ) \}
$$
规定：

$\vartheta_w$ (weakly outperform):  $A \ \vartheta_w \ B$ means $ A \succeq B $ and $\exists c \in A \ but \ c \notin B $。

​                                              A不会比B差，并且A有B不存在的解。

在遍历$r_{th}\ optimizer$的$PF_s$时，如果与第$i$个优化器，第$j$个$PF$ 满足 ： $A_{ij} \ \vartheta_w \  A_{rs} $，再加1。

因此，相对于$\sigma-metric$最大值再加上$F_r$即$F_r(L_{rs}+1)$。

#### $\kappa-metric$

原文：

**Kappa-metric ($ \kappa-metric$): The performance value, $\kappa_{ij}$ , assigned to the j-th PF of the i-th optimizer is the number of solutions of the r-th optimizer which cannot weakly dominate a given solution of that PF of the i-th optimizer,where $i,r \in \{1,2\}$; and $i \ne r$. For the same reason as in the case of the $\tau-metric$, $k_{ij}$ may also be rewarded if the j-th PF of the i-th optimizer weakly outperforms a PF of the r-th optimizer.**

公式：
$$
\kappa_{ij}=\sum_{s=1}^{F_r}\{  \sum_{l=1}^{L_{ij}} \sum_{t=1}^{L_{rs}} I(p_{rst}\nsucceq p_{ijl}) + I(A_{ij} \ \vartheta_w \  A_{rs} ) \}
$$
遍历$r_{th}\ optimizer$的所有解，对于每一个解$p_{rst}$，如果$p_{rst} \nsucceq p_{ijl} (l \in [1,...,L_{ij}])$，则加1。

如果与第$i$个优化器，第$j$个$PF$ 满足 ： $A_{ij} \ \vartheta_w \  A_{rs} $，再加1。

因此，最大值为 $F_r(L_{ij}L_{rs}+1)$。

------

至此三种indicator已介绍完毕。

再分析当初说的五个特点，探究是否满足：

- Monotonicity/compatibility(单调性/兼容性)：对于两个PFs的支配关系，度量标准应该满足单调性/兼容性。如果A支配B，通过度量标准得出的结果，A就应该比B好或至少不能差于B，这个概念可应用与两个PF之间，但并不能应用于M-ary度量标准，M-ary它是和很多个PFs进行比较的而不是仅仅和另一个PF比较。如果$A$与$\{ B_1,B_2,...B_m\}$进行比较，这是不可能的说A的分数和$B_i's$的总分数有什么样的关系，尤其在$A$支配一些$B_i's$  或/和  $A$被一些$B_i's$支配 或/和 $A$和一些/全部$B_i's$交叉。在一些特殊的情况，比如当$A$支配所有的$B_i's$时，$A$相对于与其他的所有$B_i's$比较时，一定比任何$B_i$分数高。另一方面，当仅仅比较两个PFs时来作为简化的例子，M-ary度量标准遵守单调/兼容性，只要一个PF支配另一个PF而不是部分PF。
- Transitivity(传递性)：就像刚刚谈及Monotonicity时解释的一样，当前的概念并不适用于M-ary度量指标。在对某些PFs进行成对比较简化的情况下，在提出的基于基数的M-ary度量中，并不能保证传递性。例如$\sigma(A,B) > \sigma(B,A) \ and \ \sigma(B,C) > \sigma(C,B)$并不能得出$\sigma(A,C) > \sigma(C,A)$。正如Knowlesand Corne所观察到的，直接的比较指标往往会在被比较的不同PFs之间产生这种不可传递关系。这种情况在Noilublao and Bureerat被称为“剪刀-纸-石头”的情况。
- Scaling/meaningfulness(缩放性/有意义性)：所提出的度量标准是基于解决方案之间不同形式的优势关系设计的。由于两个解之间的优势关系是基于它们在目标空间中的相对位置，所以这些关系不会因为它们的双射值的缩放而改变(例如在给定范围内的单调变换)。因此，所提出的度量是缩放不变的。
- Computational effort(计算工作量)：因为一个优化器的PF与其它优化器相比,提出的每一个最糟糕的复杂性度量是$O(dFL^2)$,d是目标的数量,F是PFs的数量与一个给定的PF相比,和L的最大尺寸是比较PFs。
- Additional information(附加信息)：除了比较优化器的PFs之外，所提出的度量中不需要其他信息。

#### 实例讨论

这些测试首先在一组基准实例上进行，这些基准实例包含不同共拓扑的PFs，并且知道PFs之间的确切关系。最后。这些指标应用于另一组实例，并与三个已知指标的结果进行比较。在这个集合中，每个优化器都涉及从多次运行中获得的多个PF，并且不知道PFs之间的确切关系。

izarraga等人提出了8个测试用例来评估指标的性能。测试用例是这样构造的:考虑的PFs之间的确切关系是已知的。每个测试用例包含五个PFs (A, B, C, D和E),除了第六测试此用例只包含两个PFs (A和B)。三维版本中也是如此创建的模式和关系,每个测试用例的PFs是类似的。

假设每一个优化器只有一个PF，并且也已知与其他优化器的PFs的关系如何。

![](dominancebased\may1.png)

- a：此测试样例是关于PFs收敛性分析，$AO_cB; BO_cC;CO_cD;DO_cE$，除此之外，所有的PFs都有相同数量的解集，多样性，延展性。
- b：此测试样例是关于收敛性与多样性分析，$AO_cB,C; B,CO_cD,E$。$B$与$C$，$D$与$E$之间没有任何关系。所有的PFs有相同数量的解集，相同的多样性，但不同的延展性。
- c：此测试样例中，所有的PFs有相同数量的解集，相同的收敛性，但是每一个PF都有一个洞，每个洞的大小不一。
- d：此测试样例仅关于多样性。所有PFs有相同的收敛性和延展性但多样性不同。A是一致性分布，剩余的PFs都添加了一致性噪音(uniform noise)，但并没有影响其收敛性与延展性。
- e：此测试样例用来独立评估收敛性和多样性的用例。A有三个均匀分布的解。B是通过给A添加一个新的非支配解来构造的，C是通过给B添加一个新的非支配解来构造的，以此类推，从而得到$EO_wDO_wCO_wBO_wA$。PFs也是这样构造的，E相对于D有一个更好的多样性，D相对于C有一个更好的多样性，依此类推。
- f：此测试样例用于检测是否受到PF的凸性影响，所考虑的PFs具有相同的收敛性、多样性、扩散性和solu离子个数，但它们具有不同的凸性。
- g：此测试样例是检查一个度量是否受到PF位置的影响，所有设计的PFs都具有相同的收敛性、多样性、扩张性和解的个数，但是它们都位于POF的不同位置。
- h：最后一个测试样例被设计来研究具有多个解决方案的度量的行为。所考虑的五种PFs具有相同的收敛性、相同的扩散性和均匀的多样性，但解的个数不同。
![](dominancebased\may1.png)

最终实验结果如下：

![](dominancebased\may2.png)

请注意，测试用例5、7和8的PFs(图2(e)、g)和(h)由于以下原因不能正确区分。在测试用例5中，通过向A添加一个新的非支配解来构造B，通过向B添加一个新的非支配解来构造C，以此类推。因此，A完全被B重叠，B完全被C重叠，以此类推。因此使PFs不可区分。同样的，由于测试用例8的PFs具有相同的收敛性、相同的发散性和一致的多样性，所以它们之间是重叠的。另一方面，虽然测试用例7的每个PF在一个唯一的位置上都有一个曲线的模式，但是由于PF中有大量的高密度的解，所以PFs的指示符号并不能被清晰地识别出来。

论文中也介绍了一个optimizer with multiple PFs的情况。

但是实在不想翻译了。。。。。累死人

### Purity

原文：

![](dominancebased\pure1.png)

其中的**rank one**可难倒我了，以为要看前文才能理解，结果看完了还是不懂，直到我查阅材料时发现以下这段话：

an iterative **ranking procedure**: First all non-dominated individuals are assigned rank one and temporarily removed from the population. Then, the next nondominated individuals are assigned rank two and so forth. Finally, the rank of an individual determines its fitness value.

我才恍然大悟，原文里说的是$r_i$be the number of rank one solutions obtained from each MOO strategy.注意是solutions而不是nondominated solutions ，所以就会分等级制度，rank one、rank two。。。具体分法那段话就是步骤。

规定：

- 有N个MOO策略，$\{R^1_1,...R_1^N\} \ N > 2$ ，下标是rank，上标是第几个策略。
- $r_i$ 是第i个策略 $R_i$的等级1(rank one)的个数。
- $R^\* = \bigcup^N_{i=1}\{R^i_1\}$ 是所有集合的等级1集合的并集。
- $r_i^\*=|\{\gamma| \gamma \in R_1^i and \ \gamma \in R_1^\*\}|$ 是在$R^i_1$与$R^\*$的交集。

表达式为：
$$
P_i = \frac{r_i^*}{r_i}, i = 1,2,...,N
$$
该值是在[0,1]区间，并且越接近1越有良好的性能，纯度越高。

现在想想**纯度**的的命名还是很形象的。

### Dominance-based quality（有时间再说）

### Dominance ranking(太长了再说)

### Wave metric(有时间再说)

### Pareto dominance indicator(有时间再说)

### 总结

然而，所有dominance-based QIs都有一些弱点。它们提供的信息很少，不知道一组在多大程度上优于另一组。更重要的是，如果集的所有解互不支配，它们可能会使解集变得不可比较，这在多目标优化中经常发生。此外，值得注意的是，一些dominance-based QIs可能部分表示着解集的基数(cardinality)，因为一组尺寸大一点的解可能会导致更多的非支配解。