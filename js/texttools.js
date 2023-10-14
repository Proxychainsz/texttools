const cipherField = document.getElementById('cipherField');
const keyField = document.getElementById('keyField');
const textField = document.getElementById('textField');
const altField = document.getElementById('altField');

const charCounter = document.getElementById('charCount');
const noWSpaceCounter = document.getElementById('noWSpaceCount');
const letterCounter = document.getElementById('letterCount');
const digitCounter = document.getElementById('digitCount');
const selectCounter = document.getElementById('selectCount');
const groupCounter = document.getElementById('groupCount');

textField.oninput = () => {
	// textField.value = lenTrim(textField.value, 666666);
	charCounter.innerHTML = (textField.value.match(/(.|\n|\r)/g) || []).length;
	noWSpaceCounter.innerHTML = (textField.value.match(/\S/g) || []).length;
	letterCounter.innerHTML = (textField.value.match(/[a-z]/gi) || []).length;
	digitCounter.innerHTML = (textField.value.match(/\d/g) || []).length;
	if (textField.value == '') groupCounter.innerHTML = '0';
	else groupCounter.innerHTML = (textField.value.trim().split(/\s+/) || []).length;

	localStorage.setItem('text', textField.value);
};

textField.addEventListener('keydown', function (e) {
	if (e.key == 'Tab') {
		e.preventDefault();
		document.execCommand('insertText', false, '\t');
	}
});

let outField = textField;
let tOutput = false;
function altToggle() {
	const el = document.getElementById('midAlt');
	const af = document.getElementById('altFloats');
	if (tOutput) {
		af.style.width = '28px';
		el.classList.add('altFadeOut');
		el.classList.remove('altFadeIn');
		outField = textField;
		tOutput = false;
	} else {
		af.style.width = '100%';
		el.classList.add('altFadeIn');
		el.classList.remove('altFadeOut');
		outField = altField;
		tOutput = true;
	}
}

let tSize = true;
function toggleSize() {
	const el = document.getElementById('page_right');
	el.style.transition = 'all 0.5s ease-in-out';

	if (tSize) {
		el.style.width = '100%';
		tSize = false;
	} else {
		el.style.width = '0px';
		tSize = true;
	}
}

function selectCount() {
	const el = document.activeElement;
	if (el.value != undefined) {
		const selectedText = el.value.substring(el.selectionStart, el.selectionEnd);
		selectCounter.innerHTML = selectedText.length;
	}
}

function selectReset(e) {
	if (e.button !== 0) return;

	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
	selectCounter.innerHTML = '0';
}

document.onkeydown = KeyPressDown;
function KeyPressDown(e) {
	if (e.ctrlKey) {
		if (e.keyCode == 89) redoButton(); // Y
		if (e.keyCode == 90) undoButton(); // Z
		if (e.keyCode == 65 || e.keyCode == 97) selectCount(); // a  A
	}
}

const undoHistory = [];
const redoHistory = [];
function updateHistory() {
	undoHistory.push(textField.value);
}

function updateInput() {
	textField.dispatchEvent(new Event('input'));
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

function copyMessageFrom() {
	if (textField.value == '') return;
	cipherField.value = textField.value.trim();
}

function copyMessageTo() {
	if (cipherField.value == '') return;
	updateHistory();
	textField.value += `\n${cipherField.value}`;
	updateInput();
}

function copyResults(id) {
	const resultField = document.getElementById(id);
	if (!/\S/.test(resultField.value)) return;

	cipherField.animate([{ color: '#ffffff00' }, { color: '#ffffffc3' }], {
		duration: 250,
		iterations: 1,
	});
	cipherField.value = resultField.value;
}

function toBinary(n) {
	let res = '';
	for (let i = 0; i < n.length; i++) {
		res += `${(0b100000000 + n[i].charCodeAt(0)).toString(2).substring(1)} `;
	}
	return res.trim();
}

function fromBinary(n) {
	n = n.trim().split(' ');
	return n.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function decToBinary(n) {
	n = n.split(/\s+|\n/);
	const res = n.map(x => (+x).toString(2));
	return res.join(' ');
}

function binToDecimal(n) {
	n = n.split(/\s+|\n/);
	const res = n.map(x => parseInt(x, 2));
	return res.join(' ');
}

function fromOctal(n) {
	n = n.split(' ');
	if (n.length == 1) {
		n = n.toString().match(/.{1,3}/g);
	}
	return n.map(x => String.fromCharCode(parseInt(x.padStart(3, '0'), 8))).join('');
}

function xTrim(str) {
	const regex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;
	return str.trim().replace(regex, '');
}

function fibonacci(num) {
	const res = [];
	let x = 1;
	let y = 2;
	let z;
	res.push(x);
	res.push(y);

	let i = 2;
	while (i < num || z < num) {
		z = x + y;
		x = y;
		y = z;
		res.push(z);
		i += 1;
	}
	return res;
}

// https://github.com/0xbalazstoth/javascript-a1z26/blob/main/a1z26.js
const theAlphabet = 'abcdefghijklmnopqrstuvwxyz';
const a1z26 = {
	enc(txt) {
		txt = txt.toString().toLowerCase();
		let encrypted = '';
		for (let j = 0; j < txt.length; j++) {
			for (let i = 0; i < theAlphabet.length; i++) {
				if (theAlphabet[i] === txt[j]) {
					encrypted += `${(i + 1).toString()} `;
				}
			}
		}
		return encrypted.substring(0, encrypted.length - ' '.length);
	},
	dec(txt) {
		txt = txt.toLowerCase();
		const split = txt.split(/\s+|\n/);
		let decrypted = '';
		for (let j = 0; j < split.length; j++) {
			for (let i = 0; i < theAlphabet.length; i++) {
				if (i + 1 == split[j]) {
					decrypted += theAlphabet[i];
				}
			}
		}
		return decrypted;
	},
};

/* --------------------------------------------
	Buttons
-------------------------------------------- */
btnCopyTextField.onclick = () => {
	textField.select();
	textField.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(textField.value);
};

btnAltCopy.onclick = () => {
	if (altField.value == '') return;
	updateHistory();
	textField.value = altField.value;
	updateInput();
};

remWSpaces.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	for (const line of input.split('\n')) {
		res.push(line.replace(/\s/g, ''));
	}
	outField.value = res.join('\n');
	updateInput();
};

remNumbers.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	for (const line of input.split('\n')) {
		res.push(line.replace(/\d+/g, ''));
	}

	outField.value = res.join('\n');
	updateInput();
};

remLetters.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	for (const line of input.split('\n')) {
		res.push(line.replace(/[a-z]/gi, ''));
	}

	outField.value = res.join('\n');
	updateInput();
};

remSpecial.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	for (const line of input.split('\n')) {
		res.push(line.replace(/(?!\w|\s)./g, ''));
	}

	outField.value = res.join('\n');
	updateInput();
};

btnTrim.onclick = e => {
	updateHistory();
	const input = textField.value;
	var res = [];

	if (e.ctrlKey) {
		res.push(xTrim(input));
	} else {
		for (const line of input.split('\n')) {
			res.push(line.trim());
		}
		res = res.join('\n');
	}
	outField.value = res;
	updateInput();
};

btnSplit.onclick = () => {
	updateHistory();
	var input = xTrim(textField.value);
	const sValue = prompt('Split into n segments', '8');
	if (!sValue || !input) return;
	const res = [];

	function chunkString(str, length) {
		return str.match(new RegExp(`(.|[\r\n+]){1,${length}}`, 'g'));
	}

	for (const lines of input.split('\n')) {
		res.push(chunkString(lines, sValue).join(' '));
	}
	outField.value = res.join('\n');
	updateInput();
};

btnSort.onclick = () => {
	updateHistory();
	const input = textField.value;
	let res;

	const regExp = /[^0-9.|^\s+]/g;
	if (regExp.test(input)) {
		res = input
			.split(/\s+|\n/)
			.sort()
			.join(' ');
	} else {
		res = new Float64Array(input.split(/\s+|\n/));
		res = res.sort().join(' ');
	}
	outField.value = res;
	updateInput();
};

btnJoin.onclick = () => {
	updateHistory();
	const input = textField.value;
	outField.value = input.replace(/\n/g, ' ');
	updateInput();
};

btnSpaces2Lines.onclick = () => {
	updateHistory();
	const input = textField.value;
	outField.value = input.replace(/\s+/g, '\n');
	updateInput();
};

btnSpreadsheet.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];
	if (input.length > 800000) return;

	for (const line of input.split('\n')) {
		res.push(line.split('').join('\t'));
	}
	outField.value = res.join('\n');
	updateInput();
};

btnToSquare.onclick = () => {
	updateHistory();
	const input = textField.value.replace(/\n/g, '');
	const lineLength = Math.floor(Math.sqrt(input.length));
	const res = [];

	for (let i = 0, charsLength = input.length; i < charsLength; i += lineLength) {
		res.push(input.substring(i, i + lineLength));
	}
	outField.value = res.join('\n');
	updateInput();
};

btnReverseLines.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	for (const line of input.split('\n')) {
		const reversedLine = line.split('').reverse().join('');
		res.push(reversedLine);
	}
	outField.value = res.join('\n');
	updateInput();
};

btnReverseRows.onclick = () => {
	updateHistory();
	const input = textField.value;
	outField.value = input.split('\n').reverse().join('\n');
	updateInput();
};

btnRotateCW.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	const longest = input.split('\n').sort((a, b) => b.length - a.length)[0].length;

	for (let i = 0; i < longest; i++) {
		let newLine = '';
		for (const line of input.split('\n').reverse()) {
			newLine += line[i] || ' ';
		}
		res.push(newLine);
	}
	outField.value = res.join('\n');
	updateInput();
};

btnRotateCCW.onclick = () => {
	updateHistory();
	const input = textField.value;
	const res = [];

	const longest = input.split('\n').sort((a, b) => b.length - a.length)[0].length;

	for (let i = longest - 1; i >= 0; i--) {
		let newLine = '';
		for (const line of input.split('\n')) {
			newLine += line[i] || ' ';
		}
		res.push(newLine);
	}
	outField.value = res.join('\n');
	updateInput();
};

btnToLowercase.onclick = () => {
	updateHistory();
	const input = textField.value;
	outField.value = input.toLowerCase();
	updateInput();
};

btnToUppercase.onclick = () => {
	updateHistory();
	const input = textField.value;
	outField.value = input.toUpperCase();
	updateInput();
};

btnToBinary.onclick = () => {
	updateHistory();
	const input = textField.value.trim();
	if (input.length > 300000) return;
	outField.value = toBinary(input);
	updateInput();
};

btnFromBinary.onclick = () => {
	updateHistory();
	const input = textField.value.trim();
	const res = [];

	for (const line of input.split('\n')) {
		res.push(fromBinary(line));
	}

	outField.value = res.join(' ');
	updateInput();
};

btnDec2Bin.onclick = () => {
	updateHistory();
	if (textField.length > 300000) return;
	outField.value = decToBinary(textField.value);
	updateInput();
};

btnBin2Dec.onclick = () => {
	updateHistory();
	outField.value = binToDecimal(textField.value);
	updateInput();
};

const calculate = {
	'+': (n, val) => n + val,
	'-': (n, val) => n - val,
	'*': (n, val) => n * val,
	'/': (n, val) => n / val,
	'%': (n, val) => n % val,
	mod: (n, val) => ((n % val) + val) % val,
	power: (n, val) => Math.pow(n, val),
	round: n => Math.round(n),
	trunc: n => Math.trunc(n),
	sqrt: n => Math.sqrt(n),
};

btnCalculate.onclick = () => {
	updateHistory();
	const input = textField.value;
	const op = calcOP.value;
	const val = Number(calcValue.value) || 0;
	// const reg = /(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
	const reg = /(?<=^| )[+-]?\d+([eE]?[+-]?\d+)?(\.\d+([eE]?[+-]?\d+)?)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
	// const reg = /(?:^|\s)[-+]?(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+[eE]?[+-]?\d+)?)(?!\S)/;
	let res = '';

	switch (op) {
		case 'reduce': {
			const x = input.replace(/[^\d\s]/g, ' ').split(/\s|\n/);
			outField.value = x.map(Number).reduce((a, b) => +a + +b, 0);
			return;
		}
	}

	res += input
		.split('\n')
		.map(line =>
			line
				.split(' ')
				.map(n => {
					if (reg.test(n)) {
						// console.log(n, reg.test(n));
						return calculate[op](+n, val);
					}
					return n;
				})
				.join(' '),
		)
		.join('\n');

	outField.value = res;
	updateInput();
};

calcOP.onchange = () => {
	var el = document.getElementById('calcValue');
	if (calcOP.selectedIndex >= 7 && calcOP.selectedIndex <= 10) {
		el.hidden = true;
	} else {
		el.hidden = false;
	}
};

btnBinaryFlip.onclick = () => {
	updateHistory();
	outField.value = textField.value.replace(/(0)|1/g, (_, a) => (a ? '1' : '0'));
	updateInput();
};

btnSearchReplace.onclick = e => {
	updateHistory();
	const input = textField.value;
	const vFind = inputSearch.value;
	const vRepl = inputReplace.value;
	const eFind = regexpEscape(vFind);
	const eRepl = regexpEscape(vRepl);
	let res = '';

	if (vFind == '' || vFind == null || vRepl == null) return;

	if (e.ctrlKey) {
		const regex = new RegExp(`(${eFind})|${eRepl}`, 'g');
		res = input.replace(regex, (_, a) => (a ? vRepl : vFind));
	} else {
		const regex = new RegExp(eFind, 'g');
		res = input.replace(regex, vRepl);
	}

	outField.value = res;
	updateInput();
};

btnAddLines.onclick = () => {
	updateHistory();
	const input = textField.value.split('\n');
	outField.value = input.map((line, index) => `[${(index + 1).toString().padStart(2, '0')}] ${line}`).join('\n');
	updateInput();
};

btnFibonacci.onclick = () => {
	updateHistory();
	const input = textField.value.split(/\s+|\n/);
	let fib = fibonacci(input.length);
	const res = [];

	fib = fib.map(x => x - 1); // array 1 xd
	fib.forEach(i => res.push(input[i]));

	outField.value = res.filter(x => x !== undefined).join(' ');
	updateInput();
};

/* --------------------------------------------
	Misc
-------------------------------------------- */
function isMorse(txt) {
	return /^[.\\/s-]/.test(txt);
}

function isLetters(txt) {
	return /^[A-Za-z]/.test(txt);
}

function isLettersAndSpaces(txt) {
	return /^[A-Za-z\s]*$/.test(txt);
}

function isNumber(txt) {
	return /^\d+$/.test(txt);
}

function isNumSpaces(txt) {
	return /^[\d\s]+$/.test(txt);
}

function isBacon(txt) {
	return /^[ABab\s]*$/.test(txt);
}

function removeInvalid(txt) {
	if (isEmpty(txt)) return;
	const invalidList = /[\u0000-\u001F\u007F-\u009F]/g;
	const res = txt
		.toString()
		.replace(invalidList, '')
		.replace(/NaN/g, '?')
		.replace(/^[?\s]*$/, '');
	return res;
}

function isEmpty(e) {
	switch (e) {
		case '':
		case 0:
		case '0':
		case null:
		case false:
		case Number.isNaN:
		case 'NaN':
		case undefined:
			return true;
		default:
			return false;
	}
}

function regexpEscape(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

function lenTrim(str, max) {
	max = max || 500000;
	if (str.length > max) {
		console.log('Input length (', str.length, ') exceeds (', max, ') truncating to prevent browser from crashing.');
		// return str.substring(0, max);
		return str.slice(0, max);
	}
	return str;
}

function to2dArray(key, size, out) {
	out = out || [];
	if (!key.length) return out;
	out.push(key.slice(0, size));
	return to2dArray(key.slice(size), size, out);
}

function hillParser(key) {
	key = key.split(' ');
	let size;

	if (key.length == 4) size = 2;
	else if (key.length >= 9) {
		size = 3;
		key = key.slice(0, 9);
	} else return;

	return to2dArray(key, size);
}

// Page resizer: https://stackoverflow.com/a/55202728
function dragElement(element, direction) {
	let md; // remember mouse down info
	const first = document.getElementById('page_left');
	const second = document.getElementById('page_right');

	element.onmousedown = onMouseDown;

	function onMouseDown(e) {
		second.style.transition = 'none';
		md = {
			e,
			offsetLeft: element.offsetLeft,
			offsetTop: element.offsetTop,
			firstWidth: first.offsetWidth,
			secondWidth: second.offsetWidth,
		};
		document.onmousemove = onMouseMove;
		document.onmouseup = () => {
			document.onmousemove = document.onmouseup = null;
		};
	}

	function onMouseMove(e) {
		const delta = {
			x: e.clientX - md.e.clientX,
			y: e.clientY - md.e.clientY,
		};

		if (direction === 'H') {
			// Prevent negative-sized elements
			delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);

			element.style.left = `${md.offsetLeft + delta.x}px`;
			first.style.width = `${md.firstWidth + delta.x}px`;
			second.style.width = `${md.secondWidth - delta.x}px`;
		}
	}
}
dragElement(document.getElementById('separator'), 'H');

// Text scrambler: https://stackoverflow.com/a/76258145
const randomString = (n, r = '') => {
	while (n--) r += String.fromCharCode(((r = (Math.random() * 62) | 0), (r += r > 9 ? (r < 36 ? 55 : 61) : 48)));
	return r;
};

const unscramble = el => {
	const chars = [...el.dataset.scramble];
	const tot = chars.length;

	let iteration = 0;
	let ch = 0;
	let solved = '';

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
	}, 12);
};

const scramble = el => {
	clearInterval(el._itv);
	el.textContent = randomString([...el.dataset.scramble].length);
};

const scrambler = el => {
	el.addEventListener('mouseenter', unscramble.bind(null, el));
	el.addEventListener('mouseleave', scramble.bind(null, el));
	scramble(el);
};
document.querySelectorAll('[data-scramble]').forEach(scrambler);

function openModal() {
	const dialogDiv = document.getElementById('dialog');
	dialogDiv.style.opacity = '1';
	window.dialog.showModal();
}
window.onclick = function (event) {
	const dialogDiv = document.getElementById('dialog');
	if (event.target == dialogDiv) {
		dialogDiv.style.opacity = '0';
		window.dialog.close();
	}
};

/* --------------------------------------------
	Custom user background
-------------------------------------------- */
const colorThief = new ColorThief();
const dailyBG = 'https://bing.biturl.top/?resolution=1366&format=image&index=0&mkt=random'; // https://github.com/TimothyYe/bing-wallpaper

const RGBToHSL = (r, g, b) => {
	r /= 255;
	g /= 255;
	b /= 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
	return [60 * h < 0 ? 60 * h + 360 : 60 * h, 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), (100 * (2 * l - s)) / 2];
};

function bgSet(img) {
	const bgElement = document.getElementById('bgElement');
	bgElement.crossOrigin = `Anonymous`;
	bgElement.src = img;
	let hsl = [];

	bgElement.onload = function () {
		hsl = bgGetColor(bgElement);
		document.documentElement.style.setProperty('--h', hsl[0]);
		document.documentElement.style.setProperty('--s', hsl[1]);
		// document.documentElement.style.setProperty('--c', hsl[2]);

		localStorage.setItem('usrbg', img);
		localStorage.setItem('h', hsl[0]);
		localStorage.setItem('s', hsl[1]);
		// localStorage.setItem('c', hsl[2]);
	};
}

function bgGetColor(bgElement) {
	const rgb = colorThief.getColor(bgElement);
	const hsl = RGBToHSL(rgb[0], rgb[1], rgb[2]);
	const h = Math.round(hsl[0]);
	const s = Math.round(hsl[1]);
	const c = complementary(h, s);
	return [h, `${s}%`, c];
}

function complementary(h, s) {
	h += s;
	h = calculate.mod(h, 360);
	return h;
}

function processImage(base64) {
	return new Promise((resolve, reject) => {
		document.documentElement.style.cursor = 'wait';
		const maxFileSize = 30000;
		const img = new Image();
		img.crossOrigin = `Anonymous`;
		img.onload = function () {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			let { width } = img;
			let { height } = img;
			let resizedBase64 = null;
			while (resizedBase64 == null) {
				console.log(`usrBG: width: ${width} height: ${height}`);
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);
				if (canvas.toDataURL('image/jpg').length > maxFileSize) {
					width = Math.round(width * 0.7);
					height = Math.round(height * 0.7);
				} else {
					resizedBase64 = canvas.toDataURL('image/jpg');
				}
			}
			console.log(`Saved usrBG: ${width}x${height}`);
			document.documentElement.style.cursor = '';
			resolve(resizedBase64);
			canvas.remove();
		};
		img.src = base64;
	}).catch(err => {
		console.log('\n', 'Oops! ', err, '\n');
	});
}

dialogURL.onclick = () => {
	const imgURL = document.getElementById('inputBgURL').value || dailyBG;
	if (imgURL == dailyBG) {
		localStorage.setItem('random', 'true');
	} else {
		localStorage.removeItem('random');
	}
	processImage(imgURL).then(bgSet);
};

dialogFile.onchange = () => {
	const file = document.getElementById('dialogFile').files[0];
	const imgFile = new FileReader();
	let baseString;

	imgFile.onloadend = function () {
		baseString = imgFile.result;
		localStorage.removeItem('random');
		processImage(baseString).then(bgSet);
	};
	imgFile.readAsDataURL(file);
};

/* --------------------------------------------
	Mass encode/decode
-------------------------------------------- */
function massEncode() {
	const txt = cipherField.value.trim();
	const key = keyField.value.trim();
	const result = {};
	let element = '';

	if (isEmpty(txt)) return;
	document.getElementById('resContainer').innerHTML = '';

	if (!isNumSpaces(key) && key != '') {
		result.Vigenere = Enigmator.vigenere.enc(txt, key);
		result.Autokey = Enigmator.autokey.enc(txt, key);
		result.Beaufort = Enigmator.beaufort.enc(txt, key);
		result.Simple_Substitution = Enigmator.substitution.enc(txt, key);
		result.Adfgvx = Enigmator.adfgvx.enc(txt, key);
		result.xor = Enigmator.xor.enc(txt, key);
		result.Columnar_Transposition = Boxentriq.ColumnarTransposition.enc(txt, key);
	}

	if (isNumSpaces(key)) {
		result.Hill = Enigmator.hill.enc(txt, hillParser(key));
		const k = key.split(' ');
		result.Affine = Enigmator.affine.enc(txt, k[0], k[1]);
	}

	if (isNumber(key)) {
		result.RailFence = Enigmator.railfence.enc(txt, key);
		result.Caesar = Enigmator.caesar(txt, key);
		result.Multiplicative = Cryptography.Multi.enc(txt, key);
	}

	if (isLettersAndSpaces(txt)) {
		result.Baconian = Enigmator.baconian.enc(txt, 1);
		result.Baconian_v2 = Enigmator.baconian.enc(txt, 2);
		result.Polybius = Cryptography.Polybius.enc(txt);
	}

	result.Playfair = Enigmator.playfair.enc(txt, key || '');
	result.A1z26 = a1z26.enc(txt);
	result.Atbash = Enigmator.atbash(txt);
	result.Phone = Cryptography.Phone.enc(txt);
	result.Morse = Enigmator.morse.enc(txt);
	result.Tapcode = Boxentriq.Tapcode.enc(txt);
	result.Tapcode_Dots = Boxentriq.Tapcode.enc(txt, 'dots');
	result.Goldbug = Enigmator.goldbug.enc(txt);

	if (document.getElementById('encodings').checked) {
		result.Ascii = new TextEncoder().encode(txt).join(' ');
		result.Base64 = Enigmator.base64.enc(txt);
		result.Base32 = Enigmator.base32.enc(txt);
		result.Base16 = Enigmator.cryptanalysis.stringConvert.fromAscii(txt, 16);
		result.Octal = Enigmator.cryptanalysis.stringConvert
			.fromAscii(txt, 8)
			.match(/.{1,3}/g)
			.join('');
		result.Binary = toBinary(txt);
		result.Dec2Bin = decToBinary(txt);
		result.UUEncoding = Enigmator.uuencoding.enc(txt);
		result.Ascii85 = Enigmator.ascii85.enc(txt);
		result.Rot47 = Enigmator.rot(txt, '47');
	}

	if (document.getElementById('rotX').checked) {
		const times = 26;
		for (let i = 1; i < times; i++) {
			result[`Rot.${i}`] = Enigmator.caesar(txt, i);
		}
	}

	if (document.getElementById('baseX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Base.${i}`] = CyberChef.base.enc(txt, i);
		}
	}

	if (document.getElementById('charcodeX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Charcode.${i}`] = CyberChef.charcode.enc(txt, i);
		}
	}

	for (const i in result) {
		result[i] = removeInvalid(result[i]);
		if (!isEmpty(result[i]) && result[i] != txt)
			element += `<resId>${i.replace('_', ' ')}</resId><resDiv><textarea id='${i}Res' class='resTxtArea' ondblclick='copyResults(this.id)' readonly>${result[i]}</textarea></resDiv>`;
	}
	document.getElementById('resContainer').insertAdjacentHTML('beforeend', element);
}

function massDecode() {
	const txt = cipherField.value.trim();
	const key = keyField.value.trim();
	const result = {};
	let element = '';

	if (isEmpty(txt)) return;
	document.getElementById('resContainer').innerHTML = '';

	if (key != '') {
		result.Vigenere = Enigmator.vigenere.dec(txt, key);
		result.Autokey = Enigmator.autokey.dec(txt, key);
		result.Beaufort = Enigmator.beaufort.enc(txt, key);
		result.Simple_Substitution = Enigmator.substitution.dec(txt, key);
		result.Adfgvx = Enigmator.adfgvx.dec(txt, key);
		result.xor = Enigmator.xor.dec(txt, key);
		result.Columnar_Transposition = Boxentriq.ColumnarTransposition.dec(txt, key);
	}

	if (isNumSpaces(key) && key.length > 2) {
		result.Hill = Enigmator.hill.dec(txt, hillParser(key));
		const k = key.split(' ');
		result.Affine = Enigmator.affine.dec(txt, k[0], k[1]);
	}

	if (isNumber(key)) {
		result.RailFence = Enigmator.railfence.dec(txt, key);
		let k = key;
		while (k > 26) k -= 26;
		result.Caesar = Enigmator.caesar(txt, 26 - k);
		result.Multiplicative = Cryptography.Multi.dec(txt, key);
	}

	if (isBacon(txt)) {
		result.Baconian = Enigmator.baconian.dec(txt, 1);
		result.Baconian_v2 = Enigmator.baconian.dec(txt, 2);
	}

	result.Playfair = Enigmator.playfair.dec(txt, key || '');
	result.A1z26 = a1z26.dec(txt);
	result.Atbash = Enigmator.atbash(txt);
	result.Goldbug = Enigmator.goldbug.dec(txt);

	if (isNumSpaces(txt)) {
		result.Phone = Cryptography.Phone.dec(txt);
		result.Tapcode = Boxentriq.Tapcode.dec(txt);
		result.Polybius = Cryptography.Polybius.dec(txt);
	}

	if (isMorse(txt)) {
		result.Morse = Enigmator.morse.dec(txt);
		result.Tapcode = Boxentriq.Tapcode.dec(txt, 'dots');
	}

	if (document.getElementById('encodings').checked) {
		result.Ascii = String.fromCharCode.apply(this, txt.split(' '));
		result.Base64 = Enigmator.base64.dec(txt);
		result.Base32 = Enigmator.base32.dec(txt);
		result.Base16 = Enigmator.base16.dec(txt);
		result.Octal = fromOctal(txt);
		result.Binary = fromBinary(txt);
		result.Bin2Dec = binToDecimal(txt);
		result.UUEncoding = Enigmator.uuencoding.dec(txt);
		result.Ascii85 = Enigmator.ascii85.dec(txt);
		result.Rot47 = Enigmator.rot(txt, '47');
	}

	if (document.getElementById('rotX').checked) {
		const times = 26;
		for (let i = 1; i < times; i++) {
			result[`Rot.${i}`] = Enigmator.caesar(txt, i);
		}
	}

	if (document.getElementById('baseX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Base.${i}`] = CyberChef.base.dec(txt, i);
		}
	}

	if (document.getElementById('charcodeX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Charcode.${i}`] = CyberChef.charcode.dec(txt, i);
		}
	}

	for (const i in result) {
		result[i] = removeInvalid(result[i]);
		if (!isEmpty(result[i]) && result[i] != txt)
			element += `<resId>${i.replace('_', ' ')}</resId><resDiv><textarea id='${i}Res' class='resTxtArea' ondblclick='copyResults(this.id)' readonly>${result[i]}</textarea></resDiv>`;
	}
	document.getElementById('resContainer').insertAdjacentHTML('beforeend', element);
}
