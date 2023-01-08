const $ = document.querySelector.bind(document);

const sanitize = (input) => {
	return filterXSS(input)
}

window.onload = () => {
	let params = parseParams(location.href);
	if (params.hasOwnProperty('search')) {
		$('#search-res').style.display = 'block';
		$('#search-msg').innerHTML = `Search results for "${sanitize(params.search)}" :`;
		// todo: add search feature
	}
}

const report = async (link, id) => {

	link.innerHTML = 'The post has been reported for review!';
	link.removeAttribute('onclick');
	link.style.color = 'black';
	link.style.fontSize = '14px';

	await fetch('/api/report', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({id}),
	})
	.catch((error) => {
		console.log(error);
	});
}