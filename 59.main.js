(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{6:function(e,n,t){e.exports=async function(){const e=await t.e(16).then(t.t.bind(null,225,7)),n=await t.e(15).then(t.t.bind(null,226,7)),i=await t.e(19).then(t.t.bind(null,241,7)),c=await t.e(14).then(t.t.bind(null,227,7)),a=await t.e(26).then(t.t.bind(null,266,7)),s=await t.e(7).then(t.t.bind(null,180,7)),{tabSwitch:l,toggleFaqQuestion:o,printMany:u,ev:r}=await Promise.all([t.e(0),t.e(20)]).then(t.t.bind(null,242,7));r("#currency","change",(async function(){await s.useCurrency(this.selectedIndex)})),r("#menu div","click",(function(){l(this)})),r("#newaddress","click",(function(){e.generateNewAddressAndKey()})),r("#singleprint","click",(function(){window.print()})),r("#securitystep7 a","click",(async function(){await l(document.getElementById("donate"))}));for(let e=1;e<=11;e++)r("#faqLink"+e,"click",(function(){o("faqQuestion"+e)}));r("#paperencrypt","change",(function(){n.toggleEncrypt(this)})),r("#addresstype","change",(function(){n.publicMode=this.selectedIndex})),r("#singleaddresstype","change",(function(){e.publicMode=this.selectedIndex})),r("#bulkaddresstype","change",(function(){i.publicMode=this.selectedIndex})),r("#brainaddresstype","change",(function(){c.publicMode=this.selectedIndex})),r("#papergenerate[value='Randomly generate']","click",(function(){n.build(document.getElementById("paperpassphrase").value)})),r("#papergenerate[value^='Apply']","click",(function(){n.testAndApplyVanityKey()})),r("#paperprint","click",(function(){window.print()})),r("#singleprint","click",(async function(){await u()})),r("#bulkgenerate","click",(function(){i.buildCSV(1*document.getElementById("bulklimit").value,1*document.getElementById("bulkstartindex").value)})),r("#bulkprint","click",(function(){window.print()})),r("#brainpassphrase","focus",(function(){this.select()})),r("#brainpassphrase","keypress",(function(e){13===e.keyCode&&c.view()})),r("#brainpassphraseshow","change",(function(){c.showToggle(this)})),r("#brainprint","click",(function(){window.print()})),r("#brainpassphraseconfirm","focus",(function(){this.select()})),r("#brainpassphraseconfirm","keypress",(function(){13===event.keyCode&&c.view()})),r("#brainview","click",(function(){c.view()})),r("#detailprivkey","focus",(function(){this.select()})),r("#detailprivkey","keypress",(function(){13===event.keyCode&&a.viewDetails()})),r(".qrcodeinputwrapper img","click",(function(){a.qrscanner.start()})),r("#detailview","click",(function(){a.viewDetails()})),r("#detailprint","click",(function(){window.print()})),r("#paperqrscanner #mainbody button","click",(function(){a.qrscanner.stop()})),r("#detaillabelpassphrase","focus",(function(){this.select()})),r("#detaillabelpassphrase","keypress",(function(){13===event.keyCode&&a.viewDetails()})),r("#detaildecrypt","click",(function(){a.viewDetails()})),r("#detailq1","click",(function(){a.openCloseFaq(1)})),r("#footersupport","click",(function(){l(document.getElementById("donate"))})),r("#singlevanitygenstart","click",(function(){e.startVanitygen(document.getElementById("singlevanitygenpattern").value)})),r("#singlevanitygenstop","click",(function(){e.stopVanitygen()}))}()}}]);