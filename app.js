const request = require('superagent');
const init = async () => {
  const res = await request.get('https://kyfw.12306.cn/otn/leftTicket/queryZ?leftTicketDTO.train_date=2019-02-03&leftTicketDTO.from_station=NJH&leftTicketDTO.to_station=XCH&purpose_codes=ADULT');
  // 无座 26
  // 硬座 29
  // 车次 3
  /*
  res.body.data.result[1].split('|').forEach((item, index) => {
    if(item == 'K282') {
      console.log(index)
    }
  })
  */
  let allCar = ''
  res.body.data.result.forEach(item => {
    const rest = item.split('|')[29];
    if ((typeof (Number(rest)) === 'number' && rest !== '' && rest !== '无') || rest == '有') {
      allCar += ' ' + item.split('|')[3];
      // console.log(`车次${item.split('|')[3]} 硬座有票`)
    }
  });
  if (allCar) {
    console.log(allCar + '硬座有票')
    // TODO:发送短信
    request
      .post('http://47.99.89.167:8762/api-member/member/sms/sendMess')
      .send({ mobile: "15720820336", smsType: "2", smsCode: "1" })
      .set('Accept', 'application/json')
      .then(res => {
        // console.log(res)
      })
      .catch(err => {
        // err.message, err.response
      });
  } else {
    console.log(new Date().toLocaleString())
    console.log('暂时无票')
  }
};
init();
setInterval(() => {
  init();
}, 1000 * 30)