---
layout: post
title: 用于AI的高级随机技术
featured-img: dmc5
mathjax: true
categories: [游戏开发]
---

本文会深入讲解游戏AI的随机算法，并附带通俗易懂的例子，严谨的模拟试验，和技法实用运用指南。

<!--more-->

# 用于AI的高级随机技术


![](https://img.shields.io/badge/游戏AI-blue.svg?style=flat)
![](https://img.shields.io/badge/随机-blue.svg?style=flat)
![](https://img.shields.io/badge/作者-jskyzero-brightgreen.svg?style=flat)
![](https://img.shields.io/badge/日期-2021/09/09-brightgreen.svg?style=flat)

![]({{site.img_url}}/skill/RandomInGameAI/1 (3).jpg)

+ 本文最初为神秘组织编写。希望大家都能深入理解艺术与科学
+ 本文主要讨论游戏AI，或者[人工（キズナ）智障（アイ）](https://www.youtube.com/channel/UC4YaOt1yT-ZeyB0OmxHgolA)
+ 本文最初以为会涉及计算机科学，实际没有，放在这里吓唬人
+ 本文包含概率论，但是不用怕，**<u>作者概率论学得没你好</u>**
+ 本文参考了[Game AI Pro](http://www.gameaipro.com/)的文章，基本上是搬运工性质，翻新了文中的试验，添加了与时俱进的例子
+ 作者会从读者的角度揣测可能的疑问，并先手提出解答，如果遗漏可以联系作者
+ 本文使用python语言，但是不要怕，反正正常人都看不懂，天书没有区别
+ 本文例子大量使用神秘组织所推崇的游戏《SEKIRO》，很遗憾例子没能全部使用此游戏


## 随机的意义

> 重复着无数相同的动作，我是为了表演而生，
>
> 而表演……是为了取悦你。——《人偶自白》

![]({{site.img_url}}/skill/RandomInGameAI/1 (6).jpg)

总所周知，游戏AI为了良好游戏体验服务。——后边部分的定义基本是句废话，过分感性。不同游戏类型目标体验之间的差距，比人和人的差距还要大。

为此，这里引入消费时经常使用的“质量”的概念来分析一个游戏的体验

+ 从微观上来说，要讲究质：
  + 体验要达到类型预期及格线，有基本的保真度
  + 体验要结构完整，有始有终
  + 部分好游戏的部分体验会“大大超出预期”
+ 从宏观上来说，要讲究量：

TODO 以下施工中

![]({{site.img_url}}/skill/RandomInGameAI/1 (7).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (8).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (9).jpg)


## 随机的类型

> 不重复别人是重要的。
>
> 不重复自己是尤其重要的。——（中国作家）陈祖芬


### 均等分布

![]({{site.img_url}}/skill/RandomInGameAI/1 (11).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (12).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (13).jpg)


### 高斯分布

![]({{site.img_url}}/skill/RandomInGameAI/1 (14).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (15).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (16).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (17).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (18).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (19).jpg)


### 柏林噪声

![]({{site.img_url}}/skill/RandomInGameAI/1 (20).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (21).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (22).jpg)


## 虚伪的随机


> 正确的结果，是从大量错误中得出来的；
>
> 没有大量错误作台阶，也就登不上最后正确结果的高座。——钱学森


### 随机值筛选

![]({{site.img_url}}/skill/RandomInGameAI/1 (24).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (25).jpg)
![]({{site.img_url}}/skill/RandomInGameAI/1 (26).jpg)


## 总结与参考


![]({{site.img_url}}/skill/RandomInGameAI/1 (1).jpg)

