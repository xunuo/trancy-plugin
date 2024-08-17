// JS 压缩 ： https://www.jyshare.com/front-end/51/

/**
 * Configs
 */
// 视频偏移量
let videoMargLeft = '-230px';

/**
 * Utils
 */
function timeStringToMilliseconds(timeString) {
    // 分割时间字符串为小时、分钟和秒
    const timeParts = timeString.split(':').map(Number);

    let hours = 0, minutes = 0, seconds = 0;

    if (timeParts.length === 3) {
        // 格式为 hh:mm:ss
        [hours, minutes, seconds] = timeParts;
    } else if (timeParts.length === 2) {
        // 格式为 mm:ss
        [minutes, seconds] = timeParts;
    } else if (timeParts.length === 1) {
        // 格式为 ss
        [seconds] = timeParts;
    } else {
        throw new Error("Invalid time format");
    }

    // 计算总毫秒数
    const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

    return totalMilliseconds;
}

function copyTextFromWordsCard() {
    // 找到所有 class 为 "words-card" 的元素
    const wordsCardElements = document.querySelectorAll('.words-card');

    // 初始化一个数组来存储所有 "text" 元素的内容
    let textContents = [];

    // 遍历所有 "words-card" 元素
    wordsCardElements.forEach(wordsCard => {
        // 在当前 "words-card" 元素中找到所有 class 为 "text" 的元素
        const textElements = wordsCard.querySelectorAll('.text');

        // 遍历所有 "text" 元素并获取它们的内容
        textElements.forEach(textElement => {
            textContents.push(textElement.textContent);
        });
    });

    // 将所有内容拼接为一个长字符串
    const longString = textContents.join('\n');

    // 创建一个临时的 textarea 元素来复制内容到剪切板
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = longString;
    document.body.appendChild(tempTextArea);

    // 选择并复制内容到剪切板
    tempTextArea.select();
    document.execCommand('copy');

    // 移除临时的 textarea 元素
    document.body.removeChild(tempTextArea);

    // 提示用户复制成功
    alert('当前单词列表已复制到剪切板 - 单词个数:' + document.querySelectorAll('.words-card').length);
}

// JumpToTime
function JumpToTime(timeString){

    // 设置播放进度（以秒为单位）
    var newTime = timeStringToMilliseconds(timeString);

    if(location.host === 'www.netflix.com'){
    // Netfix
        // 获取 Netflix 播放器实例
        var player = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var sessionId = player.getAllPlayerSessionIds()[0];
        var videoPlayer = player.getVideoPlayerBySessionId(sessionId);
        videoPlayer.seek(newTime);
    }else{
    // Youtube
        // 获取YouTube视频播放器对象
        var player = document.querySelector('video');

        // 跳转到指定的时间点
        player.currentTime = newTime/1000;
    }

}

/**
 * 视频时间跳转功能
 */
// 选择一个父元素，可以是 body 或者其他包含 .time-stamp 元素的父元素
const parentElement = document.getElementById('trancy-app');

// 添加事件委托，监听父元素上的点击事件
parentElement.addEventListener('click', (event) => {
    // 检查点击的目标元素是否具有 .time-stamp 类
    if (event.target.classList.contains('time-stamp')) {
        JumpToTime(event.target.innerText);
    }
});
// 添加事件委托，监听父元素上的鼠标移入和移出事件
parentElement.addEventListener('mouseover', (event) => {
    // 检查鼠标移入的目标元素是否具有 .time-stamp 类
    if (event.target.classList.contains('time-stamp')) {
        event.target.style.cursor = 'pointer';
    }
});

parentElement.addEventListener('mouseout', (event) => {
    // 检查鼠标移出的目标元素是否具有 .time-stamp 类
    if (event.target.classList.contains('time-stamp')) {
        event.target.style.cursor = '';
    }
});


/**
 * 播放器 UI 优化
 */
// 偏移主要视频位置使之不挡住单词列表
// 获取第一个class为trancy-wrapper的元素
var element = document.querySelector('.trancy-wrapper');

// 设置该元素的left属性
if (element) {
    element.style.left = videoMargLeft;
}

/**
 * 优化单词本列表
 * + 按钮导出当前视频所有生词
 * + 增加回到单词本上次滚动位置的特性。
 */

// 单词本坐标记录器
let backupWordlistScrollTop = 0,
    backupVideoTime;

// 进入单词本状态
let wordListInited = false;

// 进入单词释义状态
let wordDetailInited = false;

let trancyIV = setInterval(function(){
    if(document.querySelectorAll('.trancy-collection-words').length > 0){
        // console.log('已打开单词本');
        if(!wordListInited){

            // 标记初始化完成，避免重复执行。
            wordListInited = true;
            wordDetailInited = false;
            
            // 开始初始化单词本
            console.log('开始初始化单词本');

            // 添加复制单词按钮
            const wordListLabel = document.querySelectorAll('.trancy-collection-content .label')[0];
            // 创建一个按钮元素
            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy Words';
            // 绑定点击事件
            copyButton.addEventListener('click', function() {
                copyTextFromWordsCard();
            });
            wordListLabel.appendChild(copyButton);


            // 跳转到上次单词本滚动位置
            const wordListSlider = document.querySelectorAll('.trancy-slider-container')[0];

            if(backupWordlistScrollTop){
                wordListSlider.scrollTop = backupWordlistScrollTop;
            }

            // 备份坐标
            wordListSlider.addEventListener('scroll', function() {
                backupWordlistScrollTop = wordListSlider.scrollTop;
                console.log('Word List ScrollTop is:' + backupWordlistScrollTop);
            });
            
        }
    }else if(document.querySelectorAll('.rd-words-card').length > 0){

            if(!wordDetailInited){
                
                // 标记初始化完成，避免重复执行。
                wordDetailInited = true;
                wordListInited = false;

                backupVideoTime = document.querySelectorAll('.trancy-controller-video-time')[0].innerText;

                console.log('backupVideoTime:' + backupVideoTime);

            }


    }else{
        // console.log('未打开单词本');
        // 重置状态
        wordListInited = false;
        wordDetailInited = false;
    }
},300);