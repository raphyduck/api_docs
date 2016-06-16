# Introduction
The Bitfinex API's are designed to allow access to all of the features of the Bitfinex platform. The end goal is to
allow people to potentially recreate the entire platform on their own.

If you would like to suggest changes to the documentation, please see the github at https://github.com/bitfinexcom/api_docs

## Open Source Libraries
The following open source projects are works in progress. We will be continually improving them, but we want to release them early so that the community can take a look, make use of them, and offer pull requests. Nothing in the Bitcoin world exists in isolation.

### GO

* Library: [bitfinexcom/bitfinex-api-go](https://github.com/bitfinexcom/bitfinex-api-go)

### Node.js

* Library: [bitfinexcom/bitfinex-api-node](https://github.com/bitfinexcom/bitfinex-api-node)

### Ruby

* Library: [bitfinexcom/bitfinex-api-rb](https://github.com/bitfinexcom/bitfinex-api-rb)

## API Access
In order to access the parts of the API which require authentication, you must generate an API key and an API secret
using [this page](https://www.bitfinex.com/account/api)

You can generate as many API keys as you would like, and each of those keys can be customized in a few ways.

<table class="compact striped" id="api-permissions-table">
      <thead>
        <tr>
          <th style="" class="sortable"><i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
          <th colspan="2" class="col-info center-over-two sortable">Permissions<i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
          <th class="sortable"><i class="fa fa-sort-down"></i><i class="fa fa-sort-up"></i></th>
        </tr>
      </thead>
      <tbody>

          <tr>
            <td>
              <p class="lead-col">
                <strong>Account Info</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_account_read" name="permissions[account][read]" type="checkbox" value="1">
                  <label for="permissions_account_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox show50">
                  <input class="filled-in" disabled="disabled" id="permissions_account" name="permissions[account]" type="checkbox" value="1">
                  <label  for="permissions_account">
                    Write
                  </label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Account History</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_history_read" name="permissions[history][read]" type="checkbox" value="1">
                  <label for="permissions_history_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox show50">
                  <input class="filled-in" disabled="disabled" id="permissions_history" name="permissions[history]" type="checkbox" value="1">
                  <label  for="permissions_history">
                    Write
                  </label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Orders</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_orders_read" name="permissions[orders][read]" type="checkbox" value="1">
                  <label for="permissions_orders_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input class="filled-in" id="permissions_orders_write" name="permissions[orders][write]" type="checkbox" value="1">
                  <label for="permissions_orders_write">Write</label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Margin Trading</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_positions_read" name="permissions[positions][read]" type="checkbox" value="1">
                  <label for="permissions_positions_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input class="filled-in" id="permissions_positions_write" name="permissions[positions][write]" type="checkbox" value="1">
                  <label for="permissions_positions_write">Write</label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Margin Funding</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_funding_read" name="permissions[funding][read]" type="checkbox" value="1">
                  <label for="permissions_funding_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input class="filled-in" id="permissions_funding_write" name="permissions[funding][write]" type="checkbox" value="1">
                  <label for="permissions_funding_write">Write</label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Wallets</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input checked="checked" class="filled-in" id="permissions_wallets_read" name="permissions[wallets][read]" type="checkbox" value="1">
                  <label for="permissions_wallets_read">Read</label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input class="filled-in" id="permissions_wallets_write" name="permissions[wallets][write]" type="checkbox" value="1">
                  <label for="permissions_wallets_write">Write</label>
                </p>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <p class="lead-col">
                <strong>Withdraw</strong>
              </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox show50">
                  <input class="filled-in" disabled="disabled" id="permissions_withdraw" name="permissions[withdraw]" type="checkbox" value="1">
                  <label  for="permissions_withdraw">
                    Read
                  </label>
                </p>
            </td>
            <td class="col-info" style="width:24%;">
                <p class="smaller-checkbox">
                  <input class="filled-in" id="permissions_withdraw_write" name="permissions[withdraw][write]" type="checkbox" value="1">
                  <label for="permissions_withdraw_write">Write</label>
                </p>
            </td>
            <td></td>
          </tr>

      </tbody>
    </table>
