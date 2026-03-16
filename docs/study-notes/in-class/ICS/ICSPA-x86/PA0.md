# PA0 note

PA0 的目的是熟悉 x86-PA 的实验环境

当然，熟悉环境的同时也要做好一些准备

> 如果你是为了完成 ICSPA 而来，你应该只看 PA0 的 Note

### Beautify your workspace 

实验环境是一个 Debian 服务器，PA 实验网站通过 Websocket 与远程 Shell 进行长期交互（不是很好用），我们希望搭建一个更加熟悉的实验环境

这里考虑两个方向

#### Vim User

（我不用 Vim，所以下面的内容我没测试）

在自己的 Shell 中进行 SSH 连接，使用 Vim 打开文件，此时使用的是本机的 Vim 配置，可以回到熟悉的 Vim 环境中

插件等可以在远程服务器上配置一份

#### VSCode User

在 VSCode 中使用 SSH FS 插件（**不要用官方的 SSH**），可以实现在本地 VScode 进行实验

> 不使用官方插件的原因是官方插件需要在远程服务器上下载一些配置，而远程服务器对 `pa_nju` 文件夹以外的写操作高度受限，VSCode 无法在远程服务器上下载这些配置内容

### Backup your code

如果想将一份完整的环境下载到本地进行备份，你可以使用 SFTP。在 Windows/Mac 上你可以使用 FileZilla，在 Linux 上直接 `sftp` 即可

备份完整环境是非常重要的，比如 submit 的第二步会进行 Integrity Check（检测有没有修改不应该修改的文件），无意中修改文件（一个空格、换行符也算）会导致无法提交阶段作业，此时进行 git 回退会比较麻烦，利用 SFTP 上传一份之前的未经修改的备份可以解决问题

!!! note "当你在之后提交作业时，submit 程序通过 MD5 检验判断是否修改核心文件。“文件修改日期”等元数据不会影响 MD5 值，但是在部分 Windows 编辑器上打开并保存文件（换行符从 `\n` 自动变为 `\r\n`）会影响 MD5 值，导致 Check Failed"

### Learn Git

`pa_nju` 是一个 Git 仓库，每次 make 时都会进行一次 git commit，你也可以手动 commit，并且在手动 commit 时进行有意义的备注

!!! success "Git 的好处"

    自动 commit 的好处：随时留后手。比如 submit 这些操作都会有自动的 git 备注
    
    比如你可以通过（自动）备注为 `make commit ...` 的 git commit 判断提交某次 PA 子任务前的最后修改版本
    
    手动 commit 的好处：留自己掌握范围内的后手
    
    因为自动 commit 的备注不能体现 commit 时的中间进度，你应该手动 commit 并添加有意义的备注（比如在 PA 1 的某次 commit 中备注 “完成了 sub 运算”），并在回退时（如果需要）优先回退到自己已知状态的 commit

个人建议在使用 Git 的同时保存一份完整的备份

### Check your score

在提交**每一个**子 PA 时，在 `scripts/.scores` 文件夹内会生成一个对应的 score 文件，通过 Base64 解码后可以导出这个子 PA 的分数情况（具体来说就是 `make test` 的原始结果，包含 `GOOD_TRAP` / `BAD_TRAP` 等信息）。有时这个文件不会生成，需要多 submit 几次

这个文件是直接决定 PA 分数的，确保每一个子 PA 都生成了一个 score 文件


### "<font color = "#0e79a5">R</font>ead <font color= '#0e79a5'>T</font>he <del>Fxxking</del> <font color= '#0e79a5'>F</font>riendly <font color= '#0e79a5'>M</font>anual && Textbook"

字面意思

尤其是 PA3 和 PA4，我建议在打开 PA 手册前先翻一遍教材有大概印象，这两个 Part 涉及的内容不是很浅显，read before action

推荐一个 wiki 网站，可能会对实现 PA 的各个阶段都有所帮助： [wiki.osdev.org](https://wiki.osdev.org)，连 NEMU creator 都参考了这个

（下个学期学操作系统这个网站总是会见面的）

---

最后还有一点建议：不建议踩 DDL 完成每个 PA；虽然 PA 的 DDL 在寒假，**建议在寒假回家之前完成所有的 PA（不然在非校园网环境下会有不可预知的几乎无法处理的问题）**