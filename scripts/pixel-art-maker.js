document.addEventListener("DOMContentLoaded", function(e){
  const artboard = document.querySelector("#artboard");
  const width = 20;
  const height = 20;

  letstate = {};
  let color = "black";

  state = init(20, 20, "white");
  paint(state, artboard);
});

function init(width, height, defaultColor) {
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
  state.brush = "#4400ff";
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

function paint({board, brush}, artboard) {
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
        // console.log(this.getAttribute("x"), this.getAttribute("y"));
        color(this.getAttribute("x"), this.getAttribute("y"), state);
        // console.log(board, brush);
      });
      row.appendChild(pixel);
    }
    artboard.appendChild(row);
  }
}
