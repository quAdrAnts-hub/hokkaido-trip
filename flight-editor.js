/* Personal flight cards. Changes stay separate from the daily itinerary. */
(() => {
  'use strict';
  const STORAGE_KEY = 'hokkaido-flights-v1';
  const statuses = { unconfirmed: '待确认', unbooked: '待购票', booked: '已购票' };
  const defaults = [
    { id: 'flight-outbound', date: '2026-12-23', fromLabel: '出发地', fromCode: '', toLabel: '成田', toCode: 'NRT', departure: '', arrival: '', flightNumber: '', status: 'unconfirmed', url: '', note: '晚间抵达 · 航班号、起降时间待补' },
    { id: 'flight-hakodate', date: '2026-12-24', fromLabel: '羽田', fromCode: 'HND', toLabel: '函馆', toCode: 'HKD', departure: '14:40', arrival: '16:00', flightNumber: '', status: 'unconfirmed', url: '', note: '航班号待补 · 上午需跨机场' },
    { id: 'flight-narita', date: '2027-01-06', fromLabel: '新千岁', fromCode: 'CTS', toLabel: '成田', toCode: 'NRT', departure: '18:10', arrival: '19:55', flightNumber: '', status: 'unconfirmed', url: '', note: '1 小时 45 分钟 · 落地后乘酒店接送' },
    { id: 'flight-return', date: '2027-01-07', fromLabel: '成田', fromCode: 'NRT', toLabel: '目的地', toCode: '', departure: '16:00', arrival: '', flightNumber: '', status: 'unconfirmed', url: '', note: '航班号、目的地待补' }
  ];
  const fields = ['id', 'date', 'fromLabel', 'fromCode', 'toLabel', 'toCode', 'departure', 'arrival', 'flightNumber', 'status', 'url', 'note'];
  const defaultIds = new Set(defaults.map(flight => flight.id));
  const clone = value => JSON.parse(JSON.stringify(value));
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let data = { version: 1, flights: clone(defaults) };
  let grid, form, statusNode, addButton, initialized = false, editingId = '', returnFocus = null;

  function text(value, label, max, required = false) {
    if (typeof value !== 'string') throw new Error(`${label}格式不正确。`);
    const clean = value.trim();
    if ((required && !clean) || clean.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(clean)) throw new Error(`请检查${label}。`);
    return clean;
  }
  function cleanFlight(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('机票内容格式不正确。');
    const flight = {};
    flight.id = text(value.id, '机票标识', 100, true);
    if (!defaultIds.has(flight.id) && !/^flight-custom-[A-Za-z0-9-]{1,80}$/.test(flight.id)) throw new Error('机票标识不正确。');
    flight.date = text(value.date, '乘机日期', 10, true);
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(flight.date) || !Number.isFinite(Date.parse(flight.date + 'T00:00:00Z')) || new Date(flight.date + 'T00:00:00Z').toISOString().slice(0, 10) !== flight.date) throw new Error('请填写有效的乘机日期。');
    for (const key of ['fromLabel', 'toLabel']) flight[key] = text(value[key], key === 'fromLabel' ? '出发机场' : '到达机场', 70, true);
    for (const key of ['fromCode', 'toCode']) {
      flight[key] = text(value[key], '机场代码', 4).toUpperCase();
      if (flight[key] && !/^[A-Z]{3,4}$/.test(flight[key])) throw new Error('机场代码请填 3–4 个英文字母，或留空。');
    }
    for (const key of ['departure', 'arrival']) {
      flight[key] = text(value[key], '起降时间', 5);
      if (flight[key] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(flight[key])) throw new Error('起降时间请使用 HH:mm 格式，或留空。');
    }
    flight.flightNumber = text(value.flightNumber, '航班号', 24);
    flight.status = text(value.status, '购票状态', 20, true);
    if (!Object.hasOwn(statuses, flight.status)) throw new Error('购票状态不正确。');
    flight.url = text(value.url, '参考链接', 2048);
    if (flight.url) {
      let parsed;
      try { parsed = new URL(flight.url); } catch { throw new Error('参考链接请填写完整的 http 或 https 网址。'); }
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('参考链接请填写不含账号密码的 http 或 https 网址。');
      flight.url = parsed.href;
    }
    flight.note = text(value.note, '备注', 300);
    return flight;
  }
  function validateData(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 || !Array.isArray(value.flights) || value.flights.length < defaults.length || value.flights.length > 40) throw new Error('机票备份格式不正确，最多保留 40 张机票。');
    const flights = value.flights.map(cleanFlight);
    const ids = new Set(flights.map(flight => flight.id));
    if (ids.size !== flights.length || defaults.some(flight => !ids.has(flight.id))) throw new Error('机票备份包含重复项，或缺少原有机票。');
    return { version: 1, flights };
  }
  function exportData() { return clone(data); }
  function importData(value) {
    const clean = validateData(value);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clean)); }
    catch { throw new Error('浏览器未允许保存机票，请检查存储权限后再试。'); }
    data = clean;
    if (initialized) { closeForm(false); render(); }
    return exportData();
  }
  function announce(message, error = false) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.classList.toggle('is-error', error);
  }
  function sameAsDefault(flight) {
    const original = defaults.find(item => item.id === flight.id);
    return original && fields.every(key => original[key] === flight[key]);
  }
  function render() {
    if (!grid) return;
    const flights = [...data.flights].sort((a, b) => a.date.localeCompare(b.date) || (a.departure || '99:99').localeCompare(b.departure || '99:99'));
    grid.innerHTML = flights.map(flight => {
      const e = escapeHTML, date = flight.date.slice(5).replace('-', ' / ');
      return `<article class="flight editable-flight${flight.status === 'booked' ? ' booked' : ''}">
        <div class="flight-top"><span>${e(date)} <span class="flight-year">${e(flight.date.slice(0, 4))}</span></span><span class="pill">${e(statuses[flight.status])}</span></div>
        <div class="airports"><div><strong>${e(flight.fromCode || flight.fromLabel)}</strong><small>${flight.fromCode ? e(flight.fromLabel) + ' ' : ''}<b>${e(flight.departure || '待补')}</b></small></div><span class="flight-path" aria-hidden="true">✈</span><div><strong>${e(flight.toCode || flight.toLabel)}</strong><small>${flight.toCode ? e(flight.toLabel) + ' ' : ''}<b>${e(flight.arrival || '待补')}</b></small></div></div>
        <p class="flight-number">${e(flight.flightNumber || '航班号待补')}</p>${flight.note ? `<p class="flight-card-note">${e(flight.note)}</p>` : ''}
        <div class="flight-card-actions"><button type="button" class="inline-button" data-flight-edit="${e(flight.id)}" aria-label="编辑 ${e(date)} ${e(flight.fromLabel)}到${e(flight.toLabel)}机票">编辑</button>${flight.url ? `<a href="${e(flight.url)}" target="_blank" rel="noopener noreferrer">参考链接 ↗</a>` : ''}${defaultIds.has(flight.id) ? (!sameAsDefault(flight) ? `<button type="button" class="inline-button" data-flight-reset="${e(flight.id)}">恢复原信息</button>` : '') : `<button type="button" class="inline-button" data-flight-delete="${e(flight.id)}" aria-label="删除 ${e(date)} ${e(flight.fromLabel)}到${e(flight.toLabel)}机票">删除</button>`}</div>
      </article>`;
    }).join('');
    addButton.disabled = data.flights.length >= 40;
  }
  function field(key) { return form.elements.namedItem(key); }
  function openForm(id, opener) {
    const flight = data.flights.find(item => item.id === id) || { date: '2027-01-07', status: 'unconfirmed' };
    editingId = flight.id || '';
    returnFocus = opener || addButton;
    form.querySelector('h3').textContent = editingId ? '编辑机票' : '添加机票';
    form.reset();
    for (const key of fields.filter(key => key !== 'id')) field(key).value = flight[key] || '';
    form.querySelector('.flight-form-error').textContent = '';
    form.hidden = false;
    addButton.setAttribute('aria-expanded', 'true');
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    field('date').focus({ preventScroll: true });
  }
  function closeForm(restoreFocus = true) {
    if (!form) return;
    form.hidden = true;
    form.reset();
    editingId = '';
    addButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) (returnFocus?.isConnected ? returnFocus : addButton).focus({ preventScroll: true });
  }
  function changeFlight(id, reset) {
    try {
      const next = exportData();
      if (reset) next.flights = next.flights.map(flight => flight.id === id ? clone(defaults.find(item => item.id === id)) : flight);
      else next.flights = next.flights.filter(flight => flight.id !== id);
      importData(next);
      announce(reset ? '已恢复原有机票信息。' : '这张新增机票已删除。');
      addButton.focus({ preventScroll: true });
    } catch (error) { announce(error.message, true); }
  }
  function initialize() {
    if (initialized) return;
    grid = document.getElementById('flight-grid') || document.querySelector('.flight-grid') || document.querySelector('.flights');
    if (!grid) return;
    grid.id = grid.id || 'flight-grid';
    grid.classList.add('flight-grid');
    const header = document.createElement('div');
    header.className = 'flight-editor-heading rail-heading';
    header.innerHTML = '<h2 id="flight-editor-title">机票</h2><button type="button" class="text-button" id="add-flight" aria-expanded="false" aria-controls="flight-edit-form">＋ 添加机票</button>';
    grid.before(header);
    grid.setAttribute('aria-labelledby', 'flight-editor-title');
    addButton = header.querySelector('button');
    form = document.createElement('form');
    form.id = 'flight-edit-form';
    form.className = 'flight-edit-form ticket-form';
    form.hidden = true;
    form.innerHTML = `<div class="section-heading"><h3 id="flight-edit-title">添加机票</h3><button type="button" class="text-button" data-flight-close>关闭 ×</button></div>
      <p class="flight-form-help">按机票填写当地起降时间。保存仅更新机票卡片，下方行程保持原样。</p>
      <div class="form-grid flight-form-grid">
        <label>乘机日期<input name="date" type="date" min="2000-01-01" max="2099-12-31" required></label>
        <label>航班号<input name="flightNumber" maxlength="24" placeholder="例如：NH 63"></label>
        <label>出发机场 / 城市<input name="fromLabel" maxlength="70" required placeholder="例如：新千岁"></label>
        <label>出发机场代码<input name="fromCode" maxlength="4" pattern="[A-Za-z]{3,4}" placeholder="CTS，可留空" autocapitalize="characters" spellcheck="false"></label>
        <label>到达机场 / 城市<input name="toLabel" maxlength="70" required placeholder="例如：成田"></label>
        <label>到达机场代码<input name="toCode" maxlength="4" pattern="[A-Za-z]{3,4}" placeholder="NRT，可留空" autocapitalize="characters" spellcheck="false"></label>
        <label>出发时间<input name="departure" type="time"></label><label>到达时间<input name="arrival" type="time"></label>
        <label>购票状态<select name="status"><option value="unconfirmed">待确认</option><option value="unbooked">待购票</option><option value="booked">已购票</option></select></label>
        <label>参考链接<input name="url" type="url" maxlength="2048" placeholder="航司或购票网站，可留空"></label>
        <label class="flight-form-wide">备注<textarea name="note" maxlength="300" rows="2" placeholder="例如：航站楼、行李或接送安排"></textarea></label>
      </div><p class="flight-form-error" role="alert"></p><div class="flight-form-actions"><span>只保存在当前浏览器</span><button type="submit" class="button primary">保存机票</button></div>`;
    form.setAttribute('aria-labelledby', 'flight-edit-title');
    grid.after(form);
    statusNode = document.createElement('p');
    statusNode.className = 'flight-editor-status';
    statusNode.setAttribute('role', 'status');
    statusNode.setAttribute('aria-live', 'polite');
    form.after(statusNode);
    initialized = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        if (raw.length > 150000) throw new Error('机票数据过大。');
        data = validateData(JSON.parse(raw));
      }
    } catch { announce('本机机票记录未能读取，当前显示原有信息；原存储未改动。', true); }
    render();
    addButton.addEventListener('click', event => openForm('', event.currentTarget));
    form.querySelector('[data-flight-close]').addEventListener('click', () => closeForm());
    form.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeForm(); } });
    grid.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !grid.contains(button)) return;
      if (button.dataset.flightEdit) openForm(button.dataset.flightEdit, button);
      else if (button.dataset.flightReset) changeFlight(button.dataset.flightReset, true);
      else if (button.dataset.flightDelete) changeFlight(button.dataset.flightDelete, false);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const flight = {};
        for (const key of fields.filter(key => key !== 'id')) flight[key] = field(key).value;
        flight.id = editingId || 'flight-custom-' + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
        const clean = cleanFlight(flight), next = exportData(), index = next.flights.findIndex(item => item.id === clean.id);
        if (index < 0) next.flights.push(clean); else next.flights[index] = clean;
        importData(next);
        announce('机票已保存，下方行程保持原样。');
        addButton.focus({ preventScroll: true });
      } catch (error) { form.querySelector('.flight-form-error').textContent = error.message; }
    });
  }
  window.FLIGHTS = Object.freeze({ initialize, render, exportData, validateData, importData });
})();
