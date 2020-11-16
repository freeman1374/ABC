let drawW = 1000;
let drawH = 1000;

let drawWp = drawW/1000;
let drawHp = drawH/1000;

let XLwordWp = 160;
let XLwordHp = 160;
let LwordWp = 70;
let LwordHp = 130;
let MwordWp = 60;
let MwordHp = 90;
let SwordWp = 26;
let SwordHp = 30;

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
	//console.log("stringLength : "+stringLength +" textWtmp :"+textWtmp);
	return textWtmp;
}


var mainCanvasName = "mainCanvas";
var canvas = document.getElementById(mainCanvasName);
var ctx = canvas.getContext("2d");

function initctx() {
	ctx.beginPath();
}

function FastScreen() {
	let showText = "輸入 + - × ÷ 選擇題目";
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
	}
	let width = calcTextW(SwordWp, showText);
	if (setupLen1 == 0) {
		clearFastScreen();
		showTextC = "輸入第一位數1~"+MaxSetupLen.toString();
		drawTextInBox(showTextC, "#204000", 'Arial',  drawWp*(1000/2)-(calcTextW(LwordWp, showTextC)/2), drawHp*(1000/2)-LwordHp/2, calcTextW(LwordWp, showTextC), LwordHp);
	}
	
	if (setupLen1 != 0) {
		showText += " 第一位數:"+setupLen1;
		width = calcTextW(SwordWp, showText);
		if (setupLen2 == 0) {
			clearFastScreen();
			showTextC = "輸入第二位數1~"+setupLen1.toString();
			drawTextInBox(showTextC, "#204000", 'Arial',  drawWp*(1000/2)-(calcTextW(LwordWp, showTextC)/2), drawHp*(1000/2)-LwordHp/2, calcTextW(LwordWp, showTextC), LwordHp);
		}
	}
	
	if (setupLen2 != 0) {
		showText += " 第二位數:"+setupLen2;
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
	
	
	let nowQ_TextW = drawWp*444;
	let nowQ_baseline_x = drawWp*54;
	let nowQ_baseline_y = drawHp*546;
	let preQ_TextW = drawWp*984;
	let preQ_QuestionIndex = drawWp*120;
	let preQ_baseline_x = drawWp*590;
	let preQ_baseline_y = drawHp*546;
	
	let Q_TextH_L1 = drawHp*170;
	let Q_TextH_L2 = drawHp*354;
	let Q_TextH_L3 = drawHp*570;
	let Q_TextH_L4 = drawHp*700;
	let Q_TextH_L5 = drawHp*826;
	
	let baselineW = drawWp*406;
	let baselineH = drawHp*6;
	  
	let nowSymbolW = drawWp*46;
	let preSymbolW = drawWp*586;
	let symbolH = drawHp*435;
	
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
		ctx.fillRect(preQ_baseline_x, preQ_baseline_y, baselineW, baselineH);
		let showQuestionIndex = "做了 : " + qIndex + " 題";
		if (answerArray[qIndex-1][1]) {
			drawTextInBox(showQuestionIndex, "#00F", 'Arial', preQ_TextW-calcTextW(SwordWp, showQuestionIndex), preQ_QuestionIndex, calcTextW(SwordWp, showQuestionIndex), SwordHp);
		} else {
			drawTextInBox(showQuestionIndex, "#F00", 'Arial', preQ_TextW-calcTextW(SwordWp, showQuestionIndex), preQ_QuestionIndex, calcTextW(SwordWp, showQuestionIndex), SwordHp);
		}
		drawTextInBox(questionArray[qIndex-1][2], "#00A0CF", 'Arial', preSymbolW, symbolH, LwordWp, LwordHp);
		drawTextInBox(questionArray[qIndex-1][0], "#000", 'Arial', preQ_TextW-calcTextW(LwordWp, questionArray[qIndex-1][0]), Q_TextH_L1, calcTextW(LwordWp, questionArray[qIndex-1][0]), LwordHp);
		drawTextInBox(questionArray[qIndex-1][1], "#000", 'Arial', preQ_TextW-calcTextW(LwordWp, questionArray[qIndex-1][1]), Q_TextH_L2, calcTextW(LwordWp, questionArray[qIndex-1][1]), LwordHp);
		ansLen = calcTextW(LwordWp, answerArray[qIndex-1][0])
		if (drawWp500<ansLen) ansLen = drawWp500;
		drawTextInBox(answerArray[qIndex-1][0], "#000", 'Arial', preQ_TextW-ansLen, Q_TextH_L3, ansLen, LwordHp);
	}
	ctx.fillStyle = "#00A0CF";
	ctx.fillRect(nowQ_baseline_x, nowQ_baseline_y, baselineW, baselineH);
	drawTextInBox(questionArray[qIndex][2], "#00A0CF", 'Arial', nowSymbolW, symbolH, LwordWp, LwordHp);
	drawTextInBox(questionArray[qIndex][0], "#000", 'Arial', nowQ_TextW-calcTextW(LwordWp, questionArray[qIndex][0]), Q_TextH_L1, calcTextW(LwordWp, questionArray[qIndex][0]), LwordHp);
	drawTextInBox(questionArray[qIndex][1], "#000", 'Arial', nowQ_TextW-calcTextW(LwordWp, questionArray[qIndex][1]), Q_TextH_L2, calcTextW(LwordWp, questionArray[qIndex][1]), LwordHp);
	for (let inputValIndex=0;inputValIndex<inputVal.length;inputValIndex++) {
		let textColor =  "#0A40CF";
		ansLen = calcTextW(LwordWp, inputVal[inputValIndex])
		if (inputValIndex+1<inputVal.length) {
			if(0 == inputVal[inputValIndex+1].length)
				textColor = "#de2f2f";
		} else if (2==inputValCurrentIndex) {
			if(0 != inputVal[inputValCurrentIndex].length)
				textColor = "#de2f2f";
		}
		if (drawWp500<ansLen) ansLen = drawWp500;
		
		let Q_TextH = Q_TextH_L5;
		let Q_TextW = nowQ_TextW-ansLen;
		
		if (0==inputValIndex) {
			Q_TextH = Q_TextH_L3;
		} else if (1==inputValIndex) {
			if ('×'==setupType ) Q_TextW = nowQ_TextW-ansLen-LwordWp;//Auto Shift 1 Word
			Q_TextH = Q_TextH_L4;
		} else if (2==inputValIndex) {
			Q_TextH = Q_TextH_L5;
		}
		if (inputValCurrentIndex==inputValIndex) {
			drawTextInStroke(inputVal[inputValIndex], textColor, 'Arial', Q_TextW, Q_TextH, ansLen, LwordHp);
		} else {
			drawTextInBox(inputVal[inputValIndex], textColor, 'Arial', Q_TextW, Q_TextH, ansLen, LwordHp);
		}
		
	}
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
	ctx.scale(w / txtWidth, h / fontHeight);
	ctx.translate(hMargin, 0)
	ctx.fillText(txt, -txtWidth/2, 0);
	ctx.restore();
}

function drawTextInStroke(txt, fillStyle, font, x, y, w, h, angle) {
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
	ctx.strokeRect(-w/2, 0, w, h);//框線
	ctx.scale(w / txtWidth, h / fontHeight);
	ctx.translate(hMargin, 0)
	ctx.fillText(txt, -txtWidth/2, 0);
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
		//console.log(data);
		let trItemHead;
		let i;
		let infoLen = Object.keys(data.Table).length;
		$("#tbody_makeEditable").html("");
		$("#TotalScore").html("總分 : "+data.TotalScore);
		
		for (i=0;i<infoLen;i++) {
			if((i % 2)==0){
				trItemHead = "<tr id=\""+i+"\" bgcolor=\"#ededed\" >";
			} else {
				trItemHead = "<tr id=\""+i+"\">";			
			}
			$('#tbody_makeEditable').append(
					trItemHead+
					'<td class="tdval">'+ (i+1) +"</td>"+
					'<td class="tdval">'+ data.Table[i].Question +"</td>"+
					'<td class="tdval">'+ data.Table[i].Answer +"</td>"+
					'<td class="tdval">'+ data.Table[i].CorrectAnswer +"</td>"+
					'<td class="tdval">'+ data.Table[i].AnswerDate +"</td>"+
					"</tr>");
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

