(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{369:function(e,r,t){(function(r){e.exports=async function(){const e=await Promise.all([t.e(1),t.e(2),t.e(3),t.e(9),t.e(38)]).then(t.t.bind(null,411,7)),s=await t.e(6).then(t.t.bind(null,177,7)),i=await Promise.all([t.e(2),t.e(17)]).then(t.t.bind(null,30,7)),a=i.eddsa("ed25519"),n=i.ec("secp256k1");return class extends s{constructor(e,r){super(e,r)}create(r,t,s){const i=e.generateSeed({entropy:r.toBuffer()}),a=e.deriveKeypair(i);return a.seed=i,a}makeRandom(r){const t=e.generateSeed(),s=e.deriveKeypair(t);return s.seed=t,s}isPrivateKey(r){try{return e.deriveKeypair(r),!0}catch(e){}return r=(""+r).toLowerCase(),!!/(?:00|ed)[0-9a-f]{64}/.test(r)}decodePrivateKey(r){try{const t=e.deriveKeypair(r);return t.seed=r,t}catch(e){}return r=(""+r).toLowerCase(),!!/(?:00|ed)[0-9a-f]{64}/.test(r)&&{privateKey:r,publicKey:this.privateToPublic(r)}}getAddressWith(r,t){return e.deriveAddress(r.publicKey)}getWIFForAddress(e,r){return e.seed||e.privateKey}getWIFByType(e,r){switch(r){case 0:return e.privateKey;default:return e.seed||e.privateKey}}getAddressFormatNames(e){return["Normal","Hex","Seed"]}getAddressTitleNames(e){return["Public Address"]}getWIFTitleNames(e){return["Raw hex","Seed"]}getPublicKey(e,t){return r.from(e.publicKey,"hex")}getPrivateKeyBuffer(e){return r.from(e.privateKey,"hex")}havePrivateKey(e){return!(!e.seed&&!e.privateKey)}privateToPublic(e){return(e=(""+e).toLowerCase()).startsWith("00")?r.from(n.keyFromPrivate(e.slice(2)).getPublic().encodeCompressed()).toString("hex"):e.startsWith("ed")?r.from(a.keyFromPrivate(e.slice(2)).getPublic().encodeCompressed()).toString("hex"):void 0}isUnsure(){return!0}}}(),e.exports.__esModule=!0}).call(this,t(10).Buffer)}}]);