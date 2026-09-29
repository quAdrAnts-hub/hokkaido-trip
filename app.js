(() => {
  'use strict';
  const {places,days,variants,itinerary,tickets:ticketDefaults}=window.TRIP;
  const KEY='hokkaido-private-v3';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external=(url,label,cls='')=>`<a class="${esc(cls)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  const dateLabel=id=>id.split('-').map(Number).join('/');
  const searchUrl=id=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(places[id].query+' Japan');
  const directions=(from,to,mode)=>'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(places[from].query+' Japan')+'&destination='+encodeURIComponent(places[to].query+' Japan')+'&travelmode='+(/巴士|市电|电车|地铁|JR|飞机|接驳/.test(mode)?'transit':/出租车/.test(mode)?'driving':/步行|徒步/.test(mode)&&!/缆车/.test(mode)?'walking':'transit');
  const validUrl=v=>{try{return ['http:','https:'].includes(new URL(v).protocol);}catch{return false;}};
  const newId=()=>window.crypto?.randomUUID?.()||'item-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const config={
    '12-30':{pool:['biei','asahi'],defaults:['biei','asahi']},
    '01-02':{pool:['zoo','biei','asahi'],defaults:['zoo','biei','asahi'],previous:'12-30'},
    '01-04':{pool:['west','city'],defaults:['west','city']},
    '01-06':{pool:['west','city','park'],defaults:['west','city','park'],previous:'01-04'}
  };
  let state={version:3,revision:3,active:'12-23',selected:{},completed:{},slots:{},tickets:[]};
  let warning='';
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved?.version===3){
      for(const key of ['selected','completed','slots'])if(saved[key]&&typeof saved[key]==='object'&&!Array.isArray(saved[key]))state[key]=saved[key];
      if(days.some(d=>d.id===saved.active))state.active=saved.active;
      state.tickets=Array.isArray(saved.tickets)?saved.tickets.filter(t=>t&&typeof t.id==='string'&&typeof t.from==='string'&&typeof t.to==='string'&&days.some(d=>d.id===t.date)).map(t=>({...t,booked:t.booked===true,url:validUrl(t.url)?t.url:''})):[];
      if(saved.revision!==3){
        for(const id of ['12-30','01-02']){
          if(state.selected[id]==='furano')state.selected[id]='biei';
          delete state.completed[id];
          delete state.slots[id];
        }
        if(!state.selected['01-02']||state.selected['01-02']==='biei')state.selected['01-02']='zoo';
        warning='已更新旭川行程，1/2 默认安排旭山动物园；原有车票已保留。';
      }
    }
  }catch{warning='旧的保存内容无法读取，已打开默认行程。';}
  const allowedFor=id=>config[id].pool.filter(p=>!config[id].previous||state.completed[config[id].previous]!==p);
  function normalize(){
    const changed=[];
    for(const id of Object.keys(config)){
      const allowed=allowedFor(id),old=state.selected[id];
      const oldSlots=Array.isArray(state.slots[id])?state.slots[id]:[];
      let slots=[...new Set(oldSlots.filter(p=>allowed.includes(p)))];
      for(const p of config[id].defaults)if(allowed.includes(p)&&!slots.includes(p))slots.push(p);
      slots=slots.slice(0,2);
      if(allowed.includes(old)&&!slots.includes(old))slots[0]=old;
      state.slots[id]=slots;
      if(!allowed.includes(old)){state.selected[id]=slots[0];delete state.completed[id];if(old)changed.push(id);}
      if(state.completed[id]!==state.selected[id])delete state.completed[id];
    }
    return changed;
  }
  normalize();
  let noticeTimer;
  function notify(text){$('notice').textContent=text;$('notice').classList.add('on');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').classList.remove('on'),4600);}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
  function reportSaved(message){notify(message+(save()?'':' 本次未保存，浏览器未允许保存数据。'));}
  const getDay=id=>itinerary(days.find(d=>d.id===id),state.selected[id],state);
  const transferPlaces=new Set(['nrt','hnd','hkd','hakodate','toya','noborist','nobori','sapporo','asahikawa','biei','furano','prince','minamiotaru','otarust','cts','naritast']);
  const hotelPlaces=new Set(['art','nagisa','global','kitutuki','adex','ys','lavista','sapporopark']);
  function dayMark(day,place){
    if(hotelPlaces.has(place))return '⌂';
    if(transferPlaces.has(place))return '↔';
    const visits=[...new Set(day.stops.map(s=>s.place))].filter(id=>!transferPlaces.has(id)&&!hotelPlaces.has(id));
    return String(visits.indexOf(place)+1);
  }
  function candidateReason(id){const prev=config[id].previous;if(!prev)return '';const completed=state.completed[prev];return completed?`${dateLabel(prev)} 的${variants[completed].label}已去过。`:`${dateLabel(prev)} 未去的地方仍可留到今天。`;}
  const choiceLabel=(id,p)=>id==='01-06'?({west:'白色恋人',city:'北大与午餐',park:'中岛公园与午餐'}[p]||variants[p].label):variants[p].label;
  const choiceSub=(id,p)=>id==='01-06'?({west:'上午园区 · 午后去机场',city:'校园散步 · 早点午餐',park:'公园散步 · 附近午餐'}[p]||variants[p].sub):id==='01-02'&&p==='biei'?'青池 · 双瀑布 · 精灵露台':p==='zoo'&&state.completed['12-30']==='asahi'?'上午动物园 · 下午休息':variants[p].sub;
  function choiceHTML(day){
    const id=day.id,selected=state.selected[id],allowed=allowedFor(id);
    return `<div class="choices ${state.slots[id].length===1?'single':''}" role="group" aria-label="${dateLabel(id)} 行程选择">${state.slots[id].map((p,i)=>`<button class="choice" data-choice-day="${id}" data-choice="${p}" aria-pressed="${p===selected}"><span class="choice-letter">${i?'B':'A'}</span><span><strong>${esc(choiceLabel(id,p))}</strong><small>${esc(choiceSub(id,p))}</small></span>${p===selected?'<span class="choice-check">✓</span>':''}</button>`).join('')}</div><div class="choice-meta">${candidateReason(id)?`<p class="choice-reason">${esc(candidateReason(id))}</p>`:''}${allowed.length>2?`<label class="candidate-label">其他去处<select data-candidate-day="${id}">${allowed.map(p=>`<option value="${p}" ${p===selected?'selected':''}>${esc(choiceLabel(id,p))}</option>`).join('')}</select></label>`:''}<label class="complete-label"><input type="checkbox" data-complete-day="${id}" ${state.completed[id]===selected?'checked':''}>今天已去过</label></div>`;
  }
  function admissionHTML(p){
    const t=p.admission;if(!t)return '';
    return `<div class="admission"><div class="admission-head"><span>${esc(t.label||'门票')}</span><strong>${esc(t.price)}</strong></div><p>${esc(t.note)}</p><div class="admission-links">${t.links.map(x=>external(x.url,x.label)).join('')}</div></div>`;
  }
  function walkHTML(w){if(!w)return '';return `<div class="walk-route"><strong>↝ ${esc(w.title)}</strong><p>${esc(w.description)}</p><div>${w.links.map(x=>external(x.url,x.label)).join(' ')}</div></div>`;}
  function stopHTML(stop,day,index){
    const p=places[stop.place],mark=dayMark(day,p.id);
    return `<div class="stop" id="stop-${day.id}-${index}" data-day="${day.id}" data-stop="${index}" data-place="${p.id}"><div class="stop-time">${esc(stop.time)}</div><button class="stop-number ${/^\d+$/.test(mark)?'':'stop-symbol'}" data-focus="${day.id}:${index}" aria-label="查看 ${esc(p.name)}">${mark}</button><div class="stop-content"><button class="stop-title" data-focus="${day.id}:${index}">${esc(stop.title||p.name)}</button>${stop.kind?`<span class="stop-kind">${esc(stop.kind)}</span>`:''}${stop.desc?`<p class="stop-description">${esc(stop.desc)}</p>`:''}<div class="stop-links">${external(searchUrl(p.id),'Google Maps')}${p.booking?external(p.booking,'预约'):''}${p.url?external(p.url,'官网'):''}<button class="inline-button" data-copy-place="${p.id}">复制地点</button></div>${day.stops.findIndex(s=>s.place===p.id)===index?admissionHTML(p):''}${walkHTML(stop.walk)}</div></div>`;
  }
  function allTickets(){const saved=new Map(state.tickets.map(t=>[t.id,t]));const combined=(ticketDefaults||[]).map(t=>({...t,...saved.get(t.id)}));for(const t of state.tickets)if(!combined.some(c=>c.id===t.id))combined.push(t);return combined;}
  function transitHTML(stop,previous,day,index){
    const t=stop.via;if(!t)return '';
    const originalTicket=(ticketDefaults||[]).find(x=>x.id===t.ticketId);
    const booked=allTickets().find(x=>x.id===t.ticketId&&x.booked&&x.date===day.id&&x.from===originalTicket?.from&&x.to===originalTicket?.to);
    return `<details class="transit" data-transit-day="${day.id}" data-transit-index="${index}"><summary><span class="transit-mode">${/飞机/.test(t.mode)?'✈':'↔'}</span><span class="transit-summary">${esc(t.mode)}</span><span class="transit-time">${esc(t.duration)}</span><span class="transit-arrow">⌄</span></summary><div class="transit-detail"><p><b>${esc(places[previous.place].name)} → ${esc(places[stop.place].name)}</b></p>${booked?`<p class="booked-inline">已购 · ${esc(booked.service)} ${esc(booked.departure||'时间待补')} → ${esc(booked.arrival||'时间待补')} ${esc(booked.seat||'')}</p>`:''}<p>${esc(t.steps)}</p><p><b>购票：</b>${esc(t.ticket)}</p>${t.status?`<span class="pending">${esc(t.status)}</span>`:''}<div class="links">${t.links.map(x=>external(x.url,x.label)).join('')}${external(directions(previous.place,stop.place,t.mode),'Google Maps 导航')}<button class="inline-button" data-route="${day.id}:${index}">在地图查看</button></div></div></details>`;
  }
  function hotelHTML(h){if(!h)return '';const p=h.place?places[h.place]:null;return `<div class="hotel"><span class="hotel-icon">⌂</span><div><span class="hotel-label">住宿</span><h4>${esc(p?p.name:h.name)}</h4><p>${esc(h.note)}</p></div>${p?external(searchUrl(p.id),'地图'):''}</div>`;}
  const foodMap=query=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query+' Japan');
  let activeMeal='breakfast';
  function foodCard(id){
    const v=window.FOOD.venues[id];
    return `<article class="food-card" data-food-venue="${esc(id)}"><h5>${esc(v.name)}</h5><p class="food-near">${esc(v.near)}</p><p class="food-eat">${esc(v.eat)}</p><address class="food-address">${esc(v.address)}</address>${v.note?`<p class="food-caution">${esc(v.note)}</p>`:''}<div class="food-links">${external(foodMap(v.query),'Google Maps')}${external(v.url,'门店资料')}</div>${v.transport?`<details class="food-transport"><summary>公交怎么去</summary><p>${esc(v.transport)}</p>${external(v.transportUrl,'官方参考时刻')}</details>`:''}</article>`;
  }
  function foodHTML(day){
    const f=window.FOOD.forDay(day,state.selected[day.id]);
    const labels={breakfast:'早餐',lunch:'午餐',dinner:'晚餐',snacks:'零食便利店'};
    const convenience=c=>c?`<div class="meal-convenience"><h5>${esc(c.title)}</h5><ul>${c.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>${esc(c.note)}</p>${c.query?external(foodMap(c.query),'附近店铺'):''}</div>`:'';
    const extra=(m,label)=>m?`<div class="meal-extra"><h5>${label}</h5><p class="meal-note">${esc(m.note)}</p><div class="food-cards">${m.venues.map(foodCard).join('')}</div></div>`:'';
    const snackCard=(s,id,custom=false)=>`<article class="snack-item"><div class="snack-channel">${esc(s.channel||'自己记的')}</div><h5>${esc(s.name)}</h5><p>${esc(s.note)}</p><div class="food-links"><button class="inline-button" data-snack-photo="${esc(id)}">看包装</button>${s.url?external(s.url,'商品资料'):''}${custom?`<button class="inline-button" data-snack-edit="${esc(id)}">编辑</button>`:''}</div></article>`;
    const pantry=(f.snacks||[]).map(id=>snackCard(window.FOOD.snacks[id],id)).join('')+(window.SNACK_BOOK?.forDay(day.id)||[]).map(s=>snackCard(s,s.id,true)).join('');
    const area=f.snackArea||f.area;
    const meals=['breakfast','lunch','dinner'].map(key=>{const meal=f[key];return `<section class="meal-slot" data-meal-slot="${key}" aria-label="${labels[key]}" ${key===activeMeal?'':'hidden'}><div><p class="meal-note">${esc(meal.note)}</p>${meal.venues.length?`<div class="food-cards">${meal.venues.map(foodCard).join('')}</div>`:''}${meal.query?`<div class="food-links">${external(foodMap(meal.query),'附近店铺 · Google Maps')}</div>`:''}${convenience(meal.convenience)}${extra(meal.afternoonTea,'下午茶')}${extra(meal.afterMeal,'饭后甜点')}</div></section>`;}).join('');
    return `<section class="day-food" id="food-${day.id}" aria-labelledby="food-heading-${day.id}"><div class="food-heading"><h3 id="food-heading-${day.id}">食物</h3><p>沿途挑想吃的</p></div><div class="meal-filters" role="group" aria-label="选择餐食">${Object.entries(labels).map(([key,label])=>`<button class="meal-filter" data-meal-filter="${key}" aria-pressed="${key===activeMeal}">${label}</button>`).join('')}</div><div class="meal-list">${meals}<section class="meal-slot snack-panel" data-meal-slot="snacks" aria-label="零食便利店" ${activeMeal==='snacks'?'':'hidden'}><div><div class="snack-heading"><p class="meal-note">${esc(f.snackNote)}</p><button class="text-button" data-snack-add="${day.id}">＋ 添加零食</button></div><div class="snack-list">${pantry}</div><div class="pantry-links">${external(foodMap(area+' コンビニ'),'附近便利店')}${!['12-23','12-24','01-07'].includes(day.id)?external(foodMap(area+' セイコーマート'),'附近 Seicomart'):''}</div></div></section></div><div class="food-memo"><strong>小记</strong>${f.notes.map(note=>`<p>${esc(note)}</p>`).join('')}</div></section>`;
  }
  function renderDays(){
    const day=getDay(state.active),raw=days.find(d=>d.id===state.active),i=days.indexOf(raw);
    const weekday=new Intl.DateTimeFormat('zh-CN',{weekday:'long',timeZone:'Asia/Tokyo'}).format(new Date(day.date+'T12:00:00+09:00'));
    const summary=day.summary||day.stops.filter((s,i,a)=>!i||s.place!==a[i-1].place).slice(0,3).map(s=>places[s.place].name).join(' → ');
    $('journey').innerHTML=`<section class="day" id="day-${day.id}" role="tabpanel" aria-labelledby="date-${day.id}"><aside class="day-stamp"><p class="day-count">DAY ${String(i+1).padStart(2,'0')}</p><time class="day-date" datetime="${day.date}">${dateLabel(day.id)}</time><p class="day-weekday">${weekday}</p><span class="day-city">${esc(day.city)}</span></aside><div class="day-body"><p class="day-summary" title="${esc(summary)}">${esc(summary)}</p>${raw.choice?choiceHTML(raw):''}${day.alert?`<div class="day-alert"><span>◌</span><div>${esc(day.alert)} ${day.alertUrl?external(day.alertUrl,'查看公告'):''}</div></div>`:''}<div class="timeline">${day.stops.map((s,i)=>(i?transitHTML(s,day.stops[i-1],day,i):'')+stopHTML(s,day,i)).join('')}</div>${hotelHTML(day.hotel)}${foodHTML(day)}</div></section>`;
    document.querySelectorAll('[data-date]').forEach(b=>{const active=b.dataset.date===state.active;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    revealDate();
  }
  function revealDate(){const tab=$(`date-${state.active}`),rail=$('dates');if(tab){const t=tab.getBoundingClientRect(),r=rail.getBoundingClientRect();if(t.left<r.left||t.right>r.right)rail.scrollLeft+=t.left-r.left-(r.width-t.width)/2;}}
  window.addEventListener('resize',()=>requestAnimationFrame(revealDate));
  function renderDates(){
    $('dates').innerHTML=days.map(d=>`<button id="date-${d.id}" class="date-button ${d.id===state.active?'active':''}" role="tab" aria-selected="${d.id===state.active}" aria-controls="journey" tabindex="${d.id===state.active?0:-1}" data-date="${d.id}"><strong>${dateLabel(d.id)}</strong><small>${esc(d.city.split(' / ')[0])}</small></button>`).join('');
  }
  function selectDay(id){if(!days.some(d=>d.id===id))return false;state.active=id;renderDays();showMap(id);save();return true;}
  function updateChoice(id,message){
    const focused=document.activeElement;
    const selector=focused?.dataset.choice?`[data-choice="${focused.dataset.choice}"]`:focused?.dataset.completeDay?`[data-complete-day="${id}"]`:focused?.dataset.candidateDay?`[data-candidate-day="${id}"]`:null;
    const changed=normalize();renderDays();if(selector)document.querySelector(selector)?.focus({preventScroll:true});
    showMap(state.active);
    if(changed.length)message+=` ${changed.map(dateLabel).join('、')} 的候补已更新，完成标记已清除。`;
    reportSaved(message);
  }
  function selectPlan(id,plan){if(!Object.hasOwn(config,id)||!allowedFor(id).includes(plan))return false;if(state.selected[id]===plan)return true;const old=state.selected[id];if(!state.slots[id].includes(plan))state.slots[id][Math.max(0,state.slots[id].indexOf(old))]=plan;state.selected[id]=plan;delete state.completed[id];updateChoice(id,`已选${choiceLabel(id,plan)}。`);return true;}
  function completePlan(id,checked){if(!Object.hasOwn(config,id))return false;if(checked)state.completed[id]=state.selected[id];else delete state.completed[id];updateChoice(id,checked?'已记为去过。':'已取消完成。');return true;}
  function validateData(data){
    const fail=()=>{throw new Error('行程或车票备份格式不正确。');};
    if(data?.version!==3||data.revision!==3||!days.some(d=>d.id===data.active)||!Array.isArray(data.tickets)||data.tickets.length>100)fail();
    const clean={version:3,revision:3,active:data.active,selected:{},completed:{},slots:{},tickets:[]};
    for(const key of ['selected','completed','slots']){
      if(!data[key]||typeof data[key]!=='object'||Array.isArray(data[key]))fail();
      for(const [id,value] of Object.entries(data[key])){
        if(!Object.hasOwn(config,id))fail();
        if(key==='slots'){if(!Array.isArray(value)||value.length>2||value.some(p=>!config[id].pool.includes(p)))fail();clean[key][id]=[...new Set(value)];}
        else{if(!config[id].pool.includes(value))fail();clean[key][id]=value;}
      }
    }
    const ids=new Set();
    clean.tickets=data.tickets.map(t=>{
      if(!t||typeof t.id!=='string'||!/^[-a-zA-Z0-9]{1,100}$/.test(t.id)||ids.has(t.id)||!days.some(d=>d.id===t.date)||typeof t.booked!=='boolean')fail();
      ids.add(t.id);const ticket={id:t.id,date:t.date,booked:t.booked};
      for(const [key,max] of Object.entries({from:70,to:70,service:90,departure:5,arrival:5,seat:90,note:200,url:2000})){
        if(typeof t[key]!=='string'||t[key].length>max)fail();ticket[key]=t[key];
      }
      if(!ticket.from.trim()||!ticket.to.trim()||[ticket.departure,ticket.arrival].some(s=>s&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(s))||(ticket.url&&!validUrl(ticket.url)))fail();
      return ticket;
    });
    return clean;
  }
  function importData(data){
    const clean=validateData(data),old=state;state=clean;
    try{normalize();localStorage.setItem(KEY,JSON.stringify(state));}catch(error){state=old;throw error;}
    renderDays();renderTickets();showMap(state.active);return JSON.parse(JSON.stringify(state));
  }
  let map,routeLayer,markerLayer,highlightLayer,mapScope=state.active;
  let viewCoordinates=[],viewMaxZoom=15;
  let activeTiles=null,baseMode='outline',mapExpanded=false,restoreMapFocus=null;
  let fallbackTried=new Set(),inertBefore=[];
  const tileSources={
    gsi:{name:'日本地图',url:'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>'},
    osm:{name:'OpenStreetMap',url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}
  };
  const markers=new Map();
  const icon=(p,selected=false)=>L.divIcon({className:'map-pin'+(hotelPlaces.has(p.id)?' hotel-pin':'')+(transferPlaces.has(p.id)?' transfer-pin':'')+(selected?' selected':''),html:esc(dayMark(getDay(mapScope),p.id)),iconSize:[30,30],iconAnchor:[15,15]});
  function fitView(){if(map&&viewCoordinates.length)map.fitBounds(L.latLngBounds(viewCoordinates),{padding:[35,30],maxZoom:viewMaxZoom,animate:false});}
  function mapStatus(message,retry=false){
    $('map-status-text').textContent=message;
    $('map-connectivity').hidden=!message;
    $('map-retry').hidden=!retry;
  }
  function updateGoogleMap(){
    if(!map?._loaded)return;
    const c=map.getCenter();
    $('map-google').href='https://www.google.com/maps/@?api=1&map_action=map&center='+encodeURIComponent(c.lat.toFixed(6)+','+c.lng.toFixed(6))+'&zoom='+Math.round(map.getZoom());
  }
  function setMapSource(source,{automatic=false,message=''}={}){
    if(!map||!['gsi','osm','outline'].includes(source))return;
    if(!automatic)fallbackTried=new Set();
    const previous=activeTiles;activeTiles=null;
    if(previous)map.removeLayer(previous);
    baseMode=source;
    $('map').dataset.source=source;
    if(source==='outline'){mapStatus(message||'底图暂不可用，可重试载入街道。',true);return;}
    fallbackTried.add(source);
    const provider=tileSources[source];
    const TimedTiles=L.TileLayer.extend({
      createTile(coords,done){
        const tile=document.createElement('img');tile.alt='';tile.setAttribute('role','presentation');
        tile.referrerPolicy='strict-origin-when-cross-origin';
        let settled=false;
        const clean=()=>{clearTimeout(timer);tile.onload=null;tile.onerror=null;};
        const finish=error=>{if(settled)return;settled=true;clean();tile.dataset.ready=error?'false':'true';done(error,tile);if(error)tile.src=L.Util.emptyImageUrl;};
        const timer=setTimeout(()=>finish(new Error('Map timeout')),8000);
        tile.onload=()=>finish(null);tile.onerror=()=>finish(new Error('Map unavailable'));
        tile.cancelMapTile=()=>{settled=true;clean();tile.src=L.Util.emptyImageUrl;};
        tile.src=this.getTileUrl(coords);return tile;
      }
    });
    const layer=new TimedTiles(provider.url,{minZoom:5,maxZoom:18,maxNativeZoom:18,attribution:provider.attribution,keepBuffer:1,updateWhenIdle:true,updateWhenZooming:false});
    activeTiles=layer;
    mapStatus(message||'正在载入'+provider.name+'…');
    layer.on('tileunload',e=>e.tile.cancelMapTile?.());
    layer.on('loading',()=>{if(activeTiles===layer)mapStatus('正在载入'+provider.name+'…');});
    layer.on('tileload',()=>{if(activeTiles===layer)mapStatus('');});
    layer.on('load',()=>{
      if(activeTiles!==layer)return;
      // Leaflet 1.9.4 keeps the visible tile set here, including cached tiles after a pan.
      const visible=Object.values(layer._tiles).filter(tile=>tile.current);
      if(!visible.length)return;
      const ready=visible.filter(tile=>tile.el.dataset.ready==='true').length;
      if(ready){mapStatus(ready<visible.length?'部分地图尚未载入，可重试':'',ready<visible.length);return;}
      const other=source==='gsi'?'osm':'gsi';
      queueMicrotask(()=>{
        if(activeTiles!==layer)return;
        if(!fallbackTried.has(other))setMapSource(other,{automatic:true,message:'正在尝试备用底图…'});
        else setMapSource('outline',{automatic:true,message:'底图暂不可用，仅显示路线；可重试或打开 Google Maps。'});
      });
    });
    layer.addTo(map);
  }
  function setMapExpanded(expanded){
    const shell=$('map-shell');mapExpanded=expanded;
    if(expanded){
      restoreMapFocus=document.activeElement;
      shell.classList.remove('compact');$('map-toggle').textContent='收起 −';$('map-toggle').setAttribute('aria-expanded','true');
      inertBefore=[...document.querySelectorAll('main > :not(#map-shell),body > :not(main)')].map(el=>[el,el.inert]);
      inertBefore.forEach(([el])=>{el.inert=true;});
      shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');
    }else{
      inertBefore.forEach(([el,wasInert])=>{el.inert=wasInert;});inertBefore=[];
      shell.removeAttribute('role');shell.removeAttribute('aria-modal');
    }
    shell.classList.toggle('map-expanded',expanded);document.body.classList.toggle('map-is-open',expanded);
    $('map-expand').textContent=expanded?'退出':'放大';$('map-expand').setAttribute('aria-expanded',String(expanded));
    $('map-expand').setAttribute('aria-label',expanded?'退出大图':'放大地图');$('map-toggle').hidden=expanded;
    requestAnimationFrame(()=>{map?.invalidateSize({animate:false,debounceMoveend:true});if(expanded)$('map-expand').focus({preventScroll:true});else restoreMapFocus?.focus({preventScroll:true});});
  }
  function initMap(){
    if(!window.L){$('map').innerHTML='<p class="map-error">地图组件未载入，请保留完整项目文件夹。</p>';return;}
    map=L.map('map',{zoomControl:false,scrollWheelZoom:false,preferCanvas:true,touchZoom:true,bounceAtZoomLimits:false,zoomSnap:1,zoomDelta:1,minZoom:5,maxZoom:18});
    L.control.zoom({position:'topright',zoomInTitle:'放大',zoomOutTitle:'缩小'}).addTo(map);
    L.control.scale({position:'bottomleft',imperial:false,maxWidth:100}).addTo(map);
    map.createPane('mapBackground').style.zIndex=150;
    if(window.GEOGRAPHY)L.geoJSON(GEOGRAPHY,{pane:'mapBackground',interactive:false,style:{fillColor:'#eaf0f5',fillOpacity:1,color:'#c9d5df',weight:1}}).addTo(map);
    map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>');
    routeLayer=L.layerGroup().addTo(map);markerLayer=L.layerGroup().addTo(map);highlightLayer=L.layerGroup().addTo(map);
    showMap(state.active);setMapSource('gsi');
    map.on('moveend zoomend',updateGoogleMap);updateGoogleMap();
    let sizeFrame;
    new ResizeObserver(()=>{cancelAnimationFrame(sizeFrame);sizeFrame=requestAnimationFrame(()=>map.invalidateSize({animate:false,debounceMoveend:true}));}).observe($('map'));
  }
  function addMapMarker(day,index){
    const s=day.stops[index],p=places[s.place];
    if(markers.has(p.id))return markers.get(p.id);
    const mark=dayMark(day,p.id);
    const marker=L.marker([p.lat,p.lng],{icon:icon(p),title:`${mark} ${p.name}`}).addTo(markerLayer);
    marker.bindPopup(`<span class="popup-number">${mark}</span><b class="popup-title">${esc(p.name)}</b><div class="popup-links">${external(searchUrl(p.id),'Google Maps')}<button data-copy-place="${p.id}">复制地点</button></div><button class="popup-day" data-open-day="${day.id}:${index}">查看 ${dateLabel(day.id)} 行程</button>`);
    marker.on('click',()=>highlightMapPoint(day.id,index,false));markers.set(p.id,marker);return marker;
  }
  function showMap(id,fit=true){
    if(id==='all')id=state.active;
    if(!days.some(d=>d.id===id))return false;mapScope=id;
    const day=getDay(id);
    $('map-heading').textContent=`${dateLabel(id)} · ${day.city}`;
    const items=day.stops.map((s,index)=>({place:s.place,day:id,index}));
    const unique=items.filter((s,i,a)=>a.findIndex(x=>x.place===s.place)===i);
    let shown=unique.filter(s=>!transferPlaces.has(s.place));if(!shown.length)shown=unique;
    $('map-place-list').innerHTML=shown.map(s=>`<button data-map-place="${s.day}:${s.index}" title="${esc(places[s.place].name)}"><span>${dayMark(day,s.place)}</span>${esc(places[s.place].name)}</button>`).join('');
    $('map-caption').textContent='当天地点 · 点开交通可查看车站';
    if(!map)return true;
    routeLayer.clearLayers();markerLayer.clearLayers();highlightLayer.clearLayers();markers.clear();
    viewCoordinates=shown.map(s=>[places[s.place].lat,places[s.place].lng]);viewMaxZoom=15;
    for(let i=1;i<day.stops.length;i++){
      if(/飞机/.test(day.stops[i].via?.mode||''))continue;
      const a=places[day.stops[i-1].place],b=places[day.stops[i].place];
      L.polyline([[a.lat,a.lng],[b.lat,b.lng]],{color:'#6088ad',weight:2,dashArray:'5 7',interactive:false}).addTo(routeLayer);
    }
    for(const s of shown)addMapMarker(day,s.index);
    if(fit||!map._loaded)fitView();return true;
  }
  function highlightMapPoint(id,index,zoom=true){
    const day=getDay(id),s=day.stops[index];if(!s)return;
    if(mapScope!==id)showMap(id);
    if(map&&!markers.has(s.place))addMapMarker(day,index);
    const p=places[s.place];for(const [key,marker]of markers)marker.setIcon(icon(places[key],key===s.place));
    if(zoom&&map){viewCoordinates=[[p.lat,p.lng]];viewMaxZoom=16;fitView();markers.get(s.place)?.openPopup();}
    $('map-caption').textContent=`${dayMark(day,p.id)} · ${p.name}`;
  }
  function focusStop(id,index){
    document.querySelectorAll('.stop.selected').forEach(x=>x.classList.remove('selected'));
    $(`stop-${id}-${index}`)?.classList.add('selected');showMap(id);highlightMapPoint(id,index);
    notify(`地图已选中 ${places[getDay(id).stops[index].place].name}。`);
  }
  function showSegment(id,index){const d=getDay(id),a=d.stops[index-1],b=d.stops[index];if(!a||!b)return;showMap(id,false);if(map){addMapMarker(d,index-1);addMapMarker(d,index);viewCoordinates=[[places[a.place].lat,places[a.place].lng],[places[b.place].lat,places[b.place].lng]];viewMaxZoom=15;L.polyline(viewCoordinates,{color:'#007aff',weight:4}).addTo(highlightLayer);fitView();}$('map-caption').textContent=`${places[a.place].name} → ${places[b.place].name}`;}
  function renderTickets(){
    $('ticket-list').innerHTML=allTickets().map(t=>`<article class="rail-ticket ${t.booked?'booked':''}"><div class="rail-ticket-top"><span>${dateLabel(t.date)}</span><span class="pill">${t.booked?'已购票':'待购票'}</span></div><div class="rail-ticket-route"><strong>${esc(t.from)}</strong><span>→</span><strong>${esc(t.to)}</strong></div><p class="rail-ticket-service">${esc(t.service||'车次待补')}</p><div class="rail-ticket-time"><span class="${t.departure?'': 'time-pending'}">${t.departure?esc(t.departure):'出发待补'}</span><span class="ticket-time-arrow" aria-hidden="true">→</span><span class="${t.arrival?'': 'time-pending'}">${t.arrival?esc(t.arrival):'到达待补'}</span></div>${t.seat?`<p class="ticket-seat">${esc(t.seat)}</p>`:''}${t.note?`<p class="ticket-note">${esc(t.note)}</p>`:''}<div class="rail-ticket-actions"><button class="inline-button" data-edit-ticket="${esc(t.id)}">${t.booked?'编辑':'填写车票'}</button>${t.url?external(t.url,'购票'):''}${!(ticketDefaults||[]).some(x=>x.id===t.id)?`<button class="inline-button" data-delete-ticket="${esc(t.id)}">删除</button>`:''}</div></article>`).join('');
  }
  function openTicket(id){const t=allTickets().find(x=>x.id===id)||{id:'',date:state.active};$('ticket-form').hidden=false;$('ticket-form-title').textContent=id?'填写车票':'添加车票';for(const key of ['id','date','service','from','to','departure','arrival','seat','note'])$('ticket-'+key).value=t[key]||'';$('ticket-booked').checked=!!t.booked;$('ticket-service').focus({preventScroll:true});}
  function closeTicket(){$('ticket-form').hidden=true;$('ticket-form').reset();}
  async function copyPlace(id){const text=places[id].query;try{await navigator.clipboard.writeText(text);notify('已复制地点名称，可粘贴到地图应用。');}catch{const input=document.createElement('textarea');input.value=text;input.style.cssText='position:fixed;left:0;top:0;opacity:0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();notify(ok?'已复制地点名称。':`地点名称：${text}`);}}
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.date)selectDay(b.dataset.date);
    if(b.dataset.choice)selectPlan(b.dataset.choiceDay,b.dataset.choice);
    if(b.dataset.focus){const [id,n]=b.dataset.focus.split(':');focusStop(id,Number(n));}
    if(b.dataset.mapPlace){const [id,n]=b.dataset.mapPlace.split(':');highlightMapPoint(id,Number(n));}
    if(b.dataset.openDay){const [id,n]=b.dataset.openDay.split(':');if(mapExpanded)setMapExpanded(false);selectDay(id);$(`stop-${id}-${n}`)?.classList.add('selected');notify(`已切换到 ${dateLabel(id)}，在下方查看行程。`);}
    if(b.dataset.route){const [id,n]=b.dataset.route.split(':');showSegment(id,Number(n));$('map-shell').scrollIntoView({behavior:'smooth',block:'start'});}
    if(b.dataset.copyPlace)copyPlace(b.dataset.copyPlace);
    if(b.dataset.mealFilter){
      const section=b.closest('.day-food'),key=b.dataset.mealFilter;activeMeal=key;
      section.querySelectorAll('[data-meal-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mealFilter===key)));
      section.querySelectorAll('[data-meal-slot]').forEach(x=>{x.hidden=x.dataset.mealSlot!==key;});
    }
    if(b.dataset.editTicket)openTicket(b.dataset.editTicket);
    if(b.dataset.deleteTicket){state.tickets=state.tickets.filter(t=>t.id!==b.dataset.deleteTicket);renderTickets();reportSaved('已移除车票。');}
  });
  document.addEventListener('change',event=>{if(event.target.dataset.completeDay)completePlan(event.target.dataset.completeDay,event.target.checked);if(event.target.dataset.candidateDay)selectPlan(event.target.dataset.candidateDay,event.target.value);});
  $('dates').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let i=days.findIndex(d=>d.id===state.active);i=event.key==='Home'?0:event.key==='End'?days.length-1:(i+(event.key==='ArrowRight'?1:-1)+days.length)%days.length;selectDay(days[i].id);$(`date-${days[i].id}`).focus({preventScroll:true});const tab=$(`date-${days[i].id}`);$('dates').scrollLeft=tab.offsetLeft-$('dates').clientWidth/2+tab.clientWidth/2;});
  $('journey').addEventListener('toggle',event=>{const el=event.target;if(el.matches('details.transit')&&el.open)showSegment(el.dataset.transitDay,Number(el.dataset.transitIndex));},true);
  $('map-toggle').addEventListener('click',()=>{const compact=$('map-shell').classList.toggle('compact');$('map-toggle').textContent=compact?'展开 ＋':'收起 −';$('map-toggle').setAttribute('aria-expanded',String(!compact));});
  $('map-retry').addEventListener('click',()=>setMapSource('gsi'));
  $('map-reset').addEventListener('click',()=>showMap(mapScope));
  $('map-expand').addEventListener('click',()=>setMapExpanded(!mapExpanded));
  window.addEventListener('online',()=>{if(baseMode==='outline')setMapSource('gsi');});
  document.addEventListener('keydown',event=>{
    if(!mapExpanded)return;
    if(event.key==='Escape'){event.preventDefault();setMapExpanded(false);return;}
    if(event.key!=='Tab')return;
    const focusable=[...$('map-shell').querySelectorAll('button,a[href],select,summary,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
  $('ticket-date').innerHTML=days.map(d=>`<option value="${d.id}">${dateLabel(d.id)}</option>`).join('');
  $('add-ticket').addEventListener('click',()=>openTicket());$('cancel-ticket').addEventListener('click',closeTicket);
  $('ticket-form').addEventListener('submit',event=>{event.preventDefault();const t={};for(const key of ['id','date','service','from','to','departure','arrival','seat','note'])t[key]=$('ticket-'+key).value.trim();if(!t.from||!t.to||!days.some(d=>d.id===t.date))return;t.id=t.id||newId();t.booked=$('ticket-booked').checked;t.url=allTickets().find(x=>x.id===t.id)?.url||'';const i=state.tickets.findIndex(x=>x.id===t.id);if(i<0)state.tickets.push(t);else state.tickets[i]=t;renderTickets();renderDays();closeTicket();reportSaved('车票已保存。');});
  renderDates();renderDays();renderTickets();initMap();if(!save())warning='浏览器未允许保存，修改只在当前页面保留。';if(warning)notify(warning);
  window.TRIP_APP=Object.freeze({getState:()=>JSON.parse(JSON.stringify(state)),exportData:()=>JSON.parse(JSON.stringify(state)),validateData,importData,selectDay,selectPlan,completePlan,candidates:allowedFor,getDay,showMap});
  document.addEventListener('snackbookchange',renderDays);
  window.SNACK_BOOK?.initialize();window.FLIGHTS?.initialize();window.TRAVEL_BACKUP?.initialize();
  const context=document.modelContext;
  if(context?.registerTool){const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});for(const t of [{name:'read_hokkaido_day',description:'Read the chosen itinerary for one date.',annotations:{readOnlyHint:true},inputSchema:{type:'object',properties:{date:{type:'string',enum:days.map(d=>d.id)}},required:['date'],additionalProperties:false},execute:async input=>days.some(d=>d.id===input?.date)?getDay(input.date):{error:'Unknown date'}},{name:'choose_hokkaido_day',description:'Choose an available itinerary locally, without booking anything.',annotations:{readOnlyHint:false},inputSchema:{type:'object',properties:{date:{type:'string',enum:Object.keys(config)},route:{type:'string',enum:Object.keys(variants)}},required:['date','route'],additionalProperties:false},execute:async input=>({ok:!!input&&selectPlan(input.date,input.route)})}]){try{Promise.resolve(context.registerTool(t,{signal:lifecycle.signal})).catch(()=>{});}catch{}}}
})();

