//var inputVal = "";
//var noteInputVal = "";

let inputValCurrentIndex = 0;
let inputValIndexCycleIndex = 0;
var inputVal = new Array("", "", "");
let inputValIndexCycle = [0, 1, 2, 1];

var setupType = "";
var setupLen1 = 0;
var setupLen2 = 0;
var MaxSetupLen = 4;

/* var runTimer;
var screenTimer; */

var questionArray = new Array();
var answerArray = new Array();

let lockKey = false;
let DataKey = new Array("ABC_Data1", "ABC_Data2", "ABC_Data3", "ABC_Data4", "ABC_Data5", 
						"ABC_Data6", "ABC_Data7", "ABC_Data8", "ABC_Data9", "ABC_Data10");

let ScoreJsonArray;
let ScoreJsonDisplayResArray;

$(function(){
	ExitMsgDisplay();
	initctx();
	FastScreen();
	GetJsonArray();
	resetQ();
	//$("#ScoreDataSelect").change(function(){
	//	showMsgDisplay(null);
	//});
});

function ButtonOnClick(input) {
	
	if (true==lockKey) return;
	
	switch (input) {		
		case 1:
		case 2:
		case 3:
		case 4:
			if (0==setupLen1 && 0!=setupType.length && input<=MaxSetupLen ) {
				setupLen1 = input;
				console.log("ButtonOnClick() setupLen1 = "+setupLen1);
				ShowSetupInfo();
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
		if (0!=setupType.length && 0!=setupLen1 && 0!=setupLen2 && 8>inputVal[inputValCurrentIndex].length) {
			//inputVal.push();
			inputVal[inputValCurrentIndex] = input+inputVal[inputValCurrentIndex];
			
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
				//inputVal[inputValCurrentIndex] = inputVal[inputValCurrentIndex].substring(0, inputVal[inputValCurrentIndex].length-1);
				inputVal[inputValCurrentIndex] = inputVal[inputValCurrentIndex].substring(1, inputVal[inputValCurrentIndex].length);
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
				drawQuestionArea();
				console.log("ButtonOnClick() note inputValCurrentIndex = "+inputValCurrentIndex);
			}
		break;
		
		case 'Exit':
			if (0<answerArray.length) {
				CheckAns();
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
			CheckAns();
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
			CheckAns();
		break;
		case '+':
		case '-':
			setupType = input;
			MaxSetupLen = 4;
			setupLen1 = 0;
			setupLen2 = 0;
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

function resetQ() {
	//clearInterval(runTimer);
	//runTimer = setInterval(setFunc, 1000);
	
	inputValIndexCycleIndex = 0;
	inputValCurrentIndex = 0;
	inputVal = new Array("", "", "");
	
	setupType = "";
	setupLen1 = 0;
	setupLen2 = 0;

	questionArray = new Array();
	answerArray = new Array();
	
	setNoteKeyHiLight(false);
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

function CheckAns() {
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
		AskQuestion();
	}
	return ret;
}
			
function GenJsonTable(showUITable) {
	let questionArrayLen = questionArray.length;
	let answerArrayLen = answerArray.length;
	let jsonObj=[];
	let correctAnswer = 0;
	if (answerArrayLen == (questionArrayLen-1)) {
		for (let index=0;index<answerArrayLen;index++) {
			var obj = new Object;
			obj.Question = questionArray[index][0] + questionArray[index][2] + questionArray[index][1];
			obj.Answer = answerArray[index][0];
			obj.CorrectAnswer = answerArray[index][1];
			obj.AnswerDate = answerArray[index][2];
			if (true==answerArray[index][1]) {
				correctAnswer++;
			}
			jsonObj.push(obj);
		}
		//console.log(JSON.stringify(jsonObj));
		
		let score = 100/answerArrayLen;
		let TotalScore = Math.round((score*correctAnswer)*100)/100;
		var ScoreObject = new Object;
		ScoreObject.Table = jsonObj;
		ScoreObject.TotalScore = TotalScore;
		var seconds = Date.now();
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
