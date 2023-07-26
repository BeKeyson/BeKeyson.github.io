function get_liq_ticker(word) {
  return word.match(/(\b[A-Z10][A-Z]+|\b[A-Z]\b)/g)[0]
}
function get_shit_ticker(post) {
  ticker = post.split(' Buy!')[0].split('\n\n[')[1]
  if (ticker.includes('](')) {
    ticker = ticker.replace('](', '')
  }
  return ticker
}

function ws_tele(phone = false) {
  const readContainer = document.querySelector('#read_container')
  const liqfeed = document.querySelector('#up_liqfeed')
  const shitfeed = document.querySelector('#up_shitfeed')
  const ws = new WebSocket(`${home_ws}/tele`)
  const led_tele = document.getElementById('led_tele')

  var alarm_sound = new Audio(`${home_url}/sound/poing.mp3`)
  alarm_sound.volume = 1
  var liq_sound = new Audio(`${home_url}/sound/clack.mp3`)

  function make_new_msg(res) {

    // pre-filter
    _ty = res.channel_type
    if (!phone && main && (!_ty.includes('NEWS') && !_ty.includes('LIQS') && !_ty.includes('ALERT'))) { return "" }
    else if (!phone && !main && _ty.includes('LIQS')) { return "" }

    // 채널
    channel = res.channel
    profile_pic = 'telegram'
    channel_display = ''

    // 내용
    _post = remove_url(res.post)
    post_short = _post.replaceAll('\n', '').split(' ').slice(0, 30).join(' ')
    _post = _post.replaceAll('\n', ' <br> <br>')

    // 내용강조
    important_word = check_important(_post)
    if (important_word !== null) {
      ws_strong = 'ws_strong'
    }
    else { ws_strong = '' }

    //
    new_msg = document.createElement('div')
    new_msg.className = `ws_msg feed_msg tele_${res.channel_type} ${ws_strong} ${res.channel.split(' ')[0]}`
    new_msg.dataset.time = res.time * 1000
    new_msg.style.display = 'block'
    if (('mute' in res)) { new_msg.style.display = 'none' }

    if (channel.includes('코인코')) {
      profile_pic = 'coinko'
      _post = _post.split(' <br> <br>')
      channel = _post[0].replaceAll('#', '').replace('공지', '')
      _post = _post[1].replaceAll('](', '')
    }
    if (channel.includes('새우')) {
      profile_pic = 'shrimp'
      channel = ''
      if (_post.includes(' 공지 - ')) {
        _post = _post.split(' <br> <br>')[0].split('-')
        channel = _post[0].replaceAll('#', '').replace('공지', '')
        _post = _post[1].replaceAll('](', '')
      }
    }
    if (channel.includes('Whale') || channel.includes('whale')) {
      profile_pic = 'whale'
      channel = ''
      channel_display = 'display="none"'
      _post = _post.split('<br>')[0].replaceAll('```', '').replaceAll('#', '')
        .replaceAll('💵', '').replaceAll('🔥', '').replaceAll('🚨', '')

      ticker = get_ticker(_post)

      if (res.img !== null || ticker == 'XBTUSD') { return "" }

      if (ticker.includes('USD')) { channel += 'Fiat ' }
      else { channel += 'Crypto ' }

      if (_post.includes('minted')) { channel = '💵' }
      else if (_post.includes('burned')) { channel = '🔥' }
      else if (_post.includes('from Unknown to Unknown') || _post.includes('unknown wallet to unknown')) { channel = '🤔' }
      else if (_post.includes('from Unknown') || _post.includes('from unknown')) { channel += 'IN' }
      else if (_post.includes('to Unknown') || _post.includes('to unknown')) { channel += 'OUT' }
      else { channel = '⇆' }

      if ((channel == 'Crypto IN') && ticker !== 'XRP') { channel += ' 🚨' }
      if (channel == 'Fiat IN') { channel += ' ☝' }

      _post = _post.replaceAll('unknown wallet', '?').replaceAll('Unknown', '?').replaceAll('unknown', '?')
        .replaceAll('USDC Treasury', 'TREASURY')
        .replaceAll('Usdc Treasury', 'TREASURY')
        .replaceAll(' transfered from ', '<br>')
        .replaceAll(' transferred from ', '<br>')
        .replaceAll(' burned from ', '<br>')
        .replaceAll(' minted from ', '<br>')
        .replaceAll(' to ', ' ➤ ')
    }

    ticker = get_ticker(_post)

    if (channel.includes('Ghozt')) {
      ticker = ticker.replace('USDT', '')
      channel_display = 'display="none"'
      channel = 'P&D'
      _post = _post.split(' <br> <br>')[0].replace(' on Binance!', '').replace(` ${ticker}USDT is`, '')
    }

    if (_ty.includes('TRADER')) { if (!ticker && !res.img[0]) { return "" } }

    if (phone) { link_ = res.link_phone } else { link_ = res.link }

    new_msg.innerHTML = `
                        <img class="profile_pic profile_pic_tele" src="${home_url}/img/${profile_pic}.png">
                        <div>
                        <p><b class="ws_ticker">${ticker}</b> <i ${channel_display}><a href="${link_}" target="_blank">${channel}</a></i>
                        <span>${get_hm(res.time)}</span></p>
                        </div>
                        `

    if (_post != null) { new_msg.innerHTML += `<p class="${ws_strong}">${_post}</p>` }
    if (res.transed !== '' && res.transed !== undefined) { new_msg.innerHTML += `<p class="">${res.transed}</p>` }
    if (res.img != null) { new_msg.innerHTML += `<img src="${res.img}"/>` }

    if (ticker) { draw_msg(new_msg, ticker) }
    if (!('mute' in res)) {
      if (main) { alarm_sound.cloneNode().play() }
      if (res.channel_type.includes('NEWS')) { to_both_console(`🗞️ <i class='ticker ws_ticker'>${ticker}</i> ${channel} <br> ${post_short}<br><br>`) }
    }

    return new_msg
  }

  function make_liq_msg(res, count = 0) {
    const new_msg = document.createElement('div')
    if (('mute' in res)) { dim = 'dim' } else { dim = '' }
    new_msg.className = `ws_msg ${dim}`
    if (res.post.includes('🟢')) { new_msg.classList.add('_up') }
    else if (res.post.includes('🔴')) { new_msg.classList.add('_dn') }

    ticker = res.post.replace('1000SHIB', 'SHIB').replace('🟢', '').replace('🔴', '').replace('🐬', '').replace('🐳', '').replaceAll(' ', '')


    if (count === 0) {
      new_msg.innerHTML += `<p class='ticker_liq'>${ticker}</p>
                            <p><span>${get_hm(res.time)}</span></p>
                            `
    } else {
      new_msg.innerHTML += `<p class='ticker_liq'>${ticker}(${parseInt(count) + 1})</p>
                            <p><span>${get_hm(res.time)}</span></p>
                            `
    }

    if (!('mute' in res)) {
      liq_sound.cloneNode().play()
    }

    draw_msg(new_msg, ticker)
    return new_msg
  }

  function make_shit_msg(res, count = 0) {
    const new_msg = document.createElement('div')
    if (('mute' in res)) { dim = 'dim' } else { dim = '' }
    new_msg.className = `ws_msg ${dim} _st`
    ticker = get_shit_ticker(res.post)

    if (count === 0) {
      new_msg.innerHTML += `<a href="${res.dex}" target="_blank"><p class='ticker_liq'>${ticker}</p></a>
      `
    } else {
      new_msg.innerHTML += `<a href="${res.dex}" target="_blank"><p class='ticker_liq'>${ticker}(${parseInt(count) + 1})</p></a>
      `
    }

    return new_msg
  }


  ws.onopen = () => {
    ws.send('subscribe')
    led_tele.style.backgroundColor = '#ABFF00'

    // for (let i = 0; i < 50; i++) {
    //   const new_msg = document.createElement('div')
    //   shitfeed.prepend(new_msg)
    // }
  }

  ws.onmessage = res => {
    res = JSON.parse(res.data)

    if (!res.channel_type.includes('LIQS') && !res.channel_type.includes('SHIT')) {
      readContainer.append(make_new_msg(res))
    }

    // else if (!phone && main && (res.channel_type.includes('SHIT'))) {

    //   if (shitfeed.firstChild && shitfeed.firstChild.innerText.includes(get_shit_ticker(res.post))) {

    //     var regExp = /\(([^)]+)\)/;
    //     _count_shit = regExp.exec(shitfeed.firstChild.innerText)

    //     if (_count_shit == null) {
    //       shitfeed.removeChild(shitfeed.firstChild)
    //       shitfeed.prepend(make_shit_msg(res, count = 1))
    //     } else {
    //       shitfeed.removeChild(shitfeed.firstChild)
    //       shitfeed.prepend(make_shit_msg(res, count = _count_shit[1]))
    //     }
    //   } else {
    //     shitfeed.prepend(make_shit_msg(res))
    //     if (!('mute' in res)) { shitfeed.removeChild(shitfeed.lastChild) }
    //   }
    // }

    // else if (!phone && main && (res.channel_type.includes('LIQS'))) {
    //   if (res.post.includes('🟢') || res.post.includes('🔴')) {

    //     if (liqfeed.firstChild && (get_liq_ticker(liqfeed.firstChild.innerHTML) == get_liq_ticker(res.post))) {
    //       var regExp = /\(([^)]+)\)/;
    //       _count = regExp.exec(liqfeed.firstChild.innerHTML)

    //       if (_count == null) {
    //         liqfeed.removeChild(liqfeed.firstChild)
    //         liqfeed.prepend(make_liq_msg(res, count = 1))
    //       } else {
    //         liqfeed.removeChild(liqfeed.firstChild)
    //         liqfeed.prepend(make_liq_msg(res, count = _count[1]))
    //       }
    //     } else {
    //       liqfeed.prepend(make_liq_msg(res))
    //       if (!('mute' in res)) { liqfeed.removeChild(liqfeed.lastChild) }
    //     }
    //   }
    // }
  }

  ws.onclose = () => {
    led_tele.style.backgroundColor = 'rgba(173, 51, 51, 0.637)'
    setTimeout(() => { ws_tele() }, 1 * 60 * 1000);
  }
}


