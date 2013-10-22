(function() {
  var VtexI18n,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.vtex = window.vtex || {};

  window.vtex.i18n = window.vtex.i18n || {};

  VtexI18n = (function() {
    var countryCode, locale;

    function VtexI18n() {
      this.callCountryCodeCallback = __bind(this.callCountryCodeCallback, this);
      this.callLocaleCallback = __bind(this.callLocaleCallback, this);
      this.translateHtml = __bind(this.translateHtml, this);
      this.getThousandsSeparator = __bind(this.getThousandsSeparator, this);
      this.getDecimalSeparator = __bind(this.getDecimalSeparator, this);
      this.getCurrency = __bind(this.getCurrency, this);
      this.setCountryCodeCallback = __bind(this.setCountryCodeCallback, this);
      this.setLocaleCallback = __bind(this.setLocaleCallback, this);
      this.setCountryCode = __bind(this.setCountryCode, this);
      this.getCountryCode = __bind(this.getCountryCode, this);
      this.setLocale = __bind(this.setLocale, this);
      this.getLocale = __bind(this.getLocale, this);
    }

    locale = null;

    countryCode = null;

    VtexI18n.prototype.getLocale = function() {
      if (locale == null) {
        locale = $('html').attr('lang') || $('meta[name="language"]').attr('content') || 'pt-BR';
      }
      return locale;
    };

    VtexI18n.prototype.setLocale = function(localeParam) {
      locale = localeParam;
      if (window.i18n) {
        window.i18n.setLng(locale);
        $('html').i18n();
        if ($("#vtex-locale-select")[0]) {
          $("#vtex-locale-select").select2("val", locale);
        }
      }
      return this.callLocaleCallback(locale);
    };

    VtexI18n.prototype.getCountryCode = function() {
      if (countryCode == null) {
        countryCode = $('meta[name="country"]').attr('content') || 'BRA';
      }
      return countryCode;
    };

    VtexI18n.prototype.setCountryCode = function(countryCodeParam) {
      countryCode = countryCodeParam;
      return this.callCountryCodeCallback(countryCode);
    };

    VtexI18n.prototype.setLocaleCallback = function(callback) {
      return this.localeCallback = callback;
    };

    VtexI18n.prototype.setCountryCodeCallback = function(callback) {
      return this.countryCodeCallback = callback;
    };

    VtexI18n.prototype.getCurrency = function(countryCodeParam) {
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'BRA':
          return 'R$ ';
        case 'USA':
          return 'US$ ';
        default:
          return '$ ';
      }
    };

    VtexI18n.prototype.getDecimalSeparator = function(countryCodeParam) {
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'BRA':
          return ',';
        case 'USA':
          return '.';
        default:
          return ',';
      }
    };

    VtexI18n.prototype.getThousandsSeparator = function(countryCodeParam) {
      countryCode = countryCodeParam ? countryCodeParam : window.vtex.i18n.getCountryCode();
      switch (countryCode) {
        case 'BRA':
          return '.';
        case 'USA':
          return ',';
        default:
          return '.';
      }
    };

    VtexI18n.prototype.translateHtml = function(selector) {
      var _base;
      if (selector == null) {
        selector = 'html';
      }
      if (window.i18n) {
        return typeof (_base = $(selector)).i18n === "function" ? _base.i18n() : void 0;
      }
    };

    /*
    	# Caso o callback seja do tipo function, chama a função
    	# Caso seja do tipo string assume-se que será chamado um canal do Radio
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

}).call(this);
