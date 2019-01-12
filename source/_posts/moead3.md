---
title: MOEA/D算法(三)
date: 2019-01-02 09:17:02
categories: MOEA
tags: 
- MOEA
- MOEA\D
mathjax: true
description:
---

“MOEA/D: A Multiobjective Evolutionary Algorithm Based on Decomposition”第三部分，论文中一些具体的细节。

<!--more-->

### 测试函数
以下为具体函数，和所给定的前端解
- ZDT1
  $$
  f_1(1)=x_1
  \\f_2=g(x)[1-\sqrt{\frac{f_1(x)}{g(x)}}]
  \\where \quad g(x)=1 + \frac{9(\sum_{i=2}^{n}{x_i})}{n-1}
  \\x=(x_1,...x_n) ，x_1\in [0,1]^n,n=30
  $$
![](moead3\ZDT1.png)




- ZDT2
  $$
  f_1(x) = x_1
  \\f_2=g(x)[1-(\frac{f_1(x)}{g(x)})^2]
  \\where \quad g(x)=1 + \frac{9(\sum_{i=2}^{n}{x_i)}}{n-1}
  \\x=(x_1,...x_n) ，x_1\in [0,1]^n,n=30
  $$
![](moead3\ZDT2.png)




- ZDT3
  $$
  f_1(x) = x_1
  \\f_2=g(x)[1-\sqrt{\frac{f_1(x)}{g(x)}}-\frac{f_1(x)}{g(x)}sin(10\pi x_1)]
  \\where \quad g(x)=1 + \frac{9(\sum_{i=2}^{n}{x_i)}}{n-1}
  \\x=(x_1,...x_n) ，x_1\in [0,1]^n,n=30
  $$
![](moead3\ZDT3.png)




- ZDT4
  $$
  f_1(x) = x_1
  \\f_2=g(x)[1-\sqrt{\frac{f_1(x)}{g(x)}}]
  \\where\quad g(x)=1 + 10(n-1)+\sum_{i=2}^{n}[x_i^2-10cos(4\pi x_i)]
  \\x=(x_1,...x_n) ，x_1\in [0,1] \times [-5,5]^{n-1},n=10
  $$
![](moead3\ZDT4.png)




- ZDT6
  $$
  f_1(x)=1-exp(-4x_1)sin^6(6\pi x_1)
  \\f_2=g(x)[1-(\frac{f_1(x)}{g(x)})^2]
  \\g(x)=1 + 9[\frac{\sum_{i=2}^{n}{x_i}}{n-1}]^{0.25}
  \\x=(x_1,...x_n) ，x_1\in [0,1]^n,n=10
  $$
![](moead3\ZDT6.png)




- DTLZ1
  $$
  f_1(x)=(1+g(x))x_1x_2
  \\f_2(x)=(1+g(x))x_1(1-x_2)
  \\f_3(x)=(1+g(x))(1-x_1)
  \\where\quad g(x)=100(n-2)+100\sum_{i=3}^{n}{\{(x_i-0.5)^2-cos[20\pi (x_i-0.5)]\}}
  \\x=(x_1,...,x_n)^T \in [0,1]^n,n=10
  $$
  The function value of a Pareto optimal solution satisfies$\sum_{i=1}^{3}{f_i}=1,f_i \geq0$
![](moead3\DTLZ1.png)




- DTLZ2
  $$
  f_1(x)=(1+g(x))cos(\frac{x_1\pi}{2})cos(\frac{x_2\pi}{2})
  \\f_2(x)=(1+g(x))cos(\frac{x_1\pi}{2})sin(\frac{x_2\pi}{2})
  \\f_3(x)=(1+g(x))sin(\frac{x_1\pi}{2})
  \\where\quad g(x)=\sum_{i=3}^{n}{x_i^2},
  \\x=(x_1,...x_n)^T\in [0,1]^2\times [-1,1]^{n-2},n=10
  $$
  The function value of a Pareto optimal solution satisfies$\sum_{i=1}^{3}{f_i}^2=1,f_i \geq0$
![](moead3\DTLZ2.png)




### 基本参数设置

```matlab
N=300;%种群大小
T=20;%邻居规模大小
max_gen=250;%进化代数
pc=1;%交叉概率
pm=1/x_num;%变异概率
fun='DTLZ2';%有 ZDT1 ZDT2 ZDT3 ZDT4 ZDT6 DTLZ1 DTLZ2
yita1=2;%模拟二进制交叉参数2
yita2=5;%多项式变异参数5
x_num =  ;%根据以上每一个函数的定义
f_num = ;%根据以上每一个函数的定义
```

### 权值向量初始化

```matlab
function lamda = genrate_lamda( N,f_num )
%产生初始化向量lamda
lamda2=zeros(N+1,f_num);%初始化
if f_num==2
    array=(0:N)/N;%均匀分布的值
    for i=1:N+1
            lamda2(i,1)=array(i);
            lamda2(i,2)=1-array(i);
    end
    len = size(lamda2,1);
    index = randperm(len);
    index = sort(index(1:N));
    lamda = lamda2(index,:);
elseif f_num==3
    k = 1;
    array = (0:25)/25;%产生均匀分布的值
    for i=1:26
        for j = 1:26
            if i+j<28
                lamda3(k,1) = array(i);
                lamda3(k,2) = array(j);
                lamda3(k,3) = array(28-i-j);
                k=k+1;
            end
        end
    end
    len = size(lamda3,1);
    index = randperm(len);
    index = sort(index(1:N));
    lamda = lamda3(index,:);
end
end

```
### 建立权值向量的邻域
```matlab
B=look_neighbor(lamda,T);
```
其中`look_neighbor.m`为：

```matlab
function B = look_neighbor( lamda,T )
%计算任意两个权重向量间的欧式距离
N =size(lamda,1);
B=zeros(N,T);
distance=zeros(N,N);
for i=1:N
    for j=1:N
        l=lamda(i,:)-lamda(j,:);
        distance(i,j)=sqrt(l*l');
    end
end
%查找每个权向量最近的T个权重向量的索引
for i=1:N
    [~,index]=sort(distance(i,:));
    B(i,:)=index(1:T);
end
```



### 种群初始化

```matlab
function X = initialize( N,f_num,x_num,x_min,x_max,fun )
%   种群初始化
X = repmat(x_min,N,1)+rand(N,x_num).*repmat(x_max-x_min,N,1); 
for i=1:N
    X(i,(x_num+1:(x_num+f_num))) = object_fun(X(i,:),f_num,x_num,fun);
    X(i,(x_num+f_num+1)) = 0;
end
```

其中`object_fun.m`:

```matlab
function f = object_fun( x,f_num,x_num,fun )
%   测试函数的设置
%--------------------ZDT1--------------------
if strcmp(fun,'ZDT1')
    f=[];
    f(1)=x(1);
    sum=0;
    for i=2:x_num
        sum = sum+x(i);
    end
    g=1+9*(sum/(x_num-1));
    f(2)=g*(1-(f(1)/g)^0.5);
end
%--------------------ZDT2--------------------
if strcmp(fun,'ZDT2')
    f=[];
    f(1)=x(1);
    sum=0;
    for i=2:x_num
        sum = sum+x(i);
    end
    g=1+9*(sum/(x_num-1));
    f(2)=g*(1-(f(1)/g)^2);
end
%--------------------ZDT3--------------------
if strcmp(fun,'ZDT3')
    f=[];
    f(1)=x(1);
    sum=0;
    for i=2:x_num
        sum = sum+x(i);
    end
    g=1+9*(sum/(x_num-1));
    f(2)=g*(1-(f(1)/g)^0.5-(f(1)/g)*sin(10*pi*f(1)));
end
%--------------------ZDT4--------------------
if strcmp(fun,'ZDT4')
    f=[];
    f(1)=x(1);
    sum=0;
    for i=2:x_num
        sum = sum+(x(i)^2-10*cos(4*pi*x(i)));
    end
    g=1+9*10+sum;
    f(2)=g*(1-(f(1)/g)^0.5);
end
%--------------------ZDT6--------------------
if strcmp(fun,'ZDT6')
    f=[];
    f(1)=1-(exp(-4*x(1)))*((sin(6*pi*x(1)))^6);
    sum=0;
    for i=2:x_num
        sum = sum+x(i);
    end
    g=1+9*((sum/(x_num-1))^0.25);
    f(2)=g*(1-(f(1)/g)^2);
end
%--------------------------------------------
%--------------------DTLZ1-------------------
if strcmp(fun,'DTLZ1')
    f=[];
    sum=0;
    for i=3:x_num
        sum = sum+((x(i)-0.5)^2-cos(20*pi*(x(i)-0.5)));
    end
    g=100*(x_num-2)+100*sum;
    f(1)=(1+g)*x(1)*x(2);
    f(2)=(1+g)*x(1)*(1-x(2));
    f(3)=(1+g)*(1-x(1));
end
%--------------------------------------------
%--------------------DTLZ2-------------------
if strcmp(fun,'DTLZ2')
    f=[];
    sum=0;
    for i=3:x_num
        sum = sum+(x(i))^2;
    end
    g=sum;
    f(1)=(1+g)*cos(x(1)*pi*0.5)*cos(x(2)*pi*0.5);
    f(2)=(1+g)*cos(x(1)*pi*0.5)*sin(x(2)*pi*0.5);
    f(3)=(1+g)*sin(x(1)*pi*0.5);
end
%--------------------------------------------
end
```

### 交叉变异操作

#### 模拟二进制交叉(SBX)

`for j = 1.....x_num`
$$
x'_{1j}(t)=0.5\times[(1+\lambda_j)x_{1j}+(1-\lambda_j)x_{2j}(t)]
\\x'_{2j}(t)=0.5\times[(1-\lambda_j)x_{1j}+(1+\lambda_j)x_{2j}(t)]
$$


其中：
$$
\lambda_j=\begin{cases} 
		(2u_i)^{\frac{1}{\eta+1}}, & u_j < 0.5\\ 
		\frac{1}{2(1-u_i)}^{\frac{1}{\eta+1}}, & other 
	\end{cases}
$$


随机$u_j$，使$0 \leq u_j \leq 1$.

`endfor`

#### 多项式变异

`for j = 1.....x_num`
$$
x_{1j}(t)=x_{1j}(t) + \Delta_j
$$
其中：
$$
\Delta_j=\begin{cases}
	(2u_i)^{\frac{1}{\eta+1}}-1, & u_j < 0.5\\ 
		1-(2(1-u_i))^{\frac{1}{\eta+1}}, & other 
\end{cases}
$$
随机$u_j$，使$0 \leq u_j \leq 1$.

`endfor`

```matlab
function chromo_offspring = cross_mutation( chromo_parent_1,chromo_parent_2,f_num,x_num,x_min,x_max,pc,pm,yita1,yita2,fun )
%模拟二进制交叉与多项式变异
%%%模拟二进制交叉
if(rand(1)<pc)
    %初始化子代种群
    off_1=zeros(1,x_num+f_num);
    %进行模拟二进制交叉
    u1=zeros(1,x_num);
    gama=zeros(1,x_num);
    for ind=1:x_num
        u1(ind)=rand(1);
        if u1(ind)<=0.5
            gama(ind)=(2*u1(ind))^(1/(yita1+1));
        else
            gama(ind)=(1/(2*(1-u1(ind))))^(1/(yita1+1));
        end
        off_1(ind)=0.5*((1-gama(ind))*chromo_parent_1(ind)+(1+gama(ind))*chromo_parent_2(ind));
        %使子代在定义域内
        if(off_1(ind)>x_max(ind))
            off_1(ind)=x_max(ind);
        elseif(off_1(ind)<x_min(ind))
            off_1(ind)=x_min(ind);
        end
    end
    %计算子代个体的目标函数值
    off_1(1,(x_num+1):(x_num+f_num))=object_fun(off_1,f_num,x_num,fun);
end
% %%%多项式变异           注释这种方法为上方公式代码，但在ZDT4，DTLZ1中效果不好，
% if(rand(1)<pm)         因此换成下方代码，效果甚好！
%     u2=zeros(1,x_num);
%     delta=zeros(1,x_num);
%     for j=1:x_num
%         u2(j)=rand(1);
%         if(u2(j)<0.5)
%             delta(j)=(2*u2(j))^(1/(yita2+1))-1;
%         else
%             delta(j)=1-(2*(1-u2(j)))^(1/(yita2+1));
%         end
%         off_1(j)=off_1(j)+delta(j);
%         %使子代在定义域内
%         if(off_1(j)>x_max(j))
%             off_1(j)=x_max(j);
%         elseif(off_1(j)<x_min(j))
%             off_1(j)=x_min(j);
%         end
%     end
%     %计算子代个体的目标函数值
%     off_1(1,(x_num+1):(x_num+f_num))=object_fun(off_1,f_num,x_num,fun);
% end
% chromo_offspring=off_1;
% end
%%%多项式变异   具体改变：一次变异只改变一个位置，并不是像之前那样都要变异
if(rand < pm)
        r=randperm(x_num);
        ind=r(1);
        u2=rand;
        if(u2 < 0.5)
            delta=(2*u2)^(1/(yita2+1))-1;
        else
            delta=1-(2*(1-u2))^(1/(yita2+1));
        end
        off_1(ind)=off_1(ind)+delta*(x_max(ind)-x_min(ind));
        %使子代在定义域内
        if(off_1(ind)>x_max(ind))
            off_1(ind)=x_max(ind);
        elseif(off_1(ind)<x_min(ind))
            off_1(ind)=x_min(ind);
        end
    %计算子代个体的目标函数值
    off_1(1,(x_num+1):(x_num+f_num))=object_fun(off_1,f_num,x_num,fun);
end
chromo_offspring=off_1;
end
```

### 更新领域解

```matlab
X=updateNeighbor(lamda,z,X,B(i,:),off,x_num,f_num);
```

其中`updateNeighbor.m`：

```matlab
function X = updateNeighbor( lamda,z,X,Bi,off,x_num,f_num )
%更新领域解
for i=1:length(Bi)
    gte_xi=tchebycheff_approach(lamda,z,X(Bi(i),(x_num+1):(x_num+f_num)),Bi(i));
    gte_off=tchebycheff_approach(lamda,z,off(:,(x_num+1):(x_num+f_num)),Bi(i));
%     gte_xi=ws_approach(lamda,X(Bi(i),(x_num+1):(x_num+f_num)),Bi(i));
%     gte_off=ws_approach(lamda,off(:,(x_num+1):(x_num+f_num)),Bi(i));
    if gte_off <= gte_xi
        X(Bi(i),:)=off;
    end
end


```

其中`tchebycheff_approach.m`：

```matlab
function fs = tchebycheff_approach( lamda,z,f,i)
%tchebycheff_approach
for j=1:length(lamda(i,:))
    if(lamda(i,j)==0)
        lamda(i,j)=0.00001;
    end
end
fs=max(lamda(i,:).*abs(f-z));
end
```

### 评价指标

#### C-metric

令 A和 B是一个 MOP中两个接近PF的集合，定义 C(A,B)如：
$$
C(A,B)=\frac{\{u\in B|\exists v\in A:v\quad dominates\quad u\}}{|B|}
$$
C(A,B)不等于 1-C(B,A)。C(A,B)=1意味着 B中所有的解都被 A中的某些解支配了， C(A,B)=0意味着 B中没有解被 A中的解支配。

```matlab
function C_AB = cal_c(A,B,f_num)
[temp_A,~]=size(A);
[temp_B,~]=size(B);
number=0;
for i=1:temp_B
    nn=0;
    for j=1:temp_A
        less=0;%当前个体的目标函数值小于多少个体的数目
        equal=0;%当前个体的目标函数值等于多少个体的数目
        for k=1:f_num
            if(B(i,k)<A(j,k))
                less=less+1;
            elseif(B(i,k)==A(j,k))
                equal=equal+1;
            end
        end
        if(less==0 && equal~=f_num)
            nn=nn+1;%被支配个体数目n+1
        end
    end
    if(nn~=0)
        number=number+1;
    end
end
C_AB=number/temp_B;
end
```



#### D-metric

令 $P^\*$为一组均匀分布在 PF上的点集合。  A是一个接近 PF的集合。 的集合。 $P^\*$到 A的平均距离定义为：
$$
D(A,P)=\frac{\sum_{v\in P^*}d(v,A)}{|P^*|}
$$

这里 $𝑑(𝑣,𝐴)$是v和A中的点最小欧式距离。如果 $P^\*$足够大,说明其可以很好的代表PF。$D(A,P^\*)$可以从某种意义上评估A的收敛性和多样。为了让$D(A,P^\*)$的值很低，必须设置 A非常接近PF，并且不能缺失整个PF的任何部分。

```matlab
function D_AP = cal_d(A,P)
[temp_A,~]=size(A);
[temp_P,~]=size(P);
min_d=0;
for v=1:temp_P
    d_va=(A-repmat(P(v,:),temp_A,1)).^2;
    min_d=min_d+min(sqrt(sum(d_va,2)));
end
D_AP=(min_d/temp_P);
end
```


























'





