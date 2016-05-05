# Websocket

## General

### Current Version

Bitfinex Websocket API current version is 1.0

### Changelog

#### v1.2 (dev)
* priv channel: rename `ts` tag to `hts`
* priv channel: clientOrderId and groupId `os`, `on`, `ou`, `oc`. `["<ORD_ID>","<ORD_PAIR>",...]` becomes `["<ORD_ID>","<ORD_GROUP_ID>","<ORD_CLI_ID>","<ORD_PAIR>",...]`
* priv channel: websocket input apis for trading

#### v1.1
* related blog post http://blog.bitfinex.com/post/143259611674/websocket-api-v11-update
* priv channel (trade snapshot `ts`): include last 30 trades from each pair, as opposed to the last 30 trades total in v1.0.
* priv channel: publish a full snapshot after a trading engine resync message
* performance: noticeable latency reduction
* bugfixes

#### v1.0 Initial Release

### SSL Websocket Connection

URI: `wss://api2.bitfinex.com:3000/ws`

### Message encoding

Each message sent and received via the Bitfinex's websocket channel is encoded in JSON format

### Supported Pairs
BTCUSD, LTCUSD, LTCBTC, ETHUSD, ETHBTC

### Public Channels

* **Book:** order book feed
* **Ticker:** ticker feed
* **Trades:** trades feed

### Authenticated Channels

* **Account Information:** account specific private data (positions, orders, executed trades, balances)

### How to Connect
Open up a websocket connection to the websocket URI.

```javascript
//using the ws library
var WebSocket = require('ws');
var w = new WebSocket("wss://api2.bitfinex.com:3000/ws");
w.onmessage = function(msg) {
    console.log(msg.data);
};
```

```go
import (
	"code.google.com/p/go.net/websocket"
)

ws, err := websocket.Dial("wss://api2.bitfinex.com:3000/ws", "", "http://localhost/")
if err != nil {
    return err
}
```

### Error Codes

In case of error, you receive a message containing the proper error code (`code` JSON field).

<aside class="warning">
<strong>Generic Error Codes</strong>
<br>
10000 : Unknown event
<br>
10001 : Unknown pair
</aside>

### Info Messages

```json
{
   "event":"info",
   "version": 1
}
```

Info messages are sent from the websocket server to notify the state of your connection.
Right after connecting you receive an info message that contains the actual version of the websocket stream.

<aside class="notice">
<strong>NOTE</strong>
If you are developing/using a trading bot, please make sure to handle version number changes.
</aside>

```json
{
   "event":"info",
   "code": "<CODE>",
   "msg": "<MSG>"
}
```

Websocket server sends other `info` messages to inform regarding relevant events.

<aside class="warning">
<strong>info codes</strong>
<br>
20051 : Stop/Restart Websocket Server (please try to reconnect)
<br>
20060 : Refreshing data from the Trading Engine. Please pause any activity and resume after receiving the `info` message `20061` (it should take 10 seconds at most).
<br>
20061 : Done Refreshing data from the Trading Engine. You can resume normal activity. It is advised to unsubscribe/subscribe again all channels.
<br>
</aside>

<aside class="notice">
<strong>NOTE</strong>
Rely on `CODE` only to handle `info` events.
</aside>

### Ping/Pong

```json
// request
{
   "event":"ping"
}

// response
{
   "event":"pong"
}
```


Use `ping` message to test your connection to the websocket server.


### Subscribe to Channels

```json
// request
{
   "event":"subscribe",
   "channel":"CHANNEL_NAME"
}

// response
{
   "event":"subscribed",
   "channel":"CHANNEL_NAME",
   "chanId":"<CHANNEL_ID>"
}

// response-failure
{
   "event":"error",
   "msg":"<ERROR_MSG>",
   "code":"<ERROR_CODE>"
}
```

To receive data from a channel you have to send a "subscribe" message first.


### Heartbeating

```json
["<Chan Id>", "hb"]
```

If there is no new message in the channel for 1 second, Websocket server will send you an heartbeat message in this format.


### Snapshot

```json
["<Chan Id>",
  ["<Group of Update Messages>",
    ["<Update Message>"]
  ]
]
```

Upon subscribing to a channel an initial snapshot is sent. Typically,
the snapshot will have as its first item, the chanId, its second item
will be an array of update messages (each of which is itself an array).
So The array would have 3 levels.

### Update
After receiving the snapshot, you will receive updates upon any change.

<aside class="notice">
Channel ID's allow you to keep track of the messages, they are static per session, you will receive both the CHANNEL_NAME and the CHANNEL_ID in the response to a subscription message.
<ul>
<li>CHANNEL_NAME: (string) channel name (book, trades, ticker)</li>
<li>CHANNEL_ID: (int) channel identifier. CHANNEL_ID is a numeric channel identifier that the developer can use to distinguish between updates for each subscribed channel.</li>
</ul>
</aside>

<aside class="warning">
<strong>Error Codes</strong>
<br>
10300 : Subscription failed (generic)
<br>
10301 : Already subscribed
<br>
10302 : Unknown channel
<br>
</aside>

### Unsubscribe to Channels

```json
// request
{
   "event":"unsubscribe",
   "chanId":"<CHANNEL_ID>"
}

// response
{
   "event":"unsubscribed",
   "status":"OK",
   "chanId":"<CHANNEL_ID>"
}

// response-failure
{
   "event":"error",
   "msg":"<ERROR_MSG>",
   "code":"<ERROR_CODE>"
}
```
To stop receiving data from a channel you have to send a "unsubscribe" message.

<aside class="warning">
<strong>Error Codes</strong>
<br>
10400 : Subscription failed (generic)
<br>
10401 : Not subscribed
</aside>

## Public Channels

### Order Books

```javascript
w.send(JSON.stringify({
    "event": "subscribe",
    "channel": "book",
    "pair": "BTCUSD",
    "prec": "P0",
    "len":"<LENGTH>"
}))
```

```json
// request
{
   "event":"subscribe",
   "channel":"book",
   "pair":"<PAIR>",
   "prec":"<PRECISION>",
   "freq":"<FREQUENCY>"
}

// response
{
   "event":"subscribed",
   "channel":"book",
   "chanId":"<CHANNEL_ID>",
   "pair":"<PAIR>",
   "prec":"<PRECISION>",
   "freq":"<FREQUENCY>",
   "len":"<LENGTH>"
}
```

The Order Books channel allow you to keep track of the state of the Bitfinex order book.
It is provided on a price aggregated basis, with customizable precision.
After receiving the response, you will receive a snapshot of the book,
followed by updates upon any changes to the book.

```json
// snapshot
[
   "<CHANNEL_ID>",
   [
      [
         "<PRICE>",
         "<COUNT>",
         "<AMOUNT>"
      ],
      [
         "..."
      ]
   ]
]

// updates
[
   "<CHANNEL_ID>",
   "<PRICE>",
   "<COUNT>",
   "<AMOUNT>"
]
```

**Fields**

Fields | Type | Description
--- | --- | ---
PRECISION | string | Level of price aggregation (P0, P1, P2, P3).<br>The default is P0.
FREQUENCY | string | Frequency of updates (F0, F1, F2, F3).<br>F0=realtime / F1=2sec / F2=5sec / F3=10sec.
PRICE | float | Price level.
COUNT | int | Number of orders at that price level.
±AMOUNT | float | Total amount available at that price level.<br>Positive values mean bid, negative values mean ask.
LENGTH | string | Number of price points ("25", "100") [default="25"]

**Precision Levels per Pair**

Pair | Precision Level | Number of decimal places | Example
--- | --- | --- | ---
BTCUSD | P0 | 2 | $0.01
...    | P1 | 1 | $0.10
...    | P2 | 0 | $1
...    | P3 | -1| $10
LTCUSD | P0 | 4 | $0.0001
...    | P1 | 3 | $0.001
...    | P2 | 2 | $0.01
...    | P3 | 1 | $0.1
LTCBTC | P0 | 6 | ฿0.000001
...    | P1 | 5 | ฿0.00001
...    | P2 | 4 | ฿0.0001
...    | P3 | 3 | ฿0.001
ETHUSD | P0 | 4 | $0.0001
...    | P1 | 3 | $0.001
...    | P2 | 2 | $0.01
...    | P3 | 1 | $0.1
ETHBTC | P0 | 6 | ฿0.000001
...    | P1 | 5 | ฿0.00001
...    | P2 | 4 | ฿0.0001
...    | P3 | 3 | ฿0.001

<aside class="warning">
<strong>Error Codes</strong>
<br>
10011 : Unknown Book precision
<br>
10012 : Unknown Book length
</aside>

<aside class="notice">
<strong>NOTE</strong>
COUNT=0 means that you have to remove the price level from your book. 
</aside>

### Raw Order Books

These are the most granular books.

```javascript
w.send(JSON.stringify({
    "event": "subscribe",
    "channel": "book",
    "pair": "BTCUSD",
    "prec": "R0",
    "len":"<LENGTH>"
}))
```

```json
// request
{
   "event":"subscribe",
   "channel":"book",
   "pair":"<PAIR>",
   "prec":"R0"
}

// response
{
   "event":"subscribed",
   "channel":"book",
   "chanId":"<CHANNEL_ID>",
   "pair":"<PAIR>",
   "prec":"R0",
   "len":"<LENGTH>"
}

// snapshot
[
   "<CHANNEL_ID>",
   [
      [
         "<ORD_ID>",
         "<PRICE>",
         "<AMOUNT>"
      ],
      [
         "..."
      ]
   ]
]

// updates
[
   "<CHANNEL_ID>",
   "<ORD_ID>",
   "<ORD_PRICE>",
   "<AMOUNT>"
]
```

**Fields**

Fields | Type | Description
--- | --- | ---
PRECISION | string | Aggregation level (R0).
ORD_ID | int | Order id.
ORD_PRICE | float | Order price.
±AMOUNT | float | Total amount available at that price level.<br>Positive values mean bid, negative values mean ask.
LENGTH | string | Number of price points ("25" | "100" ) [default="25"]


### Trades

This channel sends a trade message whenever a trade occurs at Bitfinex.
It includes all the pertinent details of the trade,
such as price, size and time.

```javascript
w.send(JSON.stringify({
    "event": "subscribe",
    "channel": "trades",
    "pair": "BTCUSD"
}))
```

```json
// request
{
  "event": "subscribe",
  "channel": "trades",
  "pair": "BTCUSD"
}

// response
{
  "event": "subscribed",
  "channel": "trades",
  "chanId": "<CHANNEL_ID>",
  "pair":"<PAIR>"
}

// snapshot
[  
   "<CHANNEL_ID>",
   [  
      [  
         "<SEQ> OR <ID>",
         "<TIMESTAMP>",
         "<PRICE>",
         "<AMOUNT>"
      ],
      [  
         "..."
      ]
   ]
]

// updates
[
   "<CHANNEL_ID>",
   "te",
   "<SEQ>",
   "<TIMESTAMP>",
   "<PRICE>",
   "<AMOUNT>"
]

[
   "<CHANNEL_ID>",
   "tu",
   "<SEQ>",
   "<ID>",
   "<TIMESTAMP>",
   "<PRICE>",
   "<AMOUNT>"
]
```

*here is an example of a real trade*

`[ 5, 'te', '1234-BTCUSD', 1443659698, 236.42, 0.49064538 ]`

`[ 5, 'tu', '1234-BTCUSD', 15254529, 1443659698, 236.42, 0.49064538 ]`

**Fields**

Fields | Type | Description
--- | --- | ----
SEQ | string | Trade sequence id
ID | int | Trade database id
TIMESTAMP | int|  Unix timestamp of the trade.
PRICE | float | Price at which the trade was executed
±AMOUNT | float | How much was bought (positive) or sold (negative).<br>The order that causes the trade determines if it is a buy or a sell.

<aside class="notice">
<strong>NOTE</strong>
SEQ is different from canonical ID. Websocket server uses SEQ strings to push trades with low latency. 
After a "te" message you receive shortly a "tu" message that contains the real trade "ID".
</aside>

### Ticker

The ticker is a high level overview of the state of the market.
It shows you the current best bid and ask, as well as the last trade
price. It also includes information such as daily volume and how
much the price has moved over the last day.

```javascript
w.send(JSON.stringify({
    "event": "subscribe",
    "channel": "ticker",
    "pair": "BTCUSD"
}))
```

```json
// request
{
   "event":"subscribe",
   "channel":"ticker",
   "pair":"BTCUSD"
}

// response
{
   "event":"subscribed",
   "channel":"ticker",
   "chanId":"<CHANNEL_ID>"
}

// snapshot
[
   "<CHANNEL_ID>",
   "<BID>",
   "<BID_SIZE>",
   "<ASK>",
   "<ASK_SIZE>",
   "<DAILY_CHANGE>",
   "<DAILY_CHANGE_PERC>",
   "<LAST_PRICE>",
   "<VOLUME>",
   "<HIGH>",
   "<LOW>"
]

// updates
[
   "<CHANNEL_ID>",
   "<BID>",
   "<BID_SIZE>",
   "<ASK>",
   "<ASK_SIZE>",
   "<DAILY_CHANGE>",
   "<DAILY_CHANGE_PERC>",
   "<LAST_PRICE>",
   "<VOLUME>",
   "<HIGH>",
   "<LOW>"
]
```

*Here is an example of a real ticker*

`[ 2, 236.62, 9.0029, 236.88, 7.1138, -1.02, 0, 236.52, 5191.36754297, 250.01, 220.05 ]`

**Fields**

Fields | Type | Description
--- | ---- | ---
BID | float | Price of last highest bid
BID_SIZE | float | Size of the last highest bid
ASK | float | Price of last lowest ask
ASK_SIZE | float | Size of the last lowest ask
DAILY_CHANGE | float | Amount that the last price<br>has changed since yesterday
DAILY_CHANGE_PERC | float | Amount that the price<br>has changed expressed in percentage terms
LAST_PRICE | float| Price of the last trade.
VOLUME | float | Daily volume
HIGH | float | Daily high
LOW | float | Daily low

## Authenticated Channels

### Account Information

```javascript
var
    crypto = require('crypto'),
    api_key = 'API_KEY',
    api_secret = 'API_SECRET',
    payload = 'AUTH' + (new Date().getTime()),
    signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
w.send(JSON.stringify({
    event: "auth",
    apiKey: api_key,
    authSig: signature,
    authPayload: payload
}));
```

```go
ws, err := websocket.Dial("wss://api2.bitfinex.com:3000/ws", "", "http://localhost/")
if err != nil {
    return err
}

payload := "AUTH" + fmt.Sprintf("%v", time.Now().Unix())

sig := hmac.New(sha512.New384, []byte("API_KEY"))
sig.Write([]byte(payload))
payload_sign := hex.EncodeToString(sig.Sum(nil))

connectMsg, _ := json.Marshal(map[string]interface{}{
    "event":       "auth",
    "apiKey":      "API_KEY",
    "authSig":     payload_sign,
    "authPayload": payload,
})

// Send auth message
_, err = ws.Write(connectMsg)
    log.Fatal(err)
    return
}

// Read all incoming messages
var msg string
for {
    if err = websocket.Message.Receive(ws, &msg); err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(msg)
    }
```

```json
// request
{  
   "event":"auth",
   "status":"OK",
   "chanId":0,
   "userId":"<USER_ID>"
}

// response
{  
   "event":"auth",
   "status":"OK",
   "chanId":0,
   "userId":"<USER_ID>"
}

// response-failure
{  
   "event":"auth",
   "status":"FAIL",
   "chanId":0,
   "code":"<ERROR_CODE>"
}
```

This channel allows you to keep up to date with the status of
your account. You can receive updates on your positions,
your balances, your orders and your trades.

Account info always uses chanId 0.

<aside class="notice">
<strong>AUTH request message: authenticate for the private data stream</strong>
<ul><li>API_KEY: (string) Bitfinex's api key</li>
<li>AUTH_SIGNATURE: (string) HMAC-sha384 signature</li></ul>
</aside>


#### Position Snapshot

**Fields**

```json
[  
   0,
   "ps",
   [  
      [  
         "<POS_PAIR>",
         "<POS_STATUS>",
         "<POS_AMOUNT>",
         "<POS_BASE_PRICE>",
         "<POS_MARGIN_FUNDING>",
         "<POS_MARGIN_FUNDING_TYPE>"
      ],
      [  
         "..."
      ]
   ]
]
```

Term | Type | Description
--- | --- | ---
POS_PAIR | string | Pair (BTCUSD, ...).
POS_STATUS | string | Status (ACTIVE, CLOSED).
±POS_AMOUNT | float | Size of the position.<br>Positive values means a long position,<br>negative values means a short position.
POS_BASE_PRICE | float | The price at which you entered your position.
POS_MARGIN_FUNDING | float | The amount of funding being used for this position.
POS_MARGIN_FUNDING_TYPE | int | 0 for daily, 1 for term.

#### Wallet Snapshot

```json
[
   0,
   "ws",
   [
      [
         "<WLT_NAME>",
         "<WLT_CURRENCY>",
         "<WLT_BALANCE>",
         "<WLT_INTEREST_UNSETTLED>"
      ]
   ]
]

```

**Fields**

Term | Type | Description
--- | --- | ---
WLT_NAME | string | Wallet name (exchange, trading, deposit)
WLT_BALANCE | float | Wallet balance
WLT_INTEREST_UNSETTLED | float | Unsettled interest

#### Order Snapshots

`os` and `hos` indentify respectively *active* and *inactive* orders snapshots

```json
[
   0,
   "os",
   [
      [
         "<ORD_ID>",
         "<ORD_PAIR>",
         "<ORD_AMOUNT>",
         "<ORD_AMOUNT_ORIG>",
         "<ORD_TYPE>",
         "<ORD_STATUS>",
         "<ORD_PRICE>",
         "<ORD_PRICE_AVG>",
         "<ORD_CREATED_AT>",
         "<ORD_NOTIFY>",
         "<ORD_HIDDEN>",
         "<ORD_OCO>"
      ],
      [
         "..."
      ]
   ]
]
```

**Fields**

Term | Type | Description
--- | --- | ---
ORD_ID | int | order id
ORD_PAIR | string | Pair (BTCUSD, ...)
±ORD_AMOUNT | float | Positive means buy, negative means sell.
±ORD_AMOUNT_ORIG | float | Original amount
ORD_TYPE | string | The type of the order<br>["LIMIT", "MARKET", "STOP", "TRAILING STOP", "EXCHANGE MARKET", "EXCHANGE LIMIT", "EXCHANGE STOP", "EXCHANGE TRAILING STOP", "FOK", "EXCHANGE FOK”].
ORD_STATUS | string | Status [ACTIVE, EXECUTED, PARTIALLY FILLED, CANCELED]
ORD_PRICE | float | Price
ORD_PRICE_AVG | float | Average price
ORD_CREATED_AT | string | Creation date/time
ORD_NOTIFY | int | 1 if Notify flag is active, 0 if not
ORD_HIDDEN | int | 1 if Hidden, 0 if not hidden
ORD_OCO | int | ID of the linked order, 0 otherwise


#### Trade Snapshot

```json
[
   0,
   "ts",
   [
      [
         "<TRD_ID>",
         "<TRD_PAIR>",
         "<TRD_TIMESTAMP>",
         "<TRD_ORD_ID>",
         "<TRD_AMOUNT_EXECUTED>",
         "<TRD_PRICE_EXECUTED>",
         "<ORD_TYPE>",
         "<ORD_PRICE>",
         "<FEE>",
         "<FEE_CURRENCY>"
      ],
      [
         "..."
      ]
   ]
]
```

**Fields**

Term | Type | Description
--- | --- | ---
TRD_ID | int | Trade database id 
TRD_PAIR | string | Pair (BTCUSD, ...)
TRD_TIMESTAMP | int | Execution timestamp
TRD_ORD_ID | int | Order id 
±TRD_AMOUNT_EXECUTED | float | Positive means buy, negative means sell
TRD_PRICE_EXECUTED | float | Execution price
ORD_TYPE | string | Order type
ORD_PRICE | float | Order price
FEE | float | Fee
FE_CURRENCY | string | Fee currency

#### Order Updates 

```json
[
   0,
   "<on|ou|oc>",
   [
      "<ORD_ID>",
      "<ORD_PAIR>",
      "<ORD_AMOUNT>",
      "<ORD_AMOUNT_ORIG>",
      "<ORD_TYPE>",
      "<ORD_STATUS>",
      "<ORD_PRICE>",
      "<ORD_PRICE_AVG>",
      "<ORD_CREATED_AT>",
      "<ORD_NOTIFY>",
      "<ORD_HIDDEN>",
      "<ORD_OCO>"
   ]
]
```

#### Position Updates 

```json
[  
   0,
   "<pn|pu|pc>",
   [  
      "<POS_PAIR>",
      "<POS_STATUS>",
      "<POS_AMOUNT>",
      "<POS_BASE_PRICE>",
      "<POS_MARGIN_FUNDING>",
      "<POS_MARGIN_FUNDING_TYPE>"
   ]
]
```

#### Wallet Updates 

```json
[
   0,
   "wu",
   [
      "<WLT_NAME>",
      "<WLT_CURRENCY>",
      "<WLT_BALANCE>",
      "<WLT_INTEREST_UNSETTLED>"
   ]
]
```

<aside class="notice">
<strong>Limit Order Behavior</strong>
<br>
<ul>
<li>When you place a limit order, you will first receive an ‘on’ (order new) which means that the order has been accepted by the system</li>
<li>When the order rests on the book, you will receive an 'ou' (order update).</li>
<li>If you send a market order, you will only receive the ‘on’ because it won’t actually rest on the book (as it matches the first order it runs into).</li>
</ul>
</aside>

#### Executed Trades

```json
[
   0,
   "te",
   [
      "<TRD_SEQ>",
      "<TRD_PAIR>",
      "<TRD_TIMESTAMP>",
      "<TRD_ORD_ID>",
      "<TRD_AMOUNT_EXECUTED>",
      "<TRD_PRICE_EXECUTED>",
      "<ORD_TYPE>",
      "<ORD_PRICE>"
   ]
]
```

After a `te` message you receive shortly a `tu` message that contains the real trade id (`TRD_ID`) and additional/updated fields.

```json
[
   0,
   "tu",
   [
      "<TRD_SEQ>",
      "<TRD_ID>",
      "<TRD_PAIR>",
      "<TRD_TIMESTAMP>",
      "<TRD_ORD_ID>",
      "<TRD_AMOUNT_EXECUTED>",
      "<TRD_PRICE_EXECUTED>",
      "<ORD_TYPE>",
      "<ORD_PRICE>",
      "<FEE>",
      "<FEE_CURRENCY>"
   ]
]
```

**Abbreviated Terms Glossary**

Term | Definition
---| ---
ps | position snapshot
pn | new position
pu | position update
pc | position close
ws | wallet snapshot
wu | wallet update
os | order snapshot
on | new order
ou | order update
oc | order cancel
te | trade executed
tu | trade execution update

<aside class="warning">
<strong>Error Codes</strong>
<br>
10100 : Authentication failure (generic)
<br>
10101 : Already authenticated
<br>
10102 : Authentication Payload Error
<br>
10103 : Authentication Signature Error
<br>
10104 : Authentication HMAC Error
</aside>

### Unauthentication

```json
// request
{  
   "event":"unauth"
}

// response
{  
   "event":"unauth",
   "status":"OK",
   "chanId":0
}

// response-failure
{
   "event":"error",
   "status":"FAILED",
   "chanId":0,
   "code":"<CODE>"
}
```

<aside class="warning">
<strong>Error Codes</strong>
<br>
10201 : Not authenticated
</aside>
