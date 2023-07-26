order_url = `http://${localhost}:5005`
flask_binance_endpoint = order_url + '/binance/'

function trim_symbol(symbol) {
  return symbol.includes('USDT') ? symbol.toUpperCase() : symbol.toUpperCase() + 'USDT'
}
function flask_binance(endpoint, comment = '', order = null) {

  function draw_term(res_content) {

    if (res_content.constructor === Array) {
      to_console(`${comment} :`)
      to_ticker_console(`${comment} :`)
      res_content.forEach(line => {
        to_console(`${line}`)
        to_ticker_console(`${line}`)
      })

    } else if (res_content.constructor === Object) {
      to_console(`${comment} :`)
      to_ticker_console(`${comment} :`)
      Object.keys(res_content).forEach(key => {
        to_console(`${key}: ${res_content[key]}`)
        to_ticker_console(`${key}: ${res_content[key]}`)
      })

    } else {
      to_console(`${comment} : ${res_content}`)
      to_ticker_console(`${comment} : ${res_content}`)
    }
  }

  if (order == null) {
    fetch(flask_binance_endpoint + endpoint, { method: "POST" }).then(r => r.json()).then(res => {
      draw_term(res.content)
    })
  } else {
    fetch(flask_binance_endpoint + endpoint, { method: "POST", body: JSON.stringify(order) }).then(r => r.json()).then(res => {
      draw_term(res.content)
    })
  }
}
function flask_binance_ticker(endpoint, comment = '', order = null) {

  function draw_term(res_content) {

    if (res_content.constructor === Array) {
      to_ticker_console(`${comment} :`)
      res_content.forEach(line => {
        to_ticker_console(`${line}`)
      })

    } else if (res_content.constructor === Object) {
      to_ticker_console(`${comment} :`)
      Object.keys(res_content).forEach(key => {
        to_ticker_console(`${key}: ${res_content[key]}`)
      })

    } else {
      to_ticker_console(`${comment} : ${res_content}`)
    }
  }

  if (order == null) {
    fetch(flask_binance_endpoint + endpoint, { method: "POST" }).then(r => r.json()).then(res => {
      draw_term(res.content)
    })
  } else {
    fetch(flask_binance_endpoint + endpoint, { method: "POST", body: JSON.stringify(order) }).then(r => r.json()).then(res => {
      draw_term(res.content)
    })
  }
}

// ----------------------- INFO ---------------------- //
function balance() {
  flask_binance('balance', `·Balance`)
}
function avail() {
  flask_binance('avail', `·Available`)
}
function positions() {
  flask_binance('positions', `·Positions`)
}
function open_orders() {
  flask_binance('open_orders', `·Open Orders`)
}
function get_hedge_mode() {
  flask_binance('get_hedge_mode', `·Hedge Mode`)
}

balance(); avail(); get_hedge_mode(); positions(); open_orders();

function get_leverage_ticker(search_ticker) {
  flask_binance_ticker('get_leverage_ticker', `·Leverage`, search_ticker)
}
function positions_ticker(search_ticker) {
  flask_binance_ticker('positions_ticker', `·Positions`, search_ticker)
}
function open_orders_ticker(search_ticker) {
  flask_binance_ticker('open_orders_ticker', `·Open Orders`, search_ticker)
}

// ------------------- MAKE ORDERS ------------------- //

function market_order(symbol, side, usdt, lver = null) {
  order_multiplier = 100
  order = {
    symbol: symbol.toUpperCase(),
    pos_side: side ? side.toLowerCase() : '',
    quantity_usdt: usdt > 10 ? usdt : usdt * order_multiplier,
    leverage: lver,
  }
  flask_binance('market_order', `> New Order ${symbol} ${side}`, order)
}
function nuke_position(symbol, side) {
  order = {
    symbol: symbol.toUpperCase(),
    pos_side: side ? side.toLowerCase() : '',
  }
  flask_binance('nuke_position', `> Nuke Positions for ${symbol} ${side}`, order)
}
function nuke_order(symbol, side) {
  order = {
    symbol: symbol.toUpperCase(),
    pos_side: side ? side.toLowerCase() : '',
  }
  flask_binance('nuke_order', `> Nuke Open Orders for ${symbol} ${side}`, order)
}

// ------------------- CHANGE MODE ------------------- //

function change_hedge_mode() {
  flask_binance('change_hedge_mode', '> Hedge Mode')
}
function change_margin_type(symbol, iso_cross) {
  order = {
    symbol: symbol.toUpperCase(),
    side: iso_cross,
  }
  flask_binance('change_margin_type', `> Margin Type for ${symbol} ${iso_cross}`, order)
}
function change_leverage(symbol, lver) {
  order = {
    symbol: symbol.toUpperCase(),
    leverage: lver,
  }
  flask_binance('change_leverage', `> Leverage for ${symbol} to ${lver} `, order)
}

// ------------------- NUKE GLOBAL ------------------- //

function nuke_all_order() {
  flask_binance('nuke_all_order', `> Nuke All Order`)
}
function nuke_order_longs() {
  flask_binance('nuke_order_longs', `> Nuke ALL Long Orders `)
}
function nuke_order_shorts() {
  flask_binance('nuke_order_shorts', `> Nuke All Short Orders`)
}

function nuke_all_pos() {
  flask_binance('nuke_all_pos', `> Nuke All Positions`)
}
function nuke_pos_longs() {
  flask_binance('nuke_pos_longs', `> Nuke All Longs Positions`)
}
function nuke_pos_shorts() {
  flask_binance('nuke_pos_shorts', `> Nuke All Short Positions`)
}
