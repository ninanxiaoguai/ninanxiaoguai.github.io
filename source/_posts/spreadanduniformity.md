---
title: QIs for Spread and Uniformity
date: 2019-02-06 17:38:11
categories: indicators
tags: 
- MOEA
- indicator
- diversity
mathjax: true
---

过年期间，学习就更加懈怠了。。

<!--more-->

### 前言

spread和uniformity的品质方面是密切相关的，需要将它们放在一起考虑，以反映解决方案集的diversity。这激发了QIs去覆盖spread和uniformity的品质。这类QIs大多数可以分为两类，**distance-based** indicators and **region division-based** indicators，尽管也有其他的选择，如基于集群的指标和基于容量的指标。如图：

![](spreadanduniformity\1.png)

### Distance-based QIs(59~62)

该类中的QIs(表中项目59-62)通常考虑解与其邻域之间的距离，然后将这些距离相加，从而估计整个集合的覆盖范围。沿着这个思路的是 $\Delta$ ,然后是sparsity index，extended spread，and $\Delta_{Line}$ 。然而，这样的评估只能在双目标问题中工作，如非支配解连续位于两个目标上。这些QIs的另一个问题是，它们需要帕累托前沿(例如边界)的信息作为参考，这在实践中往往是未知的

#### $\Delta$

此论文来自于伟大的$NSGA-II$ ！
$$
\Delta = \frac{d_f + d_l + \sum_{i=1}^{N-1}|d_i-\bar{d}|}{d_f + d_l + (N-1)\bar{d}}
$$
具体参数可看下图，一目了然。

![](spreadanduniformity\2.png)

值得注意的是，这并不是可能的解决方案的最坏情况。我们可以假设$d_i$有很大的方差。在这种情况下，度量可能大于1。因此，上述度量的最大值可以大于1。然而，一个好的分布会使所有的 $d_i$ 距离都等于 $\bar{d}$ 并且会$d_f=d_l=0$(在非支配集中存在极端解)。因此，对于最广泛且均匀分布的非支配解集，其分子为零，使得度规 $\Delta$ 取的值为零。对于任何其他分布，度规的值都大于零。对于两个具有相同$d_f$和$d_l$值的分布，度规$\Delta$取的值较高，而极值解的分布较差。请注意，上述多样性度量可用于任何非支配解集，包括非帕累托最优集的解集。利用三角化技术或Voronoi图方法[1]进行计算$d_i%=$，可以将上述过程推广到估计高维解的spread。

#### Extended spread

S 是一个解集，$S^\*$ 是已知的Pareto-optimal solutions。

$\Delta(S,Q)$ :

原始度规计算两个连续解之间的距离，这只适用于2个目标问题。我们通过计算一个点到它最近的邻居的距离来进行扩展:
$$
\Delta(S,S^*) = \frac{\sum_{i=1}^m d(e_i,S) + \sum_{X \in S^*} |d(X,S)-\bar{d}|}{\sum_{i = 1} ^m d(e_i,S) + |S^*| \bar{d}}
$$
其中，$\{ e_1,...,e_m \}$ 是 $ S^\*$ 中的 m 个极值解，并且：
$$
d(X,S) = \min_{Y \in S,Y \neq X}||F(X)-F(Y)||^2\\
\bar{d} = \frac{1}{|S^*|} \sum_{X \in S^*} d(X,S).
$$
如果解决的方案有很好的distribute 并且包括这些极值点，那么，$\Delta(S,S^*)  = 0$。

#### $\Delta_{Line}$

####  (不是很懂) 

The $\Delta_{Line}$  measures the diversity and spread of approximate solutions without the need for the $PF_{true}$ . Let $\beta$ be the  mid-points of equally divided intervals in the range of [0, 1] $\left(  [0,\frac{1}{N}],[\frac{1}{N},\frac{2}{N}],...,[\frac{N-1}{N},1] \right)$ where $N$ is the number of solutions in approximate the PF, then the objective line distribution ( $\Delta^i_{Line}$ ) is defined as:但是并不是很懂下标的规定。
$$
\Delta^i_{Line}(S,\beta) = \frac{\sum_{j=1}^{|\beta|}\min_{s \in S}|\beta_j - F_i(s)| }{|\beta|}
$$
其中，$F_i(s)$ 是第 $i$ 个目标的归一化近似解，第i个目标线分布的零值表示近似PF沿第i个目标的均匀分布。$S$ 是一个粗略前沿PF。 整体线分布测度定义为:
$$
\Delta_{Line}(S,\beta) = \frac{\sum_{j=1}^{M} \Delta^i_{Line}(S,\beta)}{M}
$$
其中，$M$ 是目标函数的个数。

### Region Division-based QIs (63~74)

此分类的基本思想把一个特定的空间分割成许多细胞(重叠)，然后计算细胞的数量有解决方案集。这是基于一组更多元化的解决方案通常占据更多的细胞。考虑到细胞的不同形状，大多数用于扩散和均匀性的QIs都属于这一类。

它们中的一些考虑以解为中心的niche-like细胞，比如，Chi-square-like deviation, U-measure and sparsity。

有些则考虑gird-like的单元格将空间划分为多个超盒，比如，cover rate, number of
distinct choices , diversity metric , entropy and diversity comparison indicator.

其余的考虑fan-shaped(扇形)细胞，它们用一组均匀分布的光线来分割空间(权重向量)，比如，Sigma diversity metric, M-DI and DIR.

除此之外，考虑最小能量点(s-energy)划分空间[74]也是一种潜在的方法，因为它们可以很好地表示各种形状的空间。

#### Chi-square-like deviation

把search space (也就是自变量的空间)，分成几等分，每一个小区域叫做subregion。
$$
v = \sqrt{\sum_{i=1}^{q+1} \left( \frac{n_i-\bar{n_i}}{\sigma_i } \right) }
$$

- $q$ 是所期望得到最优解的个数。第$(q + 1)$个子区域是受支配的区域
- $n_i$ 是第 $i $ 个非支配子区域实际的个数
- $\bar{n}_i$ 是第 $i$ 个非支配子区域的期望个数
- $\sigma^2_i$ 是第 $i$ 个非支配子区域的个数的方差

通过概率论，他可以由下面估计：
$$
\sigma_i^2=\bar{n}_i(1-\frac{\bar{n}_i}{P})
$$
$P$ 是种群尺寸 因为并不希望任何的子代落到非支配区域，因此 $\bar{n}_{q+1} = 0$。并且有，$\sigma^2_{q+1} = \sum_{i = 1}^q \sigma^2_i$ 。如果点的分布是理想的话，那么$v=0$。因此，具有良好分布能力的算法具有低偏差度量的特点。

#### Sparsity index

好像没有公式，只有一段话。。。

![](spreadanduniformity\6.png)

![](spreadanduniformity\5.png)



大体意思就是：找到一个超平面，把每一个解映射过去，并且每一个解占有一定的大小(size=d 的 hyper-box) 越重合就越不稀疏，再把体积求和，当然体积越大越好。主要在于d的取值，不易太大，不易太小。

#### U-Measure(太多 再说)

#### Cover rate

Cover rate is the index(指标) for the diversity of the Pareto optimum individuals. The cover rate is derived in the following steps. 

- At first, one of the object functions is focused. 
- Secondly, the distance between the individuals that have the maximum and the minimum values is divided into the certain number of the division. 
- Thirdly, the division area that have the Pareto optimum individuals is counted. 
- Fourthly, the counted number is divided by the number of division. When every divided area has at least one Pareto optimum individual, this number becomes 1. When there are no area that has the Pareto optimum individuals, this number becomes 0. 
- Fifthly, these steps are treated for every objective function. 
- Finally, the cover rate is determined to average the number of each objective function. When the cover rate is close to 1, it means that the Pareto optimum individuals are not concentrated on one point but they spreads. 

In Figure 4, the concept of the cover rate are shown, when there are two objective functions.

![](spreadanduniformity\7.png)

翻译一下就是：如上图，为一个目标函数(个人觉得如果对于一个目标，理应是在一维坐标上)，找到最大值最小值，分成确定的几份，在每个小间隔中，如果有点就为1，否则为0。依次遍历每一个函数，最后求平均值。

#### Number of Distinct Choices ($NDC_\mu$)

从设计者的角度来看，所观察到的帕累托解集中包含的点越多，可供选择的设计选项就越多。然而，如果观测到的帕累托解在目标空间中过于接近，那么对于设计者来说，观测到的帕累托解之间的变化可能无法区分。换句话说，观察到的帕累托解的数量越多，并不一定意味着设计选择的数量越多。简而言之，对于一个观察到的帕累托解集$p=(p_1,...,p_{\bar{np}})$ ，只有那些彼此之间有足够差异的解决方案才应被视为有用的设计选项。

设数量$\mu , \ (0 < \mu <1)$为设计人员指定的数值，可将m维目标空间划分为$1/\mu^m$的小网格。为了简单起见，将$1/\mu$作为整数。每个网格都是指一个正方形(m维中的超立方体)，即无差异区域$T_{\mu(q)}$，其中区域内任意两个解点$p_i$和$p_j$都被认为是相似的，或者设计人员对这些解不感兴趣。下图给出了二维目标空间中的量$\mu$ 和 $T_{\mu(q)}$。

![](spreadanduniformity\8.png)

$T_{\mu(q)}(q,P)$ 表示是否有任何点$p_k \in P$属于区域$T_{\mu}(q)$。当至少有一个解点$p_k$落在无差异区域$T_{\mu}(q)$中时，$T_{\mu(q)}(q,P)$等于单元(或1)。$T_{\mu(q)}(q,P)$等于0(或0)只要$T_{\mu}(q)$区域没有解。一般来说，$T_{\mu(q)}(q,P)$可以表述为:
$$
T_{\mu(q)}(q,P) = \begin{cases}
1 & \exists p_k \in P \ p_k \in T_\mu(q)\\
0 & \forall p_k \in P \ p_k \notin T_\mu(q)
\end{cases}
$$
质量度量$NDC_{\mu}(q)$，即预先指定的m值的不同选择的数量，可以定义为:
$$
NDC_{\mu}(P)=\sum_{l_m=0}^{v-1}...\sum_{l_2=0}^{v-1}\sum_{l_1=0}^{v-1}NT_\mu(q,P)
$$
where $q = (q_1,q_2,...,q_m)$ with $q_i=\frac{l_i}{v} $ 

其中，$v=1/\mu​$ ，点 $q​$ 位于目标空间m-网格线的任意交点上，坐标为$(q_1,q_2,…,q_m)​$。如本节开头所示，，如果想让$NDC_{\mu}(P)​$值较高的观察到的Pareto解集，对于预先指定的 $\mu​$ 就要有相对于较低的值(网格越密，被删去的点就越少)。

$NDC_{\mu}$ 和 cover rate 是有区别的，前者是把目标空间看作整体，并分成了很多个hyper-box；后者是分析每一个维度，最后加权平均一下。

#### Diversity metric(DM)

规定： $P^{(t)}$ 为每一代的种群。$\mathcal{F}^{(t)}$ 是 $P^{(t)}$ 的非支配解。目标(参考点集) $P^\*$

- 从 $P^{(t)}$ 中确定 $\mathcal{F}^{(t)}$ , 使 $\mathcal{F}^{(t)}$ 非支配于$P^\*$  

- 对于网格的每一个索引 $(i,j,...)$ ，并计算下面两个：

  - $$
    H(i,j,...)=\begin{cases}
    1,& if \ the \ grid \ has \ a \ representative \ point \ in \ P^* 
    \\
    0,& otherwise
    \end{cases}
    $$ and

  - $$
    h(i,j,...)=\begin{cases}1,& H(i,j,...)=1 \ and \ if \ the \ grid \ has \ a \ representative \ point \ in \ F^{(t)} \\0,& otherwise\end{cases}
    $$

- 给 $m(h(i,j,...))$ 赋值根据该索引本身与它邻居的$h()$。同样的，用 $H()$ ，来计算 $m(H(i,j,...))$

- 计算多样性衡量标准 by averaging the individual $m()$ values for $h()$ with respect to that for $H()$:

$$
D(P^{(t)}) = \frac{ \sum_{i,j,...\\H(i,j,..) \ne 0} m(h(i,j,...)) }{\sum_{i,j,...\\H(i,j,..) \ne 0} m(H(i,j,...))}
$$

在这个简单的例子中，网格的值函数 $m()$ 可以通过使用它的 $h()$ 和相邻的两个 $h()$ 维度来计算。对于一组连续的三个二进制 $h()$ 值，总共有8种可能。任何值函数的赋值方法如下:

- 111 是最好的分布，000 是最坏的分布。
- 010 或 101表示具有良好扩展的周期模式，其值可能大于 110 或 011 。例如，上述估值将使网格覆盖率为50%的近似集具有更大的分布(如1010101010)，优于具有相同覆盖但分布较小的另一集(如1111100000)。
- 110 或 011 的值可能超过 001 或 100，因为有更多的网格覆盖。

| h(...j-1...) | h(...j...) | h(...j+1...) | m(h(...j...)) |
| ------------ | ---------- | ------------ | ------------- |
| 0            | 0          | 0            | 0.00          |
| 0            | 0          | 1            | 0.50          |
| 1            | 0          | 0            | 0.50          |
| 0            | 1          | 1            | 0.67          |
| 1            | 1          | 0            | 0.67          |
| 0            | 1          | 0            | 0.75          |
| 1            | 0          | 1            | 0.75          |
| 1            | 1          | 1            | 1.00          |

对于 $H()$ 使用相同的值。在目前的研究中，通过计算上述度量维度来处理两个或多个维度的超平面，而通过考虑一组移动的超盒来非常谨慎设计地上述值函数的一个高维版本。对一个包含9个盒子的二维集合的考虑如下:

![](spreadanduniformity\9.png)

作为上述计算过程的说明，下图显示了一个两目标最小化问题的一组目标点(标记为填充圆$P^\*$)和一组总体点(标记为阴影和打开的方框 $P^{(t)}$ )。用阴影框标记的点是相对于目标点的非支配点( $\mathcal{F}^{(t)}$ )，用于多样性计算(这是步骤1)。这里以f2 =0平面为参考平面，将 $f_1$ 值的完整范围划分为G=10个网格。下一步，计算每个网格的 $h()$ 和 $H()$ 值。对于边界网格(极端网格和网格$(...,j,...)$ 与 $H(…,j - 1 ....)= 0$ 。

![](spreadanduniformity\10.png)

在边界处的网格，假设一个假想的相邻网格的h()或h()值为1，例如上图的虚线格子。也注意到，有的格子里有不止一个点在其中，但也就算一个。移动的三个格子，确定中间位置的数值。为避免边界效应(使用虚网格的效应)，我们将上述度量归一化如下:
$$
\bar{D}(P^{(t)}) = \frac{ \sum_{i,j,...\\H(i,j,..) \ne 0} m(h(i,j,...)) -\sum_{i,j,...\\H(i,j,..) \ne 0} m(0)}{\sum_{i,j,...\\H(i,j,..) \ne 0} m(H(i,j,...))-\sum_{i,j,...\\H(i,j,..) \ne 0} m(0)}
$$
0 为值为零的数组。仔细想想就会发现，计算上述$\bar{D}(P^{(t)})$项和边界网格调整时$H(i,j…) \ne 0$ 允许使用一种通用方法来处理具有断开的pareto最优前端的问题。该度量不包括不存在参考解的网格的值函数。

如果不知道帕累托最优前沿(特别是对实际问题)，则可以用以下方法确定目标集。

- 首先，MOEA运行T代，并存储按代计算的总体($P^{(T)}， t = 0,1…T)$)。

- 然后,将每个种群的非支配成员 $\mathcal{F}^{(t)}$ 组合在一起，则target set 就是这些的总和。
  $$
  P^*=Non-dominated(\cup^T_{t=0}\mathcal{F}^{(t)})
  $$

#### Diversity comparison indicator (DCI)

很巧这里介绍了DM的缺点：

- a reference set，它要求是均匀分布在PF，这是必需的，以便准确反映分布的optimal front。也是要求，解决方案参考集近似近似的解决方案的数量以保证理想的分布近似可以达到最佳的DM值(一个)。这些要求在多目标优化问题中通常是不可用的。
- DM需要访问网格中的每个hyperbox来估计分布，这对数据结构和计算成本都带来了很大的挑战。对于m个目标的优化问题，需要考虑 $r^{m-1}$ 超盒，其中r为每个维度的划分数。
- 在超盒的分布估计中，DM需要通过一个值函数给每个相邻的超盒分配一个合适的值，以区分其邻域内解的不同分布。由于超盒的邻居数量随着目标数量的增加呈指数增长(m维超盒最多有($3^m$-1)个邻居)，当涉及大量目标时，很难定义准确反映不同分布的值函数。
- 由于网格中解的邻域的指定，DM可能无法给出具有大量目标的近似的精确分集结果。DM中解的邻域的设置是基于解的网格坐标的曼哈顿距离，而不是它们的欧氏距离。它可能会误导性地消除相邻解，但将更远的解视为相邻解。

网格的位置和大小在该指标中具有重要意义。设置网格区域不应涉及整个目标空间，而应针对给定问题的帕累托前沿不远的区域，因为不同近似有意义的多样性比较的**前提**是它们已经接近最优前沿[50]。假设较高和较低的网格边界为：$LB=(lb_1,lb_2,...,lb_m)$ and $UB=(ub_1,ub_2,...ub_m)$ ,m 是目标函数的个数，如果一个解向量$(q_1,q_2,...,q_m)$ 在 $LB$ 与 $UB$ 之外，(也就是说 $k \in \{ 1,2,...,m \}:q_k <lb_k \  or \ q_k > ub_k$ ) 那么此解向量在indicator calculation 中会被忽略掉。

在将所提出的DCI应用于不同问题时，网格边界可以由用户定义的“满足区域”来确定，也可以由问题的理想点和最低点来设置。“满足区域”是用户的一种估计，即在该区域中所获得的解被认为满足收敛性的质量要求。当用户没有明确规定他/她“满意的地区,”网格边界可以通过给定问题的理想点和最低点(下图所示),理想点和最低点是两个重要的概念在多目标优化中,当PF是未知时他们可以通过一些有效的方法估计。在这里，将一个问题的理想点和最低点所构成的区域的轻微松弛看作网格环境：
$$
ub_k = np_k + \frac{np_k - ip_k}{2 \times div}\\
lb_k = ip_k
$$
其中，$ip_k$ 是第 $k$ 个目标的理想点，$np_k$ 是第 $k$ 个目标的最低点，$div$ 是一个常数(一个维度中目标空间的划分数，例如下图为5)

![](spreadanduniformity\11.png)

根据网格的边界和划分的数量，第 $k$ 个目标中的超盒大小 $d_k$ 可以形成如下图所示：
$$
d_k = \frac{ub_k-lb_k}{div}
$$
在这种情况下，通过下边界和超盒尺寸可以确定解在帕累托前近似中的网格位置如下(向下取整):
$$
G_k(q)=\lfloor (F_k(q)-lb_k)/d_k \rfloor
$$
其中$G_k (q)$ 表示第 $k$ 个目标中解 $q$ 的网格坐标。$F_k(q)$ 是 $q$ 在第 $k$ 个目标中的真实值。上图中，A，B，C，D 的坐标一次为 (0,4)，(0,3)，(2,2)，(4,0)。以下在引入关于距离的两个概念

$h_1,h_2$ 是网格中的两个超立盒子，那么两个网格的距离为：
$$
GD(h_1,h_2)=\sqrt{\sum_{k=1}^m (h_1^k - h_2^k)^2}
$$
$h_1^k，h_2^k$ 是 $h_1,h_2$ 的在第 $k$ 个目标函数的坐标。$m$ 是目标函数总数。例如 B 与 C 距离为 $\sqrt{(0-2)^2 + (3-2)^2} = \sqrt{5}$ .

P 是也该粗略解集， h是一个超方体盒，从 P 到 h的最短格距离为：
$$
D(P,h) = \min_{p \in P} \{ GD(h,G(p)) \}
$$
例如，上图中 在粗略解集A，B，C，D中距坐标为(1,3)的超方体盒子的距离为 $GD(h^{(1,3)},G(B)) = 1$ 。显然，在网格环境中解分布均匀且分布广泛的近似，其到所有超盒的平均距离值较低。

不同的帕累托前近似解可能位于不同的超盒中。在这里，我们只考虑在混合逼近集中非支配解所在的超盒，因为受支配解的多样性对用户来说可能毫无意义。对于一个近似解，如果它的解覆盖或接近所有被考虑的超盒，那么与其他近似相比，它将获得一个相对较好的多样性;另一方面，如果它的解决方案远离大多数这些超盒，则会获得相对较差的多样性。算法1给出了计算待比较近似的DCI值的主要步骤。

![](spreadanduniformity\12.png)

贡献度(算法1的第6行)反映了近似对超盒的贡献，并由它们之间的距离决定。对于近似，如果所考虑的超盒中至少存在一个解，则可获得该近似对超盒的最大贡献程度。如果从近似值到超框的距离大于指定的阈值即，则贡献度为0。具体地说，近似P对超盒h的贡献程度定义为：
$$
CD(P,h) = \begin{cases}
1 - D(P,h)^2 / (m + 1) &d(P,h) < \sqrt{m+1}\\
0 &d(P,h) \geq \sqrt{m+1}
\end{cases}
$$
值得指出的是，我们将网格距离的阈值设置为$\sqrt{m+1}$，是为了保证相邻的两个个体始终能够交互(即，它们所在的超盒总是相邻的)。直观地说，如果两个超盒的个体可以任意接近，那么它们应该被视为邻居(在个体之间没有另一个超盒)。显然，满足上述条件的最远的两个超盒是网格距离为$\sqrt{m}$的对角超盒。由于超盒之间的网格距离始终为离散值$\sqrt{0},\sqrt{1},...,\sqrt{m},\sqrt{m+1}...$，将阈值设置为$\sqrt{m+1}$，只是使这些超盒对角相邻，在计算贡献度时可以相互作用。

图3为不同目标数下贡献度函数曲线。注意，贡献度取一个离散值，因为$D(P,h) \in \{\sqrt{0},\sqrt{1},...,\sqrt{m},\sqrt{m+1}...\}$。从图中可以看出，一些观察结果如下:

![](spreadanduniformity\13.png)

- 贡献度取0到1之间的值。在一定范围内，从近似到超盒在一定范围内，它单调地减小。
- hyperbox的邻域半径随着目标数量的增加而增加。这表明，当目标数量增加时，可以考虑更大范围的个体进行交互。
- 当距离变量D(P, h)相等时，贡献度随着目标个数的增加而增加。这种增加似乎是合理的，因为随着网格中超盒总数的增长，超盒之间的相对距离变得更小。

总体而言，贡献度函数不仅考虑了近似到超盒的距离信息，还考虑了目标个数不同的网格环境的性质，对目标个数的变化具有良好的适应性。实际上，任何形式的函数都可以通过记住上述性质来赋值为贡献度函数。为了简单起见，这里使用二次函数。

根据贡献度函数，近似的DCI值是[0,1]区间内的一个数值。需要重申的是，**DCI只是评估不同的帕累托前近似的相对分布质量，而不是为单个近似提供分布的绝对度量。**最佳价值(即由近似得到的DCI = 1)不能反映其在整个帕累托前缘的均匀分布。相反，它表明该近似比其他近似有一个完美的优势。

![](spreadanduniformity\14.png)

上图展示了DCI的计算过程，有三个二元目标问题的pareto approximation $P_1,P_2,P_3$ ，并放在了网格环境中，有11个超方盒(灰色)被决定，其中解A，B并没有考虑其中，因为他们在混合解中被支配了。然后，对于每个超盒，根据前面提到的公式式计算三种近似的贡献度。比如，当考虑$h^{0,7}$ 时，$P_2$ 的贡献值为1，因为它在超方盒中。对于$P_1$ 来说：$1-1^2/3=2/3$ 作为$D(P_1,h^{0,7}) = 2/3$ ，对于$P_3$ 为0，因为$\sqrt{10} > \sqrt{3}$ 。最后，根据算法1(第10行)求出各近似对这些超盒的平均贡献度，分别为：0.848，0.606，0.515。

#### M-DI

M-DI 是在 DCI 的基础上修改的。

在DCI方法中，将各种算法的NDFs(non-dominated fronts)集合在一起，识别出一组帕累托最优解。使用由网格划分参数定义的网格，将每个算法的贡献与组合的帕累托最优解进行比较。

假设有两组帕累托前近似 $P_1$ 和 $P_2$ ，如下图所示。在这种情况下，$P_2$ 是组合的Pareto front，它的DCI度量是最高的(值1)，但是我们可以看到，这个值并没有反映出在front的极限之间的目标空间中解的均匀分布。在没有关于POF(Pareto Optimal Front)的任何资料的情况下，如果假定有一个连续的front，$RTF$ 很可能提供尽可能最好的解决办法。

![](spreadanduniformity\19.png)

在M-DI中，多样化是相对于**RPF**(Reference Pareto Front：单位截距在超平面上均匀分布的一组点)计算的。Nadir and Ideal point 计算方式与 DCI 相同。在RPF上的reference的数量 $W$ ，与在优化进程期间的人口尺寸 $N$ 有关 。For example, a population of 90 used for a 3-objective optimization problem would mean use of 91 reference points on the RPF. 其中 $CD(P,h)$ 仍不变，$h$ 是被RPF所占据的hyper-boxes。而不是在**DCI** 中的把所有解集合在一起，取出非支配解所占的hyper-boxes，因此：
$$
M-DI = \frac{\sum_{i=1}^{|h|}CD(P,h_i)}{|h|}
$$


#### Entropy

**Ideal/good points：** 将理想点定义为目标空间中的一个点，该点的分量分别由目标函数的约束最小化得到：
$$
Minimize \ f_i(x) \quad s.t.:x \in D
$$
**Nadir/bad points：** 在此论文中是，在本文中，我们任意地高估了目标的范围，以至于没有遇到违反估计上限的设计点。

**Influence Function：** 在决策空间中，第 i 个解的影响函数$\Omega_i:F^m \rightarrow R$ ，$\Omega_i$ 是随第 i 个解而下降的函数，种类很多，本轮中选择 Gaussian influence function。
$$
\Omega(r) = \frac{1}{ \sigma \sqrt{2 \pi} } e^{-r^2/2\sigma^2}
$$
**Density Function：** 将可行目标空间各点的密度函数定义为各解点影响函数的集合，设共有 N 个解点，可行目标空间 $F_m$ 中任意点 $y$ 处的密度函数可得：
$$
D(y) = \sum_{i=1}^{N} \Omega_i(r_{i \rightarrow y})
$$
$r_{i \rightarrow y}$ 是一个标量，它展示了 $y$ 与 第 $i$ 个解点的欧式距离。$\Omega_i( . ) $ 是 第 $i$ 个点的影响函数，下图展示了在一维里一些点的影响距离。

![](spreadanduniformity\15.png)

 **Entropy：** Claude Shannon 引入信息论熵来测量随机过程的信息含量，从而建立了信息论领域。从那时起，熵的许多不同的应用在不同的领域有他们自己的解释和定义。假设一个随机过程有n个可能的结果第i个结果的概率是。这个过程的概率分布可以表示为：
$$
P = [p_1,...,p_i,...,p_n];\sum_{i=i}^{n}p_i=1; p_i \geq0这个概率向量有一个相关的Shannon s熵，H的形式
$$
这个概率向量有一个相关的Shannon s熵，H的形式：
$$
H(P) = - \sum_{i=1}^n p_i \ ln(p_i)
$$
其中， 当 $p_i = 0$ 时，$p_i \ ln(p_i)=0$。最大值为 $H_{max}=ln(n)$ 当所有的值都相同的，最小值为0，当一个为1，其他的所有均为0。事实上，香农熵衡量的是 $P$ 的平整度，即。，如果向量中各分量的值近似相等，则熵值很大，但如果各分量的值相差很大~概率分布不均匀!，对应的熵值较低。

如下图所示

![](spreadanduniformity\16.png)

网格的尺寸是 $a_1 \times a_2$ 在feasible domain。对每一个密度函数，$D_{ij} = D(y_{ij})$，$a_1$ 和 $a_2$ 的数量确定为每个单元格的大小小于或等于无差异区域(无差异区域定义为任意两个解点被认为是相同的单元格大小，或决策者对这些解不感兴趣)。$a_1$ 和 $a_2$ 的数量可以根据设计者的经验或对类似问题的认识主观确定；或者客观地基于可用的计算能力和期望的精度。假设非常小的网格大小有助于提高准确性，但它也增加了计算熵的计算负担，这反过来可能使质量评估过程非常缓慢，甚至在计算上不可行。显然，适当的网格大小取决于问题，并且在不同的情况下有所不同。因为这些项的和。在香农熵的定义中，熵是1，我们定义一个归一化密度，$\rho_{ij}$ ，为:
$$
\rho_{ij} = \frac{D_{ij}}{\sum_{k_1=1}^{a_1}\sum_{k_2=1}^{a_2} D_{k_1k_2}}
$$
实际上，上述归一化密度的定义对于空解集的定义并不好，这就是为什么在密度函数的定义中假设解集是非空的原因。我们将给空解集的熵赋值为0来表示最坏的情况，即0的多样性。现在我们有:
$$
\sum_{k_1=1}^{a_1}\sum_{k_2=1}^{a_2} \rho_{k_1k_2} = 1\\
\rho_{k_1k_2} \geq 0,\forall k_1,k_2
$$
这样一个分布的熵可以定义为:
$$
H = -\sum_{k_1=1}^{a_1}\sum_{k_2=1}^{a_2} \rho_{k_1k_2}ln(\rho_{k_1k_2})
$$
并且，对于m维目标空间，将目标空间中的可行域划分为a13a23。3am细胞，熵定义为:
$$
H = -\sum_{k_1=1}^{a_1}\sum_{k_2=1}^{a_2}...\sum_{k_2=1}^{a_m} \rho_{k_1k_2...k_m}ln(\rho_{k_1k_2...k_m})
$$
熵值越大的解集在目标空间的可行域内分布越均匀，覆盖范围越广。

#### Sigma diversity metric

提出了计算目标空间中解的位置的Sigma多样性度量。

如下图：

![](spreadanduniformity\17.png)

上左图，对于每一个线，都有$f_2 = af_1$，因此，$\sigma $ 便为：
$$
\sigma = \frac{ f_1^2 - f_2^2 }{f_1^2 + f_2^2}
$$
所有的在此线上的点都满足 $f_2 = af_1$ ，也就都有相同的 $\sigma = \frac{1-a^2}{1 + a ^2}$ 

在一般情况下，$\sigma$ 被定义为 $ C_m^2$ 个元素的向量，其中m是目标空间的维数。在这种情况下，$\sigma$的每个元素都是上式中两个坐标的组合。例如f1、f2、f3三个坐标，定义如下:(如上又图)
$$
\sigma =\begin{pmatrix}
   f_1^2 - f_2^2 \\
   f_2^2 - f_3^2 \\ 
   f_3^2 - f_1^2
  \end{pmatrix} /(f_1^2 + f_2^2 +f_3^2)
$$
例，$\sigma = (0 \ 0.5 \ -0.5)$ 时，$f_1 = 1,f_2 = 1,f_3 = 0$ 带入上面即可。 

这意味着目标空间中的每个点都可以用向量来描述。直线上的所有点都有相同的向量在非常接近的直线上的解都有相似的向量。这是用来构造多样性度量的思想。

在计算近似集的多样性之前，必须先计算一组reference lines(参考线)。参考线数必须等于近似解的个数。必须强调的是，每个目标的参考线必须计算一次，并且可以存储在一个表中。那么Sigma多样性度量可以计算如下:

- 计算参考线

- 计算每条参考线的向量(参考向量 reference sigma vector)。

- 在每个参考向量旁边保留一个初始值为零的二进制标记。每个引用的旗帜 $\sigma$ 向量为 1,当至少有一个解决方案有一个向量 $\sigma$ 等于它或在一个距离(欧式距离)低于d。d的值取决于测试函数,但是它应该减少当有大量的参考线时。

- 计数器C对标记为1的引用行进行计数，多样性度量D变为：
  $$
  D = \frac{C}{number \ of \ reference \ lines}
  $$
  Sigma多样性度量表示的是在目标空间中非支配解的分布百分比

在极值解位于坐标轴上的情况下，我们可以得到D的一个高值，即,100%。对于离散解集或不连通解集，D的值永远达不到最大值。

由上式中的D可知，如果D的值很高，就意味着解的分布很好。但当D很小时，它意味着解是：

- 集中在空间的一部分
- 分布在前沿的小群体中

的确，这两种解决方案之间存在差异。下图显示了具有相同D值的两组解之间的差异。这两组解有不同的扩展，Sigma多样性度量无法区分它们。

红线是红点所占的reference lines；黑线是红黑点所占的reference lines。可以看到都是6条！

![](spreadanduniformity\18.png)

#### $\mathcal{M} ^\* _2$ 

Analogously, we define one metric  $\mathcal{M}_2^\*$  and on the objective space. Let $Y',\bar{Y} \subseteq Y$ be the sets of **objective vectors** that correspond $X'$  to $\bar{X}$ and , respectively, and $\sigma ^\* > 0$ and $|| \cdot ||^\*$ as before:

公式：
$$
\mathcal{M}^*_2({Y'}):=\frac{1}{|Y'-1|}\sum _{p'\in Y'} \{q' \in Y'; ||p'- q'||^* > \sigma ^*\}
$$








