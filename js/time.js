now = new Date(), hour = now.getHours();

let hello = 'hello'

if (hour < 6) {
  hello = '凌晨好'
} else if (hour < 9) {
  hello = '早上好'
} else if (hour < 12) {
  hello = '上午好'
} else if (hour < 14) {
  hello = '中午好'
} else if (hour < 17) {
  hello = '下午好'
} else if (hour < 19) {
  hello = '傍晚好'
} else if (hour < 22) {
  hello = '晚上好'
} else {
  hello = '夜深了'
}

function init_life_time() {
  function getAsideLifeTime() {
    // 当前时间戳
    let nowDate = new Date();
    // 从今天开始时间
    let todayStartDate = new Date(new Date().toLocaleDateString()).getTime()
    // 今天已经过去的时间
    let todayPassHours = (nowDate - todayStartDate) / 1000 / 60 / 60
    // 今天已经过去的时间比
    let todayPassHoursPercent = (todayPassHours / 24) * 100

  }
}

init_life_time()