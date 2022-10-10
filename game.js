import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import loadAssets from "./loader.js";
import float from "./floatComp.js";

const boomOpts = {
  width: 764,
  height: 764,
  canvas: document.getElementById("kaboom"),
  background: [0, 0, 0],
  crips: true,
  font: 'snaked',
  global: true,
};
kaboom(boomOpts);
loadAssets();

const map = [
  "==============",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "=            =",
  "==============",
];
const opts = {
  pos: vec2(-70, -70),
  width: 64,
  height: 64,
  "=": () => [sprite("wall"), area(), solid(), "wall"],
};
const addFX = function(p) {
  const fx = add([
    sprite('fx', {anim: 'idle'}),
    pos(p),
    z(50),
  ])
  fx.onAnimEnd('idle', () => {
    fx.destroy();
  })
}

scene("main", () => {
  const music = play('snaked', {volume: 0.5, loop: true});
  add([
    sprite('screen'),
    origin('center'),
    scale(2.6),
    pos(width()/2, height()/2),
    float(2),
    opacity(0.5)
  ])
  add([
    sprite('logo'),
    origin('center'),
    scale(2),
    pos(width()/2, height()/5),
    float(5),
  ])
  add([
    text('PRESS ENTER TO PLAY ARCADE MODE', {letterSpacing: -15}),
    origin('center'),
    scale(0.4),
    color(251, 255, 122),
    pos(width()/2, height()/2),
    float(5),
  ])
  add([
    text('A STORY MODE WILL BE AVAILABLE SOON', {letterSpacing: -20}),
    origin('center'),
    scale(0.4),
    color(251, 255, 122),
    pos(width()/2, height()/1.8),
    float(5),
  ])
  add([
    text('CREATED BY: KENNEYHER AND ANDY007', {letterSpacing: -20}),
    origin('center'),
    scale(0.4),
    color(251, 255, 122),
    pos(width()/2, height()/1.1),
    float(2),
  ])

  onKeyPress('enter', () => {
    music.stop()
    go('play');
  })
})

scene("play", (m) => {
  const music = play('snaked', {volume: 0.3, loop: true})
  let score = 0;
  const scoreLabel = add([
    text('', {letterSpacing: 0.1}),
    scale(0.4),
    pos(width() - 180, 20),
    color(251, 255, 122),
    fixed(),
    z(100),
  ])
  scoreLabel.onUpdate(() => {
    scoreLabel.letterSpacing = -15;
    scoreLabel.text = `SCORE:${score}`
  })

  camScale(0.8);
  add([
    sprite('grass'),
    scale(13),
    // color(0, 0, 255),
    pos(-70, -70)
  ])
  const world = addLevel(map, opts);

  const directions = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
  };
  let curDir = directions.RIGHT;
  let run_action = false;
  let snake_length = 3;
  let snake_body = [];

  function respawn_snake() {
    destroyAll("snake");

    snake_body = [];
    snake_length = 3;

    for (let i = 0; i < snake_length; i++) {
      const segment = add([
        sprite("snake"),
        pos(50, 50 * i),
        solid(),
        // rotate(90),
        area({ width: 50, height: 50 }),
        "snake",
      ]);
      snake_body.push(segment);
    }
    curDir = directions.RIGHT;
  }
  function respawn_all() {
    run_action = false;
    wait(0.5, function () {
      respawn_snake();
      respawn_food();
      run_action = true;
    });
  }

  onKeyPress("up", () => {
    if (curDir != directions.DOWN) {
      curDir = directions.UP;
    }
  });

  onKeyPress("down", () => {
    if (curDir != directions.UP) {
      curDir = directions.DOWN;
    }
  });

  onKeyPress("left", () => {
    if (curDir != directions.RIGHT) {
      curDir = directions.LEFT;
    }
  });

  onKeyPress("right", () => {
    if (curDir != directions.LEFT) {
      curDir = directions.RIGHT;
    }
  });

  let food = null;

  function respawn_food() {
    let new_pos = rand(vec2(1, 1), vec2(12, 12));
    new_pos.x = Math.floor(new_pos.x);
    new_pos.y = Math.floor(new_pos.y);
    new_pos = new_pos.scale(64);

    if (food) {
      destroy(food);
    }
    food = add([
        sprite(choose(['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7',])), 
        pos(new_pos), 
        area({scale: 0.5, offset: vec2(20, 20)}), 
        "food"
      ]);
  }

  let move_delay = 0.1;
  let timer = 0;
  onUpdate(() => {
    if (!run_action) return;
    timer += dt();
    if (timer < move_delay) return;
    timer = 0;

    let move_x = 0;
    let move_y = 0;
    let gap = { x: 50, y: 0 };

    switch (curDir) {
      case directions.DOWN:
        move_x = 0;
        move_y = 50;
        // gap.y = 50;
        break;
      case directions.UP:
        move_x = 0;
        move_y = -1 * 50;
        // gap.y = -50;
        break;
      case directions.LEFT:
        move_x = -1 * 50;
        move_y = 0;
        break;
      case directions.RIGHT:
        move_x = 50;
        move_y = 0;
        break;
    }

    // Get the last element (the snake head)
    let snake_head = snake_body[snake_body.length - 1];

    snake_body.push(
      add([
        sprite("snake"),
        pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
        solid(),
        // color(0, 0, 255),
        // rotate()
        area({ width: 50, height: 40, offset: vec2(10, 10) }),
        "snake",
      ])
    );

    if (snake_body.length > snake_length) {
      let tail = snake_body.shift(); // Remove the last of the tail
      destroy(tail);
    }
  });

  onCollide("snake", "food", (s, f) => {
    snake_length++;
    burp();
    addFX(f.pos)
    score++;
    respawn_food();
  });
  onCollide("snake", "wall", (s, w) => {
    run_action = false;
    shake(12);
    wait(0.5, () => {go('over', score); music.stop()});
  });
  onCollide("snake", "snake", (s, t) => {
    run_action = false;
    shake(12);
    wait(0.5, () => {go('over', score); music.stop()} );
    // respawn_all();
  });

  respawn_all();
});

scene('over', (s) => {
  play('over', {volume: 0.08});
  add([
    sprite('over-text'),
    pos(width()/2.8, 200),
    origin('center'),
    scale(2),
  ]);
  add([
    sprite('oversnake'),
    pos(width()/1.3, 200),
    origin('center'),
    scale(1),
  ])

  add([
    text('YOUR SCORE:' + s, {letterSpacing: -15}),
    pos(width()/2, height()/2),
    scale(0.5),
    origin('center'),
    color(251, 255, 122),
  ])
  add([
    text('PRESS R TO RESTART', {letterSpacing: -15}),
    pos(width()/2, height()/1.8),
    scale(0.5),
    origin('center'),
    color(251, 255, 122),
  ])

  onKeyPress('r', () => {
    go('play');
  })
})

go("main");
focus();
