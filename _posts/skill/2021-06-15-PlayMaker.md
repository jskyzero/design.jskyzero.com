---
layout: post
title: PlayerMaker与关卡脚本
featured-img: besiege
mathjax: true
categories: [Unity, Summary]
---

制作关卡离不开脚本逻辑的组合，本文将以PlayeMaker为切入点谈谈脚本与关卡制作。

<!--more-->


# PlayerMaker与关卡脚本
`jskyzero` `2021/05/25`


## 工具的必要性

为什么我们需要一个工具来组织逻辑？

使用C#作为描述语言，借助UNITY引擎内部的MonoBehavior的“生命周期”逻辑，可以原生的访问所有接口，C#作为一门面向对象的高级编程语言的表达能力、架构能力。使用编程语言的调试灵活度，似乎可以作为默认的、同时也是极其强大的解决方案。


https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW-ino-WGs-aWueahiF0gLS0-fOWMheaLrHwgQihDIyDnvJblhpnpgLvovpHku6PnoIEpXG4gICAgQ3vor4Tku7fkuIDnp43op6PlhrPmlrnmoYh9XG4gICAgQyAtLT5EW-ihqOi-vuiDveWKm-W8ul1cbiAgICBEIC0tPkQxW-iEmuacrOaOpeWPo11cbiAgICBEIC0tPkQyW-mAu-i-kei3s-i9rF1cbiAgICBEIC0tPkQzW-WPmOmHj11cbiAgICBEIC0tPkQ0W-mAu-i-keadoeS7tl1cblxuXG5cbiAgICBDIC0tPkVb5a655piT57u05oqkXVxuICAgIEUgLS0-RTFb5Y-v6K-75oCnXVxuICAgIEUgLS0-RTJb5a2m5Lmg5oiQ5pysXVxuICAgIEUgLS0-RTNb6LCD6K-VXVxuXG4gICAgQyAtLT5GW0Nhcl0iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGVmYXVsdFwiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ


## PlayMaker概览

PlayMaker可以用来组织条件和逻辑操作，是逻辑的一种组织方式。

+ 使用状态作为基本组织单位，使用状态机的跳转组织逻辑
  + 状态中包含脚本操作
  + 脚本操作（或者外界行为）触发事件
  + 事件触发状态的跳转
+ 抽象的变量“机制”、丰富的已有控件

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW-eBr-aYr-eBreeahF0gLS0-fOW8gOeBr-WujOaIkHwgQlvnga_mmK_kuq7nmoRdXG4gICAgQiAtLT585YWz54Gv5a6M5oiQfCBBXG5cbiAgICBBMVvnga_mmK_nga3nmoRdIC0tPnzljIXlkKt8IEQo5byA54Gv5Yqo5L2cKVxuICAgIEQgLS0-IHzmiafooYzlrox8IEQxKOWFs-eBr-WujOaIkOS6i-S7tilcblxuICAgIEIxW-eBr-aYr-S6rueahF0tLT585YyF5ZCrfCBFKOWFs-eBr-WKqOS9nClcbiAgICBFIC0tPiB85omn6KGM5a6MfCBFMSjlhbPnga_lrozmiJDkuovku7YpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/edit##eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW-eBr-aYr-eBreeahF0gLS0-fOW8gOeBr-WujOaIkHwgQlvnga_mmK_kuq7nmoRdXG4gICAgQiAtLT585YWz54Gv5a6M5oiQfCBBXG5cbiAgICBBMVvnga_mmK_nga3nmoRdIC0tPnzljIXlkKt8IEQo5byA54Gv5Yqo5L2cKVxuICAgIEQgLS0-IHzmiafooYzlrox8IEQxKOWFs-eBr-WujOaIkOS6i-S7tilcbiAgICBcbiAgICBCMVvnga_mmK_kuq7nmoRdLS0-fOWMheWQq3wgRSjlhbPnga_liqjkvZwpXG4gICAgRSAtLT4gfOaJp-ihjOWujHwgRTEo5YWz54Gv5a6M5oiQ5LqL5Lu2KSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)


<!-- ### 教程：灯的开关

+ 状态
+ 事件
+ 状态机的跳转
+ 操作：GUI组件（点击）
+ 事件


### 教程：宝箱的开关

+ 过渡状态
+ 操作：动画播放

### 教程：触发器

+ 触发器
+ 触发器脚本，事件
+ 操作：GUI TEXT

### 尝试：自定义脚本

+ 模板
+ 注释 -->