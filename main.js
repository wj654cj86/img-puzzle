var geturl = url2array();
var lang;

var savedata = {
	lang: 'zh-Hant',
	mod: 'number',
	len: 4,
	delay: 0
};
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

var nowstatus = 'complete';
var sw;
var puzzle;
var nownull;
var puzzletag;
var puzzleseat;

var direction = {
	37: { x: 1, y: 0 },
	38: { x: 0, y: 1 },
	39: { x: -1, y: 0 },
	40: { x: 0, y: -1 }
};

function setfoundation() {
	let fm = Math.min(window.innerWidth / 600, window.innerHeight / 800, 1.5);
	fm = Math.max(fm, 0.25);
	cannotuseie.style.transform = settingfoundation.style.transform = foundation.style.transform = 'scale(' + fm + ',' + fm + ')';
}

function setnowlenHTML(sl) {
	nowlen.innerHTML = sl * sl - 1 + lang.unit
		+ lang.frontbracket + sl + lang.time + sl + lang.backbracket;
}

function languageset(lk, callback) {
	generator(function* () {
		if (lk in langlist) {
			let langfilepath = 'language/' + lk + '.json';
			yield {
				nextfunc: openfile,
				argsfront: [langfilepath],
				cbfunc: function (str) {
					Object.assign(lang, JSON.parse(str));
					nowlanguage.value = lk;
				}
			};
		}
		document.title = lang.imgpuzzle;
		setting.value = lang.setting;
		random.value = lang.random;
		reset.value = lang.reset;
		full.value = lang.full;
		spanlanguage.innerHTML = lang.languagesetting;
		spanlen.innerHTML = lang.len;
		spandelay.innerHTML = lang.delay;
		spanmod.innerHTML = lang.mod;
		spannetimage.innerHTML = lang.imgsrc;
		author.innerHTML = lang.spanauthor + lang.author;
		provider.innerHTML = lang.spanprovider + lang.provider;
		determine.value = lang.determine;
		cancel.value = lang.cancel;

		setnowlenHTML(setdata.len);
		nowdelay.innerHTML = setdata.delay + lang.ms;

		let nowmodoption = nowmod.getElementsByTagName("option");
		nowmodoption[0].innerHTML = lang.number;
		nowmodoption[1].innerHTML = lang.coordinate;
		nowmodoption[2].innerHTML = lang.hostimage;
		nowmodoption[3].innerHTML = lang.netimage;

		setting.style.fontSize = lang.fontsize;
		random.style.fontSize = lang.fontsize;
		reset.style.fontSize = lang.fontsize;
		full.style.fontSize = lang.fontsize;
		stopwatch.style.fontSize = lang.fontsize;
		complete.style.fontSize = lang.fontsize;
		spanlanguage.style.fontSize = lang.fontsize;
		nowlanguage.style.fontSize = lang.fontsize;
		spanlen.style.fontSize = lang.fontsize;
		nowlen.style.fontSize = lang.fontsize;
		spandelay.style.fontSize = lang.fontsize;
		nowdelay.style.fontSize = lang.fontsize;
		spanmod.style.fontSize = lang.fontsize;
		nowmod.style.fontSize = lang.fontsize;
		spanhostimage.style.fontSize = lang.fontsize;
		hostfile.style.fontSize = lang.fontsize;
		spannetimage.style.fontSize = lang.fontsize;
		netfile.style.fontSize = lang.fontsize;
		author.style.fontSize = lang.fontsize;
		provider.style.fontSize = lang.fontsize;
		determine.style.fontSize = lang.fontsize;
		cancel.style.fontSize = lang.fontsize;
		callback();
	});
}
function languagechange() {
	setdata.lang = nowlanguage.value;
	if (setdata.lang == 'zh-Hant') {
		delete geturl.lang;
	} else {
		geturl.lang = setdata.lang;
	}
	array2url(geturl);
	languageset(nowlanguage.value, function () { });
}
function languageinitial() {
	generator(function* () {
		yield {
			nextfunc: openfile,
			argsfront: ['language/zh-Hant.json'],
			cbfunc: function (str) {
				lang = JSON.parse(str);
				nowlanguage.value = 'zh-Hant';
			}
		};

		for (let key in langlist) {
			let lo = document.createElement("option");
			lo.value = key;
			lo.innerHTML = langlist[key];
			nowlanguage.appendChild(lo);
		}

		languageset(geturl.lang, function () {
			savedata.lang = nowlanguage.value;
			nowlanguage.onchange = languagechange;
		});
	});
}


function setpuzzleimgwh(width, height) {
	imgdata.width = width;
	imgdata.height = height;
	imgdata.maximum = Math.max(imgdata.width, imgdata.height);
}
window.onload = function () {
	document.body.onresize = setfoundation;
	if (navigator.userAgent.search("MSIE") == -1) {
		cannotuseie.style.zIndex = 0;
	}
	if (typeof geturl['fbclid'] != 'undefined') {
		delete geturl['fbclid'];
		array2url(geturl);
	}

	refpreview.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	refpreview.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
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
		nowdelay.innerHTML = setdata.delay + lang.ms;
		nowmod.value = savedata.mod;
		nowmodonchange();
		settingfoundation.style.zIndex = 10;
	};
	random.onclick = randompuzzle;
	reset.onclick = resetpuzzle;
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
			nowdelay.innerHTML = setdata.delay + lang.ms;
		}
	};
	adddelay.onclick = function () {
		if (setdata.delay < 1000) {
			setdata.delay *= 1;
			setdata.delay += 100;
			nowdelay.innerHTML = setdata.delay + lang.ms;
		}
	};

	nowmod.onchange = nowmodonchange;
	determine.onclick = function () {
		savedata.lang = setdata.lang;
		generator(function* () {
			let data = {}, url;
			switch (nowmod.value) {
				case 'number':
					savedata.mod = nowmod.value;
					savedata.len = setdata.len;
					savedata.delay = setdata.delay;
					setCookie('mod', savedata.mod);
					setCookie('len', savedata.len);
					setCookie('delay', savedata.delay);
					setpuzzle();
					break;
				case 'coordinate':
					savedata.mod = nowmod.value;
					savedata.len = setdata.len;
					savedata.delay = setdata.delay;
					setCookie('mod', savedata.mod);
					setCookie('len', savedata.len);
					setCookie('delay', savedata.delay);
					setpuzzle();
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
					imgdata.src = url;
					setCookie('len', savedata.len);
					setCookie('delay', savedata.delay);

					setpuzzleimgwh(data.width, data.height);
					setpuzzle();
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
					imgdata.src = netfile.value;
					setCookie('mod', savedata.mod);
					setCookie('len', savedata.len);
					setCookie('delay', savedata.delay);
					setCookie('imgsrc', imgdata.src);

					setpuzzleimgwh(data.width, data.height);
					setpuzzle();
					break;
				default:
					break;
			}
			settingfoundation.style.zIndex = 0;
		});
	};
	cancel.onclick = function () {
		nowlanguage.value = savedata.lang;
		languagechange();
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
	setfoundation();
	languageinitial();

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
	let m = getCookie('mod');
	let is = getCookie('imgsrc');
	let numberload = function () {
		savedata.mod = 'number';
		setCookie('mod', savedata.mod);
		setpuzzle();
	};
	generator(function* () {
		yield {
			nextfunc: numberxmlinitial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: coordinatexmlinitial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: imagexmlinitial,
			cbfunc: function () { }
		};
		let data = {};
		switch (m) {
			case 'number':
				numberload();
				break;
			case 'coordinate':
				savedata.mod = m;
				setpuzzle();
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

					setpuzzleimgwh(data.width, data.height);

					savedata.mod = m;
					netfile.value = imgdata.src = is;
					setpuzzle();
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
		randompuzzle();
	if (key == 27)
		resetpuzzle();
	if (key in direction) {
		let d = direction[key];
		let x = nownull % savedata.len;
		let y = Math.floor(nownull / savedata.len);
		if (x + d.x < 0 || y + d.y < 0 || x + d.x >= savedata.len || y + d.y >= savedata.len)
			return;
		puzzlemove(puzzle.indexOf(x + d.x + (y + d.y) * savedata.len));
	}
};

function setpuzzle() {
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
	nowstatus = 'complete';
	sw.reset;
	puzzlelen = savedata.len * savedata.len - 1;
	let count;
	let puzzlesize = 600 / savedata.len;
	puzzle = [];
	for (let i = 0; i < puzzlelen; i++) {
		puzzle[i] = i;
	}
	nownull = puzzlelen;
	puzzleseat = [];
	count = 0;
	for (let i = 0; i < savedata.len; i++) {
		for (let j = 0; j < savedata.len; j++) {
			puzzleseat[count] = {
				left: puzzlesize * j + 'px',
				top: puzzlesize * i + 'px'
			};
			count++;
		}
	}

	for (let i = 0; i < puzzlelen; i++) {
		if (savedata.mod == 'number') {
			main.appendChild(numberstyle(i + 1));
		} else if (savedata.mod == 'coordinate') {
			main.appendChild(coordinatestyle(String.fromCharCode(Math.floor(i / savedata.len + 65)), String.fromCharCode(i % savedata.len + 65)));
		} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			main.appendChild(imagestyle(savedata.len, puzzlesize, i % savedata.len, Math.floor(i / savedata.len)));
		}
	}

	let puzzletagarr = main.getElementsByTagName('svg');
	puzzletag = [];
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i] = puzzletagarr[i];
		puzzletag[i].style.left = puzzleseat[i].left;
		puzzletag[i].style.top = puzzleseat[i].top;
		puzzletag[i].style.width = puzzlesize + 'px';
		puzzletag[i].style.height = puzzlesize + 'px';
		puzzletag[i].style.transition = 'all ' + savedata.delay + 'ms';
		puzzletag[i].onmousedown = function () {
			puzzlemove(i);
		};
		puzzletag[i].ontouchstart = function () {
			puzzlemove(i);
		};
	}
}

function _puzzlemove(i) {
	let destination = puzzle[i];
	let ix = destination % savedata.len;
	let iy = Math.floor(destination / savedata.len);
	let x = nownull % savedata.len;
	let y = Math.floor(nownull / savedata.len);
	let move = function (m) {
		while (destination != nownull) {
			let nnull = nownull + m;
			let ref = puzzle.indexOf(nnull);
			puzzle[ref] = nownull;
			nownull = nnull;
			puzzletag[ref].style.top = puzzleseat[puzzle[ref]].top;
			puzzletag[ref].style.left = puzzleseat[puzzle[ref]].left;
		}
	}
	if (ix == x) {
		move(Math.sign(iy - y) * savedata.len);
	} else if (iy == y) {
		move(Math.sign(ix - x) * 1);
	}
}

function randompuzzle() {
	complete.innerHTML = '';
	nowstatus = 'random';
	sw.reset;
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.opacity = 0;
		preview.style.zIndex = 1;
	}
	for (let i = 0; i < puzzlelen; i++) {
		puzzle[i] = i;
	}
	nownull = puzzlelen;
	Math.floor(Math.random() * 4);
	for (let i = 0; i < puzzlelen; i++) {
		let j = Math.floor(Math.random() * puzzlelen);
		let t = puzzle[i];
		puzzle[i] = puzzle[j];
		puzzle[j] = t;
	}
	let count = 0;
	for (let i = 0; i < puzzlelen; i++) {
		for (let j = i + 1; j < puzzlelen; j++) {
			if (puzzle[i] > puzzle[j]) {
				count++;
			}
		}
	}
	if (count % 2) {
		let t = puzzle[0];
		puzzle[0] = puzzle[1];
		puzzle[1] = t;
	}
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i].style.top = puzzleseat[puzzle[i]].top;
		puzzletag[i].style.left = puzzleseat[puzzle[i]].left;
	}
	let r;
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		_puzzlemove(puzzle.indexOf(nownull - r));
	}
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		_puzzlemove(puzzle.indexOf(nownull - r * savedata.len));
	}
}

function resetpuzzle() {
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.opacity = 1;
		preview.style.zIndex = 3;
	}
	complete.innerHTML = '';
	nowstatus = 'complete';
	sw.reset;
	for (let i = 0; i < puzzlelen; i++) {
		puzzle[i] = i;
	}
	nownull = puzzlelen;
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i].style.top = puzzleseat[puzzle[i]].top;
		puzzletag[i].style.left = puzzleseat[puzzle[i]].left;
	}
}

function puzzlemove(i) {
	if (nowstatus == 'complete')
		return;
	sw.start;
	_puzzlemove(i);
	let iscomplete = function () {
		for (let i = 0; i < puzzlelen; i++) {
			if (puzzle[i] != i)
				return false;
		}
		return true;
	}
	if (iscomplete()) {
		complete.innerHTML = lang.complete;
		nowstatus = 'complete';
		sw.stop;
		if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			preview.style.opacity = 1;
			preview.style.zIndex = 3;
		}
	}
}