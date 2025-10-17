# PA0 note

PA0 的目的是熟悉 x86-PA 的实验环境，这里只额外放一些个人的 Tips

### Beautify your workspace 

实验环境是一个 Debian 服务器，PA 实验网站通过 Websocket 与远程 Shell 进行长期交互（不是很好用），我们希望搭建一个更加熟悉的实验环境

这里考虑两个方向：

#### Vim User

在自己的 Shell 中进行 SSH 连接，使用 Vim 打开文件，此时使用的是本机的 Vim，因此可以回到熟悉的 Vim 环境中

#### VSCode User

在 VSCode 中使用 SSH FS 插件（**不要用官方的 SSH**），可以实现在本地 VScode 进行实验

不使用官方插件的原因是官方插件需要在远程服务器上下载一些配置，而远程服务器对 `pa_nju` 文件夹以外的写操作高度受限，VSCode 无法下载使用 SSH 前的配置内容

以及如果你真的尝试在 `pa_nju` 文件夹内安装这些内容，submit 时你会发现作业压缩包的体积可能很大，以及提交窗口限制压缩包大小不超过 200MB

### Backup your code

如果想将一份完整的环境下载到本地进行备份，你可以使用 SFTP。在 Windows/Mac 上你可以使用 FileZilla，在 Linux 上直接 `sftp` 即可

备份完整环境是非常重要的，虽然学会 Git 操作也可以实现回档（每一次 make 操作都会进行一次 git commit）

### Learn to "Read the friendly manual"

字面意思，以及很多手册其实并没有那么 friendly，甚至是 buggy 的

隐忍。

### Decrypt the submit_zip (for fun)

每次 make submit 时都会生成一个加密的压缩包，加密用的程序 submit 是由 PyInstaller 打包的 Python 可执行文件，感兴趣的话可以尝试逆向，找找压缩包密码的生成方式

虽然解密后的压缩包里面也没有什么好玩的东西，基本上就是打包了一份实验环境

`i_love_ics_pa`

### Reading before coding, thinking before asking, rethinking before denying

“先读而后写，先思而后问，先省而后断。”（奇怪的翻译）

这句话我写的，我觉得写的很好。