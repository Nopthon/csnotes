# Project 0: Python, Setup, & Autograder Tutorial

Project 食用教程，类似 CS61A，可以本地测试，可以在 Gradescope 实测（这个 Proj 除外）

给了三道试机题，解答如下（谁家 one-liner）

---

```python title="addition.py"
def add(a, b):
    "Return the sum of a and b"
    "*** YOUR CODE HERE ***"
    return a + b
```

```python title="buyLotsOfFruit.py"
def buyLotsOfFruit(orderList):
    """
        orderList: List of (fruit, numPounds) tuples

    Returns cost of order
    """
    "*** YOUR CODE HERE ***"
    return sum(fruitPrices[fruit] * numPounds for fruit, numPounds in orderList)
```

```python title="shopSmart.py"
def shopSmart(orderList, fruitShops):
    """
        orderList: List of (fruit, numPound) tuples
        fruitShops: List of FruitShops
    """
    "*** YOUR CODE HERE ***"
    # shop.py 中有一些函数实现，比如 getPriceOfOrder()
    return min(fruitShops, key=lambda shop: shop.getPriceOfOrder(orderList))
```

本地 `python autograder.py` 的结果

```
Starting on 2-25 at 0:21:46

Question q1
===========

*** PASS: test_cases\q1\addition1.test
***     add(a,b) returns the sum of a and b
*** PASS: test_cases\q1\addition2.test
***     add(a,b) returns the sum of a and b
*** PASS: test_cases\q1\addition3.test
***     add(a,b) returns the sum of a and b

### Question q1: 1/1 ###


Question q2
===========

*** PASS: test_cases\q2\food_price1.test
***     buyLotsOfFruit correctly computes the cost of the order
*** PASS: test_cases\q2\food_price2.test
***     buyLotsOfFruit correctly computes the cost of the order
*** PASS: test_cases\q2\food_price3.test
***     buyLotsOfFruit correctly computes the cost of the order

### Question q2: 1/1 ###


Question q3
===========

Welcome to shop1 fruit shop
Welcome to shop2 fruit shop
*** PASS: test_cases\q3\select_shop1.test
***     shopSmart(order, shops) selects the cheapest shop
Welcome to shop1 fruit shop
Welcome to shop2 fruit shop
*** PASS: test_cases\q3\select_shop2.test
***     shopSmart(order, shops) selects the cheapest shop
Welcome to shop1 fruit shop
Welcome to shop2 fruit shop
Welcome to shop3 fruit shop
*** PASS: test_cases\q3\select_shop3.test
***     shopSmart(order, shops) selects the cheapest shop

### Question q3: 1/1 ###


Finished at 0:21:46

Provisional grades
==================
Question q1: 1/1
Question q2: 1/1
Question q3: 1/1
------------------
Total: 3/3

Your grades are NOT yet registered.  To register your grades, make sure
to follow your instructor's guidelines to receive credit on your project.
```
