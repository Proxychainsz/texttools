/*-----------------------------------------------
*	Enigmator v0.1.23
*	Written by : Merricx
*   _modern ciphers
-----------------------------------------------*/

var Enigmator = {
	/*-----------------------------------------------
		AES (Rijndael)
		Require :
		- CryptoJS rollups/aes.js
	-----------------------------------------------*/
	aes: {
		enc(text, key, cipherMode, iv) {
			var mode;
			var str;
			cipherMode = cipherMode || 'CBC';

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Hex.parse(padKey(key));
				iv = CryptoJS.enc.Hex.parse(padIV(iv));

				str = CryptoJS.AES.encrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.AES.encrypt(text, key, { mode: mode });
			}

			return str;
		},

		dec(text, key, cipherMode, iv) {
			var mode;
			var str;
			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;
			else mode = CryptoJS.mode.CBC;

			if (iv !== undefined) {
				key = CryptoJS.enc.Hex.parse(padKey(key));
				iv = CryptoJS.enc.Hex.parse(padIV(iv));
				str = CryptoJS.AES.decrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.AES.decrypt(text, key, { mode: mode });
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	/*-----------------------------------------------
		RSA
		Require :
		- jsencrypt.js
	-----------------------------------------------*/
	rsa: {
		generateKeys(keySize) {
			keySize = parseInt(keySize);
			var rsa = new JSEncrypt({ default_key_size: keySize });

			rsa.getKey();
			let key = { privKey: null, pubKey: null };
			key.privKey = rsa.getPrivateKey();
			key.pubKey = rsa.getPublicKey();
			return key;
		},

		setKey(p, q, e) {
			var rsa = new JSEncrypt();
			var key = {};
			if (rsa.setManualKey(p, q, e)) {
				key.pubKey = rsa.getPublicKey();
				key.privKey = rsa.getPrivateKey();
			}
			return key;
		},

		getPublicKey(privKey) {
			var rsa = new JSEncrypt();
			return rsa.getPublicKey();
		},

		getRawKey(key, radix) {
			var rsa = new JSEncrypt();
			rsa.setKey(key);
			return rsa.getRawKey();
		},

		enc(text, key) {
			var rsa = new JSEncrypt();
			rsa.setKey(key);

			return rsa.encrypt(text);
		},

		dec(text, privKey) {
			var rsa = new JSEncrypt();
			rsa.setPrivateKey(privKey);

			return rsa.decrypt(text);
		},
	},

	/*-----------------------------------------------
		DES
		Require :
		- CryptoJS rollups/tripledes.js
	-----------------------------------------------*/
	des: {
		enc(text, key, cipherMode, iv) {
			var mode;
			var str;
			cipherMode = cipherMode || 'CBC';

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.DES.encrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.DES.encrypt(text, key, { mode: mode });
			}

			return str;
		},

		dec(text, key, cipherMode, iv) {
			var mode;
			var str;
			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;
			else mode = CryptoJS.mode.CBC;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.DES.decrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.DES.decrypt(text, key, { mode: mode });
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	/*-----------------------------------------------
		TripleDES
		Require :
		- CryptoJS rollups/tripledes.js
	-----------------------------------------------*/
	tripledes: {
		enc(text, key, cipherMode, iv) {
			var mode;
			var str;
			cipherMode = cipherMode || 'CBC';

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.TripleDES.encrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.TripleDES.encrypt(text, key, { mode: mode });
			}

			return str;
		},

		dec(text, key, cipherMode, iv) {
			var mode;
			var str;
			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;
			else mode = CryptoJS.mode.CBC;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.TripleDES.decrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.TripleDES.decrypt(text, key, { mode: mode });
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	/*-----------------------------------------------
		Blowfish
		Require :
		- blowfish.js
	-----------------------------------------------*/
	blowfish: {
		enc(text, key, iv, cipherMode) {
			var mode;
			var str;
			if (iv == undefined) iv = 0;

			if (cipherMode == 'CBC') mode = 1;
			else if (cipherMode == 'ECB') mode = 0;
			else if (cipherMode == 'CFB') mode = 3;
			else if (cipherMode == 'CTR') mode = 5;
			else if (cipherMode == 'OFB') mode = 4;
			else mode = 1;

			blowfish.setIV(iv, 1);
			str = blowfish.encrypt(text, key, { outputType: 4, cipherMode: mode });
			return str;
		},

		dec(text, key, iv, cipherMode) {
			var mode;
			var str;
			if (iv == undefined) iv = 0;

			if (cipherMode == 'CBC') mode = 1;
			else if (cipherMode == 'ECB') mode = 0;
			else if (cipherMode == 'CFB') mode = 3;
			else if (cipherMode == 'CTR') mode = 5;
			else if (cipherMode == 'OFB') mode = 4;
			else mode = 1;

			blowfish.setIV(iv, 1);
			str = blowfish.decrypt(text, key, { outputType: 4, cipherMode: mode });
			return str;
		},
	},

	/*-----------------------------------------------
		RC4
		Require :
		- CryptoJS rollups/rc4.js
	-----------------------------------------------*/
	rc4: {
		enc(text, key, cipherMode, iv) {
			cipherMode = cipherMode || 'CBC';
			var mode;
			var str;

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.RC4.encrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.RC4.encrypt(text, key);
			}

			return str;
		},

		dec(text, key, cipherMode, iv) {
			cipherMode = cipherMode || 'CBC';
			var mode;
			var str;

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.RC4.decrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.RC4.decrypt(text, key);
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	rc4drop: {
		enc(text, key, cipherMode, dropBytes, iv) {
			cipherMode = cipherMode || 'CBC';
			var mode;
			var str;

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.RC4Drop.encrypt(text, key, { drop: dropBytes, iv: iv, mode: mode });
			} else {
				str = CryptoJS.RC4Drop.encrypt(text, key, { drop: dropBytes });
			}

			return str;
		},

		dec(text, key, cipherMode, dropBytes, iv) {
			cipherMode = cipherMode || 'CBC';
			var mode;
			var str;

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.RC4Drop.decrypt(text, key, { drop: dropBytes, iv: iv, mode: mode });
			} else {
				str = CryptoJS.RC4Drop.decrypt(text, key, { drop: dropBytes });
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	/*-----------------------------------------------
		Rabbit
		Require :
		- CryptoJS	rollups/rabbit.js
	-----------------------------------------------*/
	rabbit: {
		enc(text, key, cipherMode, iv) {
			cipherMode = cipherMode || 'CBC';
			var mode;
			var str;

			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.Rabbit.encrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.Rabbit.encrypt(text, key, { mode: mode });
			}

			return str;
		},

		dec(text, key, cipherMode, iv) {
			var mode;
			var str;
			if (cipherMode == 'CBC') mode = CryptoJS.mode.CBC;
			else if (cipherMode == 'ECB') mode = CryptoJS.mode.ECB;
			else if (cipherMode == 'CFB') mode = CryptoJS.mode.CFB;
			else if (cipherMode == 'CTR') mode = CryptoJS.mode.CTR;
			else if (cipherMode == 'OFB') mode = CryptoJS.mode.OFB;
			else mode = CryptoJS.mode.CBC;

			if (iv !== undefined) {
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				str = CryptoJS.Rabbit.decrypt(text, key, { iv: iv, mode: mode });
			} else {
				str = CryptoJS.Rabbit.decrypt(text, key, { mode: mode });
			}

			return str.toString(CryptoJS.enc.Latin1);
		},
	},

	/*-----------------------------------------------
		MD4
		Require :
		- md4.js
	-----------------------------------------------*/
	md4(text, hmac) {
		hmac = hmac || null;
		var hash;

		if (hmac == null) hash = hex_md4(text);
		else hash = hex_hmac_md4(hmac, text);
		return hash;
	},

	/*-----------------------------------------------
		MD5
		Require :
		- CryptoJS rollups/md5.js
		- CryptoJS rollups/hmac-md5.js
	-----------------------------------------------*/
	md5(text, hmac) {
		hmac = hmac || null;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.MD5(str);
		else hash = CryptoJS.HmacMD5(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-1
		Require :
		- CryptoJS rollups/sha1.js
		- CryptoJS rollups/hmac-sha1.js
	-----------------------------------------------*/
	sha1(text, hmac) {
		hmac = hmac || null;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.SHA1(str);
		else hash = CryptoJS.HmacSHA1(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-256
		Require :
		- CryptoJS rollups/sha256.js
		- CryptoJS rollups/hmac-sha256.js
	-----------------------------------------------*/
	sha256(text, hmac) {
		hmac = hmac || null;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.SHA256(str);
		else hash = CryptoJS.HmacSHA256(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-512
		Require :
		- CryptoJS rollups/sha512.js
		- CryptoJS rollups/hmac-sha512.js
	-----------------------------------------------*/
	sha512(text, hmac) {
		hmac = hmac || null;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.SHA512(str);
		else hash = CryptoJS.HmacSHA512(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-3
		Require :
		- CryptoJS rollups/sha3.js
		- CryptoJS rollups/hmac-sha3.js
	-----------------------------------------------*/
	sha3(text, length, hmac) {
		hmac = hmac || null;
		length = length || 512;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.SHA3(str, { outputLength: length });
		else hash = CryptoJS.HmacSHA3(str, hmac, { outputLength: length });
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		RIPEMD-160
		Require :
		- CryptoJS rollups/ripemd160.js
		- CryptoJS rollups/hmac-ripemd160.js
	-----------------------------------------------*/
	ripemd160(text, hmac) {
		hmac = hmac || null;
		var hash;

		var str = CryptoJS.enc.Latin1.parse(text);

		if (hmac == null) hash = CryptoJS.RIPEMD160(str);
		else hash = CryptoJS.HmacRIPEMD160(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},
};

/*********************************************

    Some useful function used in Enigmator

**********************************************/

function padKey(key) {
	key = key.replace(/[^0-9a-f]/gi, '');

	if (key.length == 32 || key.length == 48 || key.length == 64) {
		return key;
	} else if (key.length > 64) {
		key = key.slice(0, 64);
	} else {
		while (key.length < 64) key += '0';
	}

	return key;
}

function padIV(iv, bf) {
	iv = iv.replace(/[^0-9a-f]/gi, '');

	var len = 32;
	if (bf) len = 16;

	if (iv.length < len) {
		while (iv.length < len) iv += '0';
	} else if (iv.length > len) {
		iv = iv.slice(0, len);
	}

	return iv;
}
