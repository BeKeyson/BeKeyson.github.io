









ticker = 'BTC'

spot_snap_url = `https://api.binance.com/api/v3/depth?symbol=${ticker.toUpperCase()}USDT&limit=5000`
futs_snap_url = `https://fapi.binance.com/fapi/v1/depth?symbol=${ticker.toUpperCase()}USDT&limit=1000`

spot_ob_ws = `wss://stream.binance.com:9443/stream?streams=${ticker.toLowerCase()}usdt@depth@1000ms`
futs_ob_ws = `wss://fstream.binance.com/stream?streams=${ticker.toLowerCase()}usdt@depth@500ms`

spot_ob_ws_all = `wss://stream.binance.com:9443/stream?streams=${ticker.toLowerCase()}usdt@depth@1000ms`
futs_ob_ws_all = `wss://fstream.binance.com/stream?streams=${ticker.toLowerCase()}usdt@depth@500ms`

spot_price_ws = `wss://stream.binance.com:9443/stream?streams=${ticker.toLowerCase()}usdt@depth@1000ms`
futs_price_ws = `wss://fstream.binance.com/stream?streams=${ticker.toLowerCase()}usdt@depth@500ms`


// fetch(futs_snap_url).then((r) => r.json()).then(snapshot => {
//   console.log(snapshot['bids'])
//   console.log(snapshot['asks'])
// })

// var ob_ws = new WebSocket(futs_ob_ws)
// ob_ws.onmessage = e => {
//   var msg = JSON.parse(e.data)
//   ticker = msg.s.replace('USDT')
//   console.log(msg['data']['b'])
//   console.log(msg['data']['a'])
// }

// fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
//   res.futs_usdt.forEach(ticker => {
//     senten_m = senten_m + ticker.toLowerCase() + 'usdt' + '@kline_1m/'
//   })
// })
//   .then(() => {
//     var dwc = new WebSocket(senten_d)
//     dwc.onmessage = m => {
//       msg = JSON.parse(m.data)
//     }})

// --------------------------------------------- //

// book_round = {}
// for k, v in snap_dict.items():
//   _price = round(float(k), prcs[prcision])
// _amount = float(v)
// try:
// book_round[_price] += _amount
//     except Exception:
// book_round[_price] = _amount

// for k in list(book_round.keys()):
//   book_round[k] = round(book_round[k])
// if book_round[k] < 2:
//         del book_round[k]

// books = {
//   'asks': dict(sorted(book_round.items(), reverse = False)),
//   'bids': dict(sorted(book_round.items(), reverse = True)),
// }
