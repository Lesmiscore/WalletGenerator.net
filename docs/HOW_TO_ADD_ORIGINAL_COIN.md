# How to add original coin
Be mindful, it is very difficult to add support for your completely original coin. Never give up.     

- `this project` means [nao20010128nao/WalletGenerator.net](https://github.com/nao20010128nao/WalletGenerator.net) or your fork of it.
- `your coin` means as-is, this doc uses a coin called `NewBitcoin` for an example.

If your coin is based on Bitcoin, and just a few parameter change, [check this](https://github.com/nao20010128nao/WalletGenerator.net/blob/master/docs/HOW_TO_ADD_BTC-BASED_COIN.md).    

Note: This is just a overview, and actual development step may vary. You don't need to follow steps in the order, but complete all steps before sending PR.

## Requirements for development
To add a coin, you need the following:
- Coin name (of course!)
- Specs for public address
- Specs for private key format
  - You can alter with libraries, if there is.
- Donation address (optional)
- Coin logo
  - Must be **square**
  - Must be **PNG**
  - Should have transparent, circle logo is recommended
- Paper wallet background
  - Must be **PNG**
  - Must **NOT** be *transparent*
  - You can copy wallet background used for other coins
  - Of course, you can ask visual designers to make it. If so, **it must fit to other ones**

## Things that are prohibited
- Any XHRs
  - This website and all coin functionality must work without internet connections.     
  You must not require internet connections, or rely on it.
- Any cross-domain embeds
  - As I said above, you must not rely on internet connections.     
  You must include what you need in the code.
- Filesystem interaction
  - Of course! Browsers don't accept filesystem access at all!
- Editing `src/index.html`
  - Editing that file is prohibited, to prevent from adding malicious code.    
  Please tell me why if it's needed on PR, if you really need to do so.

# Implementing coin class
First, cd to `src/coins/` directory, and copy `template.js` to lowercase `(coin name).js` and open it. (e.g. `newbitcoin.js`)    

Then you'll see a class named `Template` and following mostly-blank methods:

```
create
makeRandom
isPrivateKey
decodePrivateKey
getAddressWith
getWIFForAddress
getWIFByType
getAddressFormatNames
getAddressTitleNames
getWIFTitleNames
getPublicKey
getPrivateKeyBuffer
havePrivateKey
isVanitygenPossible
```

Please see description at the code for details.    
You must do:
- rename class to the name of your coin. (`Template` -> `NewBitcoin`)
  - Omit spaces or symbols in its name
- fill all methods.

You can add any packages if you need. Make sure to add it to `dependencies`.    
Ask me any questions if you are failing to implement methods.    
You can also implement vanitygen by filling `isVanitygenPossible`, and it can be constant return of `false` if don't wish to do it. (By `isVanitygenPossible(pattern, mode) { return false; }`) 

# Adding your coin to the currencies list
After filling all methods, you need to add your coin to currency list.    
I maintain the list of coins at [src/janin.currency.js](https://github.com/nao20010128nao/WalletGenerator.net/blob/master/src/janin.currency.js) of **this project**.    

First of all, you have to import your coin class to `src/janin.currency.js`.   
The importing line will look like this:
```javascript
const NewBitcoin = require("./coins/newbitcoin");
```

Add this line after coin class imports, so
```javascript
// ...
const NEM = require("./coins/nem");
const Ripple = require("./coins/ripple");
const IOTA = require("./coins/iota");
const NewBitcoin = require("./coins/newbitcoin"); // newly added coin class
// ...
```

At the tail of this file, there is a long array of currencies.    
You need to insert your coin at **correct place** at the array.    
They are alphabetically sorted, by case-insensitive. And testnets are at the last.   
With the example, name of the coin is `NewBitcoin`, so    

```javascript
  new NEM("NEM", null, NEM.mainnet),
  // ADD "NEWBITCOIN" HERE
  new Neoscoin("Neoscoin", "NZw6WJPiKYcXxua1VveieihiNJRYanHjrP"),
```

Depending on how did you made the class, inserting line will differ. This is just a example.

```javascript
new NewBitcoin("NewBitcoin", "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"),
```

Don't forget to add comma (`,`) at the tail of the line, because it's inside an array.    
You must specify valid parameters for constructor.

# Add coin logo and paper wallet background
After editing code, you have to add images.    
All images must be named lowercase `(coin name).png`, like `newbitcoin.png`. If there is a space, dont't remove. (Just like testnets do)    
Copy coin logo to `logos/`, and paper wallet background to `wallets/`.

# Check how it look
After finishing copying, the last step is to check how it look.    
Please read `BUILDING.md` carefully, then do

```bash
npm run browser
```

After development server is launched, you can change currency by right-top dropdown.

# Finish
Good news, adding your coin is completed.    
Send me PR to add your coin at https://nao20010128nao.github.io/WalletGenerator.net/