
function remove_url(word) {
  word = word.replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/, '')
  return word.replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/, '')
}

function delete_ignoreword(_string) {
  ignoreword.forEach(_delete => {
    _string = _string.replace(_delete, '')
  })
  return _string
}

function check_important(_string) {
  imp_word = null
  _string = _string.toLowerCase()
  important_words.forEach(imp => {
    if (_string.includes(imp.toLowerCase())) {
      imp_word = imp
    }
  })
  return imp_word
}

function get_ticker(_string) {

  _ticker = _tem(_string)
  _string = delete_ignoreword(_string)

  if (!ticker_ignore.includes(_tem(_string))) {
    return _ticker
  } else { return '' }

  function _tem(_string) {
    try {
      try {
        return _string.match(/\$([A-Za-z]{2,})/)[1]
      } catch (e) {
        return _string.match(/\#([A-Za-z]{2,})/)[1]
      }
    } catch (e) {
      try {
        return _string.match(/([A-Z]{2,})/)[1]
      } catch (e) {
        return ""
      }
    }
  }
}

function get_words(_word) {

  _word = delete_ignoreword(_word)

  try {
    _wordmatch = _word.match(/([A-Za-z]{2,})/)[1]
  } catch (e) {
    return null
  }
  if (!stopwords.includes(_wordmatch)) {
    return _wordmatch
  } else {
    return null
  }
}

function check_ALLCAP(_string) {
  if (_string === _string.toUpperCase()) { return true }
  else { return false }
}


function block_msg(_string) {
  _find = ''
  blockwords.forEach(block => {
    if (_string.toLowerCase().includes(block.toLowerCase())) {
      _find = block
    }
  })
  return _find
}
