/**
 * Created by zquancai on 2015/2/3.
 */


function dlImg(img) { // 返回一个img对象
    var oimg = new Image();
    oimg.src = 'images/' + img;
    return oimg;
}

function EnemyPlane(type) { // 飞机对象
    this.type = type; // 飞机类型
    this.img = 'plane' + type + '.png';
    this.speed = parseInt(Math.random() * 10); // 速度
    this.life = type == 1 ? 1 : type == 2 ? 5 : 15; // 生命力
    this.score = type == 1 ? 1000 : type == 2 ? 3000 : 8000; // 分数
    this.status = true; // false时表示飞机被摧毁
}

function run() {
    var c = document.getElementById('c-plane');
    (function () {
        c.setAttribute('height', 800 > window.innerHeight ? window.innerHeight.toString() : '800');
        c.setAttribute('width', 480 > window.innerWidth ? window.innerWidth.toString() : '480');
    })();
}

var a = new EnemyPlane(2);
console.log(a);