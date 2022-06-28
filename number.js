var number = (() => {
	let segment = {
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
	},
		str = '<svg viewBox="-50 -50 100 100">'
			+ '<rect x="-50" y="-50" width="100" height="100" fill="#777"/>'
			+ '<rect x="-45" y="-45" width="90" height="90" fill="#000"/>'
			+ '</svg>',
		reg = [];
	function initial() {
		let piece = nodetext2svgnode(`<path d="M10,0L7,3L-7,3L-10,0L-7-3L7-3z" fill="#a00" id="segmentpiece"/>`);
		refpiece.append(piece);
		for (let i = 0; i <= 9; i++) {
			let g = nodetext2svgnode(`<g id="segment${i}"></g>`);
			for (let j = 0; j < 7; j++) {
				if (segment.led[i][j] == 0)
					continue;
				let use = nodetext2svgnode(`<use xlink:href="#segmentpiece" transform="${segment.seat[j]}"/>`);
				g.append(use);
			}
			refpiece.append(g);
		}
	}
	function style(n) {
		if (typeof reg[n] == 'string') {
			return reg[n];
		}
		let s = n + '';
		let len = s.length;
		let svg = nodetext2svgnode(str);
		for (let i = len - 1; i >= 0; i--) {
			let ts = segment.number[len - 1][3 - len + i];
			let use = nodetext2svgnode(`<use xlink:href="#segment${s[i]}"${ts != '' ? ` transform="${ts}"` : ''}/>`);
			svg.append(use);
		}
		reg[n] = svg;
		return reg[n];
	}
	return {
		initial: initial,
		style: style
	};
})();
