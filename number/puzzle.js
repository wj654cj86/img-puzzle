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

function numberxmlinitial(callback) {
	openfileforxml("number/style.svg", function (oReq) {
		numberxml = oReq;
		callback();
	});
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
	let svg = xhr2xml(numberxml);
	for (let i = len - 1; i >= 0; i--) {
		let sb = svg.createElementNS('http://www.w3.org/2000/svg', 'g');
		sb.setAttribute('transform', coordinate[len - 1][3 - len + i]);
		for (let j = 0; j < 7; j++) {
			if (sevenSegment[s[i]][j] == 0)
				continue;
			let ss = svg.createElementNS('http://www.w3.org/2000/svg', 'path');
			ss.setAttribute('d', 'M10,0L7,3L-7,3L-10,0L-7-3L7-3z');
			ss.setAttribute('fill', '#a00');
			ss.setAttribute('transform', segment[j]);
			sb.appendChild(ss);
		}
		svg.getElementsByTagName('svg')[0].appendChild(sb);
	}
	numberreg[n] = svg.getElementsByTagName('svg')[0];
	return numberreg[n];
}