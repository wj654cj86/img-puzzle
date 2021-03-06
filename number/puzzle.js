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
	text: {},
	reg: [],
	initial: function (callback) {
		openfile("number/style.svg", function (text) {
			number.text = text;
			let piece = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			piece.setAttribute('d', 'M10,0L7,3L-7,3L-10,0L-7-3L7-3z');
			piece.setAttribute('fill', '#a00');
			piece.setAttribute('id', 'segmentpiece');
			refpiece.appendChild(piece);
			for (let i = 0; i <= 9; i++) {
				let gref = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				gref.setAttribute('id', 'segment' + i);
				for (let j = 0; j < 7; j++) {
					if (segment.led[i][j] == 0)
						continue;
					let useref = document.createElementNS('http://www.w3.org/2000/svg', 'use');
					useref.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#segmentpiece');
					useref.setAttribute('transform', segment.seat[j]);
					gref.appendChild(useref);
				}
				refpiece.appendChild(gref);
			}
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
		let svg = text2xml(number.text);
		for (let i = len - 1; i >= 0; i--) {
			let useref = svg.createElementNS('http://www.w3.org/2000/svg', 'use');
			useref.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#segment' + s[i]);
			useref.setAttribute('transform', segment.number[len - 1][3 - len + i]);
			svg.getElementsByTagName('svg')[0].appendChild(useref);
		}
		number.reg[n] = svg.getElementsByTagName('svg')[0];
		return number.reg[n];
	}
};
