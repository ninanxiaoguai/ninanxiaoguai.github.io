---
title: "代码学习"
date: 2019-03-15 12:28:17
categories: matlab
tags: 
- MOEA
- matlab
mathjax: true
---

最近在复现AR-MOEA算法，虽说是复现，但目前的想法是从PlatEMO中把代码抠出来，我大致的看了一下代码，里面的代码很简洁，其中通过一些函数调用矩阵操作，从而大大的减少了for循环的使用。因此，想要通过这次解构AR-MOEA算法，储备一些常用的Matlab函数。另外，PlatEMO真的是神器！复现的很多很多算法，和常用的一些测试函数等等，很巧的是，AR-MOEA算法和PlatEMO是同一作者，哈哈哈哈。

说明一点：源代码用了很多结构体的东西，我都拆解了一下。。。这个和之前发过的Matlab常用函数可能有所重复，暂时没有想好究竟属于哪一部分，但重要的不是先记录下来吗？
<!--more-->

#### 初始化种群

##### binary：

```matlab
randi ：生成**均匀分布**的伪随机整数。
randi(imax)：产生一个位于(0,imax]之间的整数。
randi(imax,n,m)：产生一个位于（0,imax]之间的n*m的矩阵，所有元素都是整数。
randi([imin,imax],n,m)：产生一个位于[imin,imax]之间的n*m的矩阵，所有的矩阵元素都是整数。
>> randi(10)
ans =

     8
     
>> randi(5,2,3)
ans =
     1     4     3
     4     5     1
     
>> randi([0,1],3,4)
ans =
     1     1     0     0
     1     1     0     0
     0     0     1     1
```

##### permutation

```matlab
rand：生成均匀分布的伪随机数。分布在（0~1）之间
rand(m,n)生成m行n列的均匀分布的伪随机数
>> rand(3,4)
ans =
    0.8328    0.7083    0.7038    0.5311
    0.4554    0.3543    0.6873    0.4308
    0.8578    0.1437    0.0276    0.8191
    
>> sort(ans,2)
ans =
    0.5311    0.7038    0.7083    0.8328
    0.3543    0.4308    0.4554    0.6873
    0.0276    0.1437    0.8191    0.8578
```

##### others

```matlab
unifrnd(A,B)：A，B，ans均为同纬度矩阵，以A(i,j)为下界与B(i,j)为上界，均匀分布产生ans(i,j)。
>> N = 5;
>> lower    = zeros(1,4);
>> upper    = ones(1,4);
>> unifrnd(repmat(lower,N,1),repmat(upper,N,1))
ans =
    0.0145    0.4117    0.6161    0.6673
    0.0026    0.5274    0.1487    0.3502
    0.5629    0.2023    0.9411    0.8544
    0.4124    0.6985    0.0984    0.1186
    0.0801    0.0631    0.5249    0.7846
```

#### 计算函数值

此样例为：DTZL1，形式如下：
$$
 f_1(x)=(1+g(x))x_1x_2
  \\f_2(x)=(1+g(x))x_1(1-x_2)
  \\f_3(x)=(1+g(x))(1-x_1)
  \\where \ g(x)=100(n-2)
  +100\sum_{i=3}^{n}{\{(x_i-0.5)^2-cos[20\pi (x_i-0.5)]\}}
  \\x=(x_1,...,x_n)^T \in [0,1]^n,n=10
$$
比较简单的写法：

```MATLAB
ha = [];
for ii = 1:N
    x = Population(ii,:);
    f=[];
    sum=0;   
    for i=3:D
        sum = sum+((x(i)-0.5)^2-cos(20*pi*(x(i)-0.5)));
    end
    g=100*(D-2)+100*sum;
    f(1)=(1+g)*x(1)*x(2);
    f(2)=(1+g)*x(1)*(1-x(2));
    f(3)=(1+g)*(1-x(1));
    ha(ii,:) = f / 2;
end

```

高阶一点的写法：

```matlab
M 为目标函数个数
D 为变量维度
g      = 100*(D-M+1+sum((PopDec(:,M:end)-0.5).^2-cos(20.*pi.*(PopDec(:,M:end)-0.5)),2));
PopObj = 0.5*repmat(1+g,1,M).*fliplr(cumprod([ones(N,1),PopDec(:,1:M-1)],2)).*[ones(N,1),1-PopDec(:,M-1:-1:1)];

PopDec(:,M:end)-0.5).^2 = (x_i - 0.5)^2 ,i = 3:n
```

其中，`cumprod` 这个是第一次见：

```matlab
>> A = [1 2 3 4 5];
>> B = cumprod(A)                   % A为向量连乘的形式
B =
     1     2     6    24   120
     
>> A = [1 4 7; 2 5 8; 3 6 9]
A =
     1     4     7
     2     5     8
     3     6     9
>> B = cumprod(A)                  % 对矩阵A做列累积相乘
B =
     1     4     7
     2    20    56
     6   120   504
     
>> A = [1 3 5; 2 4 6]              % 对矩阵A做行累积相乘
A =
     1     3     5
     2     4     6
>> B = cumprod(A,2)
B =
     1     3    15
     2     8    48
```

`fliplr`

将矩阵A的列绕垂直轴进行左右翻转 matabc 
如果A是一个行向量，fliplr(A)将A中元素的顺序进行翻转。 
如果A是一个列向量，fliplr(A)还等于A。

```matlab
>> A =[1 4;2 5;3 6]
A =
     1     4
     2     5
     3     6

>> fliplr(A)
ans =
     4     1
     5     2
     6     3
```

#### 生成一致性参考点

如下图：

![](learningofcode\1.png)

`b = nchoosek(n,k)` 返回二项式系数，定义为 `n!/((n–k)! k!)`。这就是从 `n` 项中一次取 `k` 项的组合的数目。说白了就是概率论里的 $C_n^k$ 。

`C = nchoosek(v,k)` 返回一个矩阵，其中包含了从向量 `v` 的元素中一次取 `k` 个元素的所有组合。矩阵 `C` 有 `k` 列和 `n!/((n–k)! k!)` 行，其中 n 为 `length(v)`。

```matlab
>> nchoosek(5,3)
ans =
    10
>> v = 2:2:10;
C = nchoosek(v,4)       % 在[2 4 6 8 10] 这5个元素中取出4个的具体例子，列举出来
C =
     2     4     6     8
     2     4     6    10
     2     4     8    10
     2     6     8    10
     4     6     8    10
```

并且通过几行代码，即可生成均匀的参考点：

```matlab
    H1 = 1;
    while nchoosek(H1+M,M-1) <= N
        H1 = H1 + 1;
    end
    W = nchoosek(1:H1+M-1,M-1) - repmat(0:M-2,nchoosek(H1+M-1,M-1),1) - 1;
    W = ([W,zeros(size(W,1),1)+H1]-[zeros(size(W,1),1),W])/H1;
```

#### 交配池

`pdist2`函数是求两个点集的欧式距离(默认)

```matlab
Cosine = 1 - pdist2(PopObj,RefPoint,'cosine');  % 此距离为夹角余弦距离,因为函数自带了 1-Cosine，因此要再减回去。
```

`cosine`夹角余弦距离：
$$
d_{s,t} = 1 - \frac{x_sx_t'}{||x_s||_2 . ||x_t||_2}
$$
`true` 生成logical的数组

```
K>> true(1,5)

ans =
  1×5 logical 数组
   1   1   1   1   1
```

#### 锦标赛选择

`varargin` 表示用在一个函数中，输入参数不确定的情况，这增强了程序的灵活性。
              例如：function g=fun(f,varargin)
              然后在程序中使用时，假如在调用函数时，intrans(f,a,b,c)，那么：varargin{1}=a,varargin{2}=b,varargin{3}=c

`cellfun` 是对cell进行操作的函数

```matlab
>> C = {1:10, [2; 4; 6], []}
>> cellfun(@mean, C)
ans =
    5.5000    4.0000       NaN
    
>> days = {'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'};
>> cellfun(@(x) x(1:3), days, 'UniformOutput', false)
ans =
  1×5 cell 数组
    'Mon'    'Tue'    'Wed'    'Thu'    'Fri'
```

`sortrows` 默认依据第一列的数值按升序移动每一行，如果第一列的数值有相同的，依次往右比较。例：

就是说，把每一行看作整体，先从第一列升序排列，遇到相同的，就比较第二列按升序，如果还有相同的就比较第三轮升序,.......依次

```matlab
A =
    95    45    92    41    13     1    84
    95     7    73    89    20    74    52
    95     7    73     5    19    44    20
    95     7    40    35    60    93    67
    76    61    93    81    27    46    83
    76    79    91     0    19    41     1
>> sortrows(A)
ans =
    76    61    93    81    27    46    83
    76    79    91     0    19    41     1
    95     7    40    35    60    93    67
    95     7    73     5    19    44    20
    95     7    73    89    20    74    52
    95    45    92    41    13     1    84
```

连续用两个`sort` ，第一次见到这种操作，很有意思，把一组数进行替换，替换成他在这组数中的升序排名。如果原向量是适应度，那么就可以替换成1~N的序号

```matlab
>> a = [1.1 3.1 5.1 7.1 4.1 2.1 6.1]
>> [~,i] = sort(a)
i =
     1     6     2     5     3     7     4
>> [~,ii] = sort(i)
ii =
     1     3     5     7     4     2     6
% 原代码
>> [~,rank] = sortrows([varargin{:}]);
>> [~,rank] = sort(rank);
```

使用randi来进行随机选择 K 元锦标赛的序号

```matlab
Parents  = randi(length(varargin{1}),K,N) % N 是种群个数
```

先通过`rank(Parents)`来通过序号找到对应的适应度值，用`min` 来找到每一列的最小值(函数输入时对适应度去负了)

```matlab
[~,best] = min(rank(Parents),[],1);
```

最后，`best`是一系列1、2组合的矩阵，再通过一下变换可求出结果

```matlab
index    = Parents(best+(0:N-1)*K);
```

#### 更新参考点

`unique` 对向量去重，并且从小到大排序输出。

`ismember` 

```matlab
>> a=[1 2 3 4 5];
>> b=[3 4 5 6 7];
>> c=[2 4 6 8 10];
>> ismember(a,b)            % a中的每一个元素是否在b中
ans =
  1×5 logical 数组
   0   0   1   1   1
   
>> [lia,lib]=ismember(a,c)  % a在lib中对应位置在c上的索引，如有多个，取第一个
lia =
  1×5 logical 数组
   0   1   0   1   0
lib =                             
     0     1     0     2     0
```

#### 交叉操作

**binary**：

```matlab
% One point crossover
k = repmat(1:D,N,1) > repmat(randi(D,N,1),1,D);
k(repmat(rand(N,1)>proC,1,D)) = false;
Offspring1    = Parent1;
Offspring2    = Parent2;
Offspring1(k) = Parent2(k);
Offspring2(k) = Parent1(k);
Offspring     = [Offspring1;Offspring2];
```

**permutation**：

```matlab
% Order crossover
Offspring = [Parent1;Parent2];
k = randi(D,1,2*N);
for i = 1 : N
    Offspring(i,k(i)+1:end)   = setdiff(Parent2(i,:),Parent1(i,1:k(i)),'stable');
    Offspring(i+N,k(i)+1:end) = setdiff(Parent1(i,:),Parent2(i,1:k(i)),'stable');
end
```

**其他**：

```matlab
% Simulated binary crossover
beta = zeros(N,D);
mu   = rand(N,D);
beta(mu<=0.5) = (2*mu(mu<=0.5)).^(1/(disC+1));
beta(mu>0.5)  = (2-2*mu(mu>0.5)).^(-1/(disC+1));
beta = beta.*(-1).^randi([0,1],N,D);
beta(rand(N,D)<0.5) = 1;
beta(repmat(rand(N,1)>proC,1,D)) = 1;
Offspring = [(Parent1+Parent2)/2+beta.*(Parent1-Parent2)/2
                         (Parent1+Parent2)/2-beta.*(Parent1-Parent2)/2];
```

#### 变异操作

**binary**：

```matlab
% Bitwise mutation
Site = rand(2*N,D) < proM/D;
Offspring(Site) = ~Offspring(Site);
```

**permutation**：

```matlab
% Slight mutation
k = randi(D,1,2*N);
s = randi(D,1,2*N);
for i = 1 : 2*N
  if s(i) < k(i)
     Offspring(i,:) = Offspring(i,[1:s(i)-1,k(i),s(i):k(i)-1,k(i)+1:end]);
  elseif s(i) > k(i)
     Offspring(i,:) = Offspring(i,[1:k(i)-1,k(i)+1:s(i)-1,k(i),s(i):end]);
  end
end
```

**其他**：

```matlab
 % Polynomial mutation
Lower = repmat(lower,2*N,1);
Upper = repmat(upper,2*N,1);
Site  = rand(2*N,D) < proM/D;
mu    = rand(2*N,D);
temp  = Site & mu<=0.5;
Offspring       = min(max(Offspring,Lower),Upper);
Offspring(temp) = Offspring(temp)+(Upper(temp)-Lower(temp)).*((2.*mu(temp)+(1-...
                  2.*mu(temp)).*(1-(Offspring(temp)-Lower(temp))./...
                  (Upper(temp)-Lower(temp))).^(disM+1)).^(1/(disM+1))-1);
temp = Site & mu>0.5; 
Offspring(temp) = Offspring(temp)+(Upper(temp)-Lower(temp)).*(1-(2.*(1...
                  -mu(temp))+2.*(mu(temp)-0.5).*(1-(Upper(temp)-...
                  Offspring(temp))./(Upper(temp)-Lower(temp))).^(disM+1)).^(1/(disM+1)));
```

`hist`函数：

`hist(X,Y)`：X是一个事先给定的区间划分，统计Y在X这个区间划分下的个数，划分规则如下：

```matlab
>> a = randi(5,1,10)
a =
     2     1     4     2     1     2     4     2     3     1
>> k = hist(a,1:6)
k =
     3     4     1     2     0     0
     
b = [2.6     1     4     2     1     2     4     2     3     1];
>> k = hist(b,1:6)
k =
     3     3     2     2     0     0
     
>> a = [2.5     -10     4     2     1     2     4     2     3     1];
>> k = hist(a,1:6)
k =
     3     4     1     2     0     0    
% ----------------------------------------------------------------     
% 可以看到随机产生了1x10的[1~5]的整数向量a，那么函数结果为分别在:
% (-inf 1.5],(1.5 2.5],(2.5 3.5],(3.5 4.5],(4.5 5.5],(5.5 inf)
```

用处：

```matlab
PopObj   = [PopObj1;PopObj2];
Distance = pdist2(PopObj,Ref);     
[d,pi]   = min(Distance,[],2);
rho      = hist(pi(1:N_PopObj1),1:N_Ref);
% -----------------------------------------------------------------
% pi为PopObj到哪个Ref最近的index，rho即为离PopObj1种群最近的哪个Ref的对于所有Ref的计数量，
% 可用于NSGA-III中
```











































