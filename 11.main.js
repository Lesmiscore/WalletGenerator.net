(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{325:function(e,r,n){var t;!function(i){"use strict";var o,s=/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,u=Math.ceil,f=Math.floor,l="[BigNumber Error] ",c=l+"Number primitive has more than 15 significant digits: ",a=1e14,h=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],p=1e9;function g(e){var r=0|e;return e>0||e===r?r:r-1}function w(e){for(var r,n,t=1,i=e.length,o=e[0]+"";t<i;){for(n=14-(r=e[t++]+"").length;n--;r="0"+r);o+=r}for(i=o.length;48===o.charCodeAt(--i););return o.slice(0,i+1||1)}function m(e,r){var n,t,i=e.c,o=r.c,s=e.s,u=r.s,f=e.e,l=r.e;if(!s||!u)return null;if(n=i&&!i[0],t=o&&!o[0],n||t)return n?t?0:-u:s;if(s!=u)return s;if(n=s<0,t=f==l,!i||!o)return t?0:!i^n?1:-1;if(!t)return f>l^n?1:-1;for(u=(f=i.length)<(l=o.length)?f:l,s=0;s<u;s++)if(i[s]!=o[s])return i[s]>o[s]^n?1:-1;return f==l?0:f>l^n?1:-1}function d(e,r,n,t){if(e<r||e>n||e!==f(e))throw Error(l+(t||"Argument")+("number"==typeof e?e<r||e>n?" out of range: ":" not an integer: ":" not a primitive number: ")+String(e))}function v(e){var r=e.c.length-1;return g(e.e/14)==r&&e.c[r]%2!=0}function N(e,r){return(e.length>1?e.charAt(0)+"."+e.slice(1):e)+(r<0?"e":"e+")+r}function O(e,r,n){var t,i;if(r<0){for(i=n+".";++r;i+=n);e=i+e}else if(++r>(t=e.length)){for(i=n,r-=t;--r;i+=n);e+=i}else r<t&&(e=e.slice(0,r)+"."+e.slice(r));return e}(o=function e(r){var n,t,i,o,b,y,E,A,S,R=F.prototype={constructor:F,toString:null,valueOf:null},_=new F(1),D=20,P=4,B=-7,L=21,x=-1e7,U=1e7,I=!1,T=1,C=0,M={prefix:"",groupSize:3,secondaryGroupSize:0,groupSeparator:",",decimalSeparator:".",fractionGroupSize:0,fractionGroupSeparator:" ",suffix:""},k="0123456789abcdefghijklmnopqrstuvwxyz",G=!0;function F(e,r){var n,o,u,l,a,h,p,g,w=this;if(!(w instanceof F))return new F(e,r);if(null==r){if(e&&!0===e._isBigNumber)return w.s=e.s,void(!e.c||e.e>U?w.c=w.e=null:e.e<x?w.c=[w.e=0]:(w.e=e.e,w.c=e.c.slice()));if((h="number"==typeof e)&&0*e==0){if(w.s=1/e<0?(e=-e,-1):1,e===~~e){for(l=0,a=e;a>=10;a/=10,l++);return void(l>U?w.c=w.e=null:(w.e=l,w.c=[e]))}g=String(e)}else{if(!s.test(g=String(e)))return i(w,g,h);w.s=45==g.charCodeAt(0)?(g=g.slice(1),-1):1}(l=g.indexOf("."))>-1&&(g=g.replace(".","")),(a=g.search(/e/i))>0?(l<0&&(l=a),l+=+g.slice(a+1),g=g.substring(0,a)):l<0&&(l=g.length)}else{if(d(r,2,k.length,"Base"),10==r&&G)return z(w=new F(e),D+w.e+1,P);if(g=String(e),h="number"==typeof e){if(0*e!=0)return i(w,g,h,r);if(w.s=1/e<0?(g=g.slice(1),-1):1,F.DEBUG&&g.replace(/^0\.0*|\./,"").length>15)throw Error(c+e)}else w.s=45===g.charCodeAt(0)?(g=g.slice(1),-1):1;for(n=k.slice(0,r),l=a=0,p=g.length;a<p;a++)if(n.indexOf(o=g.charAt(a))<0){if("."==o){if(a>l){l=p;continue}}else if(!u&&(g==g.toUpperCase()&&(g=g.toLowerCase())||g==g.toLowerCase()&&(g=g.toUpperCase()))){u=!0,a=-1,l=0;continue}return i(w,String(e),h,r)}h=!1,(l=(g=t(g,r,10,w.s)).indexOf("."))>-1?g=g.replace(".",""):l=g.length}for(a=0;48===g.charCodeAt(a);a++);for(p=g.length;48===g.charCodeAt(--p););if(g=g.slice(a,++p)){if(p-=a,h&&F.DEBUG&&p>15&&(e>9007199254740991||e!==f(e)))throw Error(c+w.s*e);if((l=l-a-1)>U)w.c=w.e=null;else if(l<x)w.c=[w.e=0];else{if(w.e=l,w.c=[],a=(l+1)%14,l<0&&(a+=14),a<p){for(a&&w.c.push(+g.slice(0,a)),p-=14;a<p;)w.c.push(+g.slice(a,a+=14));a=14-(g=g.slice(a)).length}else a-=p;for(;a--;g+="0");w.c.push(+g)}}else w.c=[w.e=0]}function q(e,r,n,t){var i,o,s,u,f;if(null==n?n=P:d(n,0,8),!e.c)return e.toString();if(i=e.c[0],s=e.e,null==r)f=w(e.c),f=1==t||2==t&&(s<=B||s>=L)?N(f,s):O(f,s,"0");else if(o=(e=z(new F(e),r,n)).e,u=(f=w(e.c)).length,1==t||2==t&&(r<=o||o<=B)){for(;u<r;f+="0",u++);f=N(f,o)}else if(r-=s,f=O(f,o,"0"),o+1>u){if(--r>0)for(f+=".";r--;f+="0");}else if((r+=o-u)>0)for(o+1==u&&(f+=".");r--;f+="0");return e.s<0&&i?"-"+f:f}function j(e,r){for(var n,t=1,i=new F(e[0]);t<e.length;t++){if(!(n=new F(e[t])).s){i=n;break}r.call(i,n)&&(i=n)}return i}function $(e,r,n){for(var t=1,i=r.length;!r[--i];r.pop());for(i=r[0];i>=10;i/=10,t++);return(n=t+14*n-1)>U?e.c=e.e=null:n<x?e.c=[e.e=0]:(e.e=n,e.c=r),e}function z(e,r,n,t){var i,o,s,l,c,p,g,w=e.c,m=h;if(w){e:{for(i=1,l=w[0];l>=10;l/=10,i++);if((o=r-i)<0)o+=14,s=r,g=(c=w[p=0])/m[i-s-1]%10|0;else if((p=u((o+1)/14))>=w.length){if(!t)break e;for(;w.length<=p;w.push(0));c=g=0,i=1,s=(o%=14)-14+1}else{for(c=l=w[p],i=1;l>=10;l/=10,i++);g=(s=(o%=14)-14+i)<0?0:c/m[i-s-1]%10|0}if(t=t||r<0||null!=w[p+1]||(s<0?c:c%m[i-s-1]),t=n<4?(g||t)&&(0==n||n==(e.s<0?3:2)):g>5||5==g&&(4==n||t||6==n&&(o>0?s>0?c/m[i-s]:0:w[p-1])%10&1||n==(e.s<0?8:7)),r<1||!w[0])return w.length=0,t?(r-=e.e+1,w[0]=m[(14-r%14)%14],e.e=-r||0):w[0]=e.e=0,e;if(0==o?(w.length=p,l=1,p--):(w.length=p+1,l=m[14-o],w[p]=s>0?f(c/m[i-s]%m[s])*l:0),t)for(;;){if(0==p){for(o=1,s=w[0];s>=10;s/=10,o++);for(s=w[0]+=l,l=1;s>=10;s/=10,l++);o!=l&&(e.e++,w[0]==a&&(w[0]=1));break}if(w[p]+=l,w[p]!=a)break;w[p--]=0,l=1}for(o=w.length;0===w[--o];w.pop());}e.e>U?e.c=e.e=null:e.e<x&&(e.c=[e.e=0])}return e}function H(e){var r,n=e.e;return null===n?e.toString():(r=w(e.c),r=n<=B||n>=L?N(r,n):O(r,n,"0"),e.s<0?"-"+r:r)}return F.clone=e,F.ROUND_UP=0,F.ROUND_DOWN=1,F.ROUND_CEIL=2,F.ROUND_FLOOR=3,F.ROUND_HALF_UP=4,F.ROUND_HALF_DOWN=5,F.ROUND_HALF_EVEN=6,F.ROUND_HALF_CEIL=7,F.ROUND_HALF_FLOOR=8,F.EUCLID=9,F.config=F.set=function(e){var r,n;if(null!=e){if("object"!=typeof e)throw Error(l+"Object expected: "+e);if(e.hasOwnProperty(r="DECIMAL_PLACES")&&(d(n=e[r],0,p,r),D=n),e.hasOwnProperty(r="ROUNDING_MODE")&&(d(n=e[r],0,8,r),P=n),e.hasOwnProperty(r="EXPONENTIAL_AT")&&((n=e[r])&&n.pop?(d(n[0],-p,0,r),d(n[1],0,p,r),B=n[0],L=n[1]):(d(n,-p,p,r),B=-(L=n<0?-n:n))),e.hasOwnProperty(r="RANGE"))if((n=e[r])&&n.pop)d(n[0],-p,-1,r),d(n[1],1,p,r),x=n[0],U=n[1];else{if(d(n,-p,p,r),!n)throw Error(l+r+" cannot be zero: "+n);x=-(U=n<0?-n:n)}if(e.hasOwnProperty(r="CRYPTO")){if((n=e[r])!==!!n)throw Error(l+r+" not true or false: "+n);if(n){if("undefined"==typeof crypto||!crypto||!crypto.getRandomValues&&!crypto.randomBytes)throw I=!n,Error(l+"crypto unavailable");I=n}else I=n}if(e.hasOwnProperty(r="MODULO_MODE")&&(d(n=e[r],0,9,r),T=n),e.hasOwnProperty(r="POW_PRECISION")&&(d(n=e[r],0,p,r),C=n),e.hasOwnProperty(r="FORMAT")){if("object"!=typeof(n=e[r]))throw Error(l+r+" not an object: "+n);M=n}if(e.hasOwnProperty(r="ALPHABET")){if("string"!=typeof(n=e[r])||/^.?$|[+\-.\s]|(.).*\1/.test(n))throw Error(l+r+" invalid: "+n);G="0123456789"==n.slice(0,10),k=n}}return{DECIMAL_PLACES:D,ROUNDING_MODE:P,EXPONENTIAL_AT:[B,L],RANGE:[x,U],CRYPTO:I,MODULO_MODE:T,POW_PRECISION:C,FORMAT:M,ALPHABET:k}},F.isBigNumber=function(e){if(!e||!0!==e._isBigNumber)return!1;if(!F.DEBUG)return!0;var r,n,t=e.c,i=e.e,o=e.s;e:if("[object Array]"=={}.toString.call(t)){if((1===o||-1===o)&&i>=-p&&i<=p&&i===f(i)){if(0===t[0]){if(0===i&&1===t.length)return!0;break e}if((r=(i+1)%14)<1&&(r+=14),String(t[0]).length==r){for(r=0;r<t.length;r++)if((n=t[r])<0||n>=a||n!==f(n))break e;if(0!==n)return!0}}}else if(null===t&&null===i&&(null===o||1===o||-1===o))return!0;throw Error(l+"Invalid BigNumber: "+e)},F.maximum=F.max=function(){return j(arguments,R.lt)},F.minimum=F.min=function(){return j(arguments,R.gt)},F.random=(o=9007199254740992*Math.random()&2097151?function(){return f(9007199254740992*Math.random())}:function(){return 8388608*(1073741824*Math.random()|0)+(8388608*Math.random()|0)},function(e){var r,n,t,i,s,c=0,a=[],g=new F(_);if(null==e?e=D:d(e,0,p),i=u(e/14),I)if(crypto.getRandomValues){for(r=crypto.getRandomValues(new Uint32Array(i*=2));c<i;)(s=131072*r[c]+(r[c+1]>>>11))>=9e15?(n=crypto.getRandomValues(new Uint32Array(2)),r[c]=n[0],r[c+1]=n[1]):(a.push(s%1e14),c+=2);c=i/2}else{if(!crypto.randomBytes)throw I=!1,Error(l+"crypto unavailable");for(r=crypto.randomBytes(i*=7);c<i;)(s=281474976710656*(31&r[c])+1099511627776*r[c+1]+4294967296*r[c+2]+16777216*r[c+3]+(r[c+4]<<16)+(r[c+5]<<8)+r[c+6])>=9e15?crypto.randomBytes(7).copy(r,c):(a.push(s%1e14),c+=7);c=i/7}if(!I)for(;c<i;)(s=o())<9e15&&(a[c++]=s%1e14);for(e%=14,(i=a[--c])&&e&&(s=h[14-e],a[c]=f(i/s)*s);0===a[c];a.pop(),c--);if(c<0)a=[t=0];else{for(t=-1;0===a[0];a.splice(0,1),t-=14);for(c=1,s=a[0];s>=10;s/=10,c++);c<14&&(t-=14-c)}return g.e=t,g.c=a,g}),F.sum=function(){for(var e=1,r=arguments,n=new F(r[0]);e<r.length;)n=n.plus(r[e++]);return n},t=function(){function e(e,r,n,t){for(var i,o,s=[0],u=0,f=e.length;u<f;){for(o=s.length;o--;s[o]*=r);for(s[0]+=t.indexOf(e.charAt(u++)),i=0;i<s.length;i++)s[i]>n-1&&(null==s[i+1]&&(s[i+1]=0),s[i+1]+=s[i]/n|0,s[i]%=n)}return s.reverse()}return function(r,t,i,o,s){var u,f,l,c,a,h,p,g,m=r.indexOf("."),d=D,v=P;for(m>=0&&(c=C,C=0,r=r.replace(".",""),h=(g=new F(t)).pow(r.length-m),C=c,g.c=e(O(w(h.c),h.e,"0"),10,i,"0123456789"),g.e=g.c.length),l=c=(p=e(r,t,i,s?(u=k,"0123456789"):(u="0123456789",k))).length;0==p[--c];p.pop());if(!p[0])return u.charAt(0);if(m<0?--l:(h.c=p,h.e=l,h.s=o,p=(h=n(h,g,d,v,i)).c,a=h.r,l=h.e),m=p[f=l+d+1],c=i/2,a=a||f<0||null!=p[f+1],a=v<4?(null!=m||a)&&(0==v||v==(h.s<0?3:2)):m>c||m==c&&(4==v||a||6==v&&1&p[f-1]||v==(h.s<0?8:7)),f<1||!p[0])r=a?O(u.charAt(1),-d,u.charAt(0)):u.charAt(0);else{if(p.length=f,a)for(--i;++p[--f]>i;)p[f]=0,f||(++l,p=[1].concat(p));for(c=p.length;!p[--c];);for(m=0,r="";m<=c;r+=u.charAt(p[m++]));r=O(r,l,u.charAt(0))}return r}}(),n=function(){function e(e,r,n){var t,i,o,s,u=0,f=e.length,l=r%1e7,c=r/1e7|0;for(e=e.slice();f--;)u=((i=l*(o=e[f]%1e7)+(t=c*o+(s=e[f]/1e7|0)*l)%1e7*1e7+u)/n|0)+(t/1e7|0)+c*s,e[f]=i%n;return u&&(e=[u].concat(e)),e}function r(e,r,n,t){var i,o;if(n!=t)o=n>t?1:-1;else for(i=o=0;i<n;i++)if(e[i]!=r[i]){o=e[i]>r[i]?1:-1;break}return o}function n(e,r,n,t){for(var i=0;n--;)e[n]-=i,i=e[n]<r[n]?1:0,e[n]=i*t+e[n]-r[n];for(;!e[0]&&e.length>1;e.splice(0,1));}return function(t,i,o,s,u){var l,c,h,p,w,m,d,v,N,O,b,y,E,A,S,R,_,D=t.s==i.s?1:-1,P=t.c,B=i.c;if(!(P&&P[0]&&B&&B[0]))return new F(t.s&&i.s&&(P?!B||P[0]!=B[0]:B)?P&&0==P[0]||!B?0*D:D/0:NaN);for(N=(v=new F(D)).c=[],D=o+(c=t.e-i.e)+1,u||(u=a,c=g(t.e/14)-g(i.e/14),D=D/14|0),h=0;B[h]==(P[h]||0);h++);if(B[h]>(P[h]||0)&&c--,D<0)N.push(1),p=!0;else{for(A=P.length,R=B.length,h=0,D+=2,(w=f(u/(B[0]+1)))>1&&(B=e(B,w,u),P=e(P,w,u),R=B.length,A=P.length),E=R,b=(O=P.slice(0,R)).length;b<R;O[b++]=0);_=B.slice(),_=[0].concat(_),S=B[0],B[1]>=u/2&&S++;do{if(w=0,(l=r(B,O,R,b))<0){if(y=O[0],R!=b&&(y=y*u+(O[1]||0)),(w=f(y/S))>1)for(w>=u&&(w=u-1),d=(m=e(B,w,u)).length,b=O.length;1==r(m,O,d,b);)w--,n(m,R<d?_:B,d,u),d=m.length,l=1;else 0==w&&(l=w=1),d=(m=B.slice()).length;if(d<b&&(m=[0].concat(m)),n(O,m,b,u),b=O.length,-1==l)for(;r(B,O,R,b)<1;)w++,n(O,R<b?_:B,b,u),b=O.length}else 0===l&&(w++,O=[0]);N[h++]=w,O[0]?O[b++]=P[E]||0:(O=[P[E]],b=1)}while((E++<A||null!=O[0])&&D--);p=null!=O[0],N[0]||N.splice(0,1)}if(u==a){for(h=1,D=N[0];D>=10;D/=10,h++);z(v,o+(v.e=h+14*c-1)+1,s,p)}else v.e=c,v.r=+p;return v}}(),b=/^(-?)0([xbo])(?=\w[\w.]*$)/i,y=/^([^.]+)\.$/,E=/^\.([^.]+)$/,A=/^-?(Infinity|NaN)$/,S=/^\s*\+(?=[\w.])|^\s+|\s+$/g,i=function(e,r,n,t){var i,o=n?r:r.replace(S,"");if(A.test(o))e.s=isNaN(o)?null:o<0?-1:1;else{if(!n&&(o=o.replace(b,(function(e,r,n){return i="x"==(n=n.toLowerCase())?16:"b"==n?2:8,t&&t!=i?e:r})),t&&(i=t,o=o.replace(y,"$1").replace(E,"0.$1")),r!=o))return new F(o,i);if(F.DEBUG)throw Error(l+"Not a"+(t?" base "+t:"")+" number: "+r);e.s=null}e.c=e.e=null},R.absoluteValue=R.abs=function(){var e=new F(this);return e.s<0&&(e.s=1),e},R.comparedTo=function(e,r){return m(this,new F(e,r))},R.decimalPlaces=R.dp=function(e,r){var n,t,i,o=this;if(null!=e)return d(e,0,p),null==r?r=P:d(r,0,8),z(new F(o),e+o.e+1,r);if(!(n=o.c))return null;if(t=14*((i=n.length-1)-g(this.e/14)),i=n[i])for(;i%10==0;i/=10,t--);return t<0&&(t=0),t},R.dividedBy=R.div=function(e,r){return n(this,new F(e,r),D,P)},R.dividedToIntegerBy=R.idiv=function(e,r){return n(this,new F(e,r),0,1)},R.exponentiatedBy=R.pow=function(e,r){var n,t,i,o,s,c,a,h,p=this;if((e=new F(e)).c&&!e.isInteger())throw Error(l+"Exponent not an integer: "+H(e));if(null!=r&&(r=new F(r)),s=e.e>14,!p.c||!p.c[0]||1==p.c[0]&&!p.e&&1==p.c.length||!e.c||!e.c[0])return h=new F(Math.pow(+H(p),s?e.s*(2-v(e)):+H(e))),r?h.mod(r):h;if(c=e.s<0,r){if(r.c?!r.c[0]:!r.s)return new F(NaN);(t=!c&&p.isInteger()&&r.isInteger())&&(p=p.mod(r))}else{if(e.e>9&&(p.e>0||p.e<-1||(0==p.e?p.c[0]>1||s&&p.c[1]>=24e7:p.c[0]<8e13||s&&p.c[0]<=9999975e7)))return o=p.s<0&&v(e)?-0:0,p.e>-1&&(o=1/o),new F(c?1/o:o);C&&(o=u(C/14+2))}for(s?(n=new F(.5),c&&(e.s=1),a=v(e)):a=(i=Math.abs(+H(e)))%2,h=new F(_);;){if(a){if(!(h=h.times(p)).c)break;o?h.c.length>o&&(h.c.length=o):t&&(h=h.mod(r))}if(i){if(0===(i=f(i/2)))break;a=i%2}else if(z(e=e.times(n),e.e+1,1),e.e>14)a=v(e);else{if(0===(i=+H(e)))break;a=i%2}p=p.times(p),o?p.c&&p.c.length>o&&(p.c.length=o):t&&(p=p.mod(r))}return t?h:(c&&(h=_.div(h)),r?h.mod(r):o?z(h,C,P,void 0):h)},R.integerValue=function(e){var r=new F(this);return null==e?e=P:d(e,0,8),z(r,r.e+1,e)},R.isEqualTo=R.eq=function(e,r){return 0===m(this,new F(e,r))},R.isFinite=function(){return!!this.c},R.isGreaterThan=R.gt=function(e,r){return m(this,new F(e,r))>0},R.isGreaterThanOrEqualTo=R.gte=function(e,r){return 1===(r=m(this,new F(e,r)))||0===r},R.isInteger=function(){return!!this.c&&g(this.e/14)>this.c.length-2},R.isLessThan=R.lt=function(e,r){return m(this,new F(e,r))<0},R.isLessThanOrEqualTo=R.lte=function(e,r){return-1===(r=m(this,new F(e,r)))||0===r},R.isNaN=function(){return!this.s},R.isNegative=function(){return this.s<0},R.isPositive=function(){return this.s>0},R.isZero=function(){return!!this.c&&0==this.c[0]},R.minus=function(e,r){var n,t,i,o,s=this,u=s.s;if(r=(e=new F(e,r)).s,!u||!r)return new F(NaN);if(u!=r)return e.s=-r,s.plus(e);var f=s.e/14,l=e.e/14,c=s.c,h=e.c;if(!f||!l){if(!c||!h)return c?(e.s=-r,e):new F(h?s:NaN);if(!c[0]||!h[0])return h[0]?(e.s=-r,e):new F(c[0]?s:3==P?-0:0)}if(f=g(f),l=g(l),c=c.slice(),u=f-l){for((o=u<0)?(u=-u,i=c):(l=f,i=h),i.reverse(),r=u;r--;i.push(0));i.reverse()}else for(t=(o=(u=c.length)<(r=h.length))?u:r,u=r=0;r<t;r++)if(c[r]!=h[r]){o=c[r]<h[r];break}if(o&&(i=c,c=h,h=i,e.s=-e.s),(r=(t=h.length)-(n=c.length))>0)for(;r--;c[n++]=0);for(r=a-1;t>u;){if(c[--t]<h[t]){for(n=t;n&&!c[--n];c[n]=r);--c[n],c[t]+=a}c[t]-=h[t]}for(;0==c[0];c.splice(0,1),--l);return c[0]?$(e,c,l):(e.s=3==P?-1:1,e.c=[e.e=0],e)},R.modulo=R.mod=function(e,r){var t,i,o=this;return e=new F(e,r),!o.c||!e.s||e.c&&!e.c[0]?new F(NaN):!e.c||o.c&&!o.c[0]?new F(o):(9==T?(i=e.s,e.s=1,t=n(o,e,0,3),e.s=i,t.s*=i):t=n(o,e,0,T),(e=o.minus(t.times(e))).c[0]||1!=T||(e.s=o.s),e)},R.multipliedBy=R.times=function(e,r){var n,t,i,o,s,u,f,l,c,h,p,w,m,d,v=this,N=v.c,O=(e=new F(e,r)).c;if(!(N&&O&&N[0]&&O[0]))return!v.s||!e.s||N&&!N[0]&&!O||O&&!O[0]&&!N?e.c=e.e=e.s=null:(e.s*=v.s,N&&O?(e.c=[0],e.e=0):e.c=e.e=null),e;for(t=g(v.e/14)+g(e.e/14),e.s*=v.s,(f=N.length)<(h=O.length)&&(m=N,N=O,O=m,i=f,f=h,h=i),i=f+h,m=[];i--;m.push(0));for(d=a,1e7,i=h;--i>=0;){for(n=0,p=O[i]%1e7,w=O[i]/1e7|0,o=i+(s=f);o>i;)n=((l=p*(l=N[--s]%1e7)+(u=w*l+(c=N[s]/1e7|0)*p)%1e7*1e7+m[o]+n)/d|0)+(u/1e7|0)+w*c,m[o--]=l%d;m[o]=n}return n?++t:m.splice(0,1),$(e,m,t)},R.negated=function(){var e=new F(this);return e.s=-e.s||null,e},R.plus=function(e,r){var n,t=this,i=t.s;if(r=(e=new F(e,r)).s,!i||!r)return new F(NaN);if(i!=r)return e.s=-r,t.minus(e);var o=t.e/14,s=e.e/14,u=t.c,f=e.c;if(!o||!s){if(!u||!f)return new F(i/0);if(!u[0]||!f[0])return f[0]?e:new F(u[0]?t:0*i)}if(o=g(o),s=g(s),u=u.slice(),i=o-s){for(i>0?(s=o,n=f):(i=-i,n=u),n.reverse();i--;n.push(0));n.reverse()}for((i=u.length)-(r=f.length)<0&&(n=f,f=u,u=n,r=i),i=0;r;)i=(u[--r]=u[r]+f[r]+i)/a|0,u[r]=a===u[r]?0:u[r]%a;return i&&(u=[i].concat(u),++s),$(e,u,s)},R.precision=R.sd=function(e,r){var n,t,i,o=this;if(null!=e&&e!==!!e)return d(e,1,p),null==r?r=P:d(r,0,8),z(new F(o),e,r);if(!(n=o.c))return null;if(t=14*(i=n.length-1)+1,i=n[i]){for(;i%10==0;i/=10,t--);for(i=n[0];i>=10;i/=10,t++);}return e&&o.e+1>t&&(t=o.e+1),t},R.shiftedBy=function(e){return d(e,-9007199254740991,9007199254740991),this.times("1e"+e)},R.squareRoot=R.sqrt=function(){var e,r,t,i,o,s=this,u=s.c,f=s.s,l=s.e,c=D+4,a=new F("0.5");if(1!==f||!u||!u[0])return new F(!f||f<0&&(!u||u[0])?NaN:u?s:1/0);if(0==(f=Math.sqrt(+H(s)))||f==1/0?(((r=w(u)).length+l)%2==0&&(r+="0"),f=Math.sqrt(+r),l=g((l+1)/2)-(l<0||l%2),t=new F(r=f==1/0?"5e"+l:(r=f.toExponential()).slice(0,r.indexOf("e")+1)+l)):t=new F(f+""),t.c[0])for((f=(l=t.e)+c)<3&&(f=0);;)if(o=t,t=a.times(o.plus(n(s,o,c,1))),w(o.c).slice(0,f)===(r=w(t.c)).slice(0,f)){if(t.e<l&&--f,"9999"!=(r=r.slice(f-3,f+1))&&(i||"4999"!=r)){+r&&(+r.slice(1)||"5"!=r.charAt(0))||(z(t,t.e+D+2,1),e=!t.times(t).eq(s));break}if(!i&&(z(o,o.e+D+2,0),o.times(o).eq(s))){t=o;break}c+=4,f+=4,i=1}return z(t,t.e+D+1,P,e)},R.toExponential=function(e,r){return null!=e&&(d(e,0,p),e++),q(this,e,r,1)},R.toFixed=function(e,r){return null!=e&&(d(e,0,p),e=e+this.e+1),q(this,e,r)},R.toFormat=function(e,r,n){var t,i=this;if(null==n)null!=e&&r&&"object"==typeof r?(n=r,r=null):e&&"object"==typeof e?(n=e,e=r=null):n=M;else if("object"!=typeof n)throw Error(l+"Argument not an object: "+n);if(t=i.toFixed(e,r),i.c){var o,s=t.split("."),u=+n.groupSize,f=+n.secondaryGroupSize,c=n.groupSeparator||"",a=s[0],h=s[1],p=i.s<0,g=p?a.slice(1):a,w=g.length;if(f&&(o=u,u=f,f=o,w-=o),u>0&&w>0){for(o=w%u||u,a=g.substr(0,o);o<w;o+=u)a+=c+g.substr(o,u);f>0&&(a+=c+g.slice(o)),p&&(a="-"+a)}t=h?a+(n.decimalSeparator||"")+((f=+n.fractionGroupSize)?h.replace(new RegExp("\\d{"+f+"}\\B","g"),"$&"+(n.fractionGroupSeparator||"")):h):a}return(n.prefix||"")+t+(n.suffix||"")},R.toFraction=function(e){var r,t,i,o,s,u,f,c,a,p,g,m,d=this,v=d.c;if(null!=e&&(!(f=new F(e)).isInteger()&&(f.c||1!==f.s)||f.lt(_)))throw Error(l+"Argument "+(f.isInteger()?"out of range: ":"not an integer: ")+H(f));if(!v)return new F(d);for(r=new F(_),a=t=new F(_),i=c=new F(_),m=w(v),s=r.e=m.length-d.e-1,r.c[0]=h[(u=s%14)<0?14+u:u],e=!e||f.comparedTo(r)>0?s>0?r:a:f,u=U,U=1/0,f=new F(m),c.c[0]=0;p=n(f,r,0,1),1!=(o=t.plus(p.times(i))).comparedTo(e);)t=i,i=o,a=c.plus(p.times(o=a)),c=o,r=f.minus(p.times(o=r)),f=o;return o=n(e.minus(t),i,0,1),c=c.plus(o.times(a)),t=t.plus(o.times(i)),c.s=a.s=d.s,g=n(a,i,s*=2,P).minus(d).abs().comparedTo(n(c,t,s,P).minus(d).abs())<1?[a,i]:[c,t],U=u,g},R.toNumber=function(){return+H(this)},R.toPrecision=function(e,r){return null!=e&&d(e,1,p),q(this,e,r,2)},R.toString=function(e){var r,n=this,i=n.s,o=n.e;return null===o?i?(r="Infinity",i<0&&(r="-"+r)):r="NaN":(null==e?r=o<=B||o>=L?N(w(n.c),o):O(w(n.c),o,"0"):10===e&&G?r=O(w((n=z(new F(n),D+o+1,P)).c),n.e,"0"):(d(e,2,k.length,"Base"),r=t(O(w(n.c),o,"0"),10,e,i,!0)),i<0&&n.c[0]&&(r="-"+r)),r},R.valueOf=R.toJSON=function(){return H(this)},R._isBigNumber=!0,null!=r&&F.set(r),F}()).default=o.BigNumber=o,void 0===(t=function(){return o}.call(r,n,r,e))||(e.exports=t)}()}}]);