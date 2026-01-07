const ITEMS_JSON = './data/items.json';
const REPO_OWNER = '4ME280-25ZS';
const REPO_NAME = 'pann04';

function el(tag, attrs = {}, children = []){
  const e = document.createElement(tag);
  for(const k in attrs) if(k==='text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
  children.forEach(c => e.appendChild(c));
  return e;
}

async function loadItems(){
  const res = await fetch(ITEMS_JSON);
  const items = await res.json();
  return items;
}

function getLocalReservations(){
  try{return JSON.parse(localStorage.getItem('wishlist_resv')||'{}')}catch(e){return {}}
}

function setLocalReservation(itemId, name){
  const s = getLocalReservations();
  if(name) s[itemId]=name; else delete s[itemId];
  localStorage.setItem('wishlist_resv', JSON.stringify(s));
}

function openIssueFor(item){
  const title = encodeURIComponent(`Rezervace: ${item.title}`);
  const body = encodeURIComponent(`Rád(a) bych si rezervoval(a) tento dárek:\n\n- ID: ${item.id}\n- Název: ${item.title}\n\nMoje jméno:\nKontakt (e-mail / tel):\n\nProsím, potvrďte rezervaci.`);
  const url = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?title=${title}&body=${body}`;
  window.open(url,'_blank');
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

    const actions = el('div',{class:'actions'});
    const reserveBtn = el('button',{class:'btn',type:'button',text: local[item.id] ? 'Zrušit rezervaci' : 'Rezervovat'});
    reserveBtn.addEventListener('click', ()=>{
      if(local[item.id]){
        if(!confirm('Opravdu zrušit lokální rezervaci?')) return;
        setLocalReservation(item.id,null);
      } else {
        const name = prompt('Zadejte své jméno pro rezervaci (bude uloženo pouze ve vašem prohlížeči):');
        if(!name) return;
        setLocalReservation(item.id,name);
      }
      render(items);
    });

    const issueBtn = el('button',{class:'btn secondary',type:'button',text:'Požádat přes GitHub'});
    issueBtn.addEventListener('click', ()=> openIssueFor(item));

    actions.appendChild(reserveBtn);
    actions.appendChild(issueBtn);

    if(local[item.id]){
      const who = el('div',{class:'reserved',text:`Rezervováno (lokálně): ${local[item.id]}`});
      card.appendChild(who);
    }

    card.appendChild(actions);
    container.appendChild(card);
  });
}

async function init(){
  const items = await loadItems();
  render(items);
}

init().catch(err=>{
  console.error(err);
  document.getElementById('items').textContent = 'Chyba při načítání položek.';
});
