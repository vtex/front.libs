(function() {
  window.vtex.i18n.init = function() {
    var localeText;
    i18n.init({
      customLoad: (function(_this) {
        return function(lng, ns, options, loadComplete) {
          var dictionary, i, len, ref, requireLang, translationFiles;
          if (vtex.i18n.requireLang && vtex.curl) {
            translationFiles = [];
            ref = vtex.i18n.requireLang;
            for (i = 0, len = ref.length; i < len; i++) {
              requireLang = ref[i];
              translationFiles.push(requireLang + lng);
            }
            return vtex.curl(translationFiles).then(function() {
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
        };
      })(this),
      lng: window.vtex.i18n.getLocale(),
      load: 'current',
      fallbackLng: 'pt-BR'
    });
    if ($().select2) {
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
      $('#vtex-locale-select').change((function(_this) {
        return function(e, data) {
          return window.vtex.i18n.setLocale(e.val);
        };
      })(this));
    }
    $('html').i18n();
  };

}).call(this);
