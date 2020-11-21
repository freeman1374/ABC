var UIDebug = true;

let drawW = 1000;
let drawH = 1000;

let drawWp = drawW/1000;
let drawHp = drawH/1000;

let XLwordWp = 160;
let XLwordHp = 160;
let LwordWp = 70*drawHp;
let LwordHp = 94*drawHp;
let MwordWp = 60*drawHp;
let MwordHp = 80*drawHp;
let SwordWp = 26*drawHp;
let SwordHp = 35*drawHp;

//fillRect(x, y, width, height)           畫一個實心的矩形
//clearRect(x, y, width, height)          清除一塊兒矩形區域
//strokeRect(x, y, width, height)         畫一個帶邊框的矩形
//rect(x, y, width, height)               直接畫一個矩形

function calcTextW(wordW, string) {
	let textW = wordW;
	let textWMax = 1000;
	let textWtmp;
	let stringLength;
	if (isNaN(string.length)) {
		stringLength = string.toString().length;
	} else {
		stringLength = string.length;
	}
	
	textWtmp = textW*stringLength;
	if (textWtmp>textWMax) {
		textWtmp = textWMax;
	}
	if (UIDebug) console.log("stringLength : "+stringLength +" textWtmp :"+textWtmp);
	return textWtmp;
}


var mainCanvasName = "mainCanvas";
var canvas = document.getElementById(mainCanvasName);
var ctx = canvas.getContext("2d");

function initctx() {
	ctx.beginPath();
}

function FastScreen() {
	let showText = "輸入+-×÷↵選擇題目";
	drawTextInBox(showText, "#204000", 'Arial',  drawWp*(1000/2)-(calcTextW(LwordWp, showText)/2), drawHp*(1000/2)-LwordHp/2, calcTextW(LwordWp, showText), LwordHp);
	ctx.strokeRect(drawWp*2, drawHp*2, drawWp*(998), drawHp*(998));
	$('#Exit').html('查看紀錄');
}

function ShowSetupInfo() {
	let showText="";
	let showTextC="";
	
	if ('+'==setupType) {
		showText = "加法";
	} else if ('-'==setupType) {
		showText += "減法";
	} else if ('×'==setupType) {
		showText += "乘法";
	} else if ('÷'==setupType) {
		showText += "除法";
	} else if ('Enter'==setupType) {
		showText += "隨機"
	}
	let width = calcTextW(SwordWp, showText);
	if (setupLen1 == 0) {
		clearFastScreen();
		showTextC = "輸入第一位數1~"+MaxSetupLen.toString();
		drawTextInBox(showTextC, "#204000", 'Arial',  drawWp*(1000/2)-(calcTextW(LwordWp, showTextC)/2), drawHp*(1000/2)-LwordHp/2, calcTextW(LwordWp, showTextC), LwordHp);
	}
	
	if (setupLen1 != 0) {
		showText += " 位數:"+setupLen1+"/";
		width = calcTextW(SwordWp, showText);
		if (setupLen2 == 0) {
			clearFastScreen();
			showTextC = "輸入第二位數1~"+setupLen1.toString();
			drawTextInBox(showTextC, "#204000", 'Arial',  drawWp*(1000/2)-(calcTextW(LwordWp, showTextC)/2), drawHp*(1000/2)-LwordHp/2, calcTextW(LwordWp, showTextC), LwordHp);
		}
	}
	
	if (setupLen2 != 0) {
		showText += setupLen2;
		width = calcTextW(SwordWp, showText);
		clearFastScreen();
		$('#Exit').html('檢視成績');
	}
	
	if (0!=showText.length)
		drawTextInBox(showText, "#000", 'Arial',  (drawWp*1000 - width)+drawWp*4, drawHp*6, width, SwordHp);
	
}

function clearFastScreen() {
	ctx.clearRect(drawWp*4, drawHp*4, drawWp*(994), drawHp*(994));
}

function drawQuestionArea() {
	ctx.clearRect(drawWp*4, drawHp*SwordHp+20, drawWp*(994), drawHp*(980-SwordHp));
	let qIndex = -1;
	let aIndex = -1;
	
	let textgap = drawWp*10;
	let prebaselineX = drawWp*590;
	let nowbaselineX = drawWp*54;
	let baselineY = drawHp*546;
	let baselineW = LwordWp*maxInputLen;
	let baselineH = drawHp*6;
	let nowsymbolX = nowbaselineX;
	let presymbolX = prebaselineX;
	let symbolY = baselineY-LwordHp-textgap;
	
	let nowquestionX = drawWp*444;
	let prequestionX = drawWp*984;
	let prequestionY = drawWp*120;
	
	let textLine1Y = baselineY-(LwordHp*2)-textgap*2;
	let textLine2Y = baselineY-LwordHp-textgap;
	let textLine3Y = baselineY+baselineH+textgap;
	let textLine4Y = baselineY+baselineH+LwordHp+textgap*2;
	let textLine5Y = baselineY+baselineH+(LwordHp*2)+textgap*3;
		
	let ansLen;
	let drawWp500 = drawWp*450;
	if (0!=questionArray.length) {
		qIndex = questionArray.length-1;
	} else {
		return;
	}
	
	if (0!=answerArray.length)
		aIndex = answerArray.length-1;
	
	if (0<=qIndex-1) {
		ctx.fillStyle = "#00A0CF";
		ctx.fillRect(prebaselineX, baselineY, baselineW, baselineH);
		let showQuestionIndex = "做了:" + qIndex + "題";
		if (answerArray[qIndex-1][1]) {
			drawTextInBox(showQuestionIndex, "#00F", 'Arial', prequestionX-calcTextW(SwordWp, showQuestionIndex), prequestionY, calcTextW(SwordWp, showQuestionIndex), SwordHp);
		} else {
			drawTextInBox(showQuestionIndex, "#F00", 'Arial', prequestionX-calcTextW(SwordWp, showQuestionIndex), prequestionY, calcTextW(SwordWp, showQuestionIndex), SwordHp);
		}
		drawTextInBox(questionArray[qIndex-1][2], "#00A0CF", 'Arial', presymbolX, symbolY, LwordWp, LwordHp);
		drawTextInBox(questionArray[qIndex-1][0], "#000", 'Arial', prequestionX-calcTextW(LwordWp, questionArray[qIndex-1][0]), textLine1Y, calcTextW(LwordWp, questionArray[qIndex-1][0]), LwordHp);
		drawTextInBox(questionArray[qIndex-1][1], "#000", 'Arial', prequestionX-calcTextW(LwordWp, questionArray[qIndex-1][1]), textLine2Y, calcTextW(LwordWp, questionArray[qIndex-1][1]), LwordHp);
		ansLen = calcTextW(LwordWp, answerArray[qIndex-1][0])
		if (drawWp500<ansLen) ansLen = drawWp500;
		drawTextInBox(answerArray[qIndex-1][0], "#000", 'Arial', prequestionX-ansLen, textLine3Y, ansLen, LwordHp);
	}
	ctx.fillStyle = "#00A0CF";
	ctx.fillRect(nowbaselineX, baselineY, baselineW, baselineH);
	drawTextInBox(questionArray[qIndex][2], "#00A0CF", 'Arial', nowsymbolX, symbolY, LwordWp, LwordHp);
	drawTextInBox(questionArray[qIndex][0], "#000", 'Arial', nowquestionX-calcTextW(LwordWp, questionArray[qIndex][0]), textLine1Y, calcTextW(LwordWp, questionArray[qIndex][0]), LwordHp);
	drawTextInBox(questionArray[qIndex][1], "#000", 'Arial', nowquestionX-calcTextW(LwordWp, questionArray[qIndex][1]), textLine2Y, calcTextW(LwordWp, questionArray[qIndex][1]), LwordHp);
	let inputValIndex;
	let setRed = -1;
	for (inputValIndex=inputVal.length-1;inputValIndex>=0;inputValIndex--) {
		if (""!=inputVal[inputValIndex]) {
			setRed = inputValIndex;
			break;
		}
	}
	
	for (inputValIndex=0;inputValIndex<inputVal.length;inputValIndex++) {
		let textColor = "#00F";
		if (inputValIndex==setRed) {
			textColor = "#F00";
		}
		ansLen = calcTextW(LwordWp, inputVal[inputValIndex])
		if (drawWp500<ansLen) ansLen = drawWp500;
		
		let Q_TextH = textLine5Y;
		let Q_TextW = nowquestionX-ansLen;
		
		if (0==inputValIndex) {
			Q_TextH = textLine3Y;
		} else if (1==inputValIndex) {
			if ('×'==setupType ) Q_TextW = nowquestionX-ansLen-LwordWp;//Auto Shift 1 Word
			Q_TextH = textLine4Y;
		} else if (2==inputValIndex) {
			Q_TextH = textLine5Y;
		}
		if (inputValCurrentIndex==inputValIndex) {
			//inputValCharCurrentIndex
			drawTextInStroke(inputVal[inputValIndex], textColor, 'Arial', Q_TextW, Q_TextH, ansLen, LwordHp, "#00F");
		} else {
			drawTextInBox(inputVal[inputValIndex], textColor, 'Arial', Q_TextW, Q_TextH, ansLen, LwordHp);
		}
	}
}

function drawTextInBox(txt, fillStyle, font, x, y, w, h, angle) {
	drawTextByChar(txt, fillStyle, font, x, y, w, h, angle, false);
}

function drawTextInStroke(txt, fillStyle, font, x, y, w, h, strokeRectColor) {
	drawTextByChar(txt, fillStyle, font, x, y, w, h, 0, true, strokeRectColor);
}

function drawTextByChar(txt, fillStyle, font, x, y, w, h, angle, strokeRect, strokeRectColor) {
	angle = angle || 0;
	strokeRect = strokeRect || false;
	strokeRectColor = strokeRectColor || fillStyle;
	let fontHeight = 20;
	let hMargin = 4;
	let stringLength;
	
	if (isNaN(txt.length)) {
		stringLength = txt.toString().length;
		txt = txt.toString();
	} else {
		stringLength = txt.length;
	}
	
	if (0!=stringLength) {
		let charx;
		let charw = w/stringLength;
		var txtArray = txt.split('');
		for (let txtIndex=0;txtIndex<stringLength;txtIndex++) {
			charx = x + (charw*txtIndex);
			if (txtIndex==inputValCharCurrentIndex)
				drawText(txtArray[txtIndex], fillStyle, font, charx, y, charw, h, angle, strokeRect, strokeRectColor);
			else
				drawText(txtArray[txtIndex], fillStyle, font, charx, y, charw, h, angle, false);
		}
	} else {
		drawText(txt, fillStyle, font, x, y, w, h, angle, strokeRect, strokeRectColor);
	}
}

function drawText(txt, fillStyle, font, x, y, w, h, angle, strokeRect, strokeRectColor) {
	angle = angle || 0;
	strokeRect = strokeRect || false;
	strokeRectColor = strokeRectColor || fillStyle;
	var fontHeight = 20;
	var hMargin = 4;
	ctx.font = fontHeight + 'px ' + font;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.strokeStyle = strokeRectColor;
	var txtWidth = ctx.measureText(txt).width + 2 * hMargin;
	ctx.save();
	ctx.translate(x+w/2, y);
	ctx.rotate(angle);
	if (strokeRect) {
		ctx.strokeRect(-w/2, 0, w, h);//框線
	}
	ctx.fillStyle = fillStyle;
	ctx.scale(w / txtWidth, h / fontHeight);
	ctx.translate(hMargin, 0)
	ctx.fillText(txt, -txtWidth/2, h/64);
	ctx.restore();
}

function ExitMsgDisplay() {
	$('#dmsg').hide();
}

function showMsgDisplay(data) {
	if (null==data) {
		let ScoreJsonindex = $("#ScoreDataSelect option:selected").val();
		data = ScoreJsonDisplayResArray[ScoreJsonindex];
	}
	if (data.hasOwnProperty("Table")) {
		if (UIDebug) console.log(data);
		let trItemHead;
		let i;
		let infoLen = Object.keys(data.Table).length;
		$("#tbody_makeEditable").html("");
		$("#TotalScore").html("總分："+data.TotalScore);
		
		for (i=0;i<infoLen;i++) {
			let PreQuestionNumber;
			try {
				PreQuestionNumber = data.Table[i-1].QuestionNumber;
			} catch {
				PreQuestionNumber = -1;
			}
			
			if ((i % 2)==0){
				trItemHead = "<tr id=\""+i+"\" bgcolor=\"#ededed\" >";
			} else {
				trItemHead = "<tr id=\""+i+"\" bgcolor=\"#CCC\" >";
			}
			
			let fontColor = "#000";
			if (!data.Table[i].CorrectAnswer || data.Table[i].QuestionNumber==PreQuestionNumber) {
				fontColor = "#D33";
			}
			
			$('#tbody_makeEditable').append(
					trItemHead+
					//'<td class="tdval">'+ (i+1) +"</td>"+
					'<td class="tdval"><font color='+fontColor+'>'+ data.Table[i].QuestionNumber +'</font></td>'+
					'<td class="tdval"><font color='+fontColor+'>'+ data.Table[i].Question +'</font></td>'+
					'<td class="tdval"><font color='+fontColor+'>'+ data.Table[i].Answer +'</font></td>'+
					'<td class="tdval"><font color='+fontColor+'>'+ data.Table[i].CorrectAnswer +'</font></td>'+
					'<td class="tdval"><font color='+fontColor+'>'+ data.Table[i].AnswerDate +'</font></td>'+
					'</tr>');
		}
		
		$('#dmsg').show();
	}
}

function ExitMsgDisplay() {
	$('#dmsg').hide();
}

function setNoteKeyHiLight(HiLight) {
	if (HiLight) {
		document.getElementById('buttonNote').style.color = 'red';
	} else {
		document.getElementById('buttonNote').style.color = '#000000';
	}
}

