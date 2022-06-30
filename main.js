var geturl = window.parent.url2array();

var sw;

var savedata = new (function (obj, check, decode, encode) {
	for (let dataname in obj) {
		let data = obj[dataname];
		let ck = getCookie(dataname);
		let cf = check[dataname];
		let df = dataname in decode ? decode[dataname] : d => d;
		if (dataname in geturl && cf(geturl[dataname])) {
			data = df(geturl[dataname]);
		} else if (cf(ck)) {
			data = df(ck);
		}
		let ef = dataname in encode ? encode[dataname] : d => d;
		setCookie(dataname, ef(data));
		Object.defineProperty(this, dataname, {
			set(_data) {
				data = _data;
				setCookie(dataname, ef(_data));
			},
			get() {
				return data;
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

var setdata = {
	lang: 'zh-Hant',
	len: 4,
	delay: 0
};
var imgdata = {
	src: '',
	width: 0,
	height: 0,
	maximum: 0,
	x: 0,
	y: 0
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

function setnowlenHTML(sl) {
	nowlen.innerHTML = sl * sl - 1 + language.reg[setdata.lang].unit
		+ language.reg[setdata.lang].frontbracket + sl + language.reg[setdata.lang].time + sl + language.reg[setdata.lang].backbracket;
}
function setnowdelayHTML(sd) {
	nowdelay.innerHTML = sd + language.reg[setdata.lang].ms;
}

function setimagesize(width, height) {
	imgdata.width = width;
	imgdata.height = height;
	imgdata.maximum = Math.max(imgdata.width, imgdata.height);
}

async function changelanguage(lang) {
	await language.setting(lang);
	setdata.lang = language.mod;
	loadlanguage();
}
function loadlanguage() {
	let reg = language.reg[setdata.lang];
	document.title = reg.imgpuzzle;
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

	setnowlenHTML(setdata.len);
	setnowdelayHTML(setdata.delay);

	let nowmodoption = nowmod.getElementsByTagName("option");
	nowmodoption[0].innerHTML = reg.number;
	nowmodoption[1].innerHTML = reg.coordinate;
	nowmodoption[2].innerHTML = reg.hostimage;
	nowmodoption[3].innerHTML = reg.netimage;

	document.body.style.setProperty('--font-size', reg.fontsize);
}

window.onload = async () => {
	preview.setAttribute('viewBox', '0 0 600 600');
	let ref = preview.getElementsByTagName('use')[0];
	ref.setAttribute('width', 600);
	ref.setAttribute('height', 600);
	main.ondragstart = () => {
		return false;
	};

	let nowmodonchange = () => {
		imageerror.innerHTML = '';
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

	setting.onclick = () => {
		nowlanguage.value = savedata.lang;
		nowmod.value = savedata.mod; nowmodonchange();
		setnowlenHTML(setdata.len = savedata.len);
		setnowdelayHTML(setdata.delay = savedata.delay);
		nowsoundeffect.checked = savedata.soundeffect;
		netfile.value = savedata.imgsrc;
		settingfoundation.style.zIndex = 10;
	};
	random.onclick = puzzle.random;
	reset.onclick = puzzle.reset;
	full.onclick = () => {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) { /*Edge, Chrome, Safari & Opera */
			document.documentElement.webkitRequestFullscreen();
		}
	};

	nowlanguage.onchange = async () => {
		imageerror.innerHTML = '';
		await changelanguage(nowlanguage.value);
	};
	subsize.onclick = () => {
		imageerror.innerHTML = '';
		if (setdata.len > 3) {
			setdata.len--;
			setnowlenHTML(setdata.len);
		}
	};
	addsize.onclick = () => {
		imageerror.innerHTML = '';
		if (setdata.len < 10) {
			setdata.len++;
			setnowlenHTML(setdata.len);
		}
	};
	subdelay.onclick = () => {
		imageerror.innerHTML = '';
		if (setdata.delay > 0) {
			setdata.delay -= 100;
			setnowdelayHTML(setdata.delay);
		}
	};
	adddelay.onclick = () => {
		imageerror.innerHTML = '';
		if (setdata.delay < 1000) {
			setdata.delay *= 1;
			setdata.delay += 100;
			setnowdelayHTML(setdata.delay);
		}
	};
	nowsoundeffect.onclick = () => {
		imageerror.innerHTML = '';
	};
	nowmod.onchange = nowmodonchange;
	hostfile.onclick = () => {
		imageerror.innerHTML = '';
	};
	netfile.onclick = () => {
		imageerror.innerHTML = '';
	};
	determine.onclick = async () => {
		let data = {}, url;
		try {
			switch (nowmod.value) {
				case 'hostimage':
					try {
						url = URL.createObjectURL(hostfile.files[0]);
						[data.width, data.height] = await promisearr(getimgsize, url);
					} catch (err) {
						throw 'hostimageerror';
					}
					if (data.width == -1 || data.height == -1) {
						throw 'hostimageerror';
					}
					imgdata.src = url;
					setimagesize(data.width, data.height);
					break;
				case 'netimage':
					url = netfile.value;
					[data.width, data.height] = await promisearr(getimgsize, url);
					if (data.width == -1 || data.height == -1) {
						throw 'netimageerror';
					}
					savedata.imgsrc = url;
					imgdata.src = url;
					setimagesize(data.width, data.height);
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
			imageerror.innerHTML = language.reg[setdata.lang][err];
		}
	};
	cancel.onclick = async () => {
		await changelanguage(savedata.lang);
		settingfoundation.style.zIndex = 0;
	};

	sw = new Stopwatch(stopwatch);
	await language.initial(nowlanguage);
	number.initial();
	coordinate.initial();
	soundeffect.initial();
	await changelanguage(savedata.lang);

	let data = {};
	switch (savedata.mod) {
		case 'hostimage':
			savedata.mod = 'number';
			break;
		case 'netimage':
			[data.width, data.height] = await promisearr(getimgsize, savedata.imgsrc);
			if (data.width == -1 || data.height == -1) {
				savedata.imgsrc = '';
				savedata.mod = 'number';
			} else {
				imgdata.src = savedata.imgsrc;
				setimagesize(data.width, data.height);
			}
			break;
		default:
			break;
	}
	puzzle.setting();
	document.body.style.opacity = 1;
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
