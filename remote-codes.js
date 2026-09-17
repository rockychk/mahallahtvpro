/* ============================================================
   REMOTE CODES — remote-codes.js  v1.0 (ES5)
   Daftarkan kode shortcut remote ke RemoteControl.register()
   ============================================================ */

   (function () {
    'use strict';
  
    /* ── Helpers UI ─────────────────────────────────────────── */
  
    function rcToast(msg) {
      if (typeof showToast === 'function') { showToast(msg); return; }
      var el = document.getElementById('rc-toast-fb');
      if (!el) return;
      el.textContent = msg;
      el.style.display = 'block';
      el.style.opacity = '1';
      clearTimeout(el._t);
      el._t = setTimeout(function () {
        el.style.transition = 'opacity .4s';
        el.style.opacity = '0';
        setTimeout(function () { el.style.display = 'none'; el.style.transition = ''; }, 400);
      }, 2500);
    }
  
    /* ── Modal Engine ───────────────────────────────────────── */
    var RC_MODAL_ID = 'rc-mini-modal';
  
    function injectModalStyles() {
      if (document.getElementById('rc-modal-style')) return;
      var s = document.createElement('style');
      s.id = 'rc-modal-style';
      s.textContent = [
        '#rc-mini-modal-overlay{',
          'position:fixed;top:0;right:0;bottom:0;left:0;',
          'background:rgba(0,0,0,.72);z-index:2000;',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-box-align:center;-webkit-align-items:center;align-items:center;',
          '-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;',
        '}',
        '#rc-mini-modal{',
          'background:#1a1a2e;border:1px solid rgba(255,255,255,.15);',
          'border-radius:14px;padding:24px 28px;width:420px;',
          'max-width:92vw;max-height:80vh;overflow-y:auto;',
          'box-shadow:0 16px 50px rgba(0,0,0,.85);color:#fff;',
          'font-family:Poppins,sans-serif;',
        '}',
        '#rc-mini-modal h3{',
          'font-size:1.05rem;font-weight:700;color:#FFD700;',
          'margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,.1);',
          'padding-bottom:10px;',
        '}',
        '#rc-mini-modal .rc-input{',
          'width:100%;background:rgba(255,255,255,.07);',
          'border:1px solid rgba(255,255,255,.2);border-radius:8px;',
          'padding:10px 14px;color:#fff;font-size:1rem;',
          'font-family:Poppins,sans-serif;outline:none;box-sizing:border-box;',
        '}',
        '#rc-mini-modal .rc-input:focus{border-color:#F5A623;}',
        '#rc-mini-modal textarea.rc-input{resize:vertical;min-height:80px;}',
        '#rc-mini-modal .rc-hint{font-size:.75rem;color:rgba(255,255,255,.5);margin-top:8px;}',
        '#rc-mini-modal .rc-btn-row{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          'gap:8px;margin-top:18px;-webkit-flex-wrap:wrap;flex-wrap:wrap;',
          '-webkit-box-pack:end;-webkit-justify-content:flex-end;justify-content:flex-end;',
        '}',
        '#rc-mini-modal .rc-btn{',
          'background:#F5A623;color:#fff;border:none;padding:9px 22px;',
          'border-radius:8px;font-weight:600;cursor:pointer;',
          'font-family:Poppins,sans-serif;font-size:.9rem;',
        '}',
        '#rc-mini-modal .rc-btn-cancel{',
          'background:rgba(255,255,255,.1);color:#fff;',
          'border:1px solid rgba(255,255,255,.2);padding:9px 18px;',
          'border-radius:8px;cursor:pointer;font-family:Poppins,sans-serif;font-size:.9rem;',
        '}',
        '#rc-mini-modal .rc-option-list{list-style:none;margin:0;padding:0;}',
        '#rc-mini-modal .rc-option-list li{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-box-align:center;-webkit-align-items:center;align-items:center;',
          'gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;',
          'border:1px solid rgba(255,255,255,.1);margin-bottom:6px;',
          '-webkit-transition:background .15s;transition:background .15s;',
        '}',
        '#rc-mini-modal .rc-option-list li:hover{background:rgba(255,255,255,.1);}',
        '#rc-mini-modal .rc-option-list li.rc-active-opt{',
          'background:rgba(245,166,35,.2);border-color:#F5A623;',
        '}',
        '#rc-mini-modal .rc-option-list .rc-key{',
          'width:24px;height:24px;border-radius:5px;',
          'background:rgba(255,255,255,.15);color:#FFD700;',
          'font-size:.78rem;font-weight:700;text-align:center;line-height:24px;',
          '-webkit-flex-shrink:0;flex-shrink:0;',
        '}',
        '#rc-mini-modal .rc-volume-wrap{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-box-align:center;-webkit-align-items:center;align-items:center;',
          'gap:12px;',
        '}',
        '#rc-mini-modal .rc-volume-wrap input[type=range]{',
          '-webkit-box-flex:1;-webkit-flex:1;flex:1;',
        '}',
        '#rc-mini-modal .rc-volume-val{color:#aaa;font-size:.85rem;min-width:38px;text-align:right;}',
        '#rc-mini-modal .rc-swatch-grid{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:8px;margin-top:4px;',
        '}',
        '#rc-mini-modal .rc-swatch-item{',
          'width:26px;height:26px;border-radius:5px;cursor:pointer;',
          'border:2px solid transparent;',
          '-webkit-transition:border-color .15s,-webkit-transform .1s;transition:border-color .15s,transform .1s;',
        '}',
        '#rc-mini-modal .rc-swatch-item:hover,#rc-mini-modal .rc-swatch-item.rc-sw-sel{',
          'border-color:#fff;-webkit-transform:scale(1.2);transform:scale(1.2);',
        '}',
        '#rc-mini-modal .rc-bg-grid{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:8px;',
        '}',
        '#rc-mini-modal .rc-bg-thumb{',
          'position:relative;width:90px;height:60px;border-radius:6px;overflow:hidden;',
          'border:2px solid rgba(255,255,255,.2);cursor:pointer;',
        '}',
        '#rc-mini-modal .rc-bg-thumb img{width:100%;height:100%;object-fit:cover;}',
        '#rc-mini-modal .rc-bg-del-badge{',
          'position:absolute;top:2px;left:2px;',
          'background:rgba(0,0,0,.7);color:#FFD700;',
          'font-size:.65rem;font-weight:700;padding:1px 5px;border-radius:4px;',
        '}',
        '#rc-mini-modal .rc-bg-thumb:hover{border-color:#e74c3c;}',
        '#rc-mini-modal .rc-ribbon-grid{',
          'display:-webkit-box;display:-webkit-flex;display:flex;',
          '-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:8px;',
        '}',
        '#rc-mini-modal .rc-ribbon-item{',
          'border-radius:8px;padding:10px 14px;cursor:pointer;',
          'border:2px solid transparent;font-size:.82rem;font-weight:600;',
          '-webkit-transition:border-color .15s,-webkit-transform .1s;transition:border-color .15s,transform .1s;',
          'white-space:nowrap;',
        '}',
        '#rc-mini-modal .rc-ribbon-item.rc-ribbon-sel{border-color:#fff;}'
      ].join('');
      document.head.appendChild(s);
    }
  
    /* Buka modal mini */
    function openMiniModal(titleText, bodyFn, onClose) {
      closeRcModal();
      injectModalStyles();
  
      var overlay = document.createElement('div');
      overlay.id = 'rc-mini-modal-overlay';
  
      var box = document.createElement('div');
      box.id = RC_MODAL_ID;
  
      var h = document.createElement('h3');
      h.textContent = titleText;
      box.appendChild(h);
  
      bodyFn(box);
  
      overlay.appendChild(box);
      document.body.appendChild(overlay);
  
      // tutup klik di luar box
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) { closeRcModal(); if (onClose) onClose(); }
      });
  
      // tutup Escape
      overlay._keyHandler = function (e) {
        if (e.key === 'Escape') { closeRcModal(); if (onClose) onClose(); }
      };
      window.addEventListener('keydown', overlay._keyHandler);
  
      // fokus input pertama jika ada
      setTimeout(function () {
        var inp = box.querySelector('input:not([type=range]):not([type=checkbox]):not([type=file]), textarea');
        if (inp) inp.focus();
      }, 60);
  
      return box;
    }
  
    function closeRcModal() {
      var overlay = document.getElementById('rc-mini-modal-overlay');
      if (!overlay) return;
      if (overlay._keyHandler) window.removeEventListener('keydown', overlay._keyHandler);
      document.body.removeChild(overlay);
    }
  
    /* Baris tombol OK + Batal */
    function addBtnRow(box, onOk, okLabel) {
      var row = document.createElement('div');
      row.className = 'rc-btn-row';
  
      var btnCancel = document.createElement('button');
      btnCancel.className = 'rc-btn-cancel';
      btnCancel.textContent = 'Batal';
      btnCancel.onclick = closeRcModal;
  
      var btnOk = document.createElement('button');
      btnOk.className = 'rc-btn';
      btnOk.textContent = okLabel || 'Simpan';
      btnOk.onclick = function () { onOk(); closeRcModal(); };
  
      row.appendChild(btnCancel);
      row.appendChild(btnOk);
      box.appendChild(row);
    }
  
    /* Input teks / textarea sederhana */
    function modalTextInput(title, isTextarea, placeholder, onSave) {
      openMiniModal(title, function (box) {
        var inp = document.createElement(isTextarea ? 'textarea' : 'input');
        inp.className = 'rc-input';
        if (!isTextarea) inp.type = 'text';
        inp.placeholder = placeholder || '';
        box.appendChild(inp);
  
        addBtnRow(box, function () {
          var val = inp.value.trim();
          if (val) onSave(val);
        });
  
        inp.addEventListener('keydown', function (e) {
          if (!isTextarea && e.key === 'Enter') { e.preventDefault(); var val = inp.value.trim(); if (val) { onSave(val); closeRcModal(); } }
        });
      });
    }
  
    /* Input angka kosong (tanpa default) */
    function modalNumberInput(title, min, max, unit, onSave) {
      openMiniModal(title, function (box) {
        var inp = document.createElement('input');
        inp.className = 'rc-input';
        inp.type = 'number';
        inp.placeholder = 'Masukkan angka' + (unit ? ' (' + unit + ')' : '');
        inp.min = min;
        inp.max = max;
        inp.value = '';
        box.appendChild(inp);
  
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.textContent = 'Rentang: ' + min + ' – ' + max + (unit ? ' ' + unit : '');
        box.appendChild(hint);
  
        addBtnRow(box, function () {
          var val = parseFloat(inp.value);
          if (!isNaN(val)) onSave(val);
        });
  
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); var val = parseFloat(inp.value); if (!isNaN(val)) { onSave(val); closeRcModal(); } }
        });
      });
    }
  
    /* Daftar opsi dengan nomor tombol */
    function modalOptionList(title, options, getActiveFn, onSelect) {
      openMiniModal(title, function (box) {
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.textContent = 'Tekan angka pada remote atau klik untuk memilih.';
        hint.style.marginBottom = '10px';
        box.appendChild(hint);
  
        var ul = document.createElement('ul');
        ul.className = 'rc-option-list';
  
        options.forEach(function (opt, i) {
          var li = document.createElement('li');
          var keyNum = i + 1;
          if (opt.key !== undefined) keyNum = opt.key;
  
          if (getActiveFn) {
            var active = getActiveFn();
            if (active !== null && active !== undefined && (active === opt.value || active === opt.label)) {
              li.className = 'rc-active-opt';
            }
          }
  
          var badge = document.createElement('span');
          badge.className = 'rc-key';
          badge.textContent = keyNum;
  
          var txt = document.createElement('span');
          txt.textContent = opt.label;
  
          li.appendChild(badge);
          li.appendChild(txt);
          ul.appendChild(li);
  
          li.addEventListener('click', function () { onSelect(opt.value !== undefined ? opt.value : opt.label); closeRcModal(); });
        });
  
        box.appendChild(ul);
  
        // tangkap angka keyboard saat modal ini terbuka
        var numHandler = function (e) {
          if (/^\d$/.test(e.key)) {
            var n = parseInt(e.key, 10);
            var opt2 = null;
            options.forEach(function (o) {
              var k = (o.key !== undefined) ? o.key : (options.indexOf(o) + 1);
              if (k === n) opt2 = o;
            });
            if (opt2) {
              e.preventDefault();
              e.stopPropagation();
              onSelect(opt2.value !== undefined ? opt2.value : opt2.label);
              closeRcModal();
              window.removeEventListener('keydown', numHandler, true);
            }
          }
        };
        window.addEventListener('keydown', numHandler, true);
  
        // hapus handler saat modal tutup
        var overlay = document.getElementById('rc-mini-modal-overlay');
        if (overlay) {
          var origKey = overlay._keyHandler;
          overlay._keyHandler = function (e) {
            if (e.key === 'Escape') {
              window.removeEventListener('keydown', numHandler, true);
              if (origKey) origKey(e);
            }
          };
          window.removeEventListener('keydown', origKey);
          window.addEventListener('keydown', overlay._keyHandler);
        }
  
        var btnCancel = document.createElement('div');
        btnCancel.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Batal';
        bc.onclick = function () { window.removeEventListener('keydown', numHandler, true); closeRcModal(); };
        btnCancel.appendChild(bc);
        box.appendChild(btnCancel);
      });
    }
  
    /* Modal volume */
    function modalVolume(title, rangeId, valDisplayId) {
      openMiniModal(title, function (box) {
        var srcRange = document.getElementById(rangeId);
        var srcVal = document.getElementById(valDisplayId);
        var curVal = srcRange ? parseInt(srcRange.value, 10) : 100;
  
        var wrap = document.createElement('div');
        wrap.className = 'rc-volume-wrap';
  
        var icon = document.createElement('span');
        icon.textContent = '🔈';
        icon.style.fontSize = '1.1rem';
  
        var range = document.createElement('input');
        range.type = 'range';
        range.className = 'rc-input';
        range.style.cssText = '-webkit-box-flex:1;-webkit-flex:1;flex:1;';
        range.min = 0;
        range.max = 100;
        range.value = curVal;
  
        var valTxt = document.createElement('span');
        valTxt.className = 'rc-volume-val';
        valTxt.textContent = curVal + '%';
  
        range.addEventListener('input', function () {
          valTxt.textContent = range.value + '%';
        });
  
        wrap.appendChild(icon);
        wrap.appendChild(range);
        wrap.appendChild(valTxt);
        box.appendChild(wrap);
  
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.textContent = '◀ ▶ untuk mengatur, lalu Simpan.';
        box.appendChild(hint);
  
        addBtnRow(box, function () {
          var v = parseInt(range.value, 10);
          if (srcRange) { srcRange.value = v; srcRange.dispatchEvent(new Event('input', { bubbles: true })); }
          if (srcVal) srcVal.textContent = v + '%';
          if (typeof setAudioVolume === 'function') {
            var mapId = {
              'vol-pre-adzan': 'pre-adzan',
              'vol-adzan-settings': 'adzan',
              'vol-adzan': 'adzan',
              'vol-alarm': 'alarm'
            };
            var key = mapId[rangeId];
            if (key) setAudioVolume(key, v);
          }
        });
  
        setTimeout(function () { range.focus(); }, 60);
      });
    }
  
    /* Modal daftar audio */
    function modalAudioList(title, listId) {
      openMiniModal(title, function (box) {
        var src = document.getElementById(listId);
        if (!src || !src.innerHTML.trim()) {
          var empty = document.createElement('p');
          empty.className = 'rc-hint';
          empty.style.textAlign = 'center';
          empty.style.padding = '16px 0';
          empty.textContent = 'Belum ada audio. Upload dulu.';
          box.appendChild(empty);
        } else {
          var clone = document.createElement('div');
          clone.innerHTML = src.innerHTML;
          // salin event listeners dengan onclick attribute
          var items = src.querySelectorAll('.audio-item');
          items.forEach(function (item) {
            var div = document.createElement('div');
            div.className = item.className;
            div.innerHTML = item.innerHTML;
            div.onclick = (function (orig) {
              return function () { orig.click(); closeRcModal(); };
            }(item));
            clone.appendChild(div);
          });
          box.appendChild(clone);
        }
  
        var btnRow = document.createElement('div');
        btnRow.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Tutup';
        bc.onclick = closeRcModal;
        btnRow.appendChild(bc);
        box.appendChild(btnRow);
      });
    }
  
    /* Modal hapus background */
    function modalBgList() {
      openMiniModal('🖼 Hapus Gambar Background', function (box) {
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.style.marginBottom = '10px';
        hint.textContent = 'Tekan nomor gambar di remote, atau klik gambar untuk menghapus.';
        box.appendChild(hint);
  
        var list = document.getElementById('bg-preview-list');
        if (!list) { box.insertAdjacentHTML('beforeend', '<p class="rc-hint">bg-preview-list tidak ditemukan.</p>'); return; }
  
        var items = list.querySelectorAll('.bg-preview-item');
        if (!items.length) { box.insertAdjacentHTML('beforeend', '<p class="rc-hint">Belum ada gambar background.</p>'); return; }
  
        var grid = document.createElement('div');
        grid.className = 'rc-bg-grid';
  
        var numMap = {};
  
        for (var i = 0; i < items.length; i++) {
          (function (item, idx) {
            var thumb = document.createElement('div');
            thumb.className = 'rc-bg-thumb';
  
            var badge = document.createElement('span');
            badge.className = 'rc-bg-del-badge';
            badge.textContent = String(idx + 1);
  
            var img = item.querySelector('img');
            var imgClone = document.createElement('img');
            if (img) imgClone.src = img.src;
  
            thumb.appendChild(imgClone);
            thumb.appendChild(badge);
            grid.appendChild(thumb);
  
            numMap[idx + 1] = item;
  
            thumb.addEventListener('click', function () {
              var removeBtn = item.querySelector('.bg-remove');
              if (removeBtn) removeBtn.click();
              closeRcModal();
            });
          }(items[i], i));
        }
  
        box.appendChild(grid);
  
        var numHandler = function (e) {
          if (/^\d$/.test(e.key)) {
            var n = parseInt(e.key, 10);
            if (numMap[n]) {
              e.preventDefault();
              e.stopPropagation();
              var rb = numMap[n].querySelector('.bg-remove');
              if (rb) rb.click();
              window.removeEventListener('keydown', numHandler, true);
              closeRcModal();
            }
          }
        };
        window.addEventListener('keydown', numHandler, true);
  
        var btnRow = document.createElement('div');
        btnRow.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Batal';
        bc.onclick = function () { window.removeEventListener('keydown', numHandler, true); closeRcModal(); };
        btnRow.appendChild(bc);
        box.appendChild(btnRow);
      });
    }
  
    /* Modal pilih tema global (clone dari tema-grid) */
    function modalTemaGlobal() {
      openMiniModal('🎨 Pilih Tema Global', function (box) {
        var src = document.getElementById('tema-grid');
        if (!src) { box.insertAdjacentHTML('beforeend', '<p class="rc-hint">tema-grid tidak ditemukan.</p>'); return; }
  
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.style.marginBottom = '10px';
        hint.textContent = 'Klik atau navigasi untuk memilih tema.';
        box.appendChild(hint);
  
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:8px;';
  
        var cards = src.querySelectorAll('.tema-card');
        cards.forEach(function (card) {
          var cl = card.cloneNode(true);
          cl.onclick = (function (orig) {
            return function () { orig.click(); closeRcModal(); };
          }(card));
          wrap.appendChild(cl);
        });
  
        box.appendChild(wrap);
  
        var btnRow = document.createElement('div');
        btnRow.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Tutup';
        bc.onclick = closeRcModal;
        btnRow.appendChild(bc);
        box.appendChild(btnRow);
      });
    }
  
    /* Modal swatch warna (clone dari container swatch) */
    function modalSwatch(title, swatchContainerSelector, cssVar) {
      openMiniModal(title, function (box) {
        var src = document.querySelector(swatchContainerSelector);
        if (!src) { box.insertAdjacentHTML('beforeend', '<p class="rc-hint">Swatch tidak ditemukan.</p>'); return; }
  
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.style.marginBottom = '10px';
        hint.textContent = 'Klik warna untuk menerapkan.';
        box.appendChild(hint);
  
        var wrap = document.createElement('div');
        wrap.className = 'rc-swatch-grid';
  
        var swatches = src.querySelectorAll('.color-swatch');
        swatches.forEach(function (sw) {
          var cl = sw.cloneNode(true);
          cl.style.backgroundColor = sw.style.backgroundColor || getComputedStyle(sw).backgroundColor;
          cl.onclick = (function (orig) {
            return function () { orig.click(); closeRcModal(); };
          }(sw));
          wrap.appendChild(cl);
        });
  
        box.appendChild(wrap);
  
        var btnRow = document.createElement('div');
        btnRow.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Tutup';
        bc.onclick = closeRcModal;
        btnRow.appendChild(bc);
        box.appendChild(btnRow);
      });
    }
  
    /* Modal opacity (input range 0-100) */
    function modalOpacity(title, cssVarName, displayId) {
      openMiniModal(title, function (box) {
        var root = document.documentElement;
        var curStr = getComputedStyle(root).getPropertyValue(cssVarName).trim();
        var cur = curStr ? Math.round(parseFloat(curStr) * 100) : 100;
  
        var wrap = document.createElement('div');
        wrap.className = 'rc-volume-wrap';
  
        var icon = document.createElement('span');
        icon.textContent = '🔆';
        icon.style.fontSize = '1.1rem';
  
        var range = document.createElement('input');
        range.type = 'range';
        range.style.cssText = '-webkit-box-flex:1;-webkit-flex:1;flex:1;';
        range.min = 0;
        range.max = 100;
        range.value = cur;
  
        var valTxt = document.createElement('span');
        valTxt.className = 'rc-volume-val';
        valTxt.textContent = cur + '%';
  
        range.addEventListener('input', function () {
          valTxt.textContent = range.value + '%';
        });
  
        wrap.appendChild(icon);
        wrap.appendChild(range);
        wrap.appendChild(valTxt);
        box.appendChild(wrap);
  
        addBtnRow(box, function () {
          var v = parseInt(range.value, 10) / 100;
          root.style.setProperty(cssVarName, v);
          if (displayId) {
            var el = document.getElementById(displayId);
            if (el) el.value = range.value;
          }
        });
  
        setTimeout(function () { range.focus(); }, 60);
      });
    }
  
    /* Modal ribbon tema */
    function modalRibbonTema() {
      openMiniModal('🎓 Pilih Tema Ribbon', function (box) {
        var src = document.getElementById('ribbon-tema-grid');
        if (!src) { box.insertAdjacentHTML('beforeend', '<p class="rc-hint">ribbon-tema-grid tidak ditemukan.</p>'); return; }
  
        var hint = document.createElement('p');
        hint.className = 'rc-hint';
        hint.style.marginBottom = '10px';
        hint.textContent = 'Klik untuk memilih tema warna ribbon.';
        box.appendChild(hint);
  
        var wrap = document.createElement('div');
        wrap.className = 'rc-ribbon-grid';
  
        var items = src.querySelectorAll('[data-tema], .rc-ribbon-tema-item, button, div');
        if (!items.length) {
          // fallback: clone seluruh grid
          var cl = src.cloneNode(true);
          wrap.appendChild(cl);
        } else {
          items.forEach(function (item) {
            if (item === src) return;
            var cl = item.cloneNode(true);
            cl.onclick = (function (orig) {
              return function () { orig.click(); closeRcModal(); };
            }(item));
            wrap.appendChild(cl);
          });
        }
  
        box.appendChild(wrap);
  
        var btnRow = document.createElement('div');
        btnRow.className = 'rc-btn-row';
        var bc = document.createElement('button');
        bc.className = 'rc-btn-cancel';
        bc.textContent = 'Tutup';
        bc.onclick = closeRcModal;
        btnRow.appendChild(bc);
        box.appendChild(btnRow);
      });
    }
  
    /* Modal font size */
    function modalFontSize() {
      openMiniModal('🔠 Ukuran Font Nama Pemateri', function (box) {
        var srcRange = document.getElementById('ribbon-font-size');
        var srcVal = document.getElementById('ribbon-font-size-val');
        var cur = srcRange ? parseInt(srcRange.value, 10) : 17;
  
        var wrap = document.createElement('div');
        wrap.className = 'rc-volume-wrap';
  
        var icon = document.createElement('span');
        icon.textContent = 'A';
        icon.style.cssText = 'font-size:1.1rem;font-weight:700;';
  
        var range = document.createElement('input');
        range.type = 'range';
        range.style.cssText = '-webkit-box-flex:1;-webkit-flex:1;flex:1;';
        range.min = 12;
        range.max = 48;
        range.value = cur;
  
        var valTxt = document.createElement('span');
        valTxt.className = 'rc-volume-val';
        valTxt.textContent = cur + 'px';
  
        range.addEventListener('input', function () {
          valTxt.textContent = range.value + 'px';
          if (typeof previewRibbonFontSize === 'function') previewRibbonFontSize(range.value);
        });
  
        wrap.appendChild(icon);
        wrap.appendChild(range);
        wrap.appendChild(valTxt);
        box.appendChild(wrap);
  
        addBtnRow(box, function () {
          var v = parseInt(range.value, 10);
          if (srcRange) { srcRange.value = v; srcRange.dispatchEvent(new Event('input', { bubbles: true })); }
          if (srcVal) srcVal.textContent = v + 'px';
          if (typeof previewRibbonFontSize === 'function') previewRibbonFontSize(v);
        });
  
        setTimeout(function () { range.focus(); }, 60);
      });
    }
  
    /* ── Toggle helpers ─────────────────────────────────────── */
  
    function toggleCheckbox(id, labelOn, labelOff, onChangeFn) {
      var cb = document.getElementById(id);
      if (!cb) { rcToast('⚠ Elemen ' + id + ' tidak ditemukan'); return; }
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
      if (onChangeFn) onChangeFn(cb.checked);
      rcToast(cb.checked ? (labelOn || '✅ Aktif') : (labelOff || '⛔ Nonaktif'));
    }
  
    function triggerFileInput(id) {
      var el = document.getElementById(id);
      if (!el) { rcToast('⚠ Input file ' + id + ' tidak ditemukan'); return; }
      try { el.click(); } catch (e) { rcToast('⚠ Tidak bisa membuka file picker'); }
    }
  
    function setSelectByValue(id, val) {
      var sel = document.getElementById(id);
      if (!sel) { rcToast('⚠ Select ' + id + ' tidak ditemukan'); return; }
      sel.value = val;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  
    function clickElement(id) {
      var el = document.getElementById(id);
      if (!el) { rcToast('⚠ Elemen ' + id + ' tidak ditemukan'); return; }
      el.click();
    }
  
    function openSelectPicker(id) {
      var sel = document.getElementById(id);
      if (!sel) { rcToast('⚠ Select ' + id + ' tidak ditemukan'); return; }
      sel.focus();
      try { if (typeof sel.showPicker === 'function') sel.showPicker(); else sel.click(); } catch (e) { sel.click(); }
    }
  
    /* ── Kode Shortcut ──────────────────────────────────────── */
  
    function register() {
      if (!window.RemoteControl || typeof window.RemoteControl.register !== 'function') {
        setTimeout(register, 200);
        return;
      }
      var R = window.RemoteControl.register.bind(window.RemoteControl);
  
      /* ──────────── 2x : Kartu Adzan ──────────── */
      R('21', 'Toggle Tampilkan Dhuha', function () {
        toggleCheckbox('toggle-dhuha', '✅ Dhuha ditampilkan', '⛔ Dhuha disembunyikan', function (checked) {
          if (typeof toggleDhuha === 'function') toggleDhuha({ checked: checked });
        });
      });

      R('22', 'Toggle Mode Jum\'at', function () {
        toggleCheckbox('toggle-mode-jumat', "✅ Mode Jum'at aktif", "⛔ Mode Jum'at nonaktif", function (checked) {
          if (typeof toggleModeJumat === 'function') toggleModeJumat({ checked: checked });
        });
      });

      R('23', 'Toggle Tampilkan Imsak', function () {
        toggleCheckbox('toggle-imsak', '✅ Imsak ditampilkan', '⛔ Imsak disembunyikan', function (checked) {
          if (typeof toggleImsak === 'function') toggleImsak({ checked: checked });
        });
      });

      R('24', 'Toggle Tampilkan Syuruq', function () {
        toggleCheckbox('toggle-syuruq', '✅ Syuruq ditampilkan', '⛔ Syuruq disembunyikan', function (checked) {
          if (typeof toggleSyuruq === 'function') toggleSyuruq({ checked: checked });
        });
      });
  
      /* ──────────── 3x : Running Text ──────────── */
      R('31', 'Edit Teks Running Text', function () {
        var src = document.getElementById('settings-rt-text');
        openMiniModal('📝 Running Text', function (box) {
          var ta = document.createElement('textarea');
          ta.className = 'rc-input';
          ta.rows = 4;
          ta.placeholder = 'Isi teks berjalan...';
          ta.value = src ? src.value : '';
          box.appendChild(ta);
  
          addBtnRow(box, function () {
            if (src) src.value = ta.value;
            if (typeof saveRunningText === 'function') saveRunningText();
            else rcToast('⚠ saveRunningText() tidak ditemukan');
          });
        });
      });
  
      R('32', 'Kecepatan Running Text', function () {
        var src = document.getElementById('settings-rt-speed');
        var srcVal = document.getElementById('rt-speed-val');
        var cur = src ? parseInt(src.value, 10) : 60;
        openMiniModal('⏱ Kecepatan Running Text', function (box) {
          var wrap = document.createElement('div');
          wrap.className = 'rc-volume-wrap';
          var icon = document.createElement('span');
          icon.textContent = '🚀';
          icon.style.fontSize = '1rem';
          var range = document.createElement('input');
          range.type = 'range';
          range.style.cssText = '-webkit-box-flex:1;-webkit-flex:1;flex:1;';
          range.min = 20;
          range.max = 200;
          range.value = cur;
          var valTxt = document.createElement('span');
          valTxt.className = 'rc-volume-val';
          valTxt.textContent = cur + 's';
          range.addEventListener('input', function () { valTxt.textContent = range.value + 's'; });
          wrap.appendChild(icon); wrap.appendChild(range); wrap.appendChild(valTxt);
          box.appendChild(wrap);
          var hint = document.createElement('p');
          hint.className = 'rc-hint';
          hint.textContent = 'Semakin kecil = semakin cepat';
          box.appendChild(hint);
          addBtnRow(box, function () {
            if (src) { src.value = range.value; src.dispatchEvent(new Event('input', { bubbles: true })); }
            if (srcVal) srcVal.textContent = range.value;
            if (typeof saveRunningText === 'function') saveRunningText();
          });
          setTimeout(function () { range.focus(); }, 60);
        });
      });
  
      /* ──────────── 4x : Background ──────────── */
      R('41', 'Upload Gambar Background', function () {
        triggerFileInput('upload-bg');
      });
  
      R('42', 'Hapus Gambar Background', function () {
        modalBgList();
      });
  
      R('43', 'Durasi Slide Background', function () {
        modalNumberInput('⏱ Durasi Slide (detik)', 2, 120, 'detik', function (val) {
          var inp = document.getElementById('settings-bg-speed');
          if (inp) inp.value = val;
          rcToast('✅ Durasi diset: ' + val + ' detik');
        });
      });
  
      R('44', 'Pilih Transisi Background', function () {
        modalOptionList('🎬 Transisi Background',
          [
            { key: 1, label: 'Fade', value: 'fade' },
            { key: 2, label: 'Slide Kiri', value: 'slide-left' },
            { key: 3, label: 'Slide Kanan', value: 'slide-right' },
            { key: 4, label: 'Zoom In', value: 'zoom-in' },
            { key: 5, label: 'Zoom Out', value: 'zoom-out' },
            { key: 6, label: 'Flip', value: 'flip' }
          ],
          function () {
            var sel = document.getElementById('settings-bg-transition');
            return sel ? sel.value : null;
          },
          function (val) {
            setSelectByValue('settings-bg-transition', val);
            if (typeof saveBgSettings === 'function') saveBgSettings();
            else rcToast('✅ Transisi: ' + val);
          }
        );
      });
  
      /* ──────────── 5x : Audio ──────────── */
      R('51', 'Daftar Audio Pre-Adzan', function () {
        modalAudioList('🎵 Audio Pre-Adzan', 'audio-pre-adzan-list');
      });
      R('511', 'Upload Audio Pre-Adzan', function () {
        triggerFileInput('upload-pre-adzan');
      });
      R('513', 'Pilih Sumber Audio Pre-Adzan', function () {
        modalOptionList('🎚️ Sumber Audio Pre-Adzan', [
          { label: 'File (Default/Upload)', value: 'default' },
          { label: 'Link YouTube', value: 'link' }
        ], function () {
          var sel = document.getElementById('pre-adzan-source');
          return sel ? sel.value : 'default';
        }, function (val) {
          setSelectByValue('pre-adzan-source', val);
          if (typeof togglePreAdzanSource === 'function') {
            togglePreAdzanSource(document.getElementById('pre-adzan-source'));
          }
        });
      });

      R('514', 'Link YouTube Pre-Adzan', function () {
        var src = document.getElementById('pre-adzan-youtube-url');
        modalTextInput('🔗 Link YouTube Pre-Adzan', false, 'https://youtube.com/watch?v=...', function (val) {
          if (src) src.value = val;
          if (typeof savePreAdzanYoutubeLink === 'function') savePreAdzanYoutubeLink();
          else rcToast('⚠ savePreAdzanYoutubeLink() tidak ditemukan');
        });
      });
  
      R('52', 'Daftar Audio Adzan', function () {
        modalAudioList('📢 Audio Adzan', 'audio-adzan-list');
      });
      R('521', 'Upload Audio Adzan', function () {
        triggerFileInput('upload-adzan-settings');
      });
      R('522', 'Volume Adzan', function () {
        modalVolume('🔈 Volume Adzan', 'vol-adzan-settings', 'vol-adzan-settings-val');
      });
  
      R('53', 'Daftar Audio Alarm', function () {
        modalAudioList('🔔 Audio Alarm', 'audio-alarm-list');
      });
      R('531', 'Upload Audio Alarm', function () {
        triggerFileInput('upload-alarm');
      });
      R('532', 'Volume Alarm', function () {
        modalVolume('🔈 Volume Alarm', 'vol-alarm', 'vol-alarm-val');
      });
  
      /* ──────────── 6x : Papan Informasi ──────────── */
      R('61', 'Toggle Papan Informasi', function () {
        toggleCheckbox('toggle-papan', '✅ Papan Info aktif', '⛔ Papan Info nonaktif', function (checked) {
          if (typeof togglePapanInfo === 'function') togglePapanInfo({ checked: checked });
        });
      });
  
      R('62', 'Edit Judul Pengumuman', function () {
        var src = document.getElementById('papan-title-input');
        openMiniModal('📋 Judul Pengumuman', function (box) {
          var inp = document.createElement('input');
          inp.className = 'rc-input';
          inp.type = 'text';
          inp.placeholder = 'Judul Pengumuman';
          inp.value = src ? src.value : '';
          box.appendChild(inp);
          addBtnRow(box, function () {
            if (src) src.value = inp.value;
            if (typeof savePapanInfo === 'function') savePapanInfo();
            else rcToast('⚠ savePapanInfo() tidak ditemukan');
          });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); if (src) src.value = inp.value; if (typeof savePapanInfo === 'function') savePapanInfo(); closeRcModal(); }
          });
        });
      });
  
      R('63', 'Edit Deskripsi Pengumuman', function () {
        var src = document.getElementById('papan-desc-input');
        openMiniModal('📋 Deskripsi Pengumuman', function (box) {
          var ta = document.createElement('textarea');
          ta.className = 'rc-input';
          ta.rows = 4;
          ta.placeholder = 'Deskripsi...';
          ta.value = src ? src.value : '';
          box.appendChild(ta);
          addBtnRow(box, function () {
            if (src) src.value = ta.value;
            if (typeof savePapanInfo === 'function') savePapanInfo();
            else rcToast('⚠ savePapanInfo() tidak ditemukan');
          });
        });
      });
  
      /* ──────────── 7x : Kajian ──────────── */
      R('71', 'Toggle Mode Kajian', function () {
        toggleCheckbox('toggle-kajian', '✅ Mode Kajian aktif', '⛔ Mode Kajian nonaktif', function (checked) {
          if (typeof toggleKajian === 'function') toggleKajian({ checked: checked });
        });
      });
  
      R('72', 'Toggle Sembunyikan Card Adzan', function () {
        toggleCheckbox('toggle-hide-cards', '✅ Card Adzan disembunyikan', '⛔ Card Adzan ditampilkan', function (checked) {
          if (typeof toggleHideCards === 'function') toggleHideCards({ checked: checked });
        });
      });
  
      R('73', 'Upload Gambar Kajian', function () {
        triggerFileInput('upload-kajian-img');
      });
  
      R('74', 'Upload Video Kajian', function () {
        triggerFileInput('upload-kajian-video');
      });
  
      R('75', 'Input URL Stream Kajian', function () {
        var src = document.getElementById('kajian-video-url');
        openMiniModal('🔗 URL Video / Stream', function (box) {
          var inp = document.createElement('input');
          inp.className = 'rc-input';
          inp.type = 'text';
          inp.placeholder = 'https://youtube.com/watch?v=...';
          inp.value = src ? src.value : '';
          box.appendChild(inp);
          var hint = document.createElement('p');
          hint.className = 'rc-hint';
          hint.textContent = 'YouTube, MP4, atau link stream langsung.';
          box.appendChild(hint);
          addBtnRow(box, function () {
            if (src) src.value = inp.value;
            if (typeof applyKajianUrl === 'function') applyKajianUrl();
            else rcToast('⚠ applyKajianUrl() tidak ditemukan');
          });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); if (src) src.value = inp.value; if (typeof applyKajianUrl === 'function') applyKajianUrl(); closeRcModal(); }
          });
        });
      });
  
      R('76', 'Input Nama Pemateri', function () {
        var src = document.getElementById('kajian-pemateri');
        openMiniModal('🎓 Nama Pemateri', function (box) {
          var inp = document.createElement('input');
          inp.className = 'rc-input';
          inp.type = 'text';
          inp.placeholder = 'Ustadz / Ustadzah ...';
          inp.value = src ? src.value : '';
          box.appendChild(inp);
          addBtnRow(box, function () {
            if (src) src.value = inp.value;
            if (typeof saveKajian === 'function') saveKajian();
            else rcToast('⚠ saveKajian() tidak ditemukan');
          });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); if (src) src.value = inp.value; if (typeof saveKajian === 'function') saveKajian(); closeRcModal(); }
          });
        });
      });

      R('731', 'Hapus Gambar Kajian', function () {
        if (typeof clearKajianItem === 'function') { clearKajianItem('image'); rcToast('🗑️ Gambar Kajian dihapus'); }
        else rcToast('⚠ clearKajianItem() tidak ditemukan');
      });

      R('741', 'Hapus Video Kajian', function () {
        if (typeof clearKajianItem === 'function') { clearKajianItem('video'); rcToast('🗑️ Video Kajian dihapus'); }
        else rcToast('⚠ clearKajianItem() tidak ditemukan');
      });

      R('751', 'Hapus URL Stream Kajian', function () {
        if (typeof clearKajianItem === 'function') { clearKajianItem('url'); rcToast('🗑️ URL Stream Kajian dihapus'); }
        else rcToast('⚠ clearKajianItem() tidak ditemukan');
      });
  
      R('77', 'Delay Muncul Pemateri (detik)', function () {
        var src = document.getElementById('kajian-pemateri-delay');
        modalNumberInput('⏱ Delay Muncul Pemateri', 0, 300, 'detik', function (val) {
          if (src) { src.value = val; src.dispatchEvent(new Event('change', { bubbles: true })); }
          rcToast('✅ Delay: ' + val + ' detik');
        });
      });
  
      R('78', 'Durasi Tampil Pemateri (detik)', function () {
        var src = document.getElementById('kajian-pemateri-duration');
        modalNumberInput('⏱ Durasi Tampil Pemateri', 5, 600, 'detik', function (val) {
          if (src) { src.value = val; src.dispatchEvent(new Event('change', { bubbles: true })); }
          rcToast('✅ Durasi: ' + val + ' detik');
        });
      });
  
      R('79', 'Pilih Tema Ribbon', function () {
        modalRibbonTema();
      });
  
      R('710', 'Ukuran Font Pemateri', function () {
        modalFontSize();
      });
  
      /* ──────────── 8x : Live Kamera ──────────── */
      R('811', 'Pilih Kamera 1', function () { openSelectPicker('camera-select-1'); });
      R('812', 'Pilih Kamera 2', function () { openSelectPicker('camera-select-2'); });
      R('813', 'Pilih Kamera 3', function () { openSelectPicker('camera-select-3'); });
      R('814', 'Pilih Kamera 4', function () { openSelectPicker('camera-select-4'); });
  
      R('821', 'Mulai Kamera', function () {
        if (typeof lgMulaiKamera === 'function') lgMulaiKamera();
        else clickElement('btn-mulai-kamera');
      });
      R('822', 'Stop Kamera', function () {
        var btn = document.getElementById('btn-mulai-kamera');
        if (btn) btn.click();
        else rcToast('⚠ Tombol kamera tidak ditemukan');
      });
      R('823', 'Toggle Rekam', function () {
        if (typeof toggleRekam === 'function') toggleRekam();
        else clickElement('btn-rekam');
      });
  
      R('831', 'Switch Kamera 1', function () {
        if (typeof lgSwitchKamera === 'function') lgSwitchKamera(1);
        else clickElement('lg-sw-btn-1');
      });
      R('832', 'Switch Kamera 2', function () {
        if (typeof lgSwitchKamera === 'function') lgSwitchKamera(2);
        else clickElement('lg-sw-btn-2');
      });
      R('833', 'Switch Kamera 3', function () {
        if (typeof lgSwitchKamera === 'function') lgSwitchKamera(3);
        else clickElement('lg-sw-btn-3');
      });
      R('834', 'Switch Kamera 4', function () {
        if (typeof lgSwitchKamera === 'function') lgSwitchKamera(4);
        else clickElement('lg-sw-btn-4');
      });
  
      R('841', 'Transisi Kamera: Statis', function () {
        setSelectByValue('lg-transisi-select', 'static');
        rcToast('✅ Transisi: Statis');
      });
      R('842', 'Transisi Kamera: Fade', function () {
        setSelectByValue('lg-transisi-select', 'fade');
        rcToast('✅ Transisi: Fade');
      });
  

      /* ──────────── 808 : Pairing HP (Firebase) ──────────── */
      R('808', 'Buka Panel Pairing HP', function () {
        if (window.FirebaseRemoteBridge && typeof window.FirebaseRemoteBridge.openPairing === 'function') {
          window.FirebaseRemoteBridge.openPairing();
        } else {
          rcToast('⚠ Fitur pairing belum siap, coba lagi sebentar');
        }
      });

      /* ──────────── 9x : Donasi ──────────── */
      R('91', 'Toggle Donasi', function () {
        toggleCheckbox('toggle-donasi', '✅ Donasi aktif', '⛔ Donasi nonaktif', function (checked) {
          if (typeof toggleDonasi === 'function') toggleDonasi({ checked: checked });
        });
      });
  
      R('92', 'Edit Judul Donasi', function () {
        var src = document.getElementById('donasi-judul-input');
        openMiniModal('💳 Judul Donasi', function (box) {
          var inp = document.createElement('input');
          inp.className = 'rc-input';
          inp.type = 'text';
          inp.placeholder = 'Contoh: Donasi Masjid';
          inp.value = src ? src.value : '';
          box.appendChild(inp);
          addBtnRow(box, function () {
            if (src) src.value = inp.value;
            if (typeof saveDonasi === 'function') saveDonasi();
            else rcToast('⚠ saveDonasi() tidak ditemukan');
          });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); if (src) src.value = inp.value; if (typeof saveDonasi === 'function') saveDonasi(); closeRcModal(); }
          });
        });
      });
  
      R('93', 'Upload QR Code Donasi', function () {
        triggerFileInput('donasi-qr-upload');
      });
  
      R('94', 'Edit Deskripsi Donasi', function () {
        var src = document.getElementById('donasi-desc-input');
        openMiniModal('💳 Deskripsi Donasi', function (box) {
          var ta = document.createElement('textarea');
          ta.className = 'rc-input';
          ta.rows = 3;
          ta.placeholder = 'Contoh: BCA 1234567890 a.n. Masjid...';
          ta.value = src ? src.value : '';
          box.appendChild(ta);
          addBtnRow(box, function () {
            if (src) src.value = ta.value;
            if (typeof saveDonasi === 'function') saveDonasi();
            else rcToast('⚠ saveDonasi() tidak ditemukan');
          });
        });
      });

R('99', 'Toggle Fullscreen', function () {
  if (window.AppFullscreen) window.AppFullscreen.toggle();
});
  
      /* ──────────── 10x : Template & Tema ──────────── */
      R('101', 'Template Default', function () {
        if (typeof setTemplate === 'function') setTemplate('default');
        else rcToast('⚠ setTemplate() tidak ditemukan');
      });
      R('102', 'Template Card Kiri', function () {
        if (typeof setTemplate === 'function') setTemplate('cardkiri');
        else rcToast('⚠ setTemplate() tidak ditemukan');
      });
      R('103', 'Template Card Atas', function () {
        if (typeof setTemplate === 'function') setTemplate('cardatas');
        else rcToast('⚠ setTemplate() tidak ditemukan');
      });
  
      R('104', 'Pilih Tema Global', function () {
        modalTemaGlobal();
      });
  
      /* ──────────── 105x : Topbar ──────────── */
      R('1051', 'Kustom Warna Topbar', function () {
        modalSwatch('🎨 Warna Topbar', '[data-swatch-target="topbar-bg"] .color-swatches, .custom-theme-item:nth-child(1) .color-swatches', '--topbar-bg');
      });
  
      R('1052', 'Opacity Topbar', function () {
        modalOpacity('🔆 Opacity Topbar', '--topbar-opacity', null);
      });
  
      /* ──────────── 106x : Card Waktu ──────────── */
      R('1061', 'Kustom Warna Card Waktu', function () {
        modalSwatch('🎨 Warna Card Waktu', '[data-swatch-target="cards-bg"] .color-swatches, .custom-theme-item:nth-child(2) .color-swatches', '--cards-bg');
      });
  
      R('1062', 'Opacity Card Waktu', function () {
        modalOpacity('🔆 Opacity Card Waktu', '--cards-bg-opacity', null);
      });
  
      /* ──────────── 107x : Elemen Warna Lain ──────────── */
      R('1071', 'Warna Card Aktif', function () {
        modalSwatch('🎨 Warna Card Aktif', '.swatch-active-card .color-swatches, [data-swatch="card-active-bg"] .color-swatches', '--card-active-bg');
      });
  
      R('1072', 'Warna Banner Hari Besar', function () {
        modalSwatch('🎨 Warna Banner Hari Besar', '.swatch-banner .color-swatches, [data-swatch="banner-bg"] .color-swatches', '--banner-bg');
      });
  
      R('1073', 'Warna Teks Running Text', function () {
        modalSwatch('🎨 Warna Teks Running Text', '.swatch-rt .color-swatches, [data-swatch="rt-text"] .color-swatches', '--rt-text');
      });
  
      R('1074', 'Warna Background Running Text', function () {
        modalSwatch('🎨 BG Running Text', '.swatch-rt-bg .color-swatches, [data-swatch="rt-bg"] .color-swatches', '--rt-bg');
      });
  
      R('1075', 'Opacity Background Running Text', function () {
        modalOpacity('🔆 Opacity BG Running Text', '--rt-bg-opacity', null);
      });
  
      R('1076', 'Warna Background Popup', function () {
        modalSwatch('🎨 BG Popup', '.swatch-popup .color-swatches, [data-swatch="popup-bg"] .color-swatches', '--popup-bg');
      });
  
      R('1077', 'Opacity Background Popup', function () {
        modalOpacity('🔆 Opacity BG Popup', '--popup-bg-opacity', null);
      });
  
      R('1078', 'Warna Background Modal', function () {
        modalSwatch('🎨 Warna Background Modal', '.swatch-modal .color-swatches, [data-swatch="modal-bg"] .color-swatches', '--modal-bg');
      });

      /* ──────────── 109x : Posisi & Ukuran Popup Notifikasi ──────────── */
      R('1091', 'Posisi Popup: Kiri', function () {
        if (typeof setPopupPosition === 'function') setPopupPosition('left');
      });
      R('1092', 'Posisi Popup: Tengah', function () {
        if (typeof setPopupPosition === 'function') setPopupPosition('center');
      });
      R('1093', 'Posisi Popup: Kanan', function () {
        if (typeof setPopupPosition === 'function') setPopupPosition('right');
      });
      R('1094', 'Ukuran Kotak Popup (%)', function () {
        var cur = (window.S && S.popupScale) ? S.popupScale : 100;
        modalNumberInput('📐 Ukuran Kotak Popup (%)', 50, 200, '%', function (val) {
          if (typeof commitPopupScale === 'function') commitPopupScale(val);
        });
      });
      R('1095', 'Pratinjau Popup Notifikasi', function () {
        if (typeof previewPopupDemo === 'function') previewPopupDemo();
      });
      R('1096', 'Ukuran Font Universal (%)', function () {
        modalNumberInput('\uD83D\uDD24 Ukuran Font Universal (%)', 50, 200, '%', function (val) {
          if (typeof commitGlobalFontScale === 'function') commitGlobalFontScale(val);
        });
      });

      /* ──────────── 12x : Lainnya ──────────── */
      R('121', 'Toggle Mode Adzan', function () {
        toggleCheckbox('toggle-adzan-mode', '✅ Mode Adzan aktif', '⛔ Mode Adzan nonaktif', function (checked) {
          if (typeof toggleAdzanMode === 'function') toggleAdzanMode({ checked: checked });
        });
      });

      R('122', 'Toggle Kas Masjid & Ayat/Hadits', function () {
        toggleCheckbox('toggle-kas-ayat', '✅ Kas Masjid & Ayat/Hadits aktif', '⛔ Kas Masjid & Ayat/Hadits nonaktif', function (checked) {
          if (typeof toggleKasAyat === 'function') toggleKasAyat({ checked: checked });
        });
      });

      R('123', 'Tampilan Kas Masjid (Minggu/Bulan)', function () {
        modalOptionList('📊 Tampilan Kas Masjid', [
          { label: 'Minggu Ini', value: 'minggu' },
          { label: 'Bulan Ini', value: 'bulan' }
        ], function () {
          var sel = document.getElementById('kas-view-mode');
          return sel ? sel.value : 'minggu';
        }, function (val) {
          setSelectByValue('kas-view-mode', val);
          if (typeof setKasViewMode === 'function') setKasViewMode(val);
        });
      });

      R('124', 'Durasi Animasi Kas Masjid \u2192 Ayat/Hadits', function () {
        modalNumberInput('\u23F1 Durasi Kas Masjid \u2192 Ayat/Hadits', 3, 30, 'detik', function (val) {
          var slider = document.getElementById('ka-duration-slider');
          if (slider) slider.value = val;
          var label = document.getElementById('ka-duration-val');
          if (label) label.textContent = val;
          if (typeof setKaRotationDuration === 'function') setKaRotationDuration(val);
        });
      });

      R('125', 'Toggle Video Sebelum Adzan', function () {
        toggleCheckbox('toggle-video-before', '✅ Video Sebelum Adzan aktif', '⛔ Video Sebelum Adzan nonaktif', function (checked) {
          if (typeof toggleVideoBefore === 'function') toggleVideoBefore({ checked: checked });
        });
      });

      R('126', 'Pilih Sumber Video Sebelum Adzan', function () {
        modalOptionList('🎬 Sumber Video Sebelum Adzan', [
          { label: 'Upload Video', value: 'upload' },
          { label: 'Link YouTube', value: 'youtube' }
        ], function () {
          var sel = document.getElementById('video-before-source');
          return sel ? sel.value : 'upload';
        }, function (val) {
          setSelectByValue('video-before-source', val);
          if (typeof setVideoBeforeSource === 'function') setVideoBeforeSource(val);
        });
      });

      R('127', 'Upload Video Sebelum Adzan', function () {
        triggerFileInput('upload-video-before');
      });

      R('128', 'Link YouTube Video Sebelum Adzan', function () {
        var src = document.getElementById('video-before-youtube-url');
        modalTextInput('🔗 Link YouTube Video Sebelum Adzan', false, 'https://youtube.com/watch?v=...', function (val) {
          if (src) src.value = val;
          if (typeof saveVideoBeforeYoutube === 'function') saveVideoBeforeYoutube();
          else rcToast('⚠ saveVideoBeforeYoutube() tidak ditemukan');
        });
      });

      /* ──────────── 13x : Pengaturan Masjid ──────────── */
      R('131', 'Edit Nama Masjid', function () {
        var src = document.getElementById('input-masjid-name');
        modalTextInput('🕌 Nama Masjid', false, 'Nama Masjid', function (val) {
          if (src) src.value = val;
          if (typeof saveMasjid === 'function') saveMasjid();
          else rcToast('⚠ saveMasjid() tidak ditemukan');
        });
      });

      R('132', 'Edit Kota/Lokasi Masjid', function () {
        var src = document.getElementById('input-masjid-location');
        modalTextInput('📍 Kota/Lokasi', false, 'Kota', function (val) {
          if (src) src.value = val;
          if (typeof saveMasjid === 'function') saveMasjid();
          else rcToast('⚠ saveMasjid() tidak ditemukan');
        });
      });

      R('133', 'Pilih Kota (API Waktu Shalat)', function () {
        var sel = document.getElementById('input-city-api');
        if (!sel) { rcToast('⚠ Elemen kota tidak ditemukan'); return; }
        var handler = function () {
          sel.removeEventListener('change', handler);
          if (typeof saveMasjid === 'function') saveMasjid();
        };
        sel.addEventListener('change', handler);
        openSelectPicker('input-city-api');
      });

      /* ──────────── 14x & 15x : Buka Modal Langsung ──────────── */
      R('141', 'Buka Hari Besar Islam', function () {
        if (typeof openEventModal === 'function') openEventModal();
        else rcToast('⚠ openEventModal() tidak ditemukan');
      });

      R('151', 'Buka Mode Muadzin', function () {
        if (typeof openMuadzinModal === 'function') openMuadzinModal();
        else rcToast('⚠ openMuadzinModal() tidak ditemukan');
      });

      R('152', 'Buka Menu Tentang', function () {
        if (typeof openSettings === 'function') openSettings();
        setTimeout(function () {
          if (typeof toggleSection === 'function') toggleSection('sec-tentang');
          var el = document.getElementById('sec-tentang');
          if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      });

      console.log('[RemoteCodes] Semua kode terdaftar.');
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', register);
    } else {
      register();
    }
  
  })();