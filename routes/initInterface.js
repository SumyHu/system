initInterface = {
	indexInterface: `<section class="subject">
						<div class="addSubject">+</div>
					</section>`,
	settingsInterface: `<section class="settingsContent body">
							<aside>
								<ul>
									<li class="generation">基本信息<input type="button" class="info" value="i"></li>
									<li class="changeUserImg">用户头像<input type="button" class="modify"></li>
									<li class="changePassword">修改密码<input type="button" class="modify"></li>
									<li class="changeFindPassword">忘记密码<input type="button" class="modify"></li>
								</ul>
								<input type="button" value="注销" class="exitBtn">
							</aside>
							<section class="content">
								<section class="generationInfo">
									<div class="userImgBlock">
										<div class="showUserImg">
										</div>
										<input type="button" class="modify">
									</div>
									<div><span class="name">用户名：</span><span class="username"></span></div>
									<div class="password"><span class="name">密码：</span>
										<input type="password" value="00000000000" readonly class="passwordInput">
										<input type="button" class="modify">
									</div>
									<div class="findPasswordBlock">
										<div class="findPassword">忘记密码</div>
										<input type="button" class="modify">
									</div>
								</section>
								<section class="UserImgInfo">
									<div class="showUserImg">
									</div>
								</section>
								<section class="passwordInfo">
								</section>
								<section class="findPasswordInfo">
								</section>
							</section>
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
											<input type="button" value="Go" class="enterPratice">
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
											<input type="button" value="Go" class="enterPratice">
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
											<input type="button" value="Go" class="enterPratice">
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
											<input type="button" value="Go" class="enterPratice">
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
											<input type="button" value="Go" class="enterPratice">
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
											<input type="button" value="Go" class="enterPratice">
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
										<input type="button" value="Go" class="enterPratice">
									</div>
								</section>
							</section>

							<section class="randomContent">
								<section class="content">
									<section class="showOneType SingleChoice">
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

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>

									<section class="showOneType MultipleChoices">
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

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>

									<section class="showOneType TrueOrFalse">
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

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>

									<section class="showOneType FillInTheBlank">
										<div class="showEg">
											<p class="title">填空题</>
											<div class="eg">
												<p class="title">e.g：香港是在_______年回归？</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>

									<section class="showOneType ShortAnswer">
										<div class="showEg">
											<p class="title">简答题</>
											<div class="eg">
												<p class="title">e.g：什么是操作系统？</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>

									<section class="showOneType Programming">
										<div class="showEg">
											<p class="title">编程题</>
											<div class="eg">
												<p class="title">e.g：请编写一个计算总和的程序，例如：输入(20,30)，输出50.</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>

										<div class="enter">
											<input type="button" value="Go" class="enterPratice">
										</div>
									</section>
								</section>
							</section>
						</section>`,
	doPraticeInterface: `<section class="praticeContent body">
							<div class="showPraticeBlockIndex"></div>
							<div class="showPraticeIndex"></div>
							<div class="flip">
								<input type="button" class="previous" value="<">
								<input type="button" class="next" value=">">
							</div>
						</section>`,

	addPraticeInterface: `<section class="addPratice body">
							<div  class="title"></div>

							<nav class="addPraticeToolbar">
								<div class="SingleChoice">单选题</div>
								<div class="MultipleChoices">多选题</div>
								<div class="TrueOrFalse">判断题</div>
								<div class="FillInTheBlank">填空题</div>
								<div class="ShortAnswer">简答题</div>
								<div class="Programming">编程题</div>
							</nav>

							<section class="addPraticeContent">
								<section class="addSingleChoice">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
								</section>
								<section class="addMultipleChoices">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
								</section>
								<section class="addTrueOrFalse">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
								</section>
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