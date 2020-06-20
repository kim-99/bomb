<template>
  <div class="game-main" :style="{ width: wh*gameData.width+'px'}" v-if="total && total!=0 && arr.length != 0">
    <span v-for="item in total" :key="item" :class="{ blue: coordinateSpan(item).type >= 4, white: coordinateSpan(item).type <=3 }"
    @mousedown="mousedownFun($event,coordinateSpan(item))">
      <i class="el-icon-setting bomb" v-if="coordinateSpan(item).type == 3"></i>
      <i class="fa fa-flag flag" v-if="coordinateSpan(item).type == 5"></i>
      <i class="fa fa-question question" v-if="coordinateSpan(item).type == 6"></i>
      {{ coordinateSpan(item).type == 2 ? coordinateSpan(item).value : '' }}
    </span>
  </div>
</template>

<script>

export default {
  props: {//父传子数据
    gameData: {
      type: Object,
      default(){
        return {
          width: 0,
          height: 0,
          bombCount: 0,
        }
      }
    },
  },
  data(){//储存数据
    return {
      wh: 25,//一个格子宽高
      arr: [],//二维数组，一个元素对应一个span对象
      /*  
      [
        [{},{},{}],
        [{},{},{}],
        [{},{},{}],
      ]
      */
    };
  },
  methods: {//储存方法
    coordinateSpan(item){//返回当前坐标的span对应的数据对象返回
      var x = (item - 1) % this.gameData.width;//得到x坐标
      var y = Math.floor((item - 1) / this.gameData.width);//得到一个y坐标
      return this.arr[y][x];
    },
    mousedownFun(e,data){//e表示事件对象;data表示当前span的数据对象
    if(!this.isStart){ //按下后isstart变为true，开始计时
      this.$store.commit('updateIsStart',{ isStart:true, });
    }
    
      var button = e.button;
      if(button<=1){//左键 （翻开动作）
        var x = data.x;
        var y = data.y;

        this.recursionFun({
          x,
          y
        }, true)
      }
      else if(button == 2){//右键（未翻开动作） - 探测（旗），问号
        //只有type不等于1,2,3的时候才能进行切换- 切换 蓝空白4，旗5，问号6，
        if(data.type > 3){
          if(data.type == 4){//变成旗帜
            if(this.bombCount > 0){
              this.$store.commit('updateBombCount',{
                bombCount: this.bombCount - 1,
              });
              data.type = 5;
            }
          }
          else if(data.type == 5){//变成问号
            this.$store.commit('updateBombCount',{
              bombCount: this.bombCount + 1,
            });
            data.type = 6;
          }
          else{
            data.type = data.type == 6 ? 4 : data.type+1;
          }
        };
      }
    },
    recursionFun(coordinate, bool){//coordinate表示坐标；此函数作用，对当前坐标的span做个判断，并对其周围的span判断; bool表示是否是鼠标点击的当前span数据对象
      var x = coordinate.x;
      var y = coordinate.y;
      var data = this.arr[y][x];
      if(data.type == 4 || data.type == 6){//判断是否是蓝空白跟问号，是可以被判断的
        if(bool){//如果是当前点击的span
          console.log(data.isBomb,`x:${x},y:${y}`)
          if(data.isBomb){//如是雷
            this.bombShowResult();
            return;
          }
          else{//判断周边八个是否有雷
            var count = this.countFun(x,y);
            if(count == 0){//当前的空白
              data.type = 1;
              //周边8个span
              for(var c_x = x - 1; c_x <= x + 1; c_x++){
                for(var c_y = y -1; c_y <= y + 1; c_y++){
                  //console.log(`c_x:${c_x},c_y:${c_y}`,11)
                  if(c_x == x && c_y == y){//跳过此次循环进入下次循环
                    continue;
                  }
                  else if(c_x >= 0 && c_y >= 0 && this.arr[c_y] != null && this.arr[c_y][c_x] != null && this.arr[c_y][c_x].isBomb == false){
                    console.log(`c_x:${c_x},c_y:${c_y}`,11)
                    this.recursionFun({
                      x: c_x,
                      y: c_y,
                    })
                  }
                }
              }
              
            }
            else{
              data.type = 2;
              data.value = count;
            }
          }
        }
        else{//如果是span的周边的八个
          var count = this.countFun(x,y);
          if(count == 0){//当前的空白
            data.type = 1;
            //周边8个span
            for(var c_x = x - 1; c_x <= x + 1; c_x++){
              for(var c_y = y -1; c_y <= y + 1; c_y++){
                //console.log(`c_x:${c_x},c_y:${c_y}`,22)
                if( (c_x != x || c_y != y) && c_x >= 0 && c_y >= 0 && this.arr[c_y] != null && this.arr[c_y][c_x] != null && this.arr[c_y][c_x].isBomb == false){
                  console.log(`c_x:${c_x},c_y:${c_y}`,22)
                  this.recursionFun({
                    x: c_x,
                    y: c_y,
                  })
                }
              }
            }
            
          }
          else{
            data.type = 2;
            data.value = count;
          }
        };
        
      }
    },
    countFun(x,y){//统计当前x,y周边8个span的雷数量
      var count = 0;
      for(var c_x = x - 1; c_x <= x + 1; c_x++){
        for(var c_y = y -1; c_y <= y + 1; c_y++){
          if( (c_x != x || c_y != y) && c_x >= 0 && c_y >= 0 && this.arr[c_y] != null && this.arr[c_y][c_x] != null && this.arr[c_y][c_x].isBomb){
            console.log(`c_x:${c_x},c_y:${c_y}`,33)
            count++;
          }
        }
      }
      return count;
    },
    bombShowResult(){
      this.arr.forEach(item => {
        item.forEach(item=>{
          if(item.isBomb){
            item.type=3;
          }
        })
      });
      this.$alert('游戏结束', '结束', {
        confirmButtonText: '确定',
        callback: action => {
          this.arr=[];
          this.$emit('gameOver');
          this.$store.commit('updateIsStart',{ isStart:false}); //计时暂停
        }
      });
 
    },
  },
  computed: {//计算属性
    total(){//总的方块数
      return this.gameData.width*this.gameData.height;
    },
    isStart(){//是否开始计时
      return this.$store.getters.isStart;
    },
    bombCount(){
      return this.$store.getters.bombCount;
    }
  },
  watch: {//监听
    total(newval,oldval){
      var arr = [];
      for(var y=0; y<this.gameData.height; y++){
        arr.push([]);
        for(var x = 0; x<this.gameData.width; x++){
          arr[y].push({
            type: 4,//当前的类型,翻开三种情况：空白 1，数字 2，雷 3；此值未翻开三种情况：蓝空白 4，探测(旗) 5，问号 6
            value: null,//值，只有type==2的时候才有此值，表示周边雷的数量
            isBomb: false,//是否是雷
            x,//当前数据所在的坐标
            y,//当前数据所在的坐标
          });
        }
      }
      
      var coordinateArr = [];//所有的坐标数组
      for(var i = 0; i < newval; i++){//所有位置的雷的坐标
        var x = i % this.gameData.width;//得到x坐标
        var y = Math.floor( i / this.gameData.width);//得到一个y坐标
        coordinateArr.push({ x, y });
      };
      //var coordinateBombArr = [];//标记有雷的坐标数组
      for(var j = 0; j < this.gameData.bombCount; j++){//雷的数量为循环次数
        var pos = Math.floor(coordinateArr.length * Math.random());//随机位置0到coordinateArr.length-1
        var x = coordinateArr[pos].x;
        var y = coordinateArr[pos].y;
        //coordinateBombArr.push(coordinateArr[pos]);
        coordinateArr.splice(pos,1);
        arr[y][x].isBomb = true;//将对应坐标的数据标记为有雷
      }


      this.arr = arr;
      console.log(arr)
    },
  },
  components: {//注册组建
    
  },
}
</script>

<style lang="scss">
.game-main{
  display: flex;
  flex-flow: wrap;
  margin: 0 auto;
  span{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 1px solid #000;
    box-sizing: border-box;
  }
  .blue{
    background: blue;
  }
  .white{
    background: #fff;
  }
  .bomb{
    color: #000;
  }
  .flag{
    color: red;
  }
  .question{
    color: #fff;
  }
}
</style>
