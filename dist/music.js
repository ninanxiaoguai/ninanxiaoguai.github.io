const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    audio: [
      {
        name: "Dream It Possible",
        artist: 'Delacey',
        url: 'http://www.ytmp3.cn/down/47868.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/84.jpg',
      },
      {
        name: 'いとしすぎて',
        artist: 'KG',
        url: 'http://www.ytmp3.cn/down/35726.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/8.jpg',
      },
      {
        name: '茜さす',
        artist: 'Aimer',
        url: 'http://www.ytmp3.cn/down/44578.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/96.jpg',
      }
    ]
});
