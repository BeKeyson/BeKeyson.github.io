
channel_id = {
  'taino_maker': '928175590505340929',
  'taino_iv': '740225181133570070',
  'taino_oi': '804641398925557760',
  'taino_curve': '771214422453911573'
}

disco_key = 'NDk2NjE2MzQ3NTE4NzYzMDE5.GDARYL.YH6DZphvTJ7PZevxQVkWD2uiKWN6ef19cesZwU'

taino_dict = {}

fetch(`https://discord.com/api/v9/channels/928175590505340929/messages?limit=1`, { headers: { 'authorization': disco_key } })
  .then((r) => r.json()).then(res => { taino_dict['taino_maker'] = res[0]['embeds'][0]['image']['url'] })
fetch(`https://discord.com/api/v9/channels/740225181133570070/messages?limit=1`, { headers: { 'authorization': disco_key } })
  .then((r) => r.json()).then(res => { taino_dict['taino_iv'] = res[0]['embeds'][0]['image']['url'] })
fetch(`https://discord.com/api/v9/channels/804641398925557760/messages?limit=1`, { headers: { 'authorization': disco_key } })
  .then((r) => r.json()).then(res => { taino_dict['taino_oi'] = res[0]['embeds'][0]['image']['url'] })
fetch(`https://discord.com/api/v9/channels/771214422453911573/messages?limit=1`, { headers: { 'authorization': disco_key } })
  .then((r) => r.json()).then(res => { taino_dict['taino_curve'] = res[0]['embeds'][0]['image']['url'] })