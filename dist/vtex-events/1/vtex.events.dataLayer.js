(function () {
    window.vtex = window.vtex || {};
    if(window.vtex.events) {
	    window.vtex.events.subscribe ('dataLayer', function (name, variables) {
	        variables = variables || {};
	        window.dataLayer = window.dataLayer || [];

	        if (name !== null) {
	            variables['event'] = name;
	        }
	        window.dataLayer.push(variables);
	    });
	}
})();