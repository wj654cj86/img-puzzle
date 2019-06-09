var geturl = url2array();
var sw;

var language = {
	reg: {}
};

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

var puzzle = {
	seat: [],
	none: 0,
	len: 0,
	status: 'complete',
	ref: [],
	addr: []
};

var direction = {
	37: { x: 1, y: 0 },
	38: { x: 0, y: 1 },
	39: { x: -1, y: 0 },
	40: { x: 0, y: -1 }
};
var soundeffect = {
	move: new Audio(),
	warning: new Audio(),
	initial: function () {
		loadsound('soundeffect/move.wav', function (src) {
			soundeffect.move.src = src;
		});
		loadsound('soundeffect/warning.wav', function (src) {
			soundeffect.warning.src = src;
		});
	},
	play: function (ismove) {
		if (savedata.soundeffect == false)
			return;
		if (ismove) {
			soundeffect.move.cloneNode().play();
		} else {
			soundeffect.warning.cloneNode().play();
		}
	}
};

function setfoundation() {
	let fm = Math.min(window.innerWidth / 600, window.innerHeight / 800, 1.5);
	fm = Math.max(fm, 0.25);
	cannotuseie.style.transform = settingfoundation.style.transform = foundation.style.transform = 'scale(' + fm + ',' + fm + ')';
}

function setnowlenHTML(sl) {
	nowlen.innerHTML = sl * sl - 1 + language.reg.unit
		+ language.reg.frontbracket + sl + language.reg.time + sl + language.reg.backbracket;
}

function setimagesize(width, height) {
	imgdata.width = width;
	imgdata.height = height;
	imgdata.maximum = Math.max(imgdata.width, imgdata.height);
}

language.setting = function (lk, callback) {
	generator(function* () {
		if (lk in languagelist) {
			let languagefilepath = 'language/' + lk + '.json';
			yield {
				nextfunc: openfile,
				argsfront: [languagefilepath],
				cbfunc: function (str) {
					Object.assign(language.reg, JSON.parse(str));
					nowlanguage.value = lk;
				}
			};
		}
		document.title = language.reg.imgpuzzle;
		setting.value = language.reg.setting;
		random.value = language.reg.random;
		reset.value = language.reg.reset;
		full.value = language.reg.full;
		spanlanguage.innerHTML = language.reg.languagesetting;
		spanlen.innerHTML = language.reg.len;
		spandelay.innerHTML = language.reg.delay;
		spansoundeffect.innerHTML = language.reg.soundeffect;
		spanmod.innerHTML = language.reg.mod;
		spannetimage.innerHTML = language.reg.imgsrc;
		author.innerHTML = language.reg.spanauthor + language.reg.author;
		provider.innerHTML = language.reg.spanprovider + language.reg.provider;
		determine.value = language.reg.determine;
		cancel.value = language.reg.cancel;

		setnowlenHTML(setdata.len);
		nowdelay.innerHTML = setdata.delay + language.reg.ms;

		let nowmodoption = nowmod.getElementsByTagName("option");
		nowmodoption[0].innerHTML = language.reg.number;
		nowmodoption[1].innerHTML = language.reg.coordinate;
		nowmodoption[2].innerHTML = language.reg.hostimage;
		nowmodoption[3].innerHTML = language.reg.netimage;

		setting.style.fontSize = language.reg.fontsize;
		random.style.fontSize = language.reg.fontsize;
		reset.style.fontSize = language.reg.fontsize;
		full.style.fontSize = language.reg.fontsize;
		stopwatch.style.fontSize = language.reg.fontsize;
		complete.style.fontSize = language.reg.fontsize;
		spanlanguage.style.fontSize = language.reg.fontsize;
		nowlanguage.style.fontSize = language.reg.fontsize;
		spanlen.style.fontSize = language.reg.fontsize;
		nowlen.style.fontSize = language.reg.fontsize;
		spandelay.style.fontSize = language.reg.fontsize;
		nowdelay.style.fontSize = language.reg.fontsize;
		spansoundeffect.style.fontSize = language.reg.fontsize;
		spanmod.style.fontSize = language.reg.fontsize;
		nowmod.style.fontSize = language.reg.fontsize;
		spanhostimage.style.fontSize = language.reg.fontsize;
		hostfile.style.fontSize = language.reg.fontsize;
		spannetimage.style.fontSize = language.reg.fontsize;
		netfile.style.fontSize = language.reg.fontsize;
		author.style.fontSize = language.reg.fontsize;
		provider.style.fontSize = language.reg.fontsize;
		determine.style.fontSize = language.reg.fontsize;
		cancel.style.fontSize = language.reg.fontsize;
		callback();
	});
};
language.change = function () {
	setdata.language = nowlanguage.value;
	if (setdata.language == 'zh-Hant') {
		delete geturl.lang;
	} else {
		geturl.lang = setdata.language;
	}
	array2url(geturl);
	language.setting(nowlanguage.value, function () { });
};
language.initial = function () {
	generator(function* () {
		yield {
			nextfunc: openfile,
			argsfront: ['language/zh-Hant.json'],
			cbfunc: function (str) {
				language.reg = JSON.parse(str);
				nowlanguage.value = 'zh-Hant';
			}
		};

		for (let key in languagelist) {
			let lo = document.createElement("option");
			lo.value = key;
			lo.innerHTML = languagelist[key];
			nowlanguage.appendChild(lo);
		}

		language.setting(geturl.lang, function () {
			savedata.language = nowlanguage.value;
			nowlanguage.onchange = language.change;
		});
	});
};
puzzle._reset = function () {
	puzzle.seat = [];
	for (let i = 0; i < puzzle.len; i++) {
		puzzle.seat[i] = i;
	}
	puzzle.none = puzzle.len;
};
puzzle.setseat = function () {
	for (let i = 0; i < puzzle.len; i++) {
		puzzle.ref[i].style.top = puzzle.addr[puzzle.seat[i]].top;
		puzzle.ref[i].style.left = puzzle.addr[puzzle.seat[i]].left;
	}
};
puzzle.setting = function () {
	if (savedata.mod == 'number' || savedata.mod == 'coordinate') {
		preview.style.opacity = 0;
		preview.style.zIndex = 1;
	} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.opacity = 1;
		preview.style.zIndex = 3;
		preview.style.transition = 'all ' + savedata.delay + 'ms';

		refpreview.setAttribute('viewBox', [-imgdata.maximum / 2, -imgdata.maximum / 2, imgdata.maximum, imgdata.maximum].join(' '));
		let ref = refpreview.getElementsByTagName('image')[0];
		ref.setAttribute('x', -imgdata.width / 2);
		ref.setAttribute('y', -imgdata.height / 2);
		ref.setAttribute('width', imgdata.width);
		ref.setAttribute('height', imgdata.height);
		ref.setAttribute('xlink:href', imgdata.src);
		ref = refpreview.getElementsByTagName('rect')[0];
		ref.setAttribute('x', -imgdata.maximum / 2);
		ref.setAttribute('y', -imgdata.maximum / 2);
		ref.setAttribute('width', imgdata.maximum);
		ref.setAttribute('height', imgdata.maximum);
	}
	main.innerHTML = '';
	complete.innerHTML = '';
	puzzle.status = 'complete';
	sw.reset;
	puzzle.len = savedata.len * savedata.len - 1;
	let count;
	let puzzlesize = 600 / savedata.len;
	puzzle._reset();
	puzzle.addr = [];
	count = 0;
	for (let i = 0; i < savedata.len; i++) {
		for (let j = 0; j < savedata.len; j++) {
			puzzle.addr[count] = {
				left: puzzlesize * j + 'px',
				top: puzzlesize * i + 'px'
			};
			count++;
		}
	}

	for (let i = 0; i < puzzle.len; i++) {
		if (savedata.mod == 'number') {
			main.appendChild(number.style(i + 1));
		} else if (savedata.mod == 'coordinate') {
			main.appendChild(coordinate.style(String.fromCharCode(Math.floor(i / savedata.len + 65)), String.fromCharCode(i % savedata.len + 65)));
		} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			main.appendChild(image.style(savedata.len, puzzlesize, i % savedata.len, Math.floor(i / savedata.len)));
		}
	}

	let puzzletagarr = main.getElementsByTagName('svg');
	puzzle.ref = [];
	for (let i = 0; i < puzzle.len; i++) {
		puzzle.ref[i] = puzzletagarr[i];
		puzzle.ref[i].style.width = puzzlesize + 'px';
		puzzle.ref[i].style.height = puzzlesize + 'px';
		puzzle.ref[i].style.transition = 'all ' + savedata.delay + 'ms';
		puzzle.ref[i].onmousedown = function () {
			puzzle.move(i);
		};
		puzzle.ref[i].ontouchstart = function () {
			puzzle.move(i);
		};
	}
	puzzle.setseat();
};
puzzle._move = function (i) {
	let destination = puzzle.seat[i];
	let ix = destination % savedata.len;
	let iy = Math.floor(destination / savedata.len);
	let x = puzzle.none % savedata.len;
	let y = Math.floor(puzzle.none / savedata.len);
	let ismove = false;
	let move = function (m) {
		while (destination != puzzle.none) {
			let nnull = puzzle.none + m;
			let ref = puzzle.seat.indexOf(nnull);
			puzzle.seat[ref] = puzzle.none;
			puzzle.none = nnull;
			puzzle.ref[ref].style.top = puzzle.addr[puzzle.seat[ref]].top;
			puzzle.ref[ref].style.left = puzzle.addr[puzzle.seat[ref]].left;
			ismove = true;
		}
	}
	if (ix == x) {
		move(Math.sign(iy - y) * savedata.len);
	} else if (iy == y) {
		move(Math.sign(ix - x) * 1);
	}
	return ismove;
};
puzzle.random = function () {
	complete.innerHTML = '';
	puzzle.status = 'random';
	sw.reset;
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.opacity = 0;
		preview.style.zIndex = 1;
	}
	puzzle._reset();
	Math.floor(Math.random() * 4);
	for (let i = 0; i < puzzle.len; i++) {
		let j = Math.floor(Math.random() * puzzle.len);
		let t = puzzle.seat[i];
		puzzle.seat[i] = puzzle.seat[j];
		puzzle.seat[j] = t;
	}
	let count = 0;
	for (let i = 0; i < puzzle.len; i++) {
		for (let j = i + 1; j < puzzle.len; j++) {
			if (puzzle.seat[i] > puzzle.seat[j]) {
				count++;
			}
		}
	}
	if (count % 2) {
		let t = puzzle.seat[0];
		puzzle.seat[0] = puzzle.seat[1];
		puzzle.seat[1] = t;
	}
	puzzle.setseat();
	let r;
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		puzzle._move(puzzle.seat.indexOf(puzzle.none - r));
	}
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		puzzle._move(puzzle.seat.indexOf(puzzle.none - r * savedata.len));
	}
};
puzzle.reset = function () {
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.opacity = 1;
		preview.style.zIndex = 3;
	}
	complete.innerHTML = '';
	puzzle.status = 'complete';
	sw.reset;
	puzzle._reset();
	puzzle.setseat();
};
puzzle.move = function (i) {
	if (puzzle.status == 'complete')
		return;
	sw.start;
	soundeffect.play(puzzle._move(i));
	let iscomplete = function () {
		for (let i = 0; i < puzzle.len; i++) {
			if (puzzle.seat[i] != i)
				return false;
		}
		return true;
	}
	if (iscomplete()) {
		complete.innerHTML = language.reg.complete;
		puzzle.status = 'complete';
		sw.stop;
		if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			preview.style.opacity = 1;
			preview.style.zIndex = 3;
		}
	}
};

window.onload = function () {
	if (navigator.userAgent.search("MSIE") == -1) {
		cannotuseie.style.zIndex = 0;
	}
	if (typeof geturl['fbclid'] != 'undefined') {
		delete geturl['fbclid'];
		array2url(geturl);
	}

	document.body.onresize = setfoundation;
	setfoundation();

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
	main.ondragstart = function () {
		return false;
	};

	let nowmodonchange = function () {
		let callback = function (a, b, c) {
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
	setting.onclick = function () {
		setdata.len = savedata.len;
		setnowlenHTML(setdata.len);
		setdata.delay = savedata.delay;
		nowdelay.innerHTML = setdata.delay + language.reg.ms;
		nowmod.value = savedata.mod;
		nowmodonchange();
		settingfoundation.style.zIndex = 10;
	};
	random.onclick = puzzle.random;
	reset.onclick = puzzle.reset;
	subsize.onclick = function () {
		if (setdata.len > 3) {
			setdata.len--;
			setnowlenHTML(setdata.len);
		}
	};
	addsize.onclick = function () {
		if (setdata.len < 10) {
			setdata.len++;
			setnowlenHTML(setdata.len);
		}
	};
	subdelay.onclick = function () {
		if (setdata.delay > 0) {
			setdata.delay -= 100;
			nowdelay.innerHTML = setdata.delay + language.reg.ms;
		}
	};
	adddelay.onclick = function () {
		if (setdata.delay < 1000) {
			setdata.delay *= 1;
			setdata.delay += 100;
			nowdelay.innerHTML = setdata.delay + language.reg.ms;
		}
	};

	nowmod.onchange = nowmodonchange;
	determine.onclick = function () {
		savedata.language = setdata.language;
		generator(function* () {
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
						yield {
							nextfunc: getimgsize,
							argsfront: [url],
							cbfunc: function (width, height) {
								data.width = width;
								data.height = height;
							}
						};
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
					yield {
						nextfunc: getimgsize,
						argsfront: [netfile.value],
						cbfunc: function (width, height) {
							data.width = width;
							data.height = height;
						}
					};

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
		});
	};
	cancel.onclick = function () {
		nowlanguage.value = savedata.language;
		language.change();
		settingfoundation.style.zIndex = 0;
	};

	full.onclick = function () {
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
	language.initial();
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
	let numberload = function () {
		savedata.mod = 'number';
		setCookie('mod', savedata.mod);
		puzzle.setting();
	};
	generator(function* () {
		yield {
			nextfunc: number.initial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: coordinate.initial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: image.initial,
			cbfunc: function () { }
		};
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
					yield {
						nextfunc: getimgsize,
						argsfront: [is],
						cbfunc: function (width, height) {
							data.width = width;
							data.height = height;
						}
					};
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
	});
};
window.onkeydown = function () {
	key = event.keyCode;
	if (key == 13)
		puzzle.random();
	if (key == 27)
		puzzle.reset();
	if (key in direction) {
		if (puzzle.status == 'complete')
			return;
		let d = direction[key];
		let x = puzzle.none % savedata.len;
		let y = Math.floor(puzzle.none / savedata.len);
		if (x + d.x < 0 || y + d.y < 0 || x + d.x >= savedata.len || y + d.y >= savedata.len) {
			soundeffect.play(false);
			return;
		}
		puzzle.move(puzzle.seat.indexOf(x + d.x + (y + d.y) * savedata.len));
	}
};
