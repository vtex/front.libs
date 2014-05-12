$(function() {
	// Barcode not found modal
	var barCodeNotFoundText = "Código de barras não cadastrado";
	var barCodeFoundText = "Adicionando produto ao carrinho...";
	if ((typeof vtex !== "undefined" && vtex !== null) && vtex.i18n && vtex.i18n.locale) {
		if (vtex.i18n.locale.indexOf('es') !== -1) {
			barCodeNotFoundText = "Código de barras no registrado";
			barCodeFoundText = "Añadiendo producto al carrito...";
		} else if (vtex.i18n.locale.indexOf('en') !== -1) {
			barCodeNotFoundText = "Barcode not registered";
			barCodeFoundText = "Adding product to cart...";
		}
	}
	$("#vtex-totem-barcode-not-found p").text(barCodeNotFoundText);
	$("#vtex-totem-barcode-found p").text(barCodeFoundText);
	$("#vtex-totem-barcode-not-found").easyModal();
	$("#vtex-totem-barcode-found").easyModal();

	// Barcode handler
	var barCodeHandler = function barCodeHandler(barcode) {
		$.ajax({
			url: '/api/catalog_system/pub/sku/stockkeepingunitByEan/'+barcode
		}).success(function(sku) {
			$("#vtex-totem-barcode-found").trigger('openModal');
			$.ajax({
				url: '/api/catalog_system/pub/saleschannel/default'
			}).success(function(seller) {
				if (seller && seller.Id) {
					window.location = '/checkout/cart/add?sku='+sku.Id+'&qty=1&seller='+seller.Id+'&sc=1';
				} else {
					window.location = '/checkout/cart/add?sku='+sku.Id+'&qty=1&seller='+1+'&sc=1';
				}
			}).fail(function() {
				window.location = '/checkout/cart/add?sku='+sku.Id+'&qty=1&seller='+1+'&sc=1';
			});
		}).fail(function() {
			$("#vtex-totem-barcode-not-found").trigger('openModal');
		});
	};

	// Barcode listener
	var isTypingBarcode = false;
	var barcode = '';
	$(document).on('keydown.barcode', function(e) {
		var value = String.fromCharCode(e.keyCode);
		if (/\d/.test(value)) {
			barcode += value;
			isTypingBarcode = true;
		}
		else {
			if (isTypingBarcode && barcode.length === 13 && /\t/.test(value)) {
				barCodeHandler(barcode);
			} else {
				isTypingBarcode = false;
				barcode = '';
			}
		}
	})
});