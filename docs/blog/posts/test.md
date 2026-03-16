---
draft: true
date:
  created: 2025-11-23
categories:
  - test
  - abc
---

# This is a test

aaa

<!-- more -->

bbb



---

> 恶魔阿萨谢尔守护着通往flag的key，你可以解出吗？

下发文件只有一个 `Devil.exe`，先正常运行一遍：

```hl_lines="1"
"Keh keh keh... Finally, some fresh air! Who dares summon the Great Demon of Lust, Azazel Atsushi?!"
"...Wait a second. You aren't Akutabe, are you? Phew, thank the dark lord."
"Alright, listen up, human! You want a piece of my immense, terrifying, totally-not-a-mascot demonic power? Fine."
"First, I need to know whose soul I'm dealing with. Tell me your pathetic human name."
[?] Enter Player Name: Akutabe
```

随后程序退出。首先用 DIE 看看 exe 信息

```hl_lines="7"
PE32
操作系统: Windows(Vista)[I386, 32 位, 控制台]
链接程序: Microsoft Linker(14.36.35215)
编译器: Microsoft Visual C/C++(19.36.35215)[C++]
语言: C++
工具: Visual Studio(2022, v17.6)
(Heur)打包工具: Compressed or packed data[High entropy + Section 2 (".data") compressed]
```

看上去程序加壳了，但是用 IDA Pro 打开一遍发现没什么加壳迹象。直接开始分析

首先搜索 String 定位主程序逻辑，看到这里：

![image-20260308133044003](images/image-20260308133044003.png)

这里如果输入 Player Name 为 `Azazel`，可以进入后续的逻辑

接下来又是两处分支：

![image-20260308133203470](images/image-20260308133203470.png)

![image-20260308133236859](images/image-20260308133236859.png)

发现程序经过这两次跳转，可以尝试获得 Flag

一开始我认为 Flag 是通过程序内计算生成的，于是我对两次跳转进行了 Patch 操作，发现输出是这样的：

```
"Keh keh keh... Finally, some fresh air! Who dares summon the Great Demon of Lust, Azazel Atsushi?!"
"...Wait a second. You aren't Akutabe, are you? Phew, thank the dark lord."
"Alright, listen up, human! You want a piece of my immense, terrifying, totally-not-a-mascot demonic power? Fine."
"First, I need to know whose soul I'm dealing with. Tell me your pathetic human name."

[?] Enter Player Name: Azazel

"Seriously? That's your name? Man, mortals are so lame these days."
"Whatever. Now for the real deal. Hand over the secret password. And it better be as good as premium braised pig trotters!"

[?] Enter Password: 114514

...
"O-Oh! Oh my... this is the good stuff! Premium grade! Heh heh..."
"Alright, human, you've got yourself a deal. Welcome to the demonic pact..."

This is your flag: flag{114514}
```

发现 Password 就是最终的 Flag，因此还是需要深入程序细节

> 经过一番探索后发现 Ghidra 对这道题的程序的反编译效果更好，体现在 IDA Pro 会拆分出更多的子函数调用（比如一个 printf 操作能嵌套五六层函数），而 Ghidra 就能展开一些短函数
>
> 举个例子，以下是询问名称部分，Ghidra 的反编译结果：
>
> ```
> iVar4 = _strcmp(local_e4,"Azazel");
>   if (iVar4 == 0) { CORRECT BRANCH }
> ```
>
> 以下是 IDA Pro 给出的：
>
> ```
> sub_40C5B0(v27, 128, 0);
> if ( sub_417B70(v27, "Azazel") ) { WRONG BRANCH }
> ```
>
> 后面这个写法是个 AI 都会直接认为玩家名不能为 Azazel，但是 Ghidra 的写法就很明确（玩家名必须为 Azazel）

现在我们整理一下 `FUN_0040d290` 函数的逻辑（上面提到的主函数）

---

## 