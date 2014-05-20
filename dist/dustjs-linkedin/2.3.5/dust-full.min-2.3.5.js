/*! Dust - Asynchronous Templating - v2.3.5
* http://linkedin.github.io/dustjs/
* Copyright (c) 2014 Aleksander Williams; Released under the MIT License */
!function(root){function Context(a,b,c,d){this.stack=a,this.global=b,this.blocks=c,this.templateName=d}function Stack(a,b,c,d){this.tail=b,this.isObject=a&&"object"==typeof a,this.head=a,this.index=c,this.of=d}function Stub(a){this.head=new Chunk(this),this.callback=a,this.out=""}function Stream(){this.head=new Chunk(this)}function Chunk(a,b,c){this.root=a,this.next=b,this.data=[],this.flushable=!1,this.taps=c}function Tap(a,b){this.head=a,this.tail=b}var dust={},NONE="NONE",ERROR="ERROR",WARN="WARN",INFO="INFO",DEBUG="DEBUG",loggingLevels=[DEBUG,INFO,WARN,ERROR,NONE],EMPTY_FUNC=function(){},logger={},originalLog,loggerContext;dust.debugLevel=NONE,dust.silenceErrors=!1,root&&root.console&&root.console.log&&(loggerContext=root.console,originalLog=root.console.log),logger.log=loggerContext?function(){logger.log="function"==typeof originalLog?function(){originalLog.apply(loggerContext,arguments)}:function(){var a=Array.prototype.slice.apply(arguments).join(" ");originalLog(a)},logger.log.apply(this,arguments)}:function(){},dust.log=function(a,b){if(b=b||INFO,dust.debugLevel!==NONE&&dust.indexInArray(loggingLevels,b)>=dust.indexInArray(loggingLevels,dust.debugLevel)&&(dust.logQueue||(dust.logQueue=[]),dust.logQueue.push({message:a,type:b}),logger.log("[DUST "+b+"]: "+a)),!dust.silenceErrors&&b===ERROR)throw"string"==typeof a?new Error(a):a},dust.onError=function(a,b){if(logger.log("[!!!DEPRECATION WARNING!!!]: dust.onError will no longer return a chunk object."),dust.log(a.message||a,ERROR),dust.silenceErrors)return b;throw a},dust.helpers={},dust.cache={},dust.register=function(a,b){a&&(dust.cache[a]=b)},dust.render=function(a,b,c){var d=new Stub(c).head;try{dust.load(a,d,Context.wrap(b,a)).end()}catch(e){dust.log(e,ERROR)}},dust.stream=function(a,b){var c=new Stream;return dust.nextTick(function(){try{dust.load(a,c.head,Context.wrap(b,a)).end()}catch(d){dust.log(d,ERROR)}}),c},dust.renderSource=function(a,b,c){return dust.compileFn(a)(b,c)},dust.compileFn=function(a,b){b=b||null;var c=dust.loadSource(dust.compile(a,b));return function(a,d){var e=d?new Stub(d):new Stream;return dust.nextTick(function(){"function"==typeof c?c(e.head,Context.wrap(a,b)).end():dust.log(new Error("Template ["+b+"] cannot be resolved to a Dust function"),ERROR)}),e}},dust.load=function(a,b,c){var d=dust.cache[a];return d?d(b,c):dust.onLoad?b.map(function(b){dust.onLoad(a,function(d,e){return d?b.setError(d):(dust.cache[a]||dust.loadSource(dust.compile(e,a)),void dust.cache[a](b,c).end())})}):b.setError(new Error("Template Not Found: "+a))},dust.loadSource=function(source,path){return eval(source)},dust.isArray=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},dust.indexInArray=function(a,b,c){if(c=+c||0,Array.prototype.indexOf)return a.indexOf(b,c);if(void 0===a||null===a)throw new TypeError('cannot call method "indexOf" of null');var d=a.length;for(1/0===Math.abs(c)&&(c=0),0>c&&(c+=d,0>c&&(c=0));d>c;c++)if(a[c]===b)return c;return-1},dust.nextTick=function(){return function(a){setTimeout(a,0)}}(),dust.isEmpty=function(a){return dust.isArray(a)&&!a.length?!0:0===a?!1:!a},dust.filter=function(a,b,c){if(c)for(var d=0,e=c.length;e>d;d++){var f=c[d];"s"===f?b=null:"function"==typeof dust.filters[f]?a=dust.filters[f](a):dust.log("Invalid filter ["+f+"]",WARN)}return b&&(a=dust.filters[b](a)),a},dust.filters={h:function(a){return dust.escapeHtml(a)},j:function(a){return dust.escapeJs(a)},u:encodeURI,uc:encodeURIComponent,js:function(a){return JSON?JSON.stringify(a):(dust.log("JSON is undefined.  JSON stringify has not been used on ["+a+"]",WARN),a)},jp:function(a){return JSON?JSON.parse(a):(dust.log("JSON is undefined.  JSON parse has not been used on ["+a+"]",WARN),a)}},dust.makeBase=function(a){return new Context(new Stack,a)},Context.wrap=function(a,b){return a instanceof Context?a:new Context(new Stack(a),{},null,b)},Context.prototype.get=function(a,b){return"string"==typeof a&&("."===a[0]&&(b=!0,a=a.substr(1)),a=a.split(".")),this._get(b,a)},Context.prototype._get=function(a,b){var c,d,e,f,g=this.stack,h=1;if(d=b[0],e=b.length,a&&0===e)f=g,g=g.head;else{if(a)g&&(g=g.head?g.head[d]:void 0);else{for(;g&&(!g.isObject||(f=g.head,c=g.head[d],void 0===c));)g=g.tail;g=void 0!==c?c:this.global?this.global[d]:void 0}for(;g&&e>h;)f=g,g=g[b[h]],h++}if("function"==typeof g){var i=function(){try{return g.apply(f,arguments)}catch(a){return dust.log(a,ERROR)}};return i.isFunction=!0,i}return void 0===g&&dust.log("Cannot find the value for reference [{"+b.join(".")+"}] in template ["+this.getTemplateName()+"]"),g},Context.prototype.getPath=function(a,b){return this._get(a,b)},Context.prototype.push=function(a,b,c){return new Context(new Stack(a,this.stack,b,c),this.global,this.blocks,this.getTemplateName())},Context.prototype.rebase=function(a){return new Context(new Stack(a),this.global,this.blocks,this.getTemplateName())},Context.prototype.current=function(){return this.stack.head},Context.prototype.getBlock=function(a){if("function"==typeof a){var b=new Chunk;a=a(b,this).data.join("")}var c=this.blocks;if(!c)return void dust.log("No blocks for context[{"+a+"}] in template ["+this.getTemplateName()+"]",DEBUG);for(var d,e=c.length;e--;)if(d=c[e][a])return d},Context.prototype.shiftBlocks=function(a){var b,c=this.blocks;return a?(b=c?c.concat([a]):[a],new Context(this.stack,this.global,b,this.getTemplateName())):this},Context.prototype.getTemplateName=function(){return this.templateName},Stub.prototype.flush=function(){for(var a=this.head;a;){if(!a.flushable)return a.error?(this.callback(a.error),dust.log("Chunk error ["+a.error+"] thrown. Ceasing to render this template.",WARN),void(this.flush=EMPTY_FUNC)):void 0;this.out+=a.data.join(""),a=a.next,this.head=a}this.callback(null,this.out)},Stream.prototype.flush=function(){for(var a=this.head;a;){if(!a.flushable)return a.error?(this.emit("error",a.error),dust.log("Chunk error ["+a.error+"] thrown. Ceasing to render this template.",WARN),void(this.flush=EMPTY_FUNC)):void 0;this.emit("data",a.data.join("")),a=a.next,this.head=a}this.emit("end")},Stream.prototype.emit=function(a,b){if(!this.events)return dust.log("No events to emit",INFO),!1;var c=this.events[a];if(!c)return dust.log("Event type ["+a+"] does not exist",WARN),!1;if("function"==typeof c)c(b);else if(dust.isArray(c))for(var d=c.slice(0),e=0,f=d.length;f>e;e++)d[e](b);else dust.log("Event Handler ["+c+"] is not of a type that is handled by emit",WARN)},Stream.prototype.on=function(a,b){return this.events||(this.events={}),this.events[a]?"function"==typeof this.events[a]?this.events[a]=[this.events[a],b]:this.events[a].push(b):(dust.log("Event type ["+a+"] does not exist. Using just the specified callback.",WARN),b?this.events[a]=b:dust.log("Callback for type ["+a+"] does not exist. Listener not registered.",WARN)),this},Stream.prototype.pipe=function(a){return this.on("data",function(b){try{a.write(b,"utf8")}catch(c){dust.log(c,ERROR)}}).on("end",function(){try{return a.end()}catch(b){dust.log(b,ERROR)}}).on("error",function(b){a.error(b)}),this},Chunk.prototype.write=function(a){var b=this.taps;return b&&(a=b.go(a)),this.data.push(a),this},Chunk.prototype.end=function(a){return a&&this.write(a),this.flushable=!0,this.root.flush(),this},Chunk.prototype.map=function(a){var b=new Chunk(this.root,this.next,this.taps),c=new Chunk(this.root,b,this.taps);return this.next=c,this.flushable=!0,a(c),b},Chunk.prototype.tap=function(a){var b=this.taps;return this.taps=b?b.push(a):new Tap(a),this},Chunk.prototype.untap=function(){return this.taps=this.taps.tail,this},Chunk.prototype.render=function(a,b){return a(this,b)},Chunk.prototype.reference=function(a,b,c,d){return"function"==typeof a&&(a.isFunction=!0,a=a.apply(b.current(),[this,b,null,{auto:c,filters:d}]),a instanceof Chunk)?a:dust.isEmpty(a)?this:this.write(dust.filter(a,c,d))},Chunk.prototype.section=function(a,b,c,d){if("function"==typeof a&&(a=a.apply(b.current(),[this,b,c,d]),a instanceof Chunk))return a;var e=c.block,f=c["else"];if(d&&(b=b.push(d)),dust.isArray(a)){if(e){var g=a.length,h=this;if(g>0){b.stack.head&&(b.stack.head.$len=g);for(var i=0;g>i;i++)b.stack.head&&(b.stack.head.$idx=i),h=e(h,b.push(a[i],i,g));return b.stack.head&&(b.stack.head.$idx=void 0,b.stack.head.$len=void 0),h}if(f)return f(this,b)}}else if(a===!0){if(e)return e(this,b)}else if(a||0===a){if(e)return e(this,b.push(a))}else if(f)return f(this,b);return dust.log("Not rendering section (#) block in template ["+b.getTemplateName()+"], because above key was not found",DEBUG),this},Chunk.prototype.exists=function(a,b,c){var d=c.block,e=c["else"];if(dust.isEmpty(a)){if(e)return e(this,b)}else if(d)return d(this,b);return dust.log("Not rendering exists (?) block in template ["+b.getTemplateName()+"], because above key was not found",DEBUG),this},Chunk.prototype.notexists=function(a,b,c){var d=c.block,e=c["else"];if(dust.isEmpty(a)){if(d)return d(this,b)}else if(e)return e(this,b);return dust.log("Not rendering not exists (^) block check in template ["+b.getTemplateName()+"], because above key was found",DEBUG),this},Chunk.prototype.block=function(a,b,c){var d=c.block;return a&&(d=a),d?d(this,b):this},Chunk.prototype.partial=function(a,b,c){var d;d=dust.makeBase(b.global),d.blocks=b.blocks,b.stack&&b.stack.tail&&(d.stack=b.stack.tail),c&&(d=d.push(c)),"string"==typeof a&&(d.templateName=a),d=d.push(b.stack.head);var e;return e="function"==typeof a?this.capture(a,d,function(a,b){d.templateName=d.templateName||a,dust.load(a,b,d).end()}):dust.load(a,this,d)},Chunk.prototype.helper=function(a,b,c,d){var e=this;try{return dust.helpers[a]?dust.helpers[a](e,b,c,d):(dust.log("Invalid helper ["+a+"]",WARN),e)}catch(f){return dust.log(f,ERROR),e}},Chunk.prototype.capture=function(a,b,c){return this.map(function(d){var e=new Stub(function(a,b){a?d.setError(a):c(b,d)});a(e.head,b).end()})},Chunk.prototype.setError=function(a){return this.error=a,this.root.flush(),this},Tap.prototype.push=function(a){return new Tap(a,this)},Tap.prototype.go=function(a){for(var b=this;b;)a=b.head(a),b=b.tail;return a};var HCHARS=new RegExp(/[&<>\"\']/),AMP=/&/g,LT=/</g,GT=/>/g,QUOT=/\"/g,SQUOT=/\'/g;dust.escapeHtml=function(a){return"string"==typeof a?HCHARS.test(a)?a.replace(AMP,"&amp;").replace(LT,"&lt;").replace(GT,"&gt;").replace(QUOT,"&quot;").replace(SQUOT,"&#39;"):a:a};var BS=/\\/g,FS=/\//g,CR=/\r/g,LS=/\u2028/g,PS=/\u2029/g,NL=/\n/g,LF=/\f/g,SQ=/'/g,DQ=/"/g,TB=/\t/g;dust.escapeJs=function(a){return"string"==typeof a?a.replace(BS,"\\\\").replace(FS,"\\/").replace(DQ,'\\"').replace(SQ,"\\'").replace(CR,"\\r").replace(LS,"\\u2028").replace(PS,"\\u2029").replace(NL,"\\n").replace(LF,"\\f").replace(TB,"\\t"):a},"object"==typeof exports?module.exports=dust:root.dust=dust}(function(){return this}()),function(a,b){"object"==typeof exports?module.exports=b(require("./dust")):b(a.dust)}(this,function(dust){var a=function(){function b(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g,escape)+'"'}var c={parse:function(c,d){function e(a){var b={};for(var c in a)b[c]=a[c];return b}function f(a,b){for(var d=a.offset+b,e=a.offset;d>e;e++){var f=c.charAt(e);"\n"===f?(a.seenCR||a.line++,a.column=1,a.seenCR=!1):"\r"===f||"\u2028"===f||"\u2029"===f?(a.line++,a.column=1,a.seenCR=!0):(a.column++,a.seenCR=!1)}a.offset+=b}function g(a){R.offset<T.offset||(R.offset>T.offset&&(T=e(R),U=[]),U.push(a))}function h(){var a,b,c;for(c=e(R),a=[],b=i();null!==b;)a.push(b),b=i();return null!==a&&(a=function(a,b,c,d){return["body"].concat(d).concat([["line",b],["col",c]])}(c.offset,c.line,c.column,a)),null===a&&(R=e(c)),a}function i(){var a;return a=G(),null===a&&(a=H(),null===a&&(a=j(),null===a&&(a=q(),null===a&&(a=s(),null===a&&(a=p(),null===a&&(a=D())))))),a}function j(){var a,b,d,i,j,m,n,p,q;if(S++,p=e(R),q=e(R),a=k(),null!==a){for(b=[],d=O();null!==d;)b.push(d),d=O();null!==b?(d=K(),null!==d?(i=h(),null!==i?(j=o(),null!==j?(m=l(),m=null!==m?m:"",null!==m?(n=function(a,b,c,d,e,f,g){if(!g||d[1].text!==g.text)throw new Error("Expected end tag for "+d[1].text+" but it was not found. At line : "+b+", column : "+c);return!0}(R.offset,R.line,R.column,a,i,j,m)?"":null,null!==n?a=[a,b,d,i,j,m,n]:(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))}else a=null,R=e(q);if(null!==a&&(a=function(a,b,c,d,e,f){return f.push(["param",["literal","block"],e]),d.push(f),d.concat([["line",b],["col",c]])}(p.offset,p.line,p.column,a[0],a[3],a[4],a[5])),null===a&&(R=e(p)),null===a){if(p=e(R),q=e(R),a=k(),null!==a){for(b=[],d=O();null!==d;)b.push(d),d=O();null!==b?(47===c.charCodeAt(R.offset)?(d="/",f(R,1)):(d=null,0===S&&g('"/"')),null!==d?(i=K(),null!==i?a=[a,b,d,i]:(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))}else a=null,R=e(q);null!==a&&(a=function(a,b,c,d){return d.push(["bodies"]),d.concat([["line",b],["col",c]])}(p.offset,p.line,p.column,a[0])),null===a&&(R=e(p))}return S--,0===S&&null===a&&g("section"),a}function k(){var a,b,d,h,i,j,k,l;if(k=e(R),l=e(R),a=J(),null!==a)if(/^[#?^<+@%]/.test(c.charAt(R.offset))?(b=c.charAt(R.offset),f(R,1)):(b=null,0===S&&g("[#?^<+@%]")),null!==b){for(d=[],h=O();null!==h;)d.push(h),h=O();null!==d?(h=t(),null!==h?(i=m(),null!==i?(j=n(),null!==j?a=[a,b,d,h,i,j]:(a=null,R=e(l))):(a=null,R=e(l))):(a=null,R=e(l))):(a=null,R=e(l))}else a=null,R=e(l);else a=null,R=e(l);return null!==a&&(a=function(a,b,c,d,e,f,g){return[d,e,f,g]}(k.offset,k.line,k.column,a[1],a[3],a[4],a[5])),null===a&&(R=e(k)),a}function l(){var a,b,d,h,i,j,k,l;if(S++,k=e(R),l=e(R),a=J(),null!==a)if(47===c.charCodeAt(R.offset)?(b="/",f(R,1)):(b=null,0===S&&g('"/"')),null!==b){for(d=[],h=O();null!==h;)d.push(h),h=O();if(null!==d)if(h=t(),null!==h){for(i=[],j=O();null!==j;)i.push(j),j=O();null!==i?(j=K(),null!==j?a=[a,b,d,h,i,j]:(a=null,R=e(l))):(a=null,R=e(l))}else a=null,R=e(l);else a=null,R=e(l)}else a=null,R=e(l);else a=null,R=e(l);return null!==a&&(a=function(a,b,c,d){return d}(k.offset,k.line,k.column,a[3])),null===a&&(R=e(k)),S--,0===S&&null===a&&g("end tag"),a}function m(){var a,b,d,h,i;return d=e(R),h=e(R),i=e(R),58===c.charCodeAt(R.offset)?(a=":",f(R,1)):(a=null,0===S&&g('":"')),null!==a?(b=t(),null!==b?a=[a,b]:(a=null,R=e(i))):(a=null,R=e(i)),null!==a&&(a=function(a,b,c,d){return d}(h.offset,h.line,h.column,a[1])),null===a&&(R=e(h)),a=null!==a?a:"",null!==a&&(a=function(a,b,c,d){return d?["context",d]:["context"]}(d.offset,d.line,d.column,a)),null===a&&(R=e(d)),a}function n(){var a,b,d,h,i,j,k,l;if(S++,j=e(R),a=[],k=e(R),l=e(R),d=O(),null!==d)for(b=[];null!==d;)b.push(d),d=O();else b=null;for(null!==b?(d=y(),null!==d?(61===c.charCodeAt(R.offset)?(h="=",f(R,1)):(h=null,0===S&&g('"="')),null!==h?(i=u(),null===i&&(i=t(),null===i&&(i=B())),null!==i?b=[b,d,h,i]:(b=null,R=e(l))):(b=null,R=e(l))):(b=null,R=e(l))):(b=null,R=e(l)),null!==b&&(b=function(a,b,c,d,e){return["param",["literal",d],e]}(k.offset,k.line,k.column,b[1],b[3])),null===b&&(R=e(k));null!==b;){if(a.push(b),k=e(R),l=e(R),d=O(),null!==d)for(b=[];null!==d;)b.push(d),d=O();else b=null;null!==b?(d=y(),null!==d?(61===c.charCodeAt(R.offset)?(h="=",f(R,1)):(h=null,0===S&&g('"="')),null!==h?(i=u(),null===i&&(i=t(),null===i&&(i=B())),null!==i?b=[b,d,h,i]:(b=null,R=e(l))):(b=null,R=e(l))):(b=null,R=e(l))):(b=null,R=e(l)),null!==b&&(b=function(a,b,c,d,e){return["param",["literal",d],e]}(k.offset,k.line,k.column,b[1],b[3])),null===b&&(R=e(k))}return null!==a&&(a=function(a,b,c,d){return["params"].concat(d)}(j.offset,j.line,j.column,a)),null===a&&(R=e(j)),S--,0===S&&null===a&&g("params"),a}function o(){var a,b,d,i,j,k,l,m,n;for(S++,l=e(R),a=[],m=e(R),n=e(R),b=J(),null!==b?(58===c.charCodeAt(R.offset)?(d=":",f(R,1)):(d=null,0===S&&g('":"')),null!==d?(i=y(),null!==i?(j=K(),null!==j?(k=h(),null!==k?b=[b,d,i,j,k]:(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n)),null!==b&&(b=function(a,b,c,d,e){return["param",["literal",d],e]}(m.offset,m.line,m.column,b[2],b[4])),null===b&&(R=e(m));null!==b;)a.push(b),m=e(R),n=e(R),b=J(),null!==b?(58===c.charCodeAt(R.offset)?(d=":",f(R,1)):(d=null,0===S&&g('":"')),null!==d?(i=y(),null!==i?(j=K(),null!==j?(k=h(),null!==k?b=[b,d,i,j,k]:(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n))):(b=null,R=e(n)),null!==b&&(b=function(a,b,c,d,e){return["param",["literal",d],e]}(m.offset,m.line,m.column,b[2],b[4])),null===b&&(R=e(m));return null!==a&&(a=function(a,b,c,d){return["bodies"].concat(d)}(l.offset,l.line,l.column,a)),null===a&&(R=e(l)),S--,0===S&&null===a&&g("bodies"),a}function p(){var a,b,c,d,f,h;return S++,f=e(R),h=e(R),a=J(),null!==a?(b=t(),null!==b?(c=r(),null!==c?(d=K(),null!==d?a=[a,b,c,d]:(a=null,R=e(h))):(a=null,R=e(h))):(a=null,R=e(h))):(a=null,R=e(h)),null!==a&&(a=function(a,b,c,d,e){return["reference",d,e].concat([["line",b],["col",c]])}(f.offset,f.line,f.column,a[1],a[2])),null===a&&(R=e(f)),S--,0===S&&null===a&&g("reference"),a}function q(){var a,b,d,h,i,j,k,l,o,p,q,r;if(S++,p=e(R),q=e(R),a=J(),null!==a)if(62===c.charCodeAt(R.offset)?(b=">",f(R,1)):(b=null,0===S&&g('">"')),null===b&&(43===c.charCodeAt(R.offset)?(b="+",f(R,1)):(b=null,0===S&&g('"+"'))),null!==b){for(d=[],h=O();null!==h;)d.push(h),h=O();if(null!==d)if(r=e(R),h=y(),null!==h&&(h=function(a,b,c,d){return["literal",d]}(r.offset,r.line,r.column,h)),null===h&&(R=e(r)),null===h&&(h=B()),null!==h)if(i=m(),null!==i)if(j=n(),null!==j){for(k=[],l=O();null!==l;)k.push(l),l=O();null!==k?(47===c.charCodeAt(R.offset)?(l="/",f(R,1)):(l=null,0===S&&g('"/"')),null!==l?(o=K(),null!==o?a=[a,b,d,h,i,j,k,l,o]:(a=null,R=e(q))):(a=null,R=e(q))):(a=null,R=e(q))}else a=null,R=e(q);else a=null,R=e(q);else a=null,R=e(q);else a=null,R=e(q)}else a=null,R=e(q);else a=null,R=e(q);return null!==a&&(a=function(a,b,c,d,e,f,g){var h=">"===d?"partial":d;return[h,e,f,g].concat([["line",b],["col",c]])}(p.offset,p.line,p.column,a[1],a[3],a[4],a[5])),null===a&&(R=e(p)),S--,0===S&&null===a&&g("partial"),a}function r(){var a,b,d,h,i,j;for(S++,h=e(R),a=[],i=e(R),j=e(R),124===c.charCodeAt(R.offset)?(b="|",f(R,1)):(b=null,0===S&&g('"|"')),null!==b?(d=y(),null!==d?b=[b,d]:(b=null,R=e(j))):(b=null,R=e(j)),null!==b&&(b=function(a,b,c,d){return d}(i.offset,i.line,i.column,b[1])),null===b&&(R=e(i));null!==b;)a.push(b),i=e(R),j=e(R),124===c.charCodeAt(R.offset)?(b="|",f(R,1)):(b=null,0===S&&g('"|"')),null!==b?(d=y(),null!==d?b=[b,d]:(b=null,R=e(j))):(b=null,R=e(j)),null!==b&&(b=function(a,b,c,d){return d}(i.offset,i.line,i.column,b[1])),null===b&&(R=e(i));return null!==a&&(a=function(a,b,c,d){return["filters"].concat(d)}(h.offset,h.line,h.column,a)),null===a&&(R=e(h)),S--,0===S&&null===a&&g("filters"),a}function s(){var a,b,d,h,i,j;return S++,i=e(R),j=e(R),a=J(),null!==a?(126===c.charCodeAt(R.offset)?(b="~",f(R,1)):(b=null,0===S&&g('"~"')),null!==b?(d=y(),null!==d?(h=K(),null!==h?a=[a,b,d,h]:(a=null,R=e(j))):(a=null,R=e(j))):(a=null,R=e(j))):(a=null,R=e(j)),null!==a&&(a=function(a,b,c,d){return["special",d].concat([["line",b],["col",c]])}(i.offset,i.line,i.column,a[2])),null===a&&(R=e(i)),S--,0===S&&null===a&&g("special"),a}function t(){var a,b;return S++,b=e(R),a=x(),null!==a&&(a=function(a,b,c,d){var e=["path"].concat(d);return e.text=d[1].join("."),e}(b.offset,b.line,b.column,a)),null===a&&(R=e(b)),null===a&&(b=e(R),a=y(),null!==a&&(a=function(a,b,c,d){var e=["key",d];return e.text=d,e}(b.offset,b.line,b.column,a)),null===a&&(R=e(b))),S--,0===S&&null===a&&g("identifier"),a}function u(){var a,b;return S++,b=e(R),a=v(),null===a&&(a=w()),null!==a&&(a=function(a,b,c,d){return["literal",d]}(b.offset,b.line,b.column,a)),null===a&&(R=e(b)),S--,0===S&&null===a&&g("number"),a}function v(){var a,b,d,h,i,j;if(S++,i=e(R),j=e(R),a=w(),null!==a)if(46===c.charCodeAt(R.offset)?(b=".",f(R,1)):(b=null,0===S&&g('"."')),null!==b){if(h=w(),null!==h)for(d=[];null!==h;)d.push(h),h=w();else d=null;null!==d?a=[a,b,d]:(a=null,R=e(j))}else a=null,R=e(j);else a=null,R=e(j);return null!==a&&(a=function(a,b,c,d,e){return parseFloat(d+"."+e.join(""))}(i.offset,i.line,i.column,a[0],a[2])),null===a&&(R=e(i)),S--,0===S&&null===a&&g("float"),a}function w(){var a,b,d;if(S++,d=e(R),/^[0-9]/.test(c.charAt(R.offset))?(b=c.charAt(R.offset),f(R,1)):(b=null,0===S&&g("[0-9]")),null!==b)for(a=[];null!==b;)a.push(b),/^[0-9]/.test(c.charAt(R.offset))?(b=c.charAt(R.offset),f(R,1)):(b=null,0===S&&g("[0-9]"));else a=null;return null!==a&&(a=function(a,b,c,d){return parseInt(d.join(""),10)}(d.offset,d.line,d.column,a)),null===a&&(R=e(d)),S--,0===S&&null===a&&g("integer"),a}function x(){var a,b,d,h,i;if(S++,h=e(R),i=e(R),a=y(),a=null!==a?a:"",null!==a){if(d=A(),null===d&&(d=z()),null!==d)for(b=[];null!==d;)b.push(d),d=A(),null===d&&(d=z());else b=null;null!==b?a=[a,b]:(a=null,R=e(i))}else a=null,R=e(i);if(null!==a&&(a=function(a,b,c,d,e){return e=e[0],d&&e?(e.unshift(d),[!1,e].concat([["line",b],["col",c]])):[!0,e].concat([["line",b],["col",c]])}(h.offset,h.line,h.column,a[0],a[1])),null===a&&(R=e(h)),null===a){if(h=e(R),i=e(R),46===c.charCodeAt(R.offset)?(a=".",f(R,1)):(a=null,0===S&&g('"."')),null!==a){for(b=[],d=A(),null===d&&(d=z());null!==d;)b.push(d),d=A(),null===d&&(d=z());null!==b?a=[a,b]:(a=null,R=e(i))}else a=null,R=e(i);null!==a&&(a=function(a,b,c,d){return d.length>0?[!0,d[0]].concat([["line",b],["col",c]]):[!0,[]].concat([["line",b],["col",c]])}(h.offset,h.line,h.column,a[1])),null===a&&(R=e(h))}return S--,0===S&&null===a&&g("path"),a}function y(){var a,b,d,h,i;if(S++,h=e(R),i=e(R),/^[a-zA-Z_$]/.test(c.charAt(R.offset))?(a=c.charAt(R.offset),f(R,1)):(a=null,0===S&&g("[a-zA-Z_$]")),null!==a){for(b=[],/^[0-9a-zA-Z_$\-]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g("[0-9a-zA-Z_$\\-]"));null!==d;)b.push(d),/^[0-9a-zA-Z_$\-]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g("[0-9a-zA-Z_$\\-]"));null!==b?a=[a,b]:(a=null,R=e(i))}else a=null,R=e(i);return null!==a&&(a=function(a,b,c,d,e){return d+e.join("")}(h.offset,h.line,h.column,a[0],a[1])),null===a&&(R=e(h)),S--,0===S&&null===a&&g("key"),a}function z(){var a,b,d,h,i,j,k,l;if(S++,h=e(R),i=e(R),j=e(R),k=e(R),a=L(),null!==a){if(l=e(R),/^[0-9]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g("[0-9]")),null!==d)for(b=[];null!==d;)b.push(d),/^[0-9]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g("[0-9]"));else b=null;null!==b&&(b=function(a,b,c,d){return d.join("")}(l.offset,l.line,l.column,b)),null===b&&(R=e(l)),null===b&&(b=t()),null!==b?(d=M(),null!==d?a=[a,b,d]:(a=null,R=e(k))):(a=null,R=e(k))}else a=null,R=e(k);return null!==a&&(a=function(a,b,c,d){return d}(j.offset,j.line,j.column,a[1])),null===a&&(R=e(j)),null!==a?(b=A(),b=null!==b?b:"",null!==b?a=[a,b]:(a=null,R=e(i))):(a=null,R=e(i)),null!==a&&(a=function(a,b,c,d,e){return e?e.unshift(d):e=[d],e}(h.offset,h.line,h.column,a[0],a[1])),null===a&&(R=e(h)),S--,0===S&&null===a&&g("array"),a}function A(){var a,b,d,h,i,j,k;if(S++,h=e(R),i=e(R),j=e(R),k=e(R),46===c.charCodeAt(R.offset)?(b=".",f(R,1)):(b=null,0===S&&g('"."')),null!==b?(d=y(),null!==d?b=[b,d]:(b=null,R=e(k))):(b=null,R=e(k)),null!==b&&(b=function(a,b,c,d){return d}(j.offset,j.line,j.column,b[1])),null===b&&(R=e(j)),null!==b)for(a=[];null!==b;)a.push(b),j=e(R),k=e(R),46===c.charCodeAt(R.offset)?(b=".",f(R,1)):(b=null,0===S&&g('"."')),null!==b?(d=y(),null!==d?b=[b,d]:(b=null,R=e(k))):(b=null,R=e(k)),null!==b&&(b=function(a,b,c,d){return d}(j.offset,j.line,j.column,b[1])),null===b&&(R=e(j));else a=null;return null!==a?(b=z(),b=null!==b?b:"",null!==b?a=[a,b]:(a=null,R=e(i))):(a=null,R=e(i)),null!==a&&(a=function(a,b,c,d,e){return e?d.concat(e):d}(h.offset,h.line,h.column,a[0],a[1])),null===a&&(R=e(h)),S--,0===S&&null===a&&g("array_part"),a}function B(){var a,b,d,h,i;if(S++,h=e(R),i=e(R),34===c.charCodeAt(R.offset)?(a='"',f(R,1)):(a=null,0===S&&g('"\\""')),null!==a?(34===c.charCodeAt(R.offset)?(b='"',f(R,1)):(b=null,0===S&&g('"\\""')),null!==b?a=[a,b]:(a=null,R=e(i))):(a=null,R=e(i)),null!==a&&(a=function(a,b,c){return["literal",""].concat([["line",b],["col",c]])}(h.offset,h.line,h.column)),null===a&&(R=e(h)),null===a&&(h=e(R),i=e(R),34===c.charCodeAt(R.offset)?(a='"',f(R,1)):(a=null,0===S&&g('"\\""')),null!==a?(b=E(),null!==b?(34===c.charCodeAt(R.offset)?(d='"',f(R,1)):(d=null,0===S&&g('"\\""')),null!==d?a=[a,b,d]:(a=null,R=e(i))):(a=null,R=e(i))):(a=null,R=e(i)),null!==a&&(a=function(a,b,c,d){return["literal",d].concat([["line",b],["col",c]])}(h.offset,h.line,h.column,a[1])),null===a&&(R=e(h)),null===a)){if(h=e(R),i=e(R),34===c.charCodeAt(R.offset)?(a='"',f(R,1)):(a=null,0===S&&g('"\\""')),null!==a){if(d=C(),null!==d)for(b=[];null!==d;)b.push(d),d=C();else b=null;null!==b?(34===c.charCodeAt(R.offset)?(d='"',f(R,1)):(d=null,0===S&&g('"\\""')),null!==d?a=[a,b,d]:(a=null,R=e(i))):(a=null,R=e(i))}else a=null,R=e(i);null!==a&&(a=function(a,b,c,d){return["body"].concat(d).concat([["line",b],["col",c]])}(h.offset,h.line,h.column,a[1])),null===a&&(R=e(h))}return S--,0===S&&null===a&&g("inline"),a}function C(){var a,b;return a=s(),null===a&&(a=p(),null===a&&(b=e(R),a=E(),null!==a&&(a=function(a,b,c,d){return["buffer",d]}(b.offset,b.line,b.column,a)),null===a&&(R=e(b)))),a}function D(){var a,b,d,h,i,j,k,l,m,n;if(S++,k=e(R),l=e(R),a=N(),null!==a){for(b=[],d=O();null!==d;)b.push(d),d=O();null!==b?a=[a,b]:(a=null,R=e(l))}else a=null,R=e(l);if(null!==a&&(a=function(a,b,c,d,e){return["format",d,e.join("")].concat([["line",b],["col",c]])}(k.offset,k.line,k.column,a[0],a[1])),null===a&&(R=e(k)),null===a){if(k=e(R),l=e(R),m=e(R),n=e(R),S++,b=I(),S--,null===b?b="":(b=null,R=e(n)),null!==b?(n=e(R),S++,d=G(),S--,null===d?d="":(d=null,R=e(n)),null!==d?(n=e(R),S++,h=H(),S--,null===h?h="":(h=null,R=e(n)),null!==h?(n=e(R),S++,i=N(),S--,null===i?i="":(i=null,R=e(n)),null!==i?(c.length>R.offset?(j=c.charAt(R.offset),f(R,1)):(j=null,0===S&&g("any character")),null!==j?b=[b,d,h,i,j]:(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m)),null!==b&&(b=function(a,b,c,d){return d}(l.offset,l.line,l.column,b[4])),null===b&&(R=e(l)),null!==b)for(a=[];null!==b;)a.push(b),l=e(R),m=e(R),n=e(R),S++,b=I(),S--,null===b?b="":(b=null,R=e(n)),null!==b?(n=e(R),S++,d=G(),S--,null===d?d="":(d=null,R=e(n)),null!==d?(n=e(R),S++,h=H(),S--,null===h?h="":(h=null,R=e(n)),null!==h?(n=e(R),S++,i=N(),S--,null===i?i="":(i=null,R=e(n)),null!==i?(c.length>R.offset?(j=c.charAt(R.offset),f(R,1)):(j=null,0===S&&g("any character")),null!==j?b=[b,d,h,i,j]:(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m))):(b=null,R=e(m)),null!==b&&(b=function(a,b,c,d){return d}(l.offset,l.line,l.column,b[4])),null===b&&(R=e(l));else a=null;null!==a&&(a=function(a,b,c,d){return["buffer",d.join("")].concat([["line",b],["col",c]])}(k.offset,k.line,k.column,a)),null===a&&(R=e(k))}return S--,0===S&&null===a&&g("buffer"),a}function E(){var a,b,d,h,i,j,k;if(S++,h=e(R),i=e(R),j=e(R),k=e(R),S++,b=I(),S--,null===b?b="":(b=null,R=e(k)),null!==b?(d=F(),null===d&&(/^[^"]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g('[^"]'))),null!==d?b=[b,d]:(b=null,R=e(j))):(b=null,R=e(j)),null!==b&&(b=function(a,b,c,d){return d}(i.offset,i.line,i.column,b[1])),null===b&&(R=e(i)),null!==b)for(a=[];null!==b;)a.push(b),i=e(R),j=e(R),k=e(R),S++,b=I(),S--,null===b?b="":(b=null,R=e(k)),null!==b?(d=F(),null===d&&(/^[^"]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g('[^"]'))),null!==d?b=[b,d]:(b=null,R=e(j))):(b=null,R=e(j)),null!==b&&(b=function(a,b,c,d){return d}(i.offset,i.line,i.column,b[1])),null===b&&(R=e(i));else a=null;return null!==a&&(a=function(a,b,c,d){return d.join("")}(h.offset,h.line,h.column,a)),null===a&&(R=e(h)),S--,0===S&&null===a&&g("literal"),a}function F(){var a,b;return b=e(R),'\\"'===c.substr(R.offset,2)?(a='\\"',f(R,2)):(a=null,0===S&&g('"\\\\\\""')),null!==a&&(a=function(){return'"'}(b.offset,b.line,b.column)),null===a&&(R=e(b)),a}function G(){var a,b,d,h,i,j,k,l,m;if(S++,i=e(R),j=e(R),"{`"===c.substr(R.offset,2)?(a="{`",f(R,2)):(a=null,0===S&&g('"{`"')),null!==a){for(b=[],k=e(R),l=e(R),m=e(R),S++,"`}"===c.substr(R.offset,2)?(d="`}",f(R,2)):(d=null,0===S&&g('"`}"')),S--,null===d?d="":(d=null,R=e(m)),null!==d?(c.length>R.offset?(h=c.charAt(R.offset),f(R,1)):(h=null,0===S&&g("any character")),null!==h?d=[d,h]:(d=null,R=e(l))):(d=null,R=e(l)),null!==d&&(d=function(a,b,c,d){return d}(k.offset,k.line,k.column,d[1])),null===d&&(R=e(k));null!==d;)b.push(d),k=e(R),l=e(R),m=e(R),S++,"`}"===c.substr(R.offset,2)?(d="`}",f(R,2)):(d=null,0===S&&g('"`}"')),S--,null===d?d="":(d=null,R=e(m)),null!==d?(c.length>R.offset?(h=c.charAt(R.offset),f(R,1)):(h=null,0===S&&g("any character")),null!==h?d=[d,h]:(d=null,R=e(l))):(d=null,R=e(l)),null!==d&&(d=function(a,b,c,d){return d}(k.offset,k.line,k.column,d[1])),null===d&&(R=e(k));null!==b?("`}"===c.substr(R.offset,2)?(d="`}",f(R,2)):(d=null,0===S&&g('"`}"')),null!==d?a=[a,b,d]:(a=null,R=e(j))):(a=null,R=e(j))}else a=null,R=e(j);return null!==a&&(a=function(a,b,c,d){return["raw",d.join("")].concat([["line",b],["col",c]])}(i.offset,i.line,i.column,a[1])),null===a&&(R=e(i)),S--,0===S&&null===a&&g("raw"),a}function H(){var a,b,d,h,i,j,k,l,m;if(S++,i=e(R),j=e(R),"{!"===c.substr(R.offset,2)?(a="{!",f(R,2)):(a=null,0===S&&g('"{!"')),null!==a){for(b=[],k=e(R),l=e(R),m=e(R),S++,"!}"===c.substr(R.offset,2)?(d="!}",f(R,2)):(d=null,0===S&&g('"!}"')),S--,null===d?d="":(d=null,R=e(m)),null!==d?(c.length>R.offset?(h=c.charAt(R.offset),f(R,1)):(h=null,0===S&&g("any character")),null!==h?d=[d,h]:(d=null,R=e(l))):(d=null,R=e(l)),null!==d&&(d=function(a,b,c,d){return d}(k.offset,k.line,k.column,d[1])),null===d&&(R=e(k));null!==d;)b.push(d),k=e(R),l=e(R),m=e(R),S++,"!}"===c.substr(R.offset,2)?(d="!}",f(R,2)):(d=null,0===S&&g('"!}"')),S--,null===d?d="":(d=null,R=e(m)),null!==d?(c.length>R.offset?(h=c.charAt(R.offset),f(R,1)):(h=null,0===S&&g("any character")),null!==h?d=[d,h]:(d=null,R=e(l))):(d=null,R=e(l)),null!==d&&(d=function(a,b,c,d){return d}(k.offset,k.line,k.column,d[1])),null===d&&(R=e(k));null!==b?("!}"===c.substr(R.offset,2)?(d="!}",f(R,2)):(d=null,0===S&&g('"!}"')),null!==d?a=[a,b,d]:(a=null,R=e(j))):(a=null,R=e(j))}else a=null,R=e(j);return null!==a&&(a=function(a,b,c,d){return["comment",d.join("")].concat([["line",b],["col",c]])}(i.offset,i.line,i.column,a[1])),null===a&&(R=e(i)),S--,0===S&&null===a&&g("comment"),a}function I(){var a,b,d,h,i,j,k,l,m,n,o;if(m=e(R),a=J(),null!==a){for(b=[],d=O();null!==d;)b.push(d),d=O();if(null!==b)if(/^[#?^><+%:@\/~%]/.test(c.charAt(R.offset))?(d=c.charAt(R.offset),f(R,1)):(d=null,0===S&&g("[#?^><+%:@\\/~%]")),null!==d){for(h=[],i=O();null!==i;)h.push(i),i=O();if(null!==h){if(n=e(R),o=e(R),S++,j=K(),S--,null===j?j="":(j=null,R=e(o)),null!==j?(o=e(R),S++,k=N(),S--,null===k?k="":(k=null,R=e(o)),null!==k?(c.length>R.offset?(l=c.charAt(R.offset),f(R,1)):(l=null,0===S&&g("any character")),null!==l?j=[j,k,l]:(j=null,R=e(n))):(j=null,R=e(n))):(j=null,R=e(n)),null!==j)for(i=[];null!==j;)i.push(j),n=e(R),o=e(R),S++,j=K(),S--,null===j?j="":(j=null,R=e(o)),null!==j?(o=e(R),S++,k=N(),S--,null===k?k="":(k=null,R=e(o)),null!==k?(c.length>R.offset?(l=c.charAt(R.offset),f(R,1)):(l=null,0===S&&g("any character")),null!==l?j=[j,k,l]:(j=null,R=e(n))):(j=null,R=e(n))):(j=null,R=e(n));else i=null;if(null!==i){for(j=[],k=O();null!==k;)j.push(k),k=O();null!==j?(k=K(),null!==k?a=[a,b,d,h,i,j,k]:(a=null,R=e(m))):(a=null,R=e(m))}else a=null,R=e(m)}else a=null,R=e(m)}else a=null,R=e(m);else a=null,R=e(m)}else a=null,R=e(m);return null===a&&(a=p()),a}function J(){var a;return 123===c.charCodeAt(R.offset)?(a="{",f(R,1)):(a=null,0===S&&g('"{"')),a}function K(){var a;return 125===c.charCodeAt(R.offset)?(a="}",f(R,1)):(a=null,0===S&&g('"}"')),a}function L(){var a;return 91===c.charCodeAt(R.offset)?(a="[",f(R,1)):(a=null,0===S&&g('"["')),a}function M(){var a;return 93===c.charCodeAt(R.offset)?(a="]",f(R,1)):(a=null,0===S&&g('"]"')),a
}function N(){var a;return 10===c.charCodeAt(R.offset)?(a="\n",f(R,1)):(a=null,0===S&&g('"\\n"')),null===a&&("\r\n"===c.substr(R.offset,2)?(a="\r\n",f(R,2)):(a=null,0===S&&g('"\\r\\n"')),null===a&&(13===c.charCodeAt(R.offset)?(a="\r",f(R,1)):(a=null,0===S&&g('"\\r"')),null===a&&(8232===c.charCodeAt(R.offset)?(a="\u2028",f(R,1)):(a=null,0===S&&g('"\\u2028"')),null===a&&(8233===c.charCodeAt(R.offset)?(a="\u2029",f(R,1)):(a=null,0===S&&g('"\\u2029"')))))),a}function O(){var a;return/^[\t\x0B\f \xA0\uFEFF]/.test(c.charAt(R.offset))?(a=c.charAt(R.offset),f(R,1)):(a=null,0===S&&g("[\\t\\x0B\\f \\xA0\\uFEFF]")),null===a&&(a=N()),a}function P(a){a.sort();for(var b=null,c=[],d=0;d<a.length;d++)a[d]!==b&&(c.push(a[d]),b=a[d]);return c}var Q={body:h,part:i,section:j,sec_tag_start:k,end_tag:l,context:m,params:n,bodies:o,reference:p,partial:q,filters:r,special:s,identifier:t,number:u,"float":v,integer:w,path:x,key:y,array:z,array_part:A,inline:B,inline_part:C,buffer:D,literal:E,esc:F,raw:G,comment:H,tag:I,ld:J,rd:K,lb:L,rb:M,eol:N,ws:O};if(void 0!==d){if(void 0===Q[d])throw new Error("Invalid rule name: "+b(d)+".")}else d="body";var R={offset:0,line:1,column:1,seenCR:!1},S=0,T={offset:0,line:1,column:1,seenCR:!1},U=[],V=Q[d]();if(null===V||R.offset!==c.length){var W=Math.max(R.offset,T.offset),X=W<c.length?c.charAt(W):null,Y=R.offset>T.offset?R:T;throw new a.SyntaxError(P(U),X,W,Y.line,Y.column)}return V},toSource:function(){return this._source}};return c.SyntaxError=function(a,c,d,e,f){function g(a,c){var d,e;switch(a.length){case 0:d="end of input";break;case 1:d=a[0];break;default:d=a.slice(0,a.length-1).join(", ")+" or "+a[a.length-1]}return e=c?b(c):"end of input","Expected "+d+" but "+e+" found."}this.name="SyntaxError",this.expected=a,this.found=c,this.message=g(a,c),this.offset=d,this.line=e,this.column=f},c.SyntaxError.prototype=Error.prototype,c}();return dust.parse=a.parse,a}),function(a,b){"object"==typeof exports?module.exports=b(require("./parser").parse,require("./dust")):b(a.dust.parse,a.dust)}(this,function(a,dust){function b(a){var b={};return n.filterNode(b,a)}function c(a,b){var c,d,e,f=[b[0]];for(c=1,d=b.length;d>c;c++)e=n.filterNode(a,b[c]),e&&f.push(e);return f}function d(a,b){var c,d,e,f,g=[b[0]];for(d=1,e=b.length;e>d;d++)f=n.filterNode(a,b[d]),f&&("buffer"===f[0]?c?c[1]+=f[1]:(c=f,g.push(f)):(c=null,g.push(f)));return g}function e(a,b){return["buffer",p[b[1]]]}function f(a,b){return b}function g(){}function h(a,b){var c={name:b,bodies:[],blocks:{},index:0,auto:"h"};return"(function(){dust.register("+(b?'"'+b+'"':"null")+","+n.compileNode(c,a)+");"+i(c)+j(c)+"return body_0;})();"}function i(a){var b,c=[],d=a.blocks;for(b in d)c.push('"'+b+'":'+d[b]);return c.length?(a.blocks="ctx=ctx.shiftBlocks(blocks);","var blocks={"+c.join(",")+"};"):a.blocks=""}function j(a){var b,c,d=[],e=a.bodies,f=a.blocks;for(b=0,c=e.length;c>b;b++)d[b]="function body_"+b+"(chk,ctx){"+f+"return chk"+e[b]+";}";return d.join("")}function k(a,b){var c,d,e="";for(c=1,d=b.length;d>c;c++)e+=n.compileNode(a,b[c]);return e}function l(a,b,c){return"."+c+"("+n.compileNode(a,b[1])+","+n.compileNode(a,b[2])+","+n.compileNode(a,b[4])+","+n.compileNode(a,b[3])+")"}function m(a){return a.replace(q,"\\\\").replace(r,'\\"').replace(s,"\\f").replace(t,"\\n").replace(u,"\\r").replace(v,"\\t")}var n={},o=dust.isArray;n.compile=function(c,d){d||null===d||dust.log(new Error("Template name parameter cannot be undefined when calling dust.compile"),"ERROR");try{var e=b(a(c));return h(e,d)}catch(f){if(!f.line||!f.column)throw f;throw new SyntaxError(f.message+" At line : "+f.line+", column : "+f.column)}},n.filterNode=function(a,b){return n.optimizers[b[0]](a,b)},n.optimizers={body:d,buffer:f,special:e,format:g,reference:c,"#":c,"?":c,"^":c,"<":c,"+":c,"@":c,"%":c,partial:c,context:c,params:c,bodies:c,param:c,filters:f,key:f,path:f,literal:f,raw:f,comment:g,line:g,col:g},n.pragmas={esc:function(a,b,c){var d,e=a.auto;return b||(b="h"),a.auto="s"===b?"":b,d=k(a,c.block),a.auto=e,d}};var p={s:" ",n:"\n",r:"\r",lb:"{",rb:"}"};n.compileNode=function(a,b){return n.nodes[b[0]](a,b)},n.nodes={body:function(a,b){var c=a.index++,d="body_"+c;return a.bodies[c]=k(a,b),d},buffer:function(a,b){return".write("+w(b[1])+")"},format:function(a,b){return".write("+w(b[1]+b[2])+")"},reference:function(a,b){return".reference("+n.compileNode(a,b[1])+",ctx,"+n.compileNode(a,b[2])+")"},"#":function(a,b){return l(a,b,"section")},"?":function(a,b){return l(a,b,"exists")},"^":function(a,b){return l(a,b,"notexists")},"<":function(a,b){for(var c=b[4],d=1,e=c.length;e>d;d++){var f=c[d],g=f[1][1];if("block"===g)return a.blocks[b[1].text]=n.compileNode(a,f[2]),""}return""},"+":function(a,b){return"undefined"==typeof b[1].text&&"undefined"==typeof b[4]?".block(ctx.getBlock("+n.compileNode(a,b[1])+",chk, ctx),"+n.compileNode(a,b[2])+", {},"+n.compileNode(a,b[3])+")":".block(ctx.getBlock("+w(b[1].text)+"),"+n.compileNode(a,b[2])+","+n.compileNode(a,b[4])+","+n.compileNode(a,b[3])+")"},"@":function(a,b){return".helper("+w(b[1].text)+","+n.compileNode(a,b[2])+","+n.compileNode(a,b[4])+","+n.compileNode(a,b[3])+")"},"%":function(a,b){var c,d,e,f,g,h,i,j,k,l=b[1][1];if(!n.pragmas[l])return"";for(c=b[4],d={},j=1,k=c.length;k>j;j++)h=c[j],d[h[1][1]]=h[2];for(e=b[3],f={},j=1,k=e.length;k>j;j++)i=e[j],f[i[1][1]]=i[2][1];return g=b[2][1]?b[2][1].text:null,n.pragmas[l](a,g,d,f)},partial:function(a,b){return".partial("+n.compileNode(a,b[1])+","+n.compileNode(a,b[2])+","+n.compileNode(a,b[3])+")"},context:function(a,b){return b[1]?"ctx.rebase("+n.compileNode(a,b[1])+")":"ctx"},params:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++)c.push(n.compileNode(a,b[d]));return c.length?"{"+c.join(",")+"}":"null"},bodies:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++)c.push(n.compileNode(a,b[d]));return"{"+c.join(",")+"}"},param:function(a,b){return n.compileNode(a,b[1])+":"+n.compileNode(a,b[2])},filters:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++){var f=b[d];c.push('"'+f+'"')}return'"'+a.auto+'"'+(c.length?",["+c.join(",")+"]":"")},key:function(a,b){return'ctx.get(["'+b[1]+'"], false)'},path:function(a,b){for(var c=b[1],d=b[2],e=[],f=0,g=d.length;g>f;f++)e.push(o(d[f])?n.compileNode(a,d[f]):'"'+d[f]+'"');return"ctx.getPath("+c+", ["+e.join(",")+"])"},literal:function(a,b){return w(b[1])},raw:function(a,b){return".write("+w(b[1])+")"}};var q=/\\/g,r=/"/g,s=/\f/g,t=/\n/g,u=/\r/g,v=/\t/g,w="undefined"==typeof JSON?function(a){return'"'+m(a)+'"'}:JSON.stringify;return dust.compile=n.compile,dust.filterNode=n.filterNode,dust.optimizers=n.optimizers,dust.pragmas=n.pragmas,dust.compileNode=n.compileNode,dust.nodes=n.nodes,n});