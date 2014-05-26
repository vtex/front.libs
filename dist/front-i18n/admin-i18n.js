(function(){
	window.vtex = window.vtex || {};
	window.vtex.locale = "pt-BR";
	var __esCountries = [ "argentinewine", "atria", "ciinco", "comandato", "complot", "consentidos", "decogallery", "elrosado", "falabella", "farmashop", "fravega", "gorsh", "jumbo", "jumbocolombia", "kalua", "koaladeco", "lapolar", "latiendadelreloj", "lombardi", "mascotanube", "mcgregor", "motociclo", "motociclosports", "mrpep", "mundotkm", "nutriciaencasa", "olimpica", "owonet", "perrosygatosonline", "personal", "personalempresas", "sportline", "tcexpress", "tiendauat.personal.com.br", "toscanaonline", "totto", "urgcolombia", "ventasprivadas", "verocajoyas", "viauno", "wong", "xlshop", "tiendasoho", "exito"];
	var __ref = window.location.host;

	for ( var __i = 0; __i < __esCountries.length; __i++ ) {
		if (__ref.indexOf(__esCountries[__i]) !== -1) {
			window.vtex.locale = "es-AR";
			window.vtex.localePrimary = "es";
			break;
		}
	}
})();
