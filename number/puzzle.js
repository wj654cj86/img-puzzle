var segment = {
	led: [
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
	],
	seat: [
		'translate(0,-24)',
		'translate(12,-12) rotate(90)',
		'translate(12,12) rotate(90)',
		'translate(0,24)',
		'translate(-12,12) rotate(90)',
		'translate(-12,-12) rotate(90)',
		''
	],
	number: [
		['', '', ''],
		['', 'translate(-20,0)', 'translate(20,0)'],
		['translate(-43,0)', 'translate(-10,0)', 'translate(23,0)']
	]
};
var number = {
	xml: {},
	reg: [],
	initial: function (callback) {
		openfileforxml("number/style.svg", function (oReq) {
			number.xml = oReq;
			callback();
		});
	},
	style: function (n) {
		if (n >= 200) {
			n = n % 100 + 100;
		}
		if (typeof number.reg[n] == 'string') {
			return number.reg[n];
		}
		let s = n + '';
		let len = s.length;
		let svg = xhr2xml(number.xml);
		for (let i = len - 1; i >= 0; i--) {
			let sb = svg.createElementNS('http://www.w3.org/2000/svg', 'g');
			sb.setAttribute('transform', segment.number[len - 1][3 - len + i]);
			sb.setAttribute('fill', '#a00');
			for (let j = 0; j < 7; j++) {
				if (segment.led[s[i]][j] == 0)
					continue;
				let ss = svg.createElementNS('http://www.w3.org/2000/svg', 'path');
				ss.setAttribute('d', 'M10,0L7,3L-7,3L-10,0L-7-3L7-3z');
				ss.setAttribute('transform', segment.seat[j]);
				sb.appendChild(ss);
			}
			svg.getElementsByTagName('svg')[0].appendChild(sb);
		}
		number.reg[n] = svg.getElementsByTagName('svg')[0];
		return number.reg[n];
	}
};
