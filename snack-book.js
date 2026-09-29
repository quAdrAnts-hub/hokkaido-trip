(() => {
  'use strict';
  const KEY='hokkaido-snacks-v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=value=>{if(!value)return '';const u=new URL(value);if(!['https:','http:'].includes(u.protocol))throw new Error('链接须以 https:// 或 http:// 开头。');return u.href;};
  function validateData(data){
    if(data?.version!==1||!Array.isArray(data.items)||data.items.length>200)throw new Error('零食资料格式不正确。');
    const ids=new Set(),dates=new Set(window.TRIP.days.map(d=>d.id));
    const items=data.items.map(item=>{
      if(!item||typeof item!=='object'||!/^custom-[a-zA-Z0-9-]{1,70}$/.test(item.id)||ids.has(item.id)||!dates.has(item.date))throw new Error('零食日期或编号不正确。');
      ids.add(item.id);
      const clean={id:item.id,date:item.date};
      for(const [key,max] of Object.entries({name:90,channel:80,note:500,url:2000,imageUrl:2000})){
        if(typeof item[key]!=='string'||item[key].length>max)throw new Error('零食填写内容过长或格式不正确。');
        clean[key]=item[key].trim();
      }
      if(!clean.name)throw new Error('请填写零食名称。');
      clean.url=safeUrl(clean.url);clean.imageUrl=safeUrl(clean.imageUrl);return clean;
    });
    return {version:1,items};
  }
  let state={version:1,items:[]},initialized=false,formDialog,photoDialog,restoreFocus;
  try{const raw=localStorage.getItem(KEY);if(raw)state=validateData(JSON.parse(raw));}catch{/* Preserve the default page when old local data cannot be read. */}
  const exportData=()=>JSON.parse(JSON.stringify(state));
  function importData(data){const clean=validateData(data);localStorage.setItem(KEY,JSON.stringify(clean));state=clean;document.dispatchEvent(new Event('snackbookchange'));return exportData();}
  const forDay=date=>state.items.filter(s=>s.date===date).map(s=>({...s}));
  const find=id=>state.items.find(s=>s.id===id)||window.FOOD.snacks[id];
  const status=text=>{const box=document.querySelector('#snack-status');if(box)box.textContent=text;};
  function openForm(date,id){
    const item=state.items.find(s=>s.id===id)||{id:'',date};
    const form=formDialog.querySelector('form');form.reset();
    for(const key of ['id','date','name','channel','note','url','imageUrl'])form.elements.namedItem(key).value=item[key]||'';
    document.querySelector('#snack-form-title').textContent=id?'编辑零食':'添加零食';
    document.querySelector('#snack-delete').hidden=!id;
    document.querySelector('#snack-delete').textContent='删除';
    delete formDialog.dataset.confirmDelete;status('');
    restoreFocus=document.activeElement;formDialog.showModal();form.elements.namedItem('name').focus();
  }
  function openPhoto(id){
    const item=find(id);if(!item)return;
    const photo=id.startsWith('custom-')?(item.imageUrl?{src:item.imageUrl,source:item.url,label:'自己添加的图片'}:null):window.SNACK_IMAGES?.[id];
    document.querySelector('#snack-photo-title').textContent=item.name;
    const stage=document.querySelector('#snack-photo-stage');stage.replaceChildren();
    const text=document.createElement('p');text.className='snack-photo-status';text.setAttribute('role','status');
    if(photo?.src){
      text.textContent='图片载入中…';stage.append(text);
      const img=new Image();img.alt=photo.alt||item.name+' · 包装参考';img.referrerPolicy='no-referrer';
      const failed=()=>{clearTimeout(timer);img.onload=null;img.onerror=null;img.remove();text.hidden=false;text.textContent='图片暂时载入不了，可以打开商品资料或搜索包装。';};
      const timer=setTimeout(failed,10000);
      img.onload=()=>{clearTimeout(timer);text.hidden=true;};img.onerror=failed;
      stage.append(img);img.src=photo.src;
    }else{text.textContent='还没有确认的包装图，可以先搜索名称，确认后再添加。';stage.append(text);}
    document.querySelector('#snack-photo-caption').textContent=photo?.label||'包装与口味以门店实物为准。';
    const links=document.querySelector('#snack-photo-links');links.replaceChildren();
    for(const [href,label] of [[photo?.source||item.url,'图片 / 商品来源'],['https://www.google.com/search?tbm=isch&q='+encodeURIComponent(item.name+' パッケージ'),'搜索包装']]){
      if(!href)continue;const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';links.append(a);
    }
    restoreFocus=document.activeElement;photoDialog.showModal();
  }
  function initialize(){
    if(initialized)return;initialized=true;
    const node=document.createElement('div');node.innerHTML=`<dialog id="snack-editor" class="snack-dialog" aria-labelledby="snack-form-title"><form><div class="snack-dialog-heading"><h3 id="snack-form-title">添加零食</h3><button type="button" data-snack-close class="text-button" aria-label="关闭零食编辑">关闭 ×</button></div><input name="id" type="hidden"><div class="form-grid"><label>记在哪天<select name="date" required>${window.TRIP.days.map(d=>`<option value="${d.id}">${Number(d.id.slice(0,2))}/${Number(d.id.slice(3))} · ${esc(d.city)}</option>`).join('')}</select></label><label>零食名称<input name="name" maxlength="90" required placeholder="想买什么"></label><label>哪里买<input name="channel" maxlength="80" placeholder="例如：Seicomart / 机场"></label><label>商品链接 · 可留空<input name="url" type="url" maxlength="2000" placeholder="https://"></label><label class="snack-wide">图片链接 · 可留空<input name="imageUrl" type="url" maxlength="2000" placeholder="粘贴图片的 https:// 地址"></label><label class="snack-wide">备注<textarea name="note" maxlength="500" rows="3" placeholder="口味、价格、想买几份…"></textarea></label></div><p id="snack-status" class="snack-form-status" role="status"></p><div class="snack-form-actions"><button type="button" id="snack-delete" class="text-button" hidden>删除</button><button type="submit" class="button primary">保存零食</button></div></form></dialog><dialog id="snack-photo" class="snack-dialog snack-photo" aria-labelledby="snack-photo-title"><div class="snack-dialog-heading"><h3 id="snack-photo-title"></h3><button type="button" data-snack-photo-close class="text-button" aria-label="关闭包装图">关闭 ×</button></div><div id="snack-photo-stage" class="snack-photo-stage"></div><p id="snack-photo-caption" class="snack-photo-caption"></p><div id="snack-photo-links" class="food-links"></div></dialog>`;
    document.body.append(node);formDialog=document.querySelector('#snack-editor');photoDialog=document.querySelector('#snack-photo');
    const close=dialog=>{dialog.close();if(restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true});else document.querySelector('[data-snack-add]')?.focus({preventScroll:true});};
    node.querySelector('[data-snack-close]').addEventListener('click',()=>close(formDialog));
    node.querySelector('[data-snack-photo-close]').addEventListener('click',()=>close(photoDialog));
    for(const dialog of [formDialog,photoDialog])dialog.addEventListener('cancel',event=>{event.preventDefault();close(dialog);});
    document.addEventListener('click',event=>{
      const b=event.target.closest('button');if(!b)return;
      if(b.dataset.snackAdd)openForm(b.dataset.snackAdd);
      if(b.dataset.snackEdit)openForm('',b.dataset.snackEdit);
      if(b.dataset.snackPhoto)openPhoto(b.dataset.snackPhoto);
    });
    formDialog.querySelector('form').addEventListener('submit',event=>{
      event.preventDefault();const item=Object.fromEntries(new FormData(event.target));
      item.id=item.id||'custom-'+(crypto.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
      const items=state.items.filter(s=>s.id!==item.id);items.push(item);
      try{importData({version:1,items});close(formDialog);}catch(e){status(e.name==='QuotaExceededError'?'浏览器空间不足，本次未保存。':e.message||'未能保存，请重试。');}
    });
    document.querySelector('#snack-delete').addEventListener('click',()=>{
      if(!formDialog.dataset.confirmDelete){formDialog.dataset.confirmDelete='true';document.querySelector('#snack-delete').textContent='确认删除';return;}
      const id=formDialog.querySelector('[name=id]').value;
      try{importData({version:1,items:state.items.filter(s=>s.id!==id)});close(formDialog);}catch{status('未能保存删除，请重试。');}
    });
  }
  window.SNACK_BOOK=Object.freeze({initialize,forDay,exportData,validateData,importData});
})();
