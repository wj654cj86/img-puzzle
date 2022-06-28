var	geturl = window.parent.url2array();
var sw;

var savedata = {
	language: 'zh-Hant',
	mod: 'number',
	len: 4,
	delay: 0,
	soundeffect: false
};
var setdata = {
	language: 'zh-Hant',
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
	nowlen.innerHTML = sl * sl - 1 + language.reg[setdata.language].unit
		+ language.reg[setdata.language].frontbracket + sl + language.reg[setdata.language].time + sl + language.reg[setdata.language].backbracket;
}

function setimagesize(width, height) {
	imgdata.width = width;
	imgdata.height = height;
	imgdata.maximum = Math.max(imgdata.width, imgdata.height);
}
async function changelanguage(lang) {
	setdata.language = lang;
	if (setdata.language == 'zh-Hant') {
		delete geturl.lang;
	} else {
		geturl.lang = setdata.language;
	}
	window.parent.array2url(geturl);
	await language.setting(setdata.language);
	loadlanguage();
}
function loadlanguage() {
	let reg = language.reg[setdata.language];
	document.title = reg.imgpuzzle;
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
	nowdelay.innerHTML = setdata.delay + reg.ms;

	let nowmodoption = nowmod.getElementsByTagName("option");
	nowmodoption[0].innerHTML = reg.number;
	nowmodoption[1].innerHTML = reg.coordinate;
	nowmodoption[2].innerHTML = reg.hostimage;
	nowmodoption[3].innerHTML = reg.netimage;

	setting.style.fontSize = reg.fontsize;
	random.style.fontSize = reg.fontsize;
	reset.style.fontSize = reg.fontsize;
	full.style.fontSize = reg.fontsize;
	stopwatch.style.fontSize = reg.fontsize;
	complete.style.fontSize = reg.fontsize;
	spanlanguage.style.fontSize = reg.fontsize;
	nowlanguage.style.fontSize = reg.fontsize;
	spanlen.style.fontSize = reg.fontsize;
	nowlen.style.fontSize = reg.fontsize;
	spandelay.style.fontSize = reg.fontsize;
	nowdelay.style.fontSize = reg.fontsize;
	spansoundeffect.style.fontSize = reg.fontsize;
	spanmod.style.fontSize = reg.fontsize;
	nowmod.style.fontSize = reg.fontsize;
	spanhostimage.style.fontSize = reg.fontsize;
	hostfile.style.fontSize = reg.fontsize;
	spannetimage.style.fontSize = reg.fontsize;
	netfile.style.fontSize = reg.fontsize;
	author.style.fontSize = reg.fontsize;
	provider.style.fontSize = reg.fontsize;
	determine.style.fontSize = reg.fontsize;
	cancel.style.fontSize = reg.fontsize;
}

window.onload = async () => {
	if (typeof geturl.fbclid != 'undefined') {
		delete geturl.fbclid;
		window.parent.array2url(geturl);
	}

	refpreview.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	refpreview.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	refpiece.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	refpiece.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	preview.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	preview.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	preview.setAttribute('viewBox', '0 0 600 600');
	let ref = preview.getElementsByTagName('use')[0];
	ref.setAttribute('width', 600);
	ref.setAttribute('height', 600);
	main.ondragstart = () => {
		return false;
	};

	let nowmodonchange = () => {
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
		setdata.len = savedata.len;
		setnowlenHTML(setdata.len);
		setdata.delay = savedata.delay;
		nowdelay.innerHTML = setdata.delay + language.reg[setdata.language].ms;
		nowmod.value = savedata.mod;
		nowmodonchange();
		settingfoundation.style.zIndex = 10;
	};
	random.onclick = puzzle.random;
	reset.onclick = puzzle.reset;
	subsize.onclick = () => {
		if (setdata.len > 3) {
			setdata.len--;
			setnowlenHTML(setdata.len);
		}
	};
	addsize.onclick = () => {
		if (setdata.len < 10) {
			setdata.len++;
			setnowlenHTML(setdata.len);
		}
	};
	subdelay.onclick = () => {
		if (setdata.delay > 0) {
			setdata.delay -= 100;
			nowdelay.innerHTML = setdata.delay + language.reg[setdata.language].ms;
		}
	};
	adddelay.onclick = () => {
		if (setdata.delay < 1000) {
			setdata.delay *= 1;
			setdata.delay += 100;
			nowdelay.innerHTML = setdata.delay + language.reg[setdata.language].ms;
		}
	};

	nowmod.onchange = nowmodonchange;
	determine.onclick = async () => {
		savedata.language = setdata.language;
		let data = {}, url;
		switch (nowmod.value) {
			case 'number':
				savedata.mod = nowmod.value;
				savedata.len = setdata.len;
				savedata.delay = setdata.delay;
				savedata.soundeffect = nowsoundeffect.checked;
				setCookie('mod', savedata.mod);
				setCookie('len', savedata.len);
				setCookie('delay', savedata.delay);
				setCookie('soundeffect', savedata.soundeffect);
				puzzle.setting();
				break;
			case 'coordinate':
				savedata.mod = nowmod.value;
				savedata.len = setdata.len;
				savedata.delay = setdata.delay;
				savedata.soundeffect = nowsoundeffect.checked;
				setCookie('mod', savedata.mod);
				setCookie('len', savedata.len);
				setCookie('delay', savedata.delay);
				setCookie('soundeffect', savedata.soundeffect);
				puzzle.setting();
				break;
			case 'hostimage':
				try {
					url = URL.createObjectURL(hostfile.files[0]);
					[data.width, data.height] = await promisearr(getimgsize, url);
				} catch (err) {
					break;
				}

				if (data.width == -1 || data.height == -1) {
					break;
				}

				savedata.mod = nowmod.value;
				savedata.len = setdata.len;
				savedata.delay = setdata.delay;
				savedata.soundeffect = nowsoundeffect.checked;
				imgdata.src = url;
				setCookie('len', savedata.len);
				setCookie('delay', savedata.delay);
				setCookie('soundeffect', savedata.soundeffect);

				setimagesize(data.width, data.height);
				puzzle.setting();
				break;
			case 'netimage':
				[data.width, data.height] = await promisearr(getimgsize, netfile.value);

				if (data.width == -1 || data.height == -1) {
					break;
				}

				savedata.mod = nowmod.value;
				savedata.len = setdata.len;
				savedata.delay = setdata.delay;
				savedata.soundeffect = nowsoundeffect.checked;
				imgdata.src = netfile.value;
				setCookie('mod', savedata.mod);
				setCookie('len', savedata.len);
				setCookie('delay', savedata.delay);
				setCookie('soundeffect', savedata.soundeffect);
				setCookie('imgsrc', imgdata.src);

				setimagesize(data.width, data.height);
				puzzle.setting();
				break;
			default:
				break;
		}
		settingfoundation.style.zIndex = 0;
	};
	cancel.onclick = async () => {
		await changelanguage(nowlanguage.value = savedata.language);
		settingfoundation.style.zIndex = 0;
	};

	full.onclick = () => {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
			document.documentElement.msRequestFullscreen();
		}
	};
	sw = new Stopwatch(stopwatch);
	await language.initial(nowlanguage);
	nowlanguage.value = savedata.language = geturl.lang || 'zh-Hant';
	await changelanguage(nowlanguage.value);
	nowlanguage.onchange = async () => {
		await changelanguage(nowlanguage.value);
	};

	soundeffect.initial();

	let l = getCookie('len');
	if (l != '' && !isNaN(l) && l >= 3 && l <= 10) {
		savedata.len = l;
	} else {
		savedata.len = 4;
		setCookie('len', savedata.len);
	}
	let d = getCookie('delay');
	if (d != '' && !isNaN(d) && d >= 0 && d <= 1000) {
		savedata.delay = d;
	} else {
		savedata.delay = 0;
		setCookie('delay', savedata.delay);
	}
	let se = getCookie('soundeffect');
	if (se == 'true') {
		savedata.soundeffect = true;
		nowsoundeffect.checked = true;
	} else {
		savedata.soundeffect = false;
		nowsoundeffect.checked = false;
	}
	let m = getCookie('mod');
	let is = getCookie('imgsrc');
	let numberload = () => {
		savedata.mod = 'number';
		setCookie('mod', savedata.mod);
		puzzle.setting();
	};

	await number.initial();
	await coordinate.initial();
	await image.initial();
	let data = {};
	switch (m) {
		case 'number':
			numberload();
			break;
		case 'coordinate':
			savedata.mod = m;
			puzzle.setting();
			break;
		case 'hostimage':
			numberload();
			break;
		case 'netimage':
			if (is != '') {
				[data.width, data.height] = await promisearr(getimgsize, is);
				if (data.width == -1 || data.height == -1) {
					numberload();
					break;
				}
				setimagesize(data.width, data.height);
				savedata.mod = m;
				netfile.value = imgdata.src = is;
				puzzle.setting();
			} else {
				numberload();
			}
			break;
		default:
			numberload();
			break;
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
