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

  const vcardBtn = e.target.closest('#download-vcard');
  if (vcardBtn){
    const dataEl = document.getElementById('profile-data');
    let profile = {};
    try{ profile = JSON.parse(dataEl.textContent); }catch(e){console.error(e)}
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.fn || ''}`,
      `ORG:${profile.org || ''}`,
      `TITLE:${profile.title || ''}`,
      `TEL;TYPE=WORK,VOICE:${profile.tel || ''}`,
      `EMAIL;TYPE=PREF,INTERNET:${profile.email || ''}`,
      `ADR;TYPE=WORK:;;${(profile.adr||'').replace(/;/g,';')}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], {type:'text/vcard'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile.fn||'contact').replace(/\s+/g,'_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flashText(vcardBtn, 'Stahuje se...');
  }
});