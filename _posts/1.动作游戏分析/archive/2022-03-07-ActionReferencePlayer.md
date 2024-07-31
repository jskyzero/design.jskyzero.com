---
layout: post
title: 动作设计参考·角色篇
# categories: [游戏开发]
long-term-maintenance: true
---

本文希望充当一个索引，方便概览大量动作游戏中的动作设计。

> 本文现在已废弃，可以参考[迭代后的动作游戏设计参考索引](https://docs.qq.com/slide/DUmFsa1VlY3JOUlNR)


# 动作设计参考

本文只解决一个问题，要做一个动作的时候，参考美学表现、节奏、打击感等。

<!-- 
在正式的动作积累与讨论之前想重申——如何学习一个动作？

1. 动作种类和形式（本文主要）
2. 动作机制和实现（本文次要或者无）
-->


## NEW


### 街霸VI

+ 前瞻：[轻松上手一键出招！《街头霸王6》前瞻与系统介绍](https://www.bilibili.com/video/BV1JB4y1s7qi)
  + 现代模式（一键出招）
    + 必杀技：方向键+必杀技按钮
    + 超必杀技：方向键+2按钮
    + 自动连招：Assit按钮+攻击
  + 斗气系统，6格斗气槽
    + 出场满、自动恢复、打人或招架成功打加速恢复
    + 斗气招架：按住持续消耗，自动格挡，格挡成功恢复斗气；绝佳时机格挡，停止对方动作，慢动作演出，增加利于反击时间
    + 斗气迸发：接住攻击，释放打断；版边自动撞墙
    + 超载：EX技能
    + 突进：斗气招架（1格）or普通攻击（3格） 快速前冲
    + 格挡反击：（2格）取消防御硬直反击
  + 超级必杀技槽：3格，3种必杀技（继承）


### 艾尔登法环

+ 分类：
  + 近战武器：短剑、直剑、大剑、特大剑、刺剑、重刺剑、曲剑、大曲剑、打刀、双头剑、斧、大斧、槌、连枷、大槌、特大武器、矛、大矛、戟、镰刀、软鞭、拳头、小弓、长弓、大弓、弩、手杖、圣印记、火把、小盾、中盾、大盾
  + 魔法、祷告、战技
  + 攻击属性：魔力、火、雷、圣（冰冻、出血、咒死、中毒、猩红腐败）
+ 动作说明：
  + 短剑、直剑、大剑、特大剑：先横挥在斜挥收尾，次数分别为6、5、4、3
  + 刺剑、重刺剑：戳，次数为6，5
  + 曲剑、大曲剑：（类似大刀）横挥，打点偏上
  + 打刀：（武士刀）打点分布均衡
  + 斧、大斧：前者类似匕首，砸地收尾、后者主要是砸地
  + 槌、连枷、大槌、特大武器：前三者横挥，最后那个砸地三下
  + 矛、大矛、戟：全是戳
  + 镰刀：从外向中间砍
+ 魔法说明
  + 小光砾、大帚星、增强圆、大彗星、十二道流星、创星雨
  + 魔力弓、魔力弓4连、暗月、魔力大剑、魔力冰大剑横挥、镇定
  + 背后石砾、模糊石砾
  + 冰附魔、冰风暴、大范围结晶、小范围结晶、飞散结晶
  + 重力球、多颗重力球、3颗岩石块、大量陨石
  + 幽魂、烟雾、死者群
+ 祷告、战技：略过
+ 参考
  + [武器参考](https://eldenring.wiki.fextralife.com/Weapons)
  + [91种全战灰效果](https://www.bilibili.com/video/BV1q3411W7AJ)
  + [全武器展示+攻击派生展示](https://www.bilibili.com/video/BV1B54y1Z7VW)


### 地平线2 西之绝境

+ 分类：
  + 远程武器：猎手弓、射手弓、爆破弹弓、射钉枪、爆破枪、绳索枪
  + 属性：酸蚀、冰霜、火焰、爆破、等离子
+ 动作说明：
  + R1-R1-R1-R1：长矛横向基础四连
  + R1-停顿-R1 * N：单体
  + R1-R1-停顿-R1 * N：范围击退
  + R1-R1-R1-停顿-R1 * N：快速充能
+ 参考
  + [近战连招技能展示合集](https://www.bilibili.com/video/BV1Cu411D7M8)
  + [坚堡城墙-格斗场 极难难度](https://www.bilibili.com/video/BV1g44y1P7fv)


## 常规


### DNF

+ 分类：
  + 剑士、枪手、格斗家、法师、圣职者、刺客、缔造者、守护者、枪剑士
+ 动作说明：
  + 技能分布：30、35、40、45、一次觉醒、60、二次觉醒、三次觉醒
  + 鬼剑士：剑魂（剑气）、鬼泣（鬼神、暗）、狂战士（血气）、阿修罗（元素）
  + 神枪手：漫游枪手（浪漫）、弹药专家（属性）、机械师（召唤）、重炮师（重火力）
  + 格斗家：柔道（抓取）、散打（硬打）、毒王（异常）、气功（气功）
  + 圣职者：圣骑士（圣光）、驱魔师（物法）、蓝拳（格斗）、复仇者（暗）
  + 圣职者（女）：圣骑士（圣光）、异端审判者（火焰）、巫女（东方）、异端者（暗）
  + 暗夜使者：刺客（连击）、死灵法师（暗、召唤）、忍者（火焰）、影舞者（背后攻击）
  + 魔法师：元素（元素）、魔道（搞怪）、召唤（召唤）、战法（符文）
+ 参考
  + [FANDOM 地下城与勇士 维基百科](https://dnf.fandom.com/zh/wiki/%E8%81%8C%E4%B8%9A)


### 无双

+ 分类：
  + 5（太旧了，同太旧了被开除：6、7）：枪、刀、剑（双手）、扇、弓、棍、剑（单手）、鞭、戟、杖、锤
  + 8：长柄双刀，鸳鸯钺，羽扇，翳扇，偃月刀，月牙铲，细剑，迅雷剑，锡杖，锁镰，锁分铜，碎棒，双钺，双扇，双矛，双流星，双节棍，双剑，双鞭，双钩，鞭箭弓，手斧，伸细剑，射刃枪，扇刃，三尖刀，圈，峨嵋刺，枪，蛇矛，朴刀，投牙弓，龙枪，两刃枪，狼牙棒，昊转锤，九环刀，火尘双刀，九齿钯，将剑，击剑，戟，棍，三节棍，鬼神手甲，钢鞭剑，飞刀，飞镖，钩爪，方天戟，多节鞭，铁笛，盾牌剑，十字戟，短戟，刀，弧刀，大铡刀，大钺，大剑，大斧
+ 动作说明
  + [游戏动画设计-真三国无双8 35种武器 双视图招式参考](https://www.bilibili.com/video/BV1os411c71p)
+ 参考
  + [『真・三國無双８』武将动作演示合集](https://www.bilibili.com/video/BV1QW411h7rH)
  + [《塞尔达无双：灾厄启示录》全角色动作技能演示](https://www.bilibili.com/video/BV1qi4y1L7nc)
  + [《女神异闻录5对决：幽灵先锋》全角色动作合集](https://www.bilibili.com/video/BV1ZU4y1W7yj)
  + 姑且把 Omega Force（ω-Force）的其他作品的流程也放在这里
    + [勇者斗恶龙：英雄集结](https://www.bilibili.com/video/BV1xE411D77b)
    + [勇者斗恶龙：英雄集结2](https://www.bilibili.com/video/BV1Up411o7bX)
    + [无双大蛇Z](https://www.bilibili.com/video/BV174411F7Pg)
    + [无双大蛇2U](https://www.bilibili.com/video/BV1bW411t7Xr)
    + [战国无双5](https://www.bilibili.com/video/BV1L64y197XB)
    + [塞尔达无双：灾厄启示录](https://www.bilibili.com/video/BV17A411x7LD)
    + [女神异闻录5对决：幽灵先锋](https://www.bilibili.com/video/BV1RA411v7fX)
    + 其他比如：剑风传奇无双、火纹无双、刀剑乱舞无双暂略


#### 鬼泣

+ 分类：
  + 待补充
+ 参考：
  + [《鬼泣4:特别版》全角色动作展示](https://www.bilibili.com/video/BV1CW411Q7q3)
  + [《鬼泣DMC》人物慢动作赏析合集](https://www.bilibili.com/video/BV1mb411K7BN?p=7)
  + [《鬼泣5》『但丁』](https://www.bilibili.com/video/BV1nb411575p)
  + [《鬼泣5》『尼禄』](https://www.bilibili.com/video/BV1Jb41157yY)


#### 战神

+ 参考：
  + [战神3武器招式（部分）](https://www.bilibili.com/video/BV1is411B7Ej)
  + [战神3华丽连技](https://www.bilibili.com/video/BV1Js411m7mx)
  + [新战神招式展示小合集](https://www.bilibili.com/video/BV1bb411j732)
  + [【战神5】全符文攻击演示](https://www.bilibili.com/video/BV1KP4y1m7Fa)


#### 猎天使魔女

+ 概览
  + [猎天使魔女1进阶技巧](https://www.bilibili.com/video/BV1aQ4y167f4)
  + [猎天使魔女2 全武器动画鉴赏](https://www.bilibili.com/video/BV1nJ411X7or)


#### 忍者龙剑传

+ 概览
  + [忍龙3全武器动作展示](https://www.bilibili.com/video/BV1m44y1i7YU)


### 仁王

+ 概览（不准）
  + 1：刀，锁链，双刀，大太刀，旋棍，双手斧，长枪
  + 2：刀，大太刀，双刀，机关棍，手甲，长枪，旋棍
+ 动作
  + [Nioh: Sanada Yukimura - All weapons showcase](https://www.youtube.com/watch?v=rlgslxpQ0iQ)
  + [【仁王2】长枪全招式慢动作演示](https://www.bilibili.com/video/BV1kp4y1b7zP)，其他武器翻翻也有。


### 怪物猎人

+ 概览：
  + 太刀，大剑，盾斧，斩斧，轻弩，重弩，双刀，操虫棍，锤子，单手剑，狩猎笛，长枪，铳枪，弓，
+ 动作
  + [表演动作](https://www.bilibili.com/video/BV1gE411s7po)
  + [世界 全武器动作](https://www.bilibili.com/video/BV1Fx411W76R)
  + [冰原 全武器新动作](https://www.bilibili.com/video/BV134411W7GS)
  + [XX/GU 狩技](https://www.bilibili.com/video/BV12t411S7jg)
  + [RISE 替换技](https://www.bilibili.com/video/BV1D5411P7vr)
  + [Rise 全14种武器替换动作及虫技演示](https://www.bilibili.com/video/BV17f4y1x7pL)


### 黑暗之魂

+ 动作
  + [血源诅咒 老猎人 全武器、法术、装备展示](https://www.bilibili.com/video/BV15x411x74z)
  + [黑暗之魂1重置版 全装备与全法术展示](https://www.bilibili.com/video/BV1ms411j75P)
  + [黑暗之魂2原罪学者 全装备与全法术展示](https://www.bilibili.com/video/BV1Rx411e7nh)
  + [黑暗之魂3 全装备与全法术展示](https://www.bilibili.com/video/BV1ss411B7d6)
  + [只狼：影逝二度 全义手忍具、流派招式、体术、忍术展示](https://www.bilibili.com/video/BV1bb411T7Po)


### 白金工作室

+ 动作
  + 猎天使魔女四大那儿已经有了
  + [变形金刚：毁灭行动 流程](https://www.bilibili.com/video/BV1Jt411y7KY)
  + [忍者神龟：曼哈顿变种 流程](https://www.bilibili.com/video/BV1Js411i7iB)
  + 尼尔：自动人形
    + [【尼尔：机械纪元】2B全武器动作鑑賞動画 All actions（Moveset）](https://www.bilibili.com/video/BV1us411G7QQ)
  + 异界锁链
    + [《异界锁链》全部技能＆雷基恩＆同步攻击展示](https://www.bilibili.com/video/BV1CJ411N7rk)


### 其他

+ 动作
  + [【灵魂能力6/刀魂6】全角色爆衣展示](https://www.bilibili.com/video/BV1Yb411w7J7)
+ 街霸
+ 参考
  + [受击动作参考 街霸5隆](https://www.bilibili.com/video/BV1Fx41147YZ)
+ 拳皇
+ 其他
+ 罪恶装备
+ 苍翼
+ 真人快打
+ 铁拳
+ 侍魂
+ 破晓传说
  + [体验版 破晓传说全角色技能展示合集](https://www.bilibili.com/video/BV1664y1e7RB)


## 手游


### 崩坏3

|角色|特征|技能|描述|
|--|--|--|--|
|琪亚娜|双手枪|||
|芽衣|单手剑|||
|布洛妮娅|重炮|||
|德莉莎|十字架|||
|姬子|大剑|||
|卡莲|双手枪|||
|八重樱|单手剑|||
|符华|拳套|||
|丽塔|镰刀|||
|希儿|镰刀|||
|幽兰黛尔|长枪|||


### 战双


### 原神


<!-- ## MOBA游戏


### 王者荣耀

参考资料

+ [王者荣耀首页 > 英雄介绍](https://pvp.qq.com/web201605/herolist.shtml)


|英雄|武器|说明|
|--|--|--|
|桑启|法杖|绿色，自然；草，飞来飞去|
|瑶|法杖|法球；附身|
|大乔|长柄灯笼|水系；灯笼、大型水旋涡传送|
|张飞|长柄蛇矛|战士；变身|
|牛魔|犄角|牛头人（不）；冲刺、劈开大地|
|金蝉||
|鲁班大师||
|盾山||
|明世隐||
|苏烈||
|鬼谷子||
|东皇太一||
|太乙真人||
|蔡文姬||
|钟馗||
|孙膑||
|刘婵||
|庄周||
|暃（Fēi）|弯刀|王子，华贵；可以上墙|
|澜|双刀|刺客，蓝色；变成鲨鱼|
|夏侯惇|大刀|肉盾；护盾、眩晕|
|芈月|法球|蝙蝠、紫色；吸血、无法选中|


### DOTA2

+ [DOTA2全英雄技能](https://www.bilibili.com/video/BV1rb411r7CT)


### LOL


### LOLM -->

