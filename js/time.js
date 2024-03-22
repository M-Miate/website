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

  }
}

init_life_time()