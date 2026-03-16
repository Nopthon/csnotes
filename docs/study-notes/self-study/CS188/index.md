# CS188 Fall 2025

UC Berkley 的人工智能导论，Fall 2025 版本

前 24 节课程视频 Lecture 选择 Fall 2018 版本（据说质量更高一些）

其他的内容均选择 Fall 2025 版本（有公开版本的作业可以提交批改）

作业提交平台 [Gradescope](https://www.gradescope.com/)，使用邀请码 `4VK322`，选择学校为 `UC Berkley` 即可参与，不需要学生身份

---

Lecture Notes 基本上是对课程自带 Note + PPT 的概括，从某种悲观的角度来看，就是翻译原来的英文讲义（自身理解难以超出书本）

Discussion 就不看了

HWs&PROJs 是作业/项目实现，着重在 Project 的实现

---

### 📅 CS188 Fall 2025 Calendar

[CS 188 Fall 2025 | Introduction to Artificial Intelligence at UC Berkeley](https://inst.eecs.berkeley.edu/~cs188/fa25/)

<style>
    .spanned-table {
        border-collapse: collapse;
        width: 100%;
        border: 2px solid #333;
    }
    .spanned-table th,
    .spanned-table td {
        border: 1px solid #666;
        padding: 8px;
        text-align: left;
        vertical-align: top;
    }
</style>
<table class="spanned-table"><thead>
    <tr class="starting-row">
        <th style="width:3%">Wk.</th>
        <th style="width:8%">Date</th>
        <th style="width:29%">Lecture (<a href="https://drive.google.com/drive/folders/1w7O6oPDxzE5WU4-AFRG74RuBZgCyrRaX">pptx</a>)</th>
        <th style="width:12%">Readings</th>
        <th style="width:18%">Discussion</th>
        <th style="width:15%">HW</th>
        <th style="width:15%">Project</th>
    </tr>
    </thead><tbody><tr class="starting-row"><td class=" week-cell" rowspan="1" id="week-34">
    1</td><td class="" rowspan="1">
    Thu<br>Aug 28
    </td><td class=" " rowspan="1">1. Intro<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec01.pdf" aria-label="Slides for Lecture 1 (Intro)">Slides</a> / <a href="https://www.youtube.com/watch?v=16Dir4QqCUg" aria-label="Video for Lecture 1 (Intro)">Video</a> / <a href="https://www.youtube.com/watch?v=U9dUsmXEdkw" aria-label="Recording for Lecture 1 (Intro)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 1-2
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/search/agents.html">1.1</a></td>
    <td class=" " rowspan="1">No Discussion</td>
    <td class=" " rowspan="1">HW0 [optional]
        <br>
        (due Tue Sep 02)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6615217" aria-label="Part A for HW0 [optional]">Part A</a>
        / 
        No Part B</td>
    <td class="schedule-purple" rowspan="1" ><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj0">Project 0 (optional)</a>
        <br>
        (due Fri Aug 29)</td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-35">
    2</td><td class="is-even" rowspan="1">
    Tue<br>Sep 02
    </td><td class="is-even " rowspan="1">2. Uninformed Search<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec02.pdf" aria-label="Slides for Lecture 2 (Uninformed Search)">Slides</a> / <a href="https://www.youtube.com/watch?v=-Xx0QSFYfIQ" aria-label="Video for Lecture 2 (Uninformed Search)">Video</a> / <a href="https://www.youtube.com/watch?v=tpBQkYm41kg" aria-label="Recording for Lecture 2 (Uninformed Search)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 3.1-3.4
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html">1.2-1.3</a></td>
    <td class="is-even " rowspan="2">No Discussion</td>
    <td class="is-even " rowspan="2">HW1
        <br>
        (due Thu Sep 11)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6616314" aria-label="Part A for HW1">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw1.pdf" aria-label="Part B for HW1">Part B</a></td>
    <td class="schedule-blue" rowspan="4"><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj1">Project 1</a>
        <br>
        (due Fri Sep 12)</td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Sep 04
    </td><td class="is-even " rowspan="1">3. A* Search and Heuristics<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec03.pdf" aria-label="Slides for Lecture 3 (A* Search and Heuristics)">Slides</a> / <a href="https://www.youtube.com/watch?v=Mlwrx7hbKPs" aria-label="Video for Lecture 3 (A* Search and Heuristics)">Video</a> / <a href="https://www.youtube.com/watch?v=UuPyDKANqVo" aria-label="Recording for Lecture 3 (A* Search and Heuristics)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 3.5-3.6
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html">1.4-1.5</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-36">
    3</td><td class="" rowspan="1">
    Tue<br>Sep 09
    </td><td class=" " rowspan="1">4. CSPs I<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec04.pdf" aria-label="Slides for Lecture 4 (CSPs I)">Slides</a> / <a href="https://www.youtube.com/watch?v=81z2ANjQcH4" aria-label="Video for Lecture 4 (CSPs I)">Video</a> / <a href="https://www.youtube.com/watch?v=y80mKSJIG3Q" aria-label="Recording for Lecture 4 (CSPs I)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 6.1
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html">2.1-2.4</a>
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa21/assets/demos/csp/csp_demos.html">CSP Demo</a></td>
    <td class=" " rowspan="2">1. Search<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc01.pdf" aria-label="Worksheet for Discussion 1 (Search)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc01-sols.pdf" aria-label="Solutions for Discussion 1 (Search)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7YElaVxVC1LhD-THpGCUkw" aria-label="Video for Discussion 1 (Search)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep01.pdf" aria-label="Worksheet for Exam Prep 1 (Search)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep01-sols.pdf" aria-label="Solutions for Exam Prep 1 (Search)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6Mu2VdR7e4vsjLavKH4rpq" aria-label="Video for Exam Prep 1 (Search)">Video</a></td>
    <td class=" " rowspan="2">HW2
        <br>
        (due Thu Sep 18)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6699564" aria-label="Part A for HW2">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw2.pdf" aria-label="Part B for HW2">Part B</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Sep 11
    </td><td class=" " rowspan="1">5. CSPs II<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec05.pdf" aria-label="Slides for Lecture 5 (CSPs II)">Slides</a> / <a href="https://www.youtube.com/watch?v=_DXf6oaknHw" aria-label="Video for Lecture 5 (CSPs II)">Video</a> / <a href="https://www.youtube.com/watch?v=BZjQnNpXrqU" aria-label="Recording for Lecture 5 (CSPs II)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 6.2-6.5
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/csp/ordering.html">2.4-2.6</a></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-37">
    4</td><td class="is-even" rowspan="1">
    Tue<br>Sep 16
    </td><td class="is-even " rowspan="1">6. Game Trees I<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec06.pdf" aria-label="Slides for Lecture 6 (Game Trees I)">Slides</a> / <a href="https://www.youtube.com/watch?v=v6RgZBjc8og" aria-label="Video for Lecture 6 (Game Trees I)">Video</a> / <a href="https://www.youtube.com/watch?v=nYSXOdOoVWk" aria-label="Recording for Lecture 6 (Game Trees I)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 5.2-5.5
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html">3.1-3.2</a></td>
    <td class="is-even " rowspan="2">2. CSPs<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc02.pdf" aria-label="Worksheet for Discussion 2 (CSPs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc02-sols.pdf" aria-label="Solutions for Discussion 2 (CSPs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg40_abgeF6j-SsVirPL8ybH" aria-label="Video for Discussion 2 (CSPs)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep02.pdf" aria-label="Worksheet for Exam Prep 2 (CSPs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep02-sols.pdf" aria-label="Solutions for Exam Prep 2 (CSPs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg5CwVq3fOErJavyrRYg1J1V" aria-label="Video for Exam Prep 2 (CSPs)">Video</a></td>
    <td class="is-even " rowspan="2">HW3
        <br>
        (due Thu Sep 25)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6749422" aria-label="Part A for HW3">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw3.pdf" aria-label="Part B for HW3">Part B</a></td>
    <td class="schedule-green" rowspan="4"><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj2">Project 2</a>
        <br>
        (due Fri Sep 26)</td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Sep 18
    </td><td class="is-even " rowspan="1">7. Game Trees II<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec07.pdf" aria-label="Slides for Lecture 7 (Game Trees II)">Slides</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6LsW3Ye46-3_SEodVEFWXc" aria-label="Video for Lecture 7 (Game Trees II)">Video</a> / <a href="https://www.youtube.com/watch?v=XviDZUyJ_Mc" aria-label="Recording for Lecture 7 (Game Trees II)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 5.2-5.5, 16.1-16.3
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html">3.3-3.6</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-38">
    5</td><td class="" rowspan="1">
    Tue<br>Sep 23
    </td><td class=" " rowspan="1">8. MDPs I<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec08.pdf" aria-label="Slides for Lecture 8 (MDPs I)">Slides</a> / <a href="https://www.youtube.com/watch?v=4LW3H_Jinr4" aria-label="Video for Lecture 8 (MDPs I)">Video</a> / <a href="https://www.youtube.com/watch?v=5_ltZ7LnwM0" aria-label="Recording for Lecture 8 (MDPs I)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 17.1-17.2
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html">4.1-4.2</a></td>
    <td class=" " rowspan="2">3. Game Trees<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc03.pdf" aria-label="Worksheet for Discussion 3 (Game Trees)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc03-sols.pdf" aria-label="Solutions for Discussion 3 (Game Trees)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7zq86VPzCRa0bLgIRxSb2w" aria-label="Video for Discussion 3 (Game Trees)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep03.pdf" aria-label="Worksheet for Exam Prep 3 (Game Trees)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep03-sols.pdf" aria-label="Solutions for Exam Prep 3 (Game Trees)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7yHhsVxDWC3MOyNqHw99Nb" aria-label="Video for Exam Prep 3 (Game Trees)">Video</a></td>
    <td class=" " rowspan="2">HW4
        <br>
        (due Thu Oct 02)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6812376" aria-label="Part A for HW4">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw4.pdf" aria-label="Part B for HW4">Part B</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Sep 25
    </td><td class=" " rowspan="1">9. MDPs II<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec09.pdf" aria-label="Slides for Lecture 9 (MDPs II)">Slides</a> / <a href="https://www.youtube.com/watch?v=ZToWj64rxvQ" aria-label="Video for Lecture 9 (MDPs II)">Video</a> / <a href="https://www.youtube.com/watch?v=iXELtYQIV2g" aria-label="Recording for Lecture 9 (MDPs II)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 17.1-17.2
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/value-iteration.html">4.3-4.5</a></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-39">
    6</td><td class="is-even" rowspan="1">
    Tue<br>Sep 30
    </td><td class="is-even " rowspan="1">10. RL I<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec10.pdf" aria-label="Slides for Lecture 10 (RL I)">Slides</a> / <a href="https://www.youtube.com/watch?v=TiXS7vROBEg" aria-label="Video for Lecture 10 (RL I)">Video</a> / <a href="https://www.youtube.com/watch?v=qu1e-uO8p3E" aria-label="Recording for Lecture 10 (RL I)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 22
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/rl/rl.html">5.1-5.3</a></td>
    <td class="is-even " rowspan="2">4. MDPs<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc04.pdf" aria-label="Worksheet for Discussion 4 (MDPs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc04-sols.pdf" aria-label="Solutions for Discussion 4 (MDPs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6fl7wlML6-1zoaENqU6J9R" aria-label="Video for Discussion 4 (MDPs)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep04.pdf" aria-label="Worksheet for Exam Prep 4 (MDPs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep04-sols.pdf" aria-label="Solutions for Exam Prep 4 (MDPs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6qD_jkkypKBR1MPmYm4gTA" aria-label="Video for Exam Prep 4 (MDPs)">Video</a></td>
    <td class="is-even " rowspan="2">HW5
        <br>
        (due Thu Oct 09)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6866431" aria-label="Part A for HW5">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw5.pdf" aria-label="Part B for HW5">Part B</a></td>
    <td class="schedule-purple" rowspan="4"><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj3">Project 3</a>
        <br>
        (due Fri Oct 10)</td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Oct 02
    </td><td class="is-even " rowspan="1">11. RL II<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec11.pdf" aria-label="Slides for Lecture 11 (RL II)">Slides</a> / <a href="https://www.youtube.com/watch?v=XafrqwHfBKE" aria-label="Video for Lecture 11 (RL II)">Video</a> / <a href="https://www.youtube.com/watch?v=utsftCPoFBU" aria-label="Recording for Lecture 11 (RL II)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 22
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/rl/eae.html">5.4-5.5</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-40">
    7</td><td class="" rowspan="1">
    Tue<br>Oct 07
    </td><td class=" " rowspan="1">12. Probability<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec12.pdf" aria-label="Slides for Lecture 12 (Probability)">Slides</a> / <a href="https://www.youtube.com/watch?v=sMNbLXsvRig" aria-label="Video for Lecture 12 (Probability)">Video</a> / <a href="https://www.youtube.com/watch?v=Ko3GJpMW3GM" aria-label="Recording for Lecture 12 (Probability)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 12.1-12.5
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/probability.html">6.1-6.2</a></td>
    <td class=" " rowspan="2">5. RL<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc05.pdf" aria-label="Worksheet for Discussion 5 (RL)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc05-sols.pdf" aria-label="Solutions for Discussion 5 (RL)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg70Qjh5v9djygB2wBOZ6nhg" aria-label="Video for Discussion 5 (RL)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep05.pdf" aria-label="Worksheet for Exam Prep 5 (RL)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep05-sols.pdf" aria-label="Solutions for Exam Prep 5 (RL)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7a4HT0zzWdM4SnKAgMQWZF" aria-label="Video for Exam Prep 5 (RL)">Video</a></td>
    <td class=" " rowspan="2">HW6
        <br>
        (due Thu Oct 16)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/6924842" aria-label="Part A for HW6">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw6.pdf" aria-label="Part B for HW6">Part B</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Oct 09
    </td><td class=" " rowspan="1">13. Bayes Nets: Representation<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec13.pdf" aria-label="Slides for Lecture 13 (Bayes Nets: Representation)">Slides</a> / <a href="https://www.youtube.com/watch?v=T4l6ltMMcec" aria-label="Video for Lecture 13 (Bayes Nets: Representation)">Video</a> / <a href="https://www.youtube.com/watch?v=6c_aQcEWLgM" aria-label="Recording for Lecture 13 (Bayes Nets: Representation)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 13.1-13.3
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/representation.html">6.3-6.4</a></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-41">
    8</td><td class="is-even" rowspan="1">
    Tue<br>Oct 14
    </td><td class="is-even " rowspan="1">14. Bayes Nets: Independence<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec14.pdf" aria-label="Slides for Lecture 14 (Bayes Nets: Independence)">Slides</a> / <a href="https://www.youtube.com/watch?v=FUnOdyZZAaE" aria-label="Video for Lecture 14 (Bayes Nets: Independence)">Video</a> / <a href="https://www.youtube.com/watch?v=GrvNhe_LcDE" aria-label="Recording for Lecture 14 (Bayes Nets: Independence)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 13.2
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/d-separation.html">6.5</a></td>
    <td class="is-even " rowspan="2">6. Probability and Bayes Nets<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc06.pdf" aria-label="Worksheet for Discussion 6 (Probability and Bayes Nets)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc06-sols.pdf" aria-label="Solutions for Discussion 6 (Probability and Bayes Nets)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6UNR28A6dXAHrG7Swqlwtl" aria-label="Video for Discussion 6 (Probability and Bayes Nets)">Video</a></td>
    <td class="is-even " rowspan="2"></td>
    <td class="schedule-blue" rowspan="9"><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj4">Project 4</a>
        <br>
        (due Fri Nov 07)</td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Oct 16
    </td><td class="is-even " rowspan="1">15. Bayes Nets: Inference<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec15.pdf" aria-label="Slides for Lecture 15 (Bayes Nets: Inference)">Slides</a> / <a href="https://www.youtube.com/watch?v=A1hYXGAUdmU" aria-label="Video for Lecture 15 (Bayes Nets: Inference)">Video</a> / <a href="https://www.youtube.com/watch?v=cLq_tFYQn4U" aria-label="Recording for Lecture 15 (Bayes Nets: Inference)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 13.3
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/elimination.html">6.6</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="3" id="week-42">
    9</td><td class="" rowspan="1">
    Tue<br>Oct 21
    </td><td class=" " rowspan="1">16. Bayes Nets: Sampling<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec16.pdf" aria-label="Slides for Lecture 16 (Bayes Nets: Sampling)">Slides</a> / <a href="https://www.youtube.com/watch?v=kGngCS-1kjU" aria-label="Video for Lecture 16 (Bayes Nets: Sampling)">Video</a> / <a href="https://www.youtube.com/watch?v=dD4NQBESd1o" aria-label="Recording for Lecture 16 (Bayes Nets: Sampling)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 13.3-13.4
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/approximate.html">6.7-6.8</a></td>
    <td class=" " rowspan="3">No Discussion</td>
    <td class=" " rowspan="3">HW7
        <br>
        (due Thu Oct 30)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/7039470" aria-label="Part A for HW7">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw7.pdf" aria-label="Part B for HW7">Part B</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw7_sols.pdf" aria-label="Solutions for HW7">Solutions</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Wed<br>Oct 22
    </td><td class=" " rowspan="1"><p>Midterm (Wed Oct 22, 7–9pm PT)</p>
    </td>
    <td class=" " rowspan="1"></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Oct 23
    </td><td class=" " rowspan="1">17. Decision Networks and VPI<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec17.pdf" aria-label="Slides for Lecture 17 (Decision Networks and VPI)">Slides</a> / <a href="https://www.youtube.com/watch?v=19sr7yKV56I" aria-label="Video for Lecture 17 (Decision Networks and VPI)">Video</a> / <a href="https://www.youtube.com/watch?v=H7myHLyR4_o" aria-label="Recording for Lecture 17 (Decision Networks and VPI)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 16.5-16.6
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/utilities.html">7.1-7.3</a></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-43">
    10</td><td class="is-even" rowspan="1">
    Tue<br>Oct 28
    </td><td class="is-even " rowspan="1">18. HMMs<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec18.pdf" aria-label="Slides for Lecture 18 (HMMs)">Slides</a> / <a href="https://www.youtube.com/watch?v=eCZLhZu_U1I" aria-label="Video for Lecture 18 (HMMs)">Video</a> / <a href="https://www.youtube.com/watch?v=sLoDIozweP8" aria-label="Recording for Lecture 18 (HMMs)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 14.3, 14.5
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/hmms/markov.html">8.1-8.3</a></td>
    <td class="is-even " rowspan="2">7. BN Inference and Sampling<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc07.pdf" aria-label="Worksheet for Discussion 7 (BN Inference and Sampling)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc07-sols.pdf" aria-label="Solutions for Discussion 7 (BN Inference and Sampling)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg4aHUl656RzNNp01xJWMOaX" aria-label="Video for Discussion 7 (BN Inference and Sampling)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep07.pdf" aria-label="Worksheet for Exam Prep 7 (BN Inference and Sampling)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep07-sols.pdf" aria-label="Solutions for Exam Prep 7 (BN Inference and Sampling)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg68kHzpVpZyu28iiMFWGSRw" aria-label="Video for Exam Prep 7 (BN Inference and Sampling)">Video</a></td>
    <td class="is-even " rowspan="2">HW8
        <br>
        (due Thu Nov 06)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/7082567" aria-label="Part A for HW8">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw8.pdf" aria-label="Part B for HW8">Part B</a></td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Oct 30
    </td><td class="is-even " rowspan="1">19. Particle Filtering<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec19.pdf" aria-label="Slides for Lecture 19 (Particle Filtering)">Slides</a> / <a href="https://www.youtube.com/watch?v=pNam9hbwg4g" aria-label="Video for Lecture 19 (Particle Filtering)">Video</a> / <a href="https://www.youtube.com/watch?v=hSEVCBVnd9I" aria-label="Recording for Lecture 19 (Particle Filtering)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 14.3
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/hmms/particle-filtering.html">8.4-8.5</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-44">
    11</td><td class="" rowspan="1">
    Tue<br>Nov 04
    </td><td class=" " rowspan="1">20. ML I: Naive Bayes<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec20.pdf" aria-label="Slides for Lecture 20 (ML I: Naive Bayes)">Slides</a> / <a href="https://www.youtube.com/watch?v=1nOb0vwWkAE" aria-label="Video for Lecture 20 (ML I: Naive Bayes)">Video</a> / <a href="https://www.youtube.com/watch?v=e8QI3N-BuEk" aria-label="Recording for Lecture 20 (ML I: Naive Bayes)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 20.1-20.2
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/ml/machine-learning.html">9.1-9.2</a></td>
    <td class=" " rowspan="2">8. VPI and HMMs<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc08.pdf" aria-label="Worksheet for Discussion 8 (VPI and HMMs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc08-sols.pdf" aria-label="Solutions for Discussion 8 (VPI and HMMs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg5k-qfJ2yJllVvOkvynnh3A" aria-label="Video for Discussion 8 (VPI and HMMs)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep08.pdf" aria-label="Worksheet for Exam Prep 8 (VPI and HMMs)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep08-sols.pdf" aria-label="Solutions for Exam Prep 8 (VPI and HMMs)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6kWHo6B5ZxyaMc32lmSKd2" aria-label="Video for Exam Prep 8 (VPI and HMMs)">Video</a></td>
    <td class=" " rowspan="2">HW9
        <br>
        (due Thu Nov 13)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/7126783" aria-label="Part A for HW9">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw9.pdf" aria-label="Part B for HW9">Part B</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Nov 06
    </td><td class=" " rowspan="1">21. ML II: Perceptrons<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec21.pdf" aria-label="Slides for Lecture 21 (ML II: Perceptrons)">Slides</a> / <a href="https://www.youtube.com/watch?v=UNr9gHyOnWA" aria-label="Video for Lecture 21 (ML II: Perceptrons)">Video</a> / <a href="https://www.youtube.com/watch?v=DgNpKfQBscs" aria-label="Recording for Lecture 21 (ML II: Perceptrons)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 19.6
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/ml/perceptrons.html">9.3-9.5, 9.7, 9.8</a></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-45">
    12</td><td class="is-even" rowspan="1">
    Tue<br>Nov 11
    </td><td class="is-even " rowspan="1"><p>No Lecture (Veterans Day)</p>
    </td>
    <td class="is-even " rowspan="1"></td>
    <td class="is-even " rowspan="2">9. Particle Filtering and Naive Bayes<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc09.pdf" aria-label="Worksheet for Discussion 9 (Particle Filtering and Naive Bayes)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc09-sols.pdf" aria-label="Solutions for Discussion 9 (Particle Filtering and Naive Bayes)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg5Oa65tmgsXLbeMI3Bgc-JW" aria-label="Video for Discussion 9 (Particle Filtering and Naive Bayes)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep09.pdf" aria-label="Worksheet for Exam Prep 9 (Particle Filtering and Naive Bayes)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep09-sols.pdf" aria-label="Solutions for Exam Prep 9 (Particle Filtering and Naive Bayes)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7bkPNq7wXdPYoO7g19quUj" aria-label="Video for Exam Prep 9 (Particle Filtering and Naive Bayes)">Video</a></td>
    <td class="is-even " rowspan="2">HW10
        <br>
        (due Thu Nov 20)<br><br><a href="https://www.gradescope.com/courses/1104867/assignments/7160703" aria-label="Part A for HW10">Part A</a>
        / 
        <a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/homeworks/cs188_fa25_hw10.pdf" aria-label="Part B for HW10">Part B</a></td>
    <td class="schedule-green" rowspan="4"><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/projects/proj5">Project 5</a>
        <br>
        (due Fri Nov 21)</td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Nov 13
    </td><td class="is-even " rowspan="1">22. ML III: Neural Networks<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec22.pdf" aria-label="Slides for Lecture 22 (ML III: Neural Networks)">Slides</a> / <a href="https://www.youtube.com/watch?v=LERtLI2h_nQ" aria-label="Video for Lecture 22 (ML III: Neural Networks)">Video</a> / <a href="https://www.youtube.com/watch?v=Cyq76KSM83k" aria-label="Recording for Lecture 22 (ML III: Neural Networks)">Recording</a></td>
    <td class="is-even " rowspan="1">AIMA 19.7
        <br>
        <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/ml/optimization.html">9.6, 9.9</a></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-46">
    13</td><td class="" rowspan="1">
    Tue<br>Nov 18
    </td><td class=" " rowspan="1">23. ML IV: Applications &amp; Decision Trees<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec23.pdf" aria-label="Slides for Lecture 23 (ML IV: Applications &amp; Decision Trees)">Slides</a> / <a href="https://www.youtube.com/watch?v=svW3I0cqfpw" aria-label="Video for Lecture 23 (ML IV: Applications &amp; Decision Trees)">Video</a> / <a href="https://www.youtube.com/watch?v=Thk6sY0OIqo" aria-label="Recording for Lecture 23 (ML IV: Applications &amp; Decision Trees)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 19.3</td>
    <td class=" " rowspan="2">10. ML<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc10.pdf" aria-label="Worksheet for Discussion 10 (ML)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc10-sols.pdf" aria-label="Solutions for Discussion 10 (ML)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg6nK60vejxWpFQNW8fIx2j_" aria-label="Video for Discussion 10 (ML)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep10.pdf" aria-label="Worksheet for Exam Prep 10 (ML)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep10-sols.pdf" aria-label="Solutions for Exam Prep 10 (ML)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7hzMd0eXTgEXyCqywxtdlV" aria-label="Video for Exam Prep 10 (ML)">Video</a></td>
    <td class=" " rowspan="10"></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Nov 20
    </td><td class=" " rowspan="1">24. ML V: Transformers<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec24.pdf" aria-label="Slides for Lecture 24 (ML V: Transformers)">Slides</a> / <a href="https://www.youtube.com/watch?v=JKGyGcooQWU" aria-label="Recording for Lecture 24 (ML V: Transformers)">Recording</a></td>
    <td class=" " rowspan="1">AIMA 24.4-24.5</td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-47">
    14</td><td class="is-even" rowspan="1">
    Tue<br>Nov 25
    </td><td class="is-even " rowspan="1">25. Applications: AI for Healthcare<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec25.pdf" aria-label="Slides for Lecture 25 (Applications: AI for Healthcare)">Slides</a> / <a href="https://www.youtube.com/watch?v=-NZ0YfCgEB0" aria-label="Recording for Lecture 25 (Applications: AI for Healthcare)">Recording</a></td>
    <td class="is-even " rowspan="1"></td>
    <td class="is-even " rowspan="2">No Discussion</td>
    <td class="" rowspan="8"></td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Nov 27
    </td><td class="is-even " rowspan="1"><p>No Lecture (Thanksgiving Break)</p>
    </td>
    <td class="is-even " rowspan="1"></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-48">
    15</td><td class="" rowspan="1">
    Tue<br>Dec 02
    </td><td class=" " rowspan="1">26. Applications: AI for Equality and Course Wrap-up<br><a href="https://inst.eecs.berkeley.edu/~cs188/fa25/assets/lectures/cs188-fa25-lec26.pdf" aria-label="Slides for Lecture 26 (Applications: AI for Equality and Course Wrap-up)">Slides</a> / <a href="https://youtu.be/NH_rutMYr1w" aria-label="Recording for Lecture 26 (Applications: AI for Equality and Course Wrap-up)">Recording</a></td>
    <td class=" " rowspan="1"></td>
    <td class=" " rowspan="2">11. ML 2<br><br>Discussion:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc11.pdf" aria-label="Worksheet for Discussion 11 (ML 2)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-disc11-sols.pdf" aria-label="Solutions for Discussion 11 (ML 2)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg55tVExgnBNPYEUoUeEUGlV" aria-label="Video for Discussion 11 (ML 2)">Video</a><br><br>Exam Prep:&nbsp;<a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep11.pdf" aria-label="Worksheet for Exam Prep 11 (ML 2)">Worksheet</a> / <a href="/~cs188/fa25/assets/discussions/cs188-fa25-examprep11-sols.pdf" aria-label="Solutions for Exam Prep 11 (ML 2)">Solutions</a> / <a href="https://www.youtube.com/playlist?list=PLp8QV47qJEg7XYsL7qqjL2AMfrNf_SBKK" aria-label="Video for Exam Prep 11 (ML 2)">Video</a></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Dec 04
    </td><td class=" " rowspan="1"><p>No Lecture</p>
    </td>
    <td class=" " rowspan="1"></td>
    </tr><tr class="starting-row"><td class="is-even week-cell" rowspan="2" id="week-49">
    16</td><td class="is-even" rowspan="1">
    Tue<br>Dec 09
    </td><td class="is-even " rowspan="2"><p>RRR Week</p>
    </td>
    <td class="is-even " rowspan="2"></td>
    <td class="is-even " rowspan="1"></td>
    </tr><tr class=""><td class="is-even" rowspan="1">
    Thu<br>Dec 11
    </td><td class="is-even " rowspan="1"></td>
    </tr><tr class="starting-row"><td class=" week-cell" rowspan="2" id="week-50">
    17</td><td class="" rowspan="1">
    Tue<br>Dec 16
    </td><td class=" " rowspan="1">
    </td>
    <td class=" " rowspan="1"></td>
    <td class=" " rowspan="1"></td>
    </tr><tr class=""><td class="" rowspan="1">
    Thu<br>Dec 18
    </td><td class=" " rowspan="1"><p>Final Exam (Thu Dec 18, 11:30am–2:30pm PT)</p>
    </td>
    <td class=" " rowspan="1"></td>
    <td class=" " rowspan="1"></td>
    </tr></tbody>
</table>
