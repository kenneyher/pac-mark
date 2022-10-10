function float(speed = 5, range = {max: 5, min: 5}){
  let dir = 1;
  return {
    id: 'float',
    require: ['pos'],
    add()
    {
      range.max = this.pos.y + range.max;
      range.min = this.pos.y - range.min;
    },
    update()
    {
      if(this.pos.y < range.min){
        dir = 1;
      }else if(this.pos.y > range.max){
        dir = -1;
      }
      this.move(0, speed*dir);
    }
  }
}
export default float;