//  Credit:
//  https://github.com/maitreyeepaliwal/Cryptography-Ciphers

var Cryptography = {
	Phone: {
		enc: function (message) {
		const final = [];
		const split = message.split('');
		for (let i = 0; i < split.length; i++) {
			const char = split[i].toUpperCase();
			if (phoneOrig.includes(char)) {
			const index = phoneOrig.indexOf(char);
			final.push(phoneCipher[index]);
			} else {
			final.push(char);
			}
		}
		return final.join('').replace(/\s+/g, ' ').trim();
		},

		dec: function (message,isTitleCase = true) {
		const final = [];
		const split = message.split('');
		let charGroup = [];
		for (let i = 0; i < split.length; i++) {
			const char = split[i].toUpperCase();
			if (/[1-9]/.test(char)) {
			if (charGroup.length === 1) {
				charGroup.push(char)
				const index = phoneCipher.indexOf(charGroup.join(''));
				final.push(phoneOrig[index]);
				charGroup = [];
			} else {
				charGroup.push(char);
			}
			} else {
			final.push(char);
			}
		}
		return final.join('').replace(/\s+/g, ' ').trim();
		}
	},

    RunningKey: {
        enc: function(txt, key) {
            txt = txt.toLowerCase().replace(/[^a-z]/g, "");
            key = key.toLowerCase().replace(/[^a-z]/g, "");
            // if(key.length <= txt.length){ return "key stream should be at least as long as plaintext"; }
            result="";
            for(i=0; i<txt.length; i++){
                result += String.fromCharCode((((txt.charCodeAt(i)-97) + (key.charCodeAt(i%key.length)-97)+26)%26)+97);
            }
            return result;
        },

        dec: function(txt, key){
            txt = txt.toLowerCase().replace(/[^a-z]/g, "");
            key = key.toLowerCase().replace(/[^a-z]/g, "");
            // if(key.length <= txt.length){ return "key stream should be at least as long as ciphertext" }
            result="";
            for(i=0; i<txt.length; i++){
                result += String.fromCharCode((((txt.charCodeAt(i)-97) - (key.charCodeAt(i%key.length)-97)+26)%26)+97);
            }
            return result;
        }
    },

    Vernam: {
        enc: function(txt, key) {
            var output = "";
            let nText = []
            let kText = []
            for (let i of txt) {
                nText.push(alphabetArray.indexOf(i.toLowerCase()))
            }

            for (let i of key) {
                kText.push(alphabetArray.indexOf(i.toLowerCase()))
            }

            for (let i in nText) {
                output += alphabetArray[(nText[i] + kText[i]) % 26]
            }
            return output;
        },

        dec: function(txt, key) {
            var output = "";
            let nText = []
            let kText = []
            for (let i of txt) {
                nText.push(alphabetArray.indexOf(i.toLowerCase()))
            }
            for (let i of key) {
                kText.push(alphabetArray.indexOf(i.toLowerCase()))
            }
            let out = ""
            for (let i in nText) {
                output += alphabetArray[(nText[i] - kText[i]) < 0 ? 26 + (nText[i] - kText[i]) : (nText[i] - kText[i]) % 26]
            }
            return output;
        }
    },

    Multi: {
        enc: function(plainText, key) {
            var alphabet=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            pTextChar=plainText.toUpperCase().split("");
            cipherText="";
            for (var i=0; i<plainText.length; i++)
                if (pTextChar[i].match("[a-z]|[A-Z]"))
                    {
                        pTextChar[i]=alphabet.indexOf(pTextChar[i]);
                        cipherText+=(alphabet[(pTextChar[i]*key).mod(26)]);
                    }
                else    cipherText+=plainText[i];
            return (cipherText);
        },

        dec: function(cipherText, key) {
            var alphabet=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
            cTextChar=cipherText.toLowerCase().split("");
            plainText="";

            if (GCD(key,26)!=1) return("Cannot decrypt!");

            var invKey=findInverse(key,26);

            for (var i=0; i<cipherText.length; i++)
                if (cTextChar[i].match("[a-z]|[A-Z]"))
                    {
                        cTextChar[i]=alphabet.indexOf(cTextChar[i]);
                        plainText+=(alphabet[(invKey*cTextChar[i]).mod(26)]);
                    }
                else    plainText+=cipherText[i];

            return (plainText);
        }
    },

    Polybius: {
        enc: function(input) {
            let result = '';
            let finalResult = [];
            input.toLowerCase().split(' ').forEach(word => {
                word.split('').forEach(character => {
                    if (character.match(/([^a-z\s])/g)) {
                        result;
                    } else {
                        polyAlphabet.forEach(match => match.char === character ? result += match.pos : result);
                    }
                });
                finalResult.push(result);
                result = '';
            });
            return finalResult.join(' ');
        },

        dec: function(input) {
            let result = '';
            let finalResult = [];
            if (input.split(' ').join('').length % 2 !== 0) return false;

            input.replace(/\s/g, '').split(' ').forEach(decryptedWord => {
                decryptedWord.match(/\d{1,2}/g).forEach(num => {
                    if (parseInt(num) === 42) {
                        result += `(i/j)`;
                    } else {
                        polyAlphabet.forEach(match => parseInt(num) === match.pos ? result += match.char : result);
                    }
                });
                finalResult.push(result);
                result = '';
            });
            return finalResult.join(' ');
        }
    }
}

// Phone cipher thingies
const phoneCipher = ['21','22','23','31','32','33','41','42','43','51','52','53','61','62','63','71','72','73','74','81','82','83','91','92','93','94'];
const phoneOrig = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function titleCase(str = '') {
    return str.toLowerCase().split(' ').map(word => {
      return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    }).join(' ');
}

const alphabetArray = "abcdefghijklmnopqrstuvwxyz".split("")

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}
function GCD( a, b) {
    return b ? GCD(b, a % b) : a;
}
function findInverse(x, z) {
    var i=1;
    while (((x*i)%z)!=1) {
        i++;
    }
    return i;
}

const polyAlphabet = [
    { char: 'a', pos: 11 }, { char: 'b', pos: 21 }, { char: 'c', pos: 31 }, { char: 'd', pos: 41 }, { char: 'e', pos: 51 },
    { char: 'f', pos: 12 }, { char: 'g', pos: 22 }, { char: 'h', pos: 32 }, { char: 'i', pos: 42 }, { char: 'j', pos: 42 }, { char: 'k', pos: 52 },
    { char: 'l', pos: 13 }, { char: 'm', pos: 23 }, { char: 'n', pos: 33 }, { char: 'o', pos: 43 }, { char: 'p', pos: 53 },
    { char: 'q', pos: 14 }, { char: 'r', pos: 24 }, { char: 's', pos: 34 }, { char: 't', pos: 44 }, { char: 'u', pos: 54 },
    { char: 'v', pos: 15 }, { char: 'w', pos: 25 }, { char: 'x', pos: 35 }, { char: 'y', pos: 45 }, { char: 'z', pos: 55 }
];