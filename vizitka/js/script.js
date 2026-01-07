function flashText(el, text, ms = 1200){
  const original = el.textContent;
  el.textContent = text;
  setTimeout(()=> el.textContent = original, ms);
}

document.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.copy');
  if (copyBtn){
    const value = copyBtn.getAttribute('data-copy');
    if (!value) return;
    navigator.clipboard?.writeText(value).then(() => {
      flashText(copyBtn, 'Zkopírováno');
    }).catch(()=>{
      alert('Kopírování se nezdařilo.');
    });
    return;
  }
  // No other interactive buttons
});