class Todo {
  constructor() {
    this.dates = [];
  }

  build() {
    const toDo = document.createElement("div");
    toDo.className = "toDo";
    const toDoHead = document.createElement('div');
    toDoHead.className = 'todoHead';
    const title = document.createElement('h2');
    title.innerHTML = 'Workout Schedule';
    toDoHead.append(title);
    toDo.append(toDoHead);
    const content = document.createElement('div');
    content.className = 'todoBody';
    toDo.append(content);
    return toDo;
  }

  create(data) {
    const {month, td} = data;
    const date = td.innerHTML;
    const box = document.createElement('div');
    box.className = 'todo';
    box.setAttribute('data-id',td.id);
    const datum = document.createElement('div');
    datum.innerHTML = `${month}, ${date}`;
    const timeBox = document.createElement('div');
    timeBox.className = 'timeBox';
    const span = document.createElement('span');
    span.innerHTML = 'Starts at: ';
    const time = document.createElement('input');
    time.setAttribute('type','time');
    time.setAttribute('name','time');
    timeBox.append(span, time);
    const delBtn = document.createElement('button');
    delBtn.className = 'removeTodoBtn';
    delBtn.innerHTML = 'Delete';
    delBtn.onclick = (e)=> this.removeTodo(delBtn);
    timeBox.append(span, time);
    box.append(datum, timeBox, delBtn);
    document.querySelector('.todoBody').append(box);
  }

  remove(id, focused) {
    const todo = document.querySelectorAll('.todo');
    const tBody = document.querySelector('.todoBody');
    const arr = Array.from(todo);
    const update = arr.filter(t => t.dataset.id === id && !focused)[0];
    tBody.removeChild(update);
  }

  removeTodo(btn) {
    const tBody = document.querySelector('.todoBody');
    const tds = document.querySelectorAll('td');
    const arr = Array.from(todo);
    const tdsArr = Array.from(tds);
    const parent = btn.parentElement;
    tdsArr.map(t => {
      t.className.includes('focused') && t.id === parent.dataset.id ? 
      t.classList.remove('focused') : null;
    })
    tBody.removeChild(parent);
  }

}


export const todo = new Todo();