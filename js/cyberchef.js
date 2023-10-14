//  Credits:
//  https://github.com/gchq/CyberChef/

var CyberChef = {

	charcode: {
		enc: function (input, args) {
			const delim = ' ',
				base = args;
			let output = "",
				padding,
				ordinal;

			const charcode = CyberChef.utils.strToCharcode(input);
			for (let i = 0; i < charcode.length; i++) {
				ordinal = charcode[i];

				if (base === 16) {
					if (ordinal < 256) padding = 2;
					else if (ordinal < 65536) padding = 4;
					else if (ordinal < 16777216) padding = 6;
					else if (ordinal < 4294967296) padding = 8;
					else padding = 2;

					output += CyberChef.utils.hex(ordinal, padding) + delim;
				} else {
					output += ordinal.toString(base) + delim;
				}
			}

			return output.slice(0, -delim.length);
		},

		dec: function (input, base) {
			let bites = input.split(' '),
				i = 0;
			// Split into groups of 2 if the whole string is concatenated and
			// too long to be a single character
			if (bites.length === 1 && input.length > 17) {
				bites = [];
				for (i = 0; i < input.length; i += 2) {
					bites.push(input.slice(i, i + 2));
				}
			}

			let res = "";
			for (i = 0; i < bites.length; i++) {
				res += CyberChef.utils.chr(parseInt(bites[i], base));
			}
			return res;
		}
	},

	base: {
		/* ------------------------------------
		    Not really from CyberChef
		    Its here for organization sake
		------------------------------------- */
		enc: function (input, radix) {
			input = input.trim().split(' ');
			return input.map(x => Math.abs(x).toString(radix)).join(' ');
		},

		dec: function (input, radix) {
			input = input.trim().split(' ');
			return input.map(x => parseInt(x, radix)).join(' ');
		}
	},

	utils: {
		chr: function (str) {
			if (str > 0xffff) {
				str -= 0x10000;
				const high = String.fromCharCode(str >>> 10 & 0x3ff | 0xd800);
				str = 0xdc00 | str & 0x3ff;
				return high + String.fromCharCode(str);
			}

			return String.fromCharCode(str);
		},

		strToCharcode: function (str) {
			if (!str) return [];
			const charcode = [];

			for (let i = 0; i < str.length; i++) {
				let ord = str.charCodeAt(i);

				// Detect and merge astral symbols
				if (i < str.length - 1 && ord >= 0xd800 && ord < 0xdc00) {
					const low = str[i + 1].charCodeAt(0);
					if (low >= 0xdc00 && low < 0xe000) {
						ord = this.ord(str[i] + str[++i]);
					}
				}

				charcode.push(ord);
			}

			return charcode;
		},

		hex: function (c, length = 2) {
			c = typeof c == "string" ? this.ord(c) : c;
			return c.toString(16).padStart(length, "0");
		},
		ord: function (c) {
			// Detect astral symbols
			// Thanks to @mathiasbynens for this solution
			// https://mathiasbynens.be/notes/javascript-unicode
			if (c.length === 2) {
				const high = c.charCodeAt(0);
				const low = c.charCodeAt(1);
				if (high >= 0xd800 && high < 0xdc00 &&
					low >= 0xdc00 && low < 0xe000) {
					return (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
				}
			}

			return c.charCodeAt(0);
		}
	}
}