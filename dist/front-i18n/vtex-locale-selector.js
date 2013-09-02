(function() {
  window.vtex.i18n.init = function() {
    var localeText,
      _this = this;
    i18n.init({
      customLoad: function(lng, ns, options, loadComplete) {
        var dictionary;
        dictionary = vtex.i18n[lng];
        if (dictionary) {
          return loadComplete(null, dictionary);
        } else {
          return loadComplete(null, vtex.i18n['pt-BR']);
        }
      },
      lng: window.vtex.i18n.getLocale(),
      load: 'current',
      fallbackLng: 'pt-BR'
    });
    this.template = "<select name='locale' id='vtex-locale-select'>\n	<option></option>\n	<option value='pt-BR'>Português Brasileiro</option>\n	<option value='es-AR'>Español Argentino</option>\n	<option value='en-US'>American English</option>\n</select>";
    $('#vtex-locale-selector').html(this.template);
    if (i18n.t('global.changeLocale') === 'global.changeLocale') {
      localeText = 'Mudar idioma';
    } else {
      localeText = i18n.t('global.changeLocale');
    }
    $('#vtex-locale-select').select2({
      placeholder: localeText
    });
    $('#vtex-locale-select').change(function(e, data) {
      return window.vtex.i18n.setLocale(e.val);
    });
    $('html').i18n();
  };

}).call(this);
