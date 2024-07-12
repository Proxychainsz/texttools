const tinyEditor = new TinyMDE.Editor({ textarea: 'textField' }),
	tinyOutput = new TinyMDE.Editor({ textarea: 'altField', content: '[|>] Output area' }),
	TinyMde = document.getElementsByClassName('TinyMDE'),
	undoHistory = new window.UndoRedojs(5),
	textField = $('textField'),
	altField = $('altField'),
	cipherField = $('cipherField'),
	keyField = $('keyField'),
	charCounter = $('charCount'),
	noWSpaceCounter = $('noWSpaceCount'),
	letterCounter = $('letterCount'),
	digitCounter = $('digitCount'),
	selectCounter = $('selectCount'),
	groupCounter = $('groupCount'),
	undoCounter = $('undoCounter');

tinyEditor.addEventListener('change', e => {
	var input = textField.value;
	charCounter.innerHTML = (input.match(/(.|\n|\r)/g) || []).length;
	noWSpaceCounter.innerHTML = (input.match(/\S/g) || []).length;
	letterCounter.innerHTML = (input.match(/[a-z]/gi) || []).length;
	digitCounter.innerHTML = (input.match(/\d/g) || []).length;
	groupCounter.innerHTML = (input.trim().split(/\s+/) || '').length;

	if (undoHistory.current() !== input) {
		if (input.length - undoHistory.current().length > 1 || input.length - undoHistory.current().length < -1 || input.length - undoHistory.current().length === 0) {
			undoHistory.record(input, true);
		} else {
			undoHistory.record(input);
		}
	}

	undoCounter.innerHTML = undoHistory.currentIndex - 1;
	undoCounter.innerHTML <= 0 ? (undoCounter.style.visibility = 'hidden') : (undoCounter.style.visibility = 'visible');
	localStorage.setItem('text', lenTrim(input));
});

let outField = textField;
let tOutput = false;
function altToggle() {
	const el = $('midAlt'),
		af = $('altFloats'),
		to = $('tOutput');
	if (tOutput) {
		af.style.width = '28px';
		el.classList.add('altFadeOut');
		el.classList.remove('altFadeIn');
		to.style.visibility = 'hidden';
		outField = textField;
		tOutput = false;
	} else {
		af.style.width = '100%';
		el.classList.add('altFadeIn');
		el.classList.remove('altFadeOut');
		to.style.visibility = 'visible';
		outField = altField;
		tOutput = true;
	}
}

function updateHistory() {
	textField.dispatchEvent(new Event('input'));
}

function updateInput() {
	if (tOutput) tinyOutput.setContent(altField.value);
	tinyEditor.setContent(textField.value);
}

function undoButton() {
	if (undoHistory.undo(true) !== undefined && undoHistory.currentIndex > 1) {
		let sel = tinyEditor.getSelection();

		if (sel !== null) {
			let a = sel['col'];
			let b = textField.value.length;
			let c = undoHistory.undo(true).length;

			if (b >= c) sel['col'] = a - (b - c);
			else sel['col'] = a + (c - b);
		}
		textField.value = undoHistory.undo();
		updateInput();

		setTimeout(() => {
			TinyMde[0].focus();
			if (sel !== null && sel['col'] >= 0) tinyEditor.setSelection(sel);
		}, 1);
	}
}

function redoButton() {
	if (undoHistory.redo(true) !== undefined) {
		let sel = tinyEditor.getSelection();
		let b = textField.value.length;
		let c = undoHistory.redo(true).length;

		textField.value = undoHistory.redo();
		updateInput();

		if (sel !== null) {
			let a = sel['col'];

			if (c >= b) sel['col'] = a + (c - b);
			else sel['col'] = a + (b - c);

			setTimeout(() => {
				TinyMde[0].focus();
				if (sel !== null && sel['col'] >= 0) tinyEditor.setSelection(sel);
			}, 1);
		}
	}
}

document.onkeydown = KeyPressDown;
function KeyPressDown(e) {
	if (e.ctrlKey) {
		if (e.keyCode == 89 && e.target.id !== 'keyField' && e.target.id !== 'cipherField') redoButton(); // Y
		if (e.keyCode == 90 && e.target.id !== 'keyField' && e.target.id !== 'cipherField') undoButton(); // Z
		if (e.keyCode == 65) selectCount(); // a
	}

	if (e.key === 'Enter' && e.target.id == 'keyField') {
		massDecode();
		$('massDecode').animate([{ backgroundColor: 'var(--color1)' }, { backgroundColor: 'var(--color1-1a)' }], {
			duration: 900,
		});
	}

	if (e.target.classList[0] == 'TinyMDE' && e.key == 'Tab') {
		e.preventDefault();
		document.execCommand('insertText', false, '\t');
	}
}

tinyEditor.addEventListener('selection', e => {
	let st = `${e.focus ? e.focus.row : '–'} : ${e.focus ? e.focus.col : '–'}`;
	$('tSelect').innerHTML = st;
});

function selectCount() {
	setTimeout(() => (selectCounter.innerHTML = window.getSelection().toString().length), 1);
}

function selectReset(e) {
	if (e.button !== 0 || e.shiftKey) return;

	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
	selectCounter.innerHTML = '0';
}

function $(e) {
	return document.getElementById(e);
}

function copyMessageFrom() {
	if (!outField.value) return;
	cipherField.value = outField.value.trim();
}

function copyMessageTo() {
	if (!cipherField.value) return;
	updateHistory();
	textField.value += `\n${cipherField.value}`;
	updateInput();
}

function copyResults(id) {
	const resultField = $(id);
	if (!/\S/.test(resultField.value)) return;

	cipherField.animate([{ color: '#ffffff00' }, { color: '#ffffffc3' }], {
		duration: 280,
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
	return n.map(x => (+x).toString(2).padStart(8, 0)).join(' ');
}

function binToDecimal(n) {
	n = n.split(/\s+|\n/);
	return n.map(x => parseInt(x, 2)).join(' ');
}

function binFlip(txt) {
	return txt.replace(/(0)|1/g, (_, a) => (a ? '1' : '0'));
}

function fromOctal(n) {
	n = n.split(' ');
	if (n.length == 1) {
		n = n.toString().match(/.{1,3}/g);
	}
	return n.map(x => String.fromCharCode(parseInt(x.padStart(3, '0'), 8))).join('');
}

function xor(a, b) {
	if (!b) return;
	const res = [];
	const bin = isBinary(a);
	const hex = isHex(a);
	const dec = isNumSpaces(a);
	b = (b + a.substring(b.length)).split(' ');
	a = a.split(/[\s\n]/);

	if (bin) {
		res.push('Bin:');
		a.forEach((_, i) => res.push((parseInt(a[i], 2) ^ parseInt(b[i], 2)).toString(2).padStart(8, 0)));
	} else if (hex) {
		res.push('Hex:');
		a.forEach((_, i) =>
			res.push(
				Number(parseInt(a[i], 16) ^ parseInt(b[i], 16))
					.toString(16)
					.padStart(2, 0)
			)
		);
	} else if (dec) {
		res.push('Dec:');
		a.forEach((_, i) => res.push(a[i] ^ b[i]));
	} else {
		a = a.join('');
		b = b.join('');
		res.push('XOR:');
		[...a].forEach((_, i) => res.push((a.charCodeAt(i) ^ b.charCodeAt(i)).toString(16).padStart(2, 0)));
	}

	return res.join(' ');
}

function decodeBase64(base64) {
	const text = atob(base64);
	const length = text.length;
	const bytes = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		bytes[i] = text.charCodeAt(i);
	}
	return new TextDecoder().decode(bytes);
}

function parseB64(str) {
	try {
		if (/[^a-z0-9+/=\s]/gi.test(str)) return;
		const dec = atob(str);
		if (/[\x00-\x1F]/g.test(dec)) {
			// if theres control characters return Uint8Array as hex
			return [...dec].map(x => x.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
		} else {
			return decodeBase64(str);
		}
	} catch {
		return;
	}
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
	while (y < num) {
		z = x + y;
		x = y;
		y = z;
		res.push(z);
		i += 1;
	}
	return res;
}

function extractFibo(input) {
	input = input.split(/\s+|\n/);
	let fib = fibonacci(input.length);
	const res = [];

	fib.forEach(i => res.push(input[i - 1]));

	return res.filter(x => x !== undefined).join(' ');
}

const a1z26 = {
	enc(txt, m) {
		m = m || 1;
		txt = txt.toLowerCase();
		return [...txt]
			.map(x => {
				if (/[a-z]/.test(x)) return x.charCodeAt(0) - (97 - m) + ' ';
				else return x;
			})
			.join('')
			.replace(/\s+/g, ' ');
	},
	dec(txt, m) {
		m = m || 1;
		return txt
			.split(' ')
			.map(x => {
				if (x >= 0 && x <= 26) return String.fromCharCode(97 + (x - m));
				else return ' ' + x + ' ';
			})
			.join('')
			.replace(/\s+/g, ' ');
	},
};

// https://github.com/patrik-csak/BB26
const base26 = {
	enc(string, v) {
		let res = [];
		string
			.toUpperCase()
			.split(' ')
			.map(string => {
				if (!/[A-Z]/.test(string)) return;

				let number = 0;
				for (let i = 0; i < string.length; i++) {
					const char = string[string.length - i - 1];
					number += 26 ** i * charToDecimal(char, v);
				}
				res.push(number);
			});
		return res.join(' ').trim();
	},
	dec(number, v) {
		let res = [];
		number.split(' ').map(number => {
			let string = '';
			while (number > 0) {
				string = toChar(number % 26 || 26, v) + string;
				number = Math.floor((number - v) / 26);
			}
			res.push(string);
		});
		return res.join(' ').trim();
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
	if (!altField.value) return;
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
	const sValue = prompt('Split into segments of x length', '8');
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

padStart.onclick = () => {
	updateHistory();
	const input = textField.value.trim().split(' ');
	const len = prompt('Length', '2');
	if (len == null) return;
	const str = prompt('Fill String', '0');
	if (str == null) return;
	outField.value = input.map(x => x.padStart(len, str)).join(' ');
	updateInput();
};

padEnd.onclick = () => {
	updateHistory();
	const input = textField.value.trim().split(' ');
	const len = prompt('Length', '2');
	if (len == null) return;
	const str = prompt('Fill String', '0');
	if (str == null) return;

	outField.value = input.map(x => x.padEnd(len, str)).join(' ');
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
	if (input.length > 400000) return;
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
	const reg = /(?<=^| )[+-]?\d+([eE]?[+-]?\d+)?(\.\d+([eE]?[+-]?\d+)?)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
	let res = '';

	switch (op) {
		case 'reduce': {
			const x = input.match(/(\b[\d.]+\b)/g);
			outField.value = x.map(Number).reduce((a, b) => +a + +b, 0);
			return updateInput();
		}
	}

	res += input
		.split('\n')
		.map(line =>
			line
				.split(' ')
				.map(n => {
					if (reg.test(n)) {
						return calculate[op](+n, val);
					}
					return n;
				})
				.join(' ')
		)
		.join('\n');

	outField.value = res;
	updateInput();
};

calcOP.onchange = () => {
	var el = $('calcValue');
	if (calcOP.selectedIndex >= 7) el.hidden = true;
	else el.hidden = false;
};

btnBinaryFlip.onclick = () => {
	updateHistory();
	outField.value = binFlip(textField.value);
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
	outField.value = input.map((line, index) => `[${index.toString().padStart(2, '0')}] ${line}`).join('\n');
	updateInput();
};

btnFibonacci.onclick = () => {
	updateHistory();
	outField.value = extractFibo(textField.value);
	updateInput();
};

/* --------------------------------------------
	Misc
-------------------------------------------- */
function isMorse(txt) {
	return /^[.\\/s-]/.test(txt);
}

function isBinary(txt) {
	return /^[01\s]+$/.test(txt);
}

function isHex(txt) {
	return /^[0-9A-Fa-f\s]+$/.test(txt);
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
	const ctrlChars = /[\u0000-\u001F\u007F-\u009F]/g;
	const res = txt
		.toString()
		.replace(ctrlChars, '')
		.replace(/NaN/g, '')
		.replace(/^[?\s]*$/, '');
	return res.trim();
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
	max = max || 400000;
	if (str.length > max) {
		console.warn('Input length (', str.length, ') exceeds (', max, ') truncating to prevent browser from crashing.');
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
	if (isLettersAndSpaces(key)) {
		key = a1z26
			.enc(key)
			.split(' ')
			.map(x => x - 1)
			.join(' ');
	}
	key = key.split(' ');
	let size;

	if (key.length == 4) size = 2;
	else if (key.length >= 9) {
		size = 3;
		key = key.slice(0, 9);
	} else return;
	return to2dArray(key, size);
}

function charToDecimal(letter, v) {
	return letter.codePointAt(0) - 'A'.codePointAt(0) + v;
}

function toChar(number, v) {
	return String.fromCodePoint('A'.codePointAt(0) - v + number);
}

// Page resizer: https://stackoverflow.com/a/55202728
function dragElement(element, direction) {
	let md; // remember mouse down info
	const first = $('page_left');
	const second = $('page_right');

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
			second.style.transition = 'all 0.5s ease-in-out';
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
dragElement($('separator'), 'H');

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
	const dialogDiv = $('dialog');
	dialogDiv.style.opacity = '1';
	window.dialog.showModal();
}
window.onclick = function (event) {
	const dialogDiv = $('dialog');
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
	const bgElement = $('bgElement');
	bgElement.crossOrigin = `Anonymous`;
	bgElement.src = img;
	let hsl = [];

	bgElement.onload = function () {
		hsl = bgGetColor(bgElement);
		document.documentElement.style.setProperty('--h', hsl[0]);
		document.documentElement.style.setProperty('--s', hsl[1]);

		localStorage.setItem('usrbg', img);
		localStorage.setItem('h', hsl[0]);
		localStorage.setItem('s', hsl[1]);
	};
}

function bgGetColor(bgElement) {
	const rgb = colorThief.getColor(bgElement);
	const hsl = RGBToHSL(rgb[0], rgb[1], rgb[2]);
	const h = Math.round(hsl[0]);
	const s = Math.round(hsl[1]);
	return [h, `${s}%`];
}

function complementary(h, s) {
	h += s;
	h = calculate.mod(h, 180);
	return h;
}

function processImage(base64) {
	return new Promise((resolve, reject) => {
		document.documentElement.style.cursor = 'wait';
		setTimeout(() => {
			document.documentElement.style.cursor = 'default';
		}, 5000);
		const maxFileSize = 333666;
		const img = new Image();
		img.crossOrigin = `Anonymous`;
		img.onload = function () {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			let { width } = img;
			let { height } = img;
			let resizedBase64 = null;
			while (resizedBase64 == null) {
				console.log(`usrBG: ${width} x ${height}`);
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
			console.log(`Saved usrBG: ${width} x ${height}`);
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
	const imgURL = $('inputBgURL').value || dailyBG;
	const ext = /(.*?)\.(gif|webp|webm)/i;

	if (imgURL == dailyBG) {
		localStorage.setItem('random', 'true');
	} else {
		localStorage.removeItem('random');
	}

	if (ext.test(imgURL)) {
		bgSet(imgURL);
	} else processImage(imgURL).then(bgSet);
};

dialogFile.onchange = () => {
	const file = $('dialogFile').files[0];
	const imgFile = new FileReader();
	const ext = /(.*?)\.(gif|webp)/i;
	let baseString;

	imgFile.onloadend = function () {
		baseString = imgFile.result;
		localStorage.removeItem('random');

		if (ext.test(file.name) && baseString.length < 5000000) {
			bgSet(baseString);
		} else processImage(baseString).then(bgSet);
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
	$('resContainer').innerHTML = '';

	if (!isNumSpaces(key) && key != '') {
		result.Vigenere = Enigmator.vigenere.enc(txt, key);
		result.Autokey = Enigmator.autokey.enc(txt, key);
		result.Beaufort = Enigmator.beaufort.enc(txt, key);
		result.Simple_Substitution = Enigmator.substitution.enc(txt, key);
		result.Adfgvx = Enigmator.adfgvx.enc(txt, key);
		result.XOR_Cipher = Enigmator.xor.enc(txt, key);
		result.Columnar_Transposition = Boxentriq.ColumnarTransposition.enc(txt, key);
	}

	if (isNumSpaces(key)) {
		const k = key.split(' ');
		result.Affine = Enigmator.affine.enc(txt, k[0], k[1]);
	}

	if (isNumber(key)) {
		result.RailFence = Enigmator.railfence.enc(txt, key);
		result.Caesar = Enigmator.caesar(txt, 26 - calculate['mod'](key));
		result.Multiplicative = Cryptography.Multi.enc(txt, key);
	}

	if (isLettersAndSpaces(txt)) {
		result.Baconian = Enigmator.baconian.enc(txt, 1);
		result.Baconian_v2 = Enigmator.baconian.enc(txt, 2);
		result.Polybius = Cryptography.Polybius.enc(txt);
	}

	result.Hill = Enigmator.hill.enc(txt, hillParser(key));
	result.Playfair = Enigmator.playfair.enc(txt, key || '');
	result.A1z26 = a1z26.enc(txt, key);
	result.Atbash = Enigmator.atbash(txt);
	result.Phone = Cryptography.Phone.enc(txt);
	result.Morse = Enigmator.morse.enc(txt);
	result.Tapcode = Boxentriq.Tapcode.enc(txt);
	result.Tapcode_Dots = Boxentriq.Tapcode.enc(txt, 'dots');
	result.Goldbug = Enigmator.goldbug.enc(txt);
	result.Reversed = txt.split('').reverse().join('');

	if ($('encodings').checked) {
		result.Ascii = new TextEncoder().encode(txt).join(' ');
		result.Base64 = Enigmator.base64.enc(txt);
		result.Base32 = Enigmator.base32.enc(txt);
		result.Base26_0 = base26.enc(txt, 0);
		result.Base26_1 = base26.enc(txt, 1);
		result.Base16 = Enigmator.cryptanalysis.stringConvert.fromAscii(txt, 16);
		result.Octal = Enigmator.cryptanalysis.stringConvert
			.fromAscii(txt, 8)
			.match(/.{1,3}/g)
			.join('');
		result.Binary = toBinary(txt);
		result.Decimal_to_Binary = decToBinary(txt);
		result.xor = xor(txt, key);
		result.Binary_Flip = binFlip(txt.replace(/[^0-1 ]/g, '').replace(/\s\s+/g, ' '));
		result.Baudot_v1 = Boxentriq.baudot.enc(txt, 'v1');
		result.Baudot_v2 = Boxentriq.baudot.enc(txt, 'v2');
		result.UUEncoding = Enigmator.uuencoding.enc(txt);
		result.Ascii85 = Enigmator.ascii85.enc(txt);
		result.Rot47 = Enigmator.rot(txt, '47');
	}

	if ($('rotX').checked) {
		const times = 26;
		for (let i = 1; i < times; i++) {
			result[`Rot.${i}`] = Enigmator.caesar(txt, i);
		}
	}

	if ($('baseX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Base_${i}`] = CyberChef.base.enc(txt, i);
		}
	}

	if ($('charcodeX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Charcode_${i}`] = CyberChef.charcode.enc(txt, i);
		}
	}

	for (const i in result) {
		result[i] = removeInvalid(result[i]);
		if (!isEmpty(result[i]) && result[i] != txt)
			element += `<resId>${i.replaceAll('_', ' ')}</resId><resDiv><textarea id='${i}Res' class='resTxtArea' ondblclick='copyResults(this.id)' readonly>${result[i]}</textarea></resDiv>`;
	}
	$('resContainer').insertAdjacentHTML('beforeend', element);
}

function massDecode() {
	const txt = cipherField.value.trim();
	const key = keyField.value.trim();
	const result = {};
	let element = '';

	if (isEmpty(txt)) return;
	$('resContainer').innerHTML = '';

	if (key != '') {
		result.Vigenere = Enigmator.vigenere.dec(txt, key);
		result.Autokey = Enigmator.autokey.dec(txt, key);
		result.Beaufort = Enigmator.beaufort.enc(txt, key);
		result.Simple_Substitution = Enigmator.substitution.dec(txt, key);
		result.Adfgvx = Enigmator.adfgvx.dec(txt, key);
		result.XOR_Cipher = Enigmator.xor.dec(txt, key);
		result.Columnar_Transposition = Boxentriq.ColumnarTransposition.dec(txt, key);
		result.Hill = Enigmator.hill.dec(txt, hillParser(key));
	}

	if (isNumSpaces(key) && key.length > 2) {
		const k = key.split(' ');
		result.Affine = Enigmator.affine.dec(txt, k[0], k[1]);
	}

	if (isNumber(key)) {
		result.RailFence = Enigmator.railfence.dec(txt, key);
		result.Caesar = Enigmator.caesar(txt, key);
		result.Multiplicative = Cryptography.Multi.dec(txt, key);
	}

	if (isBacon(txt)) {
		result.Baconian = Enigmator.baconian.dec(txt, 1);
		result.Baconian_v2 = Enigmator.baconian.dec(txt, 2);
	}

	result.Playfair = Enigmator.playfair.dec(txt, key || '');
	result.A1z26 = a1z26.dec(txt, key);
	result.Atbash = Enigmator.atbash(txt);
	result.Goldbug = Enigmator.goldbug.dec(txt);
	result.Reversed = txt.split('').reverse().join('');
	result.Fibonacci = extractFibo(txt);

	if (isNumSpaces(txt)) {
		result.Phone = Cryptography.Phone.dec(txt);
		result.Tapcode = Boxentriq.Tapcode.dec(txt);
		result.Polybius = Cryptography.Polybius.dec(txt);
	}

	if (isMorse(txt)) {
		result.Morse = Enigmator.morse.dec(txt);
		result.Tapcode = Boxentriq.Tapcode.dec(txt, 'dots');
	}

	if ($('encodings').checked) {
		result.Ascii = String.fromCharCode.apply(this, txt.split(' '));
		result.Base64 = parseB64(txt);
		result.Base32 = Enigmator.base32.dec(txt);
		result.Base26_0 = base26.dec(txt, 0);
		result.Base26_1 = base26.dec(txt, 1);
		result.Base16 = Enigmator.base16.dec(txt);
		result.Octal = fromOctal(txt);
		result.Binary = fromBinary(txt);
		result.Binary_to_Decimal = binToDecimal(txt).replace(/\s\s+/g, '');
		result.xor = xor(txt, key);
		result.Binary_Flip = binFlip(txt.replace(/[^0-1 ]/g, '').replace(/\s\s+/g, ' '));
		result.Baudot_v1 = Boxentriq.baudot.dec(txt, 'v1');
		result.Baudot_v2 = Boxentriq.baudot.dec(txt, 'v2');
		result.UUEncoding = Enigmator.uuencoding.dec(txt);
		result.Ascii85 = Enigmator.ascii85.dec(txt);
		result.Rot47 = Enigmator.rot(txt, '47');
	}

	if ($('rotX').checked) {
		const times = 26;
		for (let i = 1; i < times; i++) {
			result[`Rot.${i}`] = Enigmator.caesar(txt, i);
		}
	}

	if ($('baseX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Base_${i}`] = CyberChef.base.dec(txt, i);
		}
	}

	if ($('charcodeX').checked) {
		const times = 37;
		for (let i = 2; i < times; i++) {
			result[`Charcode_${i}`] = CyberChef.charcode.dec(txt, i);
		}
	}

	for (const i in result) {
		result[i] = removeInvalid(result[i]);
		if (!isEmpty(result[i]) && result[i] != txt)
			element += `<resId>${i.replaceAll('_', ' ')}</resId><resDiv><textarea id='${i}Res' class='resTxtArea' ondblclick='copyResults(this.id)' readonly>${result[i]}</textarea></resDiv>`;
	}
	$('resContainer').insertAdjacentHTML('beforeend', element);
}
