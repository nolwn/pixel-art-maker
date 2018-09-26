document.addEventListener("DOMContentLoaded", function(e){
  const width = 40;
  const height = 40;
  const colors = {
    "#ffffff" : true,
    "#aa0000" : false,
    "#00aa00" : false,
    "#0000aa" : false,
    "#aa00aa" : false,
    "#00aaaa" : false,
    "#aaaa00" : false
  }

  letstate = {};
  let color = "black";


  state = init(width, height, Object.keys(colors)[0], colors);
  paint(state);
  renderStudio(state)
});

function init(width, height, defaultColor, colors) {
  const rows = [];
  const state = {}
  for (let i = 0; i < width; i++) {
    let fields = [];
    for (let j = 0; j < height; j++) {
      fields.push(defaultColor);
    }
    rows.push(fields);
  }
  state.board = rows;
  state.brush = "#5a5b5d";
  state.colors = colors;
  return state;
}

function destroy(artboard) {
  while (artboard.children.length) {
    artboard.removeChild(artboard.children[0]);
  }
}

function color(x, y, {board, brush}) {
  console.log(x);
  board[y][x] = brush;
  const artboard = document.querySelector("#artboard");
  paint(state, artboard);
}

function paint({board, brush}) {
  let artboard = document.querySelector("#artboard");
  destroy(artboard);
  for (let i = 0; i < board.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < board[i].length; j++) {
      let pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.style.background = board[i][j];
      pixel.setAttribute("x", j);
      pixel.setAttribute("y", i);
      pixel.addEventListener("click", function(e) {
        color(this.getAttribute("x"), this.getAttribute("y"), state);
      });
      row.appendChild(pixel);
    }
    artboard.appendChild(row);
  }
}

function selectColor(colorWell, state) {
  let n = 0;
  for (let color in state.colors) {
    state.colors[color] = false;
  }
  let brush = colorWell.getAttribute("value");
  state.brush = brush;
  state.colors[brush] = true;
  renderStudio(state);
}

function renderStudio({ colors }){
  let colorPicker = document.querySelector("#color-picker");
  destroy(colorPicker);
  console.log(colors);
  for (let color of Object.keys(colors)) {
    let colorWell = document.createElement("div");
    colorWell.classList.add("color-well");
    console.log(color);
    colorWell.style.background = color;
    colorWell.setAttribute("value", color);

    if(!colors[color]) {
      colorWell.addEventListener("click", function(e) {
        selectColor(this, state);
      });
    } else {
      colorWell.classList.add("active");
    }
    colorPicker.appendChild(colorWell);
  }
}
