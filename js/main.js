var inputVal = "";
var noteInputVal = "";

var setupType = "";
var setupLen1 = 0;
var setupLen2 = 0;

/* var runTimer;
var screenTimer; */

var questionArray = new Array();
var answerArray = new Array();
let note = false;
let lockKey = false;
let DataKey= "ABC_Data"

/* function setFunc() {
//	var d = new Date();
//	console.log(d.toLocaleTimeString());
	
	if (0==setupType.length) {
		switch (setupType) {
			case '+':
			case '-':
			case '×':
			case '÷':
			console.log("ButtonOnClick() "+setupType);
			break;
			default:
			break;
		}
		console.log("請選擇功能");
	} else if (0==setupLen1) {
		console.log("請輸入長度1");
	} else if (0==setupLen2) {
		console.log("請輸入長度2");
	} else if (0!=setupLen2) {
		console.log("輸入長度2");
		clearInterval(runTimer);
		runTimer = null;
		//AskQuestion();
	}
}
 */
$(function(){
	$('#dmsg').hide();
	initctx();
	FastScreen();
	resetQ();	
});

function ButtonOnClick(input) {
	
	if (true==lockKey) return;
	
	switch (input) {		
		case 1:
		case 2:
		case 3:
		case 4:
			if (0==setupLen1 && 0!=setupType.length) {
				setupLen1 = input;
				console.log("ButtonOnClick() setupLen1 = "+setupLen1);
				ShowSetupInfo();
				break;
			} else if (0==setupLen2 && 0!=setupType.length && input<=setupLen1) {
				setupLen2 = input;
				console.log("ButtonOnClick() setupLen2 = "+setupLen2);
				ShowSetupInfo();
				$('#Exit').html('完成');
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
		if (true==note && 0!=setupType.length && 0!=setupLen1 && 0!=setupLen2 && 8>noteInputVal.length) {
			noteInputVal = noteInputVal+input;
			console.log("ButtonOnClick() noteInputVal = "+noteInputVal);
			drawQ();
		} else if (0!=setupType.length && 0!=setupLen1 && 0!=setupLen2 && 8>inputVal.length) {
			inputVal = inputVal+input;
			console.log("ButtonOnClick() inputVal = "+inputVal);
			drawQ();
		}
		break;
		case 'AC':
			if (""!=inputVal) {
				inputVal = "";
				drawQ();
				console.log("ButtonOnClick() clear inputVal");
			} else if (""!=noteInputVal) {
				noteInputVal = "";
				drawQ();
				console.log("ButtonOnClick() clear noteInputVal");
			}
		break;
		
		case 'Note':
			if (""!=inputVal || ""!=noteInputVal) {
				if (note) {
					note = false;
					document.getElementById('buttonNote').style.color = '#000000';
				} else {
					if (""==noteInputVal) {
						noteInputVal = inputVal;
					}
					note = true;
					document.getElementById('buttonNote').style.color = 'red';
				}
				drawQ();
				console.log("ButtonOnClick() note = "+note);
			}
		break;
		
		case 'Exit':
			if (0<answerArray.length) {
				if (confirm("確定結算?")) {
					GenJsonTable(true);
					//resetQ();
					console.log("ButtonOnClick() Exit");
				}
			} else {
				let rawData = ustLocalStorageGetItem(DataKey);
				if(rawData) {
					try {
						let jsonString = JSON.parse(rawData);
						showMsgDisplay(jsonString);
					} catch(e) {
						alert(e); // error in the above string (in this case, yes)!
					}
				}	
			}
		break;
		
		case 'Esc':
			if (confirm("確定離開")) {
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
			let index = questionArray.length;
			let ret = false;
			if (0!=index && setupLen1 != 0 && setupLen2 != 0 && inputVal!="" && true!=note) {
				let v1 = questionArray[index-1][0];
				let v2 = questionArray[index-1][1];
				
				console.log("Question ("+index+ ") : "+v1+setupType+v2 +"="+ inputVal);
				
				if ('+'==setupType) {
					if ((v1+v2)==inputVal)
						ret = true;
				} else if ('-'==setupType) {
					if ((v1-v2)==inputVal)
						ret = true;
				} else if ('×'==setupType) {
					if ((v1*v2)==inputVal)
						ret = true;
				} else if ('÷'==setupType) {
					if ((v1/v2)==inputVal)
						ret = true;					
				}
				answerArray.push([inputVal, ret]);
				if (ret) {
					console.log("ButtonOnClick() correct answer");
				} else {
					console.log("ButtonOnClick() wrong answer");
				}
				noteInputVal = inputVal = "";
				AskQuestion();
			} else {
				console.log("ButtonOnClick() Enter");
			}
		break;
		case '+':
		case '-':
		case '×':
		case '÷':
			if (0==setupType.length) {
				setupType = input;
				ShowSetupInfo();
			}
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
	$('#Exit').html('上次紀錄');
	//clearInterval(runTimer);
	setupType = "";
	setupLen1 = 0;
	setupLen2 = 0;
	questionArray = new Array();
	answerArray = new Array();
	//runTimer = setInterval(setFunc, 1000);
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
		val_1 = getRandom(min1, max1);
		val_2 = getRandom(min2, max2);
		if (val_2 > val_1) {
			[val_1, val_2] = [val_2, val_1];
		}
	} else if ('÷'==setupType) {
		do {
			val_1 = getRandom(min1, max1);
			val_2 = getRandom(min2, max2);
		} while((val_1!=val_2)&&((val_1%val_2)!=0));
	} else {
		val_1 = getRandom(min1, max1);
		val_2 = getRandom(min2, max2);
	}
	
	console.log('Question '+val_1+setupType+val_2+" ?");
	questionArray.push([val_1, val_2, setupType]);
	noteInputVal = "";
	drawQ();
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
			if (true==answerArray[index][1]) {
				correctAnswer++;
			}
			jsonObj.push(obj);
		}
		//console.log(JSON.stringify(jsonObj));
		
		let score = 100/answerArrayLen;
		let TotalScore = score*correctAnswer;
		var ScoreObject = new Object;
		ScoreObject.Table = jsonObj;
		ScoreObject.TotalScore = TotalScore;
		let jsonBuf = JSON.stringify(ScoreObject)
		//console.log(jsonBuf);
		if (showUITable)
			showMsgDisplay(ScoreObject);
		
		ustLocalStorageSetItem(DataKey, jsonBuf)
	} else {
		console.log("Data Error!!");
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
