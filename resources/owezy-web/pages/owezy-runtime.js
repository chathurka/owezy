/* Owezy standalone runtime — renders the exported screen templates without the design editor.
   Supports: {{path}} holes in text and attributes, <template data-sc="for|if">, onClick/onChange
   handlers, component state (setState) and props from data-props defaults. */
(function () {
  'use strict';

  function DCLogic(props) { this.props = props || {}; this.state = null; }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state || {}, this.props) : patch;
    this.state = Object.assign({}, this.state || {}, next);
    if (this.__render) this.__render();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__render) this.__render(); };
  DCLogic.prototype.renderVals = function () { return {}; };

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return parseFloat(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function str(v) { return v == null ? '' : String(v); }
  function interp(s, scope) { return s.replace(HOLE, function (_, p) { return str(lookup(p, scope)); }); }

  var EVENTS = { onclick: 'click', onchange: 'input', oninput: 'input', onsubmit: 'submit', onkeydown: 'keydown', onkeyup: 'keyup', onfocus: 'focus', onblur: 'blur', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave' };

  function processAttrs(el, scope) {
    var attrs = Array.prototype.slice.call(el.attributes);
    for (var i = 0; i < attrs.length; i++) {
      var a = attrs[i], name = a.name, val = a.value;
      if (name.indexOf('hint-') === 0) { el.removeAttribute(name); continue; }
      var lname = name.toLowerCase();
      if (EVENTS[lname]) {
        el.removeAttribute(name);
        var m = WHOLE.exec(val);
        if (m) {
          var fn = lookup(m[1], scope);
          if (typeof fn === 'function') el.addEventListener(EVENTS[lname], fn);
        }
        continue;
      }
      if (val.indexOf('{{') === -1) continue;
      var w = WHOLE.exec(val);
      var out = w ? lookup(w[1], scope) : interp(val, scope);
      if (lname === 'value' && 'value' in el) { el.value = str(out); el.setAttribute('value', str(out)); continue; }
      if (lname === 'checked' && 'checked' in el) { el.checked = !!out; continue; }
      if (out === false || out == null) { el.removeAttribute(name); continue; }
      el.setAttribute(name, str(out));
    }
  }

  function renderInto(parent, nodes, scope) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType === 3) {
        var t = n.nodeValue;
        parent.appendChild(document.createTextNode(t.indexOf('{{') === -1 ? t : interp(t, scope)));
        continue;
      }
      if (n.nodeType !== 1) continue;
      if (n.tagName === 'TEMPLATE' && n.getAttribute('data-sc') === 'for') {
        var list = lookup((WHOLE.exec(n.getAttribute('list') || '') || [])[1] || '', scope) || [];
        var as = n.getAttribute('as') || 'item';
        for (var j = 0; j < list.length; j++) {
          var s = Object.create(scope);
          s[as] = list[j]; s.$index = j;
          renderInto(parent, n.content.childNodes, s);
        }
        continue;
      }
      if (n.tagName === 'TEMPLATE' && n.getAttribute('data-sc') === 'if') {
        var cond = lookup((WHOLE.exec(n.getAttribute('value') || '') || [])[1] || '', scope);
        if (cond) renderInto(parent, n.content.childNodes, scope);
        continue;
      }
      var el = n.cloneNode(false);
      processAttrs(el, scope);
      // <template> clones keep their own content fragment; normal elements recurse.
      renderInto(el, n.childNodes, scope);
      parent.appendChild(el);
    }
  }

  function focusKey(root) {
    var a = document.activeElement;
    if (!a || !root.contains(a) || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return null;
    var all = root.querySelectorAll('input,textarea,select');
    var idx = Array.prototype.indexOf.call(all, a);
    var sel = null;
    try { sel = [a.selectionStart, a.selectionEnd]; } catch (e) { sel = null; }
    return { idx: idx, sel: sel };
  }
  function restoreFocus(root, k) {
    if (!k) return;
    var el = root.querySelectorAll('input,textarea,select')[k.idx];
    if (!el) return;
    el.focus();
    if (k.sel && k.sel[0] != null) { try { el.setSelectionRange(k.sel[0], k.sel[1]); } catch (e) { } }
  }

  function boot() {
    var tplEl = document.getElementById('dc-tpl');
    var logicEl = document.getElementById('dc-logic');
    var root = document.getElementById('dc-root');
    if (!tplEl || !root) return;
    var tpl = document.createElement('template');
    tpl.innerHTML = tplEl.textContent;

    var props = {};
    try {
      var decl = JSON.parse((logicEl && logicEl.getAttribute('data-props')) || '{}');
      Object.keys(decl).forEach(function (k) { if (k.charAt(0) !== '$' && decl[k] && 'default' in decl[k]) props[k] = decl[k]['default']; });
    } catch (e) { console.error('data-props', e); }
    try { Object.assign(props, JSON.parse(root.getAttribute('data-props-override') || '{}')); } catch (e) { }

    var Component;
    try {
      Component = new Function('DCLogic', (logicEl ? logicEl.textContent : '') + '\n;return (typeof Component!=="undefined")?Component:DCLogic;')(DCLogic);
    } catch (e) { console.error('logic', e); Component = DCLogic; }

    var inst = new Component(props);
    if (!inst.props) inst.props = props;
    if (inst.state === undefined) inst.state = null;

    var scheduled = false;
    inst.__render = function () {
      if (scheduled) return;
      scheduled = true;
      Promise.resolve().then(function () { scheduled = false; draw(); });
    };
    function draw() {
      var vals;
      try { vals = inst.renderVals() || {}; } catch (e) { console.error('renderVals', e); vals = {}; }
      var k = focusKey(root);
      var frag = document.createDocumentFragment();
      renderInto(frag, tpl.content.childNodes, vals);
      root.replaceChildren(frag);
      restoreFocus(root, k);
    }
    draw();
    if (typeof inst.componentDidMount === 'function') { try { inst.componentDidMount(); } catch (e) { console.error(e); } }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
