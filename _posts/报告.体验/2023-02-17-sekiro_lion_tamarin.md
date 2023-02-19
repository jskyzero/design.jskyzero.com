---
layout: post
title: 拆包看狮子猿动作设计
categories: [游戏分析]
---

近期通过拆包工具浏览了只狼的狮子猿的一阶段动画，这里进行一个记录和总结，用于后续设计参考。



# 《只狼》狮子猿动作设计分析

## 分布总览

故事的起因是想参考狮子猿的动作，但是发现没有办法从中提炼出待机动作，一些标志性的技能和部分位移动作是可以看出来的，但是始终还是觉得差了很多、不成体系，逼不得已，直接拆包用工具看看这只怪所有的动作资产。

对只狼的拆包和分析分析过程可以参考下图，感兴趣的同学可以查看[只狼解包介绍](https://www.bilibili.com/video/BV1rf4y1h7QZ)。

![](/assets/img/gameplay/sekiro_lion_tamarion/1.jpg)

考虑到逆向工程总是有损的，以及作者精力有限，部分猜想内容没有进行严格验证，本文还是希望将重点放在**对动画的分析给设计带来的启发**上。

> 本文也没有结合只狼AI的反编译进行更进一步的分析说明，拆包后的AI配置可以反编译得到LUA的描述，配合动作在一起看，应该也能看出很多东西，不过狮子猿不是人形敌人，可能没有打断拼刀的逻辑，总之，本文还是聚焦在攻击行为的设计上。

在对内容初步地分析综合后，得到了下面这个供参考的状态机，从状态机上我们也可以得到一些初步的结论

![](/assets/img/gameplay/sekiro_lion_tamarion/2.jpg)


+ “占比过半”的演出动作

图上：绿色表示演出动作，黄色和红色表示攻击动作，其中黄色代表“花样动作”——**不太容易记住**的“花里胡哨”的攻击动作，而红色则代表能**给人留下深刻印象**的“标志性”动作，图上不包含一些周边动作——后文甚至也有一小节单独讲这部分。

从颜色的分布上，我们可以初步看出各中动作之间的比例：

<img style="min-height:300px; object-fit:cover" src="https://mermaid.ink/svg/pako:eNqrVkrOT0lVslIqyExVKMksyUlVeLZ-ypN93U872l629sbkKQBBjNKzPVOetu962rXiyd45MUoKVgpGBjCpF10bny3YjlXq2YL2p_unI0kZGijpKOWmFuUmZqYA7awGKYxRKslIzU2NUbICMlNS0xJLc0pilGLyaoFKE0tL8oMr85KVrEqKSlN1lEoLUhJLUl0yE9OLEnOVrNISc4pTawGytE4v" >

<!-- https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqrVkrOT0lVslIqyExVKMksyUlVeLZ-ypN93U872l629sbkKQBBjNKzPVOetu962rXiyd45MUoKVgpGBjCpF10bny3YjlXq2YL2p_unI0kZGijpKOWmFuUmZqYA7awGKYxRKslIzU2NUbICMlNS0xJLc0pilGLyaoFKE0tL8oMr85KVrEqKSlN1lEoLUhJLUl0yE9OLEnOVrNISc4pTawGytE4v -->

其中非攻击性动作的演出动作竟然占比来到了40%，考虑到攻击动作中势必也会有个性体现的演出，四舍五入玩家的感受中已经过半了！非常夸张！

> 当然，玩家的感受，是动作受到AI控制后播放的结果，和直接的动作比例是有差别的。这也是为什么会将攻击动作划分为：容易记住的、不容易记住的两部分，来展开叙述。

+ “深度深、派生广”的招式

图上连线代表着动画的Pose衔接，为了方便查看，这里给三大出招派生路线添加了背景色，这些招式派生十分复杂，**攻击深度可以轻松突破5**，怪不得打狮子猿时，能感受到“连绵不绝的攻击”带来的强烈压迫感。




## 演出动作

## 攻击动作

## 特色动作

## 周边动作

## 总结