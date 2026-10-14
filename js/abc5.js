/* =========================================================
 * ABC5 — 豎式數學練習 (HTML5 rewrite of main.js + draw.js)
 * 功能保留：+−×÷ 題目設定、位數選擇、右到左輸入、速記 3 條、
 * 正對對規則、難度選項、紀錄(localStorage ABC_Data1..10)、評分表
 * 繪圖：純 Canvas 2D 重繪，DPR 高清晰度、動畫與效應
 * ========================================================= */
'use strict';

/* ---------- 狀態 (與原 main.js 對應) ---------- */
const maxInputLen = 6;
const inputValIndexCycle = [0, 1, 2, 1];
const DataKey = ["ABC_Data1","ABC_Data2","ABC_Data3","ABC_Data4","ABC_Data5",
                 "ABC_Data6","ABC_Data7","ABC_Data8","ABC_Data9","ABC_Data10"];
const QuestionType = ['+','-','×','÷'];

let inputValCurrentIndex = 0;
let inputValIndexCycleIndex = 0;
let inputValCharCurrentIndex = 0;
let inputVal = ["", "", ""];

let randomQuestions = false;
let setupType = "";
let setupLen1 = 0, setupLen2 = 0;
let MaxSetupLen = 4;

let questionArray = [];
let answerArray = [];

let ScoreJsonArray = [];
let ScoreJsonDisplayResArray = [];

let correctToLeaveVal = false;
let difficulty = false;

/* ---------- 動畫狀態 ---------- */
let anim = { flash:0, flashType:"", shake:0, confetti:[], ring:0 };

/* ---------- Canvas ---------- */
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
let CW = 0, CH = 0;   /* CSS 像素邏輯尺寸 */

function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const r = canvas.getBoundingClientRect();
  CW = Math.max(1, Math.round(r.width));
  CH = Math.max(1, Math.round(r.height));
  canvas.width  = Math.round(CW * dpr);
  canvas.height = Math.round(CH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function fontStr(px, weight){
  return (weight ? weight + " " : "") + px.toFixed(1) + 'px "Segoe UI","Noto Sans SC",system-ui,sans-serif';
}
function measureW(txt, px){
  ctx.font = fontStr(px);
  return ctx.measureText(String(txt)).width;
}
function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}

/* =========================================================
 * 遊戲邏輯 (port of main.js)
 * ========================================================= */
function getRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inputReset(){
  inputValCurrentIndex = 0;
  inputValIndexCycleIndex = 0;
  inputValCharCurrentIndex = 0;
  inputVal = ["", "", ""];
}

function resetQ(){
  inputReset();
  setupType = "";
  setupLen1 = 0;
  setupLen2 = 0;
  questionArray = [];
  answerArray = [];
  anim = { flash:0, flashType:"", shake:0, confetti:[], ring:0 };
}

function ButtonOnClick(input){
  switch (input){
    case 1: case 2: case 3: case 4:
      if (setupLen1 === 0 && setupType !== "" && input <= MaxSetupLen){
        setupLen1 = input;
        if (setupLen1 === 1){
          setupLen2 = setupLen1;
          ShowSetupInfo();
          AskQuestion();
        } else {
          ShowSetupInfo();
        }
        break;
      } else if (setupLen2 === 0 && setupType !== "" && input <= setupLen1){
        setupLen2 = input;
        ShowSetupInfo();
        AskQuestion();
        break;
      }
      /* fallthrough: setup already complete -> treat as digit input */

    case 0: case 5: case 6: case 7: case 8: case 9:
    case '.':
      if (setupType !== "" && setupLen1 !== 0 && setupLen2 !== 0 &&
          maxInputLen > inputVal[inputValCurrentIndex].length){
        if (setupType === '÷' || setupLen1 === 1){
          inputVal[inputValCurrentIndex] += input;
          inputValCharCurrentIndex = inputVal[inputValCurrentIndex].length - 1;
        } else {
          inputVal[inputValCurrentIndex] = input + inputVal[inputValCurrentIndex];
          inputValCharCurrentIndex = 0;
        }
      }
      break;

    case 'AC':
      if (setupType !== "" && setupLen1 !== 0 && setupLen2 !== 0){
        inputValIndexCycleIndex = 0;
        inputValCurrentIndex = 0;
        inputVal = ["", "", ""];
      }
      break;

    case 'Backspace':
      if (setupType !== "" && setupLen1 !== 0 && setupLen2 !== 0){
        if (setupType === '÷' || setupLen1 === 1){
          inputVal[inputValCurrentIndex] =
            inputVal[inputValCurrentIndex].substring(0, inputVal[inputValCurrentIndex].length - 1);
        } else {
          inputVal[inputValCurrentIndex] =
            inputVal[inputValCurrentIndex].substring(1);
        }
        inputValCharCurrentIndex = (setupType === '÷' || setupLen1 === 1)
          ? inputVal[inputValCurrentIndex].length - 1 : 0;
      }
      break;

    case 'Note':
      if (setupType !== "" && setupLen1 !== 0 && setupLen2 !== 0){
        if (inputValIndexCycleIndex >= inputValIndexCycle.length - 1)
          inputValIndexCycleIndex = 0;
        else
          inputValIndexCycleIndex++;
        inputValCurrentIndex = inputValIndexCycle[inputValIndexCycleIndex];
        inputValCharCurrentIndex = (setupType === '÷' || setupLen1 === 1)
          ? inputVal[inputValCurrentIndex].length - 1 : 0;
      }
      break;

    case 'Exit':
      if (answerArray.length > 0){
        CheckAns(correctToLeaveVal);
        GenJsonTable(true);
      } else if (ScoreJsonDisplayResArray.length > 0){
        showMsgDisplay(ScoreJsonDisplayResArray[0]);
      } else {
        showAlert("沒有紀錄");
      }
      break;

    case 'Esc':
      askConfirm("確定重新開始？", function(){
        CheckAns(correctToLeaveVal);
        if (answerArray.length > 0) GenJsonTable(false);
        resetQ();
        ShowSetupInfo();
      });
      break;

    case 'Enter':
      if (setupType !== "" && setupLen1 !== 0 && setupLen2 !== 0){
        CheckAns(correctToLeaveVal);
      } else {
        setupType = 'Enter';
        setupLen1 = 0;
        setupLen2 = 0;
        randomQuestions = true;
        inputReset();
        ShowSetupInfo();
      }
      break;

    case '+': case '-':
      setupType = input; MaxSetupLen = 4;
      setupLen1 = 0; setupLen2 = 0; randomQuestions = false;
      inputReset();
      questionArray.pop();
      ShowSetupInfo();
      break;

    case '×': case '÷':
      setupType = input; MaxSetupLen = 2;
      setupLen1 = 0; setupLen2 = 0; randomQuestions = false;
      inputReset();
      questionArray.pop();
      ShowSetupInfo();
      break;

    default: break;
  }
}

function AskQuestion(){
  let min1 = 1, max1 = 9, min2 = 1, max2 = 9;
  if (setupLen1 === 2){ min1 = 10; max1 = 99; }
  else if (setupLen1 === 3){ min1 = 100; max1 = 999; }
  else if (setupLen1 === 4){ min1 = 1000; max1 = 9999; }
  if (setupLen2 === 2){ min2 = 10; max2 = 99; }
  else if (setupLen2 === 3){ min2 = 100; max2 = 999; }
  else if (setupLen2 === 4){ min2 = 1000; max2 = 9999; }

  if (randomQuestions){
    if (setupLen1 <= 2) setupType = QuestionType[getRandom(0, 3)];
    else                setupType = QuestionType[getRandom(0, 1)];
  }

  let val_1, val_2;
  if (setupType === '-'){
    do {
      val_1 = getRandom(min1, max1);
      val_2 = getRandom(min2, max2);
      if (val_2 > val_1){ const t = val_1; val_1 = val_2; val_2 = t; }
    } while ((val_1 - val_2) <= 0);
  } else if (setupType === '÷'){
    if (difficulty){
      val_1 = getRandom(min1, max1);
      val_2 = getRandom(min2, max2);
    } else {
      do {
        val_1 = getRandom(min1, max1);
        val_2 = getRandom(min2, max2);
      } while ((val_1 !== val_2) && ((val_1 % val_2) !== 0));
    }
  } else {
    val_1 = getRandom(min1, max1);
    val_2 = getRandom(min2, max2);
  }

  questionArray.push([val_1, val_2, setupType]);
}

function CheckAns(correctToLeave){
  correctToLeave = !!correctToLeave;
  const index = questionArray.length;
  let ret = false;
  if (index !== 0 && setupLen1 !== 0 && setupLen2 !== 0){
    const v1 = questionArray[index-1][0];
    const v2 = questionArray[index-1][1];
    const type = questionArray[index-1][2];

    let inputAns = "";
    for (let i = inputVal.length - 1; i >= 0; i--){
      if (inputVal[i] !== ""){ inputAns = inputVal[i]; break; }
    }
    if (inputAns === "") return false;

    const numAns = parseFloat(inputAns);
    if (type === '+'){ ret = ((v1 + v2) === numAns); }
    else if (type === '-'){ ret = ((v1 - v2) === numAns); }
    else if (type === '×'){ ret = ((v1 * v2) === numAns); }
    else if (type === '÷'){ ret = ((Math.round((v1 / v2) * 100) / 100) === numAns); }

    const now = new Date(new Date().getTime() + 8 * 3600 * 1000);
    answerArray.push([inputAns, ret, now.toISOString().slice(0, -5)]);

    anim.flash = 1;
    anim.flashType = ret ? "ok" : "bad";
    if (!ret) anim.shake = 1;
    if (ret) spawnConfetti();

    inputValIndexCycleIndex = 0;
    inputValCurrentIndex = 0;
    inputVal = ["", "", ""];

    if (!ret && correctToLeave){
      questionArray.push([v1, v2, setupType]);   /* 同一題重複 */
    } else {
      AskQuestion();
    }
  }
  return ret;
}

/* =========================================================
 * 紀錄 / 評分 (port of GenJsonTable, GetJsonArray...)
 * ========================================================= */
function GenJsonTable(showUITable){
  const qLen = questionArray.length;
  const aLen = answerArray.length;
  const jsonObj = [];
  let correctAnswer = 0;
  const Q_CorrectToLeaveArray = [];
  let QuestionNumberOfCorrectToLeaveArray = 0;

  if (aLen === (qLen - 1)){
    for (let i = 0; i < aLen; i++){
      const obj = {};
      obj.Question = questionArray[i][0] + questionArray[i][2] + questionArray[i][1];
      obj.Answer = answerArray[i][0];
      obj.CorrectAnswer = answerArray[i][1];
      obj.AnswerDate = answerArray[i][2];

      if (answerArray[i][1]) correctAnswer++;

      if (correctToLeaveVal && Q_CorrectToLeaveArray.length === 0){
        Q_CorrectToLeaveArray.push([obj.Question, i, answerArray[i][1]]);
        QuestionNumberOfCorrectToLeaveArray++;
      } else if (correctToLeaveVal &&
                 Q_CorrectToLeaveArray[Q_CorrectToLeaveArray.length-1][0] !== obj.Question){
        Q_CorrectToLeaveArray.push([obj.Question, i, answerArray[i][1]]);
        QuestionNumberOfCorrectToLeaveArray++;
      }
      obj.QuestionNumber = correctToLeaveVal
        ? QuestionNumberOfCorrectToLeaveArray : (i + 1);
      jsonObj.push(obj);
    }

    const ScoreObject = {};
    if (correctToLeaveVal){
      correctAnswer = 0;
      for (const e of Q_CorrectToLeaveArray) if (e[2]) correctAnswer++;
      const score = 100 / Q_CorrectToLeaveArray.length;
      ScoreObject.TotalScore = Math.round(score * correctAnswer);
    } else {
      const score = 100 / aLen;
      ScoreObject.TotalScore = Math.round(score * correctAnswer);
    }
    ScoreObject.Table = jsonObj;
    ScoreObject.UpDateTime = Date.now();

    if (showUITable) showMsgDisplay(ScoreObject);
    SetJsonArrayNewData(ScoreObject);
  }
}

function SetJsonArrayNewData(ScoreObject){
  if (ScoreJsonDisplayResArray.length > 0 &&
      ScoreJsonDisplayResArray[0].Table && ScoreObject.Table){
    const old = ScoreJsonDisplayResArray[0].Table;
    const oKey = Object.keys(old).length - 1;
    const nKey = Object.keys(ScoreObject.Table).length - 1;
    if (old[oKey] && ScoreObject.Table[nKey] &&
        old[oKey].AnswerDate === ScoreObject.Table[nKey].AnswerDate) return;
  }

  const dateArray = [];
  let toSave = false, SaveKey = null;
  for (let i = 0; i < ScoreJsonArray.length; i++){
    if (ScoreJsonArray[i]){
      dateArray.push(ScoreJsonArray[i].UpDateTime);
    } else {
      toSave = true;
      SaveKey = DataKey[i];
      break;
    }
  }
  if (toSave === false){
    const minDate = Math.min.apply(null, dateArray);
    for (let i = 0; i < ScoreJsonArray.length; i++){
      if (ScoreJsonArray[i] && ScoreJsonArray[i].UpDateTime === minDate){
        SaveKey = ScoreJsonArray[i].SaveKey || DataKey[i];
        break;
      }
    }
    if (!SaveKey) SaveKey = DataKey[0];
  }
  ScoreObject.SaveKey = SaveKey;
  localStorage.setItem(SaveKey, JSON.stringify(ScoreObject));
  GetJsonArray();
}

function GetJsonArray(){
  ScoreJsonArray = [];
  for (let i = 0; i < DataKey.length; i++){
    const raw = localStorage.getItem(DataKey[i]);
    let parsed = null;
    if (raw){
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    }
    ScoreJsonArray.push(parsed);
  }
  const filled = ScoreJsonArray.filter(function(x){ return x && x.UpDateTime; });
  filled.sort(function(a, b){ return b.UpDateTime - a.UpDateTime; });
  ScoreJsonDisplayResArray = filled;

  const sel = document.getElementById("ScoreDataSelect");
  sel.innerHTML = "";
  for (let i = 0; i < filled.length; i++){
    const d = new Date(filled[i].UpDateTime + 8 * 3600 * 1000);
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = d.toISOString().slice(0, -5);
    sel.appendChild(opt);
  }
}

function ResetStorage(){
  for (let i = 0; i < DataKey.length; i++) localStorage.removeItem(DataKey[i]);
  ScoreJsonArray = [];
  ScoreJsonDisplayResArray = [];
  const sel = document.getElementById("ScoreDataSelect");
  sel.innerHTML = "";
  document.getElementById("dmsg").hidden = true;
}

let msgShown = false;
function showMsgDisplay(data){
  if (!data || !data.Table) return;
  const panel = document.getElementById("dmsg");
  panel.hidden = false;
  document.getElementById("TotalScore").textContent = "總分：" + data.TotalScore;

  const tbody = document.getElementById("tbody_makeEditable");
  tbody.innerHTML = "";
  const table = data.Table;
  for (let i = 0; i < table.length; i++){
    const row = table[i];
    const prev = (i > 0) ? table[i-1].QuestionNumber : -1;
    const bad = !row.CorrectAnswer || row.QuestionNumber === prev;
    const tr = document.createElement("tr");
    const cells = [row.QuestionNumber, row.Question, row.Answer,
                   row.CorrectAnswer ? "✓" : "✗", row.AnswerDate];
    for (const c of cells){
      const td = document.createElement("td");
      if (bad) td.className = "bad";
      td.textContent = String(c);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  msgShown = true;
}

function ExitMsgDisplay(){
  document.getElementById("dmsg").hidden = true;
  msgShown = false;
}

function scoreSelectChanged(){
  const sel = document.getElementById("ScoreDataSelect");
  const idx = parseInt(sel.value, 10);
  if (!isNaN(idx) && ScoreJsonDisplayResArray[idx])
    showMsgDisplay(ScoreJsonDisplayResArray[idx]);
}

/* ---------- 輔助 UI ---------- */
function showAlert(msg){
  const el = document.getElementById("alertMsg");
  if (!el){
    const p = document.createElement("p");
    p.id = "alertMsg";
    p.style.cssText = "position:fixed;left:0;right:0;bottom:0;text-align:center;" +
      "font-size:clamp(14px,2.6vmin,24px);color:#fff;background:rgba(217,75,75,.92);" +
      "padding:.6em;z-index:1001;";
    p.textContent = msg;
    document.body.appendChild(p);
    setTimeout(function(){ p.remove(); }, 2200);
    return;
  }
  el.textContent = msg;
}

let confirmYesFn = null;
function askConfirm(msg, onYes){
  const ov = document.getElementById("confirmOverlay");
  document.getElementById("confirmMsg").textContent = msg;
  confirmYesFn = onYes;
  ov.hidden = false;
  document.getElementById("btnConfirmYes").onclick = function(e){
    hideConfirm(); if (confirmYesFn){ const f = confirmYesFn; confirmYesFn = null; f(); }
  };
  document.getElementById("btnConfirmNo").onclick = function(e){
    hideConfirm(); confirmYesFn = null;
  };
}
function hideConfirm(){
  document.getElementById("confirmOverlay").hidden = true;
}

/* =========================================================
 * 繪圖模組 (rewrite of draw.js — 視覺升級)
 * ========================================================= */
const COL = {
  card:"#fbfdff", ink:"#16283a", accent:"#00a0cf", accentDk:"#00719a",
  cur:"#d43232", note:"#1d4ed8", ok:"#2fa46b", bad:"#d94b4b",
  ghost:"#8fa4b8", line:"#cfd8e2"
};

function spawnConfetti(){
  const x = CW * 0.30, y = CH * 0.55;
  for (let i = 0; i < 26; i++){
    anim.confetti.push({
      x: x + (Math.random()-0.5)*CW*0.25,
      y: y + (Math.random()-0.5)*CH*0.10,
      vx: (Math.random()-0.5)*CW*0.010,
      vy: -Math.random()*CH*0.012 - CH*0.002,
      r: Math.max(2, CW*0.006*Math.random() + CW*0.003),
      life: 1,
      c: [COL.accent, COL.ok, "#f0b42e", COL.note][i % 4]
    });
  }
}

function setupLabel(){
  if (setupType === '+') return "加法";
  if (setupType === '-') return "減法";
  if (setupType === '×') return "乘法";
  if (setupType === '÷') return "除法";
  if (setupType === 'Enter') return "隨機";
  return "";
}

function render(){
  const W = CW, H = CH;
  ctx.clearRect(0, 0, W, H);

  /* --- 板背景：圓角卡片 + 漸條 + 內邊框 --- */
  const pad = W * 0.012;
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(1, "#eef4fa");
  roundRect(pad, pad, W - pad*2, H - pad*2, W*0.02);
  ctx.fillStyle = grd; ctx.fill();
  ctx.save();
  roundRect(pad, pad, W - pad*2, H - pad*2, W*0.02);
  ctx.strokeStyle = "rgba(0,113,154,.35)"; ctx.lineWidth = Math.max(1, W*0.002);
  ctx.stroke();
  ctx.restore();

  const fs = Math.min(W*0.060, H*0.135);      /* 數字體大小 */
  const hasQ = questionArray.length > 0;

  /* --- 無題目：中心提示 + 設定資訊 --- */
  if (!hasQ){
    let hint = "";
    if (setupType === "") hint = "輸入 + − × ÷ ↵ 選擇題目";
    else if (setupLen1 === 0) hint = "輸入第一位數 1~" + MaxSetupLen;
    else if (setupLen2 === 0) hint = "輸入第二位數 1~" + setupLen1;
    if (hint !== ""){
      ctx.font = fontStr(fs*0.62, "600");
      ctx.fillStyle = COL.accentDk;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(hint, W*0.5, H*0.46);
    }
    const lab = setupLabel();
    if (lab !== ""){
      let s = lab;
      if (setupLen1 !== 0) s += " 位數:" + setupLen1 + (setupLen2 !== 0 ? "/" + setupLen2 : "/");
      ctx.font = fontStr(fs*0.34, "700");
      ctx.fillStyle = COL.ink;
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(s, W*0.97, H*0.04);
    }
  }

  if (hasQ){
    drawQuestionBlock(W*0.42, H*0.24, fs, questionArray.length-1, true);
    if (questionArray.length > 1)
      drawQuestionBlock(W*0.955, H*0.30, fs*0.66, questionArray.length-2, false);

    /* 進度計：做了 n 題 (顏色依上一對對) */
    const n = questionArray.length - 1;
    const prevOk = (n >= 1 && answerArray[n-1]) ? answerArray[n-1][1] : true;
    ctx.font = fontStr(fs*0.34, "700");
    ctx.fillStyle = prevOk ? COL.note : COL.bad;
    ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText("做了:" + n + "題", W*0.955, H*0.06);
  }

  /* --- 效應層 --- */
  if (anim.flash > 0){
    const a = anim.flash;
    if (anim.flashType === "ok"){
      const r = (1 - a) * W * 0.16 + fs;
      ctx.save();
      ctx.globalAlpha = a * 0.55;
      ctx.strokeStyle = COL.ok; ctx.lineWidth = fs*0.10;
      ctx.beginPath(); ctx.arc(W*0.42, H*0.62, r, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = a;
      ctx.font = fontStr(fs*1.1, "800");
      ctx.fillStyle = COL.ok; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✓", W*0.42, H*0.62);
      ctx.restore();
    } else {
      ctx.save();
      ctx.globalAlpha = a * 0.30;
      const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.7);
      vg.addColorStop(0, "rgba(217,75,75,0)");
      vg.addColorStop(1, "rgba(217,75,75,1)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = a;
      ctx.font = fontStr(fs*1.1, "800");
      ctx.fillStyle = COL.bad; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✗", W*0.42, H*0.62);
      ctx.restore();
    }
    anim.flash = Math.max(0, anim.flash - 0.03);
  }
  if (anim.shake > 0) anim.shake = Math.max(0, anim.shake - 0.05);

  /* --- 速記條狀態顯示：小條標標 --- */
  if (hasQ && inputValIndexCycleIndex > 0){
    ctx.font = fontStr(fs*0.30, "700");
    ctx.fillStyle = COL.note;
    ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.fillText("速記", W*0.05, H*0.96);
  }

  /* --- 條條條條條條條條條條條條條 */
  for (let i = anim.confetti.length - 1; i >= 0; i--){
    const p = anim.confetti[i];
    p.x += p.vx; p.y += p.vy; p.vy += CH*0.0009; p.life -= 0.02;
    if (p.life <= 0){ anim.confetti.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

/* 一個題目區塊：op 與兩數與基準與輸入條 */
function drawQuestionBlock(xR, y1, fs, qIndex, isCurrent){
  const q = questionArray[qIndex];
  const s1 = String(q[0]), s2 = String(q[1]), op = q[2];
  const w1 = measureW(s1, fs), w2 = measureW(s2, fs);
  const lineGap = fs * 0.42;
  const y2 = y1 + fs + lineGap;
  const baseY = y2 + fs + lineGap * 0.9;
  const baseW = Math.max(w1, w2, fs * 3.4);

  const shakeX = isCurrent ? Math.sin(anim.shake * 40) * fs * 0.14 * anim.shake : 0;

  ctx.textAlign = "right"; ctx.textBaseline = "top";
  const dim = isCurrent ? 1 : 0.55;

  /* 兩數 */
  ctx.font = fontStr(fs, isCurrent ? "700" : "500");
  ctx.fillStyle = isCurrent ? COL.ink : COL.ghost;
  ctx.fillText(s1, xR, y1);
  ctx.fillText(s2, xR, y2);

  /* 號號 */
  ctx.font = fontStr(fs*1.05, "700");
  ctx.fillStyle = isCurrent ? COL.accent : COL.ghost;
  ctx.fillText(op, xR - w2 - fs*0.28, y2 + fs*0.02);

  /* 基準條 */
  ctx.fillStyle = isCurrent ? COL.accent : COL.line;
  roundRect(xR - baseW - fs*0.18, baseY, baseW + fs*0.34, fs*0.09, fs*0.045);
  ctx.fill();

  /* 上一題：顯示其答案與對對對對 */
  if (!isCurrent){
    const a = answerArray[qIndex];
    if (a){
      ctx.font = fontStr(fs, "500");
      ctx.fillStyle = a[1] ? COL.ghost : COL.bad;
      ctx.fillText(String(a[0]), xR, baseY + fs*0.35);
    }
    return;
  }

  /* 輸入條 0..2 */
  const rowGap = fs + lineGap * 0.55;
  for (let i = 0; i < inputVal.length; i++){
    if (inputVal[i] === "") continue;
    let rowX = xR;
    if (i === 1 && setupType === '×') rowX = xR - measureW("0", fs); /* auto shift */
    const rowY = baseY + fs*0.30 + i * rowGap;
    const active = (i === inputValCurrentIndex);
    ctx.font = fontStr(fs, "700");
    ctx.fillStyle = (i === 0) ? COL.cur : (active ? COL.cur : COL.note);
    if (!active && i !== 0) ctx.fillStyle = COL.note;
    if (i === 0 && active) ctx.fillStyle = COL.cur;
    ctx.fillText(inputVal[i], rowX + shakeX, rowY);

    /* 閃閃閃閃閃閃閃閃閃閃閃閃閃 */
    if (active && inputVal[i].length > 0){
      const s = inputVal[i];
      const idx = Math.min(inputValCharCurrentIndex, s.length - 1);
      const tailW = measureW(s.substring(idx), fs);
      const charW = measureW(s.substring(idx, idx+1), fs);
      const blink = 0.45 + 0.4 * Math.abs(Math.sin(Date.now() * 0.004));
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.fillStyle = COL.accent;
      roundRect(rowX - tailW - charW*0.15 + shakeX, rowY - fs*0.10,
                charW*1.3, fs*1.18, fs*0.18);
      ctx.fill();
      ctx.restore();
    }
  }
}

/* =========================================================
 * 綁綁綁綁綁綁綁綁綁綁綁綁綁
 * ========================================================= */
function bindButtons(){
  const keys = document.querySelectorAll("#keypad .key, #btnCloseMsg, #btnClearRec");
  keys.forEach(function(el){
    el.addEventListener("pointerdown", function(ev){
      const k = el.getAttribute("data-key");
      if (k === undefined) return;
      let input = k;
      if (k >= "0" && k <= "9") input = parseInt(k, 10);
      ButtonOnClick(input);
      updateExitLabel();
      updateNoteHighlight();
    });
  });
  document.getElementById("btnCloseMsg").addEventListener("pointerdown", function(){
    ExitMsgDisplay();
  });
  document.getElementById("btnClearRec").addEventListener("pointerdown", function(){
    ResetStorage();
  });
}

function bindToggles(){
  [["btnCorrectToLeave","correctToLeave"], ["btnDifficulty","difficulty"]].forEach(function(pair){
    const el = document.getElementById(pair[0]);
    el.addEventListener("pointerdown", function(){
      const on = el.getAttribute("data-on") === "1";
      if (questionArray.length > 0){
        showAlert("只能在還沒作答前切換");
        return;
      }
      const now = !on;
      el.setAttribute("data-on", now ? "1" : "0");
      if (pair[1] === "correctToLeave"){
        correctToLeaveVal = now;
        localStorage.setItem("correctToLeave", String(now));
      } else {
        difficulty = now;
        localStorage.setItem("difficulty", String(now));
      }
    });
  });
}

function bindKeyboard(){
  document.addEventListener("keydown", function(ev){
    const k = ev.key;
    if (k >= "0" && k <= "9"){ ButtonOnClick(parseInt(k, 10)); }
    else if (k === ".") ButtonOnClick('.');
    else if (k === "+" || k === "z" || k === "Z") ButtonOnClick('+');
    else if (k === "-" || k === "x" || k === "X") ButtonOnClick('-');
    else if (k === "*" || k === "c" || k === "C" || k === "×") ButtonOnClick('×');
    else if (k === "/" || k === "v" || k === "V" || k === "÷") ButtonOnClick('÷');
    else if (k === "Enter") ButtonOnClick('Enter');
    else if (k === "Backspace") ButtonOnClick('Backspace');
    else if (k === "Tab") ButtonOnClick('Note');
    else if (k === "Escape") ButtonOnClick('Esc');
    else if (k === "q" || k === "Q") ButtonOnClick('Exit');
    else return;
    updateExitLabel();
    updateNoteHighlight();
    ev.preventDefault();
  });
}

function updateExitLabel(){
  const el = document.getElementById("btnExit");
  el.textContent = (answerArray.length > 0) ? "檢視成績" : "查看紀錄";
}
function updateNoteHighlight(){
  const el = document.querySelector('#keypad .key[data-key="Note"]');
  if (!el) return;
  if (inputValIndexCycleIndex > 0) el.classList.add("active");
  else el.classList.remove("active");
}

/* ---------- 綁綁綁綁綁綁綁綁綁綁 ---------- */
function init(){
  ExitMsgDisplay();
  correctToLeaveVal = localStorage.getItem("correctToLeave") === "true";
  difficulty = localStorage.getItem("difficulty") === "true";
  document.getElementById("btnCorrectToLeave").setAttribute("data-on", correctToLeaveVal ? "1" : "0");
  document.getElementById("btnDifficulty").setAttribute("data-on", difficulty ? "1" : "0");

  GetJsonArray();
  resetQ();
  ShowSetupInfo();

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", resizeCanvas);

  bindButtons();
  bindToggles();
  bindKeyboard();

  window.addEventListener("pagehide", function(){
    if (answerArray.length === questionArray.length - 1) GenJsonTable(false);
  });

  (function loop(){
    render();
    requestAnimationFrame(loop);
  })();
}

function ShowSetupInfo(){ /* 資訊繪於 render() 每輪輪輪 */ }

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init);
else
  init();
