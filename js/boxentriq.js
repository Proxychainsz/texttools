//  Credits:
//  https://www.boxentriq.com/code-breaking/tap-code

var Boxentriq = {
	Tapcode: {
		enc(txt, mode) {
			var src = txt.toLowerCase();
			var codeType = mode || '';
			var dst = '';

			for (let i = 0; i < src.length; i++) {
				var letter = src[i];
				if (letter == ' ') {
					if (codeType == 'dots') dst += '/ ';
					else dst += ' ';
				} else {
					var code = this.letterToPos(src[i]);
					if (code != null) {
						if (codeType == 'dots') dst += this.numToDots(code.row) + ' ' + this.numToDots(code.col) + '  ';
						else dst += code.row.toString() + code.col.toString() + ' ';
					}
				}
			}
			return dst.trim();
		},

		dec(txt, mode) {
			var src = txt.toLowerCase();
			var codeType = mode || '';
			var dst = '';

			var matches;
			if (codeType == 'dots') matches = src.match(/\.+/g);
			else matches = src.match(/\d/g);

			if (matches != null) {
				for (let i = 0; i < matches.length - 1; i += 2) {
					let l1 = matches[i];
					let l2 = matches[i + 1];
					if (codeType == 'dots') dst += this.posToLetter(this.dotsToNum(l1), this.dotsToNum(l2));
					else dst += this.posToLetter(parseInt(l1), parseInt(l2));
				}
			}
			return dst;
		},

		letterToPos(letter) {
			if (letter == 'k') letter = 'c';

			var pos = 'abcdefghijlmnopqrstuvwxyz'.indexOf(letter);
			if (pos != -1) return { row: Math.floor(pos / 5) + 1, col: (pos % 5) + 1 };
			else return null;
		},

		posToLetter(row, col) {
			if (row < 1) row = 1;
			else if (row > 5) row = 5;
			if (col < 1) col = 1;
			else if (col > 5) col = 5;
			var pos = (row - 1) * 5 + col - 1;
			return 'abcdefghijlmnopqrstuvwxyz'[pos];
		},

		numToDots(num) {
			return '.'.repeat(num);
		},

		dotsToNum(dots) {
			var i;
			for (i = 0; i < dots.length && dots[i] == '.'; i++);
			return i;
		},
	},

	ColumnarTransposition: {
		enc: function (src, key) {
			var columnorder = this.getColumnOrder(key);

			var columns = Array(key.length).fill('');
			for (let i = 0; i < src.length; i++) {
				columns[i % key.length] += src[i];
			}

			var dst = '';

			for (let i = 0; i < key.length; i++) {
				dst += columns[columnorder[i]];
			}

			var grid = this.generateGrid(key, columns, columnorder);

			return dst;
		},

		dec: function (src, key) {
			var columnorder = this.getColumnOrder(key);

			var p = 0;
			var columns = Array(key.length).fill('');
			for (let i = 0; i < key.length; i++) {
				let k = columnorder[i];
				let l = Math.floor(src.length / key.length);
				if (k < src.length % key.length) l++;
				columns[k] = src.slice(p, p + l);
				p += l;
			}

			var dst = '';
			for (let i = 0; i < src.length; i++) {
				let k = i % key.length;
				dst += columns[k][Math.floor(i / key.length)];
			}

			var grid = this.generateGrid(key, columns, columnorder);

			return dst;
		},

		getColumnOrder: function (key) {
			var sortedkey = key.split('').sort().join('');
			var columnorder = Array(key.length);
			var columnorder2 = Array(key.length);
			var p = 0;
			var pch = '';
			for (let i = 0; i < sortedkey.length; i++) {
				if (pch != sortedkey[i]) p = 0;
				pch = sortedkey[i];
				p = key.indexOf(pch, p);
				columnorder[i] = p;
				columnorder2[p] = i;
				p++;
			}

			return columnorder;
		},

		getInverseColumnOrder: function (columnorder) {
			var columnorder2 = Array(columnorder.length);
			for (let i = 0; i < columnorder.length; i++) {
				columnorder2[columnorder[i]] = i;
			}

			return columnorder2;
		},

		generateGrid: function (key, columns, columnorder) {
			var grid = '';
			var columnorder2 = this.getInverseColumnOrder(columnorder);

			for (let i = 0; i < key.length; i++) {
				grid += ' ' + key[i] + ' ';
			}
			grid += '\r\n';
			for (let i = 0; i < key.length; i++) {
				grid += (' ' + (columnorder2[i] + 1).toString()).slice(-2) + ' ';
			}
			grid += '\r\n';
			for (let i = 0; i < columns[0].length; i++) {
				for (let j = 0; j < key.length; j++) {
					if (i < columns[j].length) grid += ' ' + columns[j][i] + ' ';
				}
				grid += '\r\n';
			}

			return grid;
		},
	},

	baudot: {
		letters1: ['*NUL*', 'A', 'E', '\r', 'Y', 'U', 'I', 'O', '*FIGURES*', 'J', 'G', 'H', 'B', 'C', 'F', 'D', ' ', '\n', 'X', 'Z', 'S', 'T', 'W', 'V', '*DEL*', 'K', 'M', 'L', 'R', 'Q', 'N', 'P'],
		figures1: ['*NUL*', '1', '2', '\r', '3', '4', '', '5', ' ', '6', '7', '+', '8', '9', '', '0', '*LETTERS*', '\n', ',', ':', '.', '', '?', "'", '*DEL*', '(', ')', '=', '-', '/', '', '%'],
		letters2: ['*NUL*', 'E', '\n', 'A', ' ', 'S', 'I', 'U', '\r', 'D', 'R', 'J', 'N', 'F', 'C', 'K', 'T', 'Z', 'L', 'W', 'H', 'Y', 'P', 'Q', 'O', 'B', 'G', '*FIGURES*', 'M', 'X', 'V', '*LETTERS*'],
		figures2: ['*NUL*', '3', '\n', '-', ' ', "'", '8', '7', '\r', '*ENQUIRY*', '4', '*BELL*', ',', '!', ':', '(', '5', '+', ')', '2', '$', '6', '0', '1', '9', '?', '&', '*FIGURES*', '.', '/', ';', '*LETTERS*'],

		enc(src, variant) {
			var letters = variant == 'v1' ? this.letters1 : this.letters2;
			var figures = variant == 'v1' ? this.figures1 : this.figures2;
			var figureMode = false;
			var switchToLetters = variant == 'v1' ? '10000' : '11111';
			var switchToFigures = variant == 'v1' ? '01000' : '11011';

			var dst = '';
			var sep = '';
			for (var i = 0; i < src.length; i++) {
				var index = letters.indexOf(src[i].toUpperCase());
				if (index != -1) {
					if (figureMode) {
						figureMode = false;
						dst += sep + switchToLetters + ' ';
						sep = ' ';
					}
				} else {
					index = figures.indexOf(src[i].toUpperCase());
					if (index != -1) {
						if (!figureMode) {
							figureMode = true;
							dst += sep + switchToFigures + ' ';
							sep = ' ';
						}
					}
				}

				if (index != -1) {
					dst += sep + ('0000' + index.toString(2)).slice(-5);
					sep = ' ';
				}
			}

			return dst;
		},

		dec(src, variant) {
			var letters = variant == 'v1' ? this.letters1 : this.letters2;
			var figures = variant == 'v1' ? this.figures1 : this.figures2;
			var switchToLetters = variant == 'v1' ? 16 : 31;
			var switchToFigures = variant == 'v1' ? 8 : 27;
			var dst = '';
			var figureMode = false;

			src = src.replace(/[^01]+/g, '');
			for (var i = 0; i + 5 <= src.length; i += 5) {
				var index = parseInt(src.substr(i, 5), 2);
				if (index == switchToFigures) figureMode = true;
				else if (index == switchToLetters) figureMode = false;
				else {
					if (figureMode) dst += figures[index];
					else dst += letters[index];
				}
			}

			return dst;
		},
	},
};
