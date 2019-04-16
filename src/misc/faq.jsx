import React from "react";

module.exports = class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faqDisplay1: false,
      faqDisplay2: false,
      faqDisplay3: false,
      faqDisplay4: false,
      faqDisplay5: false,
      faqDisplay6: false,
      faqDisplay7: false,
      faqDisplay8: false,
      faqDisplay9: false,
      faqDisplay10: false,
      faqDisplay11: false
    };
  }
  render() {
    return (
      <div id="faqZone">
        <h2>Frequently asked questions :</h2>

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink1">
            &#8226; Is it safe ?
          </a>
        </h3>
        {this.state.faqDisplay1 && (
          <p class="faqAnswer" id="faqQuestion1">
            We try to make it that way ! The core of the tool, that generate the keys is 99% the same as the well reviewed bitaddress.org. We only changed it to be able to generate addresses for
            different crypto-currencies.
          </p>
        )}
        {this.state.faqDisplay1 && (
          <p class="faqAnswer" id="faqQuestion1.1">
            We think that having a unique generator for multiple currencies lead to a much better reviewed tool for all than having a myriad of half-backed generators. Changes made to this generator
            are available on Github in small and divided commits and those are easy to review and reuse. Walletgenerator.net use the same security measures as the original project. All-in-one html
            document, no ajax, no analytics, no external calls, no CDN that can inject anything they want. And trust us, we have seen some nasty things when reviewing some wallet generator.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink2">
            &#8226; Why should I use a paper wallet ?
          </a>
        </h3>
        {this.state.faqDisplay2 && (
          <p class="faqAnswer" id="faqQuestion2">
            Advantages of a paper wallet are multiple:
            <br />
            <br />
            <span class="faqListBullet">&#8658;</span> They are not subject to malwares and keyloggers
            <br />
            <span class="faqListBullet">&#8658;</span> You don’t rely on a third party’s honesty or capacity to protect your coins
            <br />
            <span class="faqListBullet">&#8658;</span> You won't lose your coins when your device break
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink3">
            &#8226; How to use a paper wallet ?
          </a>
        </h3>
        {this.state.faqDisplay3 && (
          <p class="faqAnswer" id="faqQuestion3">
            Once you have generated and printed a wallet, you can send coins to the public address, like for any wallet. Store your paper wallet securely. It contains everything that is needed to
            spend your funds. Consider using BIP38 to secure your paper wallet with a password.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink4">
            &#8226; How to spend the coins stored in a paper wallet ?
          </a>
        </h3>
        {this.state.faqDisplay4 && (
          <p class="faqAnswer" id="faqQuestion4">
            You will need to import your private key in a real client, that you can download from the currency website. The exact method to do that will depend on the client. If there is no integrated
            method, you can usually fall back to the debug console and use the command “importprivkey [yourprivatekey]“.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink5">
            &#8226; How walletgenerator.net is different than another wallet generator ?
          </a>
        </h3>
        {this.state.faqDisplay5 && (
          <p class="faqAnswer" id="faqQuestion5">
            It’s not that different. You will find another design for the paper wallet and some improvements here and there. The big difference is that this is a unique project for a lot of
            currencies, so more people can review it and check its safety.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink6">
            &#8226; Can you add support for cryptocurrency XYZ ?
          </a>
        </h3>
        {this.state.faqDisplay6 && (
          <p class="faqAnswer" id="faqQuestion6">
            Absolutely ! To help us do that, you can <a href="https://docs.google.com/forms/d/1nPIvukVWxlaveUPEUAEhGKwvEuwJiPSgs5zc5LhDVpk/viewform">fill this form</a>. But keep in mind that there is
            some currency that we cannot support. If the developers made some change in the address format, we won’t hack the crypto core of the project and take the risk to tamper the security of the
            others currencies. You can also implement the support yourself by following this{" "}
            <a href="https://github.com/nao20010128nao/WalletGenerator.net/wiki/How-to-add-a-new-currency">non-developer How-To</a>
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink7">
            &#8226; Why should I make a donation ?
          </a>
        </h3>
        {this.state.faqDisplay7 && (
          <p class="faqAnswer" id="faqQuestion7">
            Donations money are used to pay our hosting service provider, but it’ll also be used to make walletgenerator.net more secure as we plan to organize a CrowdCurity campain as soon as we get
            enough money to pay for it.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink8">
            &#8226; I found a bug, what shall I do ?
          </a>
        </h3>
        {this.state.faqDisplay8 && (
          <p class="faqAnswer" id="faqQuestion8">
            You can report bugs using GitHub. You can also contact us using our Twitter account (
            <a href="http://twitter.com/WalletGenerator" target="_blank">
              @WalletGenerator
            </a>
            ). Just try to explain clearly what is wrong and we will try to fix the bug as soon as possible.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink9">
            &#8226; Who are you ?
          </a>
        </h3>
        {this.state.faqDisplay9 && (
          <p class="faqAnswer" id="faqQuestion9">
            We are just two random guy having fun with a side project.
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink10">
            &#8226; How can I help ?
          </a>
        </h3>
        {this.state.faqDisplay10 && (
          <p class="faqAnswer" id="faqQuestion10">
            Donation are always welcome, but you can also help us translate the website. It's really easy. Just add "?i18nextract=LANGUAGECODE" in the end of the url (for instance
            http://walletgenerator.net/?i18nextract=es for Spanish). You will see at the end of the page a pre-filled javascript array ready to be translated. Translate or correct it, and send it to
            us the way you prefer. Even partial translation are helpful !
          </p>
        )}

        <h3 class="faqQuestion">
          <a class="faqLink" id="faqLink11">
            &#8226; Private keys imported to Electrum (and its derivation) seemingly works but it's broken !
          </a>
        </h3>
        {this.state.faqDisplay11 && (
          <p class="faqAnswer" id="faqQuestion11">
            This occurs if you're using uncompressed private key. (in WIF format) Electrum recognizes ALL private keys as it is compressed, so importing uncompressed ones breaks the wallet. Use
            "Wallet Details" tab to convert your private keys.
          </p>
        )}
      </div>
    );
  }
  toggleDisplay(num) {
    const state = {};
    state[`faqDisplay${num}`] = !this.state[`faqDisplay${num}`];
    this.setState(state);
  }
};
