(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{370:function(e,r,d){(function(r){e.exports=async function(){const e=await d.e(6).then(d.t.bind(null,177,7)),n=await Promise.all([d.e(1),d.e(2),d.e(3),d.e(22),d.e(36)]).then(d.t.bind(null,418,7)),t=(await d.e(47).then(d.t.bind(null,154,7))).default("9ABCDEFGHIJKLMNOPQRSTUVWXYZ"),s=(await d.e(24).then(d.t.bind(null,13,7))).default,a=/^[9A-Z]+$/;return class extends e{constructor(e,r){super(e,r)}create(e,r,d){return this._makeTrytesBytes(e.toBuffer())}makeRandom(e){return this._makeTrytesRandom()}isPrivateKey(e){return a.test(e)}decodePrivateKey(e){if(this.isPrivateKey(e))return e;throw new Error("Not a valid trytes")}getAddressWith(e,r){return n.generateAddress(e,r)}getWIFForAddress(e,r){return e}getWIFByType(e,r){return e}getAddressFormatNames(){return["Normal (Index 0)","Normal (Index 1)","Normal (Index 2)","Normal (Index 3)","Normal (Index 4)","Normal (Index 5)","Normal (Index 6)","Normal (Index 7)","Normal (Index 8)","Normal (Index 9)","Normal (Index 10)","Normal (Index 11)","Normal (Index 12)","Normal (Index 13)","Normal (Index 14)","Normal (Index 15)"]}getAddressTitleNames(){return["Public Address (Index 0)","Public Address (Index 1)","Public Address (Index 2)","Public Address (Index 3)","Public Address (Index 4)","Public Address (Index 5)","Public Address (Index 6)","Public Address (Index 7)","Public Address (Index 8)","Public Address (Index 9)","Public Address (Index 10)","Public Address (Index 11)","Public Address (Index 12)","Public Address (Index 13)","Public Address (Index 14)","Public Address (Index 15)"]}getWIFTitleNames(){return["Trytes"]}getPublicKey(e,d){return r.allocUnsafe(0)}getPrivateKeyBuffer(e){return t.decode(e)}havePrivateKey(e){return!0}isUnsure(){return!0}_makeTrytesBytes(e){let r=t.encode(e);for(;r.length%81!=0;)r+="9";return r}_makeTrytesRandom(e=47){return this._makeTrytesBytes(s(e))}}}(),e.exports.__esModule=!0}).call(this,d(10).Buffer)}}]);