(function(){
	window.vtex = window.vtex || {};
	window.vtex.locale = "pt-BR";
	var __esCountries = [ "latiendadelreloj", "comandato", "viauno",
		"lapolar", "falabella", "farmashop", "motociclo", "decogallery",
		"totto","xlshop", "tcexpress", "ciinco", "perrosygatosonline",
		"elrosado", "personalempresas", "mcgregor", "owonet", "argentinewine",
		"consentidos", "atria", "toscanaonline", "ventasprivadas", "verocajoyas",
		"tiendauat.personal.com.br", "personal", "koaladeco", "urgcolombia",
		"mascotanube", "lombardi", "nutriciaencasa", "gorsh", "olimpica",
		"motociclosports", "tcexpress", "mrpep", "jumbo", "jumbocolombia", "wong"];
	var __ref = window.location.host;

	for ( var __i = 0; __i < __esCountries.length; __i++ ) {
		if (__ref.indexOf(__esCountries[__i]) !== -1) {
			window.vtex.locale = "es-AR";
			window.vtex.localePrimary = "es";
			break;
		}
	}
})();