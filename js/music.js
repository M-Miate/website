/*
  音乐信息

  感谢 @武恩赐 提供的 MetingAPI
  https://api.wuenci.com/meting/api/

  author: Miate
*/

$(document).ready(function () {
  let Config = JSON.parse(localStorage.getItem('config'));

  let server = Config.music.musicServer;  // netease: 网易云音乐; tencent: QQ音乐; kugou: 酷狗音乐; xiami: 虾米; kuwo: 酷我
  let type = Config.music.musicPlaylist;  // song: 单曲; playlist: 歌单; album: 唱片
  let id = Config.music.musicPlaylist;  // 封面 ID / 单曲 ID / 歌单 ID

  $.ajax({
    url: `https://api.wuenci.com/meting/api/?server=${server}&type=${type}&id=${id}`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      const ap = new APlayer({
        container: document.getElementById('aplayer'),
        order: 'random',  // 播放模式：list 列表模式， random 随机播放
        preload: 'auto',  // 自动预加载歌曲
        listMaxHeight: '336px',
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

      /* 打开音乐列表 */
      $('#music-open').on('click', () => {
        if ($(document).width() >= 990) {
          $('#box').css("display", "block");
          $('#row').css("display", "none");
          $('#more').css("cssText", "display:none !important");
        }
      });

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
      setTimeout(() => {
        iziToast.info({
          timeout: 8000,
          icon: "fa-solid fa-circle-exclamation",
          displayMode: 'replace',
          message: '音乐播放器加载失败'
        });
      }, 4000);
    }
  })
})