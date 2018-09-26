var board;

document.addEventListener("DOMContentLoaded", function(e){
  const artboard = document.querySelector("#artboard");
  const width = 20;
  const height = 20;
  const defaultColor = "#ffffff";

  let board = [];
  let color = "black";

  board = init(20, 20, "white");
  paint(board, artboard);
});

function init(width, height, defaultColor) {
  const rows = [];
  for (let i = 0; i < width; i++) {
    let fields = [];
    for (let j = 0; j < height; j++) {
      fields.push(defaultColor);
    }
    rows.push(fields);
  }
  return rows;
}

function destroy(board, artboard) {
  while (artboard.children.length) {
    artboard.removeChild(artboard.children[0]);
  }
}

function paint(board, artboard) {
  destroy(board, artboard);
  for (let i = 0; i < board.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < board[i].length; j++) {
      let pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.style.background = board[i][j];
      row.appendChild(pixel);
    }
    artboard.appendChild(row);
  }
}
