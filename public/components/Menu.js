import { card } from './Cards.js';
import Pagination from './Pagination.js';
import { calendar } from './Calendar.js';
import uuid from '../utils/uuid.js';

const images = [
  {
    name: "menuBox filterAll",
    width: "30",
    title: "All",
    alt: "all seach",
    src: "./assets/all.svg",
  },
  {
    name: "menuBox filterByAlphabet",
    width: "30",
    title: "A-Z",
    alt: "alphabet seach",
    src: "./assets/name_search-icon.svg",
  },
  {
    name: "menuBox filterByCategory",
    width: "30",
    title: "Category",
    alt: "category",
    src: "./assets/category.svg",
  },
  {
    name: "menuBox filterByLevel",
    width: "30",
    title: "Level",
    alt: "level",
    src: "./assets/level_icon.svg",
  },
  {
    name: "menuBox filterByEquipment",
    width: "30",
    title: "Equipment",
    alt: "equipment",
    src: "./assets/equipment_icon.svg",
  },
  {
    name: "menuBox filterBySchedule",
    width: "30",
    title: "Schedule",
    alt: "schedule",
    src: "./assets/schedule.svg",
  },
];

const n = images.length;

export default class Menu {
  static menuHTML = document.querySelector(".menu");
  // n = number of items inmenu
  static create() {
    for (var i = 0; i < n; i++) {
      const box = document.createElement("div");
      const img = document.createElement("img");
      const span = document.createElement("span");

      box.className = images[i].name;
      img.src = images[i].src;
      img.alt = images[i].alt;
      img.title = images[i].title;
      img.width = images[i].width;
      span.innerHTML = images[i].title;

      box.id = uuid();
      box.append(img, span);
      this.menuHTML.append(box);
    }
  }

  static handleMenu(data, params) {
    const menu = document.querySelector(".menu");
    const menuBox = document.querySelectorAll(".menuBox");
   
    const menuArr = Array.from(menuBox);
    menuArr.map((item) => {
      // focus on the first menu btn => all
      menuArr[0].classList.add('menu_focused');
      // click event
      item.addEventListener("click", (e) => {
        if(menu.className.includes('menuShow')) {
          menu.classList.remove('menuShow')
        }
        clearContent();
        MenuUtils.addFocus(menuArr, item);
        MenuUtils.filterItems(data, item, params);
      }, false);
    }); //menuArr
  }

}

function clearContent() {
  const pages = document.querySelector(".pages");
  const cards = document.querySelector(".cards");
  const schedule = document.querySelector('.schedule');
  const filters = document.querySelector('.filterWrapper');
  filters.innerHTML = '';
 cards.innerHTML = "";
 pages.innerHTML = "";
 document.querySelector('.search').classList.add('hidden');
 card.hide();
 if(schedule) schedule.innerHTML = '';
}



class MenuUtils {

  static addFocus(menuArr, item) {
    const elem = menuArr.find((i) => item.id === i.id);
    menuArr.map((i) => {
      if (i === elem) {
        elem.classList.add("menu_focused");
      }
      if (i.className.includes("menu_focused") && i.id !== elem.id) {
        i.classList.remove("menu_focused");
      }
    });
  }

  static filterData(data, filter) {
    const result = [];
    const obj= {};
    data.map((elem, index) => {
     const prev = data[index];
      const next = data[index + 1] !== undefined ? data[index + 1] : data[index];
      if(filter === 'letters') {
         if(prev.name[0] !== next.name[0]) {
          result.push(next.name[0]);
        }
      }
      if(filter === 'category' || filter === 'level' || filter === 'equipment') {
        const type = elem[filter]; 
        const index_ = data.findIndex(d => d[filter] === type);
        obj[index_] = type;
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

  static filterItems(data, item, params) {

    if(item.className.includes('filterAll')) {
      document.querySelector('.search').classList.remove('hidden');
      card.render(data, params);
      Pagination(data, params);
    }

    if(item.className.includes('filterByAlphabet')) {
      const letters = MenuUtils.filterData(data,'letters');
      if(letters.length > 0) {
        const filterNamesBox = createFilterBox(letters, 'nameFilter');
        if(filterNamesBox.innerHTML !== '') {
          const filterBtns = document.querySelectorAll('.filterBox');
          MenuUtils.renderFirstFilter(filterBtns, 'letters', 'letter_focused', data, params);
          handleFilterNameBtns(filterBtns, data, params);
        }
      }
    }
    if(item.className.includes('filterByCategory')) {
      const category = MenuUtils.filterData(data, 'category');
      if(category.length > 0) {
        const filterWrapper = createFilterBox(category, 'category');
          if(filterWrapper.innerHTML !== '') {
            const filterBtns = document.querySelectorAll('.filterBox');
            MenuUtils.renderFirstFilter(filterBtns, 'category', 'category_focused', data, params);
            handleFilterBtns(filterBtns, data, params, 'category', 'category_focused');
          }
      }
    }
    if(item.className.includes('filterByLevel')) {
      const level = MenuUtils.filterData(data,'level');
      if(level.length > 0) {
        const filterWrapper = createFilterBox(level, 'level');
        const filterBtns = document.querySelectorAll('.filterBox');
        MenuUtils.renderFirstFilter(filterBtns, 'level', 'level_focused', data, params);
        handleFilterBtns(filterBtns, data, params, 'level', 'level_focused');
      
      }
    }
    if(item.className.includes('filterByEquipment')) {
      const equipment = MenuUtils.filterData(data,'equipment');
      if(equipment.length > 0) {
        const filterWrapper = createFilterBox(equipment, 'equipment');
        const filterBtns = document.querySelectorAll('.filterBox');
        MenuUtils.renderFirstFilter(filterBtns, 'equipment','equipment_focused', data, params);
        handleFilterBtns(filterBtns, data, params, 'equipment', 'equipment_focused');
      }
    }
    if(item.className.includes('filterBySchedule')) {
      const schedule = document.querySelector('.schedule');
      if(schedule) {
        const wrapper = document.querySelector('.wrapper');
        wrapper.removeChild(schedule);
      }
        const cal = calendar.createCalendar();
        cal.then( res => {
          const filterOptions = document.querySelector('.filterOptions');
          const parent = filterOptions && filterOptions.parentElement;
          parent && parent.removeChild(filterOptions);
          calendar.renderCalendar();
          calendar.scheduleDate();
        })
      }

  }

  static renderFirstFilter(filterBtns,filterName, cn, data, params) {
    const arr = Array.from(filterBtns);
    const result = [];
   toggleFocusedClass(arr, arr[0], cn);
    if(filterName !== 'letters'){
      const filterName_= arr[0].innerHTML;
      data.map(d => {
        if(d[filterName] === filterName_) {
          result.push(d)
        }
      });
      card.render(result, params);
      Pagination(result, params);
    }else {
      card.render(data, params);
      Pagination(data, params);
    }
  }

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

function handleFilterNameBtns(fbtns, data, params) {
  const btns = Array.from(fbtns);
  btns.forEach(btn => {
    btn.onclick=(e)=> {
      const result = [];
      toggleFocusedClass(btns, btn, "letter_focused")
      var firstLetter = btn.innerHTML.toUpperCase();
      data.forEach(obj => {
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
      const pageBtns = document.querySelector('.pages');
      pageBtns.innerHTML = '';
      card.render(result, params);
      Pagination(result, params);
    }
  })
}

function handleFilterBtns(fbtns, data, params, filterName, cn) {
  const btns = Array.from(fbtns);
  btns.forEach(btn => {
    btn.onclick = (e)=> {
      const result = [];
      toggleFocusedClass(btns, btn, cn);
      const filterName_ = e.target.innerHTML;
      data.map(d => {
        if(d[filterName] === filterName_) {
          result.push(d);
        }
      })
      const pageBtns = document.querySelector('.pages');
      pageBtns.innerHTML = '';
      card.render(result, params);
      Pagination(result, params);
    }
  });
}

export function toggleFocusedClass(btns, btn, cn) {
  var rest = btns.filter(b => b !== btn);
  rest.forEach(r => r.classList.remove(cn));
  btn.classList.add(cn);
}


export function menuHandler() {
  const hamburger = document.querySelector('.menuHandler');
  const menu = document.querySelector('.menu');
  hamburger.onclick = (e)=> {
    menu.className.includes('menuShow') ? menu.classList.remove('menuShow') : menu.classList.add('menuShow');
  }
}