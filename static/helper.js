DO_color = '#d8c76a77'
WO_color = '#979797'
MH_color = '#8a534c'
ML_color = '#65738f'
CHART_BG = '#111111'
HD_CHART_BG = '#111111'

localhost = '211.219.49.99'
home_url = `http://${localhost}:5000`
home_ws = `ws://${localhost}:8877`

_feed_hovered = false
_feed_height = 400
_feed_header_height = 42

_read_hovered = false
_read_height = 1000
_read_header_height = 42

function feed_hovered() { _feed_hovered = true }
function feed_nothover() { _feed_hovered = false }

function trim_feed(post_type = '') {
  feedo = document.getElementById("feed_container")
  childo = document.getElementById("feed_container").childNodes
  for (i = childo.length - 1; i > 0; i--) {
    if (childo[i].classList && childo[i].getAttribute('class').includes(post_type)) {
      feedo.removeChild(childo[i])
      break
    }
  }
}
_prev_last = null; _last_time = null;
function show_lastfeed(feed_num = 1) {

  feed_ = document.getElementById('feed')
  feed_con = document.getElementById('feed_container')

  if (_feed_hovered) { return false }

  feed_.scrollTop = feed_.scrollHeight

  _cur_time = new Date()
  _cur_time = _cur_time.getTime()
  if (_prev_last && Math.abs(_prev_last - _cur_time) < 3 * 60 * 1000) { feed_num += 2 }
  else if (_last_time && Math.abs(_last_time - _cur_time) < 3 * 60 * 1000) { feed_num += 1 }
  _prev_last = _last_time
  _last_time = _cur_time

  if (feed_num) {
    feed_height_arr = []
    nodes = feed_con.childNodes
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].offsetHeight != 0) {
        feed_height_arr.push(nodes[i].offsetHeight)
      }
      if (feed_height_arr.length == feed_num) {
        break
      }
    }
    _height = 0
    feed_height_arr.forEach(height => { _height += height })
    if (_height > _feed_height) {
      feed_con.style.top = 0
    } else {
      feed_con.style.top = - _feed_height + _feed_header_height + _height
    }
  }

}
function hide_feed(feed_num = 1) {
  if (_feed_hovered) { return false }

  _cur_time = new Date()
  _cur_time = _cur_time.getTime()
  time_first_feed = document.getElementById('feed_container').childNodes[1].dataset.time + 32400000
  _time_delta = _cur_time - time_first_feed
  if ((_time_delta) < 3 * 60 * 1000) {
    show_lastfeed(feed_num)
  } else if ((_time_delta) > 3 * 60 * 1000) {
    document.getElementById('feed').scrollTop = document.getElementById('feed').scrollHeight
    document.getElementById('feed_container').style.top = - _feed_height
  }
}


// ------------------
function trim_read(post_type = '') {
  reado = document.getElementById("read_container")
  childo = document.getElementById("read_container").childNodes
  for (i = childo.length - 1; i > 0; i--) {
    if (childo[i].classList && childo[i].getAttribute('class').includes(post_type)) {
      reado.removeChild(childo[i])
      break
    }
  }
}

_prev_last_ = null; _last_time_ = null;
function show_lastread(read_num = 1) {

  read_ = document.getElementById('read')
  read_con = document.getElementById('read_container')

  if (_read_hovered) { return false }

  read_.scrollTop = read_.scrollHeight

  _cur_time = new Date()
  _cur_time = _cur_time.getTime()
  if (_prev_last_ && Math.abs(_prev_last_ - _cur_time) < 3 * 60 * 1000) { read_num += 2 }
  else if (_last_time_ && Math.abs(_last_time_ - _cur_time) < 3 * 60 * 1000) { read_num += 1 }
  _prev_last_ = _last_time_
  _last_time_ = _cur_time

  if (read_num) {
    read_height_arr = []
    nodes = read_con.childNodes
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].offsetHeight != 0) {
        read_height_arr.push(nodes[i].offsetHeight)
      }
      if (read_height_arr.length == read_num) {
        break
      }
    }
    _height = 0
    read_height_arr.forEach(height => { _height += height })
    if (_height > _read_height) {
      read_con.style.top = 0
    } else {
      read_con.style.top = - _read_height + _read_header_height + _height + 444
    }
  }

}
function hide_read(read_num = 1) {
  if (_read_hovered) { return false }

  _cur_time = new Date()
  _cur_time = _cur_time.getTime()
  time_first_read = document.getElementById('read_container').childNodes[1].dataset.time + 32400000
  _time_delta = _cur_time - time_first_read
  if ((_time_delta) < 3 * 60 * 1000) {
    show_lastread(read_num)
  } else if ((_time_delta) > 3 * 60 * 1000) {
    document.getElementById('read').scrollTop = document.getElementById('read').scrollHeight
    document.getElementById('read_container').style.top = - _read_height + 444
  }
}

// -------------------  ------------------- //

function scrollSync(selector) {
  let active = null;
  document.querySelectorAll(selector).forEach(function (div) {
    div.addEventListener("mouseenter", function (e) {
      active = e.target;
    });

    div.addEventListener("scroll", function (e) {
      if (e.target !== active) return;

      document.querySelectorAll(selector).forEach(function (target) {
        if (active === target) return;

        target.scrollTop = active.scrollTop;
        target.scrollLeft = active.scrollLeft;
      });
    });
  });
}
function get_digit(num) {
  below_zero = num.toString().split('.')[1].length
  if (below_zero == 1) { return .1 }
  else if (below_zero == 2) { return .01 }
  else if (below_zero == 3) { return .001 }
  else if (below_zero == 4) { return .0001 }
  else { return 0 }
}
function highlight_ticker() {
  tickers = document.querySelectorAll('.ticker')
  tickers.forEach(ticker_elm => {
    if (!ticker_elm.getAttribute('class').includes('sorting')) {
      ticker_elm.addEventListener('mouseover', e => {
        try {
          ticker_lit = ticker_elm.innerHTML.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g)[0]
          tickers.forEach(ticker_oth => {
            if (ticker_oth.innerHTML.includes(ticker_lit)) {
              ticker_oth.parentNode.style.color = '#e08080'
            }
          })
        } catch (e) { }
      })
      ticker_elm.addEventListener('mouseout', e => {
        try {
          ticker_lit = ticker_elm.innerHTML.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g)[0]
          tickers.forEach(ticker_oth => {
            if (ticker_oth.innerHTML.includes(ticker_lit)) {
              ticker_oth.parentNode.style.color = '#cfcfcfd2'
            }
          })
        } catch (e) { }
      })
    }
  })
}

// ------------------- PRINT ------------------- //

function to_console(_val) {
  try {
    term_div = document.getElementById('terminal')
    term_div.innerHTML += `<p>${_val}</p>`
    term_div.scrollTop = term_div.scrollHeight;
  } catch (e) { }
}
function to_ticker_console(_val) {
  try {
    term_div = document.getElementById('ticker_terminal')
    term_div.innerHTML += `<p>${_val}</p>`
    term_div.scrollTop = term_div.scrollHeight;
  } catch (e) { }
}
function to_both_console(_val) {
  to_console(_val)
  to_ticker_console(_val)
}

// ------------------- GET INFOS ------------------- //

function Sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}
function Average(arr) {
  arr = arr.filter(function (element) {
    return element !== undefined;
  })

  sum = arr.reduce((a, b) => a + b, 0)
  return (sum / arr.length) || 0
}
function _Median(arr) {
  if (arr.length === 0) { return '' }

  arr.sort(function (a, b) { return a - b })

  var half = Math.floor(arr.length / 2)

  if (arr.length % 2) { return arr[half] }

  return (arr[half - 1] + arr[half]) / 2.0
}
function Median(array) {
  array = array.filter(function (element) {
    return element !== undefined;
  })

  try {
    return _Median(array)
  } catch (e) {
    return null
  }
}
function Round(num, ndigit) {
  _dn = 10 ** ndigit
  return (Math.round(num * _dn) / _dn).toFixed(ndigit)
}
function Counter(array) {
  array = array.filter(function (element) {
    return element !== undefined;
  })

  var count = {};
  array.forEach(val => count[val] = (count[val] || 0) + 1);
  return Object.fromEntries(Object.entries(count).sort(([, a], [, b]) => b - a))
}
function Sum(array) {
  array = array.filter(function (element) {
    return element !== undefined;
  })
  return array.reduce((partialSum, a) => partialSum + a, 0);
}

async function get_saved_twits() {
  twits_4 = []; twits_3 = []; twits_2 = []; twits_1 = []; twits_0 = [];
  try { twits_4 = await fetch(`${home_url}/twits_raw/${get_mmdd(4)}.json`).then(r => r.json()) } catch (e) { }
  try { twits_3 = await fetch(`${home_url}/twits_raw/${get_mmdd(3)}.json`).then(r => r.json()) } catch (e) { }
  try { twits_2 = await fetch(`${home_url}/twits_raw/${get_mmdd(2)}.json`).then(r => r.json()) } catch (e) { }
  try { twits_1 = await fetch(`${home_url}/twits_raw/${get_mmdd(1)}.json`).then(r => r.json()) } catch (e) { }
  try { twits_0 = await fetch(`${home_url}/twits_raw/${get_mmdd('today')}.json`).then(r => r.json()) } catch (e) { }

  saved_twits = [].concat(twits_4, twits_3, twits_2, twits_1, twits_0)
  saved_twits.forEach(twt => {
    if (!twt.twit || twt.twit == "") {
      delete twt
    }
  })
  return saved_twits
}
async function get_related_twit(keywords = []) {
  related_twit = []
  saved_twits = await get_saved_twits()

  saved_twits.forEach(twt => {
    keywords.forEach(keyword => {
      try {
        txt = twt.twit.toLowerCase().replaceAll('$', '').replaceAll('#', '').split(' ')
        if (txt.includes(keyword.toLowerCase()) || get_ticker(twt.twit) == keyword) {
          related_twit.push(twt)
        }
      } catch (e) { }
    })
  })
  return related_twit.reverse()
}
async function hot_tickers() {
  frequent_twits_word = {}

  twits = await get_saved_twits()

  ticker_list = []
  words_list = []

  twits.forEach(tw => {
    try {
      twit_words = tw.twit.toLowerCase().split(' ')
    } catch (e) { twit_words = [] }
    twit_words.forEach(word => { words_list.push(get_words(word)) })

    ticker = tw.ticker
    if (tw.ticker && !(ticker[0] >= '0' && ticker[0] <= '9')) {
      ticker_list.push(ticker)
    }
  })

  // ticker_list = [].concat(ticker_list, words_list)

  ticker_dict = Counter(ticker_list)
  ticker_counter = Object.fromEntries(Object.entries(ticker_dict).sort(([, a], [, b]) => b - a))

  frequent_twits_word = Counter(words_list)
  frequent_twits_word = Object.fromEntries(Object.entries(frequent_twits_word).sort(([, a], [, b]) => b - a))
  delete ticker_counter.null
  delete frequent_twits_word.null

  return {
    'ticker_counter': ticker_counter,
    'frequent_twits_word': frequent_twits_word
  }
}

async function draw_hot_twits() {
  const hot_ticker_Container = document.querySelector('#ticker_counter')
  const frequent_word_Container = document.querySelector('#frequent_twits_word')
  hot_ticker_Container.innerHTML = ''
  frequent_word_Container.innerHTML = ''

  function make_new_hot(ticker, ticker_count) {
    new_msg = document.createElement('div')
    new_msg.innerHTML = ''
    new_msg.className = 'ws_msg'
    if (ticker.toUpperCase() == ticker) { is_ticker = 'is_ticker' } else { is_ticker = '' }
    // new_msg.innerHTML = `<div class='ticker ${is_ticker}'>${ticker}</div>
    new_msg.innerHTML = `<div class='ticker'>${ticker}</div>
    <p><span>${ticker_count}</span></p>`

    // draw_msg(new_msg, ticker)
    return new_msg
  }

  hot_tickers()
    .then(res => {
      Object.keys(res.ticker_counter).forEach(ticker => {
        if (ticker != 'CT' || ticker != 'US' || ticker != 'DB' || ticker != 'ES' || ticker != 'btc' || ticker != 'VC')
          ticker_count = res.ticker_counter[ticker]
        hot_ticker_Container.append(make_new_hot(ticker, ticker_count))
      })

      Object.keys(res.frequent_twits_word).forEach(word => {
        word_count = res.frequent_twits_word[word]
        frequent_word_Container.append(make_new_hot(word, word_count))
      })
    })
}

async function get_saved_file(ticker, endpoint) {
  async function get_() {
    arr_6 = [], arr_5 = [], arr_4 = [], arr_3 = [], arr_2 = [], arr_1 = [], arr_0 = []
    try { arr_2 = await fetch(`${home_url}/${endpoint}_raw/${get_mmdd(2)}.json`).then(r => r.json()) } catch (e) { }
    try { arr_1 = await fetch(`${home_url}/${endpoint}_raw/${get_mmdd(1)}.json`).then(r => r.json()) } catch (e) { }
    try { arr_0 = await fetch(`${home_url}/${endpoint}_raw/${get_mmdd('today')}.json`).then(r => r.json()) } catch (e) { }
    return [].concat(arr_6, arr_5, arr_4, arr_3, arr_2, arr_1, arr_0)
  }
  files = await get_()
  agg_arr = []
  files.forEach(p => {
    try {
      if (p.ticker && p.ticker == ticker) { agg_arr.push(p) }
      else if (get_ticker(p.post) == ticker) { agg_arr.push(p) }
    } catch (e) { }
  })
  return agg_arr.reverse()
}

ticker_perp_usdt = []; ticker_perp_busd = []; ticker_spots = [];
fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
  ticker_perp_usdt = res.futs_usdt
  ticker_perp_busd = res.futs_busd
  ticker_spots = res.spots
})

var coinalyze_pair = {}
fetch(`${home_url}/coinalyze`).then((r) => r.json()).then(res => {
  coinalyze_pair = res.coinalyze_pair
})


function draw_msg_oi(element, ticker, height_mtp = .26, spacing = 3, limit_ = 100, _event = 'dblclick', tf_ = 15) {

  function draw() {
    ticker = ticker.trim().toUpperCase()
    container_oi = document.getElementById('oi_chart')
    container_oi.innerHTML = ''

    tf_ = tf_global
    if (tf == 60) { tf_ = `${1}h` }
    else if (tf == 2 || tf == 120) { tf_ = `${2}h` }
    else if (tf == 4 || tf == 240) { tf_ = `${4}h` }
    else { tf_ = tf_ + 'm' }

    var chart_oi = LightweightCharts.createChart(container_oi, {
      height: 1300,
      width: 1888,
      layout: {
        backgroundColor: '#080808',
        textColor: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0)' },
        horzLines: { color: 'rgba(197, 203, 206, 0)' },
      },
      crosshair: {
        horzLine: { visible: true, },
        vertLine: { visible: true, },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        borderVisible: false,
        scaleMargins: {
          top: 0.05,
          bottom: 0.01,
        },
      },
      timeScale: {
        visible: false,
        barSpacing: spacing,
        borderColor: 'rgba(197, 203, 206, 0)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
      },
    })

    var oiSeries = chart_oi.addAreaSeries({
      priceLineVisible: false,
      topColor: 'rgba(67, 83, 254, 0)',
      bottomColor: 'rgba(67, 83, 254, 0)',
      lineColor: '#caba8e',
      lineWidth: 1,
    })

    var oivolumeSeries = chart_oi.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      color: 'rgba(180,180,180,0.7)',
      priceScaleId: '0',
      priceLineVisible: false,
      scaleMargins: {
        top: 0.2,
        bottom: 0.1,
      },
    })

    fetch(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${ticker.toUpperCase()}USDT&period=${tf_}&limit=${limit_}`)
      .then((r) => r.json())
      .then((response) => {
        var candles = []; var volcandles = []
        Prev_vol = 0; _count = 0

        response.forEach(candle => {
          temCandle = {
            time: candle.timestamp / 1000 + 32400,
            value: parseFloat(candle.sumOpenInterestValue) / 1000000,
          }

          voltemCandle = {
            time: candle.timestamp / 1000 + 32400,
            value: parseFloat(candle.sumOpenInterest) - Prev_vol,
          }
          Prev_vol = parseFloat(candle.sumOpenInterest)

          candles.push(temCandle)
          if (_count == 0) { volcandles.push({ time: candle.timestamp / 1000 + 32400, value: 0 }) }
          else { volcandles.push(voltemCandle) }

          _count++
        });
        oiSeries.applyOptions({
          priceFormat: {
            precision: 3,
          },
        })
        oivolumeSeries.setData(volcandles)
        oiSeries.setData(candles)
      })

    new ResizeObserver(entries => {
      const newRect = entries[0].contentRect
      chart_oi.applyOptions({ height: newRect.height, width: newRect.width })
    }).observe(container_oi)

  }
  if (_event == 'dblclick') { element.addEventListener(_event, () => { draw() }) }
  else { draw() }
}


function draw_msg_candle(element, ticker_, height_mtp = 0.74, spacing = 3, draw_id = 'side_chart_low_tf', tf_ = 15, limit_ = 100, _event = 'dblclick') {

  function draw() {
    ticker_win_open = true
    ticker = ticker_.trim().toUpperCase()
    search_symbol = ticker

    tf_ = tf_global
    if (tf == 60) { tf_ = `${1}h` }
    else if (tf == 2 || tf == 120) { tf_ = `${2}h` }
    else if (tf == 4 || tf == 240) { tf_ = `${4}h` }
    else { tf_ = tf_ + 'm' }

    document.querySelector('#side_chart-wrapper').style.display = 'block'

    kline_url = ''
    ws_url = ''
    if (ticker_perp_usdt.includes(ticker)) {
      kline_url = `https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}USDT&interval=${tf_}&limit=${limit_}`
      ws_url = `wss://fstream.binance.com/ws/${ticker.toLowerCase()}usdt@kline_${tf_}`
    } else if (ticker_perp_busd.includes(ticker)) {
      kline_url = `https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}BUSD&interval=${tf_}&limit=${limit_}`
      ws_url = `wss://fstream.binance.com/ws/${ticker.toLowerCase()}usdt@kline_${tf_}`
    } else if (ticker_spots.includes(ticker)) {
      kline_url = `https://api.binance.com/api/v3/klines?symbol=${ticker.toUpperCase()}USDT&interval=${tf_}&limit=${limit_}`
      ws_url = `wss://stream.binance.com:9443/ws/${ticker.toLowerCase()}usdt@kline_${tf_}`
    }

    container_kline = document.getElementById(draw_id)
    container_kline.innerHTML = ''
    var chart_kline = LightweightCharts.createChart(container_kline, {
      layout: {
        backgroundColor: '#080808',
        textColor: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0)' },
        horzLines: { color: 'rgba(197, 203, 206, 0)' },
      },
      crosshair: {
        horzLine: { visible: true, },
        vertLine: { visible: true, },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        borderVisible: false,
        scaleMargins: {
          top: 0.02,
          bottom: 0.20,
        },
      },
      timeScale: {
        // visible: false,
        barSpacing: spacing,
        borderColor: 'rgba(197, 203, 206, 0)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
      },
    })

    var candleSeries = chart_kline.addCandlestickSeries({
      downColor: 'rgba(15,129,180, .95)',
      upColor: 'rgba(210,210,210, .95)',
      borderDownColor: 'rgba(15,129,180, .8)',
      borderUpColor: 'rgba(210,210,210, .8)',
      wickDownColor: 'rgba(210,210,210, .5)',
      wickUpColor: 'rgba(210,210,210, .5)',
      priceLineVisible: false,
    })

    var volumeSeries = chart_kline.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      color: 'rgba(180,180,180,0.7)',
      priceScaleId: '0',
      priceLineVisible: false,
      scaleMargins: {
        top: 0.8,
        bottom: 0.01,
      },
    })

    start_time = 0
    fetch(kline_url)
      .then((r) => r.json())
      .then((response) => {
        start_time = response[0][0]
        _prec = response[0][1].toString().split('.')[1].length
        _prec = _prec > 5 ? 4 : _prec
        _min_mov = _prec > 5 ? `0.${'0'.repeat(3)}1` : `0.${'0'.repeat(_prec - 1)}1`
        candleSeries.applyOptions({
          priceFormat: {
            type: 'price',
            precision: _prec,
            minMove: _min_mov,
          },
        })

        var candles = []
        response.forEach(candle => {
          temCandle = {
            time: candle[0] / 1000 + 32400,
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            value: parseFloat(candle[7]) / 1000000,
          }
          candles.push(temCandle)
        });
        candleSeries.setData(candles)
        volumeSeries.setData(candles)
      })

    if (tf_ == '1m' || tf_ == '3m' || tf_ == '5m' || tf_ == '15m') {
      ticker_Upper = ticker.toUpperCase()

      async function draw_saved_makers(ticker_Upper) {
        async function get_files() {
          volume1 = await get_saved_file(ticker_Upper, 'volume1')
          volume3 = await get_saved_file(ticker_Upper, 'volume3')
          oi5 = await get_saved_file(ticker_Upper, 'oi5')
          return {
            'volume1': volume1,
            'volume3': volume3,
            'oi5': oi5,
          }
        }

        files = await get_files()

        volume1_markers = []; volume3_markers = [];
        oi5_markers = [];

        col_vol_1 = '#ddbd66'
        // col_vol_3 = '#e0ae64'
        col_oi_5 = '#5ce9d6'

        files.volume1.forEach(v_ => {
          if (start_time / 1000 < v_.time + 32400) {
            volume1_markers.push({
              time: v_.time + 32400,
              position: 'aboveBar',
              color: col_vol_1,
              text: '',
              shape: 'circle',
              fontSize: 8,
            })
          }
        })
        files.volume3.forEach(v_ => {
          if (start_time / 1000 < v_.time + 32400) {
            volume3_markers.push({
              time: v_.time + 32400,
              position: 'aboveBar',
              text: '',
              color: col_vol_1,
              shape: 'circle',
              fontSize: 8,
            })
          }
        })
        return [].concat(
          volume1_markers, volume3_markers, oi5_markers,
        )
      }
      draw_saved_makers(ticker_Upper).then(marker => {
        candleSeries.setMarkers(marker)
      })
    }

    var _bwc = new WebSocket(ws_url)
    _bwc.onmessage = function (e) {
      if (kline_url) {
        var message = JSON.parse(e.data)
        candleSeries.update({
          time: message.k.t / 1000 + 32400,
          open: message.k.o,
          high: message.k.h,
          low: message.k.l,
          close: message.k.c,
        })
        volumeSeries.update({
          time: message.k.t / 1000 + 32400,
          value: parseFloat(message.k.q) / 1000000,
        })
        return false

      } else {
        try { _bwc.close() }
        catch (e) { }
      }
    }

    new ResizeObserver(entries => {
      const newRect = entries[0].contentRect
      chart_kline.applyOptions({ height: newRect.height, width: newRect.width })
    }).observe(container_kline)

  }
  if (_event == 'dblclick') { element.addEventListener(_event, () => { draw() }) }
  else { draw() }
}


function draw_msg_info(element, ticker, _event = 'dblclick', tf_ = 15) {

  function draw() {
    ticker = ticker.trim().toUpperCase().replace('1000', '')

    tf_ = tf_global
    if (tf == 60) { tf_ = `${1}h` }
    else if (tf == 2 || tf == 120) { tf_ = `${2}h` }
    else if (tf == 4 || tf == 240) { tf_ = `${4}h` }
    else { tf_ = tf_ + 'm' }

    search_symbol = ticker //!
    ticker_win_open = true

    fetch(`${home_url}/livecoin_info`).then((r) => r.json()).then(res => {
      livecoin_info = res
    })

    var legend = document.createElement('div')
    legend.classList.add('legend')
    document.getElementById('side_chart_low_tf').appendChild(legend)

    var legend_oi = document.createElement('div')
    legend_oi.classList.add('legend')
    document.getElementById('oi_chart').appendChild(legend_oi)

    printing_now = ''; ticker_markets = '';
    if (ticker_perp_usdt.includes(ticker)) { printing_now = 'USDTPERP' } else if (ticker_perp_busd.includes(ticker)) { printing_now = 'BUSDPERP' } else if (ticker_spots.includes(ticker)) { printing_now = 'USDT(spot)' }
    ticker_markets += ticker_perp_usdt.includes(ticker) ? '🅿' : ''
    ticker_markets += ticker_perp_busd.includes(ticker) ? '🅱' : ''
    ticker_markets += ticker_spots.includes(ticker) ? '🆂' : ''
    legend.innerHTML += `<div><b><a class='yellow' target="_blank">${ticker} ${tf_}</a></b>
                        <span class="ticker_markets">${ticker_markets}</span></div>`

    coinalyze_link = `https://coinalyze.net/${coinalyze_pair[ticker]}/usdt/binance/price-chart-live/`
    TV_link = `https://www.tradingview.com/chart/vX3JXmil/?symbol=BINANCE:${ticker}USDT.P`
    tradinglite_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binance:${ticker}USDT,5`
    tradinglite_f_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binancef:${ticker}USDT,5`
    legend.innerHTML += `<a href="${TV_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TV_link.png"/></a>`
    legend.innerHTML += `<a href="${coinalyze_link}" target="_blank"><img class="link_pic" src="${home_url}/img/coinalyze.png"/></a>`
    legend.innerHTML += `<a href="${tradinglite_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link.png"/></a>`
    legend.innerHTML += `<a href="${tradinglite_f_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link_f.png"/></a>`


    fetch('https://api.livecoinwatch.com/coins/single', {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "x-api-key": "e7e03b8c-682e-497d-b71a-48e7a18ed5a5",
      }),
      body: JSON.stringify({ currency: "USD", code: ticker, meta: true, })
    }).then(r => r.json())
      .then(res => {

        try {
          categories_list = []; categories = ''
          categories += `<small>#</small><b>${res.rank} ${res.name} </b>`
          res.categories.forEach(cate => {
            categories_list.push(cate)
            cate = cate.replace('smart_contract_platforms', 'platform').replace('_', ' ')
            cate = cate.charAt(0).toUpperCase() + cate.slice(1)
            categories += `<span class='info_category'><small>${cate}</small> </span>`
          })
          legend_oi.innerHTML += categories
        } catch (e) { }

        // try { // FUNDING ...
        //   fund = document.querySelector(`.rec_fund_${ticker}`).innerText
        //   legend.innerHTML += `<div>Funding : <span>${fund}</span></div>`
        // } catch (e) { }

        // try {
        //   _cap = Round(res.cap / 1000000, 0)
        //   legend.innerHTML += `<div>Market Cap : <span class="${_cap < 150 ? 'yellow' : 'numbers'}">${convert_mil_to_bil(_cap)}</span> </div>`
        //   if (_cap || _cap !== 0) {
        //     _vol_per = Round(res.volume / res.cap * 100, 1)
        //     _depth = Round(res.liquidity / res.cap * 100, 1)
        //     legend.innerHTML += `<div>Volume/MC : <span class="${_vol_per > 10 ? 'yellow' : 'numbers'}">${_vol_per}</span> %</div>`
        //     legend.innerHTML += `<div>2% Depth : <span class="${_depth > 1 ? 'yellow' : 'numbers'}">${_depth} %</span></div>`
        //   }
        // } catch (e) { }

      })
  }

  if (_event == 'dblclick') { element.addEventListener(_event, () => { draw() }) }
  else { draw() }
}


search_symbol = ''; tf_global = 5
function draw_msg(element, ticker, _width = null, _event = 'dblclick', _rep_popup = true, keyboard = false, tf = 15) {
  sync_charts = []

  tf_global = tf

  _space = 6.2
  ticker = ticker.replace('USDT', '')
  _height = window.innerHeight < 1000 ? window.innerHeight : 1000
  try {
    draw_msg_oi(element, ticker, height = 0.25, spacing = _space, limit_ = 500, _event = _event, tf_ = tf_global)
    draw_msg_candle(element, ticker, height = .74, spacing = _space, draw_id = 'side_chart_low_tf', tf_ = tf_global, limit_ = 60 * 24, _event = _event)
  } catch (e) { }
  draw_msg_info(element, ticker, _event = _event, tf_ = tf)
}


// --------------------------------------- //
// -------------- KEY 주문 ---------------- //
// --------------------------------------- //
note_focused = false;
search_word = []; search_history = [];
ticker_win_open = false; display_key_show = false;
last_keypress = ''; ArrowUp_count = 0

document.addEventListener('keydown', e => {
  display_key = document.getElementById('display_key')

  if (e.key == 'F4') {
  }

  else if (e.key == 'TICK' || e.key == 'TIK') {
    sort_by('rec_tick')
  }
  else if (e.key == 'DELTA') {
    sort_by('rec_rt_delta')
  }
  else if (e.key == 'OI') {
    sort_by('rec_rt_oi')
  }
  else if (e.key == "FUND" || e.key == "F") {
    sort_by('rec_rt_fund')
  }
  else if (e.key == "UP") {
    sort_by('rec_UP_vol_UTC')
  }

  // 링크열기
  else if (ticker_win_open && e.key == 'ArrowDown') {
    popup_2 = window.open(TV_link);
    popup_1 = window.open(coinalyze_link);
    popup_3 = window.open(tradinglite_link);
    popup_4 = window.open(tradinglite_f_link);
    popup_1.blur();
    popup_2.blur();
    popup_3.blur();
    popup_4.blur();
    window.focus();
  }

  else if (e.key == 'Enter') {
    to_search = search_word.join('').toUpperCase().replace('USDT', '')
    display_key.style.display = 'none'; display_key_show = false
    search_history.push(search_word)
    search_word = []

    // NUKE
    if (to_search.includes('NUKE')) {
      nuke_words = to_search.split(' ')
      if (!ticker_win_open) {

        // NUKE (pos) SYMBOL LONG/SHORT
        if (!to_search.includes('ORDER') && !to_search.includes('ALL')) {

          if (nuke_words.length == 1) {       // NUKE+
            if (to_search.includes('+')) {
              nuke_position('', 'LONG')
            } else if (to_search.includes('-')) {
              nuke_position('', 'SHORT')
            } else {                           // NUKE (pos) (all symbol) (all side)
              nuke_position('', '')
            }

          } else if (nuke_words.length == 2) { // NUKE (pos) LONG/SHORT
            if (to_search.includes('SHORT')) {
              nuke_position('', nuke_words[1])
            } else if (to_search.includes('LONG')) {
              nuke_position('', nuke_words[1])
            } else {                           // NUKE (pos) SYMBOL
              nuke_position(nuke_words[1], '')
            }
          } else if (nuke_words.length == 3) { // NUKE (pos) SYMBOL LONG/SHORT
            nuke_position(nuke_words[1], nuke_words[2])
          }

          // NUKE ORDER SYMBOL LONG/SHORT
        } else if (to_search.includes('ORDER')) {
          nuke_order(nuke_words[2], nuke_words[3])

          // NUKE ALL(pos & order) LONG/SHORT
        } else if (to_search.includes('ALL')) {
          nuke_position('', nuke_words[2])
          nuke_order('', nuke_words[2])
        }

      } else if (ticker_win_open) {

        // NUKE (pos) SYMBOL LONG/SHORT
        if (!to_search.includes('ORDER') && !to_search.includes('ALL')) {

          if (nuke_words.length == 1) {       // NUKE+
            if (to_search.includes('+')) {
              nuke_position(search_symbol, 'LONG')
            } else if (to_search.includes('-')) {
              nuke_position(search_symbol, 'SHORT')
            } else {                           // NUKE (pos) (all symbol) (all side)
              nuke_position(search_symbol, '')
            }

          } else if (nuke_words.length == 2) { // NUKE (pos) LONG/SHORT
            if (to_search.includes('SHORT')) {
              nuke_position(search_symbol, nuke_words[1])
            } else if (to_search.includes('LONG')) {
              nuke_position(search_symbol, nuke_words[1])
            }

          } else if (nuke_words.length == 3) { // NUKE (pos) SYMBOL LONG/SHORT
            nuke_position(nuke_words[1], nuke_words[2])
          }

          // NUKE ORDER (symbol) LONG/SHORT
        } else if (to_search.includes('ORDER')) {
          nuke_order(search_symbol, nuke_words[2])

          // NUKE ALL (pos & order) LONG/SHORT
        } else if (to_search.includes('ALL')) {
          nuke_position(search_symbol, nuke_words[2])
          nuke_order(search_symbol, nuke_words[2])
        }

      }

      //? ------- INFO --------- //
    } else if (to_search.includes('CHANGE HEDGE')) {
      change_hedge_mode()
    } else if (to_search.includes('CHANGE MARGIN')) {
      _words = to_search.split(' ')
      change_margin_type(_words[2], _words[3])
    } else if (to_search.includes('CHANGE LEV')) {
      _words = to_search.split(' ')
      if (!ticker_win_open) {
        change_leverage(_words[2], _words[3])
      } else if (ticker_win_open) {
        change_leverage(search_symbol, _words[2])
      }

      //
    } else if (to_search.includes('BALANCE')) {
      balance()
    } else if (to_search.includes('AVAIL')) {
      avail()
    } else if (to_search.includes('POSITION')) {
      positions()
    } else if (to_search.includes('ORDER')) {
      open_orders()
    } else if (to_search.includes('HEDGE')) {
      get_hedge_mode()


    } else if ( //? NEW 오더 //
      to_search.includes('-')
      || to_search.includes('+')
      || to_search.includes(' ')
      // || /\d/.test(to_search)
    ) {
      // if (!ticker_win_open) { //? 주문 - 차트 팝업 X
      // mkt_words = to_search.split(' ')

      // // LONG   // +100 / -100
      // if (mkt_words.length == 1) {

      //   if (to_search.includes('+')) { // +100 // -100
      //     market_order('BTC', 'LONG', mkt_words[0].replace('+', ''))
      //   } else if (to_search.includes('-')) {
      //     market_order('BTC', 'SHORT', mkt_words[0].replace('-', ''))
      //   }

      //   // BTC +100 // BTC -100
      //   // LONG 2 // LONG 333
      // } else if (mkt_words.length == 2) {

      //   if (to_search.includes('+')) { // BTC +100 // BTC -100
      //     market_order(mkt_words[0], 'LONG', mkt_words[1].replace('+', ''))
      //   } else if (to_search.includes('-')) {
      //     market_order(mkt_words[0], 'SHORT', mkt_words[1].replace('-', ''))
      //   } else { // LONG 2 / LONG 333
      //     market_order('BTC', mkt_words[0], mkt_words[1].replace('-', ''))
      //   }

      //   // BTC +100 20
      //   // BTC LONG 100
      // } else if (mkt_words.length == 3) {

      //   if (to_search.includes('+')) { // BTC +100 20
      //     market_order(mkt_words[0], 'LONG', mkt_words[1].replace('+', ''), mkt_words[2])
      //   } else if (to_search.includes('-')) {
      //     market_order(mkt_words[0], 'SHORT', mkt_words[1].replace('-', ''), mkt_words[2])
      //   } else { // BTC LONG 100
      //     market_order(mkt_words[0], mkt_words[1], mkt_words[2])
      //   }

      //   // BTC LONG 100 20
      // } else if (mkt_words.length == 4) {
      //   market_order(mkt_words[1], mkt_words[0], mkt_words[2], mkt_words[3])
      // }


      // } else if (ticker_win_open) { //? 주문 - 차트 팝업 O
      //   mkt_words = to_search.split(' ')
      //   // to_ticker_console(mkt_words);
      //   // LONG   // +100 / -100
      //   if (mkt_words.length == 1) {

      //     if (to_search.includes('+')) { // +100 // -100
      //       market_order(search_symbol, 'LONG', mkt_words[0].replace('+', ''))
      //     } else if (to_search.includes('-')) {
      //       market_order(search_symbol, 'SHORT', mkt_words[0].replace('-', ''))
      //     }

      //     // LONG 2 / LONG 333
      //   } else if (mkt_words.length == 2) {
      //     market_order(search_symbol, mkt_words[0], mkt_words[1].replace('-', ''))

      //     // LONG 100 20
      //   } else if (mkt_words.length == 3) {
      //     market_order(search_symbol, mkt_words[0], mkt_words[1], mkt_words[2])

      //     // BTC LONG 100 20 (다른티커)
      //   } else if (mkt_words.length == 4) {
      //     market_order(mkt_words[1], mkt_words[0], mkt_words[2], mkt_words[3])
      //   }

      // }

      // ------- 팝업 차트 띄우기 --------- //
    }

    else if (to_search == 'TICK') {
      sort_by('rec_tick')
    }
    else if (to_search == 'D' || to_search == 'DELTA') {
      sort_by('rec_rt_delta')
    }
    else if (to_search == 'OI') {
      sort_by('rec_rt_oi')
    }
    else if (to_search == 'F' || to_search == 'FUND') {
      sort_by('rec_rt_fund')
    }
    else if (to_search == 'UP' || to_search == 'UPBIT') {
      sort_by('rec_UP_vol_UTC')
    }
    else if (to_search == 'M' || to_search == 'MEMO') {
      sort_by('rec_memo')
    }

    //
    else if (to_search == 'TOP') {

      multi_input = document.querySelectorAll('input')
      ticker_recs = document.querySelectorAll('.rec_symbol')
      top_tickers = []

      for (const ticker_div of ticker_recs) {
        if (ticker_div.id.includes('res_symbol_')) {
          try {
            ticker_top = ticker_div.id.replace('res_symbol_', '')
            if (ticker_top !== 'BTC' && ticker_top !== 'ETH') {
              top_tickers.push(ticker_top)
            }
          }
          catch (e) { }
        }
      }

      for (let i = 0; i < 14; i++) {
        multi_input[i].value = top_tickers[i]
        setCookie(`multi_${i}_`, top_tickers[i], 365)
        draw_multi(i, top_tickers[i], tf)
      }
      draw_multi('BTC', 'BTC', tf)
      draw_multi('ETH', 'ETH', tf)
    }

    // 차트 TimeFrame 변경
    else if (/\d/.test(to_search) && /^\d+$/.test(to_search)) {
      tf = to_search
      tf_global = to_search

      if (ticker_win_open) {
        draw_msg(document, search_symbol, _width = null, _event = 'Enter', _rep_popup = true, keyboard = true, tf = to_search)
      }
      else {
        multi_input = document.querySelectorAll('input')
        for (let i = 0; i < 14; i++) {
          try {
            draw_multi(i, multi_input[i].value, to_search)
          } catch (e) { }
        }
        draw_multi('BTC', 'BTC', to_search)
        draw_multi('ETH', 'ETH', to_search)
      }
    }


    else if (to_search == '') {

      e.preventDefault()

      ticker_recs = document.querySelectorAll('.rec_symbol')
      rec_ticker_list = []

      for (const ticker_div of ticker_recs) {
        if (ticker_div.id.includes('res_symbol_')) {
          try { rec_ticker_list.push(ticker_div.id.replace('res_symbol_', '')) }
          catch (e) { }
        }
      }

      if (last_keypress == 'Enter') {
        for (i = 0; i < rec_ticker_list.length; i++) {
          if (last_rec_ticker == rec_ticker_list[0]) {
            rec_ticker_list.splice(0, 1)
            break
          } else {
            rec_ticker_list.splice(0, 1)
          }
        }
      }
      draw_msg(document, rec_ticker_list[0], _width = null, _event = 'Enter', _rep_popup = true, keyboard = true, ft = tf_global)
      last_rec_ticker = rec_ticker_list[0]
      search_history.push(last_rec_ticker.split(''))
      last_keypress = 'Enter'
    }

    else if (!to_search.includes(' ')) {
      draw_msg(document, to_search, _width = null, _event = 'Enter', _rep_popup = true, keyboard = true)
    } else {
    }
    // ---------  ------- //



  } else if (e.key == 'ArrowUp') {

    search_word = search_history[search_history.length - 1]
    if (last_keypress == 'ArrowUp') {
      search_word = search_history[search_history.length - (ArrowUp_count + 1)]
    }
    display_key.innerHTML = search_word.join('').toUpperCase().replace('USDT', '')
    display_key.style.display = 'block'; display_key_show = true
    ArrowUp_count++
    last_keypress = 'ArrowUp'

    // 창 나가기
  } else if (e.key == 'Escape' || e.key == 'Delete') {
    search_word = []
    if (display_key_show == true) { display_key.style.display = 'none'; display_key_show = false }
    else if (display_key_show == false) { empty_popup() }


    // 티커 입력
  } else if ("+-*0123465789ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('').includes(e.key)) {
    search_word.push(e.key.toUpperCase())
    display_key.innerHTML = search_word.join('')
    display_key.style.display = 'block'; display_key_show = true

  } else if (e.key == ' ') {
    search_word.push(e.key.toUpperCase())
    display_key.innerHTML = search_word.join('')

  } else if (e.key == 'Backspace') {
    search_word.pop()
    display_key.innerHTML = search_word.join('')
    if (search_word.length == 0) {
      display_key.style.display = 'none'; display_key_show = false
    }


    // 볼륨 피드 띄우기
  } else if (e.key == 'End') {

    e.preventDefault()
    ticker_spikes = document.querySelectorAll('.vol_msg')
    volspike_list = []

    for (const ticker_div of ticker_spikes) {
      try { volspike_list.push(ticker_div.querySelector('p').innerText) }
      catch (e) { }
    }

    draw_msg(document, volspike_list[0], _width = null, _event = 'Enter', _rep_popup = true, keyboard = true)
    last_rec_ticker = volspike_list[0]
    search_history.push(last_rec_ticker.split(''))
    last_keypress = 'End'


    // 최근피드 팝업 차트
  } else if (e.key == 'PageDown') {
    e.preventDefault()
    ticker_feeds = document.querySelectorAll('.feed_msg')
    last_feed = ticker_feeds[ticker_feeds.length - 1]
    last_ticker = last_feed.querySelector('.ws_ticker').innerText

    draw_msg(document, last_ticker, _width = null, _event = 'Enter', _rep_popup = true, keyboard = true)
    last_keypress = 'PageDown'

  } else { }

})


// MISC

function draw_rclick_open(element, ticker) {
  element.addEventListener("contextmenu", event => {
    event.preventDefault()
    coinalyze_link = `https://coinalyze.net/${coinalyze_pair[ticker]}/usdt/binance/${ticker.toLowerCase()}usdt_perp/price-chart-live/`
    window.open(coinalyze_link, '_blank')
  })
}

document.querySelectorAll('.collapsible').forEach(btn => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  })
})

function empty_popup() {
  document.querySelector('#side_chart-wrapper').style.display = 'none'
  document.querySelectorAll('.popup_chart').forEach(popup_chart => { popup_chart.innerHTML = '' })
  ticker_win_open = false
  search_symbol = ''
  ticker = ''
  last_keypress = 'Escape'
}

function empty_popup_dblclick() {
  eles = [
    document.getElementById('side_chart_low_tf'),
    document.getElementById('oi_chart'),
  ]
  eles.forEach(ele => {
    ele.addEventListener('dblclick', () => {
      empty_popup()
    })
  })
  ticker_win_open = false
  search_symbol = ''
  ticker = ''
  last_keypress = 'Escape'

}
