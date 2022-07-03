var geturl = window.parent.url2array();

var sw;

var savedata = new (function (obj, check, decode, encode) {
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
	window.parent.array2url({});
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

var setdata = new (function (obj, sfs) {
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

var imgdata = {
	src: '',
	width: 0,
	height: 0,
	maximum: 0,
	x: 0,
	y: 0,
	async checkandsetdata(url) {
		let data = {};
		[data.width, data.height] = await promisearr(getimgsize, url);
		if (data.width == -1 || data.height == -1) {
			throw 'error';
		}
		this.src = url;
		this.width = data.width;
		this.height = data.height;
		this.maximum = Math.max(data.width, data.height);
	}
};

var direction = {
	'ArrowLeft': { x: 1, y: 0 },
	'ArrowUp': { x: 0, y: 1 },
	'ArrowRight': { x: -1, y: 0 },
	'ArrowDown': { x: 0, y: -1 }
};

var soundeffect = {
	move: new Audio(),
	warning: new Audio(),
	initial: () => {
		loadsound('soundeffect/move.wav', (src) => {
			soundeffect.move.src = src;
		});
		loadsound('soundeffect/warning.wav', (src) => {
			soundeffect.warning.src = src;
		});
	},
	play: (ismove) => {
		if (savedata.soundeffect == false)
			return;
		if (ismove) {
			soundeffect.move.currentTime = 0;
			soundeffect.move.play();
		} else {
			soundeffect.warning.currentTime = 0;
			soundeffect.warning.play();
		}
	}
};

function nowmodonchange() {
	let callback = (a, b, c) => {
		spanhostimage.style.zIndex = a;
		hostfile.style.opacity = b;
		hostfile.style.zIndex = b;
		spannetimage.style.opacity = c;
		spannetimage.style.zIndex = c;
		netfile.style.opacity = c;
		netfile.style.zIndex = c;
	};
	switch (nowmod.value) {
		case 'number':
			callback(1, 0, 0);
			break;
		case 'coordinate':
			callback(1, 0, 0);
			break;
		case 'hostimage':
			callback(0, 1, 0);
			break;
		case 'netimage':
			callback(0, 0, 1);
			break;
		default:
			callback(1, 0, 0);
			break;
	}
};

window.onload = async () => {
	preview.setAttribute('viewBox', '0 0 600 600');
	let ref = preview.querySelector('use');
	ref.setAttribute('width', 600);
	ref.setAttribute('height', 600);
	main.ondragstart = () => {
		return false;
	};

	setting.onclick = () => {
		nowlanguage.value = savedata.lang;
		nowmod.value = savedata.mod; nowmodonchange();
		setdata.len = savedata.len;
		setdata.delay = savedata.delay
		nowsoundeffect.checked = savedata.soundeffect;
		netfile.value = savedata.imgsrc;
		settingfoundation.style.zIndex = 10;
	};
	full.onclick = () => {
		let de = window.parent.document.documentElement;
		if (de.requestFullscreen) {
			de.requestFullscreen();
		} else if (de.mozRequestFullScreen) { /* Firefox */
			de.mozRequestFullScreen();
		} else if (de.webkitRequestFullscreen) { /*Edge, Chrome, Safari & Opera */
			de.webkitRequestFullscreen();
		}
	};

	settingfoundation.onclick = (e) => {
		if (e.target.id != 'determine')
			imageerror.innerHTML = '';
	};
	nowlanguage.onchange = async () => {
		setdata.lang = nowlanguage.value;
	};
	subsize.onclick = () => {
		if (setdata.len > 3) {
			setdata.len--;
		}
	};
	addsize.onclick = () => {
		if (setdata.len < 10) {
			setdata.len++;
		}
	};
	subdelay.onclick = () => {
		if (setdata.delay > 0) {
			setdata.delay -= 100;
		}
	};
	adddelay.onclick = () => {
		if (setdata.delay < 1000) {
			setdata.delay *= 1;
			setdata.delay += 100;
		}
	};
	nowmod.onchange = nowmodonchange;
	determine.onclick = async () => {
		try {
			switch (nowmod.value) {
				case 'hostimage':
					await imgdata.checkandsetdata(URL.createObjectURL(hostfile.files[0]));
					break;
				case 'netimage':
					await imgdata.checkandsetdata(netfile.value);
					savedata.imgsrc = imgdata.src;
					break;
				default:
					break;
			}
			savedata.lang = setdata.lang;
			savedata.mod = nowmod.value;
			savedata.len = setdata.len;
			savedata.delay = setdata.delay;
			savedata.soundeffect = nowsoundeffect.checked;
			puzzle.setting();
			settingfoundation.style.zIndex = 0;
		} catch (err) {
			imageerror.innerHTML = language.reg[setdata.lang][nowmod.value + 'error'];
		}
	};
	cancel.onclick = async () => {
		setdata.lang = savedata.lang;
		settingfoundation.style.zIndex = 0;
	};

	sw = new Stopwatch(stopwatch);
	await language.initial(nowlanguage);
	number.initial();
	coordinate.initial();
	soundeffect.initial();
	setdata.lang = savedata.lang;

	try {
		switch (savedata.mod) {
			case 'hostimage':
				savedata.mod = 'netimage';
			case 'netimage':
				await imgdata.checkandsetdata(savedata.imgsrc);
				break;
			default:
				break;
		}
	} catch (err) {
		savedata.mod = 'number';
	}
	puzzle.setting();
	document.body.style.opacity = 1;
	window.parent.document.body.style.opacity = 1;
	if (geturl.random == 'true') {
		await sleep(1000);
		puzzle.random();
	}
};
window.onkeydown = (e) => {
	key = e.code;
	if (key == 'Enter')
		puzzle.random();
	if (key == 'Escape')
		puzzle.reset();
	if (key in direction) {
		puzzle.keymove(direction[key]);
	}
};
