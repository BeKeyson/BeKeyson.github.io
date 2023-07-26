
function draw_future(ticker, width, height, spacing) {
  container = document.getElementById(ticker)
  container.innerHTML = ''

  var chart = LightweightCharts.createChart(container, {
    width: window.innerWidth * width / 100,
    height: window.innerHeight * height / 100,
    layout: {
      backgroundColor: HD_CHART_BG,
      textColor: 'rgba(255, 255, 255, 0.9)',
      fontSize: 14,
    },
    grid: {
      vertLines: { color: 'rgba(197, 203, 206, 0)' },
      horzLines: { color: 'rgba(197, 203, 206, 0)' },
    },
    crosshair: {
      horzLine: { visible: false, },
      vertLine: { visible: true, },
    },
    rightPriceScale: {
      borderColor: 'rgba(197, 203, 206, 0.8)',
      borderVisible: false,
      scaleMargins: {
        top: 0.03,
        bottom: 0.21,
      },
    },
    timeScale: {
      barSpacing: spacing,
      rightOffset: 4,
      borderColor: 'rgba(197, 203, 206, 0)',
      timeVisible: true,
      secondsVisible: false,
    },
  });

  var candleSeries = chart.addCandlestickSeries({
    downColor: 'rgba(15,129,180, 1)',
    upColor: 'rgba(210,210,210, 1)',
    borderDownColor: 'rgba(15,129,180, 1)',
    borderUpColor: 'rgba(210,210,210, 1)',
    wickDownColor: 'rgba(210,210,210, 0.8)',
    wickUpColor: 'rgba(210,210,210, 0.8)',
    priceLineVisible: false,
    priceFormat: {
      type: 'price',
      precision: 0,
      minMove: 1,
    },
  })

  var volumeSeries = chart.addHistogramSeries({
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

  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}&interval=5m&limit=500`)
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
          value: parseFloat(candle[7]),
        }
        candles.push(temCandle)
      });
      candleSeries.setData(candles)
      volumeSeries.setData(candles)
    })

  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}&interval=5m&startTime=${get_epoch_00()}&limit=2`)
    .then((r) => r.json())
    .then((response) => {
      daily_open = response[0][1]
      candleSeries.createPriceLine({ // Daily Open
        price: daily_open,
        color: DO_color,
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: false,
        // title: 'DO',
      })
    })

  monday = get_monday_timestamp(new Date())
  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker.toUpperCase()}&interval=1d&startTime=${monday}&limit=1`)
    .then((r) => r.json())
    .then((res) => {
      candleSeries.createPriceLine({ // Weekly Open
        price: res[0][1],
        color: WO_color,
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: false,
      })
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

  var bwc = new WebSocket(`wss://fstream.binance.com/ws/${ticker.toLowerCase()}@kline_3m`)
  bwc.onmessage = function (e) {
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
      value: parseFloat(message.k.q),
    })
  }

  new ResizeObserver(entries => {
    const newRect = entries[0].contentRect
    chart.applyOptions({ height: newRect.height, width: newRect.width })
  }).observe(container)

  new ResizeObserver(entries => {
    const newRect = entries[0].contentRect
    chart.applyOptions({ width: newRect.width * width / 100 })
  }).observe(document.body)
}

function draw_spot(ticker, width, height, spacing, offset = 20) {
  container = document.getElementById(ticker)
  container.innerHTML = ''

  var chart = LightweightCharts.createChart(container, {
    width: window.innerWidth * width / 100,
    height: window.innerHeight * height / 100,
    layout: {
      backgroundColor: HD_CHART_BG,
      textColor: 'rgba(255, 255, 255, 0.9)',
      fontSize: 12,
    },
    grid: {
      vertLines: { color: 'rgba(197, 203, 206, 0)' },
      horzLines: { color: 'rgba(197, 203, 206, 0)' },
    },
    crosshair: {
      horzLine: { visible: false, },
      vertLine: { visible: true, },
    },
    rightPriceScale: {
      borderColor: 'rgba(197, 203, 206, 0.8)',
      borderVisible: false,
      scaleMargins: {
        top: 0.03,
        bottom: 0.21,
      },
    },
    timeScale: {
      barSpacing: spacing,
      rightOffset: offset,
      borderColor: 'rgba(197, 203, 206, 0)',
      timeVisible: true,
      secondsVisible: false,
    },
  });

  var candleSeries = chart.addCandlestickSeries({
    downColor: 'rgba(15,129,180, 1)',
    upColor: 'rgba(210,210,210, 1)',
    borderDownColor: 'rgba(15,129,180, 1)',
    borderUpColor: 'rgba(210,210,210, 1)',
    wickDownColor: 'rgba(210,210,210, 0.8)',
    wickUpColor: 'rgba(210,210,210, 0.8)',
    priceLineVisible: false,
  });

  var volumeSeries = chart.addHistogramSeries({
    priceFormat: {
      type: 'volume',
    },
    priceLineVisible: false,
    color: 'rgba(180,180,180,0.7)',
    priceScaleId: '0',
    scaleMargins: {
      top: 0.8,
      bottom: 0.01,
    },
  })

  // fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker.toUpperCase()}&startTime=${get_epoch_00()}&interval=5m`)
  fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker.toUpperCase()}&limit=300&interval=5m`)
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
          value: parseFloat(candle[7]),
        }
        candles.push(temCandle)
      });
      candleSeries.setData(candles)
      volumeSeries.setData(candles)
    })


  var bwc = new WebSocket(`wss://stream.binance.com:9443/ws/${ticker.toLowerCase()}@kline_5m`)
  bwc.onmessage = function (e) {
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
      value: parseFloat(message.k.q),
    })
  }

  new ResizeObserver(entries => {
    const newRect = entries[0].contentRect
    chart.applyOptions({ height: newRect.height, width: newRect.width })
  }).observe(container)

  new ResizeObserver(entries => {
    const newRect = entries[0].contentRect
    chart.applyOptions({ width: newRect.width * width / 100 })
  }).observe(document.body)

}

