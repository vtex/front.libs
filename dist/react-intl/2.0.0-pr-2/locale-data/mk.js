(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ReactIntlLocaleData || (g.ReactIntlLocaleData = {})).mk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=[{locale:"mk",pluralRuleFunction:function(e,t){var r=String(e).split("."),o=r[0],a=r[1]||"",l=!r[1],i=o.slice(-1),n=o.slice(-2),s=a.slice(-1);return t?1==i&&11!=n?"one":2==i&&12!=n?"two":7!=i&&8!=i||17==n||18==n?"other":"many":l&&1==i||1==s?"one":"other"},fields:{year:{displayName:"година",relative:{0:"оваа година",1:"следната година","-1":"минатата година"},relativeTime:{future:{one:"за {0} година",other:"за {0} години"},past:{one:"пред {0} година",other:"пред {0} години"}}},month:{displayName:"Месец",relative:{0:"овој месец",1:"следниот месец","-1":"минатиот месец"},relativeTime:{future:{one:"за {0} месец",other:"за {0} месеци"},past:{one:"пред {0} месец",other:"пред {0} месеци"}}},day:{displayName:"ден",relative:{0:"денес",1:"утре",2:"задутре","-1":"вчера","-2":"завчера"},relativeTime:{future:{one:"за {0} ден",other:"за {0} дена"},past:{one:"пред {0} ден",other:"пред {0} дена"}}},hour:{displayName:"Час",relativeTime:{future:{one:"за {0} час",other:"за {0} часа"},past:{one:"пред {0} час",other:"пред {0} часа"}}},minute:{displayName:"Минута",relativeTime:{future:{one:"за {0} минута",other:"за {0} минути"},past:{one:"пред {0} минута",other:"пред {0} минути"}}},second:{displayName:"Секунда",relative:{0:"сега"},relativeTime:{future:{one:"за {0} секунда",other:"за {0} секунди"},past:{one:"пред {0} секунда",other:"пред {0} секунди"}}}}},{locale:"mk-MK",parentLocale:"mk"}],module.exports=exports["default"];
},{}]},{},[1])(1)
});