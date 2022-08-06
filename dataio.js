import language from './language/language.js';

export let geturl = window.parent.url2obj();

export let savedata = new (function (obj, check, decode, encode) {
	for (let key in obj) {
		let value = obj[key];
		let ck = getCookie(key);
		let cf = check[key];
		let df = key in decode ? decode[key] : d => d;
		if (key in geturl && cf(geturl[key])) {
			value = df(geturl[key]);
		} else if (cf(ck)) {
			value = df(ck);
		}
		let ef = key in encode ? encode[key] : d => d;
		setCookie(key, ef(value));
		Object.defineProperty(this, key, {
			set(_value) {
				value = _value;
				setCookie(key, ef(_value));
			},
			get() {
				return value;
			}
		});
	}
	window.parent.obj2url({});
})({
	lang: 'zh-Hant',
	mod: 'number',
	len: 4,
	delay: 0,
	soundeffect: false,
	imgsrc: ''
}, {
	lang: lang => lang in language.list,
	mod: mod => ['number', 'coordinate', 'hostimage', 'netimage'].indexOf(mod) != -1,
	len: len => !isNaN(len) && len >= 3 && len <= 10,
	delay: delay => !isNaN(delay) && delay >= 0 && delay <= 1000,
	soundeffect: soundeffect => soundeffect == 'true' || soundeffect == 'false',
	imgsrc: imgsrc => imgsrc != ''
}, {
	len: len => Number(len),
	delay: delay => Number(delay),
	soundeffect: soundeffect => soundeffect == 'true',
	imgsrc: imgsrc => decodeURIComponent(imgsrc)
}, {
	imgsrc: imgsrc => encodeURIComponent(imgsrc)
});

export let setdata = new (function (obj, sfs) {
	for (let key in obj) {
		let value = obj[key];
		let sf = sfs[key];
		Object.defineProperty(this, key, {
			set(_value) {
				value = _value;
				sf(_value);
			},
			get() {
				return value;
			}
		});
	}
})({
	lang: 'zh-Hant',
	len: 4,
	delay: 0
}, {
	async lang(lang) {
		await language.setting(lang);

		let reg = language.reg[lang];
		window.parent.document.title = reg.imgpuzzle;
		setting.value = reg.setting;
		random.value = reg.random;
		reset.value = reg.reset;
		full.value = reg.full;
		spanlanguage.innerHTML = reg.languagesetting;
		spanlen.innerHTML = reg.len;
		spandelay.innerHTML = reg.delay;
		spansoundeffect.innerHTML = reg.soundeffect;
		spanmod.innerHTML = reg.mod;
		spannetimage.innerHTML = reg.imgsrc;
		author.innerHTML = reg.spanauthor + reg.author;
		provider.innerHTML = reg.spanprovider + reg.provider;
		determine.value = reg.determine;
		cancel.value = reg.cancel;

		setdata.len = setdata.len;
		setdata.delay = setdata.delay;

		let nowmodoption = nowmod.querySelectorAll("option");
		nowmodoption[0].innerHTML = reg.number;
		nowmodoption[1].innerHTML = reg.coordinate;
		nowmodoption[2].innerHTML = reg.hostimage;
		nowmodoption[3].innerHTML = reg.netimage;

		document.body.style.setProperty('--font-size', reg.fontsize);
	},
	len(len) {
		let reg = language.reg[setdata.lang];
		nowlen.innerHTML = len * len - 1 + reg.unit + reg.frontbracket + len + reg.time + len + reg.backbracket;
	},
	delay(delay) {
		let reg = language.reg[setdata.lang];
		nowdelay.innerHTML = delay + reg.ms;
	}
});

export let imgdata = {
	src: '',
	width: 0,
	height: 0,
	maximum: 0,
	x: 0,
	y: 0,
	async checkandsetdata(url) {
		let data = {};
		[data.width, data.height] = await getimgsize(url);
		if (data.width == -1 || data.height == -1) {
			throw 'error';
		}
		this.src = url;
		this.width = data.width;
		this.height = data.height;
		this.maximum = Math.max(data.width, data.height);
	}
};
