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

// 屏蔽右键
document.oncontextmenu = function() {
  iziToast.show({
    timeout: 2000,
    icon: 'fa-solid fa-circle-exclamation',
    message: '为了浏览体验，已关闭右键'
  })
}

// 加载完成后执行
window.addEventListener('load', function() {
  // 载入动画
  $('#loading-box').attr('class', 'loaded');
  $('#bg').css('cssText', 'transform: scale(1); filter: blur(0px); transform: ease 1.5s;');
  $('.cover').css('cssText', 'opacity: 1; transform: ease 1.5s;');
  $('#section').css('cssText', 'transform: scale(1) !important; opacity: 1 !important; filter: blur(0px) !important;');

  // 用户欢迎
  setTimeout(function() {
    iziToast.show({
      timeout: 2500,
      icon: false,
      title: hello,
      message: '欢迎来到我的主页'
    })
  }, 800)

  //  //延迟加载音乐播放器
  //  let element = document.createElement("script");
  //  element.src = "./js/music.js";
  //  document.body.appendChild(element);

  //移动端去除鼠标样式
  if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
    $('#g-pointer-2').css("display", "none");
  }
}, false)

setTimeout(function () {
  $('#loading-text').html("字体及文件加载可能需要一定时间")
}, 3000);


// 监听网页宽度
window.addEventListener('load', function() {

})


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


