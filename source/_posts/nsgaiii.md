---
title: NSGA-III
date: 2019-03-28 20:36:16
categories: MOEA
tags: 
- MOEA
mathjax: true
---

这个算法是慕名而来，之前学习的两个算法都用到了一致性点作为参考点，而这个算法也是比较经典的算法，就来学习学习。

An Evolutionary Many-Objective Optimization Algorithm Using Reference-point Based Non-dominated Sorting Approach, Part I: Solving Problems with Box Constraints

*Kalyanmoy Deb, Fellow, IEEE and Himanshu Jain*

<!--more-->

![](NSGAIII\1.png)

可以看到还是先一层一层的留下(收敛性)，如果数量有多余的，需要从加入一些特殊的规则，保持住多样性。多样性的话，就要有对应的参考点，然后利用个体与参考点的关系，选择出更有前景的个体，直至个体数到规定个数。

#### 参考点选择

![](NSGAIII\2.png)

参考点就是在以ideal point为原点，在m维空间上，确定一个m-1的平面，均匀分布的点，个数可参考如下公式，用之前学过的概率论的格式，就是那个 $C$ 的样子，一般的问题是已知 $m$ (目标函数个数)、种群数，我要找到与种群数与相接近的 $H$。此时一下公式的 $p$ 便为未知量， $p$ 在几何中的意义就是，把坐标平均分成 $p$ 份，上图 $p=4$， $m=3$，$H=15$。
$$
H =\left(
\begin{matrix}
M + p-1 \\
p 
\end{matrix}
\right)=\left(
\begin{matrix}
M + p-1 \\
M - 1 
\end{matrix}
\right) = C^{p}_{M+p-1}
$$
解释：这个用到了高中学过的小球问题，有 $p$ 个不作区分的小球放到 $m$ 个作区分的篮子里，篮子可以可以有多少种情况，数学公式为：
$$
f_1 + f_2+... + f_m = p
\\ f_i \geq 0 \ and \ f_i \in Z,\ \forall i \in [1,m]
$$
从而也可以转化为：
$$
f_1 + f_2+... + f_m = p + m
\\ f_i \geq 1 \ and \ f_i \in Z,\ \forall i \in [1,m]
$$
可以想象有 $p+m$ 个小球排成一排，因为每个篮子里均要有小球，因此这些小球形成的间隔共有 $p +m -1$ 个，共放 $m-1$个隔板，因此会得出结果。

#### 平面确定

这样如果确定了平面，我们可以求得一致性点，那么如何求出这个平面。

以 $m=3$ 为例，也就是说，通过某种规则，找到这三个点，$z^{1,max},z^{2,max},z^{2,max}$ 组成的平面来找一致性点。再求出与坐标轴形成的截距：$a_1,a_2,a_3$ 。

![](NSGAIII\4.png)

下图为实例：黑色的为 $z^{1,max},z^{2,max},z^{2,max}$ 。

![](NSGAIII\3.png)



那 $z^{1,max},z^{2,max},z^{2,max}$ ,怎么求呢，先介绍一个函数，在MOMBI-II也用到了，但是策略不同：
$$
ASF(x,W) = \max_{i=1}^{M}f'_i(x)/w_i \quad for \ x \in S_t
$$
理解：所谓极端点就是找到在一个维度上很大，在另外两个维度上的值很小的个体。

假设我要求出 $z^{1,max}$ ，我就在每一个维度上除以1、1e6、1e6。这样我就可以抽出另两个维度的目标值，并取出最大的那个目标值，为什么要取出最大的呢？因为我要找到除了第一维度另两个维度都很小的值，第一次要取出最大的，再对每一个个体的最大的那个取出最小的，那么这个个体的另一个目标值(除了第一维度的那个目标值)肯定会更小，这样才能保证另外两个维度上的值很小。具体操作如下line-4：

![](NSGAIII\5.png)

翻译一下就是：

- 对于每一个维度操作
  - 找到此维度最小的值
  - 此维度上都减掉它
  - 求出$z^{j,max}$
- 计算截距
- 每一个点都要$\frac{f_i(x)-z_i^{min}}{a_i - z_i^{min}}$  这步相当于把这个超平面的截距都变成成(1,...,1)

那么我知道了这三个极端点，如何**求出截距**呢？如下：

以三维为例：

平面方程式为：$ax + by + cz + d = 0$ 。

我想求的截距便为：
$$
\left[
\begin{matrix}
-d/a \\
-d/b \\
-d/c 
\end{matrix}
\right]
$$
此时我们已知三个点坐标，也就可以知道，下面的方阵：
$$
\left[
\begin{matrix}
x_{11} & x_{12} & x_{13} \\
x_{21} & x_{22} & x_{23} \\
x_{31} & x_{32} & x_{33}
\end{matrix}
\right] \left[
\begin{matrix}
a \\
b \\
c 
\end{matrix}
\right] =\left[
\begin{matrix}
-d \\
-d \\
-d 
\end{matrix}
\right]
$$
继续化简：
$$
\left[
\begin{matrix}
x_{11} & x_{12} & x_{13} \\
x_{21} & x_{22} & x_{23} \\
x_{31} & x_{32} & x_{33}
\end{matrix}
\right] \left[
\begin{matrix}
-a/d \\
-b/d \\
-c/d 
\end{matrix}
\right] =\left[
\begin{matrix}
1 \\
1 \\
1 
\end{matrix}
\right]
$$
因此：
$$
\left[
\begin{matrix}
-a/d \\
-b/d \\
-c/d 
\end{matrix}
\right] =inv(\left[
\begin{matrix}
x_{11} & x_{12} & x_{13} \\
x_{21} & x_{22} & x_{23} \\
x_{31} & x_{32} & x_{33}
\end{matrix}
\right])\left[
\begin{matrix}
1 \\
1 \\
1 
\end{matrix}
\right] =\left[
\begin{matrix}
x_{11} & x_{12} & x_{13} \\
x_{21} & x_{22} & x_{23} \\
x_{31} & x_{32} & x_{33}
\end{matrix}
\right] \backslash \left[
\begin{matrix}
1 \\
1 \\
1 
\end{matrix}
\right]
$$
然后每一位均取倒数即可。高维度($m \geq 3$)的依此类推。

注意，如果矩阵E的秩小于m，那么这m个极限点就不能构成一个m维的超平面。甚至即使超平面能够建立，也可能在某些方向上得不到截距或某些截距 $a_i$ ，不满足 $a_i > z^\*_i$。在所有上述情形下，对于每一个 $i \in \{ i,...,m\}$ ，$z^{nad}_i$设置维 $S_t$ 中的非支配解在目标 $f_i$ 上的最大值。

在MATLAB代码中，如下：

```matlab
Extreme = zeros(1,M);
w       = zeros(M)+1e-6+eye(M);
for i = 1 : M
	[~,Extreme(i)] = min(max(PopObj./repmat(w(i,:),N,1),[],2));
end
Hyperplane = PopObj(Extreme,:)\ones(M,1);
a = 1./Hyperplane;
if any(isnan(a))
	a = max(PopObj,[],1)';
end
```

#### 个体对参考点链接

效果如下：

![](NSGAIII\6.png)

算法流程：

![](NSGAIII\7.png)

此时这个超平面的各各截距均为1，每一个个体也都适应性拉伸，此时原点与一致性点连接所形成的射线，对于每一个 $S_t$ 个体，找到离它最近的射线，测量距离，如上上图，并对这些个体记录那个参考点，距离是多少。

并且记录 $P_{t+1} = S_t/F_l$ 在每个参考点周围的个数。**这很重要！！**
$$
j \in Z^r:\rho_j = \sum_{S \in S_t/F_l}((\pi(s)=j)?1:0)
$$

#### 选择机制

流程如下：

![](NSGAIII\9.png)

为看着直观，下图为，$S_t,P_{t+1},F_l$ 之间的关系，但仅仅是为了理解，作图很不严谨！

![](NSGAIII\8.png)
记录 $P_{t+1} = S_t/F_l$ 在每个参考点周围的个数。**这很重要！！**
$$
j \in Z^r:\rho_j = \sum_{S \in S_t/F_l}((\pi(s)=j)?1:0)
$$

- 找到计数最少的参考点集，并随机选择一个     ---- 可能因为少的地方更需要开拓空间

- 找到离此参考点最近的那些 $F_l$ 中个体              ---- 更能保证最后个体的一致性

- 如果有 $F_l$ 这些个体                                             ---- 存在添加的可能性，不然去哪加新个体

  - 这个参考点周围没有 $P_{t+1}$ 中的个体          ---- 原来的个体中没有在这参考点附近的
    - 选择 $F_l$ 中离此参考点最近的个体       ---- 当然要找离它最近的
  - 这个参考点周围有 $P_{t+1}$ 中的个体              ---- 原来的个体中有在这参考点附近的
    - 随便选一个$F_l$ 中在此参考点周围的个体 ---- 那就随便找好啦

  更新参数

- 没有 $F_l$ 这些个体                                                ---- 不存在添加的可能性

  - 以后不会考虑这个参考点了                       ---- 当然不会管这个参考点

重复以上操作直至选择的数量够了。注意，添加进去的点，就会默认在 $P_{t+1}$ 中了。