---
title: MOMBI-II
date: 2019-03-21 21:29:04
categories: indicator-based
tags: 
- indicator-based
- MOEA
mathjax: true
---

本想在复现的上一个算法AR-MOEA中加上一点小修改，我思来想去觉得每一个步骤都无懈可击。。。于是我意识到可能是论文读的太少，于是又选了一个indicator-based的多目标优化算法学习一下——MOMBI-II，这个算法过程较AR-MOEA比较简单，此算法选择的indicator是**R2**但效果也不错，学习学习。

Improved Metaheuristic Based on the R2 Indicator for Many-Objective Optimization

*Raquel Hernandez Gomez, Carlos A. Coello Coello*

<!--more-->

### 规定

the ideal objective vector：$z^\*_i = \min_{\vec{x}}f_i(\vec{x})​$

the nadir objective vector: $z^{nad}_i = \max_{P^\*}f_i(\vec{x})$

indicator: R2
$$
R2(A,U) = \frac{1}{U}\sum_{u \in U}u^*(A)
$$
其中，$u^\*(A) = \min_{\vec{a} \in A} \{ u(\vec{a}) \}$，是在 $A$ 中最尤的效用值(utility value)。

一个测度叫做 achievement scalarizing function (**ASF**)：
$$
u_{asf}(\vec{v}:\vec{r},\vec{w}) = \max_{i \in \{1,...,m\} } \{\frac{|v_i - r_i|}{w_i} \}
$$
归一化：
$$
f'_i(\vec{x}) = \frac{f_i(\vec{x}) - z_i^{min}}{z_i^{max}-z_i^{min}}
\\ \forall i \in \{1,...,m\}
$$

### 算法流程

![](mombiii\1.png)

![](mombiii\2.png)

![](mombiii\3.png)

### 代码

借鉴了PlatEMO

```matlab
[alpha,epsilon,recordSize] = deal(0.5,0.001,5);
%% Generate random population
[W,N] = UniformPoint(N,M);
Population   = Initialization();
% Ideal and nadir points
zmin = min(Population_objs,[],1);
zmax = max(Population_objs,[],1);
% For storing the nadir vectors of a few generations
Record = repmat(zmax,recordSize,1);
Archive= Population_objs;
% For storing whether each objective has been marked for a few
% generations
Mark = false(recordSize,M);
% R2 ranking procedure
[Rank,Norm] = R2Ranking(Population_objs,W,zmin,zmax);
%% Optimization
while Global.NotTermination(Population)
    MatingPool  = TournamentSelection(2,N,Rank,Norm);
    Offspring   = GA(Population(MatingPool));
    Population  = [Population,Offspring];
    [Rank,Norm] = R2Ranking(Population_objs,W,zmin,zmax);
    [~,rank]    = sortrows([Rank,Norm]);
    Population  = Population(rank(1:Global.N));
    Rank        = Rank(rank(1:Global.N));
    Norm        = Norm(rank(1:Global.N));
    [zmin,zmax,Record,Mark] = UpdateReferencePoints(Population_objs,zmin,zmax,Record,Mark,alpha,epsilon);
```

`R2Ranking.m`

```matlab
function [Rank,Norm]  = R2Ranking(PopObj,W,zmin,zmax)
    N  = size(PopObj,1);
    NW = size(W,1);
    %% Normalize the population
    PopObj = (PopObj-repmat(zmin,N,1))./repmat(zmax-zmin,N,1);
    %% Calculate the L2-norm of each solution
    Norm = sqrt(sum(PopObj.^2,2));
    %% Rank the population
    Rank = zeros(N,NW);
    for i = 1 : NW
        ASF           = max(PopObj./repmat(W(i,:),N,1),[],2);
        [~,rank]      = sortrows([ASF,Norm]);
        [~,Rank(:,i)] = sort(rank);
    end
    Rank = min(Rank,[],2);
end
```

`UpdateReferencePoints.m`

```matlab
function [zmin,zmax,Record,Mark] = UpdateReferencePoints(PopObj,zmin,zmax,Record,Mark,alpha,epsilon)
    z      = min(PopObj,[],1);        % z*
    znad   = max(PopObj,[],1);        
    zmin   = min(zmin,z);
    Record = [Record(2:end,:);znad];
    v      = Record(end-1,:) - znad;  % 前一轮的zmax减去当前的zmax
    mark   = false(1,length(zmax));
    if max(v) > alpha                 % 如果差值大到一定程度，直接赋值
        zmax = znad;              
    else
        for i = 1 : length(zmax)      % 对每一个目标函数上的维度操作
            if abs(zmax(i)-zmin(i)) < epsilon
                zmax(i) = max(zmax);  % 如果在i-th维度上 zmax与新的zmin很接近，max(zmax)直接赋值到此维度上
                mark(i) = true;
            elseif znad(i) > zmax(i)  
                zmax(i) = 2*znad(i) - zmax(i);% 如果在i-th维度上，当前种群最大的大于zmax(i)
                mark(i) = true;
            elseif v(i)==0 && ~any(Mark(:,i)) % 如果在i-th维度上,与之前没有变：差值为0，并且 第i列Mark全为0
                zmax(i) = (zmax(i)+max(Record(:,i)))/2; % 此维度上Record的最大值与原来的zmax取平均值
                mark(i) = true;
            end
        end
    end
    Mark = [Mark(2:end,:);mark];
end
```

### 过程理解

#### Ranking

其中主要的代码就是这个：

```matlab
Rank = zeros(N,NW);
for i = 1 : NW
	ASF           = max(PopObj./repmat(W(i,:),N,1),[],2);
	[~,rank]      = sortrows([ASF,Norm]);
	[~,Rank(:,i)] = sort(rank);
end
Rank = min(Rank,[],2);
```

可以看到`max`中便是开头介绍的 $u_{asf}$ 算法，公式：	

$$
u_{asf}(\vec{v}:\vec{r},\vec{w}) = \max_{i \in \{1,...,m\} } \{\frac{|v_i - r_i|}{w_i} \}
$$

- 首先遍历每一个一致性点`W(i,:)`，此时因为已经归一化，因此 $\vec{r} = \vec{0}$，用每一个个体**点除**一致性点向量($\vec{v}$)，因为在一个循环中，`W(i,:)`是不变的，因此相当于对每一维度的轴进行线性拉伸(点除)。
- 对得到的矩阵每一行取最大，翻译一下就是找到可以包含住此点的最小边长的立方体(假设三维，高维同理)，此立方体的边长就是 $\max_{i \in \{1,...,m\} } \{\frac{|v_i |}{w_i} \}$，也可以说拉伸后据原点的最大棋盘距离。
- 紧接着就是`sortrows`，翻译一下：先对ASF这个向量排序，如果相同的话，再按向量Norm排序。
- 再对上面的输出索引`sort`，翻译一下：对`[ASF,Norm]`进行离散化(ACM中术语-小弘说)，赋值成`1~size(ASF,1)`的整数值。如果假设数值越小越好，那于对第 i 列的向量，每一个个体都赋予一个等级
- 最后`min(Rank,[],2)`翻译一下：查看每一个个体的历史纪录，取它曾经最好(小)的一次。

有必要解释一下主函数里的这两步：

```matlab
[Rank,Norm] = R2Ranking(Population_objs,W,zmin,zmax);
[~,rank]    = sortrows([Rank,Norm]);
```

根据进化进程，`Rank`中会有大量的`[1 1 1...2 2 2...]`这种重复的元素，也就是说，对于`[1...1]`对应的个体来说，他们都再某个一致性点向量`W(i,:)`的结果中当过最最小，都“优秀”过。因此他们都是1，对于`Rank`中都是2的个体，同理。从这个角度来说，同为一个等级的个体都很好，但由于尺寸限制，可能不能都保留，这个时候便可以进一步比较他们到原点的(欧式)距离，对于minimize问题，当然越小越好，因此`sortrows([Rank,Norm])`。

#### update reference point

这个我理解不了，只能复述一下代码过程，复述内容见上方的代码注释。
