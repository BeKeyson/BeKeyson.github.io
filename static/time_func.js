

















function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

econ_event = []; econ_string = ''; fastest_event_time = 0;
fetch(`${home_url}/econ_event`).then((r) => r.json()).then(res => {
  for (const event of res) {
    if (event.timestamp > (Date.now() / 1000)) {
      if (event.title.includes('Fed')
        || event.title.includes('Jobless')
        || event.title.includes('CPI')
        || event.title.includes('PMI')
        || event.title.includes('Speech')
        || event.title.includes('Employment')
        || event.title.includes('Unemployment')
        || event.title.includes('Payrolls')
        || event.title.includes('Inflation')
        || event.title.includes('Interest')
        || event.title.includes('FOMC')) {
        econ_event.push(event)
        econ_string += event.title + " - " + get_d_hm(event.timestamp) + `<br>`
      }
    }
  }
  for (const event of res) {
    if (event.timestamp > (Date.now() / 1000)) {
      fastest_event_time = event.timestamp
      break
    }
  }
}).then(() => {
  document.getElementById("today_event").innerHTML = `${econ_string}`
})


clock_tik = new Audio(`${home_url}/sound/liq_dn.mp3`)

function clock() {
  var d = new Date();
  days = ["일", "월", "화", "수", "목", "금", "토"];
  now_stp = Date.now() / 1000
  econ_today = ''; econ_hour = ''; econ_minute = '';


  if (fastest_event_time !== 0) {
    try {
      if (fastest_event_time - now_stp < 24 * 60 * 60) {
        econ_today = 'econ_today'
        if (fastest_event_time - now_stp < 4 * 60 * 60) {
          econ_hour += 'econ_hour'
          if (fastest_event_time - now_stp < 1 * 60 * 60) {
            econ_hour += 'econ_imidiate'
            if (fastest_event_time - now_stp < 15 * 60) {
              econ_minute += 'econ_minute'
              if (fastest_event_time - now_stp < 1 * 60) {
                econ_minute += 'econ_imidiate'
              }
            }
          }
        }
      }
    } catch (e) { }
  }

  _hour = d.getHours()
  _min = d.getMinutes()


  col_session =
    _hour == 8 ? 'col_pre_asia' :
      _hour >= 9 && _hour <= 14 ? 'col_sess_asia' :
        _hour == 15 ? 'col_pre_london' :
          _hour >= 16 && _hour <= 21 ? 'col_sess_london' :
            (_hour == 22) || (_hour == 23 && _min < 30) ? 'col_pre_ny' :
              (_hour >= 23 && _min > 30) && _hour <= 4 ? 'col_sess_ny' :
                _hour >= 5 && _hour <= 8 ? 'col_pre_open' : ''


  _d = `<span id='today_date' class='${econ_today}'>${(d.getDate() < 10 ? '0' : '') + d.getDate()}</span>`
  _h = `<span class='${econ_hour} ${col_session}'>${(_hour < 10 ? '0' : '') + _hour}</span>`
  _m = `<span class='${econ_minute}'>${(_min < 10 ? '0' : '') + _min}</span>`


  currentDate = _d + " " + days[d.getDay()] + "<br>"
  currentTime = _h + ":" + _m + ":" + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  document.getElementById("time_content").innerHTML = currentDate + currentTime;
  setTimeout(clock, 1000);
}


function timestamp_to_date(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '-' + month + '-' + date + '  ' + hour + ':' + min + ':' + sec;
  return time;
}

function get_monday_timestamp(d) {
  d = new Date(d)
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1)
  mon = new Date(d.setDate(diff))

  mon.setHours(09)
  mon.setMinutes(00)
  mon.setSeconds(00)
  mon.setMilliseconds(000)

  return mon.getTime()
}

function get_monday_levels(ticker) {
  test_Date = "19-02-2023".split("-")
  test_mon = new Date(test_Date[2], test_Date[1] - 1, test_Date[0])
  _monday = get_monday_timestamp(test_mon)
  console.log(timestamp_to_date(_monday))

  monday = get_monday_timestamp(new Date())
  fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${ticker}USDT&interval=1d&startTime=${_monday}&limit=1`)
    .then((r) => r.json())
    .then((res) => {
      w_open = res[0][1]
      mon_high = res[0][2]
      mon_low = res[0][3]
    })
}

function get_times_ago(unixtime) {
  setTimeout(() => {
    var cur_d = new Date()
    var seconds = Math.floor(cur_d.getTime() / 1000) - Math.floor(unixtime / 1000);
    if (seconds > 3600) { return "a few hours ago" }
    if (seconds > 1800) { return "Half an hour ago" }
    if (seconds > 60) { return Math.floor(seconds / 60) + " minutes ago" }
  }, 1 * 1000);
}

function get_md_hm(unixtime) {

  unix = unixtime.toString()
  numDigit = unix.length
  if (numDigit < 12) {
    unixtime = unixtime * 1000
  }
  // var pub_d = new Date(unixtime + (9 * 60 * 60 * 1000))
  var pub_d = new Date(unixtime)

  var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var month = months[pub_d.getMonth()];
  var date = pub_d.getDate();

  return `${month}-${pub_d.getDate() < 10 ? '0' : ''}${pub_d.getDate()} ` + (pub_d.getHours() < 10 ? '0' : '') + pub_d.getHours() + ":" + (pub_d.getMinutes() < 10 ? '0' : '') + pub_d.getMinutes()
}
function get_d_hm(unixtime) {

  unix = unixtime.toString()
  numDigit = unix.length
  if (numDigit < 12) {
    unixtime = unixtime * 1000
  }
  var pub_d = new Date(unixtime)

  return `${pub_d.getDate() < 10 ? '0' : ''}${pub_d.getDate()}<small>일</small> ` + (pub_d.getHours() < 10 ? '0' : '') + pub_d.getHours() + ":" + (pub_d.getMinutes() < 10 ? '0' : '') + pub_d.getMinutes()
}

function get_hm(unixtime) {

  unix = unixtime.toString()
  numDigit = unix.length
  if (numDigit < 12) {
    unixtime = unixtime * 1000
  }
  var pub_d = new Date(unixtime)

  return (pub_d.getHours() < 10 ? '0' : '') + pub_d.getHours() + ":" + (pub_d.getMinutes() < 10 ? '0' : '') + pub_d.getMinutes()
}

function get_hms(unixtime) {
  unix = unixtime.toString()
  numDigit = unix.length
  if (numDigit < 12) {
    unixtime = unixtime * 1000
  }

  var pub_d = new Date(unixtime)
  return (pub_d.getHours() < 10 ? '0' : '') + pub_d.getHours() + ":" + (pub_d.getMinutes() < 10 ? '0' : '') + pub_d.getMinutes() + ":" + (pub_d.getSeconds() < 10 ? '0' : '') + pub_d.getSeconds()
}

function get_mmdd(date_get = 'today') {
  date = new Date()
  if (date_get === 'today') {
    return `${(date.getMonth() < 10 ? '0' : '')}${(date.getMonth() + 1)}${(date.getDate() < 10 ? '0' : '')}${date.getDate()}`
  } else if (date_get === 'yesterday') {
    date.setDate(date.getDate() - 1)
    return `${(date.getMonth() < 10 ? '0' : '')}${(date.getMonth() + 1)}${(date.getDate() < 10 ? '0' : '')}${date.getDate()}`
  } else {
    date.setDate(date.getDate() - date_get)
    return `${(date.getMonth() < 10 ? '0' : '')}${(date.getMonth() + 1)}${(date.getDate() < 10 ? '0' : '')}${date.getDate()}`
  }
}

function get_epoch_00() {
  var today = new Date()
  if (today.getHours() < 9) {
    today.setDate(today.getDate() - 1)
  }
  today.setHours(09)
  today.setMinutes(00)
  today.setSeconds(00)
  today.setMilliseconds(000)
  return today.getTime()
}

function get_yesterday_epoch() {
  var today = new Date()
  if (today.getHours() < 9) {
    today.setDate(today.getDate() - 2)
  } else {
    today.setDate(today.getDate() - 1)
  }
  today.setHours(09)
  today.setMinutes(00)
  today.setSeconds(00)
  today.setMilliseconds(000)
  return today.getTime()
}

function convert_kil_mil_bil(labelValue) {

  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + "b"

    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + "m"

      : Math.abs(Number(labelValue)) >= 1.0e+2
        ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + "k"

        : Math.abs(Number(labelValue));
}

function convert_liq(labelValue) {

  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + "b"

    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + "m"

      : Math.abs(Number(labelValue)) >= 1.0e+1
        ? ((Math.abs(Number(labelValue)) / 1.0e+3) * 10).toFixed(0) + ""

        : Math.abs(Number(labelValue));
}

function convert_kil_mil_bil_trim(labelValue) {

  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + "b"

    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + "m"

      : Math.abs(Number(labelValue)) >= 1.0e+2
        ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(0) + "k"

        : Math.abs(Number(labelValue));
}

function convert_mil_to_bil(labelValue) {

  return Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + "b"

    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + "t"

      : Math.abs(Number(labelValue)).toFixed(0) + "m";
}
