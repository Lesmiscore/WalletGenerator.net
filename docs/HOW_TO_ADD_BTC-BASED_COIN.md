# How to add BTC-based coin
The steps are easy if you don't wish to do more than other coins.

- `this project` means [nao20010128nao/WalletGenerator.net](https://github.com/nao20010128nao/WalletGenerator.net) or your fork of it.
- `your coin` means as-is, this doc uses [bitcoin/bitcoin](https://github.com/bitcoin/bitcoin/blob/v0.16.3) for an example.

# Investigate coin parameters and get what this project needs
To add a coin, you need the following:
- Coin name (of course!)
- Base58 prefix **number** for P2PKH address
- Base58 prefix **number** for WIF private key
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

For SegWit support, you need the following in addition:
- Base58 prefix **number** for P2SH address
- Bech32 human readable part (a.k.a. HRP)

Don't worry, I'll guide you to find them out and add your coin.    
I'll use [Bitcoin 0.16.3](https://github.com/bitcoin/bitcoin/tree/v0.16.3/) mainnet for example, replace them for your need.

## Finding prefix numbers
First, open [src/chainparams.cpp](https://github.com/bitcoin/bitcoin/blob/v0.16.3/src/chainparams.cpp) in the source code of **your coin**.
Second, find lines of `base58Prefixes`, like this:

```cpp
base58Prefixes[PUBKEY_ADDRESS] = std::vector<unsigned char>(1,0);
base58Prefixes[SCRIPT_ADDRESS] = std::vector<unsigned char>(1,5);
base58Prefixes[SECRET_KEY] =     std::vector<unsigned char>(1,128);
base58Prefixes[EXT_PUBLIC_KEY] = {0x04, 0x88, 0xB2, 0x1E};
base58Prefixes[EXT_SECRET_KEY] = {0x04, 0x88, 0xAD, 0xE4};
```

The first line notices about `Base58 prefix number for P2PKH address`. The value is at after last comma(`,`) and before `(`.    
You'll find `0`, this is `Base58 prefix number for P2PKH address`.    
(Ignore `1`! It's not prefix number!)    

The third line notines about `Base58 prefix number for WIF private key`.    
You'll find `128`.    

Ignore other lines, they are unrelated to add coin.

## Finding prefix numbers and HRP for SegWit support
At before quote, the second line notines about `Base58 prefix number for P2SH address`.    
You'll find `5`.    

To find Bech32 HRP, you need to find a line containing `bech32_hrp`. For example, it will be:

```cpp
bech32_hrp = "bc";
```

Coins lacking this line doesn't have support for SegWit.    
The string quoted by `"` is what you need. So it is `bc`.

# Adding your coin to the currencies list
I maintain the list of coins at [src/janin.currency.js](https://github.com/nao20010128nao/WalletGenerator.net/blob/master/src/janin.currency.js) of **this project**.    
At the tail of this file, there is a long array of currencies.    
You need to insert your coin at **correct place** at the array.    
They are alphabetically sorted, by case-insensitive. And testnets are at the last.   
With the example, name of the coin is `Bitcoin`.    

```javascript
  new Bitcoin("Birdcoin", 0x2f, 0xaf, "L97vGT4wRnyyiugHpLXzZzjqueN8YWRdRJ"),
  // ADD "BITCOIN" HERE
  new BitcoinCash("BitcoinCash", 0x00, 0x80, "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"),
```

The `Bitcoin` class is already imported, so you only need to edit here.    
The parameter of `Bitcoin` constructor means: 

```javascript
new Bitcoin(
    "Bitcoin", // Coin name
    0, // Base58 prefix number for P2PKH address
    128, // Base58 prefix number for WIF private key
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", // Donation address
    5, // Base58 prefix number for P2SH address
    "bc" // Bech32 human readable part
)
```

The line to add will look like:

```javascript
// Without SegWit
new Bitcoin("Bitcoin", 0, 128, "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" /* omit last 2 parameters */),

// With SegWit
new Bitcoin("Bitcoin", 0, 128, "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", 5, "bc"),
```

(This is changed from original to show example)    
Don't forget to add comma (`,`) at the tail of the line, because it's inside an array.    
Most of coins use hex for numbers, but it is not required. It can be decimal number as above does.

# Add coin logo and paper wallet background
After editing code, you have to add images.    
All images must be named lowercase `(coin name).png`, like `bitcoin.png`. If there is a space, dont't remove. (Just like testnets do)    
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
