initInterface = {
	indexInterface: `<section class="body subject">
						<div class="addSubject">+</div>
					</section>`,
	settingsInterface: `<section class="settingsContent">
							<div class="typeNav">
								<div class="navContent">
									<div class="changeUserImg">用户头像</div>
									<div class="changePassword">修改密码</div>
									<div class="changeFindPassword">忘记密码</div>
									<input type="button" value="注销" class="exitBtn">
								</div>
							</div>
							<section class="content">
								<section class="userImgInfo">
									<div class="showUserImg">
									</div>
									<form action="/uploadImage" method="post" enctype="multipart/form-data">
										<input type="file" class="uploadImage" name="uploadImage">
										<input type="submit" value="应用" class="confirm">
									</form>
								</section>
								<section class="passwordInfo">
									<div>原密码：<input type="password" class="textInput oldPassword"></div>
									<div>新密码：<input type="password" class="textInput newPassword"></div>
									<div>密码确认：<input type="password" class="textInput newPasswordConfirm"></div>
									<input type="button" value="应用" class="confirm">
								</section>
								<section class="findPasswordInfo">
									<section class="firstStep">
										<div>密码：<input type="password" class="textInput passwordConfirm"></div>
										<div><input type="button" value="next" class="nextBtn"></div>
									</section>

									<section class="secondStep">
										<div>问题1：
											<select class="select1">
												<option>你父亲的名字是？</option>
												<option>你QQ是？</option>
											</select>
										</div>
										<div>答案：<input type="text" class="textInput answer1"></div>
										<div>问题2：
											<select class="select2">
												<option>你母亲的名字是？</option>
												<option>你手机号码是？</option>
											</select>
										</div>
										<div>答案：<input type="text" class="textInput answer2"></div>
										<div>问题3：
											<select class="select3">
												<option>你班主任的名字是？</option>
												<option>你的宠物的名字是？</option>
											</select>
										</div>
										<div>答案：<input type="text" class="textInput answer3"></div>
										<div>
											<input type="button" value="应用" class="confirm">
										</div>
									</section>
								</section>
							</section>
						</section>`,
	usersManageInterface: `<section class="showUsersInfo body">
								<section class="topBar">
									<nav class="usersType">
										<ul>
											<li class="teacher">教师</li>
											<li class="student">学生</li>
										</ul>
									</nav>
									<form action="/importExcel" method="post" enctype="multipart/form-data">
										<input type="file" class="excelFile" name="excelFile" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
										<input type="hidden" class="userIdentity" name="userIdentity" value="teacher">
										<input type="submit" class="importExcel">
									<form>
									<input type="button" value="导出"  class="importExcelBtn">
									（仅支持Excel文件的导出）
								</section>
								<table>
									<thead>
										<tr>
											<th>用户ID</th>
											<th>姓名</th>
											<th>用户密码（md5加密后）</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
								<section class="bottomSec">
									<div class="btnDiv">
										<input type="button" value="+" class="addBtn">
									</div>
									<div class="flip">
										<input type="button" value="<" class="previous">
										<div class="showPage">
											<input type="text" value=1 class="currentPage">/
											<span class="totalPage"></span>
										</div>
										<input type="button" value=">" class="next">
									</div>
								</section>
							</section>`,
	testResultsManageInterface: `<section class="showtestResultsInfo body">
									<section class="dateSearch">
										<input type="text" class="year" placeholder="all">年
										<input type="text" class="month" placeholder="all">月
										<input type="text" class="day" placeholder="all">日
										<input type="button" value="search" class="searchBtn">
									</section>
								<table>
									<thead>
										<tr>
											<th>班级</th>
											<th>用户账号</th>
											<th>姓名</th>
											<th>总得分</th>
											<th>具体得分</th>
											<th>提交时间</th>
											<th>删除</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
								<section class="bottomSec">
									<div class="flip">
										<input type="button" value="<" class="previous">
										<div class="showPage">
											<input type="text" value=1 class="currentPage">/
											<span class="totalPage"></span>
										</div>
										<input type="button" value=">" class="next">
									</div>
								</section>
							</section>`,
	testHistoryInterface: `<section class="showtestHistoryInfo body">
								<section class="dateSearch">
									<input type="text" class="year" placeholder="all">年
									<input type="text" class="month" placeholder="all">月
									<input type="button" value="search" class="searchBtn">
								</section>
								<table>
									<thead>
										<tr>
											<th>试卷名</th>
											<th>总得分</th>
											<th>具体得分</th>
											<th>提交时间</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</section>`,
	praticeInterface: `<nav class="typeNav">
							<div class="navContent">
								<div class="chapter">章节练习</div>
								<div class="examination">考试模拟</div>
								<div class="random">随机练习</div>
							</div>
						</nav>

						<section class="praticeContent">
							<section class="chapterContent">
								<aside>
									<ul>
									</ul>
									<div class="addMore">+</div>
								</aside>

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
													<label for="radio2">B.29天</label><br>
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
													<label for="checkbox2">B.澳门</label><br>
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
										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>

									<section class="FillInTheBlank">
										<div class="showEg">
											<p class="title">填空题</>
											<div class="eg">
												<p class="title">e.g：香港是在_______年回归？</p>
											</div>
										</div>
										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>

									<section class="ShortAnswer">
										<div class="showEg">
											<p class="title">简答题</>
											<div class="eg">
												<p class="title">e.g：什么是操作系统？</p>
											</div>
										</div>
										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>

									<section class="Programming">
										<div class="showEg">
											<p class="title">编程题</>
											<div class="eg">
												<p class="title">e.g：请编写一个计算总和的程序，例如：输入(20,30)，输出50.</p>
											</div>
										</div>
										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>
								</section>
							</section>

							<section class="examinationContent">
								<div class="addMore">+</div>
							</section>

							<section class="randomContent">
								<section class="content">
									<section class="showOneType SingleChoice">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
											<p class="title">单选题</>
											<div class="eg">
												<p class="title">e.g：2008年2月有几天？</p>
												<div>
													<input type="radio" id="radio1" name="flag">
													<label for="radio1">A.28天</label>
													<input type="radio" id="radio2" name="flag">
													<label for="radio2">B.29天</label><br>
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
									</section>

									<section class="showOneType MultipleChoices">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
											<p class="title">多选题</>
											<div class="eg">
												<p class="title">e.g：请问哪些是特别行政区？</p>
												<div>
													<input type="checkbox" id="checkbox1">
													<label for="checkbox1">A.香港</label>
													<input type="checkbox" id="checkbox2">
													<label for="checkbox2">B.澳门</label><br>
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
									</section>

									<section class="showOneType TrueOrFalse">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
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
									</section>

									<section class="showOneType FillInTheBlank">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
											<p class="title">填空题</>
											<div class="eg">
												<p class="title">e.g：香港是在_______年回归？</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>

									<section class="showOneType ShortAnswer">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
											<p class="title">简答题</>
											<div class="eg">
												<p class="title">e.g：什么是操作系统？</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
										</div>
									</section>

									<section class="showOneType Programming">
										<div class="showEg">
											<div class="btnDiv"><input type="button" class="modifyBtn"></div>
											<p class="title">编程题</>
											<div class="eg">
												<p class="title">e.g：请编写一个计算总和的程序，例如：输入(20,30)，输出50.</p>
											</div>
										</div>

										<div class="exerciseCount">题目数量：
											<span class="num"></span>
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

	addPraticeInterface: `<section class="addPratice">
							<nav class="typeNav">
								<div class="navContent">
									<div class="SingleChoice">单选题</div>
									<div class="MultipleChoices">多选题</div>
									<div class="TrueOrFalse">判断题</div>
									<div class="FillInTheBlank">填空题</div>
									<div class="ShortAnswer">简答题</div>
									<div class="Programming">编程题</div>
								</div>
								<input type="button" value="提交" class="submitBtn">
							</nav>

							<section class="addPraticeContent">
								<div class="existTime">试卷开放时间（某个日期不限则不填）：<br>
									<div class="beginTime">
										<input type="number" class="year">年/
										<input type="number" max=12 min=1 class="month">月/
										<input type="number" max=31 min=1 class="day">日
										<input type="number" max=23 min=0 class="H" placeholder="00"> :
										<input type="number" max=59 min=0 class="M" placeholder="00"> :
										<input type="number" max=59 min=0 class="S" placeholder="00">
									</div> 至
									<div class="endTime">
										<input type="number" class="year">年/
										<input type="number" max=12 min=1 class="month">月/
										<input type="number" max=31 min=1 class="day">日
										<input type="number" max=23 min=0 class="H" placeholder="00"> :
										<input type="number" max=59 min=0 class="M" placeholder="00"> :
										<input type="number" max=59 min=0 class="S" placeholder="00">
									</div>
								</div>
								<div class="examinationTime">考试时间：
									<input type="number" max=99 min=0 class="hours" placeholder=0>小时
									<input type="number" max=59 min=0 class="minutes" placeholder=0>分钟
									<input type="number" max=59 min=0 class="seconds" placeholder=0>秒
								</div>
								<section class="addSingleChoice">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
									<div class="showScore">分值：<input type="text" class="textInput" placeholder=2></div>
								</section>
								<section class="addMultipleChoices">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
									<div class="showScore">分值：<input type="text" class="textInput" placeholder=3></div>
								</section>
								<section class="addTrueOrFalse">
									<div class="correctAnswerTips">注：勾选后面选项表示该选项为正确答案！</div>
									<div class="showScore">分值：<input type="text" class="textInput" placeholder=1></div>
								</section>
								<section class="addFillInTheBlank">
									<div class="showScore">分值：<input type="text" class="textInput" placeholder=1></div>
								</section>
								<section class="addShortAnswer"></section>
								<section class="addProgramming"></section>
							</section>

							<div class="addMore">+</div>
						</section>`,

	showScoreInterface: `<section class="showScoresDetail">
							<div class="showTotalScore"><span class="score"><%= scoresDetail.totalScore %></span></div>
							<section class="scoresDetail">
								<% for(var k in scoresDetail.details) { %>
									<div class="details"><span class="title"><%= k %>得分</span>：<span class="score"><%= scoresDetail.details[k] %></span></div>
								<% } %>
							</section>
							<div class="seeMoreBtn"><span class="goBack"></span><span>查看详情</span></div>
						</section>`
}

module.exports = initInterface;