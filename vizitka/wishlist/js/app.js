import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

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

async function loadSupabaseConfig(){
  try{
    const r = await fetch('./data/supabase-config.json');
    const cfg = await r.json();
    if(cfg.url && cfg.anonKey) return cfg;
  }catch(e){}
  return null;
}

let supabase = null;
function supabaseInit(cfg){
  supabase = createClient(cfg.url, cfg.anonKey);
}

async function supabaseGetReservations(){
  if(!supabase) return {};
  const { data, error } = await supabase.from('reservations').select('item_id,name').order('created_at', {ascending:true});
  if(error){ console.warn('Supabase read error', error); return {}; }
  const map = {};
  data.forEach(r => {
    if(!map[r.item_id]) map[r.item_id]=[];
    map[r.item_id].push(r.name);
  });
  return map;
}

async function supabaseAddReservation(itemId, name){
  if(!supabase) throw new Error('Supabase not initialized');
  const { error } = await supabase.from('reservations').insert({item_id:itemId, name});
  if(error) throw error;
}

async function render(items){
  const container = document.getElementById('items');
  container.innerHTML='';
  const local = getLocalReservations();
  const remote = supabase ? await supabaseGetReservations() : null;

  items.forEach(item => {
    const card = el('article',{class:'card'});
    const h = el('h3',{text:item.title});
    const meta = el('div',{class:'meta',text:`Cena: ${item.price || '—'} • Kategorie: ${item.category || '—'}`});
    const desc = el('p',{class:'desc',text:item.description || ''});
    card.appendChild(h); card.appendChild(meta); card.appendChild(desc);

    // choose source: remote if available, else local
    const names = remote ? (remote[item.id]||[]) : (local[item.id]||[]);
    if(names.length){
      // reserved — show single reserver and disable further input
      const who = el('div',{class:'reserved',text:`Rezervováno: ${names[0]}`});
      card.appendChild(who);
    }

    const actions = el('div',{class:'actions'});
    const nameInput = el('input',{type:'text',placeholder:'Tvé jméno',class:'name-input'});
    const doReserve = el('button',{class:'btn',type:'button',text:'Připsat jméno'});
    doReserve.addEventListener('click', async ()=>{
      const name = nameInput.value.trim();
      if(!name) return alert('Zadejte prosím jméno.');
      // check reserved
      const currentlyReserved = remote ? (remote[item.id] && remote[item.id].length>0) : (local[item.id] && local[item.id].length>0);
      if(currentlyReserved) return alert('Tento dárek už je rezervovaný.');
      try{
        if(supabase){
          await supabaseAddReservation(item.id, name);
        } else {
          addLocalReservation(item.id, name);
        }
        await render(items);
      }catch(e){
        alert('Chyba při ukládání: '+(e.message||e));
      }
    });
    // disable input if already reserved
    if(names.length){
      nameInput.setAttribute('disabled','');
      doReserve.setAttribute('disabled','');
    }
    actions.appendChild(nameInput);
    actions.appendChild(doReserve);

    card.appendChild(actions);
    container.appendChild(card);
  });
}

async function init(){
  try{
    const items = await loadItems();
    const cfg = await loadSupabaseConfig();
    if(cfg){ supabaseInit(cfg); }
    await render(items);
    // attach clear-all handler
    const clearBtn = document.getElementById('clear-all');
    if(clearBtn){
      clearBtn.addEventListener('click', async ()=>{
        if(!confirm('Opravdu vymazat všechny rezervace? Tuto akci nelze vrátit.')) return;
        try{
          // clear remote first if available
          if(supabase){
            const { error } = await supabase.from('reservations').delete().neq('id', 0);
            if(error) throw error;
          }
          // clear local
          localStorage.removeItem('wishlist_resv');
          // re-render
          const fresh = await loadItems();
          await render(fresh);
          alert('Všechny rezervace byly vymazány.');
        }catch(e){
          alert('Chyba při mazání: ' + (e.message||e));
        }
      });
    }
  }catch(err){
    console.error(err);
    document.getElementById('items').textContent = 'Chyba při načítání položek.';
  }
}

init();
