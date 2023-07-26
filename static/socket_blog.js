function ws_blog(phone = false) {
  const msgContainer = document.querySelector('#read_container')
  const ws = new WebSocket(`${home_ws}/blog`)
  var feed_sound = new Audio(`${home_url}/sound/open.mp3`)
  feed_sound.volume = 1
  const led_blog = document.getElementById('led_blog')

  ws.onopen = () => {
    ws.send('subscribe')
    led_blog.style.backgroundColor = '#ABFF00'
  }

  function make_new_msg(res) {
    const new_msg = document.createElement('div')
    new_msg.className = `ws_msg feed_msg blog`
    new_msg.dataset.time = res.time * 1000
    new_msg.style.display = 'block'
    if (('mute' in res)) { new_msg.style.display = 'none' }

    content = remove_url(res.content)
    content = content.replaceAll('\n', ' <br> <br>')
    ticker = get_ticker(content)

    new_msg.innerHTML = `
                        <img class="profile_pic" src="${home_url}/img/blog.png"/>
                        <div>
                          <p><b class="ws_ticker">${ticker}</b> <i><a href="${res.link}" target="_blank">${res.author}</a></i>
                          <span>${get_hm(res.time)}</span></p>
                          <p><a href="${res.link}" target="_blank"><b>${res.title}</b></a></p>
                          <p>${res.summary}</p>
                        </div>
                        `

    if (ticker) { draw_msg(new_msg, ticker) }
    if (!('mute' in res)) { feed_sound.cloneNode().play() }
    return new_msg
  }

  ws.onmessage = res => {
    res = JSON.parse(res.data)
    msgContainer.append(make_new_msg(res))
  }

  ws.onclose = () => {
    led_blog.style.backgroundColor = 'rgba(173, 51, 51, 0.637)'
    setTimeout(() => { ws_blog() }, 1 * 60 * 1000);
  }
}
