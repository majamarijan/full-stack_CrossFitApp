import { loadData } from "../services/fetchData.js";
import Loader from './Loader.js';
import Error from './Error.js';
import {card} from './Cards.js';
import Menu, { menuHandler } from './Menu.js';
import Pagination from './Pagination.js';
import Search from './Search.js';

export default class App {
  
  static params = { sliceStart: 0, limit: 10 };
  
  static start() {
    const data = loadData();
    data
      .then((res) => {
        Error();
        //this will start timer while loading data
       Loader(res);
       card.render(res, this.params);
       Pagination(res, this.params);
       Menu.create();
       Menu.handleMenu(res, this.params);
       menuHandler();
        const button = document.querySelector('.toTrain');
        button.onclick = (e)=> {
          document.querySelector('.content').classList.remove('hidden');
          document.querySelector('.mainOverlay').classList.remove('hidden');
          const input = new Search(res, this.params);
          //input.search();
          document.body.style.setProperty('overflow', 'auto');
        }
      })
      .catch((err) => {
        Error(err);
      });
  }

  
}
