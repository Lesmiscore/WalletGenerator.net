(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{368:function(e,t,r){e.exports=async function(){const e=(await Promise.all([r.e(1),r.e(0),r.e(2),r.e(3),r.e(31)]).then(r.t.bind(null,407,7))).default,t=(await Promise.all([r.e(0),r.e(45)]).then(r.t.bind(null,21,7))).default,n=await r.e(6).then(r.t.bind(null,147,7)),s=class extends n{constructor(t,r,n){super(t,r),this.network=n||e.network.data.mainnet.id}_create(t){return e.keyPair.create(t)}create(e,t,r){return this._create(e.toBuffer().toString("hex"))}makeRandom(e){return this._create(t(32).toString("hex"))}isPrivateKey(e){return(e=(""+e).toLowerCase()).startsWith("0x")&&(e=e.slice(2)),/^[0-9a-f]{64}$/.test(e)}decodePrivateKey(e){return(e=(""+e).toLowerCase()).startsWith("0x")&&(e=e.slice(2)),this._create(e)}getAddressWith(t,r){return e.address.toAddress(t.publicKey,this.network)}getWIFForAddress(e,t){return e.secretKey.toString("hex")}getWIFByType(e,t){return e.secretKey.toString("hex")}getAddressFormatNames(){return["Normal"]}getAddressTitleNames(){return["Public Address"]}getWIFTitleNames(){return["Private Key"]}getPublicKey(e,t){return e.publicKey}getPrivateKeyBuffer(e){return e.secretKey}havePrivateKey(e){return!0}isVanitygenPossible(t,r){if(!t)return!0;t=t.toUpperCase();const n=e.network.id2Char(this.network);return new RegExp(`^${n}[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]{0,39}$`).test(t)}testVanitygenMatch(e,t,r){return e=e.toUpperCase(),(t=t.toUpperCase()).startsWith(e)}isUnsure(){return"nem"}};return s.mainnet=e.network.data.mainnet.id,s.testnet=e.network.data.testnet.id,s.mijin=e.network.data.mijin.id,s}(),e.exports.__esModule=!0}}]);