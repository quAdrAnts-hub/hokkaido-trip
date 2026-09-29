(() => {
  'use strict';

  const FORMAT = 'hokkaido-private-backup';
  const MAX_BYTES = 2 * 1024 * 1024;
  const MODULES = [
    { key: 'trip', global: 'TRIP_APP', label: '行程' },
    { key: 'flights', global: 'FLIGHTS', label: '航班' },
    { key: 'snacks', global: 'SNACK_BOOK', label: '小食' }
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

  function getModules() {
    return MODULES.map(definition => {
      const api = window[definition.global];
      if (!api || ['exportData', 'validateData', 'importData'].some(method => typeof api[method] !== 'function')) {
        throw new Error(`${definition.label}尚未载入，请稍后再试。`);
      }
      return { ...definition, api };
    });
  }

  function validateBackup(data, modules) {
    const keys = ['format', 'version', 'exportedAt', 'trip', 'flights', 'snacks'];
    if (!isObject(data) || Object.keys(data).length !== keys.length || keys.some(key => !Object.hasOwn(data, key)) ||
      data.format !== FORMAT || data.version !== 1 || typeof data.exportedAt !== 'string' ||
      !Number.isFinite(Date.parse(data.exportedAt))) {
      throw new Error('文件格式不正确，请选择从本页导出的 JSON 文件。');
    }
    const clean = { format: FORMAT, version: 1, exportedAt: data.exportedAt };
    // Every section is checked before the confirmation dialog or any storage write.
    for (const module of modules) {
      const result = module.api.validateData(clone(data[module.key]));
      if (!isObject(result)) throw new Error(`${module.label}内容不完整，尚未导入。`);
      clean[module.key] = clone(result);
    }
    return clean;
  }

  function initialize() {
    if (document.getElementById('travel-backup')) return true;
    const container = document.querySelector('main footer') || document.querySelector('main') || document.body;
    if (!container) return false;
    const section = document.createElement('details');
    section.id = 'travel-backup';
    section.className = 'travel-backup';
    section.innerHTML = `
      <summary>保存与分享</summary>
      <div class="travel-backup-content">
        <p>填写只保存在当前浏览器。分享网页链接不会带上这些内容；导出文件后，朋友可在同一页面导入。</p>
        <div class="travel-backup-actions">
          <button type="button" id="travel-backup-export" class="travel-backup-button">导出我的填写</button>
          <button type="button" id="travel-backup-choose" class="travel-backup-button" aria-controls="travel-backup-file">导入文件</button>
          <input type="file" id="travel-backup-file" accept=".json,application/json" aria-label="选择行程备份 JSON 文件" hidden>
        </div>
        <p id="travel-backup-status" class="travel-backup-status" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;
    container.append(section);

    const dialog = document.createElement('dialog');
    dialog.id = 'travel-backup-dialog';
    dialog.className = 'travel-backup-dialog';
    dialog.setAttribute('aria-labelledby', 'travel-backup-title');
    dialog.setAttribute('aria-describedby', 'travel-backup-description');
    dialog.innerHTML = `
      <h2 id="travel-backup-title">导入填写内容</h2>
      <p id="travel-backup-description">确认后，将替换此浏览器保存的行程选择、航班、车票和小食。</p>
      <p id="travel-backup-filename" class="travel-backup-filename"></p>
      <p id="travel-backup-date" class="travel-backup-date"></p>
      <dl id="travel-backup-counts" class="travel-backup-counts"></dl>
      <p id="travel-backup-dialog-status" class="travel-backup-status" role="status" aria-live="polite" aria-atomic="true"></p>
      <div class="travel-backup-dialog-actions">
        <button type="button" id="travel-backup-cancel" class="travel-backup-button" autofocus>取消</button>
        <button type="button" id="travel-backup-confirm" class="travel-backup-button travel-backup-primary">确认导入</button>
      </div>`;
    document.body.append(dialog);

    const byId = id => document.getElementById(id);
    const status = byId('travel-backup-status');
    const dialogStatus = byId('travel-backup-dialog-status');
    const input = byId('travel-backup-file');
    const choose = byId('travel-backup-choose');
    const confirm = byId('travel-backup-confirm');
    const cancel = byId('travel-backup-cancel');
    let pending = null;
    let busy = false;
    let readSequence = 0;

    function report(message) { status.textContent = message; }
    function setBusy(value) {
      busy = value;
      confirm.disabled = value;
      cancel.disabled = value;
      confirm.textContent = value ? '正在导入…' : '确认导入';
      dialog.setAttribute('aria-busy', String(value));
    }
    function cancelImport() {
      if (busy) return;
      pending = null;
      dialog.close();
      report('已取消导入，原内容保留。');
    }

    byId('travel-backup-export').addEventListener('click', () => {
      try {
        const modules = getModules();
        const data = { format: FORMAT, version: 1, exportedAt: new Date().toISOString() };
        for (const module of modules) data[module.key] = clone(module.api.exportData());
        const valid = validateBackup(data, modules);
        const blob = new Blob([JSON.stringify(valid, null, 2) + '\n'], { type: 'application/json;charset=utf-8' });
        if (blob.size > MAX_BYTES) throw new Error('填写内容超过 2 MB，请精简备注或小食后再导出。');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `北海道行程_我的填写_${new Date().toLocaleDateString('sv-SE')}.json`;
        link.hidden = true;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        report('已生成备份文件。将它发给朋友，在本页选择“导入文件”即可查看。');
      } catch (error) {
        report(error instanceof Error ? error.message : '导出未完成，请稍后再试。');
      }
    });

    choose.addEventListener('click', () => { input.value = ''; input.click(); });
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      const sequence = ++readSequence;
      if (!file) return;
      pending = null;
      try {
        if (file.size > MAX_BYTES) throw new Error('文件超过 2 MB，请选择从本页导出的 JSON 文件。');
        if (file.size === 0) throw new Error('这个文件是空的，请重新选择。');
        report('正在读取文件…');
        const text = await file.text();
        if (sequence !== readSequence) return;
        let data;
        try { data = JSON.parse(text.replace(/^\uFEFF/, '')); }
        catch { throw new Error('无法读取这个文件，请选择有效的 JSON 备份。'); }
        const valid = validateBackup(data, getModules());
        if (typeof dialog.showModal !== 'function') throw new Error('此浏览器暂不支持导入预览，请使用新版浏览器打开。');
        pending = valid;
        byId('travel-backup-filename').textContent = file.name;
        byId('travel-backup-date').textContent = '导出于 ' + new Date(valid.exportedAt).toLocaleString('zh-CN', { hour12: false });
        const counts = [
          ['行程选择', `${Object.keys(valid.trip.selected || {}).length} 天`],
          ['航班', `${valid.flights.flights.length} 条`],
          ['车票', `${valid.trip.tickets.length} 张`],
          ['我的小食', `${valid.snacks.items.length} 条`]
        ];
        byId('travel-backup-counts').replaceChildren(...counts.map(([label, count]) => {
          const item = document.createElement('div');
          const name = document.createElement('dt'); name.textContent = label;
          const value = document.createElement('dd'); value.textContent = count;
          item.append(name, value);
          return item;
        }));
        dialogStatus.textContent = '';
        setBusy(false);
        report('文件已读取，请确认要导入的内容。');
        dialog.showModal();
        cancel.focus();
      } catch (error) {
        pending = null;
        report(error instanceof Error ? error.message : '读取未完成，原内容保留。');
      } finally {
        if (sequence === readSequence) input.value = '';
      }
    });

    cancel.addEventListener('click', cancelImport);
    dialog.addEventListener('cancel', event => { event.preventDefault(); cancelImport(); });
    dialog.addEventListener('close', () => {
      if (!busy) pending = null;
      choose.focus({ preventScroll: true });
    });
    confirm.addEventListener('click', async () => {
      if (!pending || busy) return;
      setBusy(true);
      dialogStatus.textContent = '';
      const applied = [];
      let snapshots;
      try {
        const modules = getModules();
        const data = validateBackup(pending, modules);
        snapshots = Object.fromEntries(modules.map(module => [module.key, clone(module.api.exportData())]));
        for (const module of modules) {
          applied.push(module);
          await module.api.importData(clone(data[module.key]));
        }
        pending = null;
        setBusy(false);
        dialog.close();
        report('已导入，可在行程里查看。之后的修改仍只保存在此浏览器。');
      } catch (error) {
        let restored = true;
        for (const module of applied.reverse()) {
          try { await module.api.importData(clone(snapshots[module.key])); }
          catch { restored = false; }
        }
        const reason = error instanceof Error ? error.message : '浏览器未能保存这些内容。';
        dialogStatus.textContent = restored
          ? `导入未完成，原内容已保留。${reason}`
          : '导入未完成，部分内容可能已更改。请保留原备份，恢复浏览器储存后重新导入。';
        setBusy(false);
      }
    });
    return true;
  }

  window.TRAVEL_BACKUP = Object.freeze({ initialize });
})();
