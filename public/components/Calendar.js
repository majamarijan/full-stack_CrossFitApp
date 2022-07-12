import uuid from '../utils/uuid.js';
import {todo} from './ToDo.js';

class Calendar {
  constructor() {
    this.months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    this.days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    this.year = new Date().getFullYear();
  }

  async createCalendar() {
    const wrapper = document.querySelector(".wrapper");
    const scheduleWrapper = document.createElement("div");
    scheduleWrapper.className = "schedule";
    const calendar = document.createElement("div");
    calendar.className = "calendar";
    const c_head = document.createElement("div");
    c_head.className = "calendarHead";
    const c_body = document.createElement("div");
    c_body.className = "calendarBody";
    const prev = document.createElement("button");
    const next = document.createElement("button");
    prev.className = "prevMonth";
    next.className = "nextMonth";
    const todayDIV = document.createElement("div");
    todayDIV.className = "today";
    const toDo = todo.build();
    await this.calendarTable(c_body, todayDIV);
    c_head.append(prev, todayDIV, next);
    calendar.append(c_head, c_body);
    scheduleWrapper.append(calendar, toDo);
    wrapper.append(scheduleWrapper);
    return calendar;
  }

  renderCalendar() {
    const prevBtn = document.querySelector(".prevMonth");
    const nextBtn = document.querySelector(".nextMonth");
    const tables = document.querySelectorAll(".table");
    const month = document.querySelector(".today");
    const arr = Array.from(tables);
    const btnArr = [prevBtn, nextBtn];
    const table = arr.filter((t) =>
      t.id === this.months[new Date().getMonth()]
        ? t.classList.remove("hidden")
        : null
    );
    prevBtn.onclick = (e) => this.handleCalendar(e, btnArr, arr, month, "-");
    nextBtn.onclick = (e) => this.handleCalendar(e, btnArr, arr, month, "+");
  }

  handleCalendar(e, btnArr, tables, month, op) {
    const current = tables.findIndex((t) => !t.className.includes("hidden"));
    const nextTable = tables.filter(
      (t) => t.id === this.months[`${op === "+" ? current + 1 : current - 1}`]
    )[0];

    if (nextTable) {
      if (
        (nextTable.id === this.months[0] && op === "-") ||
        (nextTable.id === this.months[this.months.length - 1] && op === "+")
      ) {
        e.target.disabled = true;
        e.target.style.pointerEvents = "none";
      }
      if (
        e.target.className === "nextMonth" &&
        nextTable.id !== this.months[0]
      ) {
        var prevBtn = btnArr.find((btn) => btn.className.includes("prevMonth"));
        prevBtn.disabled = false;
        prevBtn.style.pointerEvents = "initial";
      }
      if (
        e.target.className === "prevMonth" &&
        nextTable.id !== this.months[this.months.length - 1]
      ) {
        var nextBtn = btnArr.find((btn) => btn.className.includes("nextMonth"));
        nextBtn.disabled = false;
        nextBtn.style.pointerEvents = "initial";
      }
      nextTable.classList.remove("hidden");
      nextTable.style.zIndex = 1000;
      tables[current].classList.add("hidden");
      const tdList = nextTable.querySelectorAll('td');
      const list = Array.from(tdList);
      this.scheduleDate({list: list, id: nextTable.id});
      month.innerHTML = `${nextTable.id} ${new Date().getFullYear()}`;
    }
  }

  calendarTable(body, head) {
    // create calendar
    // new Date('2022/05/31').getDate() - new Date('2022/05').getUTCDate()
    // if diff is >= 0 === 31
    // else * -1
    var tables;
    const monthData = [];
    var totalDays = 0;
    this.months.forEach((m, index) => {
      var monthIndex = index + 1 < 10 ? "0" + (index + 1) : index + 1;
      var diff =
        new Date(`${this.year}/${monthIndex}/31`).getDate() -
        new Date(`${this.year}/${monthIndex}`).getUTCDate();
      if (diff >= 0) {
        totalDays = 31;
      } else {
        totalDays = diff * -1;
      }
      monthData.push({ month: m, monthIndex, days: totalDays });
    });
    if (monthData.length > 0) {
      const tableData = this.getTableData(monthData);
      tables = Calendar.createTables(tableData, body, head);
    }
    return tables;
  }

  getTableData(monthData) {
    const result = [];
    const rows = 6;
    // const calcPrevMonthDays = (m)=> {
    // }
    // var count = calcFirstDay();
    result.push(this.year);
    const days_ = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var day = {};
    monthData.forEach((m) => {
      var obj = {};
      obj.month = m.month;
      obj.days = [...this.days];
      obj.rows = [];
      var first = new Date(`${this.year}-${m.monthIndex}-01`).getDay();
      // if first === 0 Sun then first= 6 and 1 is 0 i.e. Mon
      day.start = first === 0 ? 6 : first - 1;
      day.name = days_[first];
      var count = 1;
      var start = day.start;

      for (var i = 0; i < rows; i++) {
        var row = []; //create row
        for (var col = 0; col < this.days.length; col++) {
          if (i === 0) {
            // in the first row find index from where to start
            if (col >= start) {
              row[col] = count;
              count++;
            } else {
              row[col] = " ";
            }
          } else {
            row[col] = count;
            count >= m.days ? (count = 1) : count++;
          }
        }
        obj.rows.push(row);
      }
      result.push(obj);
    });
    return result;
  }

  static createTables(data, tBody, monthTitle) {
    // for length of data + 1 create each table
    for (var d = 0; d < data.length; d++) {
      var year;
      if (d === 0) {
        year = data[d];
      } else {
        const table = document.createElement("table");
        table.className = "table hidden";
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
        var tr = document.createElement("tr");
        data[d].days.forEach((item) => {
          var th = document.createElement("th");
          th.innerHTML = item;
          tr.append(th);
        });
        table.id = data[d].month;
        const today = data[new Date().getMonth() + 1].month;
        monthTitle.innerHTML = today + " " + new Date().getFullYear();
        thead.append(tr);
        data[d].rows.forEach((r) => {
          var tr = document.createElement("tr");
          for (var i = 0; i < r.length; i++) {
            var td = document.createElement("td");
            td.id = uuid();
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

  scheduleDate(result) {
    if(!result){
      var {list: tdList, id: month} = Calendar.getCurrentTable();
    }else {
      var {list: tdList, id: month} = result;
    }
    var focused = false;
    tdList.map(td => {
      td.onclick = (e)=> {
        // toggle picked date
        e.target.className.includes('focused') ? e.target.classList.remove('focused') : e.target.classList.add('focused');
        focused = !focused;
        // if picked add to todo list item
        if(e.target.className.includes('focused')) {
          todo.create({month, td})
        }else {
          todo.remove(td.id,  e.target.className.includes('focused'));
        }
      }
    })
  }

  static getCurrentTable() {
    // get current table
    var current;
    const tables = document.querySelectorAll('.table');
    const tablesArr = Array.from(tables);
    current = tablesArr.filter(t => !t.className.includes('hidden'))[0];
    // get list of td
    const tdList = current.querySelectorAll('td');
    const list = Array.from(tdList);
    return {list: list, id: current.id};
  }
}



export const calendar = new Calendar();
