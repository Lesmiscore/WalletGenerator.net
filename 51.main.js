(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{417:function(e,t,r){(function(t){e.exports=async function(){const e=(await Promise.all([r.e(1),r.e(3),r.e(2),r.e(4),r.e(33)]).then(r.t.bind(null,495,7))).default,n=(await r.e(18).then(r.t.bind(null,20,7))).default,i=await r.e(6).then(r.t.bind(null,213,7)),s=class extends i{constructor(t,r,n){super(t,r),this.network=n||e.model.network.data.mainnet.id}_create(r){const n=t.from(r,"hex"),i=e.crypto.keyPair.create(r);return i.privateKeyBuffer=n,i}create(e,t,r){return this._create(e.toBuffer().toString("hex"))}makeRandom(e){return this._create(n(32).toString("hex"))}isPrivateKey(e){return(e=(""+e).toLowerCase()).startsWith("0x")&&(e=e.slice(2)),/^[0-9a-f]{64}$/.test(e)}decodePrivateKey(e){return(e=(""+e).toLowerCase()).startsWith("0x")&&(e=e.slice(2)),this._create(e)}getAddressWith(t,r){return e.model.address.toAddress(t.publicKey.toString(),this.network)}getWIFForAddress(e,t){return e.privateKeyBuffer.toString("hex")}getWIFByType(e,t){return e.privateKeyBuffer.toString("hex")}getAddressFormatNames(){return["Normal"]}getAddressTitleNames(){return["Public Address"]}getWIFTitleNames(){return["Private Key"]}getPublicKey(e,t){return e.publicKey}getPrivateKeyBuffer(e){return t.from(e.privateKeyBuffer)}havePrivateKey(e){return!0}isVanitygenPossible(t,r){if(!t)return!0;t=t.toUpperCase();const n=e.model.network.id2Char(this.network);return new RegExp(`^${n}[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]{0,39}$`).test(t)}testVanitygenMatch(e,t,r){return e=e.toUpperCase(),(t=t.toUpperCase()).startsWith(e)}isUnsure(){return"nem"}};return s.mainnet=e.model.network.data.mainnet.id,s.testnet=e.model.network.data.testnet.id,s.mijin=e.model.network.data.mijin.id,s}(),e.exports.__esModule=!0}).call(this,r(10).Buffer)}}]);