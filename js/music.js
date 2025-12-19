/*
  音乐信息

  感谢 @武恩赐 提供的 MetingAPI
  https://api.wuenci.com/meting/api/

  author: Miate
*/

$(document).ready(async function () {
  let Config = null;

  try {
    // 使用安全配置加载器
    const loader = new SecureConfigLoader();
    Config = await loader.loadConfig('./config/setting.json');
  } catch (error) {
    // 降级到 sessionStorage 读取
    const localConfig = sessionStorage.getItem('config');
    if (localConfig) {
      Config = JSON.parse(localConfig);
    } else {
      console.error('music.js 配置加载失败');
      return;
    }
  }

  // 检查音乐配置
  if (!Config || !Config.music) {
    console.error('音乐配置缺失');
    return;
  }

  let server = Config.music.musicServer;  // netease: 网易云音乐; tencent: QQ音乐; kugou: 酷狗音乐; xiami: 虾米; kuwo: 酷我
  let type = Config.music.musicType;  // song: 单曲; playlist: 歌单; album: 唱片
  let id = Config.music.musicPlaylist;  // 封面 ID / 单曲 ID / 歌单 ID

  console.log(`音乐播放器配置: server=${server}, type=${type}, id=${id}`);

  /* 打开音乐列表 */
  $('#music-open').on('click', () => {
    if ($(document).width() >= 990) {
      $('#box-music').css("display", "block");
      $('#row').css("display", "none");
      $('#more').css("cssText", "display:none !important");
    }
  });

  // 关闭音乐列表弹窗页面
  $('#closemore-music').on('click', () => {
    $('#box-music').css('display', 'none')
    $('#row').css('display', 'flex')
    $('#more').css('display', 'flex')
  })

  let main = document.getElementById('main');
  // 音乐列表高度
  const listHeight = main.offsetHeight * 0.8 - 200

  $.ajax({
    url: `https://api-meting.imsyy.top/api?server=${server}&type=${type}&id=${id}`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      if (!data || data.length === 0) {
        console.error('音乐数据为空');
        $('#aplayer').html('<div style="text-align: center; padding: 20px;">音乐加载失败，请检查配置</div>');
        return;
      }

      console.log(`音乐数据加载成功，共 ${data.length} 首歌曲`);
      const ap = new APlayer({
        container: document.getElementById('aplayer'),
        order: 'random',  // 播放模式：list 列表模式， random 随机播放
        preload: 'auto',  // 自动预加载歌曲
        listMaxHeight: `${listHeight}px`,
        volume: '0.5',  // 默认音量
        mutex: true,  // 阻止多个播放器同时播放
        lrcType: 3,
        audio: data
      })

      // 底部歌词
      setInterval(() => {
        $('#lrc').html("<span class='lrc-show'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg>&nbsp;" + $(".aplayer-lrc-current").text() + "&nbsp;<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg></span>")
      }, 500)

      // 音乐通知及控制
      ap.on('play', () => {
        music = $('.aplayer-title').text() + $('.aplayer-author').text()
        iziToast.info({
          timeout: 4000,
          icon: "fa-solid fa-circle-play",
          displayMode: 'replace',
          message: music
        })
        $('#play').html('<i class="fa-solid fa-pause">')
        $('#music-name').html($('.aplayer-title').text() + $('.aplayer-author').text())

        if ($(document).width() >= 990) {
          $('.power').css('cssText', 'display:none')
          $('#lrc').css('cssText', 'display: block !important')
        }
      })

      ap.on('pause', () => {
        $("#play").html("<i class='fa-solid fa-play'>");
        if ($(document).width() >= 990) {
          $('#lrc').css("cssText", "display:none !important");
          $('.power').css("cssText", "display:block");
        }
      });

      $('#music').hover(() => {
        $('.music-text').css("display", "none");
        $('.music-volume').css("display", "flex");
      }, () => {
        $('.music-text').css("display", "block");
        $('.music-volume').css("display", "none");
      })

      $("#hitokoto").hover(() => {
        $('#open-music').css("display", "flex");
      }, () => {
        $('#open-music').css("display", "none");
      })

      $('#music-close').on('click', () => {
        $('#music').css("display", "none");
        $('#hitokoto').css("display", "flex");
      });

      /* 上下曲 */
      $('#play').on('click', () => {
        ap.toggle();
        $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
      });

      $('#last').on('click', () => {
        ap.skipBack();
        ap.play();
        $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
      });

      $('#next').on('click', () => {
        ap.skipForward();
        ap.play();
        $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
      });

      window.onkeydown = (e) => {
        // 空格播放暂停
        if (e.keyCode == 32) {
          ap.toggle();
        }
      }

      //音量调节
      $("#volume").on('input propertychange touchend', () => {
        let x = $("#volume").val();
        ap.volume(x, true);
        if (x == 0) {
          $("#volume-ico").html("<i class='fa-solid fa-volume-xmark'></i>");
        } else if (x > 0 && x <= 0.3) {
          $("#volume-ico").html("<i class='fa-solid fa-volume-off'></i>");
        } else if (x > 0.3 && x <= 0.6) {
          $("#volume-ico").html("<i class='fa-solid fa-volume-low'></i>");
        } else {
          $("#volume-ico").html("<i class='fa-solid fa-volume-high'></i>");
        }
      });

    },
    error: function (error) {
      console.error('音乐 API 请求失败:', error);
      $('#aplayer').html('<div style="text-align: center; padding: 20px;">音乐加载失败，请检查网络连接</div>');

      setTimeout(() => {
        iziToast.show({
          timeout: 8000,
          icon: "fa-solid fa-circle-exclamation",
          displayMode: 'replace',
          message: '音乐播放器加载失败，请检查网络连接或配置'
        });
      }, 1000);
    }
  })
})
