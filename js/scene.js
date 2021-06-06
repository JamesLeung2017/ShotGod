//角色子弹数组
var r_bullets = [];
//boss子弹数组
var b_bullets = [];
//监听按键数组
var keysDown = [0, 0, 0, 0];
//控制移动速度
var kspeed = 3;
//获取角色、boss动画序列长度
var Rwalen = Object.getOwnPropertyNames(GameImgs.role.walk).length;
var Bmolen_1 = Object.getOwnPropertyNames(GameImgs.boss.round_1).length;
var Bmolen_2 = Object.getOwnPropertyNames(GameImgs.boss.round_2).length;
var Bmolen_3 = Object.getOwnPropertyNames(GameImgs.boss.round_3).length;
//角色、boss动画序列
var RrmOrder = 0;
var RbmOrder = 0;
//定时器
var rwa;
var bwa;
var clo;
var frb;
var rpo;
var bpr;
var dbg;
var dbh;
var drh;
var fbb;
var gov;
//时钟计时器
var clock = 240;
//关数
var round = 1;
//转换开关
var openRst = false;
var openRwa = false;
//攻击键开关
var keyAttack = false;
//暂停键开关
var canStop = true;
//背景移动开关
var bgMove = 0;
var bgLeftControl = true;
var bgRightControl = false;
//回合结束标记
var end = 0;

//绘制角色血量条
function drawRHp() {
    //重绘血条
    mainCtx.clearRect(50, 500, 30, 150);
    //血条添加渐变
    let grd = mainCtx.createLinearGradient(0, 650, 0, 500);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    mainCtx.fillStyle = grd;
    mainCtx.fillRect(50, 650, 30, -role.hp);
}

//绘制boss血量条
function drawBHp() {
    mainCtx.font = "40px Arial";
    let gradient = mainCtx.createLinearGradient(0, 0, 100, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    mainCtx.fillStyle = gradient;
    mainCtx.fillText("BOSS:", 10, 40);
    mainCtx.clearRect(120, 50, 1200, 40);
    //血条添加渐变
    let grd = mainCtx.createLinearGradient(120, 0, 1400, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    mainCtx.fillStyle = grd;
    if (round == 1 && boss.r_1.hp > 0) {
        mainCtx.fillRect(120, 50, boss.r_1.hp, 40);
    }
    if (round == 2 && boss.r_2.hp > 0) {
        mainCtx.fillRect(120, 50, boss.r_2.hp, 40);
    }
    if (round == 3 && boss.r_3.hp > 0) {
        mainCtx.fillRect(120, 50, boss.r_3.hp, 40);
    }
}

//绘制场景
function drawBackground() {
    let img = new Image();
    if (round == 1) {
        img.src = GameImgs.backgrounds.num_1;
    }
    if (round == 2) {
        img.src = GameImgs.backgrounds.num_2;
    }
    if (round == 3) {
        img.src = GameImgs.backgrounds.num_3;
    }
    if (bgMove < 0 && bgRightControl == true) {
        bgMove++;
        if (bgMove == 0) {
            bgLeftControl = true;
            bgRightControl = false;
        }
    }
    if (bgMove > -240 && bgLeftControl == true) {
        bgMove--;
        if (bgMove == -240) {
            bgLeftControl = false;
            bgRightControl = true;
        }
    }
    img.onload = function () {
        //绘制图片
        backGroundCtx.drawImage(img, bgMove, 0, 1702, 680);
    }
}

//绘制计时器
function drawClock() {
    //每0.1s时钟进行精确计时
    if (clock > 0) {
        clock -= 0.1;
    }
    mainCtx.clearRect(630, 0, 100, 40);
    mainCtx.font = "40px Arial";
    mainCtx.fillStyle = "black";
    mainCtx.fillText(`🕗`, 600, 38);
    if (Math.floor(clock) >= 10) {
        mainCtx.fillText(`${Math.floor(clock)}`, 660, 40);
    } else {
        mainCtx.fillText(`0${Math.floor(clock)}`, 660, 40);
    }
}

//角色站立
function runRstand() {
    if (openRwa == false) {
        let img = new Image();
        img.src = GameImgs.role.stand;
        img.onload = function () {
            //重新绘制前清空画布
            roleCanvas.height = roleCanvas.height;
            //绘制图片
            roleCtx.drawImage(img, role.x, role.y);
        }
    }
}

//角色走动动画
function runRwalk() {
    if (openRwa == true) {
        roleCtx.clearRect(150, 150, 100, 120);
        let walk = GameImgs.role.walk;
        //根据序列获取动作  
        let walkImg = walk[Object.keys(walk)[RrmOrder]];
        let img = new Image();
        img.src = walkImg;
        img.onload = function () {
            // 重新绘制前清空画布
            roleCanvas.height = roleCanvas.height;
            //绘制图片
            roleCtx.drawImage(img, role.x, role.y);
        }
        RrmOrder++;
        //循环
        if (RrmOrder == Rwalen) {
            RrmOrder = 0;
        }
    }
}

//角色移动后的位置
function rolePosition() {
    role.x += keysDown[2] - keysDown[1];
    role.y += keysDown[3] - keysDown[0];
    //x,y轴边界判定
    if (role.x > roleCanvas.width - 75) {
        role.x = roleCanvas.width - 75;
    }
    if (role.x < 0) {
        role.x = 0;
    }
    if (role.y < 0) {
        role.y = 0;
    }
    if (role.y > roleCanvas.height - 103) {
        role.y = roleCanvas.height - 103;
    }
}


//boss动画
function runBmove() {
    let move;
    let moveImg; 
    let img;
    let width;
    let height;
    if (round == 1) {
        move = GameImgs.boss.round_1;
        width = 224;
        height = 171;
        if (RbmOrder == Bmolen_1) {
            RbmOrder = 0;
        }
    }
    if (round == 2) {
        move = GameImgs.boss.round_2;
        width = 244;
        height = 205;
        if (RbmOrder == Bmolen_2) {
            RbmOrder = 0;
        }
    }
    if (round == 3) {
        move = GameImgs.boss.round_3;
        width = 244;
        height = 205;
        if (RbmOrder == Bmolen_3) {
            RbmOrder = 0;
        }
    }
    //根据序列获取动作  
    moveImg = move[Object.keys(move)[RbmOrder]];
    img = new Image();
    img.src = moveImg;
    img.onload = function () {
        // 重新绘制前清空画布
        bossCanvas.height = bossCanvas.height;
        //绘制图片
        bossCtx.drawImage(img, boss.x, boss.y, width, height);
    }
    //循环
    RbmOrder++;
}

//随机更新Boss位置
function BpRandom() {
    boss.y = (bossCanvas.height - 200) * Math.random();
}

//角色发射子弹
function fireRbullets() {
    //恢复正常状态
    document.getElementById('boss_canvas').style.opacity = 1;
    //绘制前清空画布
    rBulletsCanvas.height = rBulletsCanvas.height;
    //按下攻击键实时计算子弹位置
    if (keyAttack == true) {
        r_bullets.push(role.x);
        r_bullets.push(role.y);
    }
    for (let i = 0; i < r_bullets.length; i = i + 2) {
        // 子弹移动速度
        r_bullets[i] = r_bullets[i] + 120;
        //超出边界或打击敌人时清除
        if (r_bullets[i] > rBulletsCanvas.width) {
            r_bullets.splice(i, 2);
            rBulletsCanvas.height = rBulletsCanvas.height;
        }
        if (round == 1) {
            //boss受击
            if ((r_bullets[i] <= boss.x + 244) &&
                (boss.y <= r_bullets[i + 1] + 95) &&
                (r_bullets[i + 1] <= boss.y + 191) &&
                (boss.x <= r_bullets[i] + 133)
            ) {
                //受击反馈
                document.getElementById('boss_canvas').style.opacity = 0.4;
                boss.r_1.hp -= 10;
                r_bullets.splice(i, 2);
            }
        }
        if (round == 2) {
            //boss受击
            if ((r_bullets[i] <= boss.x + 244) &&
                (boss.y <= r_bullets[i + 1] + 95) &&
                (r_bullets[i + 1] <= boss.y + 205) &&
                (boss.x <= r_bullets[i] + 133)
            ) {
                //受击反馈
                document.getElementById('boss_canvas').style.opacity = 0.4;
                boss.r_2.hp -= 5;
                r_bullets.splice(i, 2);
            }
        }
        if (round == 3) {
            //boss受击
            if ((r_bullets[i] <= boss.x + 244) &&
                (boss.y <= r_bullets[i + 1] + 95) &&
                (r_bullets[i + 1] <= boss.y + 205) &&
                (boss.x <= r_bullets[i] + 133)
            ) {
                //受击反馈
                document.getElementById('boss_canvas').style.opacity = 0.4;
                boss.r_3.hp -= 3;
                r_bullets.splice(i, 2);
            }
        }
        let img = new Image();
        img.src = GameImgs.role.bullets.num_1;
        img.onload = function () {
            //绘制图片
            rBulletsCtx.drawImage(img, r_bullets[i], r_bullets[i + 1]);
        }
    }
}


//BOSS发射子弹
function fireBbullets() {
    //恢复正常状态
    document.getElementById('role_canvas').style.opacity = 1;
    bBulletsCanvas.height = bBulletsCanvas.height;
    if (round == 1) {
        for (let i = 0; i < b_bullets.length; i = i + 2) {
            // 子弹移动距离
            b_bullets[i] -= 40;
            //超出边界
            if (b_bullets[i] < 0) {
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            //角色受击
            if ((b_bullets[i] <= role.x + 75) &&
                (role.y <= b_bullets[i + 1] + 100) &&
                (b_bullets[i + 1] <= role.y + 93) &&
                (role.x <= b_bullets[i] + 150)
            ) {
                //受击反馈
                role.hp -= 10;
                document.getElementById('role_canvas').style.opacity = 0.4;
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            let img = new Image();
            img.src = GameImgs.boss.bullets.num_1;
            img.onload = function () {
                //绘制图片
                bBulletsCtx.drawImage(img, b_bullets[i], b_bullets[i + 1], 150, 100);
            }
        }
    }
    if (round == 2) {
        for (let i = 0; i < b_bullets.length; i = i + 2) {
            // 子弹移动距离
            b_bullets[i + 1] += 20;
            //超出边界
            if (b_bullets[i + 1] > 680) {
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            //角色受击
            if ((b_bullets[i] <= role.x + 75) &&
                (role.y <= b_bullets[i + 1] + 100) &&
                (b_bullets[i + 1] <= role.y + 93) &&
                (role.x <= b_bullets[i] + 100)
            ) {
                //受击反馈
                role.hp -= 15;
                document.getElementById('role_canvas').style.opacity = 0.4;
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            let img = new Image();
            img.src = GameImgs.boss.bullets.num_2;
            img.onload = function () {
                //绘制图片
                bBulletsCtx.drawImage(img, b_bullets[i], b_bullets[i + 1], 100, 100);
            }
        }
    }
    if (round == 3) {
        for (let i = 0; i < b_bullets.length; i = i + 2) {
            // 子弹移动距离
            b_bullets[i] -= 30;
            b_bullets[i + 1] += 20;
            //超出边界
            if (b_bullets[i + 1] > 680) {
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            //角色受击
            if ((b_bullets[i] <= role.x + 75) &&
                (role.y <= b_bullets[i + 1] + 120) &&
                (b_bullets[i + 1] <= role.y + 93) &&
                (role.x <= b_bullets[i] + 120)
            ) {
                //受击反馈
                role.hp -= 20;
                document.getElementById('role_canvas').style.opacity = 0.4;
                b_bullets.splice(i, 2);
                bBulletsCanvas.height = bBulletsCanvas.height;
            }
            let img = new Image();
            img.src = GameImgs.boss.bullets.num_3;
            img.onload = function () {
                //绘制图片
                bBulletsCtx.drawImage(img, b_bullets[i], b_bullets[i + 1], 120, 120);
            }
        }
    }
}

//暂停游戏
function stopGame() {
    if (canStop == true) {
        document.getElementById('stop_frame').style.opacity = 1;
        clearInterval(rst);
        clearInterval(rbm);
        clearInterval(rwa);
        clearInterval(frb);
        clearInterval(fbb);
        clearInterval(bwa);
        clearInterval(bpr);
        clearInterval(rpo);
        clearInterval(dbg);
        clearInterval(drh);
        clearInterval(dbh);
        clearInterval(clo);
        clearInterval(bas);
    }

}

//回到游戏
function backGame() {
    document.getElementById('stop_frame').style.opacity = 0;
    canStop = true;
    rwa = setInterval(runRwalk, 120);
    rst = setInterval(runRstand, 10);
    rpo = setInterval(rolePosition, 10);
    frb = setInterval(fireRbullets, 100);
    bpr = setInterval(BpRandom, 1300);
    fbb = setInterval(fireBbullets, 130);
    dbg = setInterval(drawBackground, 10);
    dbh = setInterval(drawBHp, 10);
    drh = setInterval(drawRHp, 10);
    rbm = setInterval(runBmove, 120);
    clo = setInterval(drawClock, 100);
    bas = setInterval(fillbBullets, 900);
}

//游戏结束
function GameEnd() {
    //闯关失败
    if (role.hp <= 0 || Math.floor(clock) <= 0) {
        //清除场上角色相关定时器
        clearInterval(frb);
        clearInterval(rpo);
        clearInterval(drh);
        clearInterval(dbh);
        clearInterval(rwa);
        clearInterval(rst);
        clearInterval(clo);
        //不可点击停止按钮
        canStop = false;
        //清除角色
        roleCanvas.width = roleCanvas.width;
        rBulletsCanvas.width = rBulletsCanvas.width;
        document.getElementById('over_frame').style.opacity = 1;
    }
    //通关
    if (boss.r_1.hp <= 0) {
        round = 2;
        if (end < 2) {
            //结束标记加1
            end++;
        }
        //回合结束标记为1
        if (end == 1) {
            //更新回合
            updateRound();
            startGame();
        }
    }
    if (boss.r_2.hp <= 0) {
        round = 3;
        if (end == 2) {
            //更新回合
            updateRound();
            startGame();
        }
        if (end < 3) {
            //结束标记加1
            end++;
        }

    }
    if (boss.r_3.hp <= 0) {
        //清除场上boss相关定时器
        bossCanvas.width = bossCanvas.width;
        bBulletsCanvas.width = bBulletsCanvas.width;
        rBulletsCanvas.width = rBulletsCanvas.width;
        clearInterval(frb);
        clearInterval(rpo);
        clearInterval(rwa);
        clearInterval(drh);
        clearInterval(dbh);
        clearInterval(bpr);
        clearInterval(fbb);
        clearInterval(bwa);
        clearInterval(clo);
        clearInterval(rbm);
        clearInterval(bas);
        document.getElementById('success_frame').style.opacity = 1;
    }
}

//加载回合
function loadRound() {
    return new Promise((resolve) => {
        mainCtx.font = "80px Arial";
        mainCtx.fillStyle = 'black';
        //显示回合
        mainCtx.fillText(`ROUND${round}`, 520, 370);
        dbg = setInterval(drawBackground, 10);
        //不可点击暂停
        canStop = false;
        setTimeout(function () {
            mainCtx.clearRect(520, 300, 340, 100);
            resolve();
        }, 1300);
    });
}

//执行游戏
async function startGame() {
    document.getElementById('start_frame').style.opacity = 0;
    //覆盖优先级
    document.getElementById('stop_button').style.zIndex = 2;
    await loadRound();
    canStop = true;
    mainCtx.font = "40px Arial";
    mainCtx.fillStyle = "red";
    mainCtx.fillText("Health", 20, 480);
    frb = setInterval(fireRbullets, 100);
    rpo = setInterval(rolePosition, 10);
    drh = setInterval(drawRHp, 10);
    rwa = setInterval(runRwalk, 120);
    rst = setInterval(runRstand, 10);
    dbh = setInterval(drawBHp, 10);
    clo = setInterval(drawClock, 100);
    bpr = setInterval(BpRandom, 1300);
    fbb = setInterval(fireBbullets, 130);
    rbm = setInterval(runBmove, 120);
    bas = setInterval(fillbBullets, 900);
    gov = setInterval(GameEnd, 10);
}


//重新开始游戏
function reStart() {
    //隐藏游戏状态框
    document.getElementById('over_frame').style.opacity = 0;
    document.getElementById('success_frame').style.opacity = 0;
    clock = 240;
    canStop = true;
    //重置角色、boss等的状态
    round = 1;
    end = 0;
    RbmOrder = 0;
    role.hp = 150;
    boss.r_1.hp = 1200;
    boss.r_2.hp = 1200;
    boss.r_3.hp = 1200;
    boss.y = (bossCanvas.height - 200) * Math.random();
    updateRound();
    startGame();
}

//装填BOSS子弹数组
function fillbBullets() {
    if (round == 1) {
        b_bullets.push(boss.x - 100);
        b_bullets.push(boss.y);
    }
    if (round == 2) {
        b_bullets.push((roleCanvas.width) * Math.random());
        b_bullets.push(0);
    }
    if (round == 3) {
        b_bullets.push((mainCanvas.width) * Math.random());
        b_bullets.push(0);
    }
}

//更新回合
function updateRound() {
    bossCanvas.width = bossCanvas.width;
    roleCanvas.width = roleCanvas.width;
    bBulletsCanvas.width = bBulletsCanvas.width;
    rBulletsCanvas.width = rBulletsCanvas.width;
    r_bullets = [];
    b_bullets = [];
    role.x = 100;
    role.y = 250;
    clearInterval(frb);
    clearInterval(rpo);
    clearInterval(rwa);
    clearInterval(rst);
    clearInterval(drh);
    clearInterval(dbh);
    clearInterval(bpr);
    clearInterval(fbb);
    clearInterval(bwa);
    clearInterval(clo);
    clearInterval(rbm);
    clearInterval(bas);
    clearInterval(dbg);
}