initInterface = {
	indexInterface: `<section class="subject">
						<div class="addSubject">+</div>
					</section>`,
	praticeInterface: `<nav class="typeNav">
							<div class="chapter">章节练习</div>
							<div class="examination">考试模拟</div>
							<div class="random">随机练习</div>
						</nav>

						<section class="praticeContent body">
							<aside>
								<ul>
									<li>示例</li>
									<li>第一章 <input type="button" class="removeIndex" value="X"></li>
									<li>第二章 <input type="button" class="removeIndex" value="X"></li>
								</ul>
								<div class="addMore">+</div>
							</aside>

							<section class="chapterContent">
								<section class="content">
									<section class="SingleChoice">
										<div class="showEg">
											<p class="title">单选题</>
											<div class="eg">
												<p class="title">e.g：2008年2月有几天？</p>
												<div>
													<input type="radio" id="radio1" name="flag">
													<label for="radio1">A.28天</label>
													<input type="radio" id="radio2" name="flag">
													<label for="radio2">B.29天</label>
													<input type="radio" id="radio3" name="flag">
													<label for="radio3">C.30天</label>
													<input type="radio" id="radio4" name="flag">
													<label for="radio4">D.31天</label>
												</div>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>

									<section class="MultipleChoices">
										<div class="showEg">
											<p class="title">多选题</>
											<div class="eg">
												<p class="title">e.g：请问哪些是特别行政区？</p>
												<div>
													<input type="checkbox" id="checkbox1">
													<label for="checkbox1">A.香港</label>
													<input type="checkbox" id="checkbox2">
													<label for="checkbox2">B.澳门</label>
													<input type="checkbox" id="checkbox3">
													<label for="checkbox3">C.深圳</label>
													<input type="checkbox" id="checkbox4">
													<label for="checkbox4">D.广州</label>
												</div>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>

									<section class="TrueOrFalse">
										<div class="showEg">
											<p class="title">判断题（T为对，F为错）</>
											<div class="eg">
												<p class="title">e.g：2008年2月有30天。</p>
												<div>
													<input type="radio" id="judge1" name="judge">
													<label for="judge1">T</label>
													<input type="radio" id="judge2" name="judge">
													<label for="judge2">F</label>
												</div>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>

									<section class="FillInTheBlank">
										<div class="showEg">
											<p class="title">填空题</>
											<div class="eg">
												<p class="title">e.g：香港是在_______年回归？</p>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>

									<section class="ShortAnswer">
										<div class="showEg">
											<p class="title">简答题</>
											<div class="eg">
												<p class="title">e.g：什么是操作系统？</p>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>

									<section class="Programming">
										<div class="showEg">
											<p class="title">编程题</>
											<div class="eg">
												<p class="title">e.g：请编写一个计算总和的程序，例如：输入(20,30)，输出50.</p>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>
								</section>
							</section>

							<section class="examinationContent">
								<section class="content">
									<section class="contentDetail">
										<div>
											<p class="showSingleChoiceCount">
												单选题：<span class="count">20</span>道
											</p>
											<p class="showMultipleChoicesCount">
												多选题：<span class="count">20</span>道
											</p>
											<p class="showTrueOrFalseCount">
												判断题：<span class="count">20</span>道
											</p>
											<p class="showFillInTheBlankCount">
												填空题：<span class="count">20</span>道
											</p>
											<p class="showShortAnswerCount">
												简答题：<span class="count">20</span>道
											</p>
											<p class="showProgrammingCount">
												编程题：<span class="count">20</span>道
											</p>
											<p class="totalTime">
												完成时间：<span class="count">120</span>分钟
											</p>
											<p class="totalScore">
												总分：<span class="count">100</span>分
											</p>
										</div>
										<div>
											1、请在规定时间完成试卷内全部题目，考试时间结束，系统将自动交卷。<br>
											2、所有题目可通过答题卡返回修改，点击提前交卷后试卷提交，将无法继续答案，请谨慎提交。<br>
											3、请诚信答题，独立完成。<br>
											4、祝你好运
										</div>
									</section>
									<div class="enter">
										<input type="button" value="Go">
									</div>
								</section>
							</section>

							<section class="randomContent">
								<section class="content">
									<section class="showOneType">
										<div class="showEg">
											<p class="title">单选题</>
											<div class="eg">
												<p class="title">e.g：2008年2月有几天？</p>
												<div>
													<input type="radio" id="radio1" name="flag">
													<label for="radio1">A.28天</label>
													<input type="radio" id="radio2" name="flag">
													<label for="radio2">B.29天</label>
													<input type="radio" id="radio3" name="flag">
													<label for="radio3">C.30天</label>
													<input type="radio" id="radio4" name="flag">
													<label for="radio4">D.31天</label>
												</div>
											</div>
										</div>

										<div class="enter">
											<input type="button" value="Go">
										</div>
									</section>
								</section>
							</section>
						</section>`,
	doPraticeInterface: `<section class="praticeContent body">
						</section>`,

	addPraticeInterface: `<section class="addPratice body">
							<div  class="title">第一章</div>

							<nav class="addPraticeToolbar">
								<div class="SingleChoice">单选题</div>
								<div class="MultipleChoices">多选题</div>
								<div class="TrueOrFalse">判断题</div>
								<div class="FillInTheBlank">填空题</div>
								<div class="ShortAnswer">简答题</div>
								<div class="Programming">编程题</div>
							</nav>

							<section class="addPraticeContent">
								<section class="addSingleChoice"></section>
								<section class="addMultipleChoices"></section>
								<section class="addTrueOrFalse"></section>
								<section class="addFillInTheBlank"></section>
								<section class="addShortAnswer"></section>
								<section class="addProgramming"></section>
							</section>

							<div class="addMore">+</div>
							
							<div class="flip">
								<input type="button" class="previous" value="<">
								<input type="button" class="next" value=">">
							</div>
						</section>`
}

module.exports = initInterface;