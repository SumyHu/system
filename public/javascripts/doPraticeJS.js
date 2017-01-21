let praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

let subjectName, praticeType, selectIndex, type, allPraticeContent;

function addChoicePratices(praticeIdArr, addPraticeType) {
	let section = document.createElement("section");
	section.className = addPraticeType;
	praticeIdArr.forEach(function(praticeId, index, array) {
		findPraticesById(praticeId, function(result) {
			console.log(result);
			let sec = document.createElement("section");
			sec.className = "content";
			let showIndex = index+1;
			sec.innerHTML = `<p class="title">` + showIndex + `.` + result.topic + `</p>
							 <div class="answer">`;

			if (addPraticeType === "MultipleChoices") {
				inputType = "checkbox";
			}
			else {
				inputType = "radio";
			}
			for(let i=0, len=result.choices.length; i<len; i++) {
				sec.innerHTML = sec.innerHTML
								+ `<div>
										<input type="` + inputType + `" id="` + addPraticeType + showIndex + i + `" name="` + addPraticeType +  showIndex + `">
										<label for="` + addPraticeType + showIndex + i + `">
											<span class="num">` + result.choices[i].num + `</span>
										` + result.choices[i].choiceContent + `</label>
								   </div>`;
			}
			sec.innerHTML = sec.innerHTML + `</div>`
			$(section).append(sec);
			$(".praticeContent").append(section);
		});
	});
}

function init() {
	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	type = getValueInUrl("type");

	findSubjectByName(subjectName, function(result) {
		let unitId = result[praticeType+"Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
			if (type) {
				allPraticeContent = data[type];

				switch(type) {
					case "SingleChoice":
					case "MultipleChoices":
					case "TrueOrFalse":
						addChoicePratices(allPraticeContent);
						break;
				}
			}
			else {
				allPraticeContent = data;
			}

			console.log(allPraticeContent);
		});
	});
}

function bindEvent() {}