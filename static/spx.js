function draw_spx(container = 'spx_chart') {
  new TradingView.widget({
    "container_id": container,
    'autosize': true,
    "symbol": "OANDA:SPX500USD",
    "interval": "3",
    'VisiblePlotsSet': "ohlc",
    "timezone": "Etc/UTC",
    "theme": "dark",

    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "hide_top_toolbar": true,
    "hide_legend": true,
    "save_image": false,

    disabled_features: [
      'volume_force_overlay',
      'create_volume_indicator_by_default',
    ],

    overrides: {
      'paneProperties.vertGridProperties.color': '#000000',
      'paneProperties.horzGridProperties.color': '#000000',
      'paneProperties.background': '#000000',
      'mainSeriesProperties.showPriceLine': false,
      'paneProperties.bottomMargin': 8,
    }

  })
}
