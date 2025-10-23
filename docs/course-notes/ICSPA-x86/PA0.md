# PA0 note

PA0 的目的是熟悉 x86-PA 的实验环境，这里只额外放一些个人的 Tips

### Beautify your workspace 

实验环境是一个 Debian 服务器，PA 实验网站通过 Websocket 与远程 Shell 进行长期交互（不是很好用），我们希望搭建一个更加熟悉的实验环境

这里考虑两个方向：

#### Vim User

在自己的 Shell 中进行 SSH 连接，使用 Vim 打开文件，此时使用的是本机的 Vim 配置，可以回到熟悉的 Vim 环境中

#### VSCode User

在 VSCode 中使用 SSH FS 插件（**不要用官方的 SSH **），可以实现在本地 VScode 进行实验

不使用官方插件的原因是官方插件需要在远程服务器上下载一些配置，而远程服务器对 `pa_nju` 文件夹以外的写操作高度受限，VSCode 无法在远程服务器上下载这些配置内容

以及如果你真的尝试在 `pa_nju` 文件夹内安装这些内容，submit 时你会发现作业压缩包的体积可能很大，以及作业备用提交窗口限制压缩包大小不超过 200MB 的事实

### Backup your code

如果想将一份完整的环境下载到本地进行备份，你可以使用 SFTP。在 Windows/Mac 上你可以使用 FileZilla，在 Linux 上直接 `sftp` 即可

备份完整环境是非常重要的，比如 submit 的第二步会进行 Integrity Check（检测有没有修改不应该修改的文件），无意中修改文件（一个空格、换行符也算）会导致无法提交阶段作业，此时进行 git 回退会比较麻烦，此时利用 SFTP 上传一份之前的未经修改的备份可以解决问题

!!! note "submit 通过 MD5 检验判断是否修改文件，“文件修改日期”等元数据不会影响 MD5 值，但是在部分 Windows 编辑器上打开并保存文件（换行符从 `\n` 自动变为 `\r\n`）会影响 md5 值，导致 Check Failed"

### Learn Git

`pa_nju` 是一个 Git 仓库，每次 make 时都会进行一次 git commit，你也可以手动 commit，并且在手动 commit 时进行有意义的备注

!!! success "Git 的好处"

    自动 commit 的好处：随时留后手
    
    手动 commit 的好处：留自己掌握范围内的后手
    
    因为自动 commit 的备注不能体现 commit 时的进度，你应该手动 commit 并添加有意义的备注，并在回退时（如果到了这一步）优先回退到自己已知状态的 commit

个人建议在使用 Git 的同时保存一份完整的备份


### "<font color = "#0e79a5">R</font>ead <font color= '#0e79a5'>T</font>he <del>Fxxking</del> <font color= '#0e79a5'>F</font>riendly <font color= '#0e79a5'>M</font>anual"

字面意思，以及很多手册其实并没有那么 friendly，甚至是 buggy 的（比如 i386 manual）

隐忍。