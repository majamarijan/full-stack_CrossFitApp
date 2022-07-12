import Menu from './components/Menu.js';
const collapsedWorkouts = [];


window.onload = () => {
  start();
};



function start() {
  const data = loadData();
  const params = { page: 0, limit: 10 };

  data
    .then((workouts) => {
      handleError();
      //this will start timer while loading data
      createLoader(workouts, params);
    })
    .catch((err) => {
      handleError(err);
    });
}

async function render(result, params) {
  if (result) {
    // render Menu
    Menu();
    // default get all workouts renderned by alphabet
  //   var card = new Card();
  //  card.render(result, params);
  //  var pagination = new Pagination(result, card.params);
  //   pagination.createBTNS();
  renderWorkouts(result, params)
   paginationButtons(result, params);
    // handle rendering of the data by parameters set on the items in menu
    handleMenu(result, params);
  }
}


function handleMenu(data, params) {
  const pages = document.querySelector(".pages");
  const cards = document.querySelector('.cards');
  const menu = document.querySelector('.menu');
  const menuBox = document.querySelectorAll('.menuBox');
  const ids = [];
  // set id on menu items
  Array.from(menu.children).map((item, index) => item.id = `${Math.random() * 30} - ${index}`);
  const menuArr = Array.from(menuBox);
  menuArr.map(item => {
    ids.push(item.id);
    item.addEventListener('click', (e)=> {
      cards.innerHTML = '';
      collapsedWorkouts.length = 0;
      pages.innerHTML = '';
      const elem = menuArr.find(i => item.id === i.id);
      menuArr.map(i => {
        if(i === elem) {
          elem.classList.add('menu_focused');
        }
        if(i.className.includes('menu_focused') && i.id !== elem.id) {
          i.classList.remove('menu_focused');
        }
      })

      if(item.className.includes('filterByAlphabet')) {
        const letters = filterData(data,'letters');
        if(letters.length > 0) {
          const filterNameBox = createFilterBox(letters, 'nameFilter');
          if(filterNameBox.innerHTML !== '') {
            const filterBtns = document.querySelectorAll('.filterBox');
            handleFilterNameBtns(filterBtns, data, params);
          }
        }
      }
      if(item.className.includes('filterByCategory')) {
        const category = filterData(data, 'category');
        if(category.length > 0) {
          const filterWrapper = createFilterBox(category, 'category');
            if(filterWrapper.innerHTML !== '') {
              const filterBtns = document.querySelectorAll('.filterBox');
              handleFilterBtns(filterBtns, data, params, 'category', 'category_focused');
            }
        }
      }
      if(item.className.includes('filterByLevel')) {
        const level = filterData(data,'level');
        if(level.length > 0) {
          const filterWrapper = createFilterBox(level, 'level');
          const filterBtns = document.querySelectorAll('.filterBox');
          handleFilterBtns(filterBtns, data, params, 'level', 'level_focused');
        
        }
      }
      if(item.className.includes('filterByEquipment')) {
        const equipment = filterData(data,'equipment');
        if(equipment.length > 0) {
          const filterWrapper = createFilterBox(equipment, 'equipment');
          const filterBtns = document.querySelectorAll('.filterBox');
          handleFilterBtns(filterBtns, data, params, 'equipment', 'equipment_focused');
        }
      }
      if(item.className.includes('filterBySchedule')) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        const calendar = createCalendar(months);
        calendar.then(res => {
          const filterOptions = document.querySelector('.filterOptions');
          const parent = filterOptions && filterOptions.parentElement;
          parent && parent.removeChild(filterOptions);
          renderCalendar(res, months)
        })
      }
    }, false);
  });
}

function renderCalendar(calendar, months) {
  const prevBtn = calendar.querySelector('.prevMonth');
  const nextBtn = calendar.querySelector('.nextMonth');
  const tables = calendar.querySelectorAll('.table');
  const month = calendar.querySelector('.today');
  const arr = Array.from(tables);
  const btnArr = [prevBtn, nextBtn];
  const table = arr.filter(t => t.id === months[new Date().getMonth()] ? t.classList.remove('hidden') : null);
  prevBtn.onclick = (e) => handleCalendar(e, btnArr, arr, months, month, '-');
  nextBtn.onclick = (e) => handleCalendar(e, btnArr, arr, months, month, '+');
}

function handleCalendar(e, btnArr, tables, months, month, op) {
  const current = tables.findIndex( t => !t.className.includes('hidden'));
  const nextTable = tables.filter(t => t.id === months[`${op === '+' ? current + 1 : current - 1}`])[0];
  
  if(nextTable) {
    if(nextTable.id === months[0] && op === '-' || nextTable.id === months[months.length - 1] && op === '+') {
      e.target.disabled = true;
      e.target.style.pointerEvents = 'none';
    }
    if(e.target.className === 'nextMonth' && nextTable.id !== months[0]) {
      var prevBtn = btnArr.find(btn => btn.className.includes('prevMonth'));
      prevBtn.disabled = false;
      prevBtn.style.pointerEvents = 'initial';
    }
    if(e.target.className === 'prevMonth' && nextTable.id !== months[months.length - 1]) {
      var nextBtn = btnArr.find(btn => btn.className.includes('nextMonth'));
      nextBtn.disabled = false;
      nextBtn.style.pointerEvents = 'initial';
    }
    nextTable.classList.remove('hidden');
    nextTable.style.zIndex = 1000;
    tables[current].classList.add('hidden');
    month.innerHTML = `${nextTable.id} ${new Date().getFullYear()}`
  }
}

async function createCalendar(months) {
  const filterWrapper = document.querySelector('.filterWrapper');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const scheduleWrapper = document.createElement('div');
  scheduleWrapper.className = 'schedule';
  const calendar = document.createElement('div');
  calendar.className = 'calendar';
  const c_head = document.createElement('div');
  c_head.className = 'calendarHead';
  const c_body = document.createElement('div');
  c_body.className = 'calendarBody';
  const prev = document.createElement('button');
  const next = document.createElement('button');
  var year = new Date().getFullYear();
  prev.className = 'prevMonth';
  next.className = 'nextMonth';
  const toDo = document.createElement('div');
  toDo.className = 'toDo';
  const today = document.createElement('div');
  today.className = 'today';
  await calendarTable(months, days, year, c_body, today);
  c_head.append(prev, today, next);
  calendar.append(c_head, c_body);
  scheduleWrapper.append(calendar, toDo);
  filterWrapper.append(scheduleWrapper);
  return calendar
}

function calendarTable(months, days, year, body, head) {
  // create calendar
// new Date('2022/05/31').getDate() - new Date('2022/05').getUTCDate() 
// if diff is >= 0 === 31
 // else * -1 
 var tables;
 const monthData = [];
 var totalDays = 0;
  months.forEach((m,index) => {
    var monthIndex = index+1 < 10 ? '0'+(index+1) : index+1;
    var diff = new Date(`${year}/${monthIndex}/31`).getDate() - new Date(`${year}/${monthIndex}`).getUTCDate();
    if(diff >= 0) {
      totalDays = 31;
    }else {
      totalDays = diff * -1;
    }
    monthData.push({month: m, monthIndex, days: totalDays});
  });
  if(monthData.length > 0) {
    const tableData = getTableData(year, days, monthData);
    tables = createTables(tableData, body, head);
  }
 return tables;
}

function getTableData(year, days, monthData) {
  const result = [];
  const rows = 6;
  // const calcPrevMonthDays = (m)=> {
  // }
// var count = calcFirstDay();
  result.push(year);
 const days_ = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 var day = {};
  monthData.forEach(m => {
  
    var obj = {};
    obj.month = m.month;
    obj.days = days;
    obj.rows = [];
    var first = new Date(`${year}-${m.monthIndex}-01`).getDay();
    // if first === 0 Sun then first= 6 and 1 is 0 i.e. Mon
    day.start = first === 0 ? 6 : first - 1;
    day.name = days_[first];
    var count = 1;
    var start = day.start;
  
    for(var i=0; i < rows; i++) { 
      var row = []; //create row
      for(var col=0; col < days.length; col++) {
        if(i === 0) {
          // in the first row find index from where to start
          if(col >= start) {
            row[col] = count;
            count++
          }else {
            row[col] = ' ';
          }
        }else {
          row[col] = count;
          count >= m.days ? count=1 : count++;
        }
      }
      obj.rows.push(row);
    } 
    result.push(obj);
  });
  return result;
}

function createTables(data, tBody, monthTitle) {
  // for length of data + 1 create each table
  console.log(data);
  for(var d=0; d < data.length; d++) {
    var year;
    if(d === 0) {
      year = data[d];
    }else {
      const table = document.createElement('table');
      table.className = 'table hidden';
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      var tr = document.createElement('tr');
      data[d].days.forEach(item => {
        var th = document.createElement('th');
        th.innerHTML = item;
        tr.append(th);
      });
      table.id = data[d].month;
      const today = data[new Date().getMonth() + 1].month;
      monthTitle.innerHTML = today + " " + new Date().getFullYear();
      thead.append(tr);
      data[d].rows.forEach(r => {
        var tr = document.createElement('tr');
        for(var i=0; i < r.length; i++) {
          var td = document.createElement('td');
          td.innerHTML = r[i];
          tr.append(td);
        }
        tbody.append(tr);
      });
      table.append(thead);
      table.append(tbody);
      tBody.append(table);
    }
  }
  return tBody;
}


function handleFilterBtns(fbtns, workouts, params, filterName, cn) {
  const btns = Array.from(fbtns);
  btns.forEach(btn => {
    btn.onclick = (e)=> {
      collapsedWorkouts.length = 0;
      toggleFocusedClass(btns, btn, cn);
      const result = [];
      const filterName_ = e.target.innerHTML;
      workouts.map(w => {
        if(w[filterName] === filterName_) {
          result.push(w);
        }
      })
      renderPaginationAndWorkouts(result, params) 
    }
  });
}

function toggleFocusedClass(btns, btn, cn) {
  var rest = btns.filter(b => b !== btn);
  rest.forEach(r => r.classList.remove(cn));
  btn.classList.add(cn);
}

function handleFilterNameBtns(fbtns, workouts, params) {
  const btns = Array.from(fbtns);
  btns.forEach(btn => {
    btn.onclick=(e)=> {
      const result = [];
      collapsedWorkouts.length = 0;
      toggleFocusedClass(btns, btn, "letter_focused");
      var firstLetter = btn.innerHTML.toUpperCase();
      workouts.forEach(obj => {
        const name = obj.name[0].toUpperCase() + obj.name.slice(1);
        if(!btn.innerHTML.match(/[a-zA-Z]/)) {
          if(Number(obj.name[0])) {
            result.push(obj)
          }
        }
        if(name.startsWith(firstLetter)) {
          result.push(obj)
        }
      });
     
      renderPaginationAndWorkouts(result, params);
    }
  })
}

function renderPaginationAndWorkouts(result, params) {
  const pageBtns = document.querySelector('.pages');
  pageBtns.innerHTML = '';
  paginationButtons(result, params);
  renderWorkouts(result, params);
}

function filterData(workouts, filter) {
  const result = [];
  const obj= {};
  workouts.map((elem, index) => {
   const prev = workouts[index];
    const next = workouts[index + 1] !== undefined ? workouts[index + 1] : workouts[index];
    if(filter === 'letters') {
       if(prev.name[0] !== next.name[0]) {
        result.push(next.name[0]);
      }
    }
    if(filter === 'category' || filter === 'level' || filter === 'equipment') {
      const filterType = elem[filter]; 
      const index_ = workouts.findIndex(w => w[filter] === filterType);
      obj[index_] = filterType;
    }
  });
  if(obj !== {}) {
  for(var i=0; i< Object.keys(obj).length; i++) {
    var item = Object.values(obj)[i];
    result.push(item)
  }
 }
  return result
}

function createFilterBox(filterArr, filterType) {
  // create box before workoutsBox and render 'buttons'
  const wrapper = document.querySelector('.filterWrapper');
  const box = document.createElement('div');
  box.className = 'filterOptions';
  if(filterType === 'nameFilter') {
    filterArr.forEach(item => {
    const letterBox = document.createElement('div');
    letterBox.className = 'filterBox letter';
    letterBox.innerHTML = !Number(item) ? item : '-' ;
    box.append(letterBox);
  });
  }
  if(filterType === 'category' || filterType === 'level' || filterType === 'equipment') {
    box.innerHTML = '';
   filterArr.forEach(filter => {
      const filterBox = document.createElement('div');
      filterBox.className = `filterBox ${filterType}`;
      filterBox.innerHTML = filter;
      if(filter) {
        box.append(filterBox); 
      }
    })
  }
  wrapper.innerHTML = '';
  wrapper.append(box);
  return wrapper
}

function paginationButtons(data, params) {
  const pages = createPageBtn(data);
  if (pages.innerHTML !== "") {
    const pageBtns = document.querySelectorAll(".pageBtn");
    // data.length is how many items to render in workoutsBox
    handlePagination(data, params, pageBtns);
  }
}

function createPageBtn(data) {
  const pages = document.querySelector(".pages");
  var reminder = 0, length=0; // length = will be number of buttons to render
  
  (data.length / 10) % 2 !== 0 ? reminder = 1 : reminder = 0;
  length = Math.floor(data.length / 10) + reminder;
  return calculatePageButtonsPerBox(pages, length);
}

function calculatePageButtonsPerBox(pages, numOfButtons) {
  // define total number of buttons to render,
  // range of buttons to display in box and
  // how many boxes to render according to total number / range
  // end will increment by range (start=1 end=20 | start=21 end=40...)
  var totalBtns = numOfButtons,
    start = 1,
    range = totalBtns < 15 ? totalBtns : 15, //how many btns per box will be displayed (<< and >> are excluded)
    end = range,
    inc = range,
    boxNum = Math.ceil(totalBtns / range); // number of boxes that has range num of buttons

  for (var i = 0; i < boxNum; i++) {
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

function handleError(err) {
  const error = document.querySelector(".error");
  if (err) {
    error.className = "error";
    error.classList.remove("hidden");
    error.textContent = err.message;
  } else {
    if (!error.className.includes("hidden")) {
      error.innerHTML = "";
      error.classList.add("hidden");
    }
  }
}

function handlePagination(workouts, params, btns) {
  const btnArr = Array.from(btns);
  btnArr.forEach((btn) => {
    btn.onclick = (e) => {
      collapsedWorkouts.length = 0;
      // params.page => better params.display
      //  cardGroup (aka cards to render per page) and limit are start and end of slice method of data to render per page
      // for example limit is 10 then => on page 1 (button = 1) there are 10 items, page 2 -> 20 items etc
      const sliceStart = Number(e.target.innerHTML - 1) * 10;
      console.log(sliceStart)
      const limit = sliceStart + 10 >= workouts.length ? workouts.length : sliceStart + 10;
      renderWorkouts(workouts, { ...params, page: sliceStart, limit: limit });
    };
  });
  renderPageBoxes(workouts, params);
}

function renderPageBoxes(workouts, params) {
  const boxes = document.querySelectorAll(".pages .btnRangeBox");
  var counter = 0, inc = 1;
  var prev,next;

  boxes.forEach((box) => {
    const arr_ = Array.from(box.children);
    var current = arr_.filter((b) => !box.className.includes("hidden"));
     //add focus on the first button when first box is shown
    current.map((b, index) => index === 0 ?  b.classList.add("focused") : null);
    box.onclick = (e) => {
      const btn = e.target;
      // const focused = document.activeElement;
      // remove focused class on the first button 
      var arr = Array.from(box.children);
      arr.map((b) => b.className.includes("focused") ? b.classList.remove("focused") : null);
    
      if (btn.className.includes("fwdBtn")) {
        prev = boxes[counter];
        next = boxes[counter + inc];
        counter += inc;
        prev.classList.add("hidden");
        next.classList.remove("hidden");
        const nextArr = Array.from(next.children);
        // loop through next buttonBox remove any foucused class and then add focused class on the first btt
        nextArr.map( b => { 
          b.classList.remove('focused')
          if(nextArr[0].className.includes('prevBtn')) { 
            nextArr[1].classList.add("focused");
            displayNextWorkouts(nextArr[1], workouts,params)
          }
        });
      }
      if(btn.className.includes("prevBtn")) {
        prev = boxes[counter];
        next = boxes[counter - inc];
        counter -= inc;
        prev.classList.add("hidden");
        next.classList.remove("hidden");
        const nextArr = Array.from(next.children);
        // loop through next (to left box = reverse order) and remove focused class and add focused on the last btn
        nextArr.map(b =>{
          b.classList.remove('focused')
          if(b.nextSibling && b.nextSibling.className.includes('fwdBtn')){
           b.classList.add("focused");
           displayNextWorkouts(b, workouts,params)
          }
      });
      }
    };
  });
}

function displayNextWorkouts(btn, workouts, params) {
  var sliceStart = Number(btn.innerHTML - 1) * params.limit;
  const limit = sliceStart + params.limit >= workouts.length ? workouts.length : sliceStart + params.limit;
  renderWorkouts(workouts, { ...params, page: sliceStart, limit: limit });
}


function renderWorkouts(workouts, params) {
  if(!params.page || !params.limit) {
    params.page = 0;
    params.limit = 10
  }
  // clear cards wrapper
  const cards = document.querySelector(".cards");
  cards.innerHTML = "";
  // get portion of the data
  const workoutsPerPage = workouts.slice(params.page, params.limit > workouts.length ? workouts.length : params.limit);
  // display cards
  workoutsPerPage.map((workout) => {
    const allCards = displayWorkouts(workout, cards);
    if(allCards) {
      VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 400
      });
    }
  });
}

function displayWorkouts(workout, workouts) {
  const {
    name,
    level,
    equipment,
    primaryMuscles,
    secondaryMuscles,
    instructions,
    id,
  } = workout;

  // v1
  const box = document.createElement("div");
  box.className = "workout";
  box.id = id;
  const header = document.createElement("div");
  header.className = "w_header";
  const body = document.createElement("div");
  body.className = "w_body hidden";
  const main = document.createElement("div");
  main.className = "w_main";
  const footer = document.createElement("div");
  footer.className = "w_footer";
  const h1 = document.createElement("h1");
  h1.innerHTML = name;
  const span = document.createElement("span");
  span.innerHTML = `Level: ${level}`;
  const musclesBox = document.createElement("div");
  musclesBox.className = "muscles";
  const equipmentBox = document.createElement("div");
  equipmentBox.className = "equipment";
  const h3_eq = document.createElement("h3");
  h3_eq.innerHTML = "🏋️ Equipment";
  const equipment_ = document.createElement("p");
  equipment_.innerHTML = !equipment ? "No equipment" : equipment;
  equipmentBox.append(h3_eq, equipment_);
  const h3_msc = document.createElement("h3");
  h3_msc.innerHTML = "💪 Muscles to train";
  const msc = document.createElement("p");
  const array = [];
  if (primaryMuscles && primaryMuscles.length > 0) {
    primaryMuscles.map((msc) => array.push(msc));
  }
  if (secondaryMuscles && secondaryMuscles.length > 0) {
    secondaryMuscles.map((msc) => array.push(msc));
  }
  msc.innerHTML = array.join(", ");
  musclesBox.append(h3_msc, msc);
  const trainerTipsBox = document.createElement("div");
  trainerTipsBox.className = "trainerTips";
  const trainerTitle = document.createElement("span");
  trainerTitle.innerHTML = "📝 Trainer Tips: ";
  trainerTipsBox.append(trainerTitle);
  const ul = document.createElement("ul");
  ul.className = "trainer_tips";
  instructions.map((tips) => {
    const li = document.createElement("li");
    li.innerHTML = "📌 " + tips;
    ul.append(li);
  });
  const imageBox = document.createElement("div");
  imageBox.className = "images";
  var source = name.replace(/ |\//g, "_");
  const img1 = document.createElement("img");
  const img2 = document.createElement("img");
  img1.width = 200;
  img2.width = 200;
  img1.src = `./exercises/${source}/images/0.jpg`;
  img2.src = `./exercises/${source}/images/1.jpg`;
  img1.alt = name;
  img2.alt = name;
  imageBox.append(img1, img2);

  trainerTipsBox.appendChild(ul);
  header.append(h1, span);
  main.append(musclesBox, equipmentBox);
  footer.append(trainerTipsBox, imageBox);
  body.append(main, footer);
  box.append(header, body);
  workouts.append(box);
  attachEvents(header, body);
}

function attachEvents(header, body) {
  var isOpened = false;
  const parent = header.parentNode;
  const rect = parent.getBoundingClientRect();
  header.addEventListener( "click", (e) => {
    collapsedWorkouts.push(parent.id);
    
    isOpened = !isOpened; // toggle box display
   // isOpened ? body.classList.remove("hidden") : body.classList.add("hidden");
    var current, prev;

    if(collapsedWorkouts.length === 1 && isOpened) {
      current = collapsedWorkouts[0];
      const workout = document.getElementById(`${parent.id}`);
      const w_body = workout.querySelector('.w_body');
      w_body.classList.remove("hidden");
    }

    if(collapsedWorkouts.length >= 2) {
      current = collapsedWorkouts[1];
      prev = collapsedWorkouts[0];
      if(prev !== current && !isOpened) {
        //console.log('opened false')
      }
      if(prev !== current) {
       // console.log(collapsedWorkouts);
        const workout = document.getElementById(`${prev}`);
        const w_body = workout.querySelector('.w_body');
        w_body.classList.add("hidden");
        const workout1 = document.getElementById(`${current}`);
        const w_body1 = workout1.querySelector('.w_body');
        w_body1.classList.remove("hidden");
        isOpened = true;
        collapsedWorkouts.shift();
      }else {
        const workout = document.getElementById(`${parent.id}`);
        const w_body = workout.querySelector('.w_body');
        w_body.classList.add("hidden");
        isOpened=false;
        collapsedWorkouts.length = 0;
      }
    }
       if(isOpened){
        header.classList.add("header_opened");
        window.scrollTo(0, rect.y);
        }
      },
    false
    )
}

async function loadData() {
  const url = "http://localhost:3000/api/v1/workouts";
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (err) {
    return new Error("Something went wrong");
  }
}


function createLoader(res, params) {
  const loaderBox = document.querySelector(".loader");
  const loader = document.querySelector(".loader progress");
  const loadingText = document.querySelector(".loader label");
  const backdrop = document.querySelector(".backdrop");
  const headerOverlay = document.querySelector('.headerOverlay');
  var t,
    inc = 0,
    count = 0;

  t = setInterval(() => {
    if (count >= res.length) {
      clearInterval(t);
      loaderBox.classList.add("hidden");
      backdrop.classList.add("hidden");
      headerOverlay.classList.remove('hidden');
      render(res, params);
    } else {
      count = Math.round((res.length * inc) / 100);
      loader.value = inc;
      loadingText.innerHTML = inc + "%";
      inc++;
    }
  }, 10);
}



