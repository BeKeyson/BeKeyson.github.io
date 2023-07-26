





function ws_oi() {
  const msgContainer = document.querySelector('#oi_container')
  const ws = new WebSocket(`${home_ws}/oi`)
  const led = document.getElementById('led_oi')
  var vol_sound = new Audio(`${home_url}/sound/drop.mp3`)
  vol_sound.oi = 0.2

  ws.onopen = () => {
    ws.send('subscribe')
    led.style.backgroundColor = '#ABFF00'
  }

  ws.onmessage = res => {
    res = JSON.parse(res.data)
    if (Math.abs(res.oi_delta_per) < 5) { return "" }

    try {
      const new_msg = document.createElement('div')
      if (('mute' in res)) { dim = 'dim' } else { dim = '' }
      oi_col = res.oi_delta_per > 0 ? 'oi_up' : 'oi_dn'

      new_msg.className = `ws_msg oi_msg ${dim}`
      new_msg.innerHTML = `
                          <p class="${oi_col}"> ${res.ticker}</p>
                          <p> <span>${get_hm(Math.round(res.time))}</span></p>
                          `
      msgContainer.prepend(new_msg)
      if (!('mute' in res) && phone == !true) {
        vol_sound.cloneNode().play()
      }
      draw_msg(new_msg, res.ticker)
    } catch (e) { }
  }

  ws.onclose = () => {
    led.style.backgroundColor = 'rgba(173, 51, 51, 0.637)'
    setTimeout(() => { ws_oi() }, 1 * 60 * 1000);
  }
}

