import React from "react";

module.exports = () => {
  return (
    <div class="firstHalfSingleSafety">
      <h3 id="securitystep0title" class="i18n">
        Step 0. Follow the security checklist recommendation
      </h3>
      <p id="securitystep0" class="i18n">
        First step is to <strong>download</strong> this website from <a href="https://github.com/nao20010128nao/WalletGenerator.net/archive/master.zip">Github</a>
        and open the index.html file directly from your computer. It's just too easy to sneak some evil code in the 6000+ lines of javascript to leak your private key, and you don't want to see your
        fund stolen. Code version control make it much easier to cross-check what actually run. For extra security, <strong>unplug your Internet access</strong> while generating your wallet.
      </p>
      <h3 id="securitystep1title" class="i18n">
        Step 1. Generate new address
      </h3>
      <p id="securitystep1" class="i18n">
        Choose your currency and click on the "Generate new address" button.
      </p>
      <h3 id="securitystep2title" class="i18n">
        Step 2. Print the Paper Wallet
      </h3>
      <p id="securitystep2" class="i18n">
        Click the Paper Wallet tab and print the page on high quality setting.{" "}
        <strong>Never save the page as a PDF file to print it later since a file is more likely to be hacked than a piece of paper.</strong>
      </p>
      <h3 id="securitystep3title" class="i18n">
        Step 3. Fold the Paper Wallet
      </h3>
      <p id="securitystep3" class="i18n">
        Fold your new Paper wallet following the lines.
        <img src="images/foldinginstructions.png" alt="Fold in half lengthwise, and then in three widthwise." />
        <br />
        You can insert one side inside the other to lock the wallet.
      </p>

      <h3 id="securitystep4title" class="i18n">
        Step 4. Share your public address
      </h3>
      <p id="securitystep4" class="i18n">
        Use your public address to receive money from other crypto-currency users. You can share your public address as much as you want.
      </p>
      <h3 id="securitystep5title" class="i18n">
        Step 5. Keep your private key secret
      </h3>
      <p id="securitystep5" class="i18n">
        The private key is literally the keys to your coins, if someone was to obtain it, they could withdraw the funds currently in the wallet, and any funds that might be deposited in that wallet.
      </p>
      <p>
        <strong id="securitystep6" class="i18n">
          Please test spending a small amount before receiving any large payments.
        </strong>
        <br />
        <br />
      </p>
      <h3 id="securitystep7title" class="i18n">
        Consider supporting us
      </h3>
      <p id="securitystep7" class="i18n">
        This service is free and will stay free, without advertising or tracking of any sort. Please consider <a href="#">making a donation</a> to support us and the people that add support for new
        currencies.
      </p>
    </div>
  );
};
