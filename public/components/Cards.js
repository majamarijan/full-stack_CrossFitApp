import { getCard } from '../services/fetchData.js';
import Pagination, { hidePagination } from './Pagination.js';
import Search from './Search.js';

class Card {
  constructor() {
    this.cards = document.querySelector(".cards");
    this.cardWrapper = document.querySelector('#card');
    this.res = {data:'', params:''};
  }

  render(data, params) {
    this.res.data = data;
    this.res.params = params;
    const {sliceStart, limit} = params;
    this.cards.innerHTML = '';
    const cardsPerPage = data.slice(sliceStart, limit > data.length ? data.length : limit);
    cardsPerPage.map( d => {
      const allCards = this.createHTML(d);
      if(allCards) {
        VanillaTilt.init(document.querySelectorAll(".card"), {
          max: 25,
          speed: 400
        });
      }
    });
  }

  createHTML(data) {
    const {
      name,
      level,
      equipment,
      primaryMuscles,
      secondaryMuscles,
      instructions,
      id,
    } = data;
  
    const card = document.createElement("div");
    card.className = "card";
    card.id = id;
    card.setAttribute('data-tilt', '');
    var source = name.replace(/ |\//g, "_");
    card.style.backgroundImage = `url(./exercises/${source}/images/0.jpg)`;
    const cardOverlay = document.createElement('div');
    cardOverlay.className = 'card_overlay';
    const info = document.createElement('div');
    info.className = 'card_title';
    const title = document.createElement('h3');
    title.innerHTML = name;
    const levelInfo = document.createElement('p');
    levelInfo.innerHTML = level;
    card.addEventListener('click', (e)=> this.showCard(id), false);
    
    info.append(title, levelInfo);
    card.append(cardOverlay, info);
    this.cards.append(card);
  
    return this.cards
  }

  showCard(id) {
    const res = getCard(id);
    res.then(card => {
      this.cardWrapper.classList.remove('hidden');
      clearContent(this.cards);
      this.createContent(card);
    }) 
  }

  createContent(card) {
    const {
      name,
      level,
      equipment,
      category,
      primaryMuscles,
      secondaryMuscles,
      instructions,
      id,
    } = card;
// workout, w_header, w_body, w_main, w_footer, muscles, equipment trainerTips, trainer_tips
  const cardHead = document.createElement("div");
  cardHead.className = "cardHead";
  const h1 = document.createElement("h1");
  h1.innerHTML = name;
  const boxBack = document.createElement('div');
  boxBack.className = 'boxBack';
  const back = document.createElement('button');
  const spanBack = document.createElement('span')
  spanBack.innerHTML = 'Back';
  back.className = 'backBtn';
  boxBack.onclick = (e)=> this.backToContent();
  boxBack.append(back, spanBack);
  cardHead.append(boxBack, h1);
  
  const gallery = document.createElement("div");
  gallery.className = "gallery";
  var source = name.replace(/ |\//g, "_"); // replace / from the string and add _
  const img1 = document.createElement("img");
  const img2 = document.createElement("img");
  img1.src = `./exercises/${source}/images/0.jpg`;
  img2.src = `./exercises/${source}/images/1.jpg`;
  img1.alt = name;
  img2.alt = name;
  gallery.append(img2, img1); // set second image below first because of the animation

  const muscles = [];
  if (primaryMuscles && primaryMuscles.length > 0) {
    primaryMuscles.map((msc) => muscles.push(msc));
  }
  if (secondaryMuscles && secondaryMuscles.length > 0) {
    secondaryMuscles.map((msc) => muscles.push(msc));
  };
  const infoArr = [
    {
      image: `./assets/${level}.svg`,
      text: level,
      name: "Level"
    },
    {
      image: `./assets/eq_bage-body1.svg`,
      text: !equipment ? "Body only" : equipment,
      name: 'Equipment'
    },
    {
      image: `./assets/category_bage.svg`,
      text: !category ? "None" : category,
      name: 'Category'
    },
    {
      image: `./assets/muscles.png`,
      text: muscles.join(', '),
      name: 'Muscles'
    }
  ];
  const infoBox = document.createElement("div");
  infoBox.className = 'infoBox';
  const ul = document.createElement("ul");
  ul.className = "cardInfo";
  for(var i=0;i<3;i++) {
    const li = document.createElement('li');
    const box = document.createElement('div');
    box.className = 'cardIcon';
    const listIcon =  document.createElement("div");
    const text = document.createElement('span');
    const iconText = document.createElement('span');
    iconText.innerHTML = infoArr[i].name;
    listIcon.className = 'listIcon';
    listIcon.style.backgroundImage = `url(${infoArr[i].image})`;
    box.append(listIcon, iconText);
    text.innerHTML = infoArr[i].text;
    li.append(box, text);
    ul.append(li)
  }
  infoBox.append(ul);

  ////////////////

  
  
 
  // const trainerTipsBox = document.createElement("div");
  // trainerTipsBox.className = "trainerTips";
  // const trainerTitle = document.createElement("span");
  // trainerTitle.innerHTML = "📝 Trainer Tips: ";
  // trainerTipsBox.append(trainerTitle);
  
  // ul.className = "trainer_tips";
  // instructions.map((tips) => {
  //   const li = document.createElement("li");
  //   li.innerHTML = "📌 " + tips;
  //   ul.append(li);
  // });
// 

  
   this.cardWrapper.append(cardHead, gallery, infoBox);
  }

  hide() {
    this.cardWrapper.innerHTML = '';
    this.cardWrapper.classList.add('hidden');
  }

  backToContent() {
    const {data, params} = this.res;
    this.hide();
    document.querySelector('.filterWrapper').classList.remove('hidden');
    Search.show();
    card.render(data, params);
    Pagination(data, params)
  }

}

function clearContent(cards) {
  document.querySelector('.search').classList.add('hidden');
  cards.innerHTML = '';
  document.querySelector('.filterWrapper').classList.add('hidden');
  hidePagination();
}


export const card = new Card();






  
  

