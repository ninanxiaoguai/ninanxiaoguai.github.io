const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    audio: [
      {
        name: "Dream It Possible",
        artist: 'Delacey',
        url: 'http://www.ytmp3.cn/down/47868.mp3',
        cover: 'https://cdn-img.easyicon.net/png/5473/547376.gif',
      },
      {
        name: 'いとしすぎて',
        artist: 'KG',
        url: 'http://www.ytmp3.cn/down/35726.mp3',
        cover: 'https://cdn-img.easyicon.net/png/5473/547376.gif',
      },
      {
        name: '茜さす',
        artist: 'Aimer',
        url: 'http://www.ytmp3.cn/down/44578.mp3',
        cover: 'https://cdn-img.easyicon.net/png/5473/547376.gif',
      }
    ]
});
