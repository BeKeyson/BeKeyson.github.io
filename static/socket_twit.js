
function ws_twit(phone = false) {
  const readContainer = document.querySelector('#read_container')
  const detector = document.querySelector('#up_detector')
  const ws = new WebSocket(`${home_ws}/twit`)
  const led = document.getElementById('led_twit')
  var alarm_sound = new Audio(`${home_url}/sound/liq_up.mp3`)
  var feed_sound = new Audio(`${home_url}/sound/bip.mp3`)
  alarm_sound.volume = 1
  feed_sound.volume = 1
  var detect_up = new Audio(`${home_url}/sound/tup.mp3`)
  var detect_dn = new Audio(`${home_url}/sound/tup.mp3`)
  detect_up.volume = 0.01
  detect_dn.volume = 0.01

  function make_new_msg(res) {

    // pre-filter
    if (!phone && main && (res.twit_type.includes('Airdrop') || res.twit_type.includes('Thread') || res.twit_type.includes('Alpha'))) { return "" }

    if (res.author.includes('elonmusk') && res.twit.includes('RT')) { return "" }
    if ((res.twit_type.includes('Thread') || res.twit_type.includes('Airdrop')) && (
      res.twit.includes('2/') || res.twit.includes('2)') || res.twit.includes('2:') || res.twit.includes('2.') || res.twit.includes('2\\')
      || res.twit.includes('3/') || res.twit.includes('3)') || res.twit.includes('3:') || res.twit.includes('3.') || res.twit.includes('3\\')
      || res.twit.includes('4/') || res.twit.includes('4)') || res.twit.includes('4:') || res.twit.includes('4.') || res.twit.includes('4\\')
      || res.twit.includes('5/') || res.twit.includes('5)') || res.twit.includes('5:') || res.twit.includes('5.') || res.twit.includes('5\\')
      || res.twit.includes('6/') || res.twit.includes('6)') || res.twit.includes('6:') || res.twit.includes('6.') || res.twit.includes('6\\')
      || res.twit.includes('7/') || res.twit.includes('7)') || res.twit.includes('7:') || res.twit.includes('7.') || res.twit.includes('7\\')
      || res.twit.includes('8/') || res.twit.includes('8)') || res.twit.includes('8:') || res.twit.includes('8.') || res.twit.includes('8\\')
      || res.twit.includes('9/') || res.twit.includes('9)') || res.twit.includes('9:') || res.twit.includes('9.') || res.twit.includes('9\\')
      || res.twit.includes('10/') || res.twit.includes('10)') || res.twit.includes('10:') || res.twit.includes('10.') || res.twit.includes('10\\')
      || res.twit.includes('11/') || res.twit.includes('11)') || res.twit.includes('11:') || res.twit.includes('11.') || res.twit.includes('11\\')
      || res.twit.includes('12/') || res.twit.includes('12)') || res.twit.includes('12:') || res.twit.includes('12.') || res.twit.includes('12\\')
      || res.twit.includes('13/') || res.twit.includes('13)') || res.twit.includes('13:') || res.twit.includes('13.') || res.twit.includes('13\\')
      || res.twit.includes('14/') || res.twit.includes('14)') || res.twit.includes('14:') || res.twit.includes('14.') || res.twit.includes('14\\')
      || res.twit.includes('15/') || res.twit.includes('15)') || res.twit.includes('15:') || res.twit.includes('15.') || res.twit.includes('15\\')
      || res.twit.includes('16/') || res.twit.includes('16)') || res.twit.includes('16:') || res.twit.includes('16.') || res.twit.includes('16\\')
      || res.twit.includes('17/') || res.twit.includes('17)') || res.twit.includes('17:') || res.twit.includes('17.') || res.twit.includes('17\\')
      || res.twit.includes('18/') || res.twit.includes('18)') || res.twit.includes('18:') || res.twit.includes('18.') || res.twit.includes('18\\')
      || res.twit.includes('19/') || res.twit.includes('19)') || res.twit.includes('19:') || res.twit.includes('19.') || res.twit.includes('19\\')
      || res.twit.includes('20/') || res.twit.includes('20)') || res.twit.includes('20:') || res.twit.includes('20.') || res.twit.includes('20\\')
      || res.twit.includes('21/') || res.twit.includes('21)') || res.twit.includes('21:') || res.twit.includes('21.') || res.twit.includes('21\\')
    )
    ) { return "" }

    const new_msg = document.createElement('div')
    new_msg.className = `ws_msg feed_msg twit_${res.twit_type}`
    new_msg.dataset.time = res.time * 1000
    new_msg.style.display = 'block'

    twit = remove_url(res.twit)
    twit_short = twit.split(' ').slice(0, 30).join(' ')
    twit = twit.replaceAll('\n', ' <br> <br>')
    ticker = get_ticker(twit)

    if (res.twit_type.includes('Alpha')) {
      if (!ticker && !res.attached_imgs[0]) {
        // if (res.twit.includes('RT ')) {
        return ""
        // }
      }
    }

    _name = res.name.length > 20 ? res.name.split(' ')[0] : res.name

    if ((res.twit_type.includes('Thread') || res.twit_type.includes('Airdrop')) && (res.twit.includes('🧵') || res.twit.includes('1/') || res.twit.includes('1)') || res.twit.includes('1:'))) {
      _thread = '<small><b class="ws_thread"> THREAD</b></small>'
    } else { _thread = "" }
    new_msg.innerHTML = `
                        <img class="profile_pic" src="${res.profile_img}"/>
                        <div>
                          <p> <b class="ws_ticker">${ticker}</b> ${_thread} <i><a href="${res.link}" target="_blank">${_name}</a></i>
                          <span>${get_hm(res.time)}</span></p>
                          <p>${twit}</p>
                        </div>
                        `
    if (res.attached_imgs.length > 0) { new_msg.innerHTML += `<img src="${res.attached_imgs[0]}"/>` }

    if (ticker) { draw_msg(new_msg, ticker) }

    if (!('mute' in res)) {

      if (res.twit_type.includes('Alert')) {
        if (main) { alarm_sound.cloneNode().play() }
      }

      else if (res.twit_type.includes('Alpha') || res.twit_type.includes('Thread')) {
        if (main) { feed_sound.cloneNode().play() }
      }
    }

    return new_msg
  }

  function make_detect_msg(res) {
    new_msg = document.createElement('div')
    if (('mute' in res)) { dim = 'dim' } else { dim = '' }
    new_msg.className = `ws_msg ${dim}`
    twit = res.twit.replace('🟢', '').replace('🔴', '')
    ticker = get_ticker(res.twit)

    if (res.twit.includes('🟢')) { new_msg.classList.add('_up') }
    else if (res.twit.includes('🔴')) { new_msg.classList.add('_dn') }

    new_msg.innerHTML = `
                          <p class="detect_title">
                            <abbr title="${res.name}"><img class="profile_pic" src="${res.profile_img}"/></abbr>${ticker}
                          </p>
                          <p><span>${get_hm(res.time)}</span></p>
                          <p class="detect_detail">${res.name}</p>
                        `

    draw_msg(new_msg, ticker)
    if (!('mute' in res)) {
      if (res.twit.includes('🟢')) { detect_up.cloneNode().play() }
      else if (res.twit.includes('🔴')) { detect_dn.cloneNode().play() }
      detector.removeChild(detector.lastChild)
    }

    return new_msg
  }

  ws.onopen = () => {
    ws.send('subscribe')
    led.style.backgroundColor = '#ABFF00'
  }

  ws.onmessage = res => {
    res = JSON.parse(res.data)

    if (!res.twit_type.includes('Detector')) {
      readContainer.append(make_new_msg(res))
    }

    if (!phone && main && res.twit_type.includes('Detector') && !res.twit.includes('3S') && !res.twit.includes('3L') && !res.twit.includes('UP') && !res.twit.includes('DOWN')) {
      if (res.twit.includes('🟢') || res.twit.includes('🔴')) {
        detector.prepend(make_detect_msg(res))
      }
    }
  }

  ws.onclose = () => {
    led.style.backgroundColor = 'rgba(173, 51, 51, 0.637)'
    setTimeout(() => { ws_twit() }, 1 * 60 * 1000);
  }
}
