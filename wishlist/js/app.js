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

function setLocalReservation(itemId, name){
  const s = getLocalReservations();
  if(name) s[itemId]=name; else delete s[itemId];
  localStorage.setItem('wishlist_resv', JSON.stringify(s));
}

async function loadSupabaseConfig(){
  try{
    const r = await fetch('./data/supabase-config.json');
    const cfg = await r.json();
    if(cfg.url && cfg.anonKey && !cfg.url.includes('REPLACE') && !cfg.anonKey.includes('REPLACE')) return cfg;
  }catch(e){/* ignore */}
  return null;
}

function openIssueFor(item){
  const title = encodeURIComponent(`Rezervace: ${item.title}`);
  const body = encodeURIComponent(`Rád(a) bych si rezervoval(a) tento dárek:\n\n- ID: ${item.id}\n- Název: ${item.title}\n\nMoje jméno:\nKontakt (e-mail / tel):\n\nProsím, potvrďte rezervaci.`);
  const url = `https://github.com/${location.hostname.split('.')[0] || '4ME280-25ZS'}/pann04/issues/new?title=${title}&body=${body}`;
  window.open(url,'_blank');
}

// Supabase helpers (optional)
let supabase = null;
async function supabaseInit(cfg){
  supabase = createClient(cfg.url, cfg.anonKey);
}

async function supabaseGetReservations(){
  if(!supabase) return {};
  const { data, error } = await supabase.from('reservations').select('item_id,name').order('created_at', {ascending:true});
  if(error) { console.warn('Supabase read error', error); return {}; }
  const map = {};
  data.forEach(r => map[r.item_id]=r.name);
  return map;
}

async function supabaseReserve(itemId, name){
  if(!supabase) throw new Error('Supabase not configured');
  // try insert; assume unique constraint on item_id or check first
  const { data:existing } = await supabase.from('reservations').select('item_id').eq('item_id', itemId).limit(1);
  if(existing && existing.length) throw new Error('Již rezervováno');
  const { error } = await supabase.from('reservations').insert({item_id:itemId, name});
  if(error) throw error;
}

async function supabaseCancel(itemId, name){
  if(!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('reservations').delete().match({item_id:itemId, name});
  if(error) throw error;
}

async function render(items){
  const container = document.getElementById('items');
  container.innerHTML='';
  const local = getLocalReservations();
  const remote = supabase ? await supabaseGetReservations() : {};
  items.forEach(item => {
    const card = el('article',{class:'card'});
    const h = el('h3',{text:item.title});
    const meta = el('div',{class:'meta',text:`Cena: ${item.price || '—'} • Kategorie: ${item.category || '—'}`});
    const desc = el('p',{class:'desc',text:item.description || ''});
    card.appendChild(h); card.appendChild(meta); card.appendChild(desc);

    const actions = el('div',{class:'actions'});
    const isLoc = local[item.id];
    const isRem = remote[item.id];

    // Inline reservation input (no registration)
    if(isRem){
      const who = el('div',{class:'reserved',text:`Rezervováno: ${remote[item.id]} (remote)`});
      const cancelBtn = el('button',{class:'btn secondary',type:'button',text:'Zrušit (remote)'});
      cancelBtn.addEventListener('click', async ()=>{
        if(!confirm('Opravdu zrušit rezervaci (remote)?')) return;
        try{ await supabaseCancel(item.id, remote[item.id]); alert('Zrušeno (remote)'); render(items); }
        catch(e){ alert('Chyba: '+e.message); }
      });
      card.appendChild(who);
      actions.appendChild(cancelBtn);
    } else if(isLoc){
      const who = el('div',{class:'reserved',text:`Rezervováno (lokálně): ${local[item.id]}`});
      const cancelBtn = el('button',{class:'btn secondary',type:'button',text:'Zrušit (lokálně)'});
      cancelBtn.addEventListener('click', ()=>{ if(!confirm('Opravdu zrušit lokální rezervaci?')) return; setLocalReservation(item.id,null); render(items); });
      card.appendChild(who);
      actions.appendChild(cancelBtn);
    } else {
      const nameInput = el('input',{type:'text',placeholder:'Tvé jméno',class:'name-input'});
      const doReserve = el('button',{class:'btn',type:'button',text:'Rezervovat'});
      doReserve.addEventListener('click', async ()=>{
        const name = nameInput.value.trim();
        if(!name) return alert('Zadejte prosím jméno.');
        if(supabase){
          try{ await supabaseReserve(item.id,name); alert('Rezervováno (remote)'); render(items); }
          catch(e){ alert('Chyba: '+(e.message||e)); }
        } else {
          setLocalReservation(item.id,name);
          render(items);
        }
      });
      actions.appendChild(nameInput);
      actions.appendChild(doReserve);
      const issueBtn = el('button',{class:'btn secondary',type:'button',text:'Požádat přes GitHub'});
      issueBtn.addEventListener('click', ()=> openIssueFor(item));
      actions.appendChild(issueBtn);
    }

    card.appendChild(actions);
    container.appendChild(card);
  });
}

async function init(){
  try{
    const items = await loadItems();
    const cfg = await loadSupabaseConfig();
    if(cfg){
      await supabaseInit(cfg);
    }
    await render(items);
  }catch(err){
    console.error(err);
    document.getElementById('items').textContent = 'Chyba při načítání položek.';
  }
}

init();
