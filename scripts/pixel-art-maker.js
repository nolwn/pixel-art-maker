var getState;

/*
 *  This listener will wait for the DOM to be loaded and then it will start
 *  initializing variables that will be used to generate state.
 */
document.addEventListener("DOMContentLoaded", function(e){
  const width = 40; // number of cells wide and
  const height = 40; // high
  const saveButton = document.querySelector("button[name=\"save\"]");
  const loadButton = document.querySelector("button[name=\"load\"]");
  const deleteButton = document.querySelector("button[name=\"delete\"]");
  const brushButton = document.querySelector("#paint-brush");
  const bucketButton = document.querySelector("#paint-bucket");
  const saveInput = document.querySelector("input[name=\"file-name\"]");
  const loadMenu = document.querySelector("#save-list");
  /*
   *  the default values for the color picker. Keys represent the color values,
   *  the boolean values indicate which color is active (true).
   */
  const colors = {
    "#000000" : true,
    "#ffffff" : false,
    "#aa0000" : false,
    "#00aa00" : false,
    "#0000aa" : false,
    "#aa00aa" : false,
    "#00aaaa" : false,
    "#aaaa00" : false
  }

  state = init(width, height, "#ffffff", colors);
  paint(state);
  renderStudio(state);
  renderSaveArea(state);

  saveButton.addEventListener("click", function(e) {
    saveFile(saveInput.value, state);
  });

  loadButton.addEventListener("click", function(e) {
    loadFile(loadMenu.options[loadMenu.selectedIndex].value, state);
  });

  deleteButton.addEventListener("click", function(e) {
    deleteFile(loadMenu.options[loadMenu.selectedIndex].value, state);
  });

  bucketButton.addEventListener("click", function(e) {
    if (!state.flood) {
      state.flood = true;
      bucketButton.classList.add("active");
      brushButton.classList.remove("active");
    }
  });

  brushButton.addEventListener("click", function(e) {
    if (state.flood) {
      state.flood = false;
      brushButton.classList.add("active");
      bucketButton.classList.remove("active");
    }
  });

  // listens for the mouseup event, and turns `edit` off.
  window.addEventListener("mouseup", function() {
    state.edit = false;
  });

  getState = function() {
    return state;
  }
});

/*
 *  sets up the default state. It accepts a width, height, default color,
 *  and an array of colors for the color picker. It returns a object.
 */
function init(width, height, defaultColor, colors) {
  const rows = []; // list of rows for the painted grid
  const state = {}

  /*
   *  Loops `height` number of times, creating arrays for each row of the
   *  painting area.
   */
  for (let i = 0; i < height; i++) {
    let fields = [];

    // pushes the default color value for each row index.
    for (let j = 0; j < width; j++) {
      fields.push(defaultColor);
    }
    rows.push(fields);
  }

  state.board = rows; // completed default painting area being added to state
  state.brush = Object.keys(colors)[0]; // state recieves a default brush color.
  state.colors = colors;
  state.edit = false; // active if mouse is held down
  state.flood = false; // flood fill tool

  return state;
}

/*
 *  takess either the painting area, or a studio area and removes all its
 *  children. No return.
 */
function destroy(artboard) {
  while (artboard.children.length) {
    artboard.removeChild(artboard.children[0]);
  }
}

/*
 *  recieves an x and y, and state and it sets the color of a triggered
 *  pixel to the brush color. No return.
 */
function color(x, y, {board, brush, edit}) {
    board[y][x] = brush;
    const artboard = document.querySelector("#artboard");
    paint(state, artboard); // repaint the new state
}

/*
 *  recives an x coordinate (integer), a y coordinate (integer), a hex value
 *  (string) and the state object. Recurses over pixels, stopping when it hits
 *  pixels that don't match the passed hex color. No return.
 */
function floodFill(x, y, underColor, state) {
  state.board[y][x] = state.brush;
  if (underColor !== state.brush) {
    if (state.board[y][x - 1] === underColor) {
      floodFill(x - 1, y, underColor, state);
    }
    if (y < state.board.length - 1 && state.board[y + 1][x] === underColor) {
      floodFill(x, y + 1, underColor, state);
    }
    if (state.board[y][x + 1] === underColor) {
      floodFill(x + 1, y, underColor, state);
    }
    if (y > 0 && state.board[y - 1][x] === underColor) {
      floodFill(x, y - 1, underColor, state);
    }
  }
}

/*
 *  recieves a state and renders its artboard on the screen. No return.
 */
function paint({board, brush, edit}) {
  let artboard = document.querySelector("#artboard");
  destroy(artboard); // clears old artboard.

  /*
   *  loops over the board length, which represents the number of rows in the
   *  paint area, and generates row dives to hold our pixels.
   */
  for (let i = 0; i < board.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    /*
     *  for each cell in the board rows, creates and colors pixel elements and
     *  sets them each up to be edited.
     */
    for (let j = 0; j < board[i].length; j++) {
      let pixel = document.createElement("div");

      pixel.className = "pixel";
      pixel.style.background = board[i][j]; // retrieve strored color value
      pixel.setAttribute("value", board[i][j]);
      pixel.setAttribute("x", j); // for identifying a pixels grid position
      pixel.setAttribute("y", i); //                "

      /*
       *  registers the mouse down event, makes our state editable, meaning the
       *  mouse hovering over a pixel will paint it, and paints the pixel that
       *  was mousedowneded on.
       */
      pixel.addEventListener("mousedown", function(e) {
        let x = this.getAttribute("x");
        let y = this.getAttribute("y");
        if (!state.flood) { // behavior for brush tool
          state.edit = true;
          color(x, y, state);
        } else { // behavior for flood fill tool
          floodFill(parseInt(x, 10),
                    parseInt(y, 10),
                    this.getAttribute("value"),
                    state);
          paint(state);
        }
      });

      /*
       *  when the mouse enters a pixel, checks if state is editable and, if it
       *  is, runs color() on that pixel
       */
      pixel.addEventListener("mouseenter", function(e) {
        if(state.edit === true) {
          color(this.getAttribute("x"), this.getAttribute("y"), state);
        }
      });

      row.appendChild(pixel); // pixel done, adds it to row
    }

    artboard.appendChild(row); // row done, adds it to the artbaord.
  }
}

/*
 *  sets all of the color picker colors to false (inactive).
 */
function resetColors({ colors }) {
  for (let color in colors) {
    state.colors[color] = false;
  }
}

/*
 *  takes colorWell (a node), and state and sets its color value to the state's
 *  brush. No return.
 */
function selectColor(colorWell, state) {
  let brush = colorWell.getAttribute("value");

  resetColors(state); // clears previously active color

  state.brush = brush;
  state.colors[brush] = true;
  renderStudio(state); // redraw the studio with the new active color.
}

/*
 *  takes a color value and state and sets the brush color to equal the color
 *  value. Differs from selectColor() because it is called to deal with a
 *  user inputted color, rather than one picked from the color wells. No return.
 */
function setColor(color, state) {
  resetColors(state);
  state.brush = color;
  renderStudio(state); // to remove active color well from UI
}

/*
 *  takes state and uses it to draw the studio UI. No return.
 */
function renderStudio({ colors }){
  let colorPicker = document.querySelector("#color-picker");
  let colorSetter = document.querySelector("#color-setter");

  destroy(colorPicker); // clear previous studio state

  /*
   *  reads the default colors from the state object and creates color wells
   *  for the user to select from.
   */
  for (let color of Object.keys(colors)) {
    let colorWell = document.createElement("div"); // each color well

    colorWell.classList.add("color-well");
    colorWell.style.background = color;
    colorWell.setAttribute("value", color); // for capturing the value later

    if(!colors[color]) { // adds a listener for non-active colors
      colorWell.addEventListener("click", function(e) {
        selectColor(this, state);
      });
    } else { // marks a color as active (no listener needed)
      colorWell.classList.add("active");
    }

    colorPicker.appendChild(colorWell);
  }

  // For user defined colors, fires on input change
  colorSetter.addEventListener("change", function(e) {
    const colorRe = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // tests for correct format
    if (colorRe.test(this.value)) setColor(this.value, state);
  });
}

/*
 *  takes the state and draws the save area of the UI. No return.
 */
function renderSaveArea(state) {
  const saveFiles = [];
  const saveList = document.querySelector("#save-list");
  const saveButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  let fileName = document.querySelector("input[name=\"fileName\"]");

  destroy(saveList); // clear the previous state

  /*
   *  Goes through all the items in localStorage looking entries with the
   *  pamfile_ prefix. Pushes them into an array without the prefix.
   */
  for (let item in localStorage) {
    if (hasFileTag(item)) {
      saveFiles.push(removeFileTag(item));
    }
  }

  // checks the saved file array we just made to see if anything was added.
  if (saveFiles.length) {
    saveList.disabled = false;
    for (let i = 0; i < saveFiles.length; i++) { //
      let menuItem = document.createElement("option"); // saved file dropdown

      menuItem.innerHTML = saveFiles[i]; // add filenames to the menu
      menuItem.value = saveFiles[i];

      saveList.appendChild(menuItem); // push the item into the list!
    }
  } else { // if there weren't saved items, create default menu.
    let menuItem = document.createElement("option");
    menuItem.innerHTML = "No Saved Files...";
    saveList.appendChild(menuItem);
    saveList.disabled = true;
  }
}

 /*
  *  prepends strings so that they can be identified in localStorage. Retruns a
  *  string.
  */
function prependFile(file) {
  return "pamfile_" + file;
}

/*
 *  takes a string, removes prepended file tag. Returns a string.
 */
function removeFileTag(file) {
  return file.slice(8);
}

/*
 *  takes a string, checks for prepended tag. Returns a boolean.
 */
function hasFileTag(file) {
  return file.slice(0, 8) === "pamfile_";
}

/*
 *  takes a string and state, puts a stringified copy of state's board property
 *  into localStorage. No return.
 */
function saveFile(fileName, { board }) {
    const loadMenu = document.querySelector("#save-list");

    // loadMenu.disabled = false;
    localStorage.setItem(prependFile(fileName), JSON.stringify(board));
    renderSaveArea(state);
}

/*
 *  retrieves JSON string from local storage which represents a board state.
 *  Loads it into the current state and paints. No return.
 */
function loadFile(fileName, state) {
  const illustration = localStorage.getItem(prependFile(fileName));
  const saveInput = document.querySelector("input[name=\"file-name\"]");

  state.board = JSON.parse(illustration);
  saveInput.value = fileName;
  paint(state);
}

/*
 *  takes a string that corresponds to a file in localStorage, deletes that
 *  file. No return.
 */
function deleteFile(fileName, state) {
  const loadMenu = document.querySelector("#save-list");

  localStorage.removeItem(prependFile(fileName));
  destroy(loadMenu);
  renderSaveArea(state);
  paint(state);
}
