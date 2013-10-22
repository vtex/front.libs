(function() {
  var Context,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Context = (function() {
    function Context() {
      this.searchLocalStorage = __bind(this.searchLocalStorage, this);
      this.searchQueryString = __bind(this.searchQueryString, this);
      var cookiesContextOptions, localStorageContextOptions, queryStringContextOptions;
      cookiesContextOptions = this.searchCookies(this.whitelist, this.rules);
      queryStringContextOptions = this.searchQueryString(this.whitelist, this.rules);
      localStorageContextOptions = this.searchLocalStorage(this.whitelist, this.rules);
      _.extend(this, cookiesContextOptions, queryStringContextOptions, localStorageContextOptions);
    }

    Context.prototype.searchCookies = function(whitelist, rules) {
      var cookieKey, cookieString, cookieValue, cookies, cookiesArray, optionName, optionValue, rule, _i, _j, _k, _len, _len1, _len2;
      if (whitelist == null) {
        whitelist = [];
      }
      if (rules == null) {
        rules = [];
      }
      cookies = {};
      cookiesArray = document.cookie.split(";");
      for (_i = 0, _len = whitelist.length; _i < _len; _i++) {
        optionName = whitelist[_i];
        optionValue = _.readCookie(optionName);
        if (optionValue) {
          cookies[optionName] = JSON.parse(optionValue);
        }
      }
      for (_j = 0, _len1 = rules.length; _j < _len1; _j++) {
        rule = rules[_j];
        for (_k = 0, _len2 = cookiesArray.length; _k < _len2; _k++) {
          cookieString = cookiesArray[_k];
          cookieKey = cookieString.substr(0, cookieString.indexOf("=")).replace(/^\s+|\s+$/g, "");
          cookieValue = cookieString.substr(cookieString.indexOf("=") + 1);
          if (rule.test(cookieKey)) {
            cookies[cookieKey] = JSON.parse(cookieValue);
          }
        }
      }
      return cookies;
    };

    Context.prototype.searchQueryString = function(whitelist, rules) {
      var qs, qsArray;
      if (whitelist == null) {
        whitelist = [];
      }
      if (rules == null) {
        rules = [];
      }
      qsArray = _.urlParams();
      qs = this.searchThrough(whitelist, rules, qsArray) != null;
      return qs;
    };

    Context.prototype.searchLocalStorage = function(whitelist, rules) {
      var ls, lsArray;
      if (whitelist == null) {
        whitelist = [];
      }
      if (rules == null) {
        rules = [];
      }
      lsArray = localStorage;
      ls = this.searchThrough(whitelist, rules, lsArray) != null;
      return ls;
    };

    Context.prototype.searchThrough = function(whitelist, rules, array) {
      var a, content, rule, value, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      a = {};
      for (_i = 0, _len = whitelist.length; _i < _len; _i++) {
        value = whitelist[_i];
        for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
          content = array[_j];
          if (content === value) {
            a[value] = JSON.parse(content);
          }
        }
      }
      for (_k = 0, _len2 = rules.length; _k < _len2; _k++) {
        rule = rules[_k];
        for (_l = 0, _len3 = array.length; _l < _len3; _l++) {
          content = array[_l];
          if (content.match(rule)) {
            a[content] = JSON.parse(content.match(rule));
          }
        }
      }
      return a;
    };

    return Context;

  })();

  window.vtex || (window.vtex = {});

  window.vtex.Context = Context;

  window.vtex.context = new Context();

}).call(this);
