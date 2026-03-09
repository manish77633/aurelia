const getUrl = async () => {
	const res = await fetch('https://in.pinterest.com/pin/1139481143235288475/');
	const html = await res.text();
	const matches = html.match(/https:\/\/i.pinimg.com\/[-a-zA-Z0-9@:%_+.~#?&//=]*\.jpg/gi);
	if (matches) {
		console.log(Array.from(new Set(matches)).join('\n'));
	} else {
		console.log('Not found');
	}
};
getUrl();
