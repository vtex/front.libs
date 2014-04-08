(function() {
  window.vtex.i18n.init = function() {
    var localeText,
      _this = this;
    i18n.init({
      customLoad: function(lng, ns, options, loadComplete) {
        var dictionary, requireLang, translationFiles, _i, _len, _ref;
        if (vtex.i18n.requireLang && vtex.curl && require) {
          translationFiles = [];
          _ref = vtex.i18n.requireLang;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            requireLang = _ref[_i];
            translationFiles.push(requireLang + lng);
          }
          return require(translationFiles).then(function() {
            return loadComplete(null, vtex.i18n[lng]);
          });
        } else {
          dictionary = vtex.i18n[lng];
          if (dictionary) {
            return loadComplete(null, dictionary);
          } else {
            return loadComplete(null, vtex.i18n['pt-BR']);
          }
        }
      },
      lng: window.vtex.i18n.getLocale(),
      load: 'current',
      fallbackLng: 'pt-BR'
    });
    this.template = "<select name='locale' id='vtex-locale-select'>\n	<option></option>\n	<option value='pt-BR'>Português Brasileiro</option>\n	<option value='es'>Español</option>\n	<option value='en-US'>American English</option>\n</select>";
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
