let Debug = true;
var maxInputLen = 6;
let inputValIndexCycle = [0, 1, 2, 1];
let DataKey = new Array("ABC_Data1", "ABC_Data2", "ABC_Data3", "ABC_Data4", "ABC_Data5", 
						"ABC_Data6", "ABC_Data7", "ABC_Data8", "ABC_Data9", "ABC_Data10");

let inputValCurrentIndex = 0;
let inputValIndexCycleIndex = 0;
var inputValCharCurrentIndex = 0;
var inputVal = new Array("", "", "");

var randomQuestions = false;
let QuestionType = ['+', '-', '×', '÷'];
var setupType = "";
var setupLen1 = 0;
var setupLen2 = 0;
var MaxSetupLen = 4;

var questionArray = new Array();
var answerArray = new Array();

let ScoreJsonArray;
let ScoreJsonDisplayResArray;

let correctToLeaveVal = true;

$(function(){
	ExitMsgDisplay();
	initctx();
	FastScreen();
	GetJsonArray();
	resetQ();
	$('#correctToLeave').prop("checked", true);
	//$("#ScoreDataSelect").change(function(){
	//	showMsgDisplay(null);
	//});
});

function ButtonOnClick(input) {
	switch (input) {		
		case 1:
		case 2:
		case 3:
		case 4:
			if (0==setupLen1 && 0!=setupType.length && input<=MaxSetupLen ) {
				setupLen1 = input;
				if (1==setupLen1) {
					setupLen2 = setupLen1;
					ShowSetupInfo();
					AskQuestion();
				} else {
					ShowSetupInfo();
				}
				console.log("ButtonOnClick() setupLen1 = "+setupLen1);
				break;
			} else if (0==setupLen2 && 0!=setupType.length && input<=setupLen1) {
				setupLen2 = input;
				console.log("ButtonOnClick() setupLen2 = "+setupLen2);
				ShowSetupInfo();
				AskQuestion();
				break;
			}
		case 0:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case '.':
		if (0!=setupType.length && 0!=setupLen1 && 0!=setupLen2 && maxInputLen>inputVal[inputValCurrentIndex].length) {
			if ('÷'==setupType || 1==setupLen1) {
				inputVal[inputValCurrentIndex] = inputVal[inputValCurrentIndex]+input;
				inputValCharCurrentIndex = inputVal[inputValCurrentIndex].length-1;
			} else {
				inputVal[inputValCurrentIndex] = input+inputVal[inputValCurrentIndex];
				inputValCharCurrentIndex = 0;
			}
			console.log("ButtonOnClick() inputVal = "+inputVal[inputValCurrentIndex]);
			drawQuestionArea();
		}
		break;
		case 'AC':
			if (""!=setupType && 0!=setupLen1 && 0!=setupLen2) {
				inputValIndexCycleIndex = 0;
				inputValCurrentIndex = 0;
				inputVal = new Array("", "", "");
				drawQuestionArea();
				console.log("ButtonOnClick() clear inputVal");
			}
		break;
		
		case 'Backspace':
			if (""!=setupType && 0!=setupLen1 && 0!=setupLen2) {
				//console.log("ButtonOnClick() 1 inputVal[inputValCurrentIndex] : "+inputVal[inputValCurrentIndex]);
			
				if ('÷'==setupType || 1==setupLen1) {
					inputVal[inputValCurrentIndex] = inputVal[inputValCurrentIndex].substring(0, inputVal[inputValCurrentIndex].length-1);
					inputValCharCurrentIndex = inputValCharCurrentIndex = inputVal[inputValCurrentIndex].length-1;;
				} else {
					inputVal[inputValCurrentIndex] = inputVal[inputValCurrentIndex].substring(1, inputVal[inputValCurrentIndex].length);
					inputValCharCurrentIndex = 0;
				}
				drawQuestionArea();
				//console.log("ButtonOnClick() 2 inputVal[inputValCurrentIndex] : "+inputVal[inputValCurrentIndex]);
			}
		break;
		
		case 'Note':
			if (""!=setupType && 0!=setupLen1 && 0!=setupLen2) {
				if (inputValIndexCycleIndex>=inputValIndexCycle.length-1) {
					inputValIndexCycleIndex=0;
				} else {
					inputValIndexCycleIndex++;
				}
				inputValCurrentIndex = inputValIndexCycle[inputValIndexCycleIndex];
				
				if ('÷'==setupType || 1==setupLen1) {
					inputValCharCurrentIndex = inputValCharCurrentIndex = inputVal[inputValCurrentIndex].length-1;;
				} else {
					inputValCharCurrentIndex = 0;
				}
				
				drawQuestionArea();
				console.log("ButtonOnClick() note inputValCurrentIndex = "+inputValCurrentIndex);
			}
		break;
		
		case 'Exit':
			if (0<answerArray.length) {
				CheckAns(correctToLeaveVal);
				if (confirm("現在就檢視成績?")) {
					GenJsonTable(true);
					//resetQ();
					console.log("ButtonOnClick() Exit");
				}
			} else {
				if (0<ScoreJsonDisplayResArray.length) {
					showMsgDisplay(ScoreJsonDisplayResArray[0]);
				} else {
					alert("沒有紀錄");
				}
			}
		break;
		
		case 'Esc':
			CheckAns(correctToLeaveVal);
			if (confirm("確定重新開始?")) {
				if (0<answerArray.length)
					GenJsonTable(false);
				
				resetQ();
				ShowSetupInfo();
				clearFastScreen();
				FastScreen();
				console.log("ButtonOnClick() Esc");
			}
		break;
		case 'Enter':
			if (""!=setupType && 0!=setupLen1 && 0!=setupLen2) {
				CheckAns(correctToLeaveVal);
			} else {
				setupType = 'Enter';
				setupLen1 = 0;
				setupLen2 = 0;
				randomQuestions = true;
				inuptReset();
				ShowSetupInfo();
				console.log("ButtonOnClick() "+input);
			}
		break;
		case '+':
		case '-':
			setupType = input;
			MaxSetupLen = 4;
			setupLen1 = 0;
			setupLen2 = 0;
			randomQuestions = false;
			inuptReset();
			questionArray.pop();
			ShowSetupInfo();
			console.log("ButtonOnClick() "+input);
		break;
		case '×':
		case '÷':
			setupType = input;
			MaxSetupLen = 2;
			setupLen1 = 0;
			setupLen2 = 0;
			randomQuestions = false;
			inuptReset();
			questionArray.pop();
			ShowSetupInfo();
			console.log("ButtonOnClick() "+input);
		break;
		default:
			console.log('out of ${input}.');
		break;
	}
}

function getRandom(min,max){
	return Math.floor(Math.random()*(max-min+1))+min;
};

function inuptReset() {
	inputValCurrentIndex = 0;
	inputValIndexCycleIndex = 0;
	inputValCharCurrentIndex = 0;
	inputVal = new Array("", "", "");
}

function resetQ() {
	//clearInterval(runTimer);
	//runTimer = setInterval(setFunc, 1000);
	inuptReset();
	setupType = "";
	setupLen1 = 0;
	setupLen2 = 0;

	questionArray = new Array();
	answerArray = new Array();
	
	setNoteKeyHiLight(false);
}

function onclickCorrectToLeave() {
	if (0<questionArray.length) {
		$('#correctToLeave').prop("checked", correctToLeaveVal);
		alert("只能在還沒作答前切換");
	} else {
		correctToLeaveVal = $('#correctToLeave').prop("checked");
		if (Debug) console.log("onclickCorrectToLeave() correctToLeaveVal : "+correctToLeaveVal);
	}
}

function AskQuestion() {
	//'×''÷'
	let min1 = 1, max1 = 9;
	let min2 = 1, max2 = 9;
	
	let val_1, val_2;
	
	if (2===setupLen1) {
		min1 = 10;
		max1 = 99;
	} else if (3===setupLen1) {
		min1 = 100;
		max1 = 999;
	} else if (4===setupLen1) {
		min1 = 1000;
		max1 = 9999;
	}
	
	if (2===setupLen2) {
		min2 = 10;
		max2 = 99;
	} else if (3===setupLen2) {
		min2 = 100;
		max2 = 999;
	} else if (4===setupLen2) {
		min2 = 1000;
		max2 = 9999;
	}
	
	if (randomQuestions) console.log("AskQuestion() Random Questions!");
	
	if (randomQuestions && 2>=setupLen1) {
		setupType = QuestionType[getRandom(0, 3)];
	} else if (randomQuestions) {
		setupType = QuestionType[getRandom(0, 1)];
	}
	
	if ('-'==setupType) {
		do {
			val_1 = getRandom(min1, max1);
			val_2 = getRandom(min2, max2);
			if (val_2 > val_1) {
				[val_1, val_2] = [val_2, val_1];
			}
		} while((val_1-val_2)<=0);
	} else if ('÷'==setupType) {
		//do {
			//val_1 = getRandom(min1, max1);
			//val_2 = getRandom(min2, max2);
		//} while((val_1!=val_2)&&((val_1%val_2)!=0));
		val_1 = getRandom(min1, max1);
		val_2 = getRandom(min2, max2);
	} else {
		val_1 = getRandom(min1, max1);
		val_2 = getRandom(min2, max2);
	}
	
	console.log('Question '+val_1+setupType+val_2+" ?");
	questionArray.push([val_1, val_2, setupType]);
	drawQuestionArea();
}

/*
*
*	@params bool The answer is correct to leave
*/
function CheckAns(correctToLeave) {
	correctToLeave = correctToLeave || false;
	let index = questionArray.length;
	let ret = false;
	if (0!=index && setupLen1 != 0 && setupLen2 != 0 && 0<inputVal.length ) {
		let v1 = questionArray[index-1][0];
		let v2 = questionArray[index-1][1];
		let type = questionArray[index-1][2];
		let inputAns = 0;
		let inputValIndex;
		for (inputValIndex=inputVal.length-1;inputValIndex>=0;inputValIndex--) {
			if(0<=inputVal[inputValIndex] && ""!=inputVal[inputValIndex]) {
				inputAns = inputVal[inputValIndex];
				break;
			}
		}
		
		if (0==inputAns)
			return;
		
		console.log("Question ("+index+ ") : "+v1+type+v2 +"="+ inputAns + "index inputValIndex :"+ inputValIndex);
		
		if ('+'==type) {
			if ((v1+v2)==inputAns)
				ret = true;
		} else if ('-'==type) {
			if ((v1-v2)==inputAns)
				ret = true;
		} else if ('×'==type) {
			if ((v1*v2)==inputAns)
				ret = true;
		} else if ('÷'==type) {
			console.log("Ans : "+ Math.round((v1/v2)*100)/100);
			if ((Math.round((v1/v2)*100)/100)==inputAns) {
				ret = true;
			}
		}
		
		var now = new Date(+new Date() + 8 * 3600 * 1000);
		//answerArray.push([inputAns, ret, now.toUTCString()]);
		answerArray.push([inputAns, ret, now.toISOString().slice(0, -5)]);
		
		if (ret) {
			console.log("ButtonOnClick() correct answer");
		} else {
			console.log("ButtonOnClick() wrong answer");
		}
		
		inputValIndexCycleIndex = 0;
		inputValCurrentIndex = 0;
		inputVal = new Array("", "", "");
		if (!ret&&correctToLeave) {
			console.log("ButtonOnClick() The answer is correct to leave");
			questionArray.push([v1, v2, setupType]);
			drawQuestionArea();
		} else {
			AskQuestion();
		}
	}
	return ret;
}
			
function GenJsonTable(showUITable) {
	let questionArrayLen = questionArray.length;
	let answerArrayLen = answerArray.length;
	let jsonObj=[];
	let correctAnswer = 0;
	let Q_CorrectToLeaveArray = new Array();
	let QuestionNumberOfCorrectToLeaveArray = 0;
	if (answerArrayLen == (questionArrayLen-1)) {
		for (let index=0;index<answerArrayLen;index++) {
			let obj = new Object;
			obj.Question = questionArray[index][0] + questionArray[index][2] + questionArray[index][1];
			obj.Answer = answerArray[index][0];
			obj.CorrectAnswer = answerArray[index][1];
			obj.AnswerDate = answerArray[index][2];
			
			if (true==answerArray[index][1]) {
				correctAnswer++;
			}
			
			if (correctToLeaveVal && 0>=Q_CorrectToLeaveArray.length) {
				Q_CorrectToLeaveArray.push([obj.Question, index, answerArray[index][1]]);
				QuestionNumberOfCorrectToLeaveArray++;

			} else if (correctToLeaveVal && (Q_CorrectToLeaveArray[Q_CorrectToLeaveArray.length-1][0]!=obj.Question)) {
				Q_CorrectToLeaveArray.push([obj.Question, index, answerArray[index][1]]);
				QuestionNumberOfCorrectToLeaveArray++;
			}
			
			if (correctToLeaveVal) {
				obj.QuestionNumber = QuestionNumberOfCorrectToLeaveArray+1;
			}else {
				obj.QuestionNumber = index+1;
			}
			
			jsonObj.push(obj);
		}
		//console.log(JSON.stringify(jsonObj));
		let ScoreObject = new Object;
		
		if (correctToLeaveVal) {
			index = 0;
			correctAnswer = 0;
			for (index in Q_CorrectToLeaveArray) {
				if (Q_CorrectToLeaveArray[index][2]) {
					correctAnswer++;
				}
			}
			
			let score = 100/Q_CorrectToLeaveArray.length;
			let TotalScore = Math.round(score*correctAnswer);
			ScoreObject.TotalScore = TotalScore;
		} else {
			let score = 100/answerArrayLen;
			let TotalScore = Math.round(score*correctAnswer);
			ScoreObject.TotalScore = TotalScore;
		}
		
		ScoreObject.Table = jsonObj;
		
		let seconds = Date.now();
		ScoreObject.UpDateTime = seconds;
		
		if (showUITable)
			showMsgDisplay(ScoreObject);
		
		//let jsonBuf = JSON.stringify(ScoreObject)
		//console.log(jsonBuf);
		//ustLocalStorageSetItem(DataKey, jsonBuf);
		
		SetJsonArrayNewData(ScoreObject);
	} else {
		console.log("Data Error!!");
	}
}


function SetJsonArrayNewData(ScoreObject) {
	//ustLocalStorageSetItem(DataKey, jsonBuf) DataKey[keyIndex]
	let dateArray = new Array();
	let toSave = false;
	let SaveKey;
	for (let jsIndex=0;jsIndex<ScoreJsonArray.length;jsIndex++) {
		if (ScoreJsonArray[jsIndex]!="") {
			dateArray.push(ScoreJsonArray[jsIndex].UpDateTime);
		} else if (ScoreJsonArray[jsIndex]=="") {
			toSave = true;
			SaveKey = DataKey[jsIndex];
			break;
		}
	}
	
	if (0<ScoreJsonDisplayResArray.length && ScoreJsonDisplayResArray[0].hasOwnProperty('Table')) {
		if (ScoreJsonDisplayResArray[0].Table[Object.keys(ScoreJsonDisplayResArray[0].Table).length-1].AnswerDate == ScoreObject.Table[Object.keys(ScoreObject.Table).length-1].AnswerDate) {
			console.log("SetJsonArrayNewData Exit.");
			return;
		}
	}
	
	if (false==toSave) {
		let minDate = Math.min( ...dateArray);
		//console.log("minDate :"+ minDate);
		for (let dateIndex=0;dateIndex<dateArray.length;dateIndex++) {
			if (dateArray[dateIndex] == minDate) {
				//console.log("minDate :"+ minDate+ " dateIndex :"+dateIndex);
				break;
			}
		}
		for (let jsIndex=0;jsIndex<ScoreJsonArray.length;jsIndex++) {
			if (ScoreJsonArray[jsIndex]!="") {
				if (ScoreJsonArray[jsIndex].UpDateTime == minDate){
					SaveKey = ScoreJsonArray[jsIndex].SaveKey;
					//console.log("1 jsIndex :" + jsIndex);
					break;
				}
				//else {
					//console.log("2 jsIndex :" + jsIndex);
				//}
			}
		}
	}
	
	ScoreObject.SaveKey = SaveKey;
	let jsonBuf = JSON.stringify(ScoreObject)
	console.log(jsonBuf);
	ustLocalStorageSetItem(SaveKey, jsonBuf);
	GetJsonArray();
}

function GetJsonArray() {
	$('#ScoreDataSelect').children('option').remove();
	ScoreJsonArray = new Array("", "", "", "", "", "", "", "", "", "");
	for (let keyIndex=0;keyIndex<DataKey.length;keyIndex++) {
		let rawData = ustLocalStorageGetItem(DataKey[keyIndex]);
		if(rawData) {
			try {
				let jsonString = JSON.parse(rawData);
				ScoreJsonArray[keyIndex] = jsonString;
			} catch(e) {
				console.log("GenJsonArray() Data Error!!");
			}
		} else {
			console.log("GenJsonArray() Data Null!!");
		}
	}
	
	ScoreJsonDisplayResArray = ScoreJsonArray.sort(function(a, b) { 
		if (a.UpDateTime === b.UpDateTime) { 
			return -1; 
		} 

		if (a.UpDateTime > b.UpDateTime) { 
			return -1; 
		} 

		if (a.UpDateTime < b.UpDateTime) { 
			return 1; 
		}
		return 0; 
	});
	
		
	for (let selectAddIndex in ScoreJsonDisplayResArray) {
		if(ScoreJsonDisplayResArray[selectAddIndex].hasOwnProperty("UpDateTime")) {
			var itemDate = new Date(ScoreJsonDisplayResArray[selectAddIndex].UpDateTime+(8 * 3600 * 1000)).toISOString().slice(0, -5);
			$("#ScoreDataSelect").append('<option value="'+selectAddIndex+'">'+itemDate+'</option>');
		}
		$("#ScoreDataSelect").val('0');
	}
	//console.log(ScoreJsonDisplayResArray);
}

function ResetStorage() {
	ScoreJsonArray = new Array("", "", "", "", "", "", "", "", "", "");
	ScoreJsonDisplayResArray = new Array();
	$('#ScoreDataSelect').children('option').remove();
	for (let keyIndex=0;keyIndex<DataKey.length;keyIndex++) {
		ustLocalStorageRemoveItem(DataKey[keyIndex]);
	}
}

function ustLocalStorageSetItem(key, value) {
	localStorage.setItem(key, value);
	//sessionStorage.setItem(key, value)
}

function ustLocalStorageGetItem(key) {
	return localStorage.getItem(key);
	//sessionStorage.getItem(key)
}

function ustLocalStorageRemoveItem(key) {
	localStorage.removeItem(key);
	//sessionStorage.removeItem(key)
}

function toPCindex() {
	parent.location.replace("./indexPC.html");
}

function toMobileindex() {
	parent.location.replace("./index.html");
}
