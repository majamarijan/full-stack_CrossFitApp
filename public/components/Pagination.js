import { card } from "./Cards.js";
import { toggleFocusedClass } from "./Menu.js";


export default function Pagination(data, params) {
  const pages = createPageBtn(data);
  if (pages) {
    renderPageBoxes(pages, data, params);
  }
}

function createPageBtn(data) {
  var reminder = 0, length = 0; 
  length = Math.ceil(data.length / 10);
  return calculatePageButtonsPerBox(length);
}

function calculatePageButtonsPerBox(numOfButtons) {
  const pages = document.querySelector(".pages");
  pages.innerHTML = "";
  // define total number of buttons to render,
  // range of buttons to display in box and
  // how many boxes to render according to total number / range
  // end will increment by range (start=1 end=15 | start=15 end=30...)
  var totalBtns = numOfButtons,
    start = 1,
    range = totalBtns < 15 ? totalBtns : 15, //how many btns per box will be displayed (<< and >> are excluded)
    end = range,
    inc = range,
    boxNum = Math.ceil(totalBtns / range); // number of boxes that have range num of buttons

  for (var i = 0; i < boxNum; i++) {
    // create box 
    var btnBox = document.createElement("div");
    btnBox.className = "btnRangeBox hidden";
    if (i === 0) {
      btnBox.classList.remove("hidden");
    }
    // next box will have prev btn
    if (i > 0) {
      var prevBtn = document.createElement("button");
      prevBtn.className = "prevBtn";
      prevBtn.innerHTML = "<<";
      btnBox.append(prevBtn);
    }
    //create btns in box
    for (var b = start; b <= end; b++) {
      var btn = document.createElement("button");
      btn.className = "pageBtn";
      btn.innerHTML = b;
      btnBox.append(btn);
    }
    // for next box start will start with last number of the previous box (1 - 15, 15 - 30 etc)
    start = end;
    // if start+range exceeds totalBtns num then last button will have number of totalBtns
    // else increment end by static number inc=range
    if (start + range > totalBtns) {
      end = totalBtns;
    } else {
      end = end + inc;
    }
    // for b is less then the last button add forward button >>
    if (b < end) {
      var fwdBtn = document.createElement("button");
      fwdBtn.innerHTML = ">>";
      fwdBtn.className = "fwdBtn";
      btnBox.append(fwdBtn);
    }
    pages.append(btnBox);
  }
  return pages;
}


function displayWorkouts(start, data, params) {
  var sliceStart, limit;
  sliceStart = Number(start - 1) * params.limit;
  limit = sliceStart + params.limit >= data.length ? data.length : sliceStart + params.limit;
  card.render(data, { ...params, sliceStart: sliceStart, limit: limit });
}


function renderPageBoxes(pages, data, params) {
  const boxes = Array.from(pages.children);
  var gl = {
    counter: 0,
    inc: 1,
    prev: '',
    next: ""
  };

  boxes.map((box) => {
    const current = boxes.find((b) => !b.className.includes("hidden"));
    // add focused on the first button in the array
    current.children[0].classList.add("focused");
    const currentBox = Array.from(box.children);
    currentBox.map((btn) =>
      (btn.onclick = (e) => {
          //let btn = e.target;
          // handle focus decoration on the btn
          handleFocus(currentBox, btn);
          // render next box with buttons
          if ( !btn.className.includes("fwdBtn") || !btn.className.includes("prevBtn")) {
            displayWorkouts(btn.innerHTML, data, params);
          }
            renderNextBox(boxes, btn, gl, data, params);
          
        })
    );
  });
}

function handleFocus(arr, btn) {
  toggleFocusedClass(arr, btn, "focused");
}

function renderNextBox(boxes, btn, gl, data, params) {
  if (btn.className.includes("fwdBtn")) {
    gl.prev = boxes[gl.counter];
    gl.next = boxes[gl.counter + gl.inc];
    gl.counter += gl.inc;
    gl.prev.classList.add("hidden");
    gl.next.classList.remove("hidden");
    const nextArr = Array.from(gl.next.children);
    // loop through next buttonBox remove any foucused class and then add focused class on the first btt
    nextArr.map((b) => {
      b.classList.remove("focused");
      if (nextArr[0].className.includes("prevBtn")) {
        nextArr[1].classList.add("focused");
        displayWorkouts(nextArr[1].innerHTML, data, params);
      }
    });
  }
  if (btn.className.includes("prevBtn")) {
    gl.prev = boxes[gl.counter];
    gl.next = boxes[gl.counter - gl.inc];
    gl.counter -= gl.inc;
    gl.prev.classList.add("hidden");
    gl.next.classList.remove("hidden");
    const nextArr = Array.from(gl.next.children);
    // loop through next (to left box = reverse order) and remove focused class and add focused on the last btn
    nextArr.map((b) => {
      b.classList.remove("focused");
      if (b.nextSibling && b.nextSibling.className.includes("fwdBtn")) {
        b.classList.add("focused");
        displayWorkouts(b.innerHTML, data, params);
      }
    });
  }
}

export function hidePagination() {
  const pages = document.querySelector(".pages");
  pages.innerHTML = "";
}

