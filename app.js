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
  function candidateReason(id){const prev=config[id].previous;if(!prev)return '';const completed=state.completed[prev];return completed?`${dateLabel(prev)} 的${variants[completed].label}已去过。`:`${dateLabel(prev)} 未去的地方仍可留到今天。`;}
  const choiceSub=(id,p)=>id==='01-02'&&p==='biei'?'青池 · 双瀑布 · 精灵露台':p==='zoo'&&state.completed['12-30']==='asahi'?'上午动物园 · 下午休息':variants[p].sub;
  function choiceHTML(day){
    const id=day.id,selected=state.selected[id],allowed=allowedFor(id);
    return `<div class="choices ${state.slots[id].length===1?'single':''}" role="group" aria-label="${dateLabel(id)} 行程选择">${state.slots[id].map((p,i)=>`<button class="choice" data-choice-day="${id}" data-choice="${p}" aria-pressed="${p===selected}"><span class="choice-letter">${i?'B':'A'}</span><span><strong>${esc(variants[p].label)}</strong><small>${esc(choiceSub(id,p))}</small></span>${p===selected?'<span class="choice-check">✓</span>':''}</button>`).join('')}</div><div class="choice-meta">${candidateReason(id)?`<p class="choice-reason">${esc(candidateReason(id))}</p>`:''}${allowed.length>2?`<label class="candidate-label">其他去处<select data-candidate-day="${id}">${allowed.map(p=>`<option value="${p}" ${p===selected?'selected':''}>${esc(variants[p].label)}</option>`).join('')}</select></label>`:''}<label class="complete-label"><input type="checkbox" data-complete-day="${id}" ${state.completed[id]===selected?'checked':''}>今天已去过</label></div>`;
  }
  function admissionHTML(p){
    const t=p.admission;if(!t)return '';
    return `<div class="admission"><div class="admission-head"><span>${esc(t.label||'门票')}</span><strong>${esc(t.price)}</strong></div><p>${esc(t.note)}</p><div class="admission-links">${t.links.map(x=>external(x.url,x.label)).join('')}</div></div>`;
  }
  function walkHTML(w){if(!w)return '';return `<div class="walk-route"><strong>↝ ${esc(w.title)}</strong><p>${esc(w.description)}</p><div>${w.links.map(x=>external(x.url,x.label)).join(' ')}</div></div>`;}
  function stopHTML(stop,day,index){
    const p=places[stop.place];
    return `<div class="stop" id="stop-${day.id}-${index}" data-day="${day.id}" data-stop="${index}" data-place="${p.id}"><div class="stop-time">${esc(stop.time)}</div><button class="stop-number" data-focus="${day.id}:${index}" aria-label="查看 ${p.n} ${esc(p.name)}">${p.n}</button><div class="stop-content"><button class="stop-title" data-focus="${day.id}:${index}">${esc(stop.title||p.name)}</button>${stop.kind?`<span class="stop-kind">${esc(stop.kind)}</span>`:''}${stop.desc?`<p class="stop-description">${esc(stop.desc)}</p>`:''}<div class="stop-links">${external(searchUrl(p.id),'Google Maps')}${p.booking?external(p.booking,'预约'):''}${p.url?external(p.url,'官网'):''}<button class="inline-button" data-copy-place="${p.id}">复制地点</button></div>${day.stops.findIndex(s=>s.place===p.id)===index?admissionHTML(p):''}${walkHTML(stop.walk)}</div></div>`;
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
  function foodCard(id){
    const v=window.FOOD.venues[id];
    return `<article class="food-card" data-food-venue="${esc(id)}"><h5>${esc(v.name)}</h5><p class="food-near">${esc(v.near)}</p><p class="food-eat">${esc(v.eat)}</p><address class="food-address">${esc(v.address)}</address>${v.note?`<p class="food-caution">${esc(v.note)}</p>`:''}<div class="food-links">${external(foodMap(v.query),'Google Maps')}${external(v.url,'门店资料')}</div>${v.transport?`<details class="food-transport"><summary>公交怎么去</summary><p>${esc(v.transport)}</p>${external(v.transportUrl,'官方参考时刻')}</details>`:''}</article>`;
  }
  function foodHTML(day){
    const f=window.FOOD.forDay(day,state.selected[day.id]);
    const labels={breakfast:'早餐',lunch:'午餐',dinner:'晚餐',sweets:'甜点'};
    const slots=Object.entries(labels).filter(([key])=>f[key]);
    const pantry=(f.snacks||[]).map(id=>{const s=window.FOOD.snacks[id];return `<div class="snack-item"><strong>${esc(s.name)}</strong><p>${esc(s.note)}</p>${external(s.url,'商品参考')}</div>`;}).join('');
    return `<section class="day-food" id="food-${day.id}" aria-labelledby="food-heading-${day.id}"><div class="food-heading"><h3 id="food-heading-${day.id}">吃饭与小食</h3><p>沿途候选 · 挑想吃的就好</p></div><div class="meal-filters" role="group" aria-label="筛选餐食"><button class="meal-filter" data-meal-filter="all" aria-pressed="true">全部</button>${slots.map(([key,label])=>`<button class="meal-filter" data-meal-filter="${key}" aria-pressed="false">${label}</button>`).join('')}</div><div class="meal-list">${slots.map(([key,label])=>{const meal=f[key];return `<section class="meal-slot" data-meal-slot="${key}" aria-label="${label}"><h4>${label}</h4><div><p class="meal-note">${esc(meal.note)}</p>${meal.venues.length?`<div class="food-cards">${meal.venues.map(foodCard).join('')}</div>`:''}${meal.query?`<div class="food-links">${external(foodMap(meal.query),'附近店铺 · Google Maps')}</div>`:''}</div></section>`;}).join('')}</div><div class="food-memo"><strong>小记</strong>${f.notes.map(note=>`<p>${esc(note)}</p>`).join('')}</div><details class="food-pantry"><summary>便利店与小零食</summary><p>有空再挑，口味和库存以店内为准。</p><div class="snack-list">${pantry}</div><div class="pantry-links">${external(foodMap(f.area+' コンビニ'),'附近便利店')}${!['12-23','01-07'].includes(day.id)?external(foodMap(f.area+' セイコーマート'),'附近 Seicomart'):''}</div></details></section>`;
  }
  function renderDays(){
    const day=getDay(state.active),raw=days.find(d=>d.id===state.active),i=days.indexOf(raw);
    const weekday=new Intl.DateTimeFormat('zh-CN',{weekday:'long',timeZone:'Asia/Tokyo'}).format(new Date(day.date+'T12:00:00+09:00'));
    const summary=day.summary||day.stops.filter((s,i,a)=>!i||s.place!==a[i-1].place).slice(0,3).map(s=>places[s.place].name).join(' → ');
    $('journey').innerHTML=`<section class="day" id="day-${day.id}" role="tabpanel" aria-labelledby="date-${day.id}"><aside class="day-stamp"><p class="day-count">DAY ${String(i+1).padStart(2,'0')}</p><time class="day-date" datetime="${day.date}">${dateLabel(day.id)}</time><p class="day-weekday">${weekday}</p><span class="day-city">${esc(day.city)}</span></aside><div class="day-body"><p class="day-summary" title="${esc(summary)}">${esc(summary)}</p><button class="food-jump" data-food-jump>吃饭与小食 ↓</button>${raw.choice?choiceHTML(raw):''}${day.alert?`<div class="day-alert"><span>◌</span><div>${esc(day.alert)} ${day.alertUrl?external(day.alertUrl,'查看公告'):''}</div></div>`:''}<div class="timeline">${day.stops.map((s,i)=>(i?transitHTML(s,day.stops[i-1],day,i):'')+stopHTML(s,day,i)).join('')}</div>${hotelHTML(day.hotel)}${foodHTML(day)}</div></section>`;
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
    if(mapScope!=='all')showMap(state.active);else showMap('all');
    if(changed.length)message+=` ${changed.map(dateLabel).join('、')} 的候补已更新，完成标记已清除。`;
    reportSaved(message);
  }
  function selectPlan(id,plan){if(!Object.hasOwn(config,id)||!allowedFor(id).includes(plan))return false;if(state.selected[id]===plan)return true;const old=state.selected[id];if(!state.slots[id].includes(plan))state.slots[id][Math.max(0,state.slots[id].indexOf(old))]=plan;state.selected[id]=plan;delete state.completed[id];updateChoice(id,`已选${variants[plan].label}。`);return true;}
  function completePlan(id,checked){if(!Object.hasOwn(config,id))return false;if(checked)state.completed[id]=state.selected[id];else delete state.completed[id];updateChoice(id,checked?'已记为去过。':'已取消完成。');return true;}
  let map,routeLayer,markerLayer,highlightLayer,streetLayer,labelsLayer,mapScope='all';
  let viewCoordinates=[],viewMaxZoom=14,streetMode=false;
  const markers=new Map();
  const icon=(p,selected=false)=>L.divIcon({className:'map-pin'+(selected?' selected':''),html:esc(p.n),iconSize:[30,30],iconAnchor:[15,15]});
  function fitView(){if(map&&viewCoordinates.length)map.fitBounds(L.latLngBounds(viewCoordinates),{padding:[35,30],maxZoom:viewMaxZoom,animate:false});}
  function initMap(){
    if(!window.L){$('map').innerHTML='<p class="map-error">地图组件未载入，请保留完整项目文件夹。</p>';return;}
    map=L.map('map',{zoomControl:false,scrollWheelZoom:false,preferCanvas:true,zoomSnap:0.25});L.control.zoom({position:'topright'}).addTo(map);
    if(window.GEOGRAPHY)L.geoJSON(GEOGRAPHY,{interactive:false,style:{fillColor:'#f0f1e6',fillOpacity:1,color:'#c4d0bd',weight:1}}).addTo(map);
    map.attributionControl.addAttribution('Natural Earth');
    const TimedTiles=L.TileLayer.extend({createTile(coords,done){const tile=document.createElement('img');tile.alt='';tile.crossOrigin='anonymous';let settled=false;const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);tile.onload=null;tile.onerror=null;done(error,tile);if(error)tile.src=L.Util.emptyImageUrl;};const timer=setTimeout(()=>finish(new Error('Map unavailable')),7000);tile.onload=()=>finish(null);tile.onerror=()=>finish(new Error('Map unavailable'));tile.src=this.getTileUrl(coords);return tile;}});
    streetLayer=new TimedTiles('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{minZoom:2,maxZoom:18,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>'});
    let loaded=0;
    streetLayer.on('loading',()=>{loaded=0;});
    streetLayer.on('tileload',()=>{loaded++;if(streetMode)$('map-connectivity').hidden=true;});
    streetLayer.on('load',()=>{if(streetMode&&!loaded){$('map-connectivity').textContent='街道图暂不可用，路线与地点仍可查看';$('map-connectivity').hidden=false;}});
    labelsLayer=L.layerGroup().addTo(map);
    [['函馆',41.83,140.75],['洞爷湖',42.64,140.83],['登别',42.49,141.24],['札幌',43.00,141.43],['小樽',43.24,140.91],['旭川',43.85,142.44],['美瑛',43.57,142.55],['富良野',43.29,142.46],['旭岳',43.70,142.88]].forEach(([name,lat,lng])=>L.marker([lat,lng],{interactive:false,icon:L.divIcon({className:'city-map-label'+(['函馆','札幌','旭川'].includes(name)?' city-primary':''),html:esc(name),iconSize:[70,20]})}).addTo(labelsLayer));
    routeLayer=L.layerGroup().addTo(map);markerLayer=L.layerGroup().addTo(map);highlightLayer=L.layerGroup().addTo(map);
    showMap('all');new ResizeObserver(()=>{map.invalidateSize({pan:false});fitView();}).observe($('map'));
  }
  function overviewStops(){
    const ids=['hakodate','toya','nobori','asahikawa'];
    if(['12-30','01-02'].some(id=>state.selected[id]==='biei'))ids.push('biei','ningle');
    if(state.selected['01-02']==='zoo')ids.push('zoo');
    ids.push('lavista','sapporo','otarust','cts');
    return ids.map(place=>{for(const d of days){const index=getDay(d.id).stops.findIndex(s=>s.place===place);if(index>=0)return {place,day:d.id,index};}return null;}).filter(Boolean);
  }
  function showMap(id,fit=true){
    if(id!=='all'&&!days.some(d=>d.id===id))return false;mapScope=id;
    $('map-heading').textContent=id==='all'?'北海道路线':`${dateLabel(id)} · ${getDay(id).city}`;$('overview').setAttribute('aria-pressed',String(id==='all'));
    const items=id==='all'?overviewStops():getDay(id).stops.map((s,index)=>({place:s.place,day:id,index}));
    const unique=items.filter((s,i,a)=>a.findIndex(x=>x.place===s.place)===i);
    $('map-place-list').innerHTML=unique.map(s=>`<button data-map-place="${s.day}:${s.index}" title="${esc(places[s.place].name)}"><span>${places[s.place].n}</span>${esc(places[s.place].name)}</button>`).join('');
    $('map-caption').textContent=id==='all'?'北海道段 · 地点连线为到访顺序':'点编号或下方地点名查看详情';
    if(!map)return true;
    routeLayer.clearLayers();markerLayer.clearLayers();highlightLayer.clearLayers();markers.clear();
    if(id==='all'){if(!map.hasLayer(labelsLayer))labelsLayer.addTo(map);}else if(map.hasLayer(labelsLayer))map.removeLayer(labelsLayer);
    viewCoordinates=items.map(s=>[places[s.place].lat,places[s.place].lng]);viewMaxZoom=id==='all'?7:14;
    if(viewCoordinates.length>1)L.polyline(viewCoordinates,{color:'#557665',weight:2.5,dashArray:'5 7',interactive:false}).addTo(routeLayer);
    for(const s of unique){const p=places[s.place];const marker=L.marker([p.lat,p.lng],{icon:icon(p),title:`${p.n} ${p.name}`}).addTo(markerLayer);marker.bindPopup(`<span class="popup-number">${p.n}</span><b class="popup-title">${esc(p.name)}</b><div class="popup-links">${external(searchUrl(p.id),'Google Maps')}<button data-copy-place="${p.id}">复制地点</button></div><button class="popup-day" data-open-day="${s.day}:${s.index}">查看 ${dateLabel(s.day)} 行程</button>`);marker.on('click',()=>highlightMapPoint(s.day,s.index,false));markers.set(s.place,marker);}
    if(fit||!map._loaded)fitView();return true;
  }
  function highlightMapPoint(id,index,zoom=true){
    const s=getDay(id).stops[index];if(!s)return;
    if(mapScope!==id&&mapScope!=='all')showMap(id);
    if(!markers.has(s.place))showMap(id);
    const p=places[s.place];for(const [key,marker]of markers)marker.setIcon(icon(places[key],key===s.place));
    if(zoom&&map){viewCoordinates=[[p.lat,p.lng]];viewMaxZoom=14;fitView();markers.get(s.place)?.openPopup();}
    $('map-caption').textContent=`${p.n} · ${p.name}`;
  }
  function focusStop(id,index){
    document.querySelectorAll('.stop.selected').forEach(x=>x.classList.remove('selected'));
    $(`stop-${id}-${index}`)?.classList.add('selected');showMap(id);highlightMapPoint(id,index);
    notify(`地图已选中 ${places[getDay(id).stops[index].place].name}。`);
  }
  function showSegment(id,index){const d=getDay(id),a=d.stops[index-1],b=d.stops[index];if(!a||!b)return;showMap(id,false);if(map){viewCoordinates=[[places[a.place].lat,places[a.place].lng],[places[b.place].lat,places[b.place].lng]];viewMaxZoom=14;L.polyline(viewCoordinates,{color:'#b9603d',weight:4}).addTo(highlightLayer);fitView();}$('map-caption').textContent=`${places[a.place].n} → ${places[b.place].n} · ${b.via.mode}`;}
  function renderTickets(){
    $('ticket-list').innerHTML=allTickets().map(t=>`<article class="rail-ticket ${t.booked?'booked':''}"><div class="rail-ticket-top"><span>${dateLabel(t.date)}</span><span class="pill">${t.booked?'已购票':'待购票'}</span></div><div class="rail-ticket-route"><strong>${esc(t.from)}</strong><span>→</span><strong>${esc(t.to)}</strong></div><p class="rail-ticket-service">${esc(t.service||'车次待补')}</p><div class="rail-ticket-time">${t.departure?esc(t.departure):'出发待补'} <span>—</span> ${t.arrival?esc(t.arrival):'到达待补'}</div>${t.seat?`<p class="ticket-seat">${esc(t.seat)}</p>`:''}${t.note?`<p class="ticket-note">${esc(t.note)}</p>`:''}<div class="rail-ticket-actions"><button class="inline-button" data-edit-ticket="${esc(t.id)}">${t.booked?'编辑':'填写车票'}</button>${t.url?external(t.url,'购票'):''}${!(ticketDefaults||[]).some(x=>x.id===t.id)?`<button class="inline-button" data-delete-ticket="${esc(t.id)}">删除</button>`:''}</div></article>`).join('');
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
    if(b.dataset.openDay){const [id,n]=b.dataset.openDay.split(':');selectDay(id);$(`stop-${id}-${n}`)?.classList.add('selected');notify(`已切换到 ${dateLabel(id)}，在下方查看行程。`);}
    if(b.dataset.route){const [id,n]=b.dataset.route.split(':');showSegment(id,Number(n));$('map-shell').scrollIntoView({behavior:'smooth',block:'start'});}
    if(b.dataset.copyPlace)copyPlace(b.dataset.copyPlace);
    if(b.hasAttribute('data-food-jump'))$(`food-${state.active}`)?.scrollIntoView({behavior:'smooth',block:'start'});
    if(b.dataset.mealFilter){
      const section=b.closest('.day-food'),key=b.dataset.mealFilter;
      section.querySelectorAll('[data-meal-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mealFilter===key)));
      section.querySelectorAll('[data-meal-slot]').forEach(x=>{x.hidden=key!=='all'&&x.dataset.mealSlot!==key;});
    }
    if(b.dataset.editTicket)openTicket(b.dataset.editTicket);
    if(b.dataset.deleteTicket){state.tickets=state.tickets.filter(t=>t.id!==b.dataset.deleteTicket);renderTickets();reportSaved('已移除车票。');}
  });
  document.addEventListener('change',event=>{if(event.target.dataset.completeDay)completePlan(event.target.dataset.completeDay,event.target.checked);if(event.target.dataset.candidateDay)selectPlan(event.target.dataset.candidateDay,event.target.value);});
  $('dates').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let i=days.findIndex(d=>d.id===state.active);i=event.key==='Home'?0:event.key==='End'?days.length-1:(i+(event.key==='ArrowRight'?1:-1)+days.length)%days.length;selectDay(days[i].id);$(`date-${days[i].id}`).focus({preventScroll:true});const tab=$(`date-${days[i].id}`);$('dates').scrollLeft=tab.offsetLeft-$('dates').clientWidth/2+tab.clientWidth/2;});
  $('journey').addEventListener('toggle',event=>{const el=event.target;if(el.matches('details.transit')&&el.open)showSegment(el.dataset.transitDay,Number(el.dataset.transitIndex));},true);
  $('overview').addEventListener('click',()=>showMap('all'));
  $('map-toggle').addEventListener('click',()=>{const compact=$('map-shell').classList.toggle('compact');$('map-toggle').textContent=compact?'展开 ＋':'收起 −';$('map-toggle').setAttribute('aria-expanded',String(!compact));});
  $('street-toggle').addEventListener('click',()=>{if(!map)return;streetMode=!streetMode;$('street-toggle').setAttribute('aria-pressed',String(streetMode));$('street-toggle').textContent=streetMode?'路线图':'街道图';if(streetMode){$('map-connectivity').textContent='正在载入街道图…';$('map-connectivity').hidden=false;streetLayer.addTo(map);}else{map.removeLayer(streetLayer);$('map-connectivity').hidden=true;}});
  $('ticket-date').innerHTML=days.map(d=>`<option value="${d.id}">${dateLabel(d.id)}</option>`).join('');
  $('add-ticket').addEventListener('click',()=>openTicket());$('cancel-ticket').addEventListener('click',closeTicket);
  $('ticket-form').addEventListener('submit',event=>{event.preventDefault();const t={};for(const key of ['id','date','service','from','to','departure','arrival','seat','note'])t[key]=$('ticket-'+key).value.trim();if(!t.from||!t.to||!days.some(d=>d.id===t.date))return;t.id=t.id||newId();t.booked=$('ticket-booked').checked;t.url=allTickets().find(x=>x.id===t.id)?.url||'';const i=state.tickets.findIndex(x=>x.id===t.id);if(i<0)state.tickets.push(t);else state.tickets[i]=t;renderTickets();renderDays();closeTicket();reportSaved('车票已保存。');});
  renderDates();renderDays();renderTickets();initMap();if(!save())warning='浏览器未允许保存，修改只在当前页面保留。';if(warning)notify(warning);
  window.TRIP_APP=Object.freeze({getState:()=>JSON.parse(JSON.stringify(state)),selectDay,selectPlan,completePlan,candidates:allowedFor,getDay,showMap});
  const context=document.modelContext;
  if(context?.registerTool){const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});for(const t of [{name:'read_hokkaido_day',description:'Read the chosen itinerary for one date.',annotations:{readOnlyHint:true},inputSchema:{type:'object',properties:{date:{type:'string',enum:days.map(d=>d.id)}},required:['date'],additionalProperties:false},execute:async input=>days.some(d=>d.id===input?.date)?getDay(input.date):{error:'Unknown date'}},{name:'choose_hokkaido_day',description:'Choose an available itinerary locally, without booking anything.',annotations:{readOnlyHint:false},inputSchema:{type:'object',properties:{date:{type:'string',enum:Object.keys(config)},route:{type:'string',enum:Object.keys(variants)}},required:['date','route'],additionalProperties:false},execute:async input=>({ok:!!input&&selectPlan(input.date,input.route)})}]){try{Promise.resolve(context.registerTool(t,{signal:lifecycle.signal})).catch(()=>{});}catch{}}}
})();

