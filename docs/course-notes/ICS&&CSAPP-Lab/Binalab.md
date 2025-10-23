# ICS Binalab Solution

和 CSAPP Bomblab 的内容大致相同，Binalab 将每个 Part 进行了拆分处理并进行了改动

通过动态调试 / 静态分析二进制文件，为每个 Part 的二进制文件构造一个正确的输入，就可以完成每个 Part 的任务

!!! quote "随笔"

    完成校内 ICS 课程的 Binalab 之前，我在暑假完成了 CSAPP 的 Bomblab，这两个 Lab 的内容没有明显区别，因此这里的 Solution 会相对简略
    
    可以算是二刷吧

## Solution

### Before Start: How `<main>` works

??? quote "完整的 main 函数"

    ```c
    /*
    * Main module of BinaLAB.
    *
    * Copyright 2023, SU Feng, All rights reserved.
    */
    
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include "config.h"
    
    //
    // Global Data
    //
    
    extern int phase(char *inputs);
    
    extern const char* phase_id;
    
    //
    // Declarations
    //
    
    char inputs[256];
    
    //
    // Utilities
    // 
    
    void fixinput( char* inputs, int length )
    {
    	char *p;
    	for ( p = inputs+length-1; p >= inputs; p -- )
    		if ( *p == '\n' )  *p = '\0';
    }
    
    //
    // Main Function
    // 
    
    int main( int argc, const char* argv[] )
    {
    #if defined(QUESTION)
        FILE *stream = 0;
    
        // If no command argument is given, read the input line from standard input.
        if (argc == 1)
    		stream = stdin;
        else // When a file argument is given, read the input line from the file.
    	if (argc == 2)
    	{
    		stream = fopen(argv[1], "r");
    		if (! stream) {
    			printf("Error: Failed to open the file %s.\n", argv[1]);
    			exit(1);
    		}
        }
        else // More than one command line arguments are not allowed.
    	{
    		printf("Usage: %s [input file]\n", argv[0]);
    		exit(1);
        }
    
        printf("Welcome to the binary program analysis lab.\n");
        printf("Here begins the task. Please input your answer ...\n");
    
    	// Read the input line
    	memset(inputs, 0, sizeof(inputs));
    	if (! fgets(inputs, sizeof(inputs), stream)) {
    		printf("Error: Failed to read the input line.\n");
    		exit(1);
    	}
    	fixinput(inputs, sizeof(inputs));
    
    	// Run the phase
        if ( phase(inputs) )
            printf("Congratulations! You've completed %s successfully.\n", phase_id);
    	else
            printf("Oops, %s failed. Try again.\n", phase_id);
    
    #elif defined(ANSWER)
    	memset(inputs, 0, sizeof(inputs));
    	phase(inputs);
    	
    #endif
    		
    	return 0;
    }
    ```

C 语言还是很好理解的，可以读取标准输入，也可以读取文件作为某个 Phase 的输入；宏定义 `QUESTION` 有效时，进行正常的测试；宏定义为 `ANSWER` 时生成答案（这个我们用不到）

但是在阅读汇编代码时，我们首先会发现一个问题：我们的输入储存在了哪里（换句话说，输入内容的首地址在哪个寄存器内被储存）

汇编代码中 `<main>` 函数有这样一个部分（以 Phase 1 为例）：

```assembly
40085f:	e8 b9 fe ff ff       	call   40071d <fixinput>
400864:	bf 40 11 60 00       	mov    $0x601140,%edi
400869:	e8 5c 00 00 00       	call   4008ca <phase>
```

`<fixinput>` 函数用于将字符串输入结尾的 `\n` 替换为 `\0`，而在调用 `<phase>` 函数之前的 `mov` 操作将输入首地址 `$0x601140` 赋值给了 `%edi`，因此在接下来的 Phase 中，用户输入的首地址是由 `%rdi` 传入的（至于理解传入后的压栈等操作，那是 Phase 内的任务）

另外，如果你看到了一些看上去把简单的事情复杂化的代码片段，那是编译器不执行任何优化的结果，比如 Phase 1 的 `%rdi` 传递

另另外，如果你发现了 `<__func_DumwPqNk>` 这样的什么都不做的函数，那大概率是给每个学生的作业标记

### Phase 1: 字符串比较

使用 `objdump -d phasex` 进行反汇编，给出 `<phase>` 函数与其他解题相关的函数的汇编（之后不再介绍）

```gas
00000000004008ca <phase>:
  4008ca:	55                   	push   %rbp
  4008cb:	48 89 e5             	mov    %rsp,%rbp
  4008ce:	48 83 ec 10          	sub    $0x10,%rsp				# 栈上分配 16 字节空间
  4008d2:	48 89 7d f8          	mov    %rdi,-0x8(%rbp)			# 输入的字符串保存到栈上
  4008d6:	48 8b 45 f8          	mov    -0x8(%rbp),%rax			# 栈上加载字符串地址，保存到 %rax
  4008da:	be e0 0a 40 00       	mov    $0x400ae0,%esi			# 0x400ae0 存入 %esi
  4008df:	48 89 c7             	mov    %rax,%rdi				# rdi = rax
  4008e2:	e8 09 fd ff ff       	call   4005f0 <strcmp@plt>		# 进行字符串比较，返回值约定由 %eax 储存
  4008e7:	85 c0                	test   %eax,%eax
  4008e9:	0f 94 c0             	sete   %al						# eax = 0, al = 1，表示字符串相等
  4008ec:	0f b6 c0             	movzbl %al,%eax					# al 零扩展为 eax
  4008ef:	c9                   	leave  							# 恢复栈帧
  4008f0:	c3                   	ret    							# 返回
  4008f1:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)		# nop 代码对齐
  4008f8:	00 00 00 
  4008fb:	0f 1f 44 00 00       	nopl   0x0(%rax,%rax,1)			# nop 代码对齐
```

`%rdi` 经过一轮游（入栈，保存到 `%rax`，保存回 `%rdi`）还是回到了 `%rdi`，与 `0x400ae0` 处硬编码的字符串进行字符串比较，字符串相等时函数返回 `1`（否则返回 `0`），用 `eax` 作为整个 `<phase>` 函数的返回值

阅读这些代码时只需要关注 leave 语句之前的内容即可，函数返回值 `eax` 为 1 说明 Phase 答案正确

使用 gdb 读取内存：

```assembly
(gdb) x/s 0x400ae0
0x400ae0:	"Early PCs used physical addressing."
```

**Answer: `Early PCs used physical addressing.`**

### Phase 2: 浮点数表示

相比 CSAPP 特有的 Phase

```gas
0000000000400919 <phase>:
  400919:	55                   	push   %rbp
  40091a:	48 89 e5             	mov    %rsp,%rbp
  40091d:	48 83 ec 20          	sub    $0x20,%rsp					# 栈上开辟空间
  400921:	48 89 7d e8     	     	mov    %rdi,-0x18(%rbp)			# 输入首地址入栈
  400925:	b8 00 00 00 00       	mov    $0x0,%eax					# eax = 0
  40092a:	48 89 45 f0          	mov    %rax,-0x10(%rbp)				# 64 位的 0 入栈
  40092e:	c7 45 fc 00 00 00 00 	movl   $0x0,-0x4(%rbp)				# 32 位的 0 入栈
  400935:	48 8d 45 f0          	lea    -0x10(%rbp),%rax				# rax 指向 64 位的 0
  400939:	48 8d 48 04          	lea    0x4(%rax),%rcx				# rcx 指向 -0xc(%rbp) 的地址
  40093d:	48 8d 55 f0          	lea    -0x10(%rbp),%rdx				# rdx 指向 64 位的 0
  400941:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# rax = rdi
  400945:	be 53 0b 40 00       	mov    $0x400b53,%esi				# esi 指向 "%d %d" 常量的首地址
  40094a:	48 89 c7             	mov    %rax,%rdi					# rdi = rax，都指向了输入首地址
  40094d:	b8 00 00 00 00       	mov    $0x0,%eax					# eax 初始化为 0
  400952:	e8 d9 fc ff ff       	call   400630 <__isoc99_sscanf@plt>	# 调用 sscanf，注意第一个参数的地址为 %rdx
  400957:	83 f8 02             	cmp    $0x2,%eax					# sscanf 返回值与 0x2 比较
  40095a:	74 07                	je     400963 <phase+0x4a>			# 相等则跳转
  40095c:	b8 00 00 00 00       	mov    $0x0,%eax					# 不相等就将 eax 设为 0
  400961:	eb 19                	jmp    40097c <phase+0x63>			# 然后退出函数，表示输入错误
  400963:	f2 0f 10 45 f0       	movsd  -0x10(%rbp),%xmm0			# a b 两个数被拼在一起解释为一个 64 位浮点数
  400968:	f2 0f 2c c0          	cvttsd2si %xmm0,%eax				# 将双精度浮点数 %xmm0 截断转换为有符号整数存入 %eax
  40096c:	89 45 fc             	mov    %eax,-0x4(%rbp)				# -0x4(%rbp) = eax
  40096f:	81 7d fc 38 39 30 f3 	cmpl   $0xf3303938,-0x4(%rbp)		# 相当于 eax 和 0xf3303938 比较
  400976:	0f 94 c0             	sete   %al							# 两值相等，将 al 设为 1
  400979:	0f b6 c0             	movzbl %al,%eax						# al 零扩展赋值给 eax 作为返回值
  40097c:	c9                   	leave  
  40097d:	c3                   	ret    
  40097e:	66 90                	xchg   %ax,%ax
```

??? tip "前置知识：`sscanf` 函数"

    sscanf 函数的签名：`#!c int sscanf(const char *str, const char *format, ...)` 
    
    其中 ... 表示可变参数，存储解析结果的变量地址
    
    i386 约定中，`__isoc99_sscanf@plt` 的参数使用如下：
    
    `%rax` 存储返回值（这是函数共同的约定）
    
    `%rdi` 存储输入字符串
    
    `%rsi` 存储格式字符串
    
    `%rdx` 存储第一个变量地址
    
    `%rcx` 存储第二个变量地址
    
    `%r8`, `%r9` 等寄存器存储接下来的变量地址
    
    接下来如果还有变量地址需要存储就使用栈存储 (%rsp)
    
    在上面的约定下，假设我的输入为 `1 2.0 3.0 4`，格式字符串为 `%d %f %d %d`，那么 `rax = 2`，`%rdx` 指向 int 值 1 的地址，`%rcx` 指向 float 值 2.0 的地址，后续参数对应的变量不会被赋值
    
    `sscanf` 在第一次失配后就不会继续往下匹配，所以 `4` 虽然和 `%d` 匹配，但是不会被 `sscanf` 匹配
    
    !!! success "`sscanf` 函数之后会多次用到，所以务必记住其用法；看到很多 `lea` 指令加 `mov` 指令的基本上都是为 `sscanf` 做准备，不要因此被栈上操作绕晕了"

`<__isoc99_sscanf@plt>` 的返回值和 C 语言 `sscanf` 一样，返回格式字符串匹配成功的个数，这里 `esi` 指向硬编码串 `%d %d`，结合 `cmp` 函数，说明我的输入必须满足 `%d %d` 的格式（也就是两个 int 数用空格分隔），这样 `sscanf` 返回值为 2 才是正确的

在这之后 `%rdx` 与 `%rcx` 分别指向了我的输入中的两个 int 数，接下来的这条命令非常关键

--> `#!asm movsd -0x10(%rbp),%xmm0`

我们知道之前调度内存时有：

```asm
lea    0x4(%rax),%rcx				# rcx 指向 -0xc(%rbp) 的地址
lea    -0x10(%rbp),%rdx				# rdx 指向 -0x10(%rbp) 的地址，这两个地址恰好是连续的
```

`movsd -0x10(%rbp),%xmm0` 需要一个 64 位的数字解释为浮点数传入 `%xmm0`，因此这两个整数会“拼接”为一个 64 位的数，（类型双关）解释为双精度浮点数之后再截断取整，结果与 `0xf3303938` 常数进行比较

（注意 `movsd  -0x10(%rbp),%xmm0` 不是类型转换，它是从字节方向解释为了双精度浮点数，不会有精度损失）

那么我们如何写出正确答案呢？逆向计算： `0xf3303938` 转换为有符号整数： `-214943432`，转换为浮点数 `-214943432.0`，这个浮点数用 IEEE 754 双精度浮点数表示为 `1 10000011010 100110011111100011011001000000000000`，即 `C1A99F8D 90000000`，拆开来用有符号十进制转换，得到 `-1045848179` 和 `-1879048192`，考虑到栈上存储方向，这两个数字还要交换顺序

**Answer: `-1879048192 -1045848179`**

### Phase 3: 循环

为了方便阅读，将一段长代码的各个子部分通过换行符分隔

```asm
Z00000000004008df <phase>:
  4008df:	55                   	push   %rbp
  4008e0:	48 89 e5             	mov    %rsp,%rbp
  4008e3:	48 83 ec 20          	sub    $0x20,%rsp
  4008e7:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)				# %rdi 入栈，记输入字符串为 input[]
  4008eb:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# rax = rdi
  4008ef:	48 89 c7             	mov    %rax,%rdi
  4008f2:	e8 b9 fc ff ff       	call   4005b0 <strlen@plt>			# 调用 strlen，返回值 %rax 为长度
  4008f7:	48 83 f8 05          	cmp    $0x5,%rax					# 长度与 5 比较
  4008fb:	74 0a                	je     400907 <phase+0x28>			# 相等则跳转到下一步
  4008fd:	b8 00 00 00 00       	mov    $0x0,%eax					# 不相等则 phase 函数返回 0，表示 WA
  400902:	e9 89 00 00 00       	jmp    400990 <phase+0xb1>
  
  400907:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# 下一步：
  40090b:	0f b6 00             	movzbl (%rax),%eax					# eax 存储了输入的第一个 ASCII 字符（零扩展 32 位）
  40090e:	3c 77                	cmp    $0x77,%al					# 取低八位与 0x77 比较
  400910:	74 07                	je     400919 <phase+0x3a>			# 也就是说输入的第一个字符必须是 'w'
  400912:	b8 00 00 00 00       	mov    $0x0,%eax					# 否则返回 WA
  400917:	eb 77                	jmp    400990 <phase+0xb1>
  
  400919:	c6 45 fb 01          	movb   $0x1,-0x5(%rbp)				# 下一步，将 1bit 1 存储至 (%rbp -5) ,记这个变量为 j
  40091d:	c7 45 fc 01 00 00 00 	movl   $0x1,-0x4(%rbp)				# 将循环计数器初始化为 1，记这个变量为 i
  400924:	eb 5f                	jmp    400985 <phase+0xa6>			# 进入循环体
  
  400926:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  400929:	48 63 d0             	movslq %eax,%rdx					# eax 符号扩展到 64 位存入 rdx
  40092c:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# rax = rdi （input 的首地址）
  400930:	48 01 d0             	add    %rdx,%rax					# rax += i
  400933:	0f b6 00             	movzbl (%rax),%eax					# eax = input[i]，取 ASCII 值 
  400936:	0f be c0             	movsbl %al,%eax						# 确保是基于 ASCII 低八位的符号扩展
  																		# ASCII 可显示字符的符号位一定为 0,所以相当于零扩展
  400939:	8b 55 fc             	mov    -0x4(%rbp),%edx				# edx = i
  40093c:	48 63 d2             	movslq %edx,%rdx					# edx 符号扩展到 64 位
  40093f:	48 8d 4a ff          	lea    -0x1(%rdx),%rcx				# rcx = i - 1
  400943:	48 8b 55 e8          	mov    -0x18(%rbp),%rdx				# rdx 指向 input[0]
  400947:	48 01 ca             	add    %rcx,%rdx					# rdx 指向 input[i-1]
  40094a:	0f b6 12             	movzbl (%rdx),%edx					# edx = input[i-1]，取 ASCII 值
  40094d:	d0 fa                	sar    %dl							# 算术右移一位
  40094f:	0f be d2             	movsbl %dl,%edx						# 扩展至 32 位
  400952:	8d 4a 20             	lea    0x20(%rdx),%ecx				# ecx = edx + 32 = input[i-1] / 2 + 32 （纯数值计算）
  400955:	0f b6 55 fb          	movzbl -0x5(%rbp),%edx				# edx = j
  400959:	31 ca                	xor    %ecx,%edx					# edx = ecx XOR edx
  40095b:	39 d0                	cmp    %edx,%eax					# 和 eax (= input[i]) 比较
  40095d:	74 07                	je     400966 <phase+0x87>			# 不相等则 WA
  40095f:	b8 00 00 00 00       	mov    $0x0,%eax
  400964:	eb 2a                	jmp    400990 <phase+0xb1>
  400966:	0f b6 45 fb          	movzbl -0x5(%rbp),%eax				# eax = j
  40096a:	8d 50 01             	lea    0x1(%rax),%edx				# edx = j + 1
  40096d:	89 d0                	mov    %edx,%eax					# eax = j + 1
  																		# 接下来的步骤都在计算 (j + 1) % 32 的值 ，存入 j
  40096f:	c1 f8 1f             	sar    $0x1f,%eax					# eax 算术右移 31 位，即复制符号位为所有数位
  400972:	c1 e8 1b             	shr    $0x1b,%eax					# 进行逻辑右移 27 位，即只取低四位
  																		# 即 eax = (j + 1 >= 0 ? 0 : 31)
  400975:	01 c2                	add    %eax,%edx					# edx += eax
  400977:	83 e2 1f             	and    $0x1f,%edx					# edx %= 32
  40097a:	29 c2                	sub    %eax,%edx					# edx -= eax
  40097c:	89 d0                	mov    %edx,%eax					# eax = edx
  40097e:	88 45 fb             	mov    %al,-0x5(%rbp)				# j = eax 低八位
  400981:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)				# 循环计数器 i++
  400985:	83 7d fc 04          	cmpl   $0x4,-0x4(%rbp)				# if(i <= 4)
  400989:	7e 9b                	jle    400926 <phase+0x47>			# go_back
  40098b:	b8 01 00 00 00       	mov    $0x1,%eax
  400990:	c9                   	leave  
  400991:	c3                   	ret    
  400992:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
  400999:	00 00 00 
  40099c:	0f 1f 40 00          	nopl   0x0(%rax)
```

循环语句之前的操作很显然：判断输入是否为长度为 5 的字符串，并且第一个字符必须为 `w`

并且我们发现，这样的语句很明显和 CSAPP 中的 `explode_bomb` 函数等效：

```asm
mov    $0x0,%eax								# 返回值 0
jmp    <an address where 'leave' is put>		# 跳转到 phase 函数结尾，输出失败结果
```

在分析循环语句时，我们重点关注是否有 `jle` 或者 `jne` 语句，并且这个跳转语句向回跳转，比如这句：

--> ` 400989: 7e 9b jle 400926 <phase+0x47>` 

我们在这句指令之前可以找到：

```asm
40091d:	c7 45 fc 01 00 00 00 	movl   $0x1,-0x4(%rbp)
...
400981:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)
400985:	83 7d fc 04          	cmpl   $0x4,-0x4(%rbp)
400989: 7e 9b                   jle    400926 <phase+0x47>
```

以上我们获得的信息：

- `400926` ~ `400989` 为循环体
- 循环体对应的 `for` 函数为 `#!c for(int i = 1; i <= 4; i++)`

在循环体内的语句应该比较显然，值得注意的是这样的结构：

```asm
mov -0x18(%rbp),%rax	# rax = rdi （input 的首地址）
add %rdx,%rax			# 给 rax 加上了偏移值 i
```

这是遍历一个数组/字符串的典型写法

循环体内的代码可以用 C 语言这样表示，其中记 `-0x4(%rbp)` 存储值为 `i`，`-0x5(%rbp)` 存储值为 `j`，输入的字符串为一个 char 数组 `input[]`：

```c
for(int i = 1, j = 1; i <= 4; i++){
	if (input[i] == (( (input[i-1] >> 1) + 32) ^ j) ){	// 这里是低八位比较
         j = (j + 1) % 32;
    } else FAIL();
}
SUCCEED();
```

手推循环：`input[0] = 'w' = 0x77` 

--> `input[1] = ((0x77 >> 1) + 32) ^ 1 = 91 ^ 1 = 0b01011010 = 'Z' = 90` 

--> `input[2] = ((90 >> 1) + 32) ^ 2 = 77 ^ 2 = 0b01001111 = 'O' = 79` 

--> `input[3] = ((79 >> 1) + 32) ^ 3 = 71 ^ 3 = 0b01000100 = 'D' = 68` 

--> `input[4] = ((68 >> 1) + 32) ^ 4 = 66 ^ 4 = 0b01000110 = 'F' = 70` 

Answer: `wZODF`

### Phase 4: 选择（条件分支）

```asm
00000000004008a4 <phase>:
  4008a4:	55                   	push   %rbp
  4008a5:	48 89 e5             	mov    %rsp,%rbp
  4008a8:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)				# %rdi 入栈，记输入字符串为 input[]
  4008ac:	c7 45 f4 00 00 00 00 	movl   $0x0,-0xc(%rbp)				# 0 入栈，我们记这个变量为 j
  4008b3:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# rax = rdi
  4008b7:	48 89 45 f8          	mov    %rax,-0x8(%rbp)				# -0x8(%rbp) = rax，我们记这个变量为 i
  4008bb:	eb 5e                	jmp    40091b <phase+0x77>
  
  4008bd:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = i
  4008c1:	0f b6 00             	movzbl (%rax),%eax					# eax = *i = input[i]
  4008c4:	0f be c0             	movsbl %al,%eax						# 取 input[i] 低八位
  4008c7:	83 e8 41             	sub    $0x41,%eax					# input[i] -= 65
  4008ca:	83 f8 05             	cmp    $0x5,%eax					# input[i] - 65 > 5，则跳转到 400916 
  4008cd:	77 47                	ja     400916 <phase+0x72>			#（注意是无符号比较）
  4008cf:	89 c0                	mov    %eax,%eax					# 否则 input[i] <= 70：
  4008d1:	48 8b 04 c5 20 0b 40 	mov    0x400b20(,%rax,8),%rax		# rax = 0x4008db + 8 * (input[i] - 65)（存地址）
  4008d8:	00 															# （gdb 得到 0x400b20 处存储的是 0x4008db）
  4008d9:	ff e0                	jmp    *%rax						# 跳转到 rax 存储的地址
  
  4008db:	81 65 f4 ff ff ff 7f 	andl   $0x7fffffff,-0xc(%rbp)		# j 清除符号位为 0
  4008e2:	eb 32                	jmp    400916 <phase+0x72>			# 跳转到 400916 
  
  4008e4:	8b 45 f4             	mov    -0xc(%rbp),%eax				# eax = j
  4008e7:	0d 00 00 00 80       	or     $0x80000000,%eax				# eax 符号位强制为 1
  4008ec:	89 45 f4             	mov    %eax,-0xc(%rbp)				# j 符号位强制为 1
  4008ef:	eb 25                	jmp    400916 <phase+0x72>			# 跳转到 400916 
  
  4008f1:	83 7d f4 00          	cmpl   $0x0,-0xc(%rbp)				# j == 0 ?
  4008f5:	0f 94 c0             	sete   %al							# (j == 0) ? al = 1 : al = 0;
  4008f8:	0f b6 c0             	movzbl %al,%eax						# 零扩展
  4008fb:	89 45 f4             	mov    %eax,-0xc(%rbp)				# j = (j == 0) ? 1 : 0;
  4008fe:	eb 16                	jmp    400916 <phase+0x72>			# 跳转到 400916 
  
  400900:	8b 45 f4             	mov    -0xc(%rbp),%eax				# eax = j
  400903:	35 00 00 00 80       	xor    $0x80000000,%eax				# eax = -eax
  400908:	89 45 f4             	mov    %eax,-0xc(%rbp)				# j 翻转符号位
  40090b:	eb 09                	jmp    400916 <phase+0x72>			# 跳转到 400916
  
  40090d:	d1 65 f4             	shll   -0xc(%rbp)					# j <<= 1
  400910:	eb 04                	jmp    400916 <phase+0x72>			# 跳转到 400916
  
  400912:	d1 7d f4             	sarl   -0xc(%rbp)					# j >>= 1 （算术右移）
  400915:	90                   	nop									# 相当于跳转到 400916
  
  400916:	48 83 45 f8 01       	addq   $0x1,-0x8(%rbp)				# i++
  
  40091b:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = i
  40091f:	0f b6 00             	movzbl (%rax),%eax					# eax = *i
  400922:	84 c0                	test   %al,%al						# eax 若不为 \0 就跳回循环（也就是需要遍历整个字符串）
  400924:	75 97                	jne    4008bd <phase+0x19>
  
  400926:	81 7d f4 27 99 57 65 	cmpl   $0x65579927,-0xc(%rbp)		# 比较 j 是否等于 $0x65579927
  40092d:	0f 94 c0             	sete   %al							# 相等则输入正确
  400930:	0f b6 c0             	movzbl %al,%eax
  400933:	5d                   	pop    %rbp
  400934:	c3                   	ret    
  400935:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
  40093c:	00 00 00 
  40093f:	90                   	nop
```

经过分析后不难发现，程序设置了变量 `j = 0`，之后对 `input[]` 进行遍历：

```asm
  4008bd:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = i
  4008c1:	0f b6 00             	movzbl (%rax),%eax					# eax = *i = input[i]
  4008c4:	0f be c0             	movsbl %al,%eax						# 取 input[i] 低八位
  4008c7:	83 e8 41             	sub    $0x41,%eax					# input[i] -= 65
  4008ca:	83 f8 05             	cmp    $0x5,%eax					# input[i] - 65 > 5，则跳转到 400916 
  4008cd:	77 47                	ja     400916 <phase+0x72>			#（注意是无符号比较，所以自然排除了 input[i] - 65 < 0）
  4008cf:	89 c0                	mov    %eax,%eax					# 否则 65 <= input[i] <= 70：
  4008d1:	48 8b 04 c5 20 0b 40 	mov    0x400b20(,%rax,8),%rax		# rax = 0x4008db + 8 * (input[i] - 65)（存地址）
  4008d8:	00 															# （gdb 得到 0x400b20 处存储的是 0x4008db）
  4008d9:	ff e0                	jmp    *%rax						# 跳转到 rax 存储的地址
```

这里是一个**跳转表**的实现，当 `input[i]={65,66,...,70}` 时，分别对应了 `j` 的六种不同的计算操作，用 C++ 语言描述为：

```c++
int32_t & sign(j); // sign(j) 取 j 的符号位的引用

int j = 0;
for(int &x : input){
    int opr = x - 65;
	switch (opr){
        case 0:
            sign(j) = 0;
            break;
        case 1:
        	sign(j) = 1;
            break;
        case 2:
            j = (j == 0) ? 1 : 0;
            break;
        case 3:
            sign(j) = -sign(j);
            break;
        case 4:
            j <<= 1;
            break;
        case 5:
            j >>= 1;
            break;
        default:
            break;
    }
}
```

而最终 `cmpl $0x65579927,-0xc(%rbp)`，我们希望 `j` 在一轮计算后结果为 `0x65579927`，据此构造一个 opr 链，使得：

`0b0` --> `0b 0110 0101 0101 0111 1001 1001 0010 0111`

这里给出一个只利用算数右移和翻转符号位来自定义任意数位的方法：

`opr = [3]` --> `0b 1000 0000`

`opr += [5,5,5]` --> `0b 1111 0000`

`opr += [3]` --> `0b 0111 0000`

`opr += [5,5]` --> `0b 0001 1100`

`opr += [3]` --> `0b 1001 1100`

`opr += [5]` --> `0b 1100 1110`

`opr += [3]` --> `0b 0100 1110`

`opr += [5]` --> `0b 0010 0111`

上面的操作中，`j` 的最高八位已经被设定为了 `0x65579927` 的低八位，只要持续按照上面的模式生成，就可以得到任意需要的值

不难得到完整的 opr 链为

```
[3,5,5,5] + [3,5,5] + [3,5] + [3,5,5] + [3,5] + [3,5,5] + [3,5,5] + [3,5,5] + [3,5,5,5,5] + [3,5] + [3,5] + [3,5] + [3,5] + [3,5] + [3,5] + [3,5] + [3,5] + [3,5,5] + [3,5,5] + [3]`
```

不难看出上面的 opr 链的构造规律，注意最后没有 `5`，最后每个数字加上 65 映射到 ASCII 表上得到答案：

!!! tip "利用 gdb 的动态调试"

    你可以通过打断点 --> 查内存的方式获取程序运行到某一个时间点时，某一处内存的值
    
    ```
    (gdb) break *0x400926
    Breakpoint 1 at 0x400926
    (gdb) run
    Starting program: /home/nopthon/icslab/phase4 
    [Thread debugging using libthread_db enabled]
    Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
    Welcome to the binary program analysis lab.
    Here begins the task. Please input your answer ...
    DFFFDFFDFDFFDFDFFDFFDFFDFFFFDFDFDFDFDFDFDFDFDFFDFFD
    
    Breakpoint 1, 0x0000000000400926 in phase ()
    (gdb) x/wx $rbp - 0xc		# 查询了 -0xc(%rbp) 的值
    0x7fffffffdc84:	0x65579927
    (gdb) continue
    Continuing.
    Congratulations! You've completed phase 4 successfully.
    [Inferior 1 (process 10462) exited normally]
    ```

**Answer: `DFFFDFFDFDFFDFDFFDFFDFFDFFFFDFDFDFDFDFDFDFDFDFFDFFD`**（不唯一）

### Phase 5: 递归调用

```asm
0000000000400969 <phase>:
  400969:	55                   	push   %rbp
  40096a:	48 89 e5             	mov    %rsp,%rbp
  40096d:	48 83 ec 20          	sub    $0x20,%rsp
  400971:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)
  400975:	48 8d 55 fc          	lea    -0x4(%rbp),%rdx
  400979:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  40097d:	be 93 0b 40 00       	mov    $0x400b93,%esi				# 模式字符串 "%x"，读取一个 16 进制数
  400982:	48 89 c7             	mov    %rax,%rdi
  400985:	b8 00 00 00 00       	mov    $0x0,%eax
  40098a:	e8 a1 fc ff ff       	call   400630 <__isoc99_sscanf@plt>	# 模式匹配
  40098f:	83 f8 01             	cmp    $0x1,%eax
  400992:	74 07                	je     40099b <phase+0x32>			# 输入必须为一个 16 进制数，地址存入 %rdx
  400994:	b8 00 00 00 00       	mov    $0x0,%eax
  400999:	eb 1d                	jmp    4009b8 <phase+0x4f>
  
  40099b:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = 输入的 16 进制数本身，记为 input
  40099e:	ba 20 00 00 00       	mov    $0x20,%edx					# edx = 32
  4009a3:	be a0 11 60 00       	mov    $0x6011a0,%esi				# esi = 数组 number_list 的首地址，简称为 nums
  4009a8:	89 c7                	mov    %eax,%edi					# edi = eax = input
  4009aa:	e8 4b ff ff ff       	call   4008fa <seek>				# 调用递归函数 seek（函数名暗示作用为搜索值）
  4009af:	83 f8 2e             	cmp    $0x2e,%eax					# 返回值 eax 与 46 比较
  4009b2:	0f 94 c0             	sete   %al							# 相等则输入正确，否则输入错误
  4009b5:	0f b6 c0             	movzbl %al,%eax
  4009b8:	c9                   	leave  
  4009b9:	c3                   	ret    
  4009ba:	66 0f 1f 44 00 00    	nopw   0x0(%rax,%rax,1)
  
  00000000004008fa <seek>:
  4008fa:	55                   	push   %rbp
  4008fb:	48 89 e5             	mov    %rsp,%rbp
  4008fe:	48 83 ec 10          	sub    $0x10,%rsp
  400902:	89 7d fc             	mov    %edi,-0x4(%rbp)				# -0x4(%rbp) = edi，记为变量 x，初始值 input
  400905:	48 89 75 f0          	mov    %rsi,-0x10(%rbp)				# -0x10(%rbp) = rsi，记为变量 y，初始值 &nums[0]
  400909:	89 55 f8             	mov    %edx,-0x8(%rbp)				# -0x8(%rbp) = edx，记为变量 z，初始值 32
  40090c:	83 7d f8 01          	cmpl   $0x1,-0x8(%rbp)				# z > 1 ?
  400910:	77 08                	ja     40091a <seek+0x20>			# z > 1 则跳转
  
  400912:	48 8b 45 f0          	mov    -0x10(%rbp),%rax				# rax = y
  400916:	8b 00                	mov    (%rax),%eax					# rax = nums[y]
  400918:	eb 4d                	jmp    400967 <seek+0x6d>			# 退出函数
  
  40091a:	d1 6d f8             	shrl   -0x8(%rbp)					# z 右移一位
  40091d:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = x
  400920:	83 e0 01             	and    $0x1,%eax					# eax = lowest_bit(x)
  400923:	85 c0                	test   %eax,%eax					# lowest_bit(x) == 0 ?
  400925:	74 28                	je     40094f <seek+0x55>			# lowest_bit(x) == 0 则跳转，这里是二选一的分支
  																		# 可以推测是二分操作
  
  400927:	8b 45 f8             	mov    -0x8(%rbp),%eax				# eax = z
  40092a:	48 8d 14 85 00 00 00 	lea    0x0(,%rax,4),%rdx			# rdx = 4 * z，注意 4 = sizeof(int)
  400931:	00 
  400932:	48 8b 45 f0          	mov    -0x10(%rbp),%rax				# rax = y
  400936:	48 8d 34 02          	lea    (%rdx,%rax,1),%rsi			# rsi = y + z = &nums[z]
  40093a:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = x
  40093d:	d1 e8                	shr    %eax							# eax >>= 1
  40093f:	89 c1                	mov    %eax,%ecx					# ecx = x >> 1
  400941:	8b 45 f8             	mov    -0x8(%rbp),%eax				# eax = z
  400944:	89 c2                	mov    %eax,%edx					# edx = z
  400946:	89 cf                	mov    %ecx,%edi					# edi = x >> 1
  400948:	e8 ad ff ff ff       	call   4008fa <seek>				# 将上面的寄存器值作为参数进行下一层递归
  40094d:	eb 18                	jmp    400967 <seek+0x6d>
  
  40094f:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = x
  400952:	d1 e8                	shr    %eax							# eax = x >> 1
  400954:	89 c1                	mov    %eax,%ecx					# ecx = x >> 1
  400956:	8b 55 f8             	mov    -0x8(%rbp),%edx				# edx = z
  400959:	48 8b 45 f0          	mov    -0x10(%rbp),%rax				# rax = y
  40095d:	48 89 c6             	mov    %rax,%rsi					# rsi = y
  400960:	89 cf                	mov    %ecx,%edi					# edi = x >> 1
  400962:	e8 93 ff ff ff       	call   4008fa <seek>				# 将上面的寄存器值作为参数进行下一层递归
  400967:	c9                   	leave  
  400968:	c3                   	ret

# 从 0x6011a0 开始的数组 number_list
# (gdb) x/32w 0x6011a0
# 其实应该用 x/128b 的
0x6011a0 <number_list>:		0x00000068	0x00000049	0x00000066	0x00000014
0x6011b0 <number_list+16>:	0x0000005a	0x00000012	0x00000030	0x00000065
0x6011c0 <number_list+32>:	0x0000001b	0x00000011	0x0000006a	0x0000000d
0x6011d0 <number_list+48>:	0x0000004e	0x00000015	0x0000006c	0x0000000b
0x6011e0 <number_list+64>:	0x00000073	0x00000005	0x00000029	0x00000045
0x6011f0 <number_list+80>:	0x00000020	0x00000040	0x00000074	0x00000032
0x601200 <number_list+96>:	0x00000025	0x0000005d	0x0000007f	0x00000059
0x601210 <number_list+112>:	0x00000070	0x00000026	0x0000003c	0x0000002e # <-- 注意最后一个元素是 cmp $0x2e,%eax 的应匹配值
```

题目要求输入一个 16 进制数，然后进行对 `<number_list>` 的递归查找：

```c
/*-0x4(%rbp) 记为变量 x，由 edi 传递，第一次调用 seek 函数时初始值 input
* -0x10(%rbp)记为变量 y，由 rsi 传递，第一次调用 seek 函数时初始值 &nums[0]
* -0x8(%rbp) 记为变量 z，由 edx 传递，第一次调用 seek 函数时初始值 32
*/
int seek(int x, int* y, int z) {
    if (z <= 1)
        return *y

    z >>= 1;				// z 一开始为数组的长度，每次递归时减半
    						// nums[z] 为取半后数组的中点元素
    if (x & 1)
        return seek(x >> 1, y+z, z);	// y+z 表示“右半元素首地址”
    else
        return seek(x >> 1, y, z);		// y 表示 “左半元素首地址”
}
```

递归结束后，我们需要比较的是 `cmp $0x2e,%eax`，对应了数组的最后一个元素。因此在递归二分时，我们应该确保每一次的 `(x & 1)` 都成立

`z = 32`，因此需要 `x` 的低五位都为 `1`，而 `x` 的初始值为我的 16 进制输入，因此答案要求输入的 16 进制数的低五位都为 `1`

**Answer: `0x1f`**（不唯一）

### Phase 6: 数组

```asm
0000000000400921 <phase>:
  400921:	55                   	push   %rbp
  400922:	48 89 e5             	mov    %rsp,%rbp
  400925:	48 83 ec 30          	sub    $0x30,%rsp
  400929:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)
  40092d:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  400931:	48 c7 44 24 08 c0 11 	movq   $0x6011c0,0x8(%rsp)				
  400938:	60 00 
  40093a:	48 c7 04 24 b4 11 60 	movq   $0x6011b4,(%rsp)
  400941:	00 
  400942:	41 b9 bc 11 60 00    	mov    $0x6011bc,%r9d
  400948:	41 b8 b0 11 60 00    	mov    $0x6011b0,%r8d
  40094e:	b9 b8 11 60 00       	mov    $0x6011b8,%ecx
  400953:	ba ac 11 60 00       	mov    $0x6011ac,%edx
  400958:	be c7 0b 40 00       	mov    $0x400bc7,%esi				# 模式串："%u %u %u %u %u %u"，六个无符号数
  40095d:	48 89 c7             	mov    %rax,%rdi
  400960:	b8 00 00 00 00       	mov    $0x0,%eax
  400965:	e8 c6 fc ff ff       	call   400630 <__isoc99_sscanf@plt>	# 应该不用解释了
  40096a:	83 f8 06             	cmp    $0x6,%eax
  40096d:	74 07                	je     400976 <phase+0x55>
  40096f:	b8 00 00 00 00       	mov    $0x0,%eax
  400974:	eb 78                	jmp    4009ee <phase+0xcd>
  
# 此时的内存分布：
(gdb) x/3w 0x6011ac
0x6011ac <rows>:	0x00000000	0x00000000	0x00000000
# 对应的地址存储在		%edx		%r8d		(%rsp)
(gdb) x/3w 0x6011b8
0x6011b8 <cols>:	0x00000000	0x00000000	0x00000000
# 对应的地址存储在		%ecx		%r9d		0x8(%rsp)

# Tip: sscanf 依次将匹配的变量地址存入 %edx  %ecx  %r8d  %r9d  (%rsp)  0x8(%rsp) ...
  
  400976:	c7 45 fc 00 00 00 00 	movl   $0x0,-0x4(%rbp)				# 记 -0x4(%rbp) 变量为 i，初始化 i = 0
  40097d:	eb 64                	jmp    4009e3 <phase+0xc2>			# 可以看得出来接下来是一个循环结构
  
  40097f:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  400982:	8b 04 85 ac 11 60 00 	mov    0x6011ac(,%rax,4),%eax		# eax = raw[i]
  400989:	83 f8 03             	cmp    $0x3,%eax					# raw[i] 与 3 比较
  40098c:	77 0f                	ja     40099d <phase+0x7c>			# raw[i] > 3 （或者为负）则跳转到 Fail
  40098e:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  400991:	8b 04 85 b8 11 60 00 	mov    0x6011b8(,%rax,4),%eax		# eax = col[i]
  400998:	83 f8 07             	cmp    $0x7,%eax					# col[i] 与 7 比较
  40099b:	76 07                	jbe    4009a4 <phase+0x83>			# 0 <= col[i] <= 7 时跳转，否则 Fail
  
  40099d:	b8 00 00 00 00       	mov    $0x0,%eax					# Fail
  4009a2:	eb 4a                	jmp    4009ee <phase+0xcd>
  
  4009a4:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  4009a7:	8b 14 85 ac 11 60 00 	mov    0x6011ac(,%rax,4),%edx		# edx = raw[i]
  4009ae:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  4009b1:	8b 04 85 b8 11 60 00 	mov    0x6011b8(,%rax,4),%eax		# eax = col[i]
  4009b8:	89 c0                	mov    %eax,%eax					# 有清零高 32 位的作用
  4009ba:	89 d2                	mov    %edx,%edx
  4009bc:	0f b6 94 d0 60 11 60 	movzbl 0x601160(%rax,%rdx,8),%edx	# edx = (零扩展至 32 位)cmat[rows[i]][col[i]]

# 注意到 0x601160 处存储了一个二维数组（矩阵），根据标签提示判断数组元素大小为 1 byte
(gdb) x/32b 0x601160
0x601160 <cmat>:	0x70	0x6f	0x6b	0x55	0x49	0x43	0x68	0x4c
0x601168 <cmat+8>:	0x4b	0x4e	0x4a	0x5a	0x58	0x62	0x61	0x79
0x601170 <cmat+16>:	0x64	0x42	0x71	0x53	0x41	0x50	0x47	0x44
0x601178 <cmat+24>:	0x45	0x56	0x76	0x6a	0x72	0x52	0x54	0x4f
  
  4009c3:	00 															# 0x2007b5(%rip) 的值是原注释提供的
  4009c4:	48 8b 0d b5 07 20 00 	mov    0x2007b5(%rip),%rcx			# rcx = 0x00400bc3，
  4009cb:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  4009ce:	48 01 c8             	add    %rcx,%rax					# eax = i + 0x00400bc3
  4009d1:	0f b6 00             	movzbl (%rax),%eax					# eax = arr[i] （零扩展为 32 位）
  
# 注意到 i + 0x00400bc3 又是一个数组索引，通过 %al 判断数组元素大小为 1 byte
# 我们记这个数组为 arr
(gdb) x/3b 0x400bc3
0x400bc3:	0x55	0x44	0x6f

  4009d4:	38 c2                	cmp    %al,%dl						# arr[i] 与 cmat[rows[i]][col[i]] 比较
  4009d6:	74 07                	je     4009df <phase+0xbe>			# 如果相等就跳转，否则 Fail
  4009d8:	b8 00 00 00 00       	mov    $0x0,%eax					# Fail
  4009dd:	eb 0f                	jmp    4009ee <phase+0xcd>
  4009df:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)				# i++
  
  4009e3:	83 7d fc 02          	cmpl   $0x2,-0x4(%rbp)				# i <= 2 时持续循环
  4009e7:	76 96                	jbe    40097f <phase+0x5e>			
  4009e9:	b8 01 00 00 00       	mov    $0x1,%eax					# 完成循环则 SUCCEED
  4009ee:	c9                   	leave  
  4009ef:	c3                   	ret
```

简单来说，有一个二维数组 `cmat[3][8]` 和一个一维数组 `arr[22]`，我的六个无符号输入分别代表了三对 `cmat` 坐标，总共比较三次 `arr[i]` 与 `cmat[rows[i]][col[i]]` 要求都要相等

不难发现 `arr[0] == cmat[0][3]` `arr[1] == cmat[2][7]` `arr[2] == cmat[0][1]` ，据此得到答案

 **Answer: `0 3 2 7 0 1`**

### Phase 7: 指针

```asm
00000000004009f2 <phase>:
  4009f2:	55                   	push   %rbp
  4009f3:	48 89 e5             	mov    %rsp,%rbp
  4009f6:	48 83 ec 30          	sub    $0x30,%rsp
  4009fa:	48 89 7d d8          	mov    %rdi,-0x28(%rbp)
  4009fe:	c7 45 f8 00 00 00 00 	movl   $0x0,-0x8(%rbp)				# 记变量 -0x8(%rbp) 为 j,初始化为 0
  400a05:	48 8d 45 e0          	lea    -0x20(%rbp),%rax
  400a09:	4c 8d 40 0c          	lea    0xc(%rax),%r8
  400a0d:	48 8d 45 e0          	lea    -0x20(%rbp),%rax
  400a11:	48 8d 78 08          	lea    0x8(%rax),%rdi
  400a15:	48 8d 45 e0          	lea    -0x20(%rbp),%rax
  400a19:	48 8d 48 04          	lea    0x4(%rax),%rcx
  400a1d:	48 8d 55 e0          	lea    -0x20(%rbp),%rdx
  400a21:	48 8b 45 d8          	mov    -0x28(%rbp),%rax
  400a25:	48 8d 75 e0          	lea    -0x20(%rbp),%rsi
  400a29:	48 83 c6 10          	add    $0x10,%rsi
  400a2d:	48 89 34 24          	mov    %rsi,(%rsp)
  400a31:	4d 89 c1             	mov    %r8,%r9
  400a34:	49 89 f8             	mov    %rdi,%r8
  400a37:	be 93 0c 40 00       	mov    $0x400c93,%esi				# 模式串 "%d %d %d %d %d"
  400a3c:	48 89 c7             	mov    %rax,%rdi
  400a3f:	b8 00 00 00 00       	mov    $0x0,%eax
  400a44:	e8 e7 fb ff ff       	call   400630 <__isoc99_sscanf@plt>
  400a49:	83 f8 05             	cmp    $0x5,%eax
  400a4c:	74 07                	je     400a55 <phase+0x63>
  400a4e:	b8 00 00 00 00       	mov    $0x0,%eax
  400a53:	eb 5a                	jmp    400aaf <phase+0xbd>
  
# 此时 5 个整数的存储位置，在之后会有作用
# -0x20(%rbp)	第一个数 nums[0]
# -0x1c(%rbp)	第二个数 nums[1]
# -0x18(%rbp)	第三个数 nums[2]
# -0x14(%rbp) 	第四个数 nums[3]
# -0x10(%rbp)	第五个数 nums[4]
  
  400a55:	c7 45 fc 00 00 00 00 	movl   $0x0,-0x4(%rbp)				# 记变量 -0x4(%rbp) 为 i,初始化为 0
  400a5c:	eb 3e                	jmp    400a9c <phase+0xaa>
  
  400a5e:	8b 45 fc             	mov    -0x4(%rbp),%eax				# eax = i
  400a61:	48 98                	cltq   								# eax 符号扩展到 rax
  400a63:	8b 44 85 e0          	mov    -0x20(%rbp,%rax,4),%eax		# eax = nums[i]
  400a67:	89 45 f4             	mov    %eax,-0xc(%rbp)				# -0xc(%rbp) = nums[i]
  400a6a:	83 7d f4 00          	cmpl   $0x0,-0xc(%rbp)				# nums[i] 和 0 比较
  400a6e:	78 25                	js     400a95 <phase+0xa3>			# nums[i] < 0 跳转到 FAIL
  400a70:	8b 45 f4             	mov    -0xc(%rbp),%eax				# eax = nums[i]
  400a73:	83 f8 0f             	cmp    $0xf,%eax					# nums[i] 和 15 比较
  400a76:	77 1d                	ja     400a95 <phase+0xa3>			# nums[i] > 15 跳转到 FAIL
  400a78:	8b 45 f4             	mov    -0xc(%rbp),%eax				# eax = nums[i]
  400a7b:	48 98                	cltq   								# eax 符号扩展到 rax
  400a7d:	48 8b 04 c5 40 21 60 	mov    0x602140(,%rax,8),%rax		# rax = operators[nums[i]]

# 这里是一个一维数组，存储的是函数指针
(gdb) x/16g 0x602140
0x602140 <operators>:	0x0000000000400902	0x0000000000400911
0x602150 <operators+16>:	0x0000000000400920	0x000000000040092f
0x602160 <operators+32>:	0x000000000040093e	0x000000000040094d
0x602170 <operators+48>:	0x000000000040095c	0x000000000040096b
0x602180 <operators+64>:	0x000000000040097a	0x0000000000400989
0x602190 <operators+80>:	0x0000000000400998	0x00000000004009a7
0x6021a0 <operators+96>:	0x00000000004009b6	0x00000000004009c5
0x6021b0 <operators+112>:	0x00000000004009d4	0x00000000004009e3


  
  400a84:	00 
  400a85:	8b 55 f8             	mov    -0x8(%rbp),%edx				# edx = j
  400a88:	89 d7                	mov    %edx,%edi					# edi = j
  400a8a:	ff d0                	call   *%rax						# 调用函数，返回值 eax
  400a8c:	89 45 f8             	mov    %eax,-0x8(%rbp)				# j = eax
  400a8f:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)				# i++
  400a93:	eb 07                	jmp    400a9c <phase+0xaa>
  
  400a95:	b8 00 00 00 00       	mov    $0x0,%eax					# FAIL
  400a9a:	eb 13                	jmp    400aaf <phase+0xbd>
  
  
  400a9c:	83 7d fc 04          	cmpl   $0x4,-0x4(%rbp)				# i 与 4 比较
  400aa0:	7e bc                	jle    400a5e <phase+0x6c>			# i <= 4 时持续循环
  400aa2:	81 7d f8 89 00 00 00 	cmpl   $0x89,-0x8(%rbp)				# j 和 137 比较
  400aa9:	0f 94 c0             	sete   %al
  400aac:	0f b6 c0             	movzbl %al,%eax
  400aaf:	c9                   	leave  
  400ab0:	c3                   	ret    
  400ab1:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
  400ab8:	00 00 00 
  400abb:	0f 1f 44 00 00       	nopl   0x0(%rax,%rax,1)
```

??? tip "`operators` 函数指针数组指向的十六个运算函数"

    ```asm
    0000000000400902 <_opfunc0_>:
      400902:	55                   	push   %rbp
      400903:	48 89 e5             	mov    %rsp,%rbp
      400906:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400909:	8b 45 fc             	mov    -0x4(%rbp),%eax
      40090c:	83 c0 2b             	add    $0x2b,%eax
      40090f:	5d                   	pop    %rbp
      400910:	c3                   	ret    
    
    0000000000400911 <_opfunc1_>:
      400911:	55                   	push   %rbp
      400912:	48 89 e5             	mov    %rsp,%rbp
      400915:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400918:	8b 45 fc             	mov    -0x4(%rbp),%eax
      40091b:	83 c0 35             	add    $0x35,%eax
      40091e:	5d                   	pop    %rbp
      40091f:	c3                   	ret    
    
    0000000000400920 <_opfunc2_>:
      400920:	55                   	push   %rbp
      400921:	48 89 e5             	mov    %rsp,%rbp
      400924:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400927:	8b 45 fc             	mov    -0x4(%rbp),%eax
      40092a:	83 c0 29             	add    $0x29,%eax
      40092d:	5d                   	pop    %rbp
      40092e:	c3                   	ret    
    
    000000000040092f <_opfunc3_>:
      40092f:	55                   	push   %rbp
      400930:	48 89 e5             	mov    %rsp,%rbp
      400933:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400936:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400939:	83 c0 03             	add    $0x3,%eax
      40093c:	5d                   	pop    %rbp
      40093d:	c3                   	ret    
    
    000000000040093e <_opfunc4_>:
      40093e:	55                   	push   %rbp
      40093f:	48 89 e5             	mov    %rsp,%rbp
      400942:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400945:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400948:	83 c0 07             	add    $0x7,%eax
      40094b:	5d                   	pop    %rbp
      40094c:	c3                   	ret    
    
    000000000040094d <_opfunc5_>:
      40094d:	55                   	push   %rbp
      40094e:	48 89 e5             	mov    %rsp,%rbp
      400951:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400954:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400957:	83 c0 1f             	add    $0x1f,%eax
      40095a:	5d                   	pop    %rbp
      40095b:	c3                   	ret    
    
    000000000040095c <_opfunc6_>:
      40095c:	55                   	push   %rbp
      40095d:	48 89 e5             	mov    %rsp,%rbp
      400960:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400963:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400966:	83 c0 25             	add    $0x25,%eax
      400969:	5d                   	pop    %rbp
      40096a:	c3                   	ret    
    
    000000000040096b <_opfunc7_>:
      40096b:	55                   	push   %rbp
      40096c:	48 89 e5             	mov    %rsp,%rbp
      40096f:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400972:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400975:	83 c0 1d             	add    $0x1d,%eax
      400978:	5d                   	pop    %rbp
      400979:	c3                   	ret    
    
    000000000040097a <_opfunc8_>:
      40097a:	55                   	push   %rbp
      40097b:	48 89 e5             	mov    %rsp,%rbp
      40097e:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400981:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400984:	83 c0 05             	add    $0x5,%eax
      400987:	5d                   	pop    %rbp
      400988:	c3                   	ret    
    
    0000000000400989 <_opfunc9_>:
      400989:	55                   	push   %rbp
      40098a:	48 89 e5             	mov    %rsp,%rbp
      40098d:	89 7d fc             	mov    %edi,-0x4(%rbp)
      400990:	8b 45 fc             	mov    -0x4(%rbp),%eax
      400993:	83 c0 17             	add    $0x17,%eax
      400996:	5d                   	pop    %rbp
      400997:	c3                   	ret    
    
    0000000000400998 <_opfunc10_>:
      400998:	55                   	push   %rbp
      400999:	48 89 e5             	mov    %rsp,%rbp
      40099c:	89 7d fc             	mov    %edi,-0x4(%rbp)
      40099f:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009a2:	83 c0 02             	add    $0x2,%eax
      4009a5:	5d                   	pop    %rbp
      4009a6:	c3                   	ret    
    
    00000000004009a7 <_opfunc11_>:
      4009a7:	55                   	push   %rbp
      4009a8:	48 89 e5             	mov    %rsp,%rbp
      4009ab:	89 7d fc             	mov    %edi,-0x4(%rbp)
      4009ae:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009b1:	83 c0 2f             	add    $0x2f,%eax
      4009b4:	5d                   	pop    %rbp
      4009b5:	c3                   	ret    
    
    00000000004009b6 <_opfunc12_>:
      4009b6:	55                   	push   %rbp
      4009b7:	48 89 e5             	mov    %rsp,%rbp
      4009ba:	89 7d fc             	mov    %edi,-0x4(%rbp)
      4009bd:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009c0:	83 c0 13             	add    $0x13,%eax
      4009c3:	5d                   	pop    %rbp
      4009c4:	c3                   	ret    
    
    00000000004009c5 <_opfunc13_>:
      4009c5:	55                   	push   %rbp
      4009c6:	48 89 e5             	mov    %rsp,%rbp
      4009c9:	89 7d fc             	mov    %edi,-0x4(%rbp)
      4009cc:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009cf:	83 c0 11             	add    $0x11,%eax
      4009d2:	5d                   	pop    %rbp
      4009d3:	c3                   	ret    
    
    00000000004009d4 <_opfunc14_>:
      4009d4:	55                   	push   %rbp
      4009d5:	48 89 e5             	mov    %rsp,%rbp
      4009d8:	89 7d fc             	mov    %edi,-0x4(%rbp)
      4009db:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009de:	83 c0 0b             	add    $0xb,%eax
      4009e1:	5d                   	pop    %rbp
      4009e2:	c3                   	ret    
    
    00000000004009e3 <_opfunc15_>:
      4009e3:	55                   	push   %rbp
      4009e4:	48 89 e5             	mov    %rsp,%rbp
      4009e7:	89 7d fc             	mov    %edi,-0x4(%rbp)
      4009ea:	8b 45 fc             	mov    -0x4(%rbp),%eax
      4009ed:	83 c0 0d             	add    $0xd,%eax
      4009f0:	5d                   	pop    %rbp
      4009f1:	c3                   	ret
    ```

不难发现这 16 个函数对应的都是对参数 `j`（也就是 `-0x8(%rbp)`）的加法运算（具体地说，都是 `j += const_int` ）

| _opfunc_ |  0   |  1   |  2   |  3   |  4   |  5   |  6   |  7   |  8   |  9   |  10  |  11  |  12  |  13  |  14  |  15  |
| -------- | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| 加上的数 |  43  |  53  |  41  |  3   |  7   |  31  |  37  |  29  |  5   |  23  |  2   |  47  |  19  |  17  |  11  |  13  |

循环中 `#!c for(int i = 0; i <= 4; i++)` 说明可以进行五次计算，Phase 要求是：调用五次 `opfunc` 系列函数，要求调用完毕以后 `j` 的值恰好增加 `137` 

手搓一个 $O(n^3)$ 的函数遍历一下可以得到 `7` `13` `17` `47` `53` 这五个数（答案不唯一，随意挑一个），找到对应的 `opfunc` 序号得到答案

**Answer: `1 4 11 13 15`** （不唯一，五个数字的顺序随意，也不一定必须是这五个数字） 

### Phase 8: 结构与链表/树

```asm
00000000004009d3 <phase>:
  4009d3:	55                   	push   %rbp
  4009d4:	48 89 e5             	mov    %rsp,%rbp
  4009d7:	48 83 ec 20          	sub    $0x20,%rsp
  4009db:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)
  4009df:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  4009e3:	48 89 c7             	mov    %rax,%rdi
  4009e6:	e8 c5 fb ff ff       	call   4005b0 <strlen@plt>			# 字符串长度必须为 15
  4009eb:	48 83 f8 0f          	cmp    $0xf,%rax		
  4009ef:	74 0a                	je     4009fb <phase+0x28>
  4009f1:	b8 00 00 00 00       	mov    $0x0,%eax
  4009f6:	e9 d9 00 00 00       	jmp    400ad4 <phase+0x101>
  
  4009fb:	c7 45 f4 00 00 00 00 	movl   $0x0,-0xc(%rbp)				# -0xc(%rbp) 记为 i，初始化为 0
  400a02:	e9 ab 00 00 00       	jmp    400ab2 <phase+0xdf>
  
  400a07:	48 c7 45 f8 00 00 00 	movq   $0x0,-0x8(%rbp)				# -0x8(%rbp) 记为 j，初始化为 0
  400a0e:	00 
  400a0f:	c7 45 f0 00 00 00 00 	movl   $0x0,-0x10(%rbp)				# -0x10(%rbp) 记为 k，初始化为 0
  400a16:	eb 53                	jmp    400a6b <phase+0x98>
  
# 这里是 0x602180 指向的数据结构，手动按照 x/3g 对齐了一下
# 标签中的 tree 暗示了 {值，左子树地址，右子树地址} 的数据结构
0x602180 <tree>:		0x0000000000004d70	0x0000000000000000	0x0000000000000000
0x602198 <tree+24>:		0x0000000000005567	0x0000000000000000	0x0000000000000000
0x6021b0 <tree+48>:		0x0000000000004e79	0x0000000000000000	0x0000000000000000
0x6021c8 <tree+72>:		0x0000000000004675	0x0000000000000000	0x0000000000000000
0x6021e0 <tree+96>:		0x0000000000005661	0x0000000000000000	0x0000000000000000
0x6021f8 <tree+120>:	0x0000000000005769	0x0000000000000000	0x0000000000000000
0x602210 <tree+144>:	0x0000000000004872	0x0000000000000000	0x0000000000000000
0x602228 <tree+168>:	0x0000000000004b6a	0x0000000000000000	0x0000000000000000
0x602240 <tree+192>:	0x000000000000527a	0x0000000000000000	0x0000000000000000
0x602258 <tree+216>:	0x0000000000004573	0x0000000000000000	0x0000000000000000
0x602270 <tree+240>:	0x0000000000005068	0x0000000000000000	0x0000000000000000
0x602288 <tree+264>:	0x000000000000446c	0x0000000000000000	0x0000000000000000
0x6022a0 <tree+288>:	0x0000000000005366	0x0000000000000000	0x0000000000000000
0x6022b8 <tree+312>:	0x0000000000004364	0x0000000000000000	0x0000000000000000
0x6022d0 <tree+336>:	0x0000000000005877	0x0000000000000000	0x0000000000000000
						# val				# leftNode			# rightNode
  
  400a18:	8b 45 f0             	mov    -0x10(%rbp),%eax				# eax = k
  400a1b:	48 63 d0             	movslq %eax,%rdx					# rdx = k（符号扩展到 64 位）
  400a1e:	48 89 d0             	mov    %rdx,%rax					# rax = k
  400a21:	48 01 c0             	add    %rax,%rax					# rax = 2*k
  400a24:	48 01 d0             	add    %rdx,%rax					# rax = 3*k
  400a27:	48 c1 e0 03          	shl    $0x3,%rax					# rax 左移三位
  400a2b:	48 05 80 21 60 00    	add    $0x602180,%rax				# rax = 0x602180 + (8*3*k)
  400a31:	0f b6 10             	movzbl (%rax),%edx					# edx = treeNode[k].val
  400a34:	8b 45 f4             	mov    -0xc(%rbp),%eax				# eax = i
  400a37:	48 63 c8             	movslq %eax,%rcx					# rcx = i（符号扩展到 64 位）
  400a3a:	48 8b 45 e8          	mov    -0x18(%rbp),%rax				# rax = 输入首地址
  400a3e:	48 01 c8             	add    %rcx,%rax					# rax += i
  400a41:	0f b6 00             	movzbl (%rax),%eax					# eax = input[i];
  400a44:	38 c2                	cmp    %al,%dl						# 取低八位与 treeNode[k].val 比较 
  																		# 注意树节点值 val 也只取低八位
  400a46:	75 1f                	jne    400a67 <phase+0x94>			# 不相等则跳转到 400a67
  400a48:	8b 45 f0             	mov    -0x10(%rbp),%eax				# eax = k
  400a4b:	48 63 d0             	movslq %eax,%rdx					# rdx = k（符号扩展至 64 位）
  400a4e:	48 89 d0             	mov    %rdx,%rax					# rax = k
  400a51:	48 01 c0             	add    %rax,%rax					# rax = 2*k
  400a54:	48 01 d0             	add    %rdx,%rax					# rax = 3*k
  400a57:	48 c1 e0 03          	shl    $0x3,%rax					# rax = 24*k
  400a5b:	48 05 80 21 60 00    	add    $0x602180,%rax				# rax = 0x602180 + (8*3*k)
  400a61:	48 89 45 f8          	mov    %rax,-0x8(%rbp)				# j = &(treeNode[k])
  400a65:	eb 0a                	jmp    400a71 <phase+0x9e>			# 跳转到 400a71
  
  400a67:	83 45 f0 01          	addl   $0x1,-0x10(%rbp)				# k++
  400a6b:	83 7d f0 0e          	cmpl   $0xe,-0x10(%rbp)				# k 与 14 比较
  400a6f:	7e a7                	jle    400a18 <phase+0x45>			# k <= 14 回到循环
  
  400a71:	48 83 7d f8 00       	cmpq   $0x0,-0x8(%rbp)				# j 与 0 比较
  400a76:	75 07                	jne    400a7f <phase+0xac>			# j != 0 时跳转，否则 FAIL
  400a78:	b8 00 00 00 00       	mov    $0x0,%eax
  400a7d:	eb 55                	jmp    400ad4 <phase+0x101>
  																		# 原注释：0x201__(%rip) 地址都是 602310
  400a7f:	48 8b 05 8a 18 20 00 	mov    0x20188a(%rip),%rax			# rax = root（root 一开始为 0）
  400a86:	48 85 c0             	test   %rax,%rax					# rax != 0 时跳转到 400a98 
  400a89:	75 0d                	jne    400a98 <phase+0xc5>			
  400a8b:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = j
  400a8f:	48 89 05 7a 18 20 00 	mov    %rax,0x20187a(%rip)			# root = j
  400a96:	eb 16                	jmp    400aae <phase+0xdb>			# 跳转到 400aae
  
  400a98:	48 8b 05 71 18 20 00 	mov    0x201871(%rip),%rax			# rax = root
  400a9f:	48 8b 55 f8          	mov    -0x8(%rbp),%rdx				# rdx = j
  400aa3:	48 89 d6             	mov    %rdx,%rsi					# rsi = j
  400aa6:	48 89 c7             	mov    %rax,%rdi					# rdi = root
  400aa9:	e8 37 fe ff ff       	call   4008e5 <insert>				# 调用 insert 函数
  
  400aae:	83 45 f4 01          	addl   $0x1,-0xc(%rbp)				# i++
  400ab2:	83 7d f4 0e          	cmpl   $0xe,-0xc(%rbp)				# i <= 14?
  400ab6:	0f 8e 4b ff ff ff    	jle    400a07 <phase+0x34>			# i <= 14 跳回 400a07
  
  400abc:	48 8b 05 4d 18 20 00 	mov    0x20184d(%rip),%rax			# rax = root
  400ac3:	48 89 c7             	mov    %rax,%rdi					# rdi = rax
  400ac6:	e8 b0 fe ff ff       	call   40097b <depth>				# 调用 depth 函数
  400acb:	83 f8 04             	cmp    $0x4,%eax					# 返回值 eax 与 4 比较
  400ace:	0f 94 c0             	sete   %al							# 相等则 al = 1
  400ad1:	0f b6 c0             	movzbl %al,%eax						# eax = 1
  400ad4:	c9                   	leave  								# 结束 Phase
  400ad5:	c3                   	ret    
  400ad6:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
  400add:	00 00 00
  
00000000004008e5 <insert>:												# 我们过一会再分析这个函数
  4008e5:	55                   	push   %rbp
  4008e6:	48 89 e5             	mov    %rsp,%rbp
  4008e9:	48 83 ec 10          	sub    $0x10,%rsp
  4008ed:	48 89 7d f8          	mov    %rdi,-0x8(%rbp)
  4008f1:	48 89 75 f0          	mov    %rsi,-0x10(%rbp)
  4008f5:	48 83 7d f8 00       	cmpq   $0x0,-0x8(%rbp)
  4008fa:	75 02                	jne    4008fe <insert+0x19>
  4008fc:	eb 7b                	jmp    400979 <insert+0x94>
  4008fe:	48 8b 45 f0          	mov    -0x10(%rbp),%rax
  400902:	0f b6 50 01          	movzbl 0x1(%rax),%edx
  400906:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  40090a:	0f b6 40 01          	movzbl 0x1(%rax),%eax
  40090e:	38 c2                	cmp    %al,%dl
  400910:	7d 34                	jge    400946 <insert+0x61>
  400912:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400916:	48 8b 40 08          	mov    0x8(%rax),%rax
  40091a:	48 85 c0             	test   %rax,%rax
  40091d:	74 19                	je     400938 <insert+0x53>
  40091f:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400923:	48 8b 40 08          	mov    0x8(%rax),%rax
  400927:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  40092b:	48 89 d6             	mov    %rdx,%rsi
  40092e:	48 89 c7             	mov    %rax,%rdi
  400931:	e8 af ff ff ff       	call   4008e5 <insert>
  400936:	eb 40                	jmp    400978 <insert+0x93>
  400938:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  40093c:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  400940:	48 89 50 08          	mov    %rdx,0x8(%rax)
  400944:	eb 33                	jmp    400979 <insert+0x94>
  400946:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  40094a:	48 8b 40 10          	mov    0x10(%rax),%rax
  40094e:	48 85 c0             	test   %rax,%rax
  400951:	74 19                	je     40096c <insert+0x87>
  400953:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400957:	48 8b 40 10          	mov    0x10(%rax),%rax
  40095b:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  40095f:	48 89 d6             	mov    %rdx,%rsi
  400962:	48 89 c7             	mov    %rax,%rdi
  400965:	e8 7b ff ff ff       	call   4008e5 <insert>
  40096a:	eb 0c                	jmp    400978 <insert+0x93>
  40096c:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400970:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  400974:	48 89 50 10          	mov    %rdx,0x10(%rax)
  400978:	90                   	nop
  400979:	c9                   	leave  
  40097a:	c3                   	ret    

000000000040097b <depth>:												# 只要知道这个函数计算二叉树的深度即可
  40097b:	55                   	push   %rbp
  40097c:	48 89 e5             	mov    %rsp,%rbp
  40097f:	48 83 ec 20          	sub    $0x20,%rsp
  400983:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)
  400987:	48 83 7d e8 00       	cmpq   $0x0,-0x18(%rbp)
  40098c:	75 07                	jne    400995 <depth+0x1a>
  40098e:	b8 00 00 00 00       	mov    $0x0,%eax
  400993:	eb 3c                	jmp    4009d1 <depth+0x56>
  400995:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  400999:	48 8b 40 08          	mov    0x8(%rax),%rax
  40099d:	48 89 c7             	mov    %rax,%rdi
  4009a0:	e8 d6 ff ff ff       	call   40097b <depth>
  4009a5:	89 45 fc             	mov    %eax,-0x4(%rbp)
  4009a8:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  4009ac:	48 8b 40 10          	mov    0x10(%rax),%rax
  4009b0:	48 89 c7             	mov    %rax,%rdi
  4009b3:	e8 c3 ff ff ff       	call   40097b <depth>
  4009b8:	89 45 f8             	mov    %eax,-0x8(%rbp)
  4009bb:	8b 45 fc             	mov    -0x4(%rbp),%eax
  4009be:	3b 45 f8             	cmp    -0x8(%rbp),%eax
  4009c1:	7e 08                	jle    4009cb <depth+0x50>
  4009c3:	8b 45 fc             	mov    -0x4(%rbp),%eax
  4009c6:	83 c0 01             	add    $0x1,%eax
  4009c9:	eb 06                	jmp    4009d1 <depth+0x56>
  4009cb:	8b 45 f8             	mov    -0x8(%rbp),%eax
  4009ce:	83 c0 01             	add    $0x1,%eax
  4009d1:	c9                   	leave  
  4009d2:	c3                   	ret 
```

和 CSAPP-Bomblab 的 Secret Phase 一样，都是二叉搜索树，但是这个明显难一些

首先开头检查字符串长度必须为 15，并且能大致看出这个 Phase 涉及二叉树的建立（尤其是 `0x602180 <tree>` 这里）。然后直接看代码的最后部分

```asm
  400abc:	48 8b 05 4d 18 20 00 	mov    0x20184d(%rip),%rax			# rax = root
  400ac3:	48 89 c7             	mov    %rax,%rdi					# rdi = rax
  400ac6:	e8 b0 fe ff ff       	call   40097b <depth>				# 调用 depth 函数
  400acb:	83 f8 04             	cmp    $0x4,%eax					# 返回值 eax 与 4 比较
  400ace:	0f 94 c0             	sete   %al							# 相等则 al = 1
  400ad1:	0f b6 c0             	movzbl %al,%eax						# eax = 1
  400ad4:	c9                   	leave  								# 结束 Phase
  400ad5:	c3                   	ret    
  400ad6:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
  400add:	00 00 00
```

经过一系列的建二叉树操作后，二叉树的深度必须为 4，若深度为 4 则 Phase 输入正确

因此中间的内容都围绕着建二叉树展开：

```asm
movl   $0x0,-0xc(%rbp)				# -0xc(%rbp) 记为 i，初始化为 0
jmp    400ab2 <phase+0xdf>
movq   $0x0,-0x8(%rbp)				# -0x8(%rbp) 记为 j，初始化为 0
movl   $0x0,-0x10(%rbp)				# -0x10(%rbp) 记为 k，初始化为 0
jmp    400a6b <phase+0x98>
```

我们重点关注这三个变量，尤其是关注它们的赋值情况

`i` 变量是最外层的循环计数器，并且有这样的使用方法：

--> `#!asm 400a41: movzbl (%rax),%eax          # eax = input[i];`

由此可见，`i` 用于遍历输入的字符串，从 `input[0]` 遍历到 `input[14]`

`k` 变量也是 `(k = 0; k <=14; k++)` 的循环结构

--> ` #!asm 400a61: mov %rax,-0x8(%rbp)         # j = &(treeNode[k])`

由此可见，`k` 用于遍历二叉树节点

`j` 变量和 `k` 变量的关系从上面的例子中已经能很好的表示了

继续观察理解，我们可以将 `i` 的大循环压缩为这样的 C 语言代码：

```c
for (i = 0; i <= 14; i++) {
    j = 0;
    for (k = 0; k <= 14; k++) {
        if (input[i] == treeNode[k].val)
            j = &treeNode[k];
    }
    if (j == 0)
        FAIL();
    else
    	insert(?); 
}
```

也就是说，我的 15 位字符串输入，每一位的 ASCII 值的都可以和二叉树的一个节点匹配，否则 FAIL

现在的问题是，我们并不清楚 `insert` 函数的逻辑：

```asm
  # 不难发现，root 初始化为 0，所以 insert 操作在 i = 0 时一定不会进行
  # 因为 i = 0 对应根节点，不需要被插入
  400a7f:	48 8b 05 8a 18 20 00 	mov    0x20188a(%rip),%rax			# rax = root（root 一开始为 0）
  400a86:	48 85 c0             	test   %rax,%rax					# rax != 0 时跳转到 400a98 
  # 这里是根节点才会进行的操作，令 root = j = &(treeNode[k])
  # 接下来进行 insert 操作时，我们就能定位根节点了
  400a89:	75 0d                	jne    400a98 <phase+0xc5>			
  400a8b:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = j
  400a8f:	48 89 05 7a 18 20 00 	mov    %rax,0x20187a(%rip)			# root = j
  400a96:	eb 16                	jmp    400aae <phase+0xdb>			# 跳转到 i++ 的地方
  # 为使用 insert 函数进行寄存器准备
  400a98:	48 8b 05 71 18 20 00 	mov    0x201871(%rip),%rax			# rax = root
  400a9f:	48 8b 55 f8          	mov    -0x8(%rbp),%rdx				# rdx = &(treeNode[k])
  400aa3:	48 89 d6             	mov    %rdx,%rsi					# rsi = &(treeNode[k])
  400aa6:	48 89 c7             	mov    %rax,%rdi					# rdi = root
  400aa9:	e8 37 fe ff ff       	call   4008e5 <insert>				# 调用 insert 函数
  
  00000000004008e5 <insert>:
  4008e5:	55                   	push   %rbp							# 正常的栈操作
  4008e6:	48 89 e5             	mov    %rsp,%rbp
  4008e9:	48 83 ec 10          	sub    $0x10,%rsp
  4008ed:	48 89 7d f8          	mov    %rdi,-0x8(%rbp)				# j = rdi = root
  4008f1:	48 89 75 f0          	mov    %rsi,-0x10(%rbp)				# K = &(treeNode[k])，待插入节点地址
  4008f5:	48 83 7d f8 00       	cmpq   $0x0,-0x8(%rbp)				# root 和 0 比较
  4008fa:	75 02                	jne    4008fe <insert+0x19>			# 不相等则继续
  4008fc:	eb 7b                	jmp    400979 <insert+0x94>			# 意料外的 root = 0，退出函数
  4008fe:	48 8b 45 f0          	mov    -0x10(%rbp),%rax				# rax = K
  400902:	0f b6 50 01          	movzbl 0x1(%rax),%edx				# edx = K->val[3:2]
  400906:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = root
  40090a:	0f b6 40 01          	movzbl 0x1(%rax),%eax				# eax = root->val[3:2]
  40090e:	38 c2                	cmp    %al,%dl						# eax 和 edx 比大小
  400910:	7d 34                	jge    400946 <insert+0x61>			# 插入子树的分支
  # k->val < root->val，则尝试插入左子树：
  400912:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = root
  400916:	48 8b 40 08          	mov    0x8(%rax),%rax				# rax = root->left
  40091a:	48 85 c0             	test   %rax,%rax					# root->left 是否为空
  40091d:	74 19                	je     400938 <insert+0x53>			# 为空就插入
  	# 如果左子树不为空，递归至下一层，这期间的操作参考 400a98 的部分：
  40091f:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				
  400923:	48 8b 40 08          	mov    0x8(%rax),%rax
  400927:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  40092b:	48 89 d6             	mov    %rdx,%rsi
  40092e:	48 89 c7             	mov    %rax,%rdi
  400931:	e8 af ff ff ff       	call   4008e5 <insert>
  400936:	eb 40                	jmp    400978 <insert+0x93>	
    # 如果左子树为空，插入左子树：
  400938:	48 8b 45 f8          	mov    -0x8(%rbp),%rax				# rax = root
  40093c:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx				# rdx = K
  400940:	48 89 50 08          	mov    %rdx,0x8(%rax)				# K 插入至左子树
  400944:	eb 33                	jmp    400979 <insert+0x94>
  # k->val >= root->val，则尝试插入右子树：
  400946:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  40094a:	48 8b 40 10          	mov    0x10(%rax),%rax
  40094e:	48 85 c0             	test   %rax,%rax
  400951:	74 19                	je     40096c <insert+0x87>
  	# 如果右子树不为空，递归至下一层，这期间的操作参考 400a98 的部分：
  400953:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400957:	48 8b 40 10          	mov    0x10(%rax),%rax
  40095b:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  40095f:	48 89 d6             	mov    %rdx,%rsi
  400962:	48 89 c7             	mov    %rax,%rdi
  400965:	e8 7b ff ff ff       	call   4008e5 <insert>
  40096a:	eb 0c                	jmp    400978 <insert+0x93>
    # 如果右子树为空，插入右子树：
  40096c:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
  400970:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  400974:	48 89 50 10          	mov    %rdx,0x10(%rax)
  400978:	90                   	nop
  400979:	c9                   	leave  
  40097a:	c3                   	ret
```

??? quote "摘自 OI-Wiki 的[二叉搜索树](https://oiwiki.org/ds/bst)相关知识" 

    二叉搜索树是一种二叉树的树形数据结构，其定义如下：
    
    - 空树是二叉搜索树。
    
    - 若二叉搜索树的左子树不为空，则其左子树上所有点的附加权值均小于其根节点的值。
    
    - 若二叉搜索树的右子树不为空，则其右子树上所有点的附加权值均大于其根节点的值。
    
    - 二叉搜索树的左右子树均为二叉搜索树。
    
    **插入一个元素**
    
    在以 root 为根节点的二叉搜索树中插入一个值为 value 的节点。
    
    分类讨论如下：
    
    - 若 root 为空，直接返回一个值为 value 的新节点。
    
    - 若 root 的权值等于 value，该节点的附加域该值出现的次数自增 1
    
    - 若 root 的权值大于 value，在 root 的左子树中插入权值为 value 的节点。
    
    - 若 root 的权值小于 value，在 root 的右子树中插入权值为 value 的节点。

以上我们明白了 `insert` 函数的功能就是在二叉搜索树上插入新的值

这里需要尤其注意的是：在输入的单个字符与节点对应时，我们取的是节点值的最低八位；而在 `insert` 操作时，我们取的是 `val[3:2]`，也就是低十六位的高八位。因此我们在理解 `treeNode` 的 `val` 内容时，必须分开来看

以下是 `val` 取低十六位时，低八位 ASCII 字符与高八位十六进制数的对应表：

|  p   |  g   |  y   |  u   |  a   |  i   |  r   |  j   |  z   |  s   |  h   |  l   |  f   |  d   |  w   |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| 0x4d | 0x55 | 0x4e | 0x46 | 0x56 | 0x57 | 0x48 | 0x4b | 0x52 | 0x45 | 0x50 | 0x44 | 0x53 | 0x43 | 0x58 |

我们又知道，15 个节点的二叉树要求深度为 4，那么它必须是一个满二叉树。下面不加证明的给出一个结论：

> 满二叉搜索树的中序遍历是节点值的递增序列

我们给出这个递增序列对应的节点编号 `dlsurjpyhzfgaiw`，之后的计算过程略

**Answer: `yugljzidsrphfaw`**

