import { card } from './Cards.js';
import Pagination from './Pagination.js';

var rgx = "[a-zA-Z]+";

export default class Search {
  constructor(data, params) {
    this.input = document.querySelector(".search input");
    this.input.setAttribute("pattern", rgx);
    this.input.oninput = (e)=> this.search(data, params);
    this.input.oninvalid = (e)=> this.error();
    this.value = {text:''};
  }
  //validate
  search(data, params) {
    if(this.input.value === '') {
      // clear prev search
      this.value.text = '';
      card.render(data, params);
      Pagination(data, params)
    }else {
      const result = this.validate();
      // find data name that includes first two chars
      if(result && result.length >= 1){
        // suggest data according to string
        var ln = Number(result.length);
        // search from the first letter and filter results
        const str = result.match(new RegExp("[a-zA-Z]"+"{"+ln+"}"))[0];
        const foundData = data.filter(d => d.name.toLowerCase().startsWith(str));
        card.render(foundData, params);
        Pagination(foundData, params)
      }
    }

   }

  validate() {
    var rgx = /[a-zA-Z]+/;
    // check last input value
    var str = this.input.value.length <= 1 && !Number(this.input.value) ? this.input.value : this.input.value[this.input.value.length-1]; 
    var test = rgx.test(str);
    if (!this.input.validity.valid && this.input.validity.patternMismatch && test === false) {
      this.input.setCustomValidity("Please, enter text only!");
      this.input.reportValidity();
      this.input.value = this.value.text;
    } else {
      this.value.text = this.input.value;
      this.input.setCustomValidity('');
    }
    return this.value.text;
  }

  error() {
    console.log('err')
  }
}




