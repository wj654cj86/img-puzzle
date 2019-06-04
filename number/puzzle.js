var sevenSegment = [
	[1, 1, 1, 1, 1, 1, 0], //0
	[0, 1, 1, 0, 0, 0, 0], //1
	[1, 1, 0, 1, 1, 0, 1], //2
	[1, 1, 1, 1, 0, 0, 1], //3
	[0, 1, 1, 0, 0, 1, 1], //4
	[1, 0, 1, 1, 0, 1, 1], //5
	[1, 0, 1, 1, 1, 1, 1], //6
	[1, 1, 1, 0, 0, 0, 0], //7
	[1, 1, 1, 1, 1, 1, 1], //8
	[1, 1, 1, 1, 0, 1, 1] //9
];
var segment = [
	'translate(0,-24)',
	'translate(12,-12) rotate(90)',
	'translate(12,12) rotate(90)',
	'translate(0,24)',
	'translate(-12,12) rotate(90)',
	'translate(-12,-12) rotate(90)',
	''
];
var coordinate = [
	['', '', ''],
	['', 'translate(-20,0)', 'translate(20,0)'],
	['translate(-43,0)', 'translate(-10,0)', 'translate(23,0)']
];
var numberxml;
var numberreg = [];

function numberxmlinitial(callback){
	numberxml = new XMLHttpRequest();
	numberxml.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback();
		}
	};
	numberxml.open("GET", "number/style.svg", true);
	numberxml.send();
}

function numberstyle(n) {
	if (n >= 200) {
		n = n % 100 + 100;
	}
	if (typeof numberreg[n] == 'string') {
		return numberreg[n];
	}
	let s = n + '';
	let len = s.length;
	let parser = new DOMParser();
	let svg = parser.parseFromString(numberxml.responseText, "text/xml");
	for (let i = len - 1; i >= 0; i--) {
		let sb = svg.createElement('g');
		sb.setAttribute('transform', coordinate[len - 1][3 - len + i]);
		for (let j = 0; j < 7; j++) {
			if (sevenSegment[s[i]][j] == 0)
				continue;
			let ss = svg.createElement('use');
			ss.setAttribute('xlink:href', '#s');
			ss.setAttribute('transform', segment[j]);
			sb.appendChild(ss);
		}
		svg.getElementsByTagName('svg')[0].appendChild(sb);
	}
	let blob = new Blob([(new XMLSerializer()).serializeToString(svg).replace(/xmlns\=\"\"/g, '')], {
		type: 'image/svg+xml'
	});
	numberreg[n] = URL.createObjectURL(blob);
	return numberreg[n];
}