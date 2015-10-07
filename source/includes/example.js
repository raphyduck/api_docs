/**
 * Created by joshuarossi on 10/7/15.
 */
var request = require('request');
var url = "https://api.bitfinex.com/v1";
var payload =
{
    "request": "/v1/account_infos",
    "nonce": Date.now().toString()
};
var api_key = "l5GH46Sp5eAdsVYL79vrzOjljiys5U3AZ8Fo4NM5QVB";
var api_secret = "offjC6bk5Yqkh29djssYVeRMF5CCEsss9bOeSe4rEIh";
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