let mod = 'zh-Hant',
	reg = {},
	list = {
		'zh-Hant': "正體中文",
		'zh-Hans': "简体中文",
		'en': "English",
		'ja': "日本語"
	};
async function initial(slt) {
	if (slt !== undefined) {
		for (let [key, value] of list.entries()) {
			let lo = document.createElement("option");
			lo.value = key;
			lo.innerHTML = value;
			slt.append(lo);
		}
	}
	await setting('zh-Hant');
}
async function setting(languagename) {
	if (languagename in list) {
		mod = languagename;
	} else {
		mod = 'zh-Hant';
	}
	if (!(mod in reg)) {
		reg[mod] = Object.assign({}, reg['zh-Hant'], await loadfile('json', `language/${mod}.json`));
	}
	document.querySelector('html').lang = mod;
}
export default {
	reg,
	list,
	initial,
	setting,
	get mod() {
		return mod;
	},
	set mod(m) {
		mod = m;
	}
};
