module.exports = (async function () {
  const singlewallet = await import("./ninja.singlewallet.js");
  const paperwallet = await import("./ninja.paperwallet.js");
  const bulkwallet = await import("./ninja.bulkwallet.js");
  const brainwallet = await import("./ninja.brainwallet.js");
  const detailwallet = await import("./ninja.detailwallet.js");
  const janin = await import("./janin.currency.js");
  const { tabSwitch, toggleFaqQuestion, printMany, ev } = await import("./ninja.misc.js");

  ev("#currency", "change", function () {
    janin.useCurrency(this.selectedIndex);
  });

  ev("#menu div", "click", function () {
    tabSwitch(this);
  });

  ev("#newaddress", "click", function () {
    singlewallet.generateNewAddressAndKey();
  });

  ev("#singleprint", "click", function () {
    window.print();
  });

  ev("#securitystep7 a", "click", async function () {
    await tabSwitch(document.getElementById("donate"));
  });

  for (let i = 1; i <= 11; i++) {
    ev(`#faqLink${i}`, "click", function () {
      toggleFaqQuestion(`faqQuestion${i}`);
    });
  }

  ev("#paperencrypt", "change", function () {
    paperwallet.toggleEncrypt(this);
  });

  ev("#addresstype", "change", function () {
    paperwallet.publicMode = this.selectedIndex;
  });
  ev("#singleaddresstype", "change", function () {
    singlewallet.publicMode = this.selectedIndex;
  });
  ev("#bulkaddresstype", "change", function () {
    bulkwallet.publicMode = this.selectedIndex;
  });
  ev("#brainaddresstype", "change", function () {
    brainwallet.publicMode = this.selectedIndex;
  });

  ev("#papergenerate[value='Randomly generate']", "click", function () {
    paperwallet.build(document.getElementById("paperpassphrase").value);
  });

  ev("#papergenerate[value^='Apply']", "click", function () {
    paperwallet.testAndApplyVanityKey();
  });

  ev("#paperprint", "click", function () {
    window.print();
  });

  ev("#singleprint", "click", async function () {
    await printMany();
  });

  ev("#bulkgenerate", "click", function () {
    bulkwallet.buildCSV(document.getElementById("bulklimit").value * 1, document.getElementById("bulkstartindex").value * 1);
  });

  ev("#bulkprint", "click", function () {
    window.print();
  });

  ev("#brainpassphrase", "focus", function () {
    this.select();
  });

  ev("#brainpassphrase", "keypress", function (event) {
    if (event.keyCode === 13) {
      brainwallet.view();
    }
  });

  ev("#brainpassphraseshow", "change", function () {
    brainwallet.showToggle(this);
  });

  ev("#brainprint", "click", function () {
    window.print();
  });

  ev("#brainpassphraseconfirm", "focus", function () {
    this.select();
  });

  ev("#brainpassphraseconfirm", "keypress", function () {
    if (event.keyCode === 13) {
      brainwallet.view();
    }
  });

  ev("#brainview", "click", function () {
    brainwallet.view();
  });

  ev("#detailprivkey", "focus", function () {
    this.select();
  });

  ev("#detailprivkey", "keypress", function () {
    if (event.keyCode === 13) {
      detailwallet.viewDetails();
    }
  });

  ev(".qrcodeinputwrapper img", "click", function () {
    detailwallet.qrscanner.start();
  });

  ev("#detailview", "click", function () {
    detailwallet.viewDetails();
  });

  ev("#detailprint", "click", function () {
    window.print();
  });

  ev("#paperqrscanner #mainbody button", "click", function () {
    detailwallet.qrscanner.stop();
  });

  ev("#detaillabelpassphrase", "focus", function () {
    this.select();
  });

  ev("#detaillabelpassphrase", "keypress", function () {
    if (event.keyCode === 13) {
      detailwallet.viewDetails();
    }
  });

  ev("#detaildecrypt", "click", function () {
    detailwallet.viewDetails();
  });

  ev("#detailq1", "click", function () {
    detailwallet.openCloseFaq(1);
  });

  ev("#footersupport", "click", function () {
    tabSwitch(document.getElementById("donate"));
  });

  ev("#singlevanitygenstart", "click", function () {
    singlewallet.startVanitygen(document.getElementById("singlevanitygenpattern").value);
  });

  ev("#singlevanitygenstop", "click", function () {
    singlewallet.stopVanitygen();
  });
})();
