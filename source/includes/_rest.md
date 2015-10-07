# REST

## General

### URL

```javascript
var url = "https://api.bitfinex.com/v1"
```
`https://api.bitfinex.com/v1`

### Authentication

```javascript
var payload =
{
    "request": "/v1/account_infos",
    "nonce": Date.now().toString()
};
```

Authentication is done using an API key and a secret. To generate this pair, 
go to the [API Access](https://www.bitfinex.com/account/api) page.
As an example of how to authenticate, we can look at the "account_infos" endpoint.
Take the example payload to the right.

<aside class="warning">
The nonce provided must be strictly increasing.
</aside>

```javascript
//Using the "request" library, available via npm.
//From the console, run npm install request
var request = require('request');
var api_key = "<Your API key here>";
var api_secret = "<Your API secret here>";
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var headers = {
    'X-BFX-APIKEY': api_key,
    'X-BFX-PAYLOAD': payload,
    'X-BFX-SIGNATURE': signature
};
var options = {
    url: url + '/account_infos',
    headers: headers,
    body: payload
};
request.post(options, function(error, response, body) {
    console.log(body);
});
```

The authentications procedures is as follows:

* The payload is the parameters object, first JSON encoded, and then encoded into Base64

`payload = parameters-object -> JSON encode -> base64`

* The signature is the hex digest of an HMAC-SHA384 hash where the message is your payload, and the secret key is your API secret.

`signature = HMAC-SHA384(payload, api-secret).digest('hex')`


`send (api-key, payload, signature)`

These are encoded as HTTP headers named:

* X-BFX-APIKEY
* X-BFX-PAYLOAD
* X-BFX-SIGNATURE

### Parameters
Requests parameters for POST requests (authenticated) (presented below in the "Request" sections) 
are part of the PAYLOAD, not GET parameters.

Requests parameters for GET requests (non-authenticated) are GET parameters, 
appended to the URL being called as follows:

`/v1/call/?parameter=value`

## Public Endpoints

### Ticker
### Stats
### Fundingbook
### Orderbook
### Trades
### Lends
### Symbols

## Authenticated Endpoints

### Account info
### Deposit
### Orders
### Positions
### Balance History
### Deposit-Withdrawal History
### Past Trades
### Offers
### Active Credits
### Margin Funding
### Wallet Balances
### Margin Information
### Transfer Between Wallets
### Withdrawal
