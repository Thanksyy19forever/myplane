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
    function Enemy() { // 飞机对象
        this.type = parseInt(Math.random() * 3 + 1); // 飞机类型
        this.img = oimgarr['plane' + this.type + '.png'];
        this.x = parseInt(Math.random() * w);
        this.y = 0;
        this.speed = parseInt(Math.random() * 3) + 1; // 速度
        this.life = this.type == 1 ? 1 : this.type == 2 ? 5 : 15; // 生命力
        this.states = this.type == 1 ? 3 : this.type == 2 ? 4 : 6;
        this.curstate = 1;
        this.diedefer = 500;
        this.score = this.type == 1 ? 1000 : this.type == 2 ? 3000 : 8000; // 分数
        this.shooting = function () {
            this.life --;
        };
        this.isDie = function () {
            return this.life == 0;
        };
    }
    function  Cartridge() { // 子弹
        this.img = oimgarr['cartridge.png'];
        this.x = me.x + me.img.width / 2;
        this.y = me.y - 20;
    }
    var bg = { // 背景
        img: oimgarr['bg.jpg'],
        y: 0,
        init: function () {
            //this.img.width = this.img.width * sw;
            //this.img.height = this.img.height * sw;
            ctx.drawImage(this.img, 0, this.y, this.img.width, this.img.height);
        },
        scrolling: function () {
            ctx.drawImage(this.img, 0, this.y, this.img.width, this.img.height);
            ctx.drawImage(this.img, 0, this.y - this.img.height +10, this.img.width, this.img.height);
            this.y >= h ? this.y = this.y - this.img.height +10 : this.y ++;
        }
    };
    bg.init();
    var me = { // 我方战机
        img: oimgarr['me.png'],
        x: parseInt(w / 2),
        y: h,
        cartridges: [],
        defer: 0,
        status: true,
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
        },
        shoot: function () {
            this.cartridges.map(function (c,i) {
                if(c.y > 0) {
                    ctx.drawImage(c.img, c.x, c.y, c.img.width, c.img.height);
                    c.y = c.y - 4;
                }
                else{
                    me.cartridges.splice(i,1); // 删除超过顶部位置的子弹
                }
            });
            if (this.defer == 10){
                this.cartridges.push(new Cartridge());
                this.defer = 0;
            }
            this.defer ++;
        },
        crash: function () {
            enemy.enemys.map(function (e) {
                //var e0 = [[e.x, e.y],[e.x + e.img.width, e.y],[e.x, e.y + e.img.height],[e.x + e.img.width,e.y + e.img.height]];

            });
        }
    };
    me.init();
    var enemy = {
        enemys: [],
        defer: 0,
        addEnemy: function (){
            this.enemys.map(function (e, i) {
                if (e.y > h) {
                    enemy.enemys.splice(i, 1);
                }
                else {
                    ctx.drawImage(e.img, e.x, e.y, e.img.width, e.img.height);
                    e.y = e.y + e.speed;
                }
            });
            if (this.defer == 50) {
                this.enemys.push(new Enemy());
                this.defer = 0;
            }
            this.defer ++;
        },
        isShoot: function () {
            this.enemys.map(function (e,i) {
                var rx = e.x + e.img.width,
                    by = e.y + e.img.height;
                me.cartridges.map(function (c,j) {
                    if(!e.isDie() && (c.x > e.x && c.x < rx) && (c.y > e.y && c.y < by)){
                        e.shooting();
                        me.cartridges.splice(j,1); // 击中敌机后清除该子弹
                    }
                    if(e.isDie()){
                        if (e.diedefer == 500) {
                            if(e.curstate <= e.states) {
                                e.img = oimgarr['plane' + e.type + '_die' + e.curstate + '.png'];
                                e.curstate ++;
                                e.diedefer = 0;
                            }
                            else{
                                enemy.enemys.splice(i, 1);
                            }
                        }
                        e.diedefer ++;
                    }
                });
                var e0 = [e.x, e.y,e.x + e.img.width,e.y + e.img.height],
                    me0 = [me.x,me.y,me.x + me.img.width,me.y + me.img.height];
                if((e0[0] > me0[0] && e0[2] < me0[2]) && (e0[1] < me0[1] && e0[3] > me0[3])){
                    console.log('die');
                }
            });
        }
    };
    setInterval(function () {
        bg.scrolling();
        me.moving();
        me.shoot();
        me.crash();
        enemy.addEnemy();
        enemy.isShoot();
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
loadAllImg(['bg.jpg','cartridge.png','me.png','me_die1.png','me_die2.png','me_die3.png','me_die4.png',
    'plane1.png','plane1_die1.png','plane1_die2.png','plane1_die3.png',
    'plane2.png','plane2_die1.png','plane2_die2.png','plane2_die3.png','plane2_die4.png',
    'plane3.png','plane3_die1.png','plane3_die2.png','plane3_die3.png','plane3_die4.png','plane3_die5.png','plane3_die6.png'],run);