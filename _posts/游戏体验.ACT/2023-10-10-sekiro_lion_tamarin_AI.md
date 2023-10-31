---
layout: post
title: 拆包看狮子猿AI设计
categories: [动作游戏分析]
---

之前拆包看了[只狼的狮子猿的一阶段动画](https://design.jskyzero.com/2023/02/17/sekiro_lion_tamarin/)，本文则会对怪物的AI进行一些讨论和分析，并对之前文章的一些错误结论进行勘误。

本文的目标是以狮子猿一阶段**成熟完备的AI**为例子，让读者能对动作游戏中AI的设计有一个初步的理解，并分析一些对实际工作中设计有启发的逻辑细节。本文会分为三个部分：初步的体验反推、拆包后对主AI分析的架构设计、以及细节和感受分析和讨论。


# 拆包看狮子猿AI设计


## 初步的体验反推

首个尝试，和狮子猿录了一段素材，用肉眼将动作与之前的状态机进行匹配，得到了如下的结果：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/1.png)

> 全程视频可参考：[Bilibili 笨办法](TODO)

其中的标注和动画状态机对应如下表所示：

|标注|类别|动画|
|--|--|--|
|连段1|花里胡哨类|3019;3020|
|连段2|花里胡哨类|3000;3001|
|连段2.变种|花里胡哨类|3000|
|连段3|花里胡哨类|3003;3004|
|连段4|花里胡哨类|3021|
|跳跃攻击|记忆点类|3014|
|红光1|记忆点类|3016|
|空窗期|表演类|四方向闪避位移|
|空窗期|表演类|原地吼，3018|


### 交错比例与招式CD

从这个视频中我们可以得出一些初步的结论:


+ 攻击与空隙交错，比例是？

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/2.png)

大体上，狮子猿会维持如上图所示【攻击，空窗期】这样的单元重复，以此营造出凶猛进攻和灵动移动结合的交手体验。

其中，攻击的长度观察为1-4个完整招式，而空窗期通常为一次闪避位移。


+ 招式没有复读，CD是？
  
![](/assets/img/gameplay/sekiro_lion_tamarion_ai/3.png)

将招式分别拆开，我们会发现同个招式没有连续两次出现的情况。观察两个招式之间的最短间隔时长（从上一个末尾到下一个的开始）：


|标注|最短时间间隔约|动画|
|--|--|--|
|连段1||3019;3020|
|连段2与变种|6|3000;3001|
|连段3||3003;3004|
|连段4|6|3021|
|跳跃攻击|50|3014|
|红光1|9|3016|
|空窗期|5|四方向闪避位移|


### 用行为树的简单拟合

总结一些关键结论：

1. 攻击行为与空窗期相间
2. 攻击行为自身有间隔

我们可以使用行为树对这个`出招序列`进行一个简单的拟合：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/4.png)

这个决策逻辑逻辑看起来很简单，因为这段战斗也只是一个局部序列，有着一定的局限性，不过还是做一个思考练习，如何让这个逻辑变得更好？

+ 与战斗进程挂钩的空窗间隔

简单来说，通过**控制空窗期的CD来控制玩家的战斗压力**，结合一个能反映玩家战斗进程的数值——比如血量或者时间，就可以形成差异化的心流体验或者战斗历程。

+ 更加复杂且细致的条件

和上面的思路类似，我们可以**为不同的技能设置除了CD以外更加细致的条件**，比如关联自身血量，对于只狼来说，基础重要属性还有自身的架势槽；对于一个常规的动作游戏，还可以关联敌我的空间位置关系等条件。

+ 攻击前的调整位置

对于一个动作游戏，招式的适用打击距离，一般是有限的。比如一个前冲拳，能冲的距离可能最多4米，那么对于4米外的目标，可能就**需要先靠近目标再释放**，不然就会形成空挥的体验（当然，空挥也是一种体验！）。对于4米内过近的目标，可能也需要先远离，避免一些不好的表现。

这部分可以通过设置招式前的距离检测来避免。这些检测相应的也会造成限制从而降低释放的可能性，这是一个取舍问题。

+ 小结

以传统而经典的行为树配置方法的话，对狮子猿AI的分析大致如上所述。当然，文章的长度已经出卖了作者，下文才是本次分析的重点，但是上文所叙述一些经典分析方法乃至思路也是相当重要的。

那么话不多说，我们来看看拆包/反编译后的狮子猿AI的LUA脚本。


## 基于LUA的架构设计

接下来我们讨论一些架构相关的话题，有时会使用行为树来对比。


### 决策与逻辑分离

拆包后的lua文件大致如下所示：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/5.png)


> 原始内容可以参考：[狮子猿 510000_battle.dec.lua](/assets/img/gameplay/sekiro_lion_tamarion_ai/510000_battle.dec.lua)，后文部分内容涉及到[蝴蝶夫人 509000_battle.dec.lua](/assets/img/gameplay/sekiro_lion_tamarion_ai/509000_battle.dec.lua)


最外层是若干函数，如下图所示这里将其分了四类，具体的逻辑我们将在第三部分展开叙述。

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/6.png)


和传统的行为树比，有一个非常具体的区别，只狼（或者说FromSoftware的游戏）的AI是将主决策逻辑和行为逻辑分开的。比如上图所示的`Activate`函数里面是主决策逻辑，里面会在一定条件下调用不同的`ActXX`系列函数。

这样做有什么好处呢？我认为是**高效复用**和**分离逻辑**。


#### 高效复用

先从高效复用说起，在行为树的语境里，如果**在两个地方都需要同一段逻辑**，最简单的方法是直接拷贝一串逻辑过去，这样会很简单，但是问题就是，下次修改时，容易遗漏，或者出其他差错。

相对完善的方法是，**编写一个AI子树**，去定义一些传递的黑板变量，但是这个操作的成本就会变高，普遍需要管理独立的新文件，增加心智上的负担。

而使用脚本语言，则可以利用编程语言自带的函数的语法，来高效实现这一过程。（这里并不是说使用LUA脚本，就比行为树要好，只是各自有不同的特点。）

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/7.png)


#### 分离逻辑

另一个话题则是分离逻辑，如果你配置过复杂AI的话，应该能理解**AI设计的核心问题之一，就是解决复杂度的问题**，这需要工程学的方法、可扩展且表达力强的通用架构、编写时符合直觉的逻辑思路等等……

**将问题划分、以大化小的分治法**也是核心思路之一，将行为逻辑和决策逻辑分开，能让双方聚焦各自的问题：决策逻辑负责复杂的条件检测，调用行为；而行为逻辑则只解决一个具体行为的实现，这里也可能会有一定的条件检测。但是是服务于这个行为的。这样，在面对复杂逻辑时，就可以将复杂逻辑化为若干部分，分别实现，避免干扰。

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/8.png)


> 一个类似思路的、在软件工程的语境的例子是[MVC架构（Model-View-Controller，模型-视图-控制器）](https://developer.mozilla.org/en-US/docs/Glossary/MVC)。将软件分为：数据描述相关、处理交互视图相关、处理如何控制数据相关，三个部分各司其职，避免互相干涉带来的心智负担。


### 带条件检测的行为队列

本小节我们聚焦到一个具体的行为的架构设计。比如【靠近，A招式，B招式】的一个行动序列。

在行为树的语境中，会使用运行节点来描述一个耗时的行为，大概会如下图所示去实现：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/9.png)


想象一下这样的命令在Lua的一个函数中应该怎样描述实现？对于单个命令，下达单个的命令指令就行，但是当涉及到一连串连续执行的命令，就会麻烦一些。


#### 行为队列

答案是维护一个行为的“队列”，对于【靠近，A招式，B招式】这个序列，就添加靠近，A招式，B招式三个命令，等到执行的时候按照队列的先进先出的顺序挨个执行。

```lua
arg1:AddSubGoal(GOAL_COMMON_ApproachTarget, f3_local4, TARGET_ENE_0, f3_local1, TARGET_SELF, f3_local3, -1)
arg1:AddSubGoal(GOAL_COMMON_ComboTunable_SuccessAngle180, 10, f3_local5, TARGET_ENE_0, 999, 0, 0, 0, 0)
arg1:AddSubGoal(GOAL_COMMON_ComboRepeat_SuccessAngle180, 10, f3_local6, TARGET_ENE_0, 999, 0, 0, 0, 0)
```

类似下图，这是Act01行为的**两个攻击的添加命令的代码**和**开发者工具观察实际执行的Goal队列**

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/10.png)


可以观察到，添加命令（或者，行动目标，这里维持统一还是使用命令这个词）时候，有非常多的参数，除了常规描述行为是啥的自身关键参数，还有一个时间参数。主要是用于避免操控的对象一致处于某个行为中，给个超时。

> 在只狼的架构中，这个时间在自己执行的时候才会开始倒数，还有一种做法是，在添加入执行队列就开始倒数，应该也是一种规则。


#### 条件检测的时效性

找了一个移动和释放攻击的命令的指令，大概对应的一下参数的含义，如下图所示。

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/11.png)

+ 对于移动来说，当达到距离时则视为成功，这里是用作判断持续行为的成功结束条件。
+ 而对于释放攻击老说，如果不满足释放距离则会释放失败，这里是用作开始执行的前置条件。

留意**开始执行的前置条件**，在添加命令的时候就可以进行一次检测，那为什么不在添加命令的时候就进行检测呢？对比下面这两个例子：

+ 添加指令时检测距离

```lua
-- 添加指令时检测距离
AddGoal_BlaBla(1, 10, 9999) -- 添加释放攻击动作1、时间10秒、释放前检测9999米
if L < 5 then -- 判断距离小于5米
    AddGoal_BlaBla(2, 10, 9999) -- 添加释放攻击动作2、时间10秒、释放前检测9999米
end
```

+ 指令执行时检测距离


```lua
-- 指令执行时检测距离
AddGoal_BlaBla(1, 10, 9999) -- 添加释放攻击动作1、时间10秒、释放前检测9999米
AddGoal_BlaBla(2, 10, 5) -- 添加释放攻击动作2、时间10秒、释放前检测5米内
```

其实标注已经暴露了核心问题，添加指令时和指令执行时，可能不是同一时刻，而这个单独的检测选项就是解决这个问题，**确保能在指令执行时，进行检测。**

听起来有点像打补丁的做法，解决的核心问题是：决策进行的瞬间，一次性可能添加了很多动作序列；序列靠后被执行的单个动作，轮到这个它的时候，前置条件已经失去了意义。

在行为树的语境中其实不存在这个问题，运行节点会完美过渡时间，轮到这个节点执行前才会真的进行这个节点的检测，但也可能，就是因为这种模糊性，会带来类似“空挥”的体验，这里不再展开讨论了。


### 其他架构逻辑

这里讨论一些其他的、用于逻辑表达的小设计。


#### 行为概率与行为CD

前面我们提到过，由决策逻辑调用行动逻辑的函数：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/13.png)

但是这个过程还是挺有意思的，并没有直接去调用函数，而是使用概率做中转，再去调用对应的函数。

```lua
-- 首先整了几个“表格”做中转
local f2_local0 = {}
local f2_local1 = {}
local f2_local2 = {}

-- 当决策的时候，
-- 将X号行为的发生概率储存到，0号表格，Key为X的值里
if f2_local5 >= 18 then
    f2_local0[6] = 50
    f2_local0[15] = 800
    f2_local0[18] = 50
    f2_local0[19] = 50
    f2_local0[43] = 100
elseif f2_local5 >= 12 then
-- ...
elseif f2_local5 >= 5 then
-- ...
end

-- 检查冷却，如果不满足，概率直接打到1
f2_local0[1] = SetCoolTime(arg1, arg2, 3000, 15, f2_local0[1], 1)
f2_local0[2] = SetCoolTime(arg1, arg2, 3003, 15, f2_local0[2], 1)
-- ...
f2_local0[46] = SetCoolTime(arg1, arg2, 3005, 10, f2_local0[46], 1)

-- 将X号行为的函数储存到，1号表格，Key为X的值里
f2_local1[1] = REGIST_FUNC(arg1, arg2, arg0.Act01)
f2_local1[2] = REGIST_FUNC(arg1, arg2, arg0.Act02)
-- ...
f2_local1[48] = REGIST_FUNC(arg1, arg2, arg0.Act48)

-- 最后调用，根据0号表格的概率调用 1号表格储存的函数行为
-- 此处函数完整内容可参考
-- aicommon-luabnd-dcx\script\ai\out\bin\common_battle_func.dec.lua
Common_Battle_Activate(arg1, arg2, f2_local0, f2_local1, f2_local13, f2_local2)
```

如果上面的内容稍微有点复杂，没关系，举个具体的例子：

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/14.png)

在某个情形下，如果我们决定使用Act01和Act02行为，且概率为100:50，那么我们**并不会直接进行随机数的比较后调用函数**，而是会将概率储存下来，同时将行为也储存下来，两者维持下标相同。这样脱钩后，甚至还可以进行一次CD的检测，如果不满足CD，则可以直接将概率打到最小，（为1不为0也处理了所有行为都CD时，至少可以随机出结果。）最后，再根据概率去调用对应的行为。

这样做的好处是显而易见的，它允许我们**将可用性检测——比如CD或者其他规则，放在决策之后**，一方面保证了可用性的筛选，另一方面也避免了先进行可用性检测的麻烦，甚至概率为1而不为0的小细节，也覆盖了全部行为都在CD的边界情况。

> 在行为树的语境中，先进行可用性检测可以使用封装了自规划的算法的节点，选取可用性最高的行为。
>
> 在实际的工作中，有时没有规划算法的节点，最常见的情形和解决是，检测到攻击仍然处于CD，干脆失败向后决策，用发呆来作为保底。


#### 信息感知与标记BUFF

对于一个动作游戏的AI，除了常规的HP、MP、位置等信息，对于敌我**动作状态**的检测逻辑应该会很多，动作游戏嘛，玩的就是动作之间的规则。

只狼也不例外，一些信息的获取、判断如下所示：

```lua
-- Goal.Activate 局部变量
local f2_local3 = arg1:GetHpRate(TARGET_SELF)
local f2_local4 = arg1:GetSpRate(TARGET_SELF)
local f2_local5 = arg1:GetDist(TARGET_ENE_0)
local f2_local6 = arg1:GetRandam_Int(1, 100)
local f2_local7 = arg1:GetExcelParam(AI_EXCEL_THINK_PARAM_TYPE__thinkAttr_doAdmirer)
local f2_local8 = arg1:GetEventRequest()
local f2_local9 = arg1:GetEventRequest(1)
local f2_local10 = arg1:GetDistY(TARGET_SELF)
local f2_local11 = arg1:GetDistY(TARGET_ENE_0)
local f2_local12 = arg1:HasSpecialEffectId(TARGET_SELF, 200050)
-- Goal.Activate 变量检测
elseif not not arg1:HasSpecialEffectId(TARGET_ENE_0, 110060) or arg1:HasSpecialEffectId(TARGET_ENE_0, 110010) then
        f2_local0[39] = 100
elseif Common_ActivateAct(arg1, arg2) then
```

总结归纳一下，常规的信息大致包括这些：

+ 属性类
  + HP
  + SP
  + 固有Excel变量
+ 空间类
  + 敌我距离
  + 距地面高度
  + 敌我角度
  + 障碍物检测
+ 随机类
  + 随机整数
  + 随机小数

而关于动作的检测，除了一些经过封装的函数或者事件，大部分都是用标记BUFF实现的。

一个很典型的例子是蝴蝶夫人的弹反动作，左方向8400，右方向8401，分别添加了200211和200210，两个不同的标记异常状态，这样AI就可以通过检测对于的标记buff，来知道是蝴蝶夫人是在左弹还是右弹。

![](/assets/img/gameplay/sekiro_lion_tamarion_ai/12.png)

再进一步，可以根据左右弹设计不同的出招逻辑：

```lua
-- 509000 蝴蝶夫人
-- Goal.Kengeki_Activate 逻辑判断
    elseif f48_local0 == 200210 then
        if f48_local4 >= 4 then
            f48_local1[50] = 100
        elseif SpaceCheck(arg1, arg2, 180, 4) == false then
            f48_local1[6] = 20
            f48_local1[10] = 80
        else
            f48_local1[1] = 15
            f48_local1[9] = 15
            f48_local1[10] = 100
        end
    elseif f48_local0 == 200211 then
        if f48_local4 >= 4 then
            f48_local1[50] = 100
        elseif SpaceCheck(arg1, arg2, 180, 4) == false then
            f48_local1[6] = 40
            f48_local1[10] = 60
        else
            f48_local1[1] = 40
            f48_local1[9] = 20
            f48_local1[10] = 60
        end
```

猜测接口上，除了自己给自己加标记buff，应该也是可以定向给敌人加的。

小结一下：以标记buff作为检测动作的中间层，可以一定程度上让逻辑与具体的Action检测脱钩，避免AI与动作的强耦合，带来修改时的麻烦。但是也会需要buff自身是一个简单易用、高效的功能。


#### 计时器/角色变量/事件与打断

这里是发现到的一些适用于逻辑编写的功能。

+ 计时器

上文提到CD其实也是一种计时器，有些时候如果要控制指定逻辑出现的间隔，就可以使用计时器，大概有以下功能：

```lua
-- 开始计时，参数1是记时器的编号，参数2是计时器的倒计时时间
arg0:SetTimer(2, 8)
-- 比较指定计时器的现在的记时
arg1:GetTimer(10) > 0
-- 检测指定计时器的记时是否结束
arg1:IsFinishTimer(3) == true
```

只狼的计时器大概是只有16个，事实上也足够了。

+ 角色变量

使用角色变量可以方便的在不同逻辑之前储存信息、检查信息：

```lua
-- 设置指定变量到指定值
arg1:SetNumber(11, 0)
-- 设置指定变量自增
arg1:SetNumber(2, arg1:GetNumber(2) + 1)
-- 检测指定变量的值
arg1:GetNumber(1) == 1
```

之前在哪里看到过好像4号变量和弹刀有关，记不清了，可见有些变量应该是全角色通用、有统一含义的。

变量的槽位好像也是16个，和计时器一样，固定数目一方面一般不会达到上限，另一方面也可以保证实现起来较为简单、性能开销较为可控。16这个数值感觉是个可参考值。


+ 事件与打断

严格意义上感觉不能叫事件，或者叫监听？当发生一些事件时，就会打断原有决策，重新进行打断决策。


```lua
-- 添加区域监听
arg0:AddObserveArea(0, TARGET_SELF, TARGET_ENE_0, AI_DIR_TYPE_F, 360, 8)
-- 删除区域监听
arg1:DeleteObserve(3)
-- 判断打断类型：在区域外打断
arg1:IsInterupt(INTERUPT_Outside_ObserveArea)

-- 添加Buff监听
arg1:AddObserveSpecialEffectAttribute(TARGET_SELF, 5025)
-- 判断打断Buff类型
arg1:GetSpecialEffectActivateInterruptType(0) == 5039

-- 处理打断
Goal.Interrupt = function (arg0, arg1, arg2)
    -- ...
    -- 打断后检测使用道具！药检.jpeg
    if Interupt_Use_Item(arg1, 5, 10) then
        arg1:Replanning()
        return true
    end
    -- ...
end
```

在打断的逻辑里面看到了使用道具，难道药检的逻辑也在这里？

事件与打断为AI提供了一种针对环境的变化快速反应的能力——反应性，合理使用这部分机制，可以让AI更加生动。但这部分逻辑如果过于“单薄”，也会很容易被玩家利用。


#### 封装

封装也是


## 感受与细节设计


### 主决策逻辑


### 行为逻辑


### 剑戟（弹刀）逻辑


## 总结

