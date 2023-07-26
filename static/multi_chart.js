
function draw_multi(chart_id, ticker, ft = 15) {
  container = document.getElementById(`chart_${chart_id}`);
  container.innerHTML = ''
  if (ticker == '') { return }

  legend = document.createElement('span')
  legend.classList.add('legend_multi')
  container.appendChild(legend)

  coinalyze_link = `https://coinalyze.net/${coinalyze_pair[ticker]}/usdt/binance/price-chart-live/`
  TV_link = `https://www.tradingview.com/chart/vX3JXmil/?symbol=BINANCE:${ticker}USDT.P`
  tradinglite_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binance:${ticker}USDT,5`
  tradinglite_f_link = `https://www.tradinglite.com/chart/SbzI2UXC#0,binancef:${ticker}USDT,5`
  legend.innerHTML += `<a href="${TV_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TV_link.png"/></a>`
  legend.innerHTML += `<a href="${coinalyze_link}" target="_blank"><img class="link_pic" src="${home_url}/img/coinalyze.png"/></a>`
  legend.innerHTML += `<a href="${tradinglite_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link.png"/></a>`
  // legend.innerHTML += `<a href="${tradinglite_f_link}" target="_blank"><img class="link_pic" src="${home_url}/img/TL_link_f.png"/></a>`

  var chart = LightweightCharts.createChart(container, {
    layout: {
      backgroundColor: ticker == 'BTC' || ticker == 'ETH' ? '#101010' : '#131313',
      // backgroundColor: '#101011',
      textColor: 'rgba(180, 180, 180, 1)',
      fontSize: 12,
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
        bottom: 0.17,
      },
    },
    timeScale: {
      barSpacing: 5.8,
      rightOffset: 1,
      borderColor: 'rgba(197, 203, 206, 0)',
      timeVisible: true,
      secondsVisible: false,
    },
  });

  bar_up_col = 'rgba(160, 160, 160, 1)'
  bar_dn_col = 'rgba(50, 116, 141, 1)'
  wick_col = 'rgba(210,210,210, .5)'
  vol_col = 'rgba(139, 139, 139, 0.7)'

  var candleSeries = chart.addCandlestickSeries({
    upColor: bar_up_col,
    borderUpColor: bar_up_col,
    downColor: bar_dn_col,
    borderDownColor: bar_dn_col,
    wickDownColor: wick_col,
    wickUpColor: wick_col,
    priceLineVisible: false,
    // title: ticker.replace('USDT', ''),
  });

  var volumeSeries = chart.addHistogramSeries({
    priceFormat: {
      type: 'volume',
    },
    color: vol_col,
    priceScaleId: '0',
    priceLineVisible: false,
    scaleMargins: {
      top: 0.8,
      bottom: 0.01,
    },
  })

  if (ticker == 'BTC' || ticker == 'ETH') {
    monday = get_monday_timestamp(new Date())
    fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}USDT&interval=1d&startTime=${monday}&limit=1`)
      .then((r) => r.json())
      .then((res) => {
        candleSeries.createPriceLine({ // Monday High
          price: res[0][2],
          color: MH_color,
          lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.Dotted,
          axisLabelVisible: false,
        })
        candleSeries.createPriceLine({ // Monday Low
          price: res[0][3],
          color: ML_color,
          lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.Dotted,
          axisLabelVisible: false,
        })
      })
  }

  monday = get_monday_timestamp(new Date())
  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}USDT&interval=1d&startTime=${monday}&limit=1`)
    .then((r) => r.json())
    .then((res) => {
      candleSeries.createPriceLine({ // Weekly Open
        price: res[0][1],
        color: WO_color,
        lineWidth: 1.1,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: false,
      })
    })

  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}USDT&limit=100&interval=${ft}m`)
    .then((r) => r.json())
    .then((response) => {
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

  var bwc = new WebSocket(`wss://fstream.binance.com/ws/${ticker.toLowerCase()}usdt@kline_${ft}m`)
  bwc.onmessage = function (e) {
    var message = JSON.parse(e.data)
    candleSeries.update({
      time: message.k.t / 1000 + 32400,
      open: message.k.o,
      high: message.k.h,
      low: message.k.l,
      close: message.k.c
    })
    volumeSeries.update({
      time: message.k.t / 1000 + 32400,
      value: parseFloat(message.k.q) / 1000000,
    })
  }


  new ResizeObserver(entries => {
    const newRect = entries[0].contentRect
    chart.applyOptions({ height: newRect.height, width: newRect.width })
  }).observe(container)


}
