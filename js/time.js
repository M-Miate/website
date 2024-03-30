$(document).ready(function () {
  now = new Date(), hour = now.getHours();

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
})