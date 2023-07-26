
function ws_madnews() {
  const readContainer = document.querySelector('#read_container')
  const ws = new WebSocket('wss://news.treeofalpha.com/ws')
  const led = document.getElementById('led_madnews')
  var alarm_sound = new Audio(`${home_url}/sound/liq_dn.mp3`)

  function make_new_msg(res) {

    if (res.title && (!res.title.includes('吴说区块链')
      && !res.title.includes('Elon')
      && !res.title.includes('trondao')
      && !res.title.includes('WOO')
      && !block_msg(res.title)
    )) {
      return _new()
    }
    return ''

    function _new() {

      // 내용
      try {
        try { text = res.body.trim().replace(/[()]/g, '') }
        catch (e) { text = res.en.trim().replace(/[()]/g, '').split(': ')[1] }
      } catch (e) {
        try { text = res.en.trim().replace(/[()]/g, '') }
        catch (e) { text = res.title.split(': ')[1] }
      }
      text = text.replaceAll('\n', ' <br>')

      // 내용강조
      important_word = check_important(text)
      if (important_word !== null) { ws_strong = 'ws_strong' }
      else { ws_strong = '' }

      //
      const new_msg = document.createElement('div')
      new_msg.className = `ws_msg feed_msg madnews ${ws_strong}`
      new_msg.style.display = 'block'
      new_msg.innerHTML = ``

      // 제목
      try { title = res.title.trim().replace(/[()]/g, '').split(': ')[0] }
      catch (e) { title = res.title.trim().replace(/[()]/g, '') }

      // 티커
      if (res.coin) { ticker = res.coin }
      else if (res.symbols && res.symbols.length) { ticker = res.symbols[0].split('_')[0] }
      else if (res.actions && res.actions.length) { ticker = res.actions[0].title.split('/')[0] }
      else if (res.suggestions && res.suggestions.length) { ticker = res.suggestions[0].coin }
      else { try { ticker = get_ticker(res.title) } catch { ticker = '' } }
      ticker = ticker.replace('USDT PERP', '')

      // 링크
      try { link = res.link }
      catch (e) { link = res.url }

      // 프로필
      if (res.icon) { new_msg.innerHTML += `<img class="profile_pic" src="${res.icon}"/>` } // 프로필사진
      else {
        if (res.source == 'Terminal') { new_msg.innerHTML += `<img class="profile_pic" src="${home_url}/img/terminal.png"/>` }
        if (res.source == 'Blogs') { new_msg.innerHTML += `<img class="profile_pic" src="${home_url}/img/blog.png"/>` }
      }

      new_msg.innerHTML += `<div>
                              <p><b class="ws_ticker">${ticker}</b> <i><a href="${link}" target="_blank">${title}</a></i> <span>${get_hm(res.time)}</span></p>
                              <p class="${ws_strong}">${text}</p>
                            </div>`
      if (res.image) { new_msg.innerHTML += `<img src="${res.image}"/>` }

      if (ticker) { draw_msg(new_msg, ticker) }
      if (main) { alarm_sound.cloneNode().play() }

      // to_both_console(`🗞️ <i class='ticker ws_ticker'>${ticker}</i> ${title} </br> ${text.replaceAll('<br>', '').replaceAll('/n', '')}<br><br>`)

      return new_msg
    }
  }

  ws.onopen = res => {
    ws.send('login cd94ad05d3f5895c12174118e5f70c8efbcc37184d4f8ba3f0893d6615a65b8b')
    to_console('Connected to Maddnews.io')
    led.style.backgroundColor = '#ABFF00'
  }

  ws.onmessage = res => {
    res = JSON.parse(res.data)

    _new_msg = make_new_msg(res)
    if (_new_msg) {
      readContainer.append(_new_msg)
    }
  }

  ws.onclose = () => {
    led.style.backgroundColor = 'rgba(173, 51, 51, 0.637)'
    try {
      setTimeout(() => { ws_madnews() }, 1 * 60 * 1000);
    } catch (e) {
      alert("Couldn't Connect to Treenews");
    }
  }
}
