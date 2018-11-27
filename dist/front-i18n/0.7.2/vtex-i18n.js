(function() {
  var VtexI18n,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.vtex = window.vtex || {};

  window.vtex.i18n = window.vtex.i18n || {};

  VtexI18n = (function() {
    function VtexI18n() {
      this.callCountryCodeCallback = bind(this.callCountryCodeCallback, this);
      this.callLocaleCallback = bind(this.callLocaleCallback, this);
      this.translateHtml = bind(this.translateHtml, this);
      this.setDecimalDigits = bind(this.setDecimalDigits, this);
      this.getDecimalDigits = bind(this.getDecimalDigits, this);
      this.setThousandsSeparator = bind(this.setThousandsSeparator, this);
      this.getThousandsSeparator = bind(this.getThousandsSeparator, this);
      this.setDecimalSeparator = bind(this.setDecimalSeparator, this);
      this.getDecimalSeparator = bind(this.getDecimalSeparator, this);
      this.setStartsWithCurrency = bind(this.setStartsWithCurrency, this);
      this.getStartsWithCurrency = bind(this.getStartsWithCurrency, this);
      this.setCurrency = bind(this.setCurrency, this);
      this.getCurrency = bind(this.getCurrency, this);
      this.setCountryCodeCallback = bind(this.setCountryCodeCallback, this);
      this.setCountryCode = bind(this.setCountryCode, this);
      this.getCountryCode = bind(this.getCountryCode, this);
      this.setLocaleCallback = bind(this.setLocaleCallback, this);
      this.setLocale = bind(this.setLocale, this);
      this.getLocale = bind(this.getLocale, this);
      this.locale = $('html').attr('lang') || $('meta[name="language"]').attr('content') || 'pt-BR';
      this.countryCode = $('meta[name="country"]').attr('content') || 'BRA';
      this.currency = $('meta[name="currency"]').attr('content');
      this.currency || (this.currency = (function() {
        switch (this.countryCode) {
          case 'BRA':
            return 'R$';
          case 'URY':
            return '$U';
          case 'PRY':
            return 'Gs';
          case 'PER':
            return 'S/.';
          case 'VEN':
            return 'Bs. F.';
          default:
            return '$';
        }
      }).call(this));
      this.currencyDecimalSeparator;
      this.currencyThousandsSeparator;
    }

    VtexI18n.prototype.getLocale = function() {
      return this.locale;
    };

    VtexI18n.prototype.setLocale = function(localeParam) {
      this.locale = localeParam;
      if (window.i18n) {
        window.i18n.setLng(this.locale);
        $('html').i18n();
        if ($("#vtex-locale-select")[0]) {
          $("#vtex-locale-select").select2("val", this.locale);
        }
      }
      return this.callLocaleCallback(this.locale);
    };

    VtexI18n.prototype.setLocaleCallback = function(callback) {
      return this.localeCallback = callback;
    };

    VtexI18n.prototype.getCountryCode = function() {
      return this.countryCode;
    };

    VtexI18n.prototype.setCountryCode = function(countryCodeParam) {
      this.countryCode = countryCodeParam;
      return this.callCountryCodeCallback(this.countryCode);
    };

    VtexI18n.prototype.setCountryCodeCallback = function(callback) {
      return this.countryCodeCallback = callback;
    };

    VtexI18n.prototype.getCurrency = function() {
      return this.currency + ' ';
    };

    VtexI18n.prototype.setCurrency = function(currency) {
      return this.currency = currency;
    };

    VtexI18n.prototype.getStartsWithCurrency = function(startsWithCurrency) {
      return this.startsWithCurrency;
    };

    VtexI18n.prototype.setStartsWithCurrency = function(startsWithCurrency) {
      return this.startsWithCurrency = startsWithCurrency;
    };

    VtexI18n.prototype.getDecimalSeparator = function(countryCodeParam) {
      var countryCode;
      if (this.currencyDecimalSeparator) {
        return this.currencyDecimalSeparator;
      }
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'USA':
          return '.';
        case 'URY':
          return '.';
        default:
          return ',';
      }
    };

    VtexI18n.prototype.setDecimalSeparator = function(decimalSeparator) {
      return this.currencyDecimalSeparator = decimalSeparator;
    };

    VtexI18n.prototype.getThousandsSeparator = function(countryCodeParam) {
      var countryCode;
      if (this.currencyThousandsSeparator) {
        return this.currencyThousandsSeparator;
      }
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'USA':
          return ',';
        default:
          return '.';
      }
    };

    VtexI18n.prototype.setThousandsSeparator = function(thousandsSeparator) {
      return this.currencyThousandsSeparator = thousandsSeparator;
    };

    VtexI18n.prototype.getDecimalDigits = function(countryCodeParam) {
      var countryCode;
      if (this.currencyDecimalDigits != null) {
        return this.currencyDecimalDigits;
      }
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'PRY':
          return 0;
        default:
          return 2;
      }
    };

    VtexI18n.prototype.setDecimalDigits = function(decimalDigits) {
      return this.currencyDecimalDigits = decimalDigits;
    };

    VtexI18n.prototype.translateHtml = function(selector) {
      var base;
      if (selector == null) {
        selector = 'html';
      }
      if (window.i18n) {
        return typeof (base = $(selector)).i18n === "function" ? base.i18n() : void 0;
      }
    };


    /*
    	 * Caso o callback seja do tipo function, chama a função
    	 * Caso seja do tipo string assume-se que será chamado um canal do Radio
     */

    VtexI18n.prototype.callLocaleCallback = function(val) {
      if (typeof this.localeCallback === 'function') {
        return this.localeCallback(val);
      } else if (typeof this.localeCallback === 'string' && window.radio) {
        return radio(this.localeCallback).broadcast(val);
      }
    };

    VtexI18n.prototype.callCountryCodeCallback = function(val) {
      if (typeof this.countryCodeCallback === 'function') {
        return this.countryCodeCallback(val);
      } else if (typeof this.countryCodeCallback === 'string' && window.radio) {
        return radio(this.countryCodeCallback).broadcast(val);
      }
    };

    return VtexI18n;

  })();

  $.extend(window.vtex.i18n, new VtexI18n());

  window.vtex.VtexI18n = VtexI18n;

  window.vtex.i18n.getCurrencySymbol = window.vtex.i18n.getCurrency;

}).call(this);
