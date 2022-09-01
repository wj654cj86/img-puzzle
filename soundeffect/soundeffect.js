import { geturl, savedata, setdata, imgdata } from '../dataio.js';
export default {
	async initial() {
		this.move = await loadsound('soundeffect/move.wav');
		this.warning = await loadsound('soundeffect/warning.wav');
	},
	play(ismove) {
		if (savedata.soundeffect == false)
			return;
		if (ismove) {
			this.move.currentTime = 0;
			this.move.play();
		} else {
			this.warning.currentTime = 0;
			this.warning.play();
		}
	}
};

