let drawW = 1800;
let drawH = 800;
var mainCanvasName = "mainCanvas";
var canvas = document.getElementById(mainCanvasName);
var ctx = canvas.getContext("2d");

function initctx() {
	ctx.beginPath();
}

function FastScreen() {
	let showText = "輸入 + - × ÷ 選擇題目";
	drawTextInBox(showText, "#204000", 'Arial',  (drawW - 900)/2, (drawH-120)/2, 900, 120);
	ctx.strokeRect(1, 1, drawW-2, drawH-2);
}

function ShowSetupInfo() {
	let showText="";
	let width = 140;
	if ('+'==setupType) {
		showText = "加法";
	} else if ('-'==setupType) {
		showText += "減法";
	} else if ('×'==setupType) {
		showText += "乘法";
	} else if ('÷'==setupType) {
		showText += "除法";
	}
	
	if (setupLen1 == 0) {
		ctx.clearRect((drawW - 900)/2, (drawH-133)/2, 900, 135);
		drawTextInBox("輸入第一位數1~4", "#204000", 'Arial',  (drawW - 900)/2, (drawH-120)/2, 900, 120);
	}
	
	if (setupLen1 != 0) {
		showText += " 第一位數:"+setupLen1;
		width = 360;
		if (setupLen2 == 0) {
			ctx.clearRect((drawW - 900)/2, (drawH-133)/2, 900, 135);
			
			drawTextInBox("輸入第二位數1~"+setupLen1, "#204000", 'Arial',  (drawW - 900)/2, (drawH-120)/2, 900, 120);
		}
	}
	
	if (setupLen2 != 0) {
		showText += " 第二位數:"+setupLen2;
		ctx.clearRect((drawW - 900)/2, (drawH-133)/2, 900, 135);
		width = 500;
	}
	
	if (0!=showText.length)
		ctx.clearRect((drawW - width-2), 3, width, 48);
	else
		ctx.clearRect((drawW - 500-2), 3, 500, 48);
	
	if (0!=showText.length)
		drawTextInBox(showText, "#0000FF", 'Arial',  (drawW - width), 6, width, 45);
	
}

function clearFastScreen() {
	ctx.clearRect(2, 140, drawW-4, drawH-144);
}

//fillRect(x, y, width, height)           畫一個實心的矩形
//clearRect(x, y, width, height)          清除一塊兒矩形區域
//strokeRect(x, y, width, height)         畫一個帶邊框的矩形
//rect(x, y, width, height)               直接畫一個矩形

function calcTextW(string) {
	let textW = 130;
	let textWMax = 700;
	let textWtmp;
	let stringLength;
	if (isNaN(string.length)) {
		stringLength = string.toString().length;
		console.log("1 stringLength : "+stringLength);
	} else {
		stringLength = string.length;
		console.log("2 stringLength : "+stringLength);
	}
	
	textWtmp = textW*stringLength;
	if (textWtmp>textWMax) {
		textWtmp = textWMax;
	}
	console.log("stringLength : "+stringLength +" textWtmp :"+textWtmp);
	return textWtmp;
}

function drawQ() {
	clearFastScreen();
	let qIndex = -1;
	let aIndex = -1;
	let nowQ_baseline_x = 134;
	let nowQ_baseline_y = 570;
	let preQ_baseline_x = 1000;
	let preQ_baseline_y = 570;
	let baselineW = 700;
	let baselineH = 5;
	
	
	if (0!=questionArray.length)
		qIndex = questionArray.length-1;
	if (0!=answerArray.length)
		aIndex = answerArray.length-1;
	
	if (0<=qIndex-1) {
		ctx.fillStyle = "#00A0CF";
		ctx.fillRect(preQ_baseline_x, preQ_baseline_y, baselineW, baselineH);
		drawTextInBox(questionArray[qIndex-1][0], "#000", 'Arial', 1695-calcTextW(questionArray[qIndex-1][0]), 255, calcTextW(questionArray[qIndex-1][0]), 145);
		drawTextInBox(questionArray[qIndex-1][1], "#000", 'Arial', 1695-calcTextW(questionArray[qIndex-1][1]), 430, calcTextW(questionArray[qIndex-1][1]), 145);
		drawTextInBox(answerArray[qIndex-1][0], "#000", 'Arial', 1695-calcTextW(answerArray[qIndex-1][0]), 582, calcTextW(answerArray[qIndex-1][0]), 145);
	}
	ctx.fillStyle = "#00A0CF";
	ctx.fillRect(nowQ_baseline_x, nowQ_baseline_y, baselineW, baselineH);
	drawTextInBox(questionArray[qIndex][0], "#000", 'Arial', 820-calcTextW(questionArray[qIndex][0]), 255, calcTextW(questionArray[qIndex][0]), 145);
	drawTextInBox(questionArray[qIndex][1], "#000", 'Arial', 820-calcTextW(questionArray[qIndex][1]), 430, calcTextW(questionArray[qIndex][1]), 145);
	inputVal.toString().length
	drawTextInBox(inputVal, "#000", 'Arial', 820-calcTextW(inputVal), 582, calcTextW(inputVal), 145);
}

function drawTextInBox(txt, fillStyle, font, x, y, w, h, angle) {
	angle = angle || 0;
	var fontHeight = 20;
	var hMargin = 4;
	ctx.font = fontHeight + 'px ' + font;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillStyle = fillStyle;
	var txtWidth = ctx.measureText(txt).width + 2 * hMargin;
	ctx.save();
	ctx.translate(x+w/2, y);
	ctx.rotate(angle);
	//ctx.strokeRect(-w/2, 0, w, h);//框線
	ctx.scale(w / txtWidth, h / fontHeight);
	ctx.translate(hMargin, 0)
	ctx.fillText(txt, -txtWidth/2, 0);
	ctx.restore();
}

