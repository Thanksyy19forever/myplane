/**
 * Created by zquancai on 2015/2/3.
 */


function dlImg(img) { // 返回一个img对象
    var oimg = new Image();
    oimg.src = 'images/' + img;
    return oimg;
}

function run() {
    var c = document.getElementById('c-plane');
    var ctx = c.getContext('2d');
    (function () { // 适应手机屏幕
        c.setAttribute('height', 800 > window.innerHeight ? window.innerHeight.toString() : '800');
        c.setAttribute('width', 480 > window.innerWidth ? window.innerWidth.toString() : '480');
    })();
    var w = parseInt(c.getAttribute('width')),
        h = parseInt(c.getAttribute('height')),
        sw = w / 480;
    function Enemy(type) { // 飞机对象
        this.type = type; // 飞机类型
        this.img = 'plane' + type + '.png';
        this.x = parseInt(Math.random() * w);
        this.y = 0;
        this.speed = parseInt(Math.random() * 10); // 速度
        this.life = type == 1 ? 1 : type == 2 ? 5 : 15; // 生命力
        this.score = type == 1 ? 1000 : type == 2 ? 3000 : 8000; // 分数
        this.status = true; // false时表示飞机被摧毁
    }
    var bg = { // 背景对象
        img: oimgarr['bg.jpg'],
        y: 0,
        init: function () {
            this.img.width = this.img.width * sw;
            this.img.height = this.img.height * sw;
            ctx.drawImage(this.img, 0, this.y, this.img.width, this.img.height);
        },
        scrolling: function () {
            ctx.drawImage(this.img, 0, this.y, this.img.width, this.img.height);
            ctx.drawImage(this.img, 0, this.y - this.img.height + 10, this.img.width, this.img.height);
            this.y >= h ? this.y = 0 : this.y ++;
        }
    };
    var me = { // 我方战机
        img: oimgarr['me.png'],
        x: parseInt(w / 2),
        y: h,
        init: function () {
            this.img.width = this.img.width * sw;
            this.img.height = this.img.height * sw;
            ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
        },
        setSite: function (x, y) { // 更新我方战机的位置
            this.x = x - this.img.width / 2;
            this.y = y - this.img.height / 2;
        },
        moving: function () { // 移动我方战机
            ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
        }
    };
    me.init();
    setInterval(function () {
        bg.scrolling();
        me.moving();
    },10);
    c.addEventListener('mousemove', function (e) {
        me.setSite(e.pageX, e.pageY);
    }, false);
}

function loadAllImg(img, fun) {
    var l = img.length,
        i,h = 0;
    for(i = 0; i < l; i ++){
        oimgarr[img[i]] = dlImg(img[i]);
        oimgarr[img[i]].onload = function () {
            h ++;
            h >= l && fun();
        }
    }
}

var oimgarr = {}; // 保存所有图片的img对象
loadAllImg(['bg.jpg','cartridge.png','me.png','me_die1.png','me_die2.png','me_die3.png','me_die4.png'],run);