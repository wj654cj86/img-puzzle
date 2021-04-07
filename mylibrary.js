function paddingLeft(str, lenght) {
	str += '';
	if (str.length >= lenght)
		return str;
	else
		return paddingLeft("0" + str, lenght);
}

function setCookie(cname, cvalue) {
	var d;
	var expires = '';
	d = new Date();
	d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
	expires = "expires=" + d.toUTCString() + ";";
	document.cookie = cname + "=" + cvalue + ";" + expires + "path=" + location.pathname;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function url2array() {
	var arr = [];
	var strUrl = location.search;
	if (strUrl.indexOf('?') != -1) {
		var allData = strUrl.split("?")[1].split("&");
		for (var i = 0; i < allData.length; i++) {
			var data = allData[i].split("=");
			arr[data[0]] = decodeURIComponent(data[1]);
		}
	}
	return arr;
}

function array2url(arr) {
	var allData = [];
	for (var i in arr) {
		allData.push(i + '=' + encodeURIComponent(arr[i]));
	}
	var strUrl = allData.length != 0 ? ('?' + allData.join('&')) : '';
	var url = location.href.split('?')[0];
	window.history.pushState({}, 0, url + strUrl + location.hash);
}

function promise(callback, ...args) {
	return new Promise((resolve, reject) => {
		callback(...args, (data) => {
			resolve(data);
		});
	});
}

function promisearr(callback, ...args) {
	return new Promise((resolve, reject) => {
		callback(...args, (...args) => {
			resolve(args);
		});
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function openfile(url, callback) {
	if (typeof callback == "undefined") {
		callback = function (str) { };
	}
	let oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function () {
		if (oReq.status != 404) {
			callback(this.responseText);
		} else {
			callback('{}');
		}
	});
	oReq.addEventListener("error", function () {
		callback('{}');
	});
	oReq.open("GET", url);
	oReq.send();
}

function text2xml(text) {
	let parser = new DOMParser();
	return parser.parseFromString(text, "text/xml");
}

function xml2text(xml) {
	let xsl = new XMLSerializer();
	return xsl.serializeToString(xml);
}

function copyxml(xml) {
	return text2xml(xml2text(xml));
}

function getimgsize(imgsrc, callback) {
	let a = new Image();
	a.onload = function () {
		callback(a.naturalWidth, a.naturalHeight);
	};
	a.onerror = function () {
		callback(-1, -1);
	};
	a.src = imgsrc;
}

function loadimg(imgsrc, callback) {
	let img = new Image();
	img.onload = function () {
		callback(img);
	};
	img.src = imgsrc;
}

function loadsound(src, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', src);
	xhr.responseType = "blob";
	xhr.send();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			let blob = this.response;
			callback(URL.createObjectURL(blob));
		}
	}
}