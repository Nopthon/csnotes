# SQL Injection

考虑一个网页登录页面，采用 POST 携带 `username` 和 `password` 两个参数发送登录请求。后端进行一次 DQL 操作：

```sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
```

其中 `$username` 和 `$password` 被直接替换为请求参数。如果 **SQL 能够返回用户数据（也就是有效输出）**，那么身份验证成功，进行登录

以某靶机的 `login.php` 的部分内容为例，只留下了核心的查询部分：

```c title="login.php"
// 如果提交了登录表单
if(isset($_POST['login']))
{   
    // 构造查询语句，直接进行了拼接
    $run='SELECT * FROM auth WHERE password=\''.$password.'\' and username=\''.$username.'\'';
    // 执行 SQL 查询
    $result = mysqli_query($conn, $run);
    // 如果能查到至少一条记录，登录成功
    // 这里的判断逻辑是“是否返回了有效数据”，而不是“实际比对了密码”
    if (mysqli_num_rows($result) > 0) {
        // 一些登录成功后的行为
        $row = mysqli_fetch_assoc($result);
        echo "You are allowed<br>";
        $_SESSION['logged']=true;
        $_SESSION['admin']=$row['username'];
        header('Location: panel.php', true, 302);
    }
    else
    {
        // 登录失败
        echo "<script>alert('Try again');</script>";
    }
}
```

这里的 SQL 查询语句是直接由用户输入和其他内容拼接组成，并且只要存在有效的查找记录就登录成功，因此可以进行指令注入

---
