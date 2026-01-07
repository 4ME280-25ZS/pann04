const ITEMS_JSON = './data/items.json';

function el(tag, attrs = {}, children = []){
  const e = document.createElement(tag);
  for(const k in attrs) {
    if(k==='text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
  }
  children.forEach(c => e.appendChild(c));
  return e;
}

async function loadItems(){
  const res = await fetch(ITEMS_JSON);
  return await res.json();
}

function getLocalReservations(){
  try{return JSON.parse(localStorage.getItem('wishlist_resv')||'{}')}catch(e){return {}}
}

function addLocalReservation(itemId, name){
  const s = getLocalReservations();
  if(!s[itemId]) s[itemId]=[];
  s[itemId].push(name);
  localStorage.setItem('wishlist_resv', JSON.stringify(s));
}

function render(items){
  const container = document.getElementById('items');
  container.innerHTML='';
  const local = getLocalReservations();
  items.forEach(item => {
    const card = el('article',{class:'card'});
    const h = el('h3',{text:item.title});
    const meta = el('div',{class:'meta',text:`Cena: ${item.price || '—'} • Kategorie: ${item.category || '—'}`});
    const desc = el('p',{class:'desc',text:item.description || ''});
    card.appendChild(h); card.appendChild(meta); card.appendChild(desc);

    // show list of names (may be multiple)
    const names = local[item.id] || [];
    if(names.length){
      const list = el('ul',{});
      names.forEach(n => list.appendChild(el('li',{text:n})));
      card.appendChild(list);
    }

    const actions = el('div',{class:'actions'});
    const nameInput = el('input',{type:'text',placeholder:'Tvé jméno',class:'name-input'});
    const doReserve = el('button',{class:'btn',type:'button',text:'Připsat jméno'});
    doReserve.addEventListener('click', ()=>{
      const name = nameInput.value.trim();
      if(!name) return alert('Zadejte prosím jméno.');
      addLocalReservation(item.id, name);
      render(items);
    });
    actions.appendChild(nameInput);
    actions.appendChild(doReserve);

    card.appendChild(actions);
    container.appendChild(card);
  });
}

async function init(){
  try{
    const items = await loadItems();
    render(items);
  }catch(err){
    console.error(err);
    document.getElementById('items').textContent = 'Chyba při načítání položek.';
  }
}

init();
