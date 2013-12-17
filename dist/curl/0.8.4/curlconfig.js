(function() {
	window.vtex || (window.vtex = {});

	curl.config({
		apiName: 'require',
		defineContext: vtex
	});

	window.define = undefined;
})();