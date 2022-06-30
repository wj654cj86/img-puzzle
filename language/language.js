var language = (() => {
	let mod = 'zh-Hant',
		reg = {},
		list = {
			'zh-Hant': "正體中文",
			'zh-Hans': "简体中文",
			'en': "English",
			'ja': "日本語"
		};
	async function initial(slt) {
		if (typeof slt != 'undefined') {
			for (let key in list) {
				let lo = document.createElement("option");
				lo.value = key;
				lo.innerHTML = list[key];
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
			reg[mod] = Object.assign({}, reg['zh-Hant'], JSON.parse(await promise(openfile, `language/${mod}.json`)));
		}
		document.getElementsByTagName('html')[0].lang = language.mod;
	}
	return {
		reg: reg,
		list: list,
		initial: initial,
		setting: setting,
		get mod() {
			return mod;
		},
		set mod(m) {
			mod = m;
		}
	}
})();
