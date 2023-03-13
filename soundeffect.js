import { geturl, savedata, setdata, imgdata } from './dataio.js';
let filename = ['move', 'warning'];
let soundeffect = Object.fromEntries(await Promise.all(filename.map(v => loadsound(`soundeffect/${v}.wav`).then(a => [v, a]))));
soundeffect.play = function (ismove) {
	if (savedata.soundeffect == false)
		return;
	if (ismove) {
		this.move.currentTime = 0;
		this.move.play();
	} else {
		this.warning.currentTime = 0;
		this.warning.play();
	}
};

export default soundeffect;
