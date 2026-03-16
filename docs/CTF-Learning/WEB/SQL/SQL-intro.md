# SQL Intro

SQL 注入还是得了解一下 SQL 是什么的，虽然下面的内容和 SQL Injection 关系不是很大

---

!!! info "部分内容 from [this](https://liaoxuefeng.com/books/sql/relational/index/index.html)"

SQL (Structured Query Language) 是一种用于管理和操作<u>关系型数据库</u>的标准化<u>声明式编程语言</u>：

- 声明式语言相对于过程式语言，后者需要自己设计指令流 (How to do)，而前者只需要提出需要进行的操作 (What to do)
  

??? tip "一个例子：从 numbers 表中选出所有大于平均值的 number 值"
    
    对应的 SQL 查询语句: 
    
    ```sql
    SELECT number FROM numbers WHERE number > (SELECT AVG(number) FROM numbers)
    ```
    
    不需要自己实现查询细节，只需要对要求进行描述即可（对比一下在 C 语言中如何从 `numbers[]` 中选出所有大于平均值的 `number` 值，C 语言就是一个过程性语言）

---

SQL 有很多变种，对于 SQL 标准未涉及的语句，默认以 MySQL 可用的指令为主

---

<br>

## 关系型数据库

在了解 SQL 操作之前，需要先大致了解一下 SQL 用于管理的关系型数据库

关系型数据库采用表 (Table) 存储数据，表由行 (Row) 和列 (Column) 组成，表与表之间有明确关系

关系模型有三个重要的概念：主键、外键、索引

<br>

### 主键

**定义主键 (Primiry Key) 为唯一标识表中每一条记录的列（组合）**。主键存在**主键约束**：

- 唯一性：每行的主键值必须唯一
- 非空性：主键不能为空 NULL

另外，主键的修改频率通常很低，并且通常使用的列尽可能少（用尽可能少的列信息来唯一确定一个数据）

<br>

### 外键

**定义外键 (Foreign Key) 为匹配另一个表的主键值的列（组合）**，这里举个例子：

```
departments(主表)                  employees(从表)
+---------------+                +---------------+
| department_id |<---------------| department_id |
| name          |                | employee_id   |
| location      |                | name          |
| ...           |                | ...           |
+---------------+                +---------------+
```

`departments` 中的 `department_id` 是这个表的主键，`employees` 中的 `department_id` 是这个表的外键

<br>

#### 外键约束

主键是某个表唯一的标识符，外键是对其他表主键的引用，外键通过主键建立两个表之间的关系

在主键-外键的关联下，可以对相应的表分别描述为主表和从表，并存在**外键约束**：外键必须来自另一个表的主键（以确保表的关系一致性）

考虑到外键约束，当删除主表中的某个主键时，对应的从表也需要进行相应的修改。修改方式分为下列三种情况，在声明外键时进行显式的约束定义：

- 对应的所有从表记录级联删除（`#!sql ON DELETE CASCADE`）
    - 例：删除 `departments` 中的 `department_id: 1`，则所有 `department_id = 1` 的 `employees` 都删除
- 对应的所有从表记录的外键置为 NULL（`#!sql ON DELETE NULL`），不删除从表
- 只要存在对应的从表记录，就不允许在主表中删除（`#!sql ON DELETE RESTRICT`）

同理，修改主键也需要对应修改外表的从键，通常使用 `#!sql ON UPDATE CASCADE` 进行同步更新

<br>

### 索引

**索引是数据库中帮助快速查找数据的数据结构**，类似于书籍的目录。作用是可以显著提高查询速度，副作用是增加存储空间和影响数据写入性能。索引的底层数据结构实现通常是 B+ 树

数据库索引对于用户层 / 应用层来说是透明的，换句话说，用户和应用程序都无法感知到索引的存在

主键约束和 `#!sql UNIQUE` 约束会自动创建索引，某些 SQL 也会为外键自动创建索引。可以用下面的语句创建索引：

```sql
CREATE INDEX index_name ON table1 (col_name);
ALTER TABLE table1 ADD INDEX index_name (col_name);

-- 将 CREATE / ADD 换成 DROP 就是删除索引操作 
```

索引可以添加 `#!sql UNIQUE` 约束成为唯一索引，保证索引列（或列组合）的值在整个表中是唯一的。这一操作等价于为一个键同时添加 `#!sql UNIQUE` 约束和 `#!sql INDEX` 普通索引

此外，索引不一定必须在某一列上添加，也可以为多个列建立单一的组合索引：

```sql
CREATE INDEX index_name ON table1 (col_name1, col_name2, ...);
```

组合索引的使用遵循“最左前缀”原则，即查询条件中使用的列必须从索引的最左列开始，并且不能跳过中间的列。如果在查询操作时，需要频繁对 `col_name1, col_name2, ...` 列依次作出限制，那么组合索引的建立就很有必要，可以有效提高查询速率

> 根据最左前缀原则，如果 `col_name1` 很少被限制，就不应该将 `col_name1` 放在组合索引的最前面，因为左侧的列在匹配不上时，是不会继续向右匹配列的

<br>

## 数据库操作

数据库操作可以大致分为三类：

DDL: Data Definition Language，即数据定义语言。主要是对表 / 数据库的操作，而不是对单个数据的操作

DML: Data Manipulation Language，即数据操作语言。对表中的数据行进行增删改操作

DQL: Data Query Language，即数据查询语言。从数据库中搜索数据

---

### 数据定义语言 DDL

- 创建语句 `#!sql CREATE`

可以创建数据库：`#!sql CREATE DATABASE database_name;`

> 在创建多个数据库后，可以用 `#!sql SELECT DATABASE();` 语句查看自己处于哪一个数据库中，`#!sql SHOW DATABASES;` 查看所有的数据库，用 `#!sql USE database_name;` 语句切换到对应的数据库中

也可以创建表：`#!sql CREATE TABLE table1;`，可以对表的列进行初始化，列声明的完整语法如下：

```sql
column_name data_type         -- 1. 列名和类型（必需）
[NOT NULL | NULL]             -- 2. 空值约束（可选）
[DEFAULT default_value]       -- 3. 默认值（可选）
[AUTO_INCREMENT]              -- 4. 自增属性（可选）
[UNIQUE [KEY]]                -- 5. 唯一约束（可选）
[[PRIMARY] KEY]               -- 6. 主键约束（可选）
[COMMENT 'string']            -- 7. 注释（可选）
[COLUMN_FORMAT format]        -- 8. 列格式（可选，MySQL特定）
[STORAGE storage_type]        -- 9. 存储类型（可选，MySQL特定）
```

列名要求同 C 语言变量名要求，数据类型包括下列常见数据类型：

| 数据类型       | 备注                                                         |
| -------------- | ------------------------------------------------------------ |
| INT            | 整数                                                         |
| BIGINT         | 大整数（类比 `#!c long long int`）                           |
| DECIMAL(p,s)   | 一个小数点前有 p-s 位数，小数点后有 s 位数的，总精度 p 位的精确小数。 |
| FLOAT / DOUBLE | 近似小数                                                     |
| CHAR(n)        | n 位定长字符串                                               |
| VARCHAR(n)     | 最大 n 位的变长字符串                                        |
| DATE           | 存储为 YYYY-MM-DD，本质上是 3 Bytes 整数拼接                 |
| TIME           | 存储为 HH:MM:SS[.fraction]，至少为 3 Bytes，可能包含毫秒（2 Bytes 小数部分） |

除了必填的列名和数据类型，还可以选择其他约束，举例：

```sql
CREATE TABLE employees (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 员工 ID，非负整数存储，非空，自增，主键
    -- AUTO_INCREMENT 使得插入数据时不需要指定 id 值，自动设置为上一个 id + 1
    
    email VARCHAR(100) UNIQUE COMMENT 'It is unique',
    -- 邮箱，变长字符串存储，允许为空但是必须唯一，添加了键注释
    -- 多数 SQL 允许 UNIQUE 下有多个 NULL 值，SQL Server 不允许
    
    stat ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    -- 员工状态，枚举值存储，非空，默认值 'active'
    
    hire_date DATE DEFAULT (CURRENT_DATE),
    -- 入职日期，日期存储，默认值是插入数据时的日期
    
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(id)
    -- 部门 ID，非空整数存储，
    -- 另起一行进行外键约束，对应的主键为 Departments 表中的 id 列
);
```



- 修改语句 `#!sql ALTER`

可以修改很多内容：

```sql
ALTER TABLE table1 ADD column_name datatype [...]; -- 表中添加列
ALTER TABLE table1 DROP COLUMN column_name; -- 表中删除列
ALTER TABLE table1 RENAME COLUMN old_name TO new_name; -- 重命名列
ALTER TABLE table1 RENAME TO new_name; -- 重命名表
ALTER TABLE table1 MODIFY column_name new_datatype [...]; -- 修改列类型
```



- 删除语句 `#!sql DELETE`

可以一键删表，可以一键删库

```sql
DROP TABLE table1;
DROP DATABASE database_name;
```

<br>

### 数据操作语言 DML

- 插入语句 `#!sql INSERT` 

以元组 (Tuple) 的方式进行元素插入：

```sql
INSERT INTO table1 (column1, column2, column3) VALUES (value1, value2, value3);

-- 如果每列都被插入数据，可以省略对列名的枚举，如下
INSERT INTO table1 VALUES (value1, value2, value3);
-- 前提是插入的元素必须和表定义顺序完全匹配
```

插入的内容可以不是 `#!sql VALUES` 显式指定，可以结合查询语句 `#!sql SELECT` 使用，将查询结果存入表中



- 更新语句 `#!sql UPDATE`

进行约束条件下的元素修改：

```sql
UPDATE table1 SET column1 = new_value1, [column2 = new_value2, ...] WHERE condition; # WHERE 语句是对行的限定
-- 如果不写 WHERE condition，则选定所有行进行修改
```



- 删除语句 `#!sql DELETE`

进行约束条件下的元素删除：

```sql
DELETE FROM table1 WHERE condition;
-- 如果不写 WHERE condition，则选定所有行进行删除
```

> 对上面两条指令的用法举例：
>
> ```sql
> UPDATE employees SET salary = salary + 200 WHERE id = 114;
> DELETE FROM employees WHERE stat = 'inactive'; 
> ```

<br>

### 数据查询语言 DQL

核心语句为 `#!sql SELECT`，之前提到过 SQL 是一门声明式语言，因此在编写 `#!sql SELECT` 语句时，依次对不同类别的约束条件进行声明即可

> 基本语法

```sql
SELECT column1, column2, ... FROM table1;
```

返回 `table1` 表中所有记录的 `column1`, `column2`, ... 列

```sql
SELECT * FROM table1;
```

返回 `table1` 表中所有记录的**所有列**

---

> `#!sql WHERE` 子句 - 对（原始）结果过滤

```sql
SELECT column1, column2, ... FROM table1
WHERE condition;
```

---

> `#!sql ORDER BY` 子句 - 对结果排序

```sql
SELECT column1, column2, ... FROM table1
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...;
```

`#!sql ASC` 表示升序，`#!sql DESC` 表示降序。默认为 `#!sql ASC`

---

> `#!sql GROUP BY` 子句 - 对结果分组

通常会和聚合函数进行使用（以体现分组的意义）

```sql
SELECT column1, func(column2), ... FROM table1
GROUP BY column1; -- func 是一个聚合函数，比如 SUM AVG COUNT 等，类比 excel 函数
```

将原始数据先按照 `#!sql GROUP BY` 的分组方式进行分组，然后对每个小组进行聚合函数的计算

??? example "一个例子"

    ```sql
    /* orders 表格
    +----------+------------+----------+--------+
    | order_id | order_date | user_id  | amount |
    +----------+------------+----------+--------+
    | 1        | 2024-01-01 | 101      | 100    |
    | 2        | 2024-01-01 | 102      | 200    |
    | 3        | 2024-01-02 | 101      | 150    |
    | 4        | 2024-01-02 | 103      | 300    |
    | 5        | 2024-01-03 | 102      | 250    |
    +----------+------------+----------+--------+
    */
    
    SELECT user_id, COUNT(*) as order_count, SUM(amount) as total_amount
    FROM orders GROUP BY user_id; -- 这里使用了 as 为表达式起一个临时的，更具可读性的别名
    
    /* 输出结果
    +---------+-------------+--------------+
    | user_id | order_count | total_amount |
    +---------+-------------+--------------+
    | 101     | 2           | 250          |
    | 102     | 2           | 450          |
    | 103     | 1           | 300          |
    +---------+-------------+--------------+
    */
    ```

---

> `#!sql HAVING` 子句 - 对分组后的结果过滤

```sql
SELECT column1, func(column2), ... FROM table1
GROUP BY column1 HAVING condition;
```

---

> `#!sql LIMIT` 子句 - 限制返回记录的个数

```sql
SELECT column1, column2, ... FROM table1
LIMIT number;
```

---

> `#!sql JOIN` 子句 - 关联多个表格的数据行

```sql
SELECT column1, column2, ... FROM table1
JOIN table2 ON condition;
```

这里的 `#!sql JOIN` 有很多种连接方式，举出几种常见的

- `#!sql INNER JOIN` 只返回 `table1` 和 `table2` 都满足 `condition` 的记录
    - `#!sql JOIN` 默认为 `#!sql INNER JOIN`
- `#!sql LEFT JOIN` 返回 `table1` 中的所有记录（即使 `table2` 中可能没有匹配数据，此时用 `NULL` 占位）
    - 同理还有 `#!sql RIGHT JOIN` 
- `#!sql FULL OUTER JOIN` 返回 `table1` 和 `table2` 的并集，包含匹配和不匹配的记录
    - 这个有些数据库不支持

??? example "用例（AI 生成的）"

    对于下列的两个表：
    
    ```
    部门表：
    +---------+-----------+
    | dept_id | dept_name |
    +---------+-----------+
    | 10      | 技术部     |
    | 20      | 市场部     |
    | 30      | 财务部     |
    | 40      | 人事部     | ← 没有员工
    +---------+-----------+
    
    员工表：
    +--------+----------+---------+---------+
    | emp_id | emp_name | dept_id | salary  |
    +--------+----------+---------+---------+
    | 1      | 张三      | 10      | 8000.00 |
    | 2      | 李四      | 10      | 7500.00 |
    | 3      | 王五      | 20      | 6500.00 |
    | 4      | 赵六      | NULL    | 5000.00 | ← 没有部门
    +--------+----------+---------+---------+
    ```
    
    使用内连接：
    
    ```sql
    SELECT e.emp_name AS emp_name, e.salary AS salary, d.dept_name AS dept_name
    FROM employees e
    INNER JOIN departments d ON e.dept_id = d.dept_id
    ORDER BY e.emp_id;
    
    /*
    +--------------+----------+--------------+
    | emp_name     | salary   | dept_name    |
    +--------------+----------+--------------+
    | 张三          | 8000.00  | 技术部        |
    | 李四          | 7500.00  | 技术部        |
    | 王五          | 6500.00  | 市场部        |
    +--------------+----------+--------------+
    没有显示：
    1. 赵六（dept_id = NULL，不匹配）
    2. 人事部（没有员工，不匹配）
    3. 财务部（没有员工，不匹配）
    */
    ```
    
    使用左连接：
    
    ```sql
    SELECT e.emp_name AS emp_name, e.salary AS salary, d.dept_name AS dept_name
    FROM employees e
    LEFT JOIN departments d ON e.dept_id = d.dept_id
    ORDER BY e.emp_id;
    
    /*
    +--------------+----------+--------------+
    | emp_name     | salary   | dept_name    |
    +--------------+----------+--------------+
    | 张三          | 8000.00  | 技术部        |
    | 李四          | 7500.00  | 技术部        |
    | 王五          | 6500.00  | 市场部        |
    | 赵六          | 5000.00  | NULL         |
    +--------------+----------+--------------+
    特点：
    1. 员工表的所有记录都出现（赵六也出现）
    2. 没有部门的员工，部门名称显示为NULL
    3. 人事部和财务部仍然不出现（右表独有的不出现）
    */
    ```
    
    全外连接略，应该有六行结果

---

> `#!sql DISTINCT` 子句 - 去除结果中的重复行

```sql
SELECT DISTINCT column1, column2, ... FROM table1;
```

对于多列去重，当且仅当多列的行数据每项都完全一致时，才会去重

---

> `#!sql UNION` 子句 - 合并多个 `#!sql SELECT` 的结果

```sql
SELECT column1, column2, ... FROM table1
UNION [ALL]
SELECT column1, column2, ... FROM table2;
```

如果不添加 `#!sql ALL`，则会自动对两个表的查询结果在合并前去重
