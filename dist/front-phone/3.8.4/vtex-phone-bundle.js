(function() {
  var Phone, PhoneNumber, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  PhoneNumber = (function() {
    function PhoneNumber(countryCode, nationalDestinationCode, number) {
      this.valid = __bind(this.valid, this);
      this.countryCode = countryCode;
      this.nationalDestinationCode = nationalDestinationCode;
      this.number = number;
      this.isMobile = null;
    }

    PhoneNumber.prototype.valid = function(isValid) {
      return this.valid = isValid;
    };

    return PhoneNumber;

  })();

  Phone = (function() {
    function Phone() {
      this.getCountryCodeByNameAbbr = __bind(this.getCountryCodeByNameAbbr, this);
      this.getCountryCodeByName = __bind(this.getCountryCodeByName, this);
      this.format = __bind(this.format, this);
      this.testNDC = __bind(this.testNDC, this);
      this.testCountryCode = __bind(this.testCountryCode, this);
      this.validate = __bind(this.validate, this);
      this.compact = __bind(this.compact, this);
      this.normalize = __bind(this.normalize, this);
      this.getPhoneInternational = __bind(this.getPhoneInternational, this);
      this.getPhoneNational = __bind(this.getPhoneNational, this);
      this.INTERNATIONAL = 0;
      this.NATIONAL = 1;
      this.LOCAL = 2;
    }

    Phone.prototype.getPhoneNational = function(nationalNumber, givenCountryCode, givenNationalDestinationCode) {
      var countryObj, foundNDC, nationalDestinationCode, ndcRegex, phoneNumber, withoutNDC, _i, _len, _ref, _ref1, _ref2;
      if (nationalNumber === null) {
        return null;
      }
      nationalNumber = this.normalize(nationalNumber);
      countryObj = root.vtex.phone.countries[givenCountryCode];
      if (!countryObj) {
        return null;
      }
      if (givenNationalDestinationCode) {
        nationalDestinationCode = givenNationalDestinationCode;
        _ref = this.testNDC(nationalDestinationCode, countryObj, nationalNumber), foundNDC = _ref[0], ndcRegex = _ref[1];
      } else {
        _ref1 = countryObj.nationalDestinationCode;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          nationalDestinationCode = _ref1[_i];
          _ref2 = this.testNDC(nationalDestinationCode, countryObj, nationalNumber), foundNDC = _ref2[0], ndcRegex = _ref2[1];
          if (foundNDC === true) {
            break;
          }
        }
      }
      if (!foundNDC) {
        return null;
      }
      withoutNDC = nationalNumber.replace(ndcRegex, "");
      phoneNumber = countryObj.specialRules(nationalNumber, withoutNDC, nationalDestinationCode);
      if (phoneNumber) {
        phoneNumber.valid(true);
        return phoneNumber;
      } else {
        return null;
      }
    };

    Phone.prototype.getPhoneInternational = function(number, givenCountryCode, givenNationalDestinationCode) {
      var countryCode, countryCodeRegex, countryObj, foundCountryCode, withoutCountryCode, _ref, _ref1, _ref2;
      if (number === null) {
        return null;
      }
      number = this.normalize(number);
      if (givenCountryCode) {
        countryCode = givenCountryCode;
        _ref = this.testCountryCode(countryCode, number), foundCountryCode = _ref[0], countryCodeRegex = _ref[1];
      } else {
        _ref1 = vtex.phone.countries;
        for (countryCode in _ref1) {
          countryObj = _ref1[countryCode];
          _ref2 = this.testCountryCode(countryCode, number), foundCountryCode = _ref2[0], countryCodeRegex = _ref2[1];
          if (foundCountryCode === true) {
            break;
          }
        }
      }
      if (!foundCountryCode) {
        return null;
      }
      withoutCountryCode = number.replace(countryCodeRegex, "");
      return this.getPhoneNational(withoutCountryCode, countryCode, givenNationalDestinationCode);
    };

    Phone.prototype.normalize = function(number) {
      return number.replace(/\ |\(|\)|\-|\.|[A-z]|\+/g, "");
    };

    Phone.prototype.compact = function(array) {
      var element, newArray, _i, _len;
      newArray = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        element = array[_i];
        if (element !== "") {
          newArray.push(element);
        }
      }
      return newArray;
    };

    Phone.prototype.validate = function(number, givenCountryCode) {
      var countryCode, countryObj, _ref;
      if (number === null) {
        return false;
      }
      number = this.normalize(number);
      if (givenCountryCode) {
        return vtex.phone.countries[givenCountryCode].regex.test(number);
      } else {
        _ref = vtex.phone.countries;
        for (countryCode in _ref) {
          countryObj = _ref[countryCode];
          if (countryObj.regex.test(number)) {
            return true;
          }
        }
        return false;
      }
    };

    Phone.prototype.testCountryCode = function(countryCode, number) {
      var countryCodeRegex;
      countryCodeRegex = new RegExp("^" + countryCode);
      if (countryCodeRegex.test(number)) {
        return [true, countryCodeRegex];
      } else {
        return [false, null];
      }
    };

    Phone.prototype.testNDC = function(nationalDestinationCode, countryObj, number) {
      var ndcPattern, ndcRegex;
      ndcPattern = "^(" + countryObj.optionalTrunkPrefix + "|)" + nationalDestinationCode;
      ndcRegex = new RegExp(ndcPattern);
      if (ndcRegex.test(number)) {
        return [true, ndcRegex];
      } else {
        return [false, null];
      }
    };

    Phone.prototype.format = function(phone, format) {
      var resultString, separator, splitNumber;
      if (format == null) {
        format = vtex.phone.INTERNATIONAL;
      }
      if (phone === null) {
        return null;
      }
      if (vtex.phone.countries[phone.countryCode].format) {
        return vtex.phone.countries[phone.countryCode].format(phone, format);
      }
      resultString = "";
      splitNumber = vtex.phone.countries[phone.countryCode].splitNumber(phone.number);
      switch (format) {
        case vtex.phone.INTERNATIONAL:
          resultString = "+" + phone.countryCode + " ";
          if (phone.nationalDestinationCode) {
            resultString += phone.nationalDestinationCode + " ";
          }
          resultString += splitNumber.join(" ");
          break;
        case vtex.phone.NATIONAL:
          if (phone.nationalDestinationCode) {
            resultString += "(" + phone.nationalDestinationCode + ") ";
          }
          separator = vtex.phone.countries[phone.countryCode].nationalNumberSeparator;
          resultString += splitNumber.join(separator);
          break;
        case vtex.phone.LOCAL:
          separator = vtex.phone.countries[phone.countryCode].nationalNumberSeparator;
          resultString = splitNumber.join(separator);
      }
      return resultString;
    };

    Phone.prototype.getCountryCodeByName = function(name) {
      var key, value, _ref;
      _ref = vtex.phone.countries;
      for (key in _ref) {
        value = _ref[key];
        if (value.countryName === name) {
          return value.countryCode;
        }
      }
    };

    Phone.prototype.getCountryCodeByNameAbbr = function(nameAbbr) {
      var key, value, _ref;
      _ref = vtex.phone.countries;
      for (key in _ref) {
        value = _ref[key];
        if (value.countryNameAbbr === nameAbbr) {
          return value.countryCode;
        }
      }
    };

    return Phone;

  })();

  root.vtex = root.vtex || {};

  root.vtex.phone = new Phone();

  root.vtex.phone.PhoneNumber = PhoneNumber;

}).call(this);

(function() {
  var Argentina, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Argentina = (function() {
    function Argentina() {
      this.format = __bind(this.format, this);
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Argentina";
      this.countryNameAbbr = "ARG";
      this.countryCode = '54';
      this.regex = /^(?:(?:\+|)54|)(?:0|)(?:(?:9(?:0|)(?:(?:11\d{8})|(?:(?:220|221|223|230|236|237|249|260|261|263|264|266|280|291|294|297|298|299|336|341|342|343|345|345|348|351|353|358|362|364|370|376|379|380|381|383|385|387|388)\d{7})|(?:2202|2221|2223|2224|2225|2226|2227|2229|2241|2242|2243|2244|2245|2246|2252|2254|2255|2257|2261|2262|2264|2265|2266|2267|2268|2271|2272|2273|2274|2281|2283|2284|2285|2286|2291|2292|2296|2297|2302|2314|2316|2317|2320|2323|2324|2325|2326|2331|2333|2334|2335|2337|2338|2342|2343|2344|2345|2346|2352|2353|2354|2355|2356|2357|2358|2392|2393|2394|2395|2396|2473|2474|2475|2477|2478|2622|2624|2625|2626|2646|2647|2648|2651|2655|2656|2657|2658|2901|2902|2903|2920|2921|2922|2923|2924|2925|2926|2927|2928|2929|2931|2932|2933|2934|2935|2936|2940|2942|2945|2946|2948|2952|2953|2954|2962|2963|2964|2966|2972|2982|2983|3327|3329|3382|3385|3387|3388|3400|3401|3402|3404|3405|3406|3407|3408|3409|3435|3436|3437|3438|3442|3444|3445|3446|3447|3454|3455|3456|3458|3460|3462|3463|3464|3465|3466|3467|3468|3469|3471|3472|3476|3482|3483|3487|3489|3491|3492|3493|3496|3497|3498|3521|3522|3524|3525|3532|3533|3537|3541|3542|3543|3544|3546|3547|3548|3549|3562|3563|3564|3571|3572|3573|3574|3575|3576|3582|3583|3584|3585|3711|3715|3716|3718|3721|3725|3731|3734|3735|3741|3743|3751|3754|3755|3756|3757|3758|3772|3773|3774|3775|3777|3781|3782|3786|3821|3825|3826|3827|3832|3835|3837|3838|3841|3843|3844|3845|3846|3854|3855|3856|3857|3858|3861|3862|3863|3865|3867|3868|3869|3873|3876|3877|3878|3885|3886|3887|3888|3891|3892|3894)\d{6}))|(?:(?:11(?:15\d{8}|(?!15)\d{8}))|(?:(?:220|221|223|230|236|237|249|260|261|263|264|266|280|291|294|297|298|299|336|341|342|343|345|345|348|351|353|358|362|364|370|376|379|380|381|383|385|387|388)(?:15\d{7}|(?!15)\d{7}))|(?:2202|2221|2223|2224|2225|2226|2227|2229|2241|2242|2243|2244|2245|2246|2252|2254|2255|2257|2261|2262|2264|2265|2266|2267|2268|2271|2272|2273|2274|2281|2283|2284|2285|2286|2291|2292|2296|2297|2302|2314|2316|2317|2320|2323|2324|2325|2326|2331|2333|2334|2335|2337|2338|2342|2343|2344|2345|2346|2352|2353|2354|2355|2356|2357|2358|2392|2393|2394|2395|2396|2473|2474|2475|2477|2478|2622|2624|2625|2626|2646|2647|2648|2651|2655|2656|2657|2658|2901|2902|2903|2920|2921|2922|2923|2924|2925|2926|2927|2928|2929|2931|2932|2933|2934|2935|2936|2940|2942|2945|2946|2948|2952|2953|2954|2962|2963|2964|2966|2972|2982|2983|3327|3329|3382|3385|3387|3388|3400|3401|3402|3404|3405|3406|3407|3408|3409|3435|3436|3437|3438|3442|3444|3445|3446|3447|3454|3455|3456|3458|3460|3462|3463|3464|3465|3466|3467|3468|3469|3471|3472|3476|3482|3483|3487|3489|3491|3492|3493|3496|3497|3498|3521|3522|3524|3525|3532|3533|3537|3541|3542|3543|3544|3546|3547|3548|3549|3562|3563|3564|3571|3572|3573|3574|3575|3576|3582|3583|3584|3585|3711|3715|3716|3718|3721|3725|3731|3734|3735|3741|3743|3751|3754|3755|3756|3757|3758|3772|3773|3774|3775|3777|3781|3782|3786|3821|3825|3826|3827|3832|3835|3837|3838|3841|3843|3844|3845|3846|3854|3855|3856|3857|3858|3861|3862|3863|3865|3867|3868|3869|3873|3876|3877|3878|3885|3886|3887|3888|3891|3892|3894)(?:15\d{6}|(?!15)\d{6})))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = '-';
      this.nationalDestinationCode = ['9', '11', '220', '221', '223', '230', '236', '237', '249', '260', '261', '263', '264', '266', '280', '291', '294', '297', '298', '299', '336', '341', '342', '343', '345', '345', '348', '351', '353', '358', '362', '364', '370', '376', '379', '380', '381', '383', '385', '387', '388', '2202', '2221', '2223', '2224', '2225', '2226', '2227', '2229', '2241', '2242', '2243', '2244', '2245', '2246', '2252', '2254', '2255', '2257', '2261', '2262', '2264', '2265', '2266', '2267', '2268', '2271', '2272', '2273', '2274', '2281', '2283', '2284', '2285', '2286', '2291', '2292', '2296', '2297', '2302', '2314', '2316', '2317', '2320', '2323', '2324', '2325', '2326', '2331', '2333', '2334', '2335', '2337', '2338', '2342', '2343', '2344', '2345', '2346', '2352', '2353', '2354', '2355', '2356', '2357', '2358', '2392', '2393', '2394', '2395', '2396', '2473', '2474', '2475', '2477', '2478', '2622', '2624', '2625', '2626', '2646', '2647', '2648', '2651', '2655', '2656', '2657', '2658', '2901', '2902', '2903', '2920', '2921', '2922', '2923', '2924', '2925', '2926', '2927', '2928', '2929', '2931', '2932', '2933', '2934', '2935', '2936', '2940', '2942', '2945', '2946', '2948', '2952', '2953', '2954', '2962', '2963', '2964', '2966', '2972', '2982', '2983', '3327', '3329', '3382', '3385', '3387', '3388', '3400', '3401', '3402', '3404', '3405', '3406', '3407', '3408', '3409', '3435', '3436', '3437', '3438', '3442', '3444', '3445', '3446', '3447', '3454', '3455', '3456', '3458', '3460', '3462', '3463', '3464', '3465', '3466', '3467', '3468', '3469', '3471', '3472', '3476', '3482', '3483', '3487', '3489', '3491', '3492', '3493', '3496', '3497', '3498', '3521', '3522', '3524', '3525', '3532', '3533', '3537', '3541', '3542', '3543', '3544', '3546', '3547', '3548', '3549', '3562', '3563', '3564', '3571', '3572', '3573', '3574', '3575', '3576', '3582', '3583', '3584', '3585', '3711', '3715', '3716', '3718', '3721', '3725', '3731', '3734', '3735', '3741', '3743', '3751', '3754', '3755', '3756', '3757', '3758', '3772', '3773', '3774', '3775', '3777', '3781', '3782', '3786', '3821', '3825', '3826', '3827', '3832', '3835', '3837', '3838', '3841', '3843', '3844', '3845', '3846', '3854', '3855', '3856', '3857', '3858', '3861', '3862', '3863', '3865', '3867', '3868', '3869', '3873', '3876', '3877', '3878', '3885', '3886', '3887', '3888', '3891', '3892', '3894'];
    }

    Argentina.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var foundNDC, nationalDestinationCode, ndcArray, ndcRegex, phone, _i, _len, _ref;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (ndc === '9') {
        withoutCountryCode = withoutNDC;
        ndcArray = this.nationalDestinationCode.slice(1);
        for (_i = 0, _len = ndcArray.length; _i < _len; _i++) {
          nationalDestinationCode = ndcArray[_i];
          _ref = vtex.phone.testNDC(nationalDestinationCode, this, withoutCountryCode), foundNDC = _ref[0], ndcRegex = _ref[1];
          if (foundNDC === true) {
            break;
          }
        }
        if (!foundNDC) {
          return null;
        }
        withoutNDC = withoutCountryCode.replace(ndcRegex, "");
        if (withoutNDC.length + nationalDestinationCode.length !== 10) {
          return null;
        }
        phone.isMobile = true;
        phone.nationalDestinationCode = nationalDestinationCode;
        phone.number = withoutNDC;
        return phone;
      } else if (/^15/.test(withoutNDC) && (ndc.length + withoutNDC.length) === 12) {
        withoutNDC = withoutNDC.replace(/^15/, "");
        phone.isMobile = true;
        phone.number = withoutNDC;
        return phone;
      } else if ((ndc.length + withoutNDC.length) === 10) {
        return phone;
      }
    };

    Argentina.prototype.splitNumber = function(number) {
      switch (number.length) {
        case 8:
          return vtex.phone.compact(number.split(/(\d{4})(\d{4})/));
        case 7:
          return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
        case 6:
          return vtex.phone.compact(number.split(/(\d{2})(\d{4})/));
      }
      return [number];
    };

    Argentina.prototype.format = function(phone, format) {
      var resultString, separator, splitNumber;
      if (format == null) {
        format = vtex.phone.INTERNATIONAL;
      }
      resultString = "";
      splitNumber = vtex.phone.countries[phone.countryCode].splitNumber(phone.number);
      switch (format) {
        case vtex.phone.INTERNATIONAL:
          resultString = "+" + phone.countryCode + " ";
          if (phone.isMobile) {
            resultString += "9 ";
          }
          if (phone.nationalDestinationCode) {
            resultString += phone.nationalDestinationCode + " ";
          }
          resultString += splitNumber.join(" ");
          break;
        case vtex.phone.NATIONAL:
          if (phone.nationalDestinationCode) {
            resultString += "(" + phone.nationalDestinationCode + ") ";
          }
          separator = vtex.phone.countries[phone.countryCode].nationalNumberSeparator;
          if (phone.isMobile) {
            resultString += "15 ";
          }
          resultString += splitNumber.join(separator);
          break;
        case vtex.phone.LOCAL:
          separator = vtex.phone.countries[phone.countryCode].nationalNumberSeparator;
          resultString = splitNumber.join(separator);
          break;
        default:
          resultString = "";
      }
      return resultString;
    };

    return Argentina;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['54'] = new Argentina();

}).call(this);

(function() {
  var Brazil, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Brazil = (function() {
    function Brazil() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Brazil";
      this.countryNameAbbr = "BRA";
      this.countryCode = '55';
      this.regex = /^(?:(?:(?:\+|)(?:55|)|))(?:0|)(?:(?:(?:11|12|13|14|15|16|17|18|19|21|22|24|27|28)(?:9\d{8}|\d{8}))|(?:(?:11|12|13|14|15|16|17|18|19|21|22|24|27|28|31|32|33|34|35|36|37|38|41|42|43|44|45|46|47|48|49|51|52|53|54|55|61|62|63|64|65|66|67|68|69|71|72|73|74|75|77|78|79|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{8}))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = '-';
      this.nationalDestinationCode = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '72', '73', '74', '75', '77', '78', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    }

    Brazil.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var nineDigitsNDC, nineDigitsPattern, phone;
      nineDigitsNDC = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'];
      nineDigitsPattern = new RegExp("^(0|)(" + nineDigitsNDC.join("|") + ")");
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (withoutNDC.length === 9 && withoutNDC.indexOf("9") === 0 && nineDigitsPattern.test(ndc)) {
        phone.isMobile = true;
        return phone;
      } else {
        if (withoutNDC.length === 8) {
          return phone;
        }
      }
    };

    Brazil.prototype.splitNumber = function(number) {
      if (number.length === 8) {
        return vtex.phone.compact(number.split(/(\d{4})(\d{4})/));
      } else if (number.length === 9 && number.indexOf("9") === 0) {
        return vtex.phone.compact(number.split(/(\d{5})(\d{4})/));
      }
      return [number];
    };

    return Brazil;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['55'] = new Brazil();

}).call(this);

(function() {
  var Chile, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Chile = (function() {
    function Chile() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Chile";
      this.countryNameAbbr = "CHL";
      this.countryCode = '56';
      this.regex = /^(?:(?:\+|)56|)(?:0|)(?:(?:(?:2|9)\d{8})|(?:58\d{7})|(?:(?:3[2345]|4[1235]|5[123578]|6[134578]|7[1235])\d{6,7}))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['2', '32', '33', '34', '35', '41', '42', '43', '45', '51', '52', '53', '55', '57', '58', '61', '63', '64', '65', '67', '68', '71', '72', '73', '75', '9'];
    }

    Chile.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      switch (ndc) {
        case '2':
          if (withoutNDC.length === 8) {
            return phone;
          }
          break;
        case '9':
          if (withoutNDC.length === 8) {
            phone.isMobile = true;
            phone.nationalDestinationCode = '';
            phone.number = withoutCountryCode;
            return phone;
          }
          break;
        case '58':
          if (withoutNDC.length === 7) {
            return phone;
          }
          break;
        default:
          if (withoutNDC.length === 6 || withoutNDC.length === 7) {
            return phone;
          }
      }
    };

    Chile.prototype.splitNumber = function(number) {
      switch (number.length) {
        case 9:
          return vtex.phone.compact(number.split(/(\d{1})(\d{4})(\d{4})/));
        case 8:
          return vtex.phone.compact(number.split(/(\d{4})(\d{4})/));
        case 7:
          return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
        case 6:
          return vtex.phone.compact(number.split(/(\d{2})(\d{4})/));
      }
      return [number];
    };

    return Chile;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['56'] = new Chile();

}).call(this);

(function() {
  var Colombia, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Colombia = (function() {
    function Colombia() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Colombia";
      this.countryNameAbbr = "COL";
      this.countryCode = '57';
      this.regex = /^(?:(?:\+|)57|)(?:0|)(?:(?:[12345678]\d{7})|(?:3\d{9}))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['3(\\d{2})', '1', '2', '3', '4', '5', '6', '7', '8'];
    }

    Colombia.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, '', withoutNDC);
      if (withoutCountryCode.indexOf('3') === 0 && withoutCountryCode.length === 10) {
        phone.isMobile = true;
        phone.number = withoutCountryCode;
        phone.nationalDestinationCode = '';
        return phone;
      } else {
        if (withoutNDC.length === 7) {
          phone.nationalDestinationCode = ndc;
          return phone;
        }
      }
    };

    Colombia.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else if (number.length === 10) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{3})(\d{4})/));
      }
      return [number];
    };

    return Colombia;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['57'] = new Colombia();

}).call(this);

(function() {
  var Ecuador, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Ecuador = (function() {
    function Ecuador() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Ecuador";
      this.countryNameAbbr = "ECU";
      this.countryCode = '593';
      this.regex = /^(?:(?:(?:\+|)593)|)(?:0|)(?:(?:(?:[234567])\d{7})|(?:9\d{8}))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['2', '3', '4', '5', '6', '7', '9'];
    }

    Ecuador.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (withoutNDC.length === 7 && ndc !== '9') {
        return phone;
      } else if (ndc === '9' && withoutNDC.length === 8) {
        phone.isMobile = true;
        phone.number = withoutCountryCode;
        phone.nationalDestinationCode = '';
        return phone;
      }
    };

    Ecuador.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else if (number.length === 9) {
        if (number.indexOf("9") === 0) {
          return vtex.phone.compact(number.split(/(\d{2})(\d{3})(\d{4})/));
        }
      }
      return [number];
    };

    return Ecuador;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['593'] = new Ecuador();

}).call(this);

(function() {
  var UnitedKingdom, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  UnitedKingdom = (function() {
    function UnitedKingdom() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "United Kingdom";
      this.countryNameAbbr = "GBR";
      this.countryCode = '44';
      this.regex = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/;
      this.mobileRegex = /^7(?:[1-4]\d\d|5(?:0[0-8]|[13-9]\d|2[0-35-9])|624|7(?:0[1-9]|[1-7]\d|8[02-9]|9[0-689])|8(?:[014-9]\d|[23][0-8])|9(?:[04-9]\d|1[02-9]|2[0-35-9]|3[0-689]))\d{6}$/;
      this.splitRegexs = [
        {
          validLengths: [10],
          leadingDigits: /^(?:2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9])))/,
          pattern: /^(\d{2})(\d{4})(\d{4})$/,
          format: "$1 $2 $3"
        }, {
          validLengths: [10],
          leadingDigits: /^(?:1(?:1|\d1)|3[0347]|9[018])/,
          pattern: /^(\d{3})(\d{3})(\d{4})$/,
          format: "$1 $2 $3"
        }, {
          validLengths: [9, 10],
          leadingDigits: /^(?:1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467))/,
          pattern: /^(\d{5})(\d{4,5})$/,
          format: "$1 $2"
        }, {
          validLengths: [9, 10],
          leadingDigits: /^1/,
          pattern: /^(1\d{3})(\d{5,6})$/,
          format: "$1 $2"
        }, {
          validLengths: [10],
          leadingDigits: /^7(?:[1-5789]|624)/,
          pattern: /^(7\d{3})(\d{6})$/,
          format: "$1 $2"
        }, {
          validLengths: [7],
          leadingDigits: /^8001111/,
          pattern: /^(800)(\d{4})$/,
          format: "$1 $2"
        }, {
          validLengths: [7],
          leadingDigits: /^84546\d/,
          pattern: /^(845)(46)(4\d)$/,
          format: "$1 $2 $3"
        }, {
          validLengths: [10],
          leadingDigits: /^8(?:4[2-5]|7[0-3])/,
          pattern: /^(8\d{2})(\d{3})(\d{4})$/,
          format: "$1 $2 $3"
        }, {
          validLengths: [10],
          leadingDigits: /^80[08]/,
          pattern: /^(80\d)(\d{3})(\d{4})$/,
          format: "$1 $2 $3"
        }, {
          validLengths: [9],
          leadingDigits: /^[58]00/,
          pattern: /^([58]00)(\d{6})$/,
          format: "$1 $2"
        }
      ];
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ["20", "23", "24", "28", "29", "113", "114", "115", "116", "117", "118", "1200", "1202", "1204", "1205", "1206", "1207", "1208", "1209", "121", "1223", "1224", "1225", "1226", "1227", "1228", "1229", "1233", "1234", "1235", "1236", "1237", "1239", "1241", "1242", "1243", "1244", "1245", "1246", "1248", "1249", "1250", "1252", "1253", "1254", "1255", "1256", "1257", "1258", "1259", "1260", "1261", "1262", "1263", "1264", "1267", "1268", "1269", "1270", "1271", "1273", "1274", "1275", "1276", "1277", "1278", "1279", "1280", "1282", "1283", "1284", "1285", "1286", "1287", "1288", "1289", "1290", "1291", "1292", "1293", "1294", "1295", "1296", "1297", "1298", "1299", "1300", "1301", "1302", "1303", "1304", "1305", "1306", "1307", "1308", "1309", "131", "1320", "1322", "1323", "1324", "1325", "1326", "1327", "1328", "1329", "1330", "1332", "1333", "1334", "1335", "1337", "1339", "1340", "1341", "1342", "1343", "1344", "1346", "1347", "1348", "1349", "1350", "1352", "1353", "1354", "1355", "1356", "1357", "1358", "1359", "1360", "1361", "1362", "1363", "1364", "1366", "1367", "1368", "1369", "1371", "1372", "1373", "1375", "1376", "1377", "1379", "1380", "1381", "1382", "1383", "1384", "1386", "1387", "13873", "1388", "1389", "1392", "1394", "1395", "1397", "1398", "1400", "1403", "1404", "1405", "1406", "1407", "1408", "1409", "141", "1420", "1422", "1423", "1424", "1425", "1427", "1428", "1429", "1430", "1431", "1432", "1433", "1434", "1435", "1436", "1437", "1438", "1439", "1440", "1442", "1443", "1444", "1445", "1446", "1449", "1450", "1451", "1452", "1453", "1454", "1455", "1456", "1457", "1458", "1460", "1461", "1462", "1463", "1464", "1465", "1466", "1467", "1469", "1470", "1471", "1472", "1473", "1474", "1475", "1476", "1477", "1478", "1479", "1480", "1481", "1482", "1483", "1484", "1485", "1487", "1488", "1489", "1490", "1491", "1492", "1493", "1494", "1495", "1496", "1497", "1499", "1501", "1502", "1503", "1505", "1506", "1507", "1508", "1509", "151", "1520", "1522", "1524", "15242", "1525", "1526", "1527", "1528", "1529", "1530", "1531", "1534", "1535", "1536", "1538", "1539", "15394", "15395", "15396", "1540", "1542", "1543", "1544", "1545", "1546", "1547", "1548", "1549", "1550", "1553", "1554", "1555", "1556", "1557", "1558", "1559", "1560", "1561", "1562", "1563", "1564", "1565", "1566", "1567", "1568", "1569", "1570", "1571", "1572", "1573", "1575", "1576", "1577", "1578", "1579", "1580", "1581", "1582", "1583", "1584", "1586", "1588", "1590", "1591", "1592", "1593", "1594", "1595", "1597", "1598", "1599", "1600", "1603", "1604", "1606", "1608", "1609", "161", "1620", "1621", "1622", "1623", "1624", "1625", "1626", "1628", "1629", "1630", "1631", "1633", "1634", "1635", "1636", "1637", "1638", "1639", "1641", "1642", "1643", "1644", "1646", "1647", "1650", "1651", "1652", "1653", "1654", "1655", "1656", "1659", "1661", "1663", "1664", "1665", "1666", "1667", "1668", "1669", "1670", "1671", "1672", "1673", "1674", "1675", "1676", "1677", "1678", "1680", "1681", "1683", "1684", "1685", "1686", "1687", "1688", "1689", "1690", "1691", "1692", "1694", "1695", "1697", "16973", "16974", "1698", "1700", "1702", "1704", "1706", "1707", "1708", "1709", "1720", "1721", "1722", "1723", "1724", "1725", "1726", "1727", "1728", "1729", "1730", "1732", "1733", "1736", "1737", "1738", "1740", "1743", "1744", "1745", "1746", "1747", "1748", "1749", "1750", "1751", "1752", "1753", "1754", "1756", "1757", "1758", "1759", "1760", "1761", "1763", "1764", "1765", "1766", "1767", "1768", "17683", "17684", "17687", "1769", "1770", "1771", "1772", "1773", "1775", "1776", "1777", "1778", "1779", "1780", "1782", "1784", "1785", "1786", "1787", "1788", "1789", "1790", "1792", "1793", "1794", "1795", "1796", "1797", "1798", "1799", "1803", "1805", "1806", "1807", "1808", "1809", "1821", "1822", "1823", "1824", "1825", "1827", "1828", "1829", "1830", "1832", "1833", "1834", "1835", "1837", "1838", "1840", "1841", "1842", "1843", "1844", "1845", "1847", "1848", "1851", "1852", "1854", "1855", "1856", "1857", "1858", "1859", "1862", "1863", "1864", "1865", "1866", "1869", "1870", "1871", "1872", "1873", "1874", "1875", "1876", "1877", "1878", "1879", "1880", "1882", "1883", "1884", "1885", "1886", "1887", "1888", "1889", "1890", "1892", "1895", "1896", "1899", "1900", "1902", "1903", "1904", "1905", "1908", "1909", "191", "1920", "1922", "1923", "1924", "1925", "1926", "1928", "1929", "1931", "1932", "1933", "1934", "1935", "1937", "1938", "1939", "1942", "1943", "1944", "1945", "1946", "19467", "1947", "1948", "1949", "1950", "1951", "1952", "1953", "1954", "1955", "1957", "1959", "1962", "1963", "1964", "1967", "1968", "1969", "1970", "1971", "1972", "1974", "1975", "1977", "1978", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1992", "1993", "1994", "1995", "1997"];
    }

    UnitedKingdom.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (withoutNDC.length === 10 && this.mobileRegex.test(withoutNDC)) {
        phone.isMobile = true;
      }
      return phone;
    };

    UnitedKingdom.prototype.splitNumber = function(number) {
      var findSplitter, splitter;
      findSplitter = (function() {
        return function(nmbr, splitRegexs) {
          var potentialSplitGrp, _i, _len, _ref;
          for (_i = 0, _len = splitRegexs.length; _i < _len; _i++) {
            potentialSplitGrp = splitRegexs[_i];
            if ((_ref = nmbr.length, __indexOf.call(potentialSplitGrp.validLengths, _ref) >= 0) && potentialSplitGrp.leadingDigits.test(nmbr)) {
              return potentialSplitGrp;
            }
          }
        };
      })();
      splitter = findSplitter(number, this.splitRegexs);
      if (splitter) {
        return vtex.phone.compact(number.split(splitter.pattern));
      } else {
        return [number];
      }
    };

    return UnitedKingdom;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['44'] = new UnitedKingdom();

}).call(this);

(function() {
  var Mexico, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Mexico = (function() {
    function Mexico() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Mexico";
      this.countryNameAbbr = "MEX";
      this.countryCode = '52';
      this.regex = /^(?:(?:\+|)52|)(?:(?:33|55|81)\d{8}|(?:222|223|224|225|226|227|228|229|231|232|233|235|236|237|238|241|243|244|245|246|247|248|249|271|272|273|274|275|276|278|279|281|282|283|284|285|287|288|294|296|297|311|312|313|314|315|316|317|318|319|321|322|323|324|325|326|327|328|329|341|342|343|344|345|346|347|348|349|351|352|353|354|355|356|357|358|359|371|372|373|374|375|376|377|378|379|381|382|383|384|385|386|387|388|389|391|392|393|394|395|411|412|413|414|415|417|418|419|421|422|423|424|425|426|427|428|429|431|432|433|434|435|436|437|438|441|442|443|444|445|447|448|449|451|452|453|454|455|456|457|458|459|461|462|463|464|465|466|467|468|469|471|472|473|474|475|476|477|478|481|482|483|485|486|487|488|489|492|493|494|495|496|498|499|588|591|592|593|594|595|596|597|599|612|613|614|615|616|618|621|622|623|624|625|626|627|628|629|631|632|633|634|635|636|637|638|639|641|642|643|644|645|646|647|648|649|651|652|653|656|658|659|661|662|664|665|667|668|669|671|672|673|674|675|676|677|686|687|694|695|696|697|698|711|712|713|714|715|716|717|718|719|721|722|723|724|725|726|727|728|729|731|732|733|734|735|736|737|738|739|741|742|743|744|745|746|747|748|749|751|753|754|755|756|757|758|759|761|762|763|764|765|766|767|768|769|771|772|773|774|775|776|777|778|779|781|782|783|784|785|786|789|791|797|821|823|824|825|826|827|828|829|831|832|833|834|835|836|841|842|844|845|846|861|862|864|866|867|868|869|871|872|873|877|878|891|892|894|897|899|913|914|916|917|918|919|921|922|923|924|932|933|934|936|937|938|951|953|954|958|961|962|963|964|965|966|967|968|969|971|972|981|982|983|984|985|986|987|988|991|992|993|994|995|996|997|998|999)\d{7})$/;
      this.optionalTrunkPrefix = '';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ["33", "55", "81", "222", "223", "224", "225", "226", "227", "228", "229", "231", "232", "233", "235", "236", "237", "238", "241", "243", "244", "245", "246", "247", "248", "249", "271", "272", "273", "274", "275", "276", "278", "279", "281", "282", "283", "284", "285", "287", "288", "294", "296", "297", "311", "312", "313", "314", "315", "316", "317", "318", "319", "321", "322", "323", "324", "325", "326", "327", "328", "329", "341", "342", "343", "344", "345", "346", "347", "348", "349", "351", "352", "353", "354", "355", "356", "357", "358", "359", "371", "372", "373", "374", "375", "376", "377", "378", "379", "381", "382", "383", "384", "385", "386", "387", "388", "389", "391", "392", "393", "394", "395", "411", "412", "413", "414", "415", "417", "418", "419", "421", "422", "423", "424", "425", "426", "427", "428", "429", "431", "432", "433", "434", "435", "436", "437", "438", "441", "442", "443", "444", "445", "447", "448", "449", "451", "452", "453", "454", "455", "456", "457", "458", "459", "461", "462", "463", "464", "465", "466", "467", "468", "469", "471", "472", "473", "474", "475", "476", "477", "478", "481", "482", "483", "485", "486", "487", "488", "489", "492", "493", "494", "495", "496", "498", "499", "588", "591", "592", "593", "594", "595", "596", "597", "599", "612", "613", "614", "615", "616", "618", "621", "622", "623", "624", "625", "626", "627", "628", "629", "631", "632", "633", "634", "635", "636", "637", "638", "639", "641", "642", "643", "644", "645", "646", "647", "648", "649", "651", "652", "653", "656", "658", "659", "661", "662", "664", "665", "667", "668", "669", "671", "672", "673", "674", "675", "676", "677", "686", "687", "694", "695", "696", "697", "698", "711", "712", "713", "714", "715", "716", "717", "718", "719", "721", "722", "723", "724", "725", "726", "727", "728", "729", "731", "732", "733", "734", "735", "736", "737", "738", "739", "741", "742", "743", "744", "745", "746", "747", "748", "749", "751", "753", "754", "755", "756", "757", "758", "759", "761", "762", "763", "764", "765", "766", "767", "768", "769", "771", "772", "773", "774", "775", "776", "777", "778", "779", "781", "782", "783", "784", "785", "786", "789", "791", "797", "821", "823", "824", "825", "826", "827", "828", "829", "831", "832", "833", "834", "835", "836", "841", "842", "844", "845", "846", "861", "862", "864", "866", "867", "868", "869", "871", "872", "873", "877", "878", "891", "892", "894", "897", "899", "913", "914", "916", "917", "918", "919", "921", "922", "923", "924", "932", "933", "934", "936", "937", "938", "951", "953", "954", "958", "961", "962", "963", "964", "965", "966", "967", "968", "969", "971", "972", "981", "982", "983", "984", "985", "986", "987", "988", "991", "992", "993", "994", "995", "996", "997", "998", "999"];
    }

    Mexico.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      if (withoutNDC.length === 7 || withoutNDC.length === 8) {
        return new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      }
    };

    Mexico.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else if (number.length === 8) {
        return vtex.phone.compact(number.split(/(\d{4})(\d{4})/));
      }
      return [number];
    };

    return Mexico;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['52'] = new Mexico();

}).call(this);

(function() {
  var Paraguay, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Paraguay = (function() {
    function Paraguay() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Paraguay";
      this.countryNameAbbr = "PRY";
      this.countryCode = '595';
      this.regex = /^(?:(?:\+|)595|)(?:0|)(?:(?:(?:21|32|38|39|41|44|46|47|48|61|71|72|73|81|83)(?:\d{7}))|(?:(?:21|32|38|39|41|44|46|47|48|61|71|72|73|81|83|220|224|225|226|228|271|275|291|292|293|294|295|318|330|331|336|337|342|343|345|347|350|351|360|370|418|420|424|425|431|432|451|453|464|471|491|492|493|494|497|510|511|512|513|514|515|516|517|518|519|520|521|522|523|524|525|526|527|528|529|530|531|532|533|534|535|536|537|538|539|540|541|542|543|544|545|546|547|548|549|550|552|553|554|570|571|572|573|580|631|632|633|644|660|671|672|673|674|676|677|678|717|740|741|742|743|744|750|762|763|764|765|767|768|770|775|780|781|782|783|784|785|786|787|788|790|858|961|962|971|972|973|975|976|981|982|983|984|985|991|992|993|995)(?:\d{6})))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['21', '32', '38', '39', '41', '44', '46', '47', '48', '61', '71', '72', '73', '81', '83', '220', '224', '225', '226', '228', '271', '275', '291', '292', '293', '294', '295', '318', '330', '331', '336', '337', '342', '343', '345', '347', '350', '351', '360', '370', '418', '420', '424', '425', '431', '432', '451', '453', '464', '471', '491', '492', '493', '494', '497', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '540', '541', '542', '543', '544', '545', '546', '547', '548', '549', '550', '552', '553', '554', '570', '571', '572', '573', '580', '631', '632', '633', '644', '660', '671', '672', '673', '674', '676', '677', '678', '717', '740', '741', '742', '743', '744', '750', '762', '763', '764', '765', '767', '768', '770', '775', '780', '781', '782', '783', '784', '785', '786', '787', '788', '790', '858', '961', '962', '971', '972', '973', '975', '976', '981', '982', '983', '984', '985', '991', '992', '993', '995'];
    }

    Paraguay.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (ndc.length === 3 && ndc[0] === '9') {
        phone.isMobile = true;
      }
      return phone;
    };

    Paraguay.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else {
        return vtex.phone.compact(number.split(/(\d{3})(\d{3})/));
      }
      return [number];
    };

    return Paraguay;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['595'] = new Paraguay();

}).call(this);

(function() {
  var Peru, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Peru = (function() {
    function Peru() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Peru";
      this.countryNameAbbr = "PER";
      this.countryCode = '51';
      this.regex = /^(?:(?:\+|)51|)(?:0|)(?:(?:1\d{7})|(?:9\d{8})|(?:(?:4[1234]|5[12346]|6[1234567]|7[2346]|8[234])\d{6}))$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['1', '9', '41', '42', '43', '44', '51', '52', '53', '54', '56', '61', '62', '63', '64', '65', '66', '67', '72', '73', '74', '76', '82', '83', '84'];
    }

    Peru.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if (ndc === '1' && withoutNDC.length === 7) {
        return phone;
      } else if (ndc === '9' && withoutNDC.length === 8) {
        phone.isMobile = true;
        phone.nationalDestinationCode = '';
        phone.number = withoutCountryCode;
        return phone;
      } else if (ndc.length === 2 && withoutNDC.length === 6) {
        return phone;
      }
    };

    Peru.prototype.splitNumber = function(number) {
      if (number.length === 6) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{3})/));
      } else if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else if (number.length === 9) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{3})(\d{3})/));
      }
      return [number];
    };

    return Peru;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['51'] = new Peru();

}).call(this);

(function() {
  var Uruguay, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Uruguay = (function() {
    function Uruguay() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "Uruguay";
      this.countryNameAbbr = "URY";
      this.countryCode = '598';
      this.regex = /^(?:(?:\+|)598|)(?:0|)(?:[249]\d{7})$/;
      this.optionalTrunkPrefix = '0';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['2', '4', '9'];
    }

    Uruguay.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      var phone;
      phone = new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      if ((ndc.length + withoutNDC.length) === 8) {
        if (ndc === '9') {
          phone.isMobile = true;
        }
        phone.nationalDestinationCode = '';
        phone.number = withoutCountryCode;
        return phone;
      }
    };

    Uruguay.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      } else if (number.length === 8) {
        return vtex.phone.compact(number.split(/(\d{4})(\d{4})/));
      }
      return [number];
    };

    return Uruguay;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['598'] = new Uruguay();

}).call(this);

(function() {
  var USA, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  USA = (function() {
    function USA() {
      this.splitNumber = __bind(this.splitNumber, this);
      this.specialRules = __bind(this.specialRules, this);
      this.countryName = "USA";
      this.countryNameAbbr = "USA";
      this.countryCode = '1';
      this.regex = /^(?:(?:(?:\+|)(?:1|))|)(?:1|)(?:201|202|203|205|206|207|208|209|209|210|212|213|214|215|216|217|218|219|224|225|227|228|229|231|234|239|240|248|251|252|253|254|256|260|262|267|269|270|274|276|278|281|283|301|302|303|304|305|307|308|309|310|312|313|314|315|316|317|318|319|320|321|323|325|330|331|334|336|337|339|341|347|351|352|360|361|364|369|380|385|386|401|402|404|405|406|407|408|409|410|412|413|414|415|417|419|423|424|425|430|432|434|435|440|442|443|445|447|458|464|469|470|475|478|479|480|484|501|502|503|504|505|507|508|509|510|512|513|515|516|517|518|520|530|531|534|540|541|551|557|559|561|562|563|564|567|570|571|573|574|575|580|585|586|601|602|603|605|606|607|608|609|610|612|614|615|616|617|618|619|620|623|626|627|628|630|631|636|641|646|650|651|657|659|660|661|662|667|669|678|679|681|682|689|701|702|703|704|706|707|708|712|713|714|715|716|717|718|719|720|724|727|730|731|732|734|737|740|747|752|754|757|760|762|763|764|765|769|770|772|773|774|775|779|781|785|786|801|802|803|804|805|806|808|810|812|813|814|815|816|817|818|828|830|831|832|835|843|845|847|848|850|856|857|858|859|860|862|863|864|865|870|872|878|901|903|904|906|907|908|909|910|912|913|914|915|916|917|918|919|920|925|927|928|931|935|936|937|938|940|941|947|949|951|952|954|956|957|959|970|971|972|973|975|978|979|980|984|985|989)\d{7}$/;
      this.optionalTrunkPrefix = '1';
      this.nationalNumberSeparator = ' ';
      this.nationalDestinationCode = ['201', '202', '203', '205', '206', '207', '208', '209', '209', '210', '212', '213', '214', '215', '216', '217', '218', '219', '224', '225', '227', '228', '229', '231', '234', '239', '240', '248', '251', '252', '253', '254', '256', '260', '262', '267', '269', '270', '274', '276', '278', '281', '283', '301', '302', '303', '304', '305', '307', '308', '309', '310', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '323', '325', '330', '331', '334', '336', '337', '339', '341', '347', '351', '352', '360', '361', '364', '369', '380', '385', '386', '401', '402', '404', '405', '406', '407', '408', '409', '410', '412', '413', '414', '415', '417', '419', '423', '424', '425', '430', '432', '434', '435', '440', '442', '443', '445', '447', '458', '464', '469', '470', '475', '478', '479', '480', '484', '501', '502', '503', '504', '505', '507', '508', '509', '510', '512', '513', '515', '516', '517', '518', '520', '530', '531', '534', '540', '541', '551', '557', '559', '561', '562', '563', '564', '567', '570', '571', '573', '574', '575', '580', '585', '586', '601', '602', '603', '605', '606', '607', '608', '609', '610', '612', '614', '615', '616', '617', '618', '619', '620', '623', '626', '627', '628', '630', '631', '636', '641', '646', '650', '651', '657', '659', '660', '661', '662', '667', '669', '678', '679', '681', '682', '689', '701', '702', '703', '704', '706', '707', '708', '712', '713', '714', '715', '716', '717', '718', '719', '720', '724', '727', '730', '731', '732', '734', '737', '740', '747', '752', '754', '757', '760', '762', '763', '764', '765', '769', '770', '772', '773', '774', '775', '779', '781', '785', '786', '801', '802', '803', '804', '805', '806', '808', '810', '812', '813', '814', '815', '816', '817', '818', '828', '830', '831', '832', '835', '843', '845', '847', '848', '850', '856', '857', '858', '859', '860', '862', '863', '864', '865', '870', '872', '878', '901', '903', '904', '906', '907', '908', '909', '910', '912', '913', '914', '915', '916', '917', '918', '919', '920', '925', '927', '928', '931', '935', '936', '937', '938', '940', '941', '947', '949', '951', '952', '954', '956', '957', '959', '970', '971', '972', '973', '975', '978', '979', '980', '984', '985', '989'];
    }

    USA.prototype.specialRules = function(withoutCountryCode, withoutNDC, ndc) {
      if (withoutNDC.length === 7) {
        return new vtex.phone.PhoneNumber(this.countryCode, ndc, withoutNDC);
      }
    };

    USA.prototype.splitNumber = function(number) {
      if (number.length === 7) {
        return vtex.phone.compact(number.split(/(\d{3})(\d{4})/));
      }
      return [number];
    };

    return USA;

  })();

  root.vtex.phone.countries = root.vtex.phone.countries || {};

  root.vtex.phone.countries['1'] = new USA();

}).call(this);
