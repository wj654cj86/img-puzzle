var coordinate = (() => {
	let latin = {
		script: {
			'A': ['m15,95h11l29.5-90h-11z', 'm85,95h-11l-29.5-90h11z', 'm32,50v10h36v-10z'],
			'B': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm19,45h40a25,25,180,0,1,0,50h-40v-10h40a15,15,180,0,0,0-30h-40z'],
			'C': ['m15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
			'D': ['m15,5h10v90h-10z', 'm19,5h31a35,45,180,0,1,0,90h-31v-10h31a25,35,180,0,0,0-70h-31z'],
			'E': ['m15,5h10v90h-10z', 'm20,5v10h65v-10z', 'm20,45v10h55v-10z', 'm20,85v10h65v-10z'],
			'F': ['m15,5h10v90h-10z', 'm20,5v10h65v-10z', 'm20,45v10h55v-10z'],
			'G': ['m50,45h32v50h-10v-40h-22z', 'm15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
			'H': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm16,45v10h68v-10z'],
			'I': ['m35,5v10h30v-10z', 'm35,85v10h30v-10z', 'm45,6h10v88h-10z'],
			'J': ['m35,5v10h30v-10z', 'm45,6h10v69a20,20,180,1,1-40,0h10a10,10,180,0,0,20,0z'],
			'K': ['m15,5h10v90h-10z', 'm70.6,5h14.4l-68,65v-13.76z', 'm36.7,40.54l8.31-5.54l40,60h-12z'],
			'L': ['m15,5h10v90h-10z', 'm20,85v10h65v-10z'],
			'M': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm25,5l29,54l-4,14l-29-54z', 'm75,5l-29,54l4,14l29-54z'],
			'N': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm25,5l57,83l-7,7l-57-83z'],
			'O': ['m15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
			'P': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z'],
			'Q': ['m50,67l7-7l28,28l-7,7z', 'm15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
			'R': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm43,50h12l30,45h-12z'],
			'S': ['m85,30a25,35,270,1,0-35,25a15,25,270,1,1-25,15h-10a25,35,270,1,0,35-25a15,25,270,1,1,25-15z'],
			'T': ['m15,5v10h70v-10z', 'm45,6h10v89h-10z'],
			'U': ['m15,5h10v55a25,25,180,0,0,50,0v-55h10v55a35,35,180,0,1-70,0z'],
			'V': ['m15,5h11l29.5,90h-11z', 'm85,5h-11l-29.5,90h11z'],
			'W': ['m15,5h10l17,90h-10z', 'm45,10h10l-13,85h-10z', 'm85,5h-10l-17,90h10z', 'm55,10h-10l13,85h10z'],
			'X': ['m15,5h12l58,90h-12z', 'm15,95h12l58-90h-12z'],
			'Y': ['m15,5h12l27,42v18.67z', 'm85,5h-12l-27,42v18.67z', 'm45,48h10v47h-10z'],
			'Z': ['m15,5v10h70v-10z', 'm15,85v10h70v-10z', 'm15,85l63-77l7,7l-63,77z']
		},
		mask: {
			'C': [1],
			'G': [0, 1]
		}
	},
		str = '<svg viewBox="-50 -50 100 100">'
			+ '<rect x="-50" y="-50" width="100" height="100" fill="#77a"/>'
			+ '<rect x="-45" y="-45" width="90" height="90" fill="#faa"/>'
			+ '<g transform="scale(.55,.55)" fill="#5a5">'
			+ '</g>'
			+ '<g transform="translate(37,37) scale(.4,.4)" fill="#949">'
			+ '</g>'
			+ '</svg>',
		reg = {};
	function initial() {
		let cp = nodetext2svgnode(`<clipPath id="latinmask"><path d="M-80-80m50,50l50,30v20h-100v-100h100v20z"></path></clipPath>`);
		refpiece.append(cp);
		for (let ls in latin.script) {
			let g = nodetext2svgnode(`<g id="latin${ls}"></g>`);
			let len = latin.script[ls].length;
			for (let i = 0; i < len; i++) {
				let cpstr = ls in latin.mask && latin.mask[ls][i] == 1 ? ' clip-path="url(#latinmask)"' : '';
				let path = nodetext2svgnode(`<path d="M-80-80${latin.script[ls][i]}"${cpstr} fill-rule="evenodd"/>`);
				g.append(path);
			}
			refpiece.append(g);
		}
	}
	function style(x, y) {
		if (x in reg) {
			if (y in reg[x]) {
				return reg[x][y];
			}
		} else {
			reg[x] = {};
		}
		let svg = nodetext2svgnode(str);
		newpath(x, 0, svg);
		newpath(y, 1, svg);
		reg[x][y] = svg;
		return reg[x][y];
	}
	function newpath(ls, gn, svg) {
		let use = nodetext2svgnode(`<use xlink:href="#latin${ls}"/>`);
		svg.getElementsByTagName('g')[gn].append(use);
	}
	return {
		initial: initial,
		style: style
	};
})();
