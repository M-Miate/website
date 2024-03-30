$(document).ready(function () {
  /*
  author: Miate
*/

  // 背景图片 Cookies
  function setBgImg(bg_img) {
    if (bg_img) {
      Cookies.set('bg_img', bg_img, { expires: 36500 })
      return true
    }
    return false
  }

  let bg_img_preinstall = {
    "type": "1", // 1:默认背景
    "2": "https://api.infinitynewtab.com/v2/get_wallpaper_list?client=pc&source=InfinityLandscape", // Infinity精选风景壁纸
    "3": "https://api.infinitynewtab.com/v2/get_wallpaper_list?client=pc&source=Infinity",  // Infinity精选动漫壁纸
    "4": "https://api.infinitynewtab.com/v2/get_bing_wallpaper"  // 必应壁纸
  };

  // 获取背景图片
  function getBgImg() {
    let bg_img_local = Cookies.get('bg_img');
    if (bg_img_local && bg_img_local !== '{}') {
      return JSON.parse(bg_img_local)
    } else {
      setBgImg(bg_img_preinstall)
      return bg_img_preinstall
    }
  }

  // 接口
  function jqAjax(url, type) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: type,
        dataType: "json",
        success: function (data) {
          resolve(data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  // 更改背景图片
  function setBgImgInit() {
    let bg_img = getBgImg();
    $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

    switch (bg_img["type"]) {
      case "1":
        $('#bg').attr('src', `./img/background${1 + ~~(Math.random() * 10)}.webp`) //随机默认壁纸
        break;
      case "2":
        jqAjax(bg_img_preinstall[2], 'GET').then((res) => {
          if (res.code === 0 && res.message === 'success') {
            $('#bg').attr('src', res.data.list[Math.floor(Math.random() * res.data.list.length)].src.rawSrc); // Infinity精选风景壁纸
          }
        })
        break;
      case "3":
        jqAjax(bg_img_preinstall[3], 'GET').then((res) => {
          if (res.code === 0 && res.message === 'success') {
            $('#bg').attr('src', res.data.list[Math.floor(Math.random() * res.data.list.length)].src.rawSrc); // Infinity精选动漫壁纸
          }
        })
        break;
      case "4":
        jqAjax(bg_img_preinstall[4], 'GET').then((res) => {
          console.log(res);
          if (res.code === 0 && res.message === 'success') {
            $('#bg').attr('src', res.data.src.bigSrc); // 必应
          }
        })
        break;
    }
  };

  $(document).ready(function () {
    // 壁纸数据加载
    setBgImgInit();
    // 设置背景图片
    $("#wallpaper").on("click", ".set-wallpaper", function () {
      let type = $(this).val();
      let bg_img = getBgImg();
      bg_img["type"] = type;
      iziToast.show({
        icon: "fa-solid fa-image",
        timeout: 2500,
        message: '壁纸设置成功，刷新后生效',
      });
      setBgImg(bg_img);
    });
  });

})