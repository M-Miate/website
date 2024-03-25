/*
  author: Miate
*/

// 弹窗样式
iziToast.settings({
  timeout: 10000,
  // 剩余时间条
  progressBar: false,
  // 关闭按钮
  close: false,
  closeOnEscape: true,
  position: 'topCenter',
  transitionIn: 'bounceInDown',
  transitionOut: 'flipOutX',
  displayMode: 'replace',
  layout: '1',
  backgroundColor: '#00000040',
  titleColor: '#efefef',
  messageColor: '#efefef',
  icon: 'Fontawesome',
  iconColor: '#efefef',
})

// 鼠标样式
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
  element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${y - halfAlementWidth2 + 1}px)`;
}

body.addEventListener('mousemove', (e) => {
  window.requestAnimationFrame(function () {
      setPosition(e.clientX, e.clientY);
  });
});


// 加载完成后执行
window.addEventListener('load', () => {
  // 载入动画
  $('#loading-box').attr('class', 'loaded');
  $('#bg').css('cssText', 'transform: scale(1); filter: blur(0px); transform: ease 1.5s;');
  $('.cover').css('cssText', 'opacity: 1; transform: ease 1.5s;');
  $('#section').css('cssText', 'transform: scale(1) !important; opacity: 1 !important; filter: blur(0px) !important;');

  // 用户欢迎
  setTimeout(() => {
    iziToast.show({
      timeout: 2500,
      icon: false,
      title: hello,
      message: '欢迎来到我的主页'
    })
  }, 800)

  //  //延迟加载音乐播放器
   let element = document.createElement("script");
   element.src = "./js/music.js";
   document.body.appendChild(element);

  //移动端去除鼠标样式
  if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
    $('#g-pointer-2').css("display", "none");
  }
}, false)

setTimeout(() => {
  $('#loading-text').html("字体及文件加载可能需要一定时间")
}, 3000);

/* 一言与音乐切换 */
$('#open-music').on('click', (event) => {
  event.stopPropagation();
  $('#hitokoto').css("display", "none");
  $('#music').css("display", "flex");
});

// 获取一言
function getHitokoto() {
  fetch('https://v1.hitokoto.cn?max_length=24').then(res => res.json()).then(data => {
    $('#hitokoto-text').html(data.hitokoto)
    $('#from-text').html(data.from)
  }).catch(console.error);
}
getHitokoto()

// 点击刷新一言
let times = 0;  // 阈
$('#hitokoto').click(() => {
  if (times == 0) {
    times = 1;
    let index = setInterval(() => {
      times--;
      if (times == 0) {
        clearInterval(index);
      }
    }, 1000)
    getHitokoto()
  } else {
    iziToast.show({
      timeout: 1000,
      icon: "fa-solid fa-circle-exclamation",
      message: '你点太快了'
    });
  }
})

// 获取天气
//请前往 https://www.mxnzp.com/doc/list 申请 app_id 和 app_secret
const app_id = 'ljlmkiljpmorvlpw'  // app_id
const app_secret = 'QQKvq62WmFuPOa4NeYRJ3Joj88u3mERx'  // app_secret
const key = ''  // key

function getWeather() {
  fetch(`https://www.mxnzp.com/api/ip/self?app_id=${app_id}&app_secret=${app_secret}`).then(res => res.json()).then(data => {
    let city = data.data.city
    setTimeout(() => {
      fetch(`https://www.mxnzp.com/api/weather/current/${city}?app_id=${app_id}&app_secret=${app_secret}`).then(res => res.json()).then(data => {
      if (data.code == 1) {
        let weather = data.data
        $('#wea_text').html(weather.weather)
        $('#tem_text').html(weather.temp + "&nbsp;")
        $('#win_text').html(weather.windDirection)
        $('#win_speed').html(weather.windPower)
      } else {
        $('#wea_text').html('加载失败')
        $('#tem_text').html("&nbsp;")
        $('#win_text').html('次数')
        $('#win_speed').html('超限')
      }
      }).catch(console.error)
    }, 1000)
  }).catch(console.error);
}
getWeather();

// 手动更新天气
let wea = 0
$('#upWeather').click(() => {
  if (wea == 0) {
    wea = 1;
    let index = setInterval(() => {
      wea--;
      if (wea == 0) {
        clearInterval(index);
      }
    }, 60000)
    getWeather()
    iziToast.show({
      timeout: 2000,
      icon: 'fa-solid fa-cloud-sun',
      message: '实时天气已更新'
    })
  } else {
    iziToast.show({
      timeout: 1000,
      icon: "fa-solid fa-circle-exclamation",
      message: '请稍后再更新哦'
    });
  }
})

// 获取时间
let t = null
t = setTimeout(time, 1000)

function time() {
  clearTimeout(t)
  dt = new Date()
  let y = dt.getYear() + 1900
  let mm = dt.getMonth() + 1
  let d = dt.getDate()
  let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let day = dt.getDay()
  let h = dt.getHours()
  let m = dt.getMinutes()
  let s = dt.getSeconds()

  if (h < 10) {
    h = '0' + h
  }
  if (m < 10) {
    m = '0' + m
  }
  if (s < 10) {
    s = '0' + s
  }
  $('#time').html(`${y}&nbsp;年&nbsp;${mm}&nbsp;月&nbsp;${d}&nbsp;日&nbsp;<span class='weekday'>${weekday[day]}</span><br><span class='time-text'>${h}:${m}:${s}</span>`)
  t = setTimeout(time, 1000)
}




// 新春灯笼 （ 需要时可取消注释 ）
// new_element=document.createElement("link");
// new_element.setAttribute("rel","stylesheet");
// new_element.setAttribute("type","text/css");
// new_element.setAttribute("href","./css/lantern.css");
// document.body.appendChild(new_element);

// new_element=document.createElement("script");
// new_element.setAttribute("type","text/javascript");
// new_element.setAttribute("src","./js/lantern.js");
// document.body.appendChild(new_element);

//控制台输出
//console.clear();
let styleTitle = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
let styleContent = `
color: rgb(30,152,255);
`
let title = 'Miateの主页'
let content = `
Github:  https://github.com/M-Miate
`
console.log(`%c${title} %c${content}`, styleTitle, styleContent)


