(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{266:function(e,t,n){e.exports=async function(){const{QRCodeScanner:e}=await n.e(60).then(n.t.bind(null,359,7)),t=await n.e(4).then(n.t.bind(null,146,7)),l=await Promise.all([n.e(0),n.e(10)]).then(n.t.bind(null,188,7)),d=await n.e(14).then(n.t.bind(null,227,7)),a=await Promise.all([n.e(11),n.e(8)]).then(n.t.bind(null,189,7)),o=await n.e(7).then(n.t.bind(null,180,7)),s=await Promise.all([n.e(1),n.e(0),n.e(2),n.e(3),n.e(12)]).then(n.t.bind(null,153,7)),r=(await Promise.all([n.e(0),n.e(9),n.e(13),n.e(28)]).then(n.t.bind(null,28,7))).default,i={scanner:null,start:function(){document.getElementById("paperqrscanner").className="show",i.showError(null);i.scanner.isSupported()?i.scanner.start():document.getElementById("paperqrnotsupported").className=""},stop:function(){i.scanner.stop(),document.getElementById("paperqrscanner").className=""},showError:function(e){e?"PERMISSION_DENIED"===e||"PermissionDeniedError"===e?(document.getElementById("paperqrerror").textContent="",document.getElementById("paperqrpermissiondenied").className=""):(document.getElementById("paperqrerror").textContent=e,document.getElementById("paperqrpermissiondenied").className="hide"):(document.getElementById("paperqrerror").textContent="",document.getElementById("paperqrpermissiondenied").className="hide")}},c=function(){const e=document.getElementById("detailprivkey").value.toString().replace(/^\s+|\s+$/g,"");document.getElementById("detailprivkey").value=e;const n=document.getElementById("detailbip38commands").style.display;if(y(),e)if(l.isBIP38Format(e)){if(document.getElementById("detailbip38commands").style.display=n,"block"!==n)return document.getElementById("detailbip38commands").style.display="block",void document.getElementById("detailprivkeypassphrase").focus();const d=document.getElementById("detailprivkeypassphrase").value.toString().replace(/^\s+|\s+$/g,"");if(!d)return void alert(t.get("bip38alertpassphraserequired"));document.getElementById("busyblock").className="busy",document.getElementById("detailprivbip38").textContent=e,document.getElementById("detailbip38").style.display="block",l.BIP38EncryptedKeyToByteArrayAsync(e,d,(function(e){document.getElementById("busyblock").className="",e.message?(alert(e.message),y()):m(l.create(e))}))}else{let n=l.decodePrivateKey(e);if(n)m(n);else if(e.length>=d.minPassphraseLength){if(confirm(t.get("detailconfirmsha256"))){const t=s.crypto.sha256(e);n=l.create(r.fromBuffer(t),null)}else y()}else alert(t.get("detailalertnotvalidprivatekey")),y()}},m=function(e){if(o.selectedCurrency.havePrivateKey(e)){const t=o.selectedCurrency.getPrivateKeyBuffer(e);document.getElementById("detailprivhex").textContent=t.toString("hex").toUpperCase(),document.getElementById("detailprivb64").textContent=t.toString("base64");const n=o.selectedCurrency.getWIFTitleNames(),l={};for(let t in n)if({}.hasOwnProperty.call(n,t)){const d=n[t].toLowerCase().replace(/[^a-z0-9]/g,""),a=o.selectedCurrency.getWIFByType(e,+t);l["detailqrcode"+d]=a,document.getElementById("detailaddress"+d).textContent=a}a.showQrCode(l,4)}const t=o.selectedCurrency.getPublicKey(e,!0),n=o.selectedCurrency.getPublicKey(e,!1);document.getElementById("detailpubkey").textContent=n.toString("hex").toUpperCase(),document.getElementById("detailpubkeycomp").textContent=t.toString("hex").toUpperCase();const l=o.selectedCurrency.getAddressTitleNames(),d={};for(let t in l)if({}.hasOwnProperty.call(l,t)){const n=l[t].toLowerCase().replace(/[^a-z0-9]/g,""),a=o.selectedCurrency.getAddressWith(e,+t);d["detailqrcode"+n]=a,document.getElementById("detailaddress"+n).textContent=a}a.showQrCode(d,4)},y=function(){document.getElementById("detailpubkey").textContent="",document.getElementById("detailpubkeycomp").textContent="",document.getElementById("detailprivhex").textContent="",document.getElementById("detailprivb64").textContent="",document.getElementById("detailprivb6").textContent="",document.getElementById("detailprivmini").textContent="",document.getElementById("detailprivbip38").textContent="",document.getElementById("detailb6").style.display="none",document.getElementById("detailmini").style.display="none",document.getElementById("detailbip38commands").style.display="none",document.getElementById("detailbip38").style.display="none";const e=Array.prototype.concat.call(o.selectedCurrency.getAddressTitleNames(),o.selectedCurrency.getWIFTitleNames());for(let t in e)if({}.hasOwnProperty.call(e,t)){const n=e[t].toLowerCase().replace(/[^a-z0-9]/g,"");document.getElementById("detailqrcode"+n).textContent="",document.getElementById("detailaddress"+n).textContent=""}};return{qrscanner:i,open:function(){document.getElementById("detailarea").style.display="block",document.getElementById("detailprivkey").focus(),i.scanner||(i.scanner=new e(320,240,"paperqroutput",(function(e){document.getElementById("detailprivkey").value=e,document.getElementById("paperqrscanner").className="",c()}),(function(e){i.showError(e)})))},close:function(){document.getElementById("detailarea").style.display="none"},openCloseFaq:function(e){"block"===document.getElementById("detaila"+e).style.display?(document.getElementById("detaila"+e).style.display="none",document.getElementById("detaile"+e).setAttribute("class","more")):(document.getElementById("detaila"+e).style.display="block",document.getElementById("detaile"+e).setAttribute("class","less"))},viewDetails:c,populateKeyDetails:m,clear:y}}(),e.exports.__esModule=!0}}]);