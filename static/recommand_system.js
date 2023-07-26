livecoin_res = {}; livecoin_data = {};
stats = {}; feeds = {};
stat_list = [];
futs_tickers = []; _bi_ticks = {}; feeds = {};
last_sorted = ''; up_vol = {};
top_up_vol = 10; tf = 5; tf_global = 15;

test_ticker = ''

fetch(`https://api.upbit.com/v1/market/all`).then(u => u.json()).then(upbit_res => {
  up_dict = {}
  upbit_market = {}
  upbit_res.forEach(t => {
    if (t.market.includes('KRW')) {
      upbit_market[t.market.replace('KRW-', '')] = t.market
    }
  })
})
  .then(() => {
    fetch(`${home_url}/binance_summ`).then((summ_) => summ_.json()).then(summ => {
      upbit_market_list = []
      summ.futs_usdt.forEach(ticker => {
        if (upbit_market[ticker]) {
          upbit_market_list.push(upbit_market[ticker])
        }
      })
    })
      .then(() => {
        var upwc = new WebSocket(`wss://api.upbit.com/websocket/v1`)
        upwc.onopen = () => {
          open_msg = [{ "ticket": "TEST", }, { "format": "SIMPLE", }, {
            "type": "ticker",
            "codes": upbit_market_list
          }]
          upwc.send(JSON.stringify(open_msg))
        }
        upwc.onmessage = up => {
          up.data.text().then(txt => {
            try {
              up_ = JSON.parse(txt)
              _vol = Round(up_.atp / 1000000 / 1200, 0)
              up_div = document.getElementById(`rec_UP_vol_UTC_${up_.cd}`)
              up_div.innerHTML = _vol
              up_div.classList.add(_vol >= top_up_vol ? 'rec_item_up' : '_')

              up_vol[up_.cd] = parseFloat(_vol)

              if (up_.cd == 'KRW-BTC') {
                up_vol_sum = 0;
                for (val in up_vol) { up_vol_sum += up_vol[val] }
                document.querySelector(`.rec_sum_UP_vol_UTC`).innerHTML = `<span>${convert_kil_mil_bil(up_vol_sum)}</span>`
              }

            } catch (e) { }
            if (Object.values(up_vol).length > 50) {
              top_up_vol = Object.values(up_vol).sort((a, b) => b - a).slice(0, 10)[9]
            }
          })
        }
      })
  })
setInterval(up_vol = [], 1000 * 60 * 1)


async function draw_fund() {
  fund_dict = {};
  var mpwc = new WebSocket(`wss://fstream.binance.com/ws/!markPrice@arr`)
  mpwc.onmessage = e => {
    JSON.parse(e.data).forEach(tic => {
      div_fund = document.getElementById(`rec_fund_${tic.s}`)
      fund = Round(tic.r * 10000, 0)
      fund_dict[tic.s] = fund
      fund_col = fund > 1 ? 'rec_item_red' : fund < -1 ? 'rec_item_fund' : ''
      try {
        div_fund.innerHTML = fund
        div_fund.classList.add(fund_col)
      } catch (e) { }
      if (tic.s == 'BTCUSDT') {
        fund_list = [];
        for (val in fund_dict) { fund_list.push(fund_dict[val]) }

        document.querySelector(`.rec_sum_fund`).innerHTML =
          `<span class=''>${Median(fund_list)}</span>`
      }
    })
  }
}

async function draw_tick() {
  const tkws = new WebSocket(`${home_ws}/tick`)
  tkws.onopen = () => { tkws.send('subscribe') }

  tkws.onmessage = e => {
    res = JSON.parse(e.data)
    document.getElementById(`rec_tick_${res.ticker}`).innerHTML = Round(res.tick / 1000, 0)
  }
}

delta_dict = {}; vol_dict = {}
async function draw_day() {
  senten_d = 'wss://fstream.binance.com/stream?streams='
  fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
    res.futs_usdt.forEach(ticker => {
      senten_d = senten_d + ticker.toLowerCase() + 'usdt' + '@kline_1d/'
    })
  })
    .then(() => {
      var dwc = new WebSocket(senten_d)
      dwc.onmessage = m => {
        msg = JSON.parse(m.data)
        try {
          div_day = document.getElementById(`rec_delta_${msg.data.s}`)
          day = (msg.data.k.c - msg.data.k.o) / msg.data.k.o
          delta_dict[msg.data.s] = day > 0 ? true : false

          day_r = Round(day * 100, 0)
          div_day.innerHTML = day_r
          day_col = day_r >= 5 ? 'rec_item_green' : day_r > 3 ? 'rec_item_weak_green' : day_r <= -5 ? 'rec_item_red' : day_r < -3 ? 'rec_item_weak_red' : '_'
          div_day.classList.add(day_col)

          if (msg.data.s == 'BTCUSDT') { sum_delta() }
        } catch (e) { }
      }
    })
}

function sum_delta() {
  delta_up_num = 0; delta_dn_num = 0; delta_up_col = ''; delta_dn_col = '';
  vol_sum = 0
  for (val in delta_dict) { delta_dict[val] == true ? delta_up_num++ : delta_dn_num++ }
  if (delta_up_num > delta_dn_num) { delta_up_col = 'rec_header_green' } else { delta_dn_col = 'rec_header_red' }
  document.querySelector(`.rec_sum_delta`).innerHTML = `<span class='${delta_up_col}'>${delta_up_num}</span>/<span class='${delta_dn_col}'>${delta_dn_num}</span>`

  for (val in vol_dict) { vol_sum += vol_dict[val] }
  document.querySelector(`.rec_sum_vol`).innerHTML = `<span class=''>${convert_kil_mil_bil(vol_sum)}</span>`
}

function draw_oi() {
  prev_oi_dict = {};
  oi_sum = 0; oi_4h_sum = 0;
  fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
    tickers = res.futs_usdt
  })
    .then(() => {
      tickers.forEach(ticker => {
        fetch(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${ticker}USDT&period=15m&limit=49`)
          .then(r => r.json())
          .then(res => {
            try {

              oi_12h = res[0].sumOpenInterest
              oi_8h = res[res.length - 33].sumOpenInterest
              oi_4h = res[res.length - 17].sumOpenInterest
              oi_1h = res[res.length - 5].sumOpenInterest
              oi_now = res[res.length - 1].sumOpenInterest

              oi_delta_1h = Round((oi_4h - oi_8h) / oi_8h * 100, 0)
              oi_delta_4h = Round((oi_now - oi_4h) / oi_4h * 100, 0)
              oi_delta_8h = Round((oi_now - oi_8h) / oi_8h * 100, 0)
              oi_delta_12h = Round((oi_now - oi_12h) / oi_12h * 100, 0)

              div_oi_ = document.getElementById(`rec_oi_${ticker}USDT`)
              div_oi_.innerHTML = ""

              mk_1h_c = Math.abs(oi_delta_1h) >= 10 ? 'rec_mark rec_mark_oi_db' :
                Math.abs(oi_delta_1h) >= 5 ? 'rec_mark rec_mark_oi' : 'rec_mark'
              div_oi_.innerHTML += `<div class="${mk_1h_c}"></div>`

              rec_oi_col = oi_delta_4h >= 10 ? 'rec_item_oi' : '_'

              div_oi_.innerHTML += `<p class='rec_oi_col'>${oi_delta_4h}</p>`

              mk_8h_c = Math.abs(oi_delta_8h) >= 40 ? 'rec_mark rec_mark_oi_db' :
                Math.abs(oi_delta_8h) >= 30 ? 'rec_mark rec_mark_oi' : 'rec_mark'
              div_oi_.innerHTML += `<div class="${mk_8h_c}"></div>`

              mk_12h_c = Math.abs(oi_delta_12h) >= 70 ? 'rec_mark rec_mark_oi_db' :
                Math.abs(oi_delta_12h) >= 50 ? 'rec_mark rec_mark_oi' : 'rec_mark'
              div_oi_.innerHTML += `<div class="${mk_12h_c}"></div>`


              // div_oi_abs = document.getElementById(`rec_oi_abs_${ticker}USDT`)
              // oi_abs = res[res.length - 1].sumOpenInterestValue
              // oi_rnd = Round(oi_abs / 1000000, 0)
              // div_oi_abs.innerHTML = oi_rnd > 100 ? Round(oi_rnd / 1000, 1) : oi_rnd
              // oi_sum += parseFloat(oi_abs)
              // oi_4h_sum += parseFloat(res[0].sumOpenInterestValue)

            } catch (e) { }
          })
          .then(() => {
            // document.querySelector(`.rec_sum_oi_abs`).innerHTML = `<span>${convert_kil_mil_bil(oi_sum)}</span>`
          })
      })
    })
}

function draw_stat() {
  Object.keys(stats).forEach(coin => {
    try {
      tradinglite_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binance:${coin}USDT,5`
      tradinglite_f_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binancef:${coin}USDT,5`
      TL_tag = `<span><a href="${tradinglite_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link.png"/></a></span>`
      TL_f_tag = `<span><a href="${tradinglite_f_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link_f.png"/></a></span>`

      coinalyze_link = `https://coinalyze.net/${coinalyze_pair[coin]}/usdt/binance/${coin.toLowerCase()}usdt_perp/price-chart-live/`
      coinalyze_tag = `<a target="_blank" href="${coinalyze_link}"><p class='rec_oi_col'>${coin.replace('1000', '')}</p></a>`

      // TV_link = `https://www.tradingview.com/chart/vX3JXmil/?symbol=BINANCE:${coin}USDT.P`
      // TV_tag = `<a href="${TV_link}" target="_blank">${coin.replace('1000', '')}</a>`

      if (phone) {
        document.getElementById(`res_symbol_${coin}`).innerHTML = `<div id="rec_memo_mark_${coin}" class="rec_mark memo_mark"></div><p>${coinalyze_tag}</p>`
        document.getElementById(`res_symbol_${coin}`).innerHTML += TL_f_tag + TL_tag
      }
      else {
        document.getElementById(`res_symbol_${coin}`).innerHTML = `<div id="rec_memo_mark_${coin}" class="rec_mark memo_mark"></div><p>${coin.replace('1000', '')}</p>`
      }
      document.getElementById(`rec_cate_${coin}`).innerHTML = stats[coin]['Category'] !== 0 ? stats[coin]['Category'] : ''
    } catch (e) { }
  })
  draw_memo()
}

function get_backend() {
  fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
    ticker_perp_usdt = res.futs_usdt
  })
    .then(_ => {
      ticker_perp_usdt.forEach(coin => {

        cate = null
        cate_dict = {
          'DeFi': 'BAL 1INCH BNX AAVE KNC UNFI CRV KAVA RUNE YFI YFII UNI INJ REN SNX MKR CAKE STG FLM SUSHI COMP COTI AUTO AMP BEL LIT XVS RSR SPELL UMA BADGER BETA',
          'DEX': 'DYDX GMX INJ KWENTA REI ASTA LVL SNX LINA REEF GNS SYN LEVER PERP',
          'CEX': 'WOO',
          'Yield': 'CVX DODO BAKE HFT DF AKRO TRU UFT CELR',
          'Oracle': 'LINK BAND TRB CTK BLZ API3',

          '⭕': 'ACH CFX COCOS LINA ARPA TOMO TRX SUN JST',
          '🦖': 'ADA 1000XEC BAT ICX KLAY SXP ZRX ASTA ETC XLM VET XEC THETA WAVES ZIL RVN XRP IOST ONT QNT QTUM NEO LTC EOS BCH SSV ANT IOTA IOTX GTC DGB DENT STMX',
          '🦕': 'ZEC XEM XEC XMR ROSE SCRT DASH DCR ZEN CKB ATA',

          'Meta': 'CHZ BLUR APE MAGIC SAND MANA OGN TVK FLOW TLM AXS HIGH MBOX DAR COCOS TVK ALICE SLP ILV BURGER PYR GHST GALA',
          '🕹️': 'IMX ENJ YGG AGLD MC LOKA VOXEL PLA WAXP CHR PHB',
          '🤖': 'AGIX FET OCEAN',

          '💩': '1000PEPE 1000LUNC 1000SHIB 1000FLOKI DOGE MASK PEOPLE LUNA2',
          '💛': 'HFT HOOK ID LQTY GMT C98 CTSI ALPHA LOKA SFP',
          '🌱': 'XVG EDU IDEX UMA KEY COMBO RAD MAV MDT NMR',

          '①': 'ETH SOL NEAR KSM SUI ASTR NKN AVAX BNB DOT KDA SKL MINA ONE EGLD FTM ROSE ATOM MATIC NE SC SNM RIF SOL XTZ ZEC CELO STX ALGO HBAR LUNA OMG DUSK',
          'Ⅱ': 'APT LRC OP SKL ARB JOE RDNT',
          '💊': 'FXS LDO RPL PENDLE',
          'Pay': 'SFP TWT COTI MTL',

          '🌐': 'GAL GRT ICP ELF FIL STORJ HOT RLC AR SC SNM RIF ANKR AMB AUDIO JASMY RNDR ENS LPT',

          'Stable': 'USDC',
          'IDX': 'FOOTBALL BTCDOM DEFI BLUEBIRD',
        }

        Object.values(cate_dict).forEach(coin_list => {
          if (coin_list.includes(coin)) {
            cate = Object.keys(cate_dict).find(key => cate_dict[key] === coin_list)
          }
        })

        stats[coin] = {
          'ticker': coin,
          'Category': cate,
        }
      })
      draw_stat()
    })
}


// ---------------------------- //
// ----------- NOTE ----------- //
// ---------------------------- //

function getMemos() {
  try {
    memos = JSON.parse(localStorage.getItem('memos'))
  } catch (e) {
    memos = {}
  }
  if (memos == {} || memos == null) { localStorage.setItem('memos', JSON.stringify({})) }
  return memos
}

function saveMemos(memos) {
  localStorage.setItem('memos', JSON.stringify(memos))
}

function draw_memo() {
  memos = getMemos()
  today = get_mmdd()
  yesterday = get_mmdd('yesterday')
  yeyesterday = get_mmdd(2)

  document.querySelectorAll('.rec_memo').forEach(coin_memo => {
    coin = coin_memo.id.replace('rec_memo_', '')
    coin_memo.innerHTML = ''
    memo_textarea = document.createElement('textarea')
    memo_textarea.className = `rec_memo_ta_${coin}`

    memo_textarea.addEventListener('change', () => {
      coin_ = coin_memo.id.replace('rec_memo_', '')
      updateMemo(coin_, document.querySelector(`.rec_memo_ta_${coin_}`).value)
    })

    coin_memo.appendChild(memo_textarea)

    symbol_div = document.getElementById(`res_symbol_${coin}`)
    memo_marker = document.getElementById(`rec_memo_mark_${coin}`)

    if (memos[coin] !== undefined && memos[coin] !== '') {
      try {

        memo_textarea.innerHTML = memos[coin]
        // memo_textarea.classList.add('rec_symbol_neut');
        memo_textarea.style.opacity = 0.7
        // memo_marker.classList.add('rec_marker');

        if (memos[coin].includes('bear')
          || memos[coin].includes('weak')
          || memos[coin].includes('res')
          || memos[coin].includes('fail')
        ) {
          memo_marker.classList.add('rec_marker_bear')
          // memo_textarea.classList.add('rec_symbol_bear')
        }
        if (memos[coin].includes('bull')
          || memos[coin].includes('strong')
          || memos[coin].includes('sup')
          || memos[coin].includes('break')
        ) {
          memo_marker.classList.add('rec_marker_bull')
          // memo_textarea.classList.add('rec_symbol_bull')
        }
        if (memos[coin].includes(today)) {
          // memo_marker.classList.add('rec_marker_today')
          memo_textarea.classList.add('rec_symbol_today')
        }
        if (memos[coin].includes(yesterday)) {
          // memo_marker.classList.add('rec_marker_yesterday')
          memo_textarea.classList.add('rec_symbol_yesterday')
        }
        if (memos[coin].includes(yeyesterday)) {
          // memo_marker.classList.add('rec_marker_yesterday')
          memo_textarea.classList.add('rec_symbol_yeyesterday')
        }

      } catch (e) { }
    }

    if (memos[coin] == '') {
      symbol_div.classList.remove('rec_symbol_yeyesterday')
      symbol_div.classList.remove('rec_symbol_yesterday')
      symbol_div.classList.remove('rec_symbol_today')
      symbol_div.classList.remove('rec_symbol_bull')
      symbol_div.classList.remove('rec_symbol_bear')

      // memo_textarea.classList.remove('rec_symbol_neut')
      memo_textarea.classList.remove('rec_symbol_bull')
      memo_textarea.classList.remove('rec_symbol_bear')
      memo_textarea.classList.remove('rec_symbol_news')
      memo_textarea.classList.remove('rec_symbol_ex')
    }
  })
}

function updateMemo(coin, new_content) {
  const memos = getMemos()
  memos[coin] = new_content
  saveMemos(memos)
  draw_memo()
}

// ------------------------------------------------------------- //
// -----------------------              ------------------------ //
// ------------------------------------------------------------- //

async function recommandation() {
  sorted_tick = []

  fetch(`${home_url}/binance_summ`).then((r) => r.json()).then(res => {
    res.futs_usdt.forEach(coin => {
      sorted_tick.push({
        'ticker': coin,
      })
    })
  })
    .then(_ => {
      recommand = document.getElementById('recommand')

      rec_header = document.createElement('div')
      rec_header.className = 'rec_header'
      recommand.appendChild(rec_header)

      rec_container = document.createElement('div')
      rec_container.className = 'rec_container'
      recommand.appendChild(rec_container)

      rec_header_name = document.createElement('div')
      rec_header_name.className = 'rec_header_row'
      rec_header.appendChild(rec_header_name)

      rec_header_sum = document.createElement('div')
      rec_header_sum.className = 'rec_sum_row'
      rec_header.appendChild(rec_header_sum)

      rec_header_name.innerHTML += '<div id="rec_cate" class="rec_item rec_header_sort rec_rt rec_cate rec_cate_header"> Cate</div>'

      rec_header_name.innerHTML += '<div id="rec_tick" class="rec_item rec_header_sort rec_tick">T</div>'
      rec_header_name.innerHTML += '<div id="rec_rt_delta" class="rec_item rec_header_sort rec_rt rec_rt_delta">d%</div>'

      rec_header_name.innerHTML += '<div id="rec_tick" class="rec_item rec_header_sort rec_symbol rec_symbol_header">Ticker</></div>'

      rec_header_name.innerHTML += '<div id="rec_rt_oi" class="rec_item rec_header_sort rec_rt rec_rt_oi">OI</div>'
      // rec_header_name.innerHTML += '<div id="rec_rt_oi_long" class="rec_item rec_header_sort rec_rt rec_rt_oi">24h</div>'
      // rec_header_name.innerHTML += '<div id="rec_rt_oi_abs" class="rec_item rec_header_sort rec_rt rec_rt_oi_abs">OI</div>'

      // rec_header_name.innerHTML += '<div id="rec_rt_vol" class="rec_item rec_header_sort rec_rt rec_rt_vol">BiV</div>'
      rec_header_name.innerHTML += '<div id="rec_rt_fund" class="rec_item rec_header_sort rec_rt rec_rt_fund">F</div>'
      rec_header_name.innerHTML += '<div id="rec_UP_vol_UTC" class="rec_item rec_header_sort rec_rt rec_rt_vol rec_UP_vol_UTC"> UpV</div>'

      rec_header_name.innerHTML += '<div id="rec_memo" class="rec_item rec_header_sort rec_rt rec_memo_header"> Memo</div>'


      // --------
      // -------- SUMMARY
      // --------
      rec_header_sum.innerHTML += '<div id="rec_cate" class="rec_item rec_sum rec_header_sort rec_cate rec_cate_header"></div>'
      rec_header_sum.innerHTML += '<div id="rec_tick" class="rec_item rec_sum rec_header_sort rec_tick"></div>'
      rec_header_sum.innerHTML += '<div id="rec_rt_delta" class="rec_item rec_sum rec_header_sort rec_rt_delta"></div>'

      rec_header_sum.innerHTML += '<div id="rec_tick" class="rec_item rec_sum rec_header_sort rec_sum_delta rec_symbol rec_symbol_header"> </div>'

      rec_header_sum.innerHTML += '<div id="rec_rt_oi" class="rec_item rec_sum rec_header_sort rec_sum_oi rec_rt_oi"> </div>'
      // rec_header_sum.innerHTML += '<div id="rec_rt_oi_long" class="rec_item rec_sum rec_header_sort rec_sum_rt_long rec_rt_oi"> </div>'
      // rec_header_sum.innerHTML += '<div id="rec_rt_oi_abs" class="rec_item rec_sum rec_header_sort rec_sum_oi_abs rec_rt_oi_abs">SUM</div>'

      // rec_header_sum.innerHTML += '<div id="rec_rt_vol" class="rec_item rec_sum rec_header_sort rec_sum_vol rec_rt_vol">SUM</div>'
      rec_header_sum.innerHTML += '<div id="rec_rt_fund" class="rec_item rec_sum rec_header_sort rec_sum_fund rec_rt_fund">COMM</div>'
      rec_header_sum.innerHTML += '<div id="rec_UP_vol_UTC" class="rec_item rec_sum rec_header_sort rec_sum_UP_vol_UTC rec_rt_vol rec_UP_vol_UTC">SUM</div>'

      rec_header_sum.innerHTML += '<div id="rec_memo" class="rec_item rec_sum rec_header_sort rec_sum_memo rec_memo_header"> </div>'

      document.querySelectorAll('.rec_header_sort').forEach(header_sort => {
        header_sort.addEventListener('click', () => {
          sort_by(header_sort.id)
          document.getElementById('recommand').scrollTop = 0
        })
      })

      draw_table()

    })
    .then(() => {
      get_backend()
      draw_day(); draw_tick(); draw_fund(); draw_oi();
      setInterval(() => { draw_oi() }, 1000 * 60 * 8)
      setInterval(() => { get_backend() }, 1000 * 60 * 3)
      setInterval(() => {
        if (last_sorted !== 'rec_cate_r' && last_sorted !== 'rec_cate') {
          sort_by(last_sorted, true)
        }
      }, 1000 * 20)
    })
}

recommandation()
setTimeout(() => { sort_by('rec_rt_tick') }, 3 * 1000);


function draw_table(dict = sorted_tick.sort((a, b) => b.ticker - a.ticker), snapshot) {
  rec_container.innerHTML = ''
  dict.forEach(data => {
    coin = data.ticker

    rec_row = document.createElement('p')
    rec_row.className = `rec_row`

    rec_row.innerHTML += `<div id='rec_cate_${coin}' class='rec_item rec_rt rec_cate'></div>`

    rec_row.innerHTML += `<div id='rec_tick_${coin}USDT' class='rec_item rec_rt rec_tick rec_rt_tick'></div>`
    rec_row.innerHTML += `<div id='rec_delta_${coin}USDT' class='rec_item rec_rt rec_rt_delta'></div>`

    rec_row.innerHTML += `<div id='res_symbol_${coin}' class='rec_item rec_symbol'></div>`

    rec_row.innerHTML += `<div id='rec_oi_${coin}USDT' class='rec_item rec_rt rec_rt_oi'></div>`
    // rec_row.innerHTML += `<div id='rec_oi_long_${coin}USDT' class='rec_item rec_rt rec_rt_oi rec_rt_oi_long'></div>`
    // rec_row.innerHTML += `<div id='rec_oi_abs_${coin}USDT' class='rec_item rec_rt rec_rt_oi_abs'>0</div>`

    // rec_row.innerHTML += `<div id='rec_vol_${coin}USDT' class='rec_item rec_rt rec_rt_vol'></div>`
    rec_row.innerHTML += `<div id='rec_fund_${coin}USDT' class='rec_item rec_rt rec_rt_fund'></div>`
    rec_row.innerHTML += `<div id='rec_UP_vol_UTC_KRW-${coin}' class='rec_item rec_rt rec_rt_vol rec_UP_vol_UTC'></div>`

    rec_row.innerHTML += `<div id='rec_memo_${coin}' class='rec_item rec_rt rec_memo'></div>`
    rec_container.appendChild(rec_row)

    draw_msg(rec_row, coin)
  })
  draw_stat()

  if (snapshot) {
    snapshot.forEach(snap => {
      document.getElementById(`rec_tick_${snap.ticker}USDT`).innerHTML = snap.rec_rt_tick
      document.getElementById(`rec_delta_${snap.ticker}USDT`).innerHTML = snap.rec_rt_delta
      delta_col = snap.rec_rt_delta > 5 ? 'rec_item_green' : snap.rec_rt_delta > 1 ? 'rec_item_weak_green' : snap.rec_rt_delta < -5 ? 'rec_item_red' : snap.rec_rt_delta < -1 ? 'rec_item_weak_red' : '_'
      document.getElementById(`rec_delta_${snap.ticker}USDT`).classList.add(delta_col)

      document.getElementById(`rec_oi_${snap.ticker}USDT`).innerHTML = snap.rec_rt_oi
      rec_oi_c = snap.rec_rt_oi_c > 10 ? 'rec_item_oi' : '_'
      document.getElementById(`rec_oi_${snap.ticker}USDT`).classList.add(rec_oi_c)
      // document.getElementById(`rec_oi_long_${snap.ticker}USDT`).innerHTML = snap.rec_rt_oi_long
      // rec_oi_long_c = snap.rec_rt_oi_long_c > 40 ? 'rec_item_oi' : '_'
      // document.getElementById(`rec_oi_long_${snap.ticker}USDT`).classList.add(rec_oi_long_c)

      // document.getElementById(`rec_oi_abs_${snap.ticker}USDT`).innerHTML = snap.rec_rt_oi_abs

      // document.getElementById(`rec_vol_${snap.ticker}USDT`).innerHTML = snap.rec_rt_vol
      document.getElementById(`rec_fund_${snap.ticker}USDT`).innerHTML = snap.rec_rt_fund
      document.getElementById(`rec_UP_vol_UTC_KRW-${snap.ticker}`).innerHTML = snap.rec_UP_vol_UTC
    })
  }
}

// -------------------------------------------- //
function draw_spag() {
  vol_tickers = {}
  memos = getMemos()
  document.querySelectorAll('.rec_row').forEach(row => {
    ticker = row.querySelector(`.rec_symbol`).id.replace('res_symbol_', '')

    if (row.querySelector(`.rec_rt_tick`).innerHTML > 50) { vol_tickers[ticker] = `#bdc9cfd5` }
    if (row.querySelector(`.rec_rt_delta`).innerHTML >= 10) { vol_tickers[ticker] = `#86e67eda` }
    if (row.querySelector(`.rec_rt_oi`).innerText > 10) { vol_tickers[ticker] = `#ced49ada` }
    if (row.querySelector(`.rec_UP_vol_UTC`).innerText > top_up_vol) { vol_tickers[ticker] = `#d6aef79f` }
    if (row.querySelector(`.rec_rt_fund`).innerText < -1) { vol_tickers[ticker] = `#9fb5d3a1` }
    if (memos[ticker]) {
      if (memos[ticker].includes('/') || memos[ticker].includes(today)) { vol_tickers[ticker] = `#d3e7a3da` }
      if (memos[ticker].includes('.')) { vol_tickers[ticker] = `#b6d49dda` }
      if (memos[ticker].includes(',')) { vol_tickers[ticker] = `#dab69ada` }
    }
  })
  draw_vol_spaghetti(vol_tickers)
}
// setTimeout(() => { draw_spag() }, 5 * 1000);
// setInterval(() => { draw_spag() }, 5 * 60 * 1000)


//
function sort_by(to_sort_column = 'rec_rt_delta', stay_sort = false) {
  sort_listing = []
  snapshot = []
  if (stay_sort) { last_sorted = last_sorted.replace('_r', '') }

  document.querySelectorAll('.rec_row').forEach(row => {

    ticker = row.querySelector(`.rec_symbol`).id.replace('res_symbol_', '')

    if (to_sort_column == 'rec_memo') {
      val_ = row.querySelector(`.${to_sort_column}`).childNodes[0].value
    } else {
      try { val_ = row.querySelector(`.${to_sort_column}`).innerText }
      catch (e) { val_ = '' }
    }

    if (to_sort_column == 'rec_memo') {
      sort_listing.push({
        'ticker': ticker,
        'to_sort': val_,
      })
    } else {
      sort_listing.push({
        'ticker': ticker,
        'to_sort': val_.includes('.') ? val_.replace('.', '') * 1000 : val_.replace('.', ''),
      })
    }

    snapshot.push({
      ticker: ticker,
      rec_rt_tick: row.querySelector(`.rec_rt_tick`).innerText,
      rec_rt_delta: row.querySelector(`.rec_rt_delta`).innerText,
      rec_rt_oi_c: row.querySelector(`.rec_rt_oi`).innerText,
      rec_rt_oi: row.querySelector(`.rec_rt_oi`).innerHTML,
      // rec_rt_oi_long_c: row.querySelector(`.rec_rt_oi_long`).innerText,
      // rec_rt_oi_long: row.querySelector(`.rec_rt_oi_long`).innerHTML,
      // rec_rt_oi_abs_c: row.querySelector(`.rec_rt_oi_abs`).innerText,
      // rec_rt_oi_abs: row.querySelector(`.rec_rt_oi_abs`).innerHTML,
      // rec_rt_vol: row.querySelector(`.rec_rt_vol`).innerText,
      rec_rt_fund: row.querySelector(`.rec_rt_fund`).innerText,
      rec_UP_vol_UTC: row.querySelector(`.rec_UP_vol_UTC`).innerText,
    })
  })

  //
  if (to_sort_column == 'rec_cate' && last_sorted == 'rec_cate_r') {
    new_sort = sort_listing.sort((a, b) => a.to_sort.localeCompare(b.to_sort))
    last_sorted = `${to_sort_column}`
  }

  else if (to_sort_column == 'rec_cate' || to_sort_column == 'rec_memo') {
    new_sort = sort_listing.sort((a, b) => b.to_sort.localeCompare(a.to_sort))
    last_sorted = `${to_sort_column}_r`
  }

  else if (to_sort_column == 'rec_rt_delta' && last_sorted == 'rec_rt_delta') {
    new_sort = sort_listing.sort((a, b) => a.to_sort - b.to_sort)
    last_sorted = 'rec_rt_delta_r'
  }
  else if (to_sort_column == 'rec_rt_oi' && last_sorted == 'rec_rt_oi') {
    new_sort = sort_listing.sort((a, b) => a.to_sort - b.to_sort)
    last_sorted = 'rec_rt_oi_r'
  }
  else if (to_sort_column == 'rec_rt_fund' && last_sorted == 'rec_rt_fund') {
    new_sort = sort_listing.sort((a, b) => b.to_sort - a.to_sort)
    last_sorted = 'rec_rt_fund_r'
  }
  else if (to_sort_column == 'rec_rt_fund') {
    new_sort = sort_listing.sort((a, b) => a.to_sort - b.to_sort)
    last_sorted = 'rec_rt_fund'
  }

  else {
    new_sort = sort_listing.sort((a, b) => b.to_sort - a.to_sort)
    last_sorted = to_sort_column
  }
  draw_table(new_sort, snapshot)
}



// -------------------------------------------- //
// -------------------------------------------- //
// -------------------------------------------- //
function EMACalc(mArray, mRange) {
  var k = 2 / (mRange + 1);
  emaArray = [mArray[0]];
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
}


async function draw_depth() {
  const obws = new WebSocket(`${home_ws}/orderbook`)
  obws.onopen = () => { obws.send('subscribe') }

  obws.onmessage = e => {
    res = JSON.parse(e.data)

    Object.values(res).forEach(ob => {
      // cap = stats[ob[0].replace('USDT', '').replace('1000', '')].MCap
      // volume = stats[ob[0].replace('USDT', '').replace('1000', '')].Volume_15m
      try {
        div_depth_2 = document.getElementById(`rec_depth_2_${ob[0]}`)
        div_depth_5 = document.getElementById(`rec_depth_5_${ob[0]}`)
        // ob2_sum = (ob[1] + ob[2]) / 1000000
        // if (ob2_sum < 1) {
        //   div_depth_2.innerHTML = `${Round(ob2_sum, 1)}`
        // } else {
        //   div_depth_2.innerHTML = `${Round(ob2_sum, 0)}`
        // }
        ob2_per = ob[1] / ob[2] * 100 - 100
        ob2_per = ob2_per > 999 ? 999 : ob2_per < -999 ? -999 : ob2_per
        ob2_per = isFinite(ob2_per) ? ob2_per : ''
        div_depth_2.innerHTML = `${Round(ob2_per, 0)}`
        // div_depth_2.innerHTML = `${Round(ob[1] / 1000000, 1)} <br> ${Round(ob[2] / 1000000, 1)}`
        // div_depth_5.innerHTML = `${Round(ob[3] / 1000000, 1)} /n ${Round(ob[4] / 1000000, 1)}`
        depth_2_col = ob2_per > 0 ? '' : 'rec_item_weak_red'
        div_depth_2.classList.add(depth_2_col)
      } catch (e) { }
    })
  }
}
