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
payload = new Buffer(JSON.stringify(payload))
  .toString('base64');
var signature = crypto
  .createHmac("sha384", api_secret)
  .update(payload)
  .digest('hex');
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
request.post(options, 
  function(error, response, body) {
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
```javascript
// All examples assume the following:
// 1. You already have the request object available
// 2. You have the url variable
// 3. Will use BTCUSD as the default symbol
var request = require('request')
var url = "https://api.bitfinex.com/v1"
```
<aside class="notice">
All Public Endpoints use GET requests
</aside>
### Ticker
> **Request**

```javascript
request.get(url + "/pubticker/:symbol", 
  function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "mid":"244.755",
   "bid":"244.75",
   "ask":"244.76",
   "last_price":"244.82",
   "low":"244.2",
   "high":"248.19",
   "volume":"7842.11542563",
   "timestamp":"1444253422.348340958"
}
```
**Endpoint**

`/pubticker/:symbol`

**Description**

Gives innermost bid and asks and information on the most recent trade, 
as well as high, low and volume of the last 24 hours.

**Response Details**

Key	|Type	|Description
--- |---|---
mid	| [price] |	(bid + ask) / 2
bid | [price] | Innermost bid.
ask	| [price] |	Innermost ask.
last_price |	[price] |	The price at which the last order executed.
low	| [price]|	Lowest trade price of the last 24 hours
high	|[price]|	Highest trade price of the last 24 hours
volume	|[price]	|Trading volume of the last 24 hours
timestamp|	[time]|	The timestamp at which this information was valid.

### Stats
> **Request**

```javascript
request.get(url + "/stats/BTCUSD", 
  function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "period":1,
      "volume":"7967.96766158"
   },
   {  
      "period":7,
      "volume":"55938.67260266"
   },
   {  
      "period":30,
      "volume":"275148.09653645"
   }
]
```
**Endpoint**

`/stats/:symbol`

**Description**

Various statistics about the requested pair.

**Response Details**
An array of the following:

Key | Type | Description
--- | --- | ---
period | [integer] | period covered in days
volume |[price] | volume

### Fundingbook
> **Request**

```javascript
var payload =
{
    "limit_bids": 1,
    "limit_asks": 1
};
var options = {
    url: url + '/lendbook/USD',
    qs: payload
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{
  "bids":[
    {
    "rate":"9.1287",
    "amount":"5000.0",
    "period":30,
    "timestamp":"1444257541.0",
    "frr":"No"
    }
  ],
  "asks":[
    {
    "rate":"8.3695",
    "amount":"407.5",
    "period":2,
    "timestamp":"1444260343.0",
    "frr":"No"
    }
  ]
}
```

**Endpoint**

`/lendbook/:currency`

**Description**

Get the full margin funding book

**Request Details**
<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Required<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Default<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>limit_bids</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the number of funding bids returned. May be 0 in which case the array of bids is empty.</td>
          </tr>
          <tr>
            <td><strong>limit_asks</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the number of funding offers returned. May be 0 in which case the array of asks is empty.</td>
          </tr>

          </tbody>
          </table>

**Response Details**
<table class>
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>bids</strong></td>
            <td>[array of funding bids]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>rate</strong></td>
            <td>[rate in % per 365 days]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>amount</strong></td>
            <td>[decimal]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>period</strong></td>
            <td>[days]</td>
            <td>minimum period for the margin funding contract</td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>frr</strong></td>
            <td>[yes/no]</td>
            <td>"Yes" if the offer is at Flash Return Rate, "No" if the offer is at fixed rate</td>
          </tr>
          <tr>
            <td><strong>asks</strong></td>
            <td>[array of funding offers]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>rate</strong></td>
            <td>[rate in % per 365 days]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>amount</strong></td>
            <td>[decimal]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>period</strong></td>
            <td>[days]</td>
            <td>maximum period for the funding contract</td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>frr</strong></td>
            <td>[yes/no]</td>
            <td>"Yes" if the offer is at Flash Return Rate, "No" if the offer is at fixed rate</td>
          </tr>
          </tbody>
          </table>
### Orderbook

> **Request**

```javascript
var payload =
{
    "limit_bids": 1,
    "limit_asks": 1,
    "group": 0
};
var options = {
    url: url + '/book/BTCUSD',
    qs: payload
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "bids":[  
      {  
         "rate":"9.1287",
         "amount":"5000.0",
         "period":30,
         "timestamp":"1444257541.0",
         "frr":"No"
      }
   ],
   "asks":[  
      {  
         "rate":"8.3695",
         "amount":"407.5",
         "period":2,
         "timestamp":"1444260343.0",
         "frr":"No"
      }
   ]
}
```

**Endpoint**

`/book/:symbol`

**Description**

Get the full order book.

**Request Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Required<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Default<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>limit_bids</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the number of bids returned. May be 0 in which case the array of bids is empty.</td>
          </tr>
          <tr>
            <td><strong>limit_asks</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the number of asks returned. May be 0 in which case the array of asks is empty.</td>
          </tr>
          <tr>
            <td><strong>group</strong></td>
            <td>false</td>
            <td>[0/1]</td>
            <td>1</td>
            <td>If 1, orders are grouped by price in the orderbook. If 0, orders are not grouped and sorted individually</td>
          </tr>

          </tbody>
          </table>

**Response Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>bids</strong></td>
            <td>[array]</td>
          </tr>
          <tr>
            <td><strong>price</strong></td>
            <td>[price]</td>
          </tr>
          <tr>
            <td><strong>amount</strong></td>
            <td>[decimal]</td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
          </tr>
          <tr>
            <td><strong>asks</strong></td>
            <td>[array]</td>
          </tr>
          <tr>
            <td><strong>price</strong></td>
            <td>[price]</td>
          </tr>
          <tr>
            <td><strong>amount</strong></td>
            <td>[decimal]</td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
          </tr>
          </tbody>
          </table>

### Trades

> **Request**

```javascript
var payload =
{
    "timestamp": false,
    "limit_trades": 1
};
var options = {
    url: url + '/trades/BTCUSD',
    qs: payload
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "timestamp":1444266681,
      "tid":11988919,
      "price":"244.8",
      "amount":"0.03297384",
      "exchange":"bitfinex",
      "type":"sell"
   }
]
```

**Endpoint**

`/trades/:symbol`

**Description**

Get a list of the most recent trades for the given symbol.

**Request Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Required<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Default<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>timestamp</strong></td>
            <td>false</td>
            <td>[time]</td>
            <td></td>
            <td>Only show trades at or after this timestamp.</td>
          </tr>
          <tr>
            <td><strong>limit_trades</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the number of trades returned. Must be &gt;= 1.</td>
          </tr>

          </tbody>
          </table>
          
**Response Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>tid</strong></td>
            <td>[integer]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>price</strong></td>
            <td>[price]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>amount</strong></td>
            <td>[decimal]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>exchange</strong></td>
            <td>[string]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>type</strong></td>
            <td>[string]</td>
            <td>"sell" or "buy" (can be "" if undetermined)</td>
          </tr>
          </tbody>
          </table>
          
### Lends

> **Request**

```javascript
var payload =
{
    "timestamp": false,
    "limit_lends": 1
};
var options = {
    url: url + '/lends/USD',
    qs: payload
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "rate":"9.8998",
      "amount_lent":"22528933.77950878",
      "amount_used":"0.0",
      "timestamp":1444264307
   }
]
```

**Endpoint**

/lends/:currency

**Description**

Get a list of the most recent funding data for the given currency: total amount lent and Flash Return Rate (in % by 365 days) over time.

**Request Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Required<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Default<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>timestamp</strong></td>
            <td>false</td>
            <td>[time]</td>
            <td></td>
            <td>Only show data at or after this timestamp.</td>
          </tr>
          <tr>
            <td><strong>limit_lends</strong></td>
            <td>false</td>
            <td>[int]</td>
            <td>50</td>
            <td>Limit the amount of funding data returned. Must be &gt;= 1</td>
          </tr>

          </tbody>
          </table>
          
**Response Details*

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>rate</strong></td>
            <td>[decimal, % by 365 days]</td>
            <td>Average rate of total funding received at fixed rates, ie past Flash Return Rate annualized</td>
          </tr>
          <tr>
            <td><strong>amount_lent</strong></td>
            <td>[decimal]</td>
            <td>Total amount of open margin funding in the given currency</td>
          </tr>
          <tr>
            <td><strong>amount_used</strong></td>
            <td>[decimal]</td>
            <td>Total amount of open margin funding used in a margin position in the given currency</td>
          </tr>
          <tr>
            <td><strong>timestamp</strong></td>
            <td>[time]</td>
            <td></td>
          </tr>
          </tbody>
          </table>
          
### Symbols

> **Request**

```javascript
var options = {
    url: url + '/symbols',
    qs: {}
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
["btcusd","ltcusd","ltcbtc"]
```

**Endpoint**

`/symbols`

**Description**

Get a list of valid symbol IDs.

**Response Details**

A list of symbol names. Currently "btcusd", "ltcusd", "ltcbtc"

### Symbol Details
> **Request**

```javascript
var options = {
    url: url + '/symbols_details',
    qs: {}
};
request.get(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "pair":"btcusd",
      "price_precision":5,
      "initial_margin":"30.0",
      "minimum_margin":"15.0",
      "maximum_order_size":"2000.0",
      "minimum_order_size":"0.01",
      "expiration":"NA"
   },
   {  
      "pair":"ltcusd",
      "price_precision":5,
      "initial_margin":"30.0",
      "minimum_margin":"15.0",
      "maximum_order_size":"5000.0",
      "minimum_order_size":"0.1",
      "expiration":"NA"
   },
   {  
      "pair":"ltcbtc",
      "price_precision":5,
      "initial_margin":"30.0",
      "minimum_margin":"15.0",
      "maximum_order_size":"5000.0",
      "minimum_order_size":"0.1",
      "expiration":"NA"
   }
]
```

**Endpoint**

/symbols_details

**Description**

Get a list of valid symbol IDs and the pair details.

**Response Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>pair</strong></td>
              <td>[string]</td>
              <td>the pair code</td>
            </tr>
            <tr>
              <td><strong>price_precision</strong></td>
              <td>[integer]</td>
              <td>Maximum number of significant digits for price in this pair</td>
            </tr>
            <tr>
              <td><strong>initial_margin</strong></td>
              <td>[decimal]</td>
              <td>Initial margin required to open a position in this pair</td>
            </tr>
            <tr>
              <td><strong>minimum_margin</strong></td>
              <td>[decimal]</td>
              <td>Minimal margin to maintain (in %)</td>
            </tr>
            <tr>
              <td><strong>maximum_order_size</strong></td>
              <td>[decimal]</td>
              <td>Maximum order size of the pair</td>
            </tr>
            <tr>
              <td><strong>expiration</strong></td>
              <td>[string]</td>
              <td>Expiration date for limited contracts/pairs</td>
            </tr>

            </tbody>
            </table>
            
## Authenticated Endpoints

```javascript
// All examples assume the following:
// 1. You are using the provided example request object
// 2. You use your API key and secret
// 3. BTCUSD is the default symbol
var request = require('request');
var api_key = "<Your API key>";
var api_secret = "Your API secret<>";
var baseRequest = request.defaults({
    headers: {
        'X-BFX-APIKEY': api_key,
    },
    baseUrl: "https://api.bitfinex.com/v1"
});
```
<aside class="notice">
All Authenticated Endpoints use POST requests
</aside>
### Account info

> **Request**

```javascript
var payload =
{
    "request": "/v1/account_infos",
    "nonce": Date.now().toString()
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/account_infos",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "maker_fees":"0.1",
      "taker_fees":"0.2",
      "fees":[  
         {  
            "pairs":"BTC",
            "maker_fees":"0.1",
            "taker_fees":"0.2"
         },
         {  
            "pairs":"LTC",
            "maker_fees":"0.1",
            "taker_fees":"0.2"
         },
         {  
            "pairs":"DRK",
            "maker_fees":"0.1",
            "taker_fees":"0.2"
         }
      ]
   }
]
```

**Endpoint**

`/account_infos`

**Description**

Return information about your account (trading fees).

**Response Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>pairs</strong></td>
            <td>[string]</td>
            <td>The currency included in the pairs with this fee schedule</td>
          </tr>
          <tr>
            <td><strong>maker_fees</strong></td>
            <td>[decimal]</td>
            <td>Your current fees for maker orders (limit orders not marketable, in percent)</td>
          </tr>
          <tr>
            <td><strong>taker_fees</strong></td>
            <td>[decimal]</td>
            <td>Your current fees for taker orders (marketable order, in percent)</td>
          </tr>

          </tbody>
          </table>
          
### Deposit

> **Request**

```javascript
var payload =
{
    "request": "/v1/deposit/new",
    "nonce": Date.now().toString(),
    "method": "bitcoin",
    "wallet_name": "exchange",
    "renew": 0
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/deposit/new",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "result":"success",
   "method":"bitcoin",
   "currency":"BTC",
   "address":"3FdY9coNq47MLiKhG2FLtKzdaXS3hZpSo4"
}
```

**Endpoint**

`/deposit/new`

**Description**

Return your deposit address to make a new deposit.

**Request Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>method</strong></td>
            <td>[string]</td>
            <td>Method of deposit (methods accepted: "bitcoin", "litecoin", "darkcoin", "mastercoin" (tethers)).</td>
          </tr>
          <tr>
            <td><strong>wallet_name</strong></td>
            <td>[string]</td>
            <td>Wallet to deposit in (accepted: "trading", "exchange", "deposit"). Your wallet needs to already exist</td>
          </tr>
          <tr>
            <td><strong>renew</strong></td>
            <td>[integer]</td>
            <td>(optional) Default is 0. If set to 1, will return a new unused deposit address</td>
          </tr>

          </tbody>
          </table>
          
**Response Details**

<table class="striped">
          <thead>
            <tr>
              <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td><strong>result</strong></td>
            <td>[string]</td>
            <td>"success" or "error"</td>
          </tr>
          <tr>
            <td><strong>method</strong></td>
            <td>[string]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>currency</strong></td>
            <td>[string]</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>address</strong></td>
            <td>[string]</td>
            <td>The deposit address (or error message if result = "error")</td>
          </tr>

          </tbody>
          </table>
          
### New Order

> **Request**

```javascript
var payload =
{
    "request": "/v1/order/new",
    "nonce": Date.now().toString(),
    "symbol": "BTCUSD",
    "amount":"0.01",
    "price": "0.01",
    "exchange": "bitfinex",
    "side": "buy",
    "type": "exchange limit"
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/new",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "id":448364249,
   "symbol":"btcusd",
   "exchange":"bitfinex",
   "price":"0.01",
   "avg_execution_price":"0.0",
   "side":"buy",
   "type":"exchange limit",
   "timestamp":"1444272165.252370982",
   "is_live":true,
   "is_cancelled":false,
   "is_hidden":false,
   "was_forced":false,
   "original_amount":"0.01",
   "remaining_amount":"0.01",
   "executed_amount":"0.0",
   "order_id":448364249
}
```

**Endpoint**

`/order/new`

**Description**

Submit a new order.

**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>symbol</strong></td>
              <td>[string]</td>
              <td>The name of the symbol (see `/symbols`).</td>
            </tr>
            <tr>
              <td><strong>amount</strong></td>
              <td>[decimal]</td>
              <td>Order size: how much to buy or sell.</td>
            </tr>
            <tr>
              <td><strong>price</strong></td>
              <td>[price]</td>
              <td>Price to buy or sell at. Must be positive. Use random number for market orders.</td>
            </tr>
            <tr>
              <td><strong>exchange</strong></td>
              <td>[string]</td>
              <td>"bitfinex"</td>
            </tr>
            <tr>
              <td><strong>side</strong></td>
              <td>[string]</td>
              <td>Either "buy" or "sell".</td>
            </tr>
            <tr>
              <td><strong>type</strong></td>
              <td>[string]</td>
              <td>Either "market" / "limit" / "stop" / "trailing-stop" / "fill-or-kill" / "exchange market" / "exchange limit" / "exchange stop" / "exchange trailing-stop" / "exchange fill-or-kill". (type starting by "exchange " are exchange orders, others are margin trading orders)</td>
            </tr>
            <tr>
              <td><strong>is_hidden</strong></td>
              <td>[bool]</td>
              <td>true if the order should be hidden. Default is false.</td>
            </tr>
            </tbody>
            </table>
            
**Response Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_id</strong></td>
              <td>[int]</td>
              <td>An order object containing the order's ID as well as all the information provided by /order/status</td>
            </tr>
            </tbody>
            </table>            
**Order Types**

<table class="striped">
              <thead>
              <tr>
                <th class="sortable">Margin trading type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Exchange type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>LIMIT</td>
                <td>EXCHANGE LIMIT</td>
              </tr>
              <tr>
                <td>MARKET</td>
                <td>EXCHANGE MARKET</td>
              </tr>
              <tr>
                <td>STOP</td>
                <td>EXCHANGE STOP</td>
              </tr>
              <tr>
                <td>TRAILING STOP</td>
                <td>EXCHANGE TRAILING STOP</td>
              </tr>
                  <tr>
                    <td>FILL-OR-KILL</td>
                    <td>EXCHANGE FILL-OR-KILL</td>
                  </tr>
              </tbody>
            </table>

### Multiple new orders

> **Request**

```javascript
var payload =
{
    "request": "/v1/order/new/multi",
    "nonce": Date.now().toString(),
    "orders": [
        {
            "symbol": "BTCUSD",
            "amount": "0.01",
            "price": "0.01",
            "exchange": "bitfinex",
            "side": "buy",
            "type": "exchange limit"
        },
        {
            "symbol": "BTCUSD",
            "amount": "0.02",
            "price": "0.03",
            "exchange": "bitfinex",
            "side": "buy",
            "type": "exchange limit"
        }]
};

payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/new/multi",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function (error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "order_ids":[  
      {  
         "id":448383727,
         "symbol":"btcusd",
         "exchange":"bitfinex",
         "price":"0.01",
         "avg_execution_price":"0.0",
         "side":"buy",
         "type":"exchange limit",
         "timestamp":"1444274013.621701916",
         "is_live":true,
         "is_cancelled":false,
         "is_hidden":false,
         "was_forced":false,
         "original_amount":"0.01",
         "remaining_amount":"0.01",
         "executed_amount":"0.0"
      },
      {  
         "id":448383729,
         "symbol":"btcusd",
         "exchange":"bitfinex",
         "price":"0.03",
         "avg_execution_price":"0.0",
         "side":"buy",
         "type":"exchange limit",
         "timestamp":"1444274013.661297306",
         "is_live":true,
         "is_cancelled":false,
         "is_hidden":false,
         "was_forced":false,
         "original_amount":"0.02",
         "remaining_amount":"0.02",
         "executed_amount":"0.0"
      }
   ],
   "status":"success"
}
```

**Endpoint**

`/order/new/multi`

**Description**

Submit several new orders at once.
            
**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>symbol</strong></td>
              <td>[string]</td>
              <td>The name of the symbol (see `/symbols`).</td>
            </tr>
            <tr>
              <td><strong>amount</strong></td>
              <td>[decimal]</td>
              <td>Order size: how much to buy or sell.</td>
            </tr>
            <tr>
              <td><strong>price</strong></td>
              <td>[price]</td>
              <td>Price to buy or sell at. May omit if a market order.</td>
            </tr>
            <tr>
              <td><strong>exchange</strong></td>
              <td>[string]</td>
              <td>"bitfinex", "bitstamp", "all" (for no routing).</td>
            </tr>
            <tr>
              <td><strong>side</strong></td>
              <td>[string]</td>
              <td>Either "buy" or "sell".</td>
            </tr>
            <tr>
              <td><strong>type</strong></td>
              <td>[string]</td>
              <td>Either "market" / "limit" / "stop" / "trailing-stop" / "fill-or-kill".</td>
            </tr>

            </tbody>
            </table>
            
**Response Details**
     
<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_ids</strong></td>
              <td>[array]</td>
              <td>An array of order objects each having their own unique ID, as well as the information given by /order/status for each of the orders opened.</td>
            </tr>
            </tbody>
            </table>


### Cancel order
> **Request**

```javascript
var payload =
{
    "request": "/v1/order/cancel",
    "nonce": Date.now().toString(),
    "order_id": 448364249
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/cancel",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function (error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "id":446915287,
   "symbol":"btcusd",
   "exchange":null,
   "price":"239.0",
   "avg_execution_price":"0.0",
   "side":"sell",
   "type":"trailing stop",
   "timestamp":"1444141982.0",
   "is_live":true,
   "is_cancelled":false,
   "is_hidden":false,
   "was_forced":false,
   "original_amount":"1.0",
   "remaining_amount":"1.0",
   "executed_amount":"0.0"
}
```

**Endpoint**

`/order/cancel`

**Description**

Cancel an order.

**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_id</strong></td>
              <td>[int]</td>
              <td>The order ID given by `/order/new`.</td>
            </tr>
            </tbody>
            </table>
            
**Response Details**

Result of /order/status for the cancelled order.

### Cancel multiple orders

> **Request**

```javascript
var payload =
{
    "request": "/v1/order/cancel/multi",
    "nonce": Date.now().toString(),
    "order_ids": [448402101, 448402099]
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/cancel/multi",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function (error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{"result":"Orders cancelled"}
```

**Endpoint**

`/order/cancel/multi`

**Description**

Cancel multiples orders at once.

**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_ids</strong></td>
              <td>[array]</td>
              <td>An array of the order IDs given by `/order/new` or `/order/new/multi`</td>
            </tr>
            </tbody>
            </table>
            
**Response Details**

Confirmation of cancellation of the orders.

### Cancel all orders

> **Request**

```javascript
var payload =
{
    "request": "/v1/order/cancel/all",
    "nonce": Date.now().toString()
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/cancel/all",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function (error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{"result":"All orders cancelled"}
```

**Endpoint**

`/order/cancel/all`

**Description**

Cancel all active orders at once.

**Request Details**

No arguments required

**Response Details**

Confirmation of cancellation of the orders.

### Replace order

> **Request**

```javascript
var payload =
{
    "order_id": 448411153,
    "request": "/v1/order/cancel/replace",
    "nonce": Date.now().toString(),
    "symbol": "BTCUSD",
    "amount":"0.02",
    "price": "0.02",
    "exchange": "bitfinex",
    "side": "buy",
    "type": "exchange limit"
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/cancel/replace",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
})
```

> **Response**

```json
{  
   "id":448411365,
   "symbol":"btcusd",
   "exchange":"bitfinex",
   "price":"0.02",
   "avg_execution_price":"0.0",
   "side":"buy",
   "type":"exchange limit",
   "timestamp":"1444276597.691580782",
   "is_live":true,
   "is_cancelled":false,
   "is_hidden":false,
   "was_forced":false,
   "original_amount":"0.02",
   "remaining_amount":"0.02",
   "executed_amount":"0.0",
   "order_id":448411365
}
```

**Endpoint**

`/order/cancel/replace`

**Description**

Replace an orders with a new one.

**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_id</strong></td>
              <td>[int]</td>
              <td>The order ID (to be replaced) given by `/order/new`.</td>
            </tr>
            <tr>
              <td><strong>symbol</strong></td>
              <td>[string]</td>
              <td>The name of the symbol (see `/symbols`).</td>
            </tr>
            <tr>
              <td><strong>amount</strong></td>
              <td>[decimal]</td>
              <td>Order size: how much to buy or sell.</td>
            </tr>
            <tr>
              <td><strong>price</strong></td>
              <td>[price]</td>
              <td>Price to buy or sell at. May omit if a market order.</td>
            </tr>
            <tr>
              <td><strong>exchange</strong></td>
              <td>[string]</td>
              <td>"bitfinex", "bitstamp", "all" (for no routing).</td>
            </tr>
            <tr>
              <td><strong>side</strong></td>
              <td>[string]</td>
              <td>Either "buy" or "sell".</td>
            </tr>
            <tr>
              <td><strong>type</strong></td>
              <td>[string]</td>
              <td>Either "market" / "limit" / "stop" / "trailing-stop" / "fill-or-kill" / "exchange market" / "exchange limit" / "exchange stop" / "exchange trailing-stop" / "exchange fill-or-kill". (type starting by "exchange " are exchange orders, others are margin trading orders)</td>
            </tr>
            <tr>
              <td><strong>is_hidden</strong></td>
              <td>[bool]</td>
              <td>true if the order should be hidden. Default is false.</td>
            </tr>
            </tbody>
            </table>
            
**Response Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_id</strong></td>
              <td>[int]</td>
              <td>A randomly generated ID for the order and the information given by /order/status.</td>
            </tr>
            </tbody>
            </table>
            
### Order status

> **Request**

```javascript
var payload =
{
    "order_id": 448411153,
    "request": "/v1/order/status",
    "nonce": Date.now().toString()
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/order/status",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
{  
   "id":448411153,
   "symbol":"btcusd",
   "exchange":null,
   "price":"0.01",
   "avg_execution_price":"0.0",
   "side":"buy",
   "type":"exchange limit",
   "timestamp":"1444276570.0",
   "is_live":false,
   "is_cancelled":true,
   "is_hidden":false,
   "was_forced":false,
   "original_amount":"0.01",
   "remaining_amount":"0.01",
   "executed_amount":"0.0"
}
```

**Endpoint**

`/order/status`

**Description**

Get the status of an order. Is it active? Was it cancelled? To what extent has it been executed? etc.

**Request Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>order_id</strong></td>
              <td>[int]</td>
              <td>The order ID given by `/order/new`</td>
            </tr>
            </tbody>
            </table>
            
**Response Details**

<table class="striped">
            <thead>
              <tr>
                <th class="sortable">Key<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Type<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
                <th class="sortable">Description<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
              </tr>
            </thead>
            <tbody>

            <tr>
              <td><strong>symbol</strong></td>
              <td>[string]</td>
              <td>The symbol name the order belongs to.</td>
            </tr>
            <tr>
              <td><strong>exchange</strong></td>
              <td>[string]</td>
              <td>"bitfinex", "bitstamp".</td>
            </tr>
            <tr>
              <td><strong>price</strong></td>
              <td>[decimal]</td>
              <td>The price the order was issued at (can be null for market orders).</td>
            </tr>
            <tr>
              <td><strong>avg_execution_price</strong></td>
              <td>[decimal]</td>
              <td>The average price at which this order as been executed so far. 0 if the order has not been executed at all.</td>
            </tr>
            <tr>
              <td><strong>side</strong></td>
              <td>[string]</td>
              <td>Either "buy" or "sell".</td>
            </tr>
            <tr>
              <td><strong>type</strong></td>
              <td>[string]</td>
              <td>Either "market" / "limit" / "stop" / "trailing-stop".</td>
            </tr>
            <tr>
              <td><strong>timestamp</strong></td>
              <td>[time]</td>
              <td>The timestamp the order was submitted.</td>
            </tr>
            <tr>
              <td><strong>is_live</strong></td>
              <td>[bool]</td>
              <td>Could the order still be filled?</td>
            </tr>
            <tr>
              <td><strong>is_cancelled</strong></td>
              <td>[bool]</td>
              <td>Has the order been cancelled?</td>
            </tr>
            <tr>
              <td><strong>is_hidden</strong></td>
              <td>[bool]</td>
              <td>Is the order hidden?</td>
            </tr>
            <tr>
              <td><strong>was_forced</strong></td>
              <td>[bool]</td>
              <td>For margin only true if it was forced by the system.</td>
            </tr>
            <tr>
              <td><strong>executed_amount</strong></td>
              <td>[decimal]</td>
              <td>How much of the order has been executed so far in its history?</td>
            </tr>
            <tr>
              <td><strong>remaining_amount</strong></td>
              <td>[decimal]</td>
              <td>How much is still remaining to be submitted?</td>
            </tr>
            <tr>
              <td><strong>original_amount</strong></td>
              <td>[decimal]</td>
              <td>What was the order originally submitted for?</td>
            </tr>

            </tbody>
            </table>
            
### Active orders

> **Request**

```javascript
var payload =
{
    "request": "/v1/orders",
    "nonce": Date.now().toString()
};
payload = new Buffer(JSON.stringify(payload)).toString('base64');
var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
var options = {
    url: "/orders",
    headers: {
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    },
    body: payload
};
baseRequest.post(options, function(error, response, body) {
    console.log(body);
});
```

> **Response**

```json
[  
   {  
      "id":448411365,
      "symbol":"btcusd",
      "exchange":"bitfinex",
      "price":"0.02",
      "avg_execution_price":"0.0",
      "side":"buy",
      "type":"exchange limit",
      "timestamp":"1444276597.0",
      "is_live":true,
      "is_cancelled":false,
      "is_hidden":false,
      "was_forced":false,
      "original_amount":"0.02",
      "remaining_amount":"0.02",
      "executed_amount":"0.0"
   }
]
```

**Endpoint**

`/orders`

**Description**

View your active orders.

**Response Details**

An array of the results of `/order/status` for all your live orders.

### Active Positions

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

`/positions`

**Description**

View your active positions.

**Response Details**

An array of your active positions.

### Balance History

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Deposit-Withdrawal History

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Past Trades

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Offers

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Active Credits

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Margin Funding

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Wallet Balances

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Margin Information

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Transfer Between Wallets

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**

### Withdrawal

> **Request**

```javascript

```

> **Response**

```json

```

**Endpoint**

**Description**

**Response Details**
