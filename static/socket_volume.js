
function ws_volume() {
  const msgContainer = document.querySelector('#volume_container')
  const ws = new WebSocket(`${home_ws}/volume`)
  const led = document.getElementById('led_volume')
  var vol_sound = new Audio(`${home_url}/sound/up.mp3`)
  vol_sound.volume = 0.2

  ws.onopen = () => {
    ws.send('subscribe')
    led.style.backgroundColor = '#ABFF00'
  }

  // vol_mul // move_per // volume

  ws.onmessage = res => {
    res = JSON.parse(res.data)
    try {
      delta = Round(res.move_per, 1)
      if (delta >= 2) {
        vol_strong = 'vol_delta_2'
      } else if (delta >= 1) {
        vol_strong = 'vol_delta_1'
      } else {
        vol_strong = 'vol_normal'
      }

      const new_msg = document.createElement('div')
      if (('mute' in res)) { dim = 'dim' } else { dim = '' }
      new_msg.className = `ws_msg vol_msg ${dim}`
      new_msg.innerHTML = `
                          <p class="${vol_strong}"> ${res.ticker}
                          </p>
                          <small>${delta}</small>
                          <p> <span>${get_hm(res.time)}</span></p>
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
    setTimeout(() => { ws_volume() }, 1 * 60 * 1000);
  }
}

