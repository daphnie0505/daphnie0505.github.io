
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    // 移除所有活動狀態
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // 添加新的活動狀態
    this.classList.add('active');
    const section = document.querySelector(this.getAttribute('href'));
    section.classList.add('active');
    
    // 平滑滾動
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// 音樂輪播
const audio = document.getElementById('bgMusic');
const songs = [
  "【Bi.Bi Piano】Pachelbel's Canon 终于弹了这首 世界上最治愈的钢琴曲♪卡农.mp3",
  "[Piano Cover] 久石讓 Joe Hisaishi - 菊次郎的夏天(Summer)｜一聽前奏就知道的旋律.mp3"
];
let currentSong = 0;

audio.addEventListener('ended', function() {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
});

// Teachable Machine
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const URL = "converted_keras/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(640, 480, flip);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

document.getElementById("start-button").addEventListener("click", init);
