//监听按下移动键
addEventListener("keydown", function (e) {
    let key = e.key.toLowerCase(); //获取用户按下键值无视大小写，注意keycode已被废除
    switch (key) {
        //根据按键时值决定移动速度
        case 'w':
            keysDown[0] = kspeed;
            break;
        case 'a':
            keysDown[1] = kspeed;
            break;
        case 'd':
            keysDown[2] = kspeed;
            break;
        case 's':
            keysDown[3] = kspeed;
            break;
        case 'j':
            //按下攻击键标记
            keyAttack = true;
            break;
    }
    //当有移动速度时执行走动动画
    if ((keysDown[0] || keysDown[1] || keysDown[2] || keysDown[3]) == kspeed) {
        openRwa = true;
    }

})

//监听松开移动键
addEventListener("keyup", function (e) {
    let key = e.key.toLowerCase(); //获取用户按下键值无视大小写，注意keycode已被废除
    switch (key) {
        //松开移动键速度归零
        case 'w':
            keysDown[0] = 0;
            break;
        case 'a':
            keysDown[1] = 0;
            break;
        case 'd':
            keysDown[2] = 0;
            break;
        case 's':
            keysDown[3] = 0;
            break;
        case 'j':
            //松开攻击键标记
            keyAttack = false;
            break;
    }
    //当所有移动按键松开时执行站立动作
    if ((keysDown[0] == 0 && keysDown[1] == 0 && keysDown[2] == 0 && keysDown[3] == 0) &&
        (key == 'w' || key == 'a' || key == 'd' || key == 's')) {
        openRwa = false;
    }
})


