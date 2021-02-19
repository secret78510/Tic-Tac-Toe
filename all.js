(function () {
  let newStart;
  document.querySelector('.startSelect-body').addEventListener('click', function (e) {
    newStart = new game();
    newStart.start(e)
  })
  document.querySelectorAll('.board-body .cell').forEach(item => {
    item.addEventListener('click', function (e) {
      newStart.addIcon(e)
    })
  })
  document.querySelector('.end-body').addEventListener('click', function () {
    newStart.init();
  })
})()
class game {
  circle = document.querySelector('.board-header .circle');
  times = document.querySelector('.board-header .times');
  startSelect = document.querySelector('.startSelect-container');
  endContainer = document.querySelector('.end-container');
  user = document.querySelector('.board-header');
  board = document.querySelector('.board-body')
  cells = document.querySelectorAll('.board-body .cell')
  win = document.querySelector('.end-container .win');
  lose = document.querySelector('.end-container .lose');
  tie = document.querySelector('.end-container .tie');
  mp3 = document.querySelector('.mp3');
  //用來記錄使用者是誰
  userIcon = false;
  //計算次數
  num = 0;
  start(e) {
    const className = e.target.className;
    //關掉選擇畫面
    this.startSelect.classList.add('close')
    //重新載入音樂
    this.mp3.load();
    //播放
    this.mp3.play();
    if (className === 'circle' || className === 'far fa-circle') {
      this.times.classList.remove('active');
      this.circle.classList.add('active');
      this.userIcon = 'circle';
    } else {
      this.circle.classList.remove('active');
      this.times.classList.add('active')
      this.userIcon = 'times';
      this.bot('first');
    }
  }
  addIcon(e) {
    //機器人先手跟後手順序
    let icon;
    if (this.circle.classList.contains('active')) {
      e.target.children[0].className = 'circle far fa-circle';
      icon = 'circle far fa-circle';
    } else {
      e.target.children[0].className = 'times fas fa-times';
      icon = 'times fas fa-times';
    }
    //禁止目標再次被點擊
    e.target.style.pointerEvents = 'none';
    //井字盤 不能再被點擊 
    this.board.style.pointerEvents = 'none';
    this.num += 1;
    //如果有贏家就回傳
    if (this.checkWinner(icon)) {
      return
    } else {
      this.bot(this.userIcon)
    }
  }
  bot(userIcon) {
    let botIcon;
    //機器人順序要跟user相反
    if (userIcon === 'circle') {
      botIcon = 'times fas fa-times';
    } else {
      botIcon = 'circle far fa-circle';
    }
    //紀錄 還沒被點擊的cell
    let arr = [];
    this.cells.forEach(item => {
      if (!item.children[0].className) {
        arr.push(item)
      }
    })
    //當cell填滿就回傳
    if (arr.length === 0) { return }
    //隨機還沒被點擊的cell
    let randomCell = arr[Math.floor(Math.random() * arr.length)];
    //切換電腦 
    this.times.classList.toggle('active');
    this.circle.classList.toggle('active');
    setTimeout(() => {
      //加入icon
      randomCell.children[0].className = botIcon;
      //禁止點擊
      randomCell.style.pointerEvents = 'none';
      //井字盤 可以再次點擊
      this.board.style.pointerEvents = 'auto';
      this.num += 1;
      if (this.checkWinner(botIcon)) {
        return
      } else {
        //切換為USER
        this.times.classList.toggle('active');
        this.circle.classList.toggle('active');
      }

    }, 800)
  }
  checkWinner(icon) {
    const cells = this.cells;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg.append(line);
    //先算每個cell寬度
    const cellWidth = this.cells[0].offsetWidth;
    const borderWidth = this.cells[0].clientTop * 2;
    const presetHeight = cellWidth / 2;
    for (let x = 0; x < 3; x++) {
      if (cells[x * 3].children[0].className === icon &&
        cells[x * 3 + 1].children[0].className === icon &&
        cells[x * 3 + 2].children[0].className === icon) {
        line.setAttribute('x1', presetHeight)
        line.setAttribute('x2', cellWidth * 2 + presetHeight)
        line.setAttribute('y1', cellWidth * x + presetHeight + borderWidth)
        line.setAttribute('y2', cellWidth * x + presetHeight + borderWidth)
        this.board.append(svg);
        this.end(icon);
        return true
      }
    }
    for (let y = 0; y < 3; y++) {
      if (cells[y].children[0].className === icon &&
        cells[y + 3].children[0].className === icon &&
        cells[y + 6].children[0].className === icon) {
        line.setAttribute('x1', presetHeight + cellWidth * y)
        line.setAttribute('x2', presetHeight + cellWidth * y)
        line.setAttribute('y1', presetHeight)
        line.setAttribute('y2', presetHeight + cellWidth * 2 + borderWidth)
        this.board.append(svg);
        this.end(icon);
        return true
      }
    }
    if (cells[0].children[0].className === icon && cells[4].children[0].className === icon &&
      cells[8].children[0].className === icon) {
      line.setAttribute('x1', presetHeight)
      line.setAttribute('x2', presetHeight + cellWidth * 2)
      line.setAttribute('y1', presetHeight)
      line.setAttribute('y2', presetHeight + cellWidth * 2 + borderWidth)
      this.board.append(svg);
      this.end(icon);
      return true
    } else if (cells[2].children[0].className === icon && cells[4].children[0].className === icon &&
      cells[6].children[0].className === icon) {
      line.setAttribute('x1', presetHeight + cellWidth * 2)
      line.setAttribute('x2', presetHeight)
      line.setAttribute('y1', presetHeight)
      line.setAttribute('y2', presetHeight + cellWidth * 2 + borderWidth)
      this.board.append(svg);
      this.end(icon);
      return true
    }
    this.isTie();
    return false
  }
  end(icon) {
    setTimeout(() => {
      this.endContainer.classList.remove('close')
      if (icon.includes(this.userIcon)) {
        this.win.style.display = 'block';
      } else {
        this.lose.style.display = 'block';
      }
      this.mp3.pause();
    }, 1000)
  }
  isTie() {
    if (this.cells.length === this.num) {
      this.endContainer.classList.remove('close')
      this.tie.style.display = 'block';
      this.mp3.pause();
    }
  }
  init() {
    this.endContainer.classList.add('close');
    this.startSelect.classList.remove('close')
    this.cells.forEach(item => {
      if (item.children[0].className) {
        item.children[0].className = '';
        item.style.pointerEvents = 'auto';
      }
    })

    //如果有svg標籤就回收
    for (let i = 0; i < this.board.children.length; i++) {
      if (this.board.children[i].tagName === 'svg') {
        this.board.removeChild(this.board.children[i])
      }
    }
    this.board.style.pointerEvents = 'auto';
    this.tie.style.display = 'none';
    this.win.style.display = 'none';
    this.lose.style.display = 'none';

  }
}
