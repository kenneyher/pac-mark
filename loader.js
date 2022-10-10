function loadAssets(){
  /* LOAD SPRITES AND SOUNDS */
  loadSprite('snake', './sprites/snake.png');
  loadSprite('fx', './sprites/shine.png', {
    sliceX: 6,
    sliceY: 0,
    anims: 
    {
      idle: {from: 0, to: 5}
    }
  });
  loadSprite('over-text', './sprites/over.png');
  loadSprite('oversnake', './sprites/over-snake.png');
  loadSprite('screen', './sprites/screen.png');
  loadSprite('logo', '/sprites/logo.png')
  loadSprite('body', './sprites/body.png');
  loadSprite('tail', './sprites/tail.png');
  loadSprite('wall', './sprites/wall.png');
  loadSprite('grass', './sprites/grass1.png');
  loadSprite('grass1', './sprites/grass.png');
  loadSprite('grass2', './sprites/grass2.png');
  loadSprite('f1', './sprites/ban1.png');
  loadSprite('f2', './sprites/pear1.png');
  loadSprite('f3', './sprites/stw1.png');
  loadSprite('f4', './sprites/f1.png');
  loadSprite('f5', './sprites/f2.png');
  loadSprite('f6', './sprites/f3.png');
  loadSprite('f7', './sprites/f4.png');
  loadFont('snaked', './sprites/font.png', 64, 64, {chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:'});

  loadSound('snaked', './sounds/main.mp3');
  loadSound('over', './sounds/over.mp3');
}
export default loadAssets;