console.log('Credits:\n\n 🌸Catz\n https://cat.enigmatics.org/rotatetext.html \n\n' +
			'🔴Enigmator\n https://github.com/merricx/enigmator \n\n' +
			'🔵Cryptography-Ciphers\n https://github.com/maitreyeepaliwal/Cryptography-Ciphers \n\n' +
			'🟢Boxentriq\n https://www.boxentriq.com/code-breaking/tap-code \n\n' +
			'🟡CyberChef\n https://github.com/gchq/CyberChef' );

const cipherField = document.getElementById("cipherField");
const keyField = document.getElementById("keyField");
const textField = document.getElementById("input");

const rotateCCWButton = document.getElementById("rotateCCWButton");
const reverseLinesButton = document.getElementById("reverseLinesButton");
const reverseRowsButton = document.getElementById("reverseRowsButton");
const rotateCWButton = document.getElementById("rotateCWButton");
const remWSpaces = document.getElementById("remWSpaces");
const trimButton = document.getElementById("trimButton");
const joinLinesButton = document.getElementById("joinLinesButton");
const turnIntoSquareButton = document.getElementById("turnIntoSquareButton");
const toLowercaseButton = document.getElementById("toLowercaseButton");
const toUppercaseButton = document.getElementById("toUppercaseButton");
const toSpreadsheetButton = document.getElementById("toSpreadsheetButton");

const remNumbers = document.getElementById("remNumbers");
const remLetters = document.getElementById("remLetters");
const remSpecial = document.getElementById("remSpecial");
const toBinary_btn = document.getElementById("toBinary");
const fromBinary_btn = document.getElementById("fromBinary");
const splitInto = document.getElementById("splitInto");
const dec2Bin_btn = document.getElementById("decToBinary");
const bin2Dec_btn = document.getElementById("binToDecimal");
const atbash = document.getElementById("atbash");
const doMath = document.getElementById("doMath");
const copyInputBox = document.getElementById("copyInputBox");
const binaryFlip = document.getElementById("binaryFlip");
const searchReplace = document.getElementById("searchReplace");
const sortInput = document.getElementById("sortInput");
const spacesToLines = document.getElementById("spacesToLines");
const fibonacci = document.getElementById("fibonacci");
const numLines = document.getElementById("numLines");

const charCounter = document.getElementById("charCount");
const noWSpaceCounter = document.getElementById("noWSpaceCount");
const letterCounter = document.getElementById("letterCount");
const digitCounter = document.getElementById("digitCount");
const selectCounter = document.getElementById("selectCount");
const groupCounter = document.getElementById("groupCount");


function updateInput() { textField.dispatchEvent(new Event('input')); }
var undoHistory = [];
var redoHistory = [];
function updateHistory() { undoHistory.push(textField.value); }

textField.oninput = () => {
	charCounter.innerHTML = (textField.value.match(/(.|\n|\r)/g) || []).length;
	noWSpaceCounter.innerHTML = (textField.value.match(/\S/g) || []).length;
	letterCounter.innerHTML = (textField.value.match(/[a-z]/gi) || []).length;
	digitCounter.innerHTML = (textField.value.match(/\d/g) || []).length;
	groupCounter.innerHTML = (textField.value.trim().split(/\s+/g) || []).length;

	localStorage.setItem('text', textField.value);
}

document.addEventListener('mouseup', function (e) {
	let selection = window.getSelection().toString();
	if (selection.length > 0) {
		selectCounter.innerHTML = selection.length;
	}
}, false)

document.addEventListener('mousedown', function (e) {
	selectCounter.innerHTML = '0';
})

reverseLinesButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	let res = [];

	for (let line of inputText.split('\n')) {
		let reversedLine = line.split('').reverse().join('');
		res.push(reversedLine);
	}
	textField.value = res.join('\n');
	updateInput();
}

reverseRowsButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	textField.value = inputText.split('\n').reverse().join('\n');
	updateInput();
}

rotateCWButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	let res = [];

	var longest = inputText.split('\n').sort(
		function (a, b) {
			return b.length - a.length;
		}
	)[0].length;

	for (let i = 0; i < longest; i++) {
		let newLine = '';
		for (let line of inputText.split('\n').reverse()) {
			newLine += line[i] || ' ';
		}
		res.push(newLine);
	}
	textField.value = res.join('\n');
	updateInput();
}

rotateCCWButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	let res = [];

	var longest = inputText.split('\n').sort(
		function (a, b) {
			return b.length - a.length;
		}
	)[0].length;

	for (let i = longest - 1; i >= 0; i--) {
		let newLine = '';
		for (let line of inputText.split('\n')) {
			newLine += line[i] || ' ';
		}
		res.push(newLine);
	}
	textField.value = res.join('\n');
	updateInput();
}

remWSpaces.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	let res = [];

	for (let line of inputText.split('\n')) {
		res.push(line.replace(/\s/g, ''));
	}
	textField.value = res.join('\n');
	updateInput();
}

trimButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	// Same as .trim() but now we're also removing empty lines
	textField.value = inputText.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");
	updateInput();
}

joinLinesButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	textField.value = inputText.replace(/\n/g, ' ');
	updateInput();
}

toSpreadsheetButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	let res = [];

	for (let line of inputText.split('\n')) {
		res.push(line.split('').join('\t'));
	}
	textField.value = res.join('\n');
	updateInput();
}

turnIntoSquareButton.onclick = () => {
	const inputText = textField.value.replace(/\n/g, "");
	updateHistory();
	let res = []

	const lineLength = Math.floor(Math.sqrt(inputText.length));

	for (let i = 0, charsLength = inputText.length; i < charsLength; i += lineLength) {
		res.push(inputText.substring(i, i + lineLength));
	}
	textField.value = res.join('\n');
	updateInput();
}

toLowercaseButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	textField.value = inputText.toLowerCase();
	updateInput();
}

toUppercaseButton.onclick = () => {
	const inputText = textField.value;
	updateHistory();
	textField.value = inputText.toUpperCase();
	updateInput();
}

function undoButton() {
	if (undoHistory.slice(-1)[0]) {
		redoHistory.push(textField.value);
		textField.value = undoHistory.slice(-1)[0];
		updateInput();
		undoHistory.pop();
	}
}

function redoButton() {
	if (redoHistory.slice(-1)[0]) {
		updateHistory();
		textField.value = redoHistory.slice(-1)[0];
		updateInput();
		redoHistory.pop();
	}
}
/* -------------------------------------
 	new thingies down here (mostly)
-------------------------------------- */
ico_heart.onclick = () => {
	alert('Original made by Catz 🌸\n' +
		  'Remade with 🤍 by Proxychains');
}

 var tColors = [
	"var(--main)",
	"var(--alt0)",
	"var(--alt1)",
	"var(--alt2)",
	"var(--alt3)",
	"var(--alt4)",
	"var(--alt5)",
	"var(--alt6)",
	"var(--alt7)",
	"var(--alt8)" ];
var tCounter;

window.onload = () => {
	let savedText = localStorage.getItem("text") || "";
	textField.value = savedText;

	let root = document.documentElement;
	window.tCounter = localStorage.getItem("theme") || -1;

	if (tCounter < 0){
		let r = Math.floor(Math.random() * 9);
		root.style.setProperty('--accent', tColors[r]);
	} else {
		let n = Number(tCounter);
		root.style.setProperty('--accent', tColors[n]);
	}
}

function toggleColors() {
	var root = document.documentElement;
	++tCounter;
	if (tCounter > tColors.length - 1) {
		tCounter = 0;
	}
	root.style.setProperty('--accent', tColors[tCounter]);
	localStorage.setItem("theme", tCounter);
}

// Page resizer
var resElem = document.getElementById('page_left');
var resizer = document.createElement('div');
resizer.className = 'resizer';
resElem.appendChild(resizer);
resizer.addEventListener('mousedown', initResize, false);

function initResize(e) {
	window.addEventListener('mousemove', Resize, false);
	window.addEventListener('mouseup', stopResize, false);
}

function Resize(e) {
	resElem.style.width = (e.clientX - resElem.offsetLeft) + 'px';
	resElem.style.transition = "none";
}

function stopResize(e) {
	window.removeEventListener('mousemove', Resize, false);
	window.removeEventListener('mouseup', stopResize, false);
	resElem.style.transition = "all 0.5s ease-in-out";
}

tSize = true;
function toggleSize() {
	let el = document.getElementById("page_left");

	if (tSize) {
		el.style.width = "50%";
		tSize = false;
	} else {
		el.style.width = "100%";
		tSize = true;
	}
}

toBinary_btn.onclick = () => {
	updateHistory();
	let input = textField.value.trim();
	if (input.length > 300000) return;
	textField.value = toBinary(input);
	updateInput();
}

fromBinary_btn.onclick = () => {
	updateHistory();
	let input = textField.value.trim();
	let res = [];

	for (let line of input.split('\n')) {
		res.push(fromBinary(line));
	}

	textField.value = res.join(' ');
	updateInput();
}

function toBinary(input) {
	let res = "";
	for (i = 0; i < input.length; i++) {
		res += (0b100000000 + input[i].charCodeAt(0)).toString(2).substring(1) + ' ';
	}
	return res.trim();
}

function fromBinary(input) {
	input = input.trim().split(' ');
	return input.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

splitInto.onclick = () => {
	updateHistory();
	const input = textField.value;
	let sValue = prompt("gibe numba pls", "8");
	if (sValue == null || input == '') return;
	let res = [];

	function chunkString(str, length) {
		return str.match(new RegExp('(.|[\r\n+]){1,' + length + '}', 'g'));
	}

	for (let lines of input.split('\n')) {
		res.push(chunkString(lines, sValue).join(' '));
	}
	textField.value = res.join('\n');
	updateInput();
}

dec2Bin_btn.onclick = () => {
	updateHistory();
	textField.value = decToBinary(textField.value);
	updateInput();
}

bin2Dec_btn.onclick = () => {
	updateHistory();
	textField.value = binToDecimal(textField.value);
	updateInput();
}

function decToBinary(n) {
	n = n.split(/\s+|\n/);
	let res = n.map(function (x) {
		return (+x).toString(2);
	});
	return res.join(' ');
}

function binToDecimal(n) {
	n = n.split(/\s+|\n/);
	let res = n.map(function (x) {
		return parseInt(x, 2);
	});
	return res.join(' ');
}

//https://github.com/0xbalazstoth/javascript-a1z26/blob/main/a1z26.js
const theAlphabet = "abcdefghijklmnopqrstuvwxyz";
var a1z26 = {
	enc: function (txt) {
		txt = txt.toString().toLowerCase();
		let encrypted = "";
		for (let j = 0; j < txt.length; j++) {
			for (let i = 0; i < theAlphabet.length; i++) {
				if (theAlphabet[i] === txt[j]) {
					encrypted += (i + 1).toString() + ' ';
				}
			}
		}
		return encrypted.substring(0, encrypted.length - ' '.length);
	},
	dec: function (txt) {
		txt = txt.toLowerCase();
		let split = txt.split(/\s+|\n/);
		let decrypted = "";
		for (let j = 0; j < split.length; j++) {
			for (let i = 0; i < theAlphabet.length; i++) {
				if ((i + 1) == split[j]) {
					decrypted += theAlphabet[i];
				}
			}
		}
		return decrypted;
	}
}

function a1z26Enc_btn() {
	updateHistory();
	textField.value = a1z26.enc(textField.value);
	updateInput();
}

function a1z26Dec_btn() {
	updateHistory();
	textField.value = a1z26.dec(textField.value);
	updateInput();
}

atbash.onclick = () => {
	updateHistory();
	textField.value = Enigmator.atbash(textField.value);
	updateInput();
}

copyInputBox.onclick = () => {
	var copyText = textField;
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(copyText.value);
}

doMath.onclick = () => {
	updateHistory();
	const input = textField.value.split(/\s+|\n/g).map(Number);
	let op = prompt("Valid operations: - + * / % round trunc reduce mod", "+"); if (isEmpty(op)) return;

	if (op == 'round' || op == 'trunc' || op == 'reduce') {
		switch (op) {
			case "round": textField.value = input.map(function (x) { return Math.round(x) }).join(' '); break;
			case "trunc": textField.value = input.map(function (x) { return Math.trunc(x) }).join(' '); break;
			case "reduce": textField.value = input.reduce((a, b) => a + b, 0); break;
		}
		updateInput();
		return;
	}

	let nu = prompt("Value:", "10");
	if (nu <= 0) {
	} else {
		switch (op) {
			case "+": var res = input.map(function (x) { return x + +nu; }); break;
			case "-": var res = input.map(function (x) { return x - +nu; }); break;
			case "/": var res = input.map(function (x) { return x / +nu; }); break;
			case "*": var res = input.map(function (x) { return x * +nu; }); break;
			case "%": var res = input.map(function (x) { return x % +nu; }); break;
			case "mod": var res = input.map(function (x) { return ((x % +nu) + +nu) % +nu; }); break;
			default: alert('Invalid operator.');
		}
		textField.value = res.join(' ');
	}
	updateInput();
}

binaryFlip.onclick = () => {
	updateHistory();
	textField.value = textField.value.replace(/(0)|1/g, (_, a) => a ? "1" : "0");
	updateInput();
}

searchReplace.onclick = () => {
	updateHistory();
	const input = textField.value;
	let vFind = prompt("Search for", "");
	let vRepl = prompt("Replace with", "");

	if (vFind == "" || vFind == null || vRepl == null) {
	} else {
		RegExp.quote = function (str) {
			return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
		};
		var re = new RegExp(RegExp.quote(vFind), "g");
		textField.value = input.replace(re, vRepl);
		updateInput();
	}
}

sortInput.onclick = () => {
	updateHistory();
	const input = textField.value;

	var regExp = /[^0-9.|^\s+]/g;
	if (regExp.test(input)) {
		var result = input.trim().split(/\s+|\n/).sort().join(' ');
		console.log('Sort: found letters!')
	} else {
		var result = new Float64Array(input.trim().split(/\s+|\n/));
		result = result.sort().join(' ');
		console.log('Sort: no letters.')
	}
	textField.value = result;
	updateInput();
}

spacesToLines.onclick = () => {
	updateHistory();
	const input = textField.value;
	textField.value = input.replace(/\s+/g, "\n");
	updateInput();
}

numLines.onclick = () => {
	updateHistory();
	const input = textField.value;
	textField.value = input.split('\n').map((line, index) => `[${(index + 1).toString().padStart(2, '0')}] ${line}`).join('\n');
	updateInput();
}

fibonacci.onclick = () => {
	updateHistory();
	const input = textField.value.split(/\s+|\n/);
	let result = [];

	let fib1 = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];
	let fib0 = fib1.map(function (x) { return x - 1; }); // array 1 xd
	fib0.forEach(i => result.push(input[i]));

	textField.value = result.filter(x => x !== undefined).join(' ');
	updateInput();
}

remNumbers.onclick = () => {
	updateHistory();
	let input = textField.value;
	let res = [];

	for (let line of input.split('\n')) {
		res.push(line.replace(/\d+/g, ''));
	}

	textField.value = res.join('\n');
	updateInput();
}

remLetters.onclick = () => {
	updateHistory();
	let input = textField.value;
	let res = [];

	for (let line of input.split('\n')) {
		res.push(line.replace(/[a-z]/gi, ''));
	}

	textField.value = res.join('\n');
	updateInput();
}

remSpecial.onclick = () => {
	updateHistory();
	let input = textField.value;
	let res = [];

	for (let line of input.split('\n')) {
		res.push(line.replace(/(?!\w|\s)./g, ''));
	}

	textField.value = res.join('\n');
	updateInput();
}


// allow undoing using ctrl+z
document.onkeydown = KeyPress;
function KeyPress(e) {
	var evtobj = window.event ? event : e
	if (evtobj.keyCode == 90 && evtobj.ctrlKey) undoButton();
	if (evtobj.keyCode == 89 && evtobj.ctrlKey) redoButton();
}

function copyMessageFrom() {
	if (textField.value == "") return;
	cipherField.value = textField.value;
}

function copyMessageTo() {
	if (cipherField.value == "") return;
	updateHistory();
	textField.value += "\n" + cipherField.value;
	updateInput();
}

function copyResults(myId) {
	let resultField = document.getElementById(myId);
	if (!/\S/.test(resultField.value)) return;
	cipherField.value = resultField.value;
}

function isItMorse(txt) {
	return /^[.\\/s-]/.test(txt);
}

function isItText(txt) {
	return /^[A-Za-z]/.test(txt);
}

function isItNumber(txt) {
	return /^\d+$/.test(txt);
}

function isNumSpaces(txt) {
	return /^[\d\s]+$/.test(txt);
}

function onlyLettersAndSpaces(txt) {
	return /^[A-Za-z\s]*$/.test(txt);
}

function isBacon(txt) {
	return /^[ABab\s]*$/.test(txt);
}

function removeInvalid(txt) {
	if (isEmpty(txt)) return;
	let invalidList = /[\u0000-\u001F\u007F-\u009F]/g;
	let res = txt.toString().replace(invalidList, '').replace(/NaN/g, '?').replace(/^[?\s]*$/, '');
	return res;
}

function isEmpty(e) {
	switch (e) {
		case "":
		case 0:
		case "0":
		case null:
		case false:
		case NaN:
		case 'NaN':
		case undefined:
			return true;
		default:
			return false;
	}
}

function lenTrim(str) {
	let n = 150000;
	if (str.length > n) {
		console.log('Input length (', str.length, ') exceeds (', n, ') truncating to prevent browser from crashing.')
		return str.substring(0, n);
	}
	return str;
}

function helperEncHill(message, mykey) {
	mykey = mykey.split(' ');
	let size = getkeysize(mykey);
	if (isEmpty(size)) return;
	let key = to2dArray(mykey, size);
	return Enigmator.hill.enc(message, key);
}

function helperDecHill(message, mykey) {
	mykey = mykey.split(' ');
	let size = getkeysize(mykey);
	if (isEmpty(size)) return;
	let key = to2dArray(mykey, size);
	return Enigmator.hill.dec(message, key);
}

function getkeysize(key) {
	if (key.length == 4) {
		return 2;
	} else if (key.length == 9) {
		return 3;
	} else return;
}

function to2dArray(arr, size, out) {
	out = out || [];
	if (!arr.length) return out;
	out.push(arr.slice(0, size));
	return to2dArray(arr.slice(size), size, out);
}

function fromOctal(input) {
	var x = input.split(' ');
	if (x.length == 1) {
		var x = x.toString().match(/.{1,3}/g);
	}
	return x.map(x => String.fromCharCode(parseInt(x.padStart(3, '0'), 8))).join('');
}

// https://stackoverflow.com/questions/76257783/text-scrambler-unscrambler-on-hover-html-javascript
const randomString = (n, r = '') => {
	while (n--) r += String.fromCharCode((r = Math.random() * 62 | 0, r += r > 9 ? (r < 36 ? 55 : 61) : 48));
	return r;
};

const unscramble = (el) => {
	const chars = [...el.dataset.scramble];
	const tot = chars.length;

	let iteration = 0;
	let ch = 0;
	let solved = "";

	el._itv = setInterval(() => {
		if (iteration > 10) {
			iteration = 0;
			solved += chars[ch];
			ch += 1;
		}

		el.textContent = randomString(tot - ch, solved);

		if (ch === tot) {
			clearInterval(el._itv);
		}
		iteration += 1;
	}, 20);
};

const scramble = (el) => {
	clearInterval(el._itv);
	el.textContent = randomString([...el.dataset.scramble].length)
};

const scrambler = (el) => {
	el.addEventListener("mouseenter", unscramble.bind(null, el));
	el.addEventListener("mouseleave", scramble.bind(null, el));
	scramble(el);
};
document.querySelectorAll("[data-scramble]").forEach(scrambler);

function list() {
	console.log('\nVigenere, Autokey, Beaufort, Playfair, Simple Substitution, ADFGVX, XOR, Hill, Affine, Rail Fence' +
				'\nCaesar, Multiplicative, a1z26, atbash, Goldbug, Phone, Tapcode, Morse, Polybius, Bacon, Columnar Transposition' +
				'\nAscii, Base64/32/16, UUEncoding, Ascii85(Adobe), Rot47, RotX, BaseX, CharcodeX ');
}