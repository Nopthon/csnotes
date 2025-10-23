# Lab01 

Shell 教程关，题目来源 [MIT - The Missing Semester of Your CS Education](https://missing.csail.mit.edu/2020/course-shell/)

> 1) 在/tmp下新建一个名为test的目录。

移动到 `/tmp` 文件夹，使用 `mkdir` 生成空的文件夹

```bash
cd /tmp
mkdir test
```

!!! note ""

    `/tmp` 专门用于存储临时文件，其内容具有较短的生命周期（最晚到下一次重启设备）
    
    `mkdir` 也可以在非当前路径直接生成空文件夹：`mkdir /tmp/test` 

---

> 2) 用命令man查看命令touch的使用手册。

```bash
man touch
```

没有配图

> 3) 用命令touch在test目录中新建一个名为test的文件。

```bash
cd ./test
touch test
```

---

> 4) 用命令echo将以下内容一行一行地写入test文件。

```bash
echo -e '#!/bin/sh\ncurl --head --silent https://www.nju.edu.cn' > test
```

!!! note "关于引号和转义"

    此处用引号阻止 `#` 成为注释，而用单引号可以使字符串保持原样，不进行解析（比如转义符，也包括 `!` 等符号）
    使用 `-e` 参数可以额外允许 `\n` 等转义字符的使用，或者使用双引号默认解析转义字符

---

> 5) 尝试执行这个文件，即将该脚本的路径（./test）输入到您的shell中并回车。如果程序无法执行，请使用ls命令来获取信息并给出其不能执行的原因。

```bash
nopthon@nopes-computer:/tmp/test$ ./test
-bash: ./test: Permission denied
```

发现报错信息为 “权限不足”，使用 `ls -l` 查看 `test` 文件的权限：

```bash
nopthon@nopes-computer:/tmp/test$ ls -l
total 4
-rw-r--r-- 1 nopthon nopthon 54 Sep 11 00:34 test
```

发现我们缺乏对 `test` 的执行权限（否则它至少应该是 `-rwxr--r--`），需要使用 `chmod` 指令进行权限修改

---

> 6) 查看命令chmod的手册，使用命令chmod改变test文件的权限，使 ./test 能够成功执行，不要使用sh test来执行该程序。

```bash
nopthon@nopes-computer:/tmp/test$ man chmod
nopthon@nopes-computer:/tmp/test$ chmod 777 test
nopthon@nopes-computer:/tmp/test$ ls -l
total 4
-rwxrwxrwx 1 nopthon nopthon 54 Sep 11 00:34 test
```

!!! note "chmod"
    
    `chmod` 指令采用八进制数表示 `Owner-Group-Others` 三级权限的设置
    
    比如 `5 = 4 + 0 + 1 = 101` 对应 `r-x`；`7 = 4 + 2 + 1 = 111` 对应 `rwx` 

---

> 7) 请问你的shell是如何知道这个文件需要使用sh来解析的。请通过网络搜索“unix shebang”来了解更多信息。

`test` 作为bash脚本，其第一行 `#!/bin/sh` （其中 `#!` 就是 SheBang 符号）指定该程序使用 `/bin/sh` 处的 `sh` 进行解析（必须指定绝对路径）。如果缺少这一行，则会以当前默认 Shell 执行该脚本（由环境变量 `$SHELL` 决定）

!!! note "About Shebang"

    SheBang 行在执行时被当作注释，但是通过 `cat` 等指令输出时是作为文件内容的一部分的

---

> 8) 请使用 | 和 > ，将test文件输出的最后5行内容写入自己**主目录**下的last-5-lines.txt文件中。

```bash
./test | tail -n 5 > ~/last-5-lines.txt
```

!!! note

    执行 `./test` ，输出结果通过管道符作为 `tail` 的输入，`tail` 的 `-n` 参数设置为 `5` 表示输出最后五行内容， `>` 将 `tail` 的输出写入主目录下的 `last-5-lines.txt`
    
    `>` 写入的文件不存在时，会自动创建新文件

---

