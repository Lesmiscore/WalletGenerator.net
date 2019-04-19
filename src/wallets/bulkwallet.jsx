import React from "react";
import AddressTypeDrop from "../misc/addresstypedrop";
import translator from "../ninja.translator";
import janin from "../janin.currency";

module.exports = class BulkWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: "",
      bulkStartIndex: 0,
      bulkLimit: 0,
      bulkPublicMode: 0
    };
    this.pubModeChange = this.pubModeChange.bind(this);
    this.onStartIndexChange = this.onStartIndexChange.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.generate = this.generate.bind(this);
  }

  getCoin() {
    return janin.currencies[this.props.coin];
  }

  pubModeChange(bulkPublicMode) {
    this.setState({ bulkPublicMode });
  }
  onStartIndexChange(event) {
    this.setState({ bulkStartIndex: +event.target.value });
  }
  onLimitChange(event) {
    this.setState({ bulkLimit: +event.target.value });
  }

  generate() {
    let lines = [];
    let csvRowsRemaining = this.state.bulkLimit;
    let csvRowLimit = this.state.bulkLimit;
    let csvStartIndex = this.state.bulkStartIndex;
    let publicMode = this.state.bulkPublicMode;
    const coin = this.getCoin();
    const batchCSV = () => {
      if (csvRowsRemaining > 0) {
        csvRowsRemaining--;
        const key = coin.makeRandom();

        lines.push(csvRowLimit - csvRowsRemaining + csvStartIndex + ',"' + coin.getAddressWith(key, publicMode) + '","' + coin.getWIFForAddress(key, publicMode) + '"');

        const csv = translator.get("bulkgeneratingaddresses") + csvRowsRemaining;
        this.setState({ csv });

        // release thread to browser to render UI
        setTimeout(batchCSV, 0);
      }
      // processing is finished so put CSV in text area
      else if (csvRowsRemaining === 0) {
        const csv = lines.join("\n");
        this.setState({ csv });
      }
    };
    batchCSV();
  }

  render() {
    return (
      <div id="bulkarea" class="walletarea">
        <div class="commands">
          <div id="bulkcommands" class="row">
            <span>
              <label id="bulklabelstartindex" for="bulkstartindex" class="i18n">
                Start index:
              </label>{" "}
              <input type="text" id="bulkstartindex" value={this.state.bulkStartIndex} onChange={this.onStartIndexChange} />
            </span>
            <span>
              <label id="bulklabelrowstogenerate" for="bulklimit" class="i18n">
                Rows to generate:
              </label>{" "}
              <input type="text" id="bulklimit" value={this.state.bulkLimit} onChange={this.onLimitChange} />
            </span>
            <span>
              <label id="bulklabelcompressed" for="bulkcompressed" class="i18n">
                Address Type:
              </label>{" "}
              <AddressTypeDrop id="bulkcompressed" onChange={this.pubModeChange} mode={this.state.bulkPublicMode} coin={this.props.coin} />
            </span>
            <span>
              <input type="button" id="bulkgenerate" value="Generate" onClick={this.generate} />
            </span>
            <span class="print">
              <input type="button" name="print" id="bulkprint" value="Print" onClick={window.print} />
            </span>
          </div>
        </div>
        <div class="body">
          <span class="label i18n" id="bulklabelcsv">
            Comma Separated Values: Index,Address,Private Key (WIF)
          </span>
          <textarea rows="20" cols="88" id="bulktextarea">
            {this.state.csv}
          </textarea>
        </div>
      </div>
    );
  }
};
