/*! Owezy design runtime — renders the Owezy Admin Console pages offline.
 * Template syntax: {{ path }} holes, <sc-for list as>, <sc-if value>, <helmet>,
 * and a `class Component extends DCLogic` with renderVals() + setState().
 */
(function () {
  'use strict';
  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var decoder = document.createElement('textarea');
  function decode(s) { if (s.indexOf('&') < 0) return s; decoder.innerHTML = s; return decoder.value; }

  /* ---------- parser: template text -> tree ---------- */
  function parse(src) {
    var root = { tag: '#root', attrs: [], children: [] }, stack = [root], i = 0, n = src.length;
    var tagRe = /^<([a-zA-Z][\w:-]*)/, attrRe = /^\s*([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/;
    while (i < n) {
      var lt = src.indexOf('<', i);
      if (lt < 0) lt = n;
      if (lt > i) stack[stack.length - 1].children.push({ text: src.slice(i, lt) });
      if (lt >= n) break;
      i = lt;
      if (src.startsWith('<!--', i)) { var e = src.indexOf('-->', i); i = e < 0 ? n : e + 3; continue; }
      if (src[i + 1] === '/') {
        var gt = src.indexOf('>', i); var name = src.slice(i + 2, gt).trim().toLowerCase();
        for (var k = stack.length - 1; k > 0; k--) { if (stack[k].tag === name) { stack.length = k; break; } }
        i = gt + 1; continue;
      }
      var m = tagRe.exec(src.slice(i));
      if (!m) { stack[stack.length - 1].children.push({ text: '<' }); i++; continue; }
      var node = { tag: m[1].toLowerCase(), raw: m[1], attrs: [], children: [] };
      i += m[0].length;
      while (true) {
        var rest = src.slice(i), sm = /^\s*(\/?)>/.exec(rest);
        if (sm) { i += sm[0].length; if (sm[1]) node.selfClose = true; break; }
        var am = attrRe.exec(rest);
        if (!am) { i++; continue; }
        var val = am[2] != null ? am[2] : am[3] != null ? am[3] : am[4] != null ? am[4] : null;
        node.attrs.push([am[1], val == null ? '' : decode(val), val == null]);
        i += am[0].length;
      }
      stack[stack.length - 1].children.push(node);
      if (!node.selfClose && !VOID[node.tag]) stack.push(node);
    }
    return root;
  }

  /* ---------- holes ---------- */
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g, WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
  function lookup(scope, path) {
    if (path === 'true') return true; if (path === 'false') return false; if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var j = 0; j < parts.length; j++) { if (v == null) return undefined; v = v[parts[j]]; }
    return v;
  }
  function interp(s, scope) {
    return s.replace(HOLE, function (_, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  function value(s, scope) { var m = WHOLE.exec(s); return m ? lookup(scope, m[1]) : interp(s, scope); }
  function child(scope, extra) { var o = Object.create(scope); for (var k in extra) o[k] = extra[k]; return o; }

  /* ---------- render tree -> DOM ---------- */
  var PROPS = { checked: 1, disabled: 1, selected: 1, value: 1 };
  function render(node, scope, parent, svg) {
    if (node.text != null) { parent.appendChild(document.createTextNode(decode(interp(node.text, scope)))); return; }
    var tag = node.tag, get = function (n) { for (var a = 0; a < node.attrs.length; a++) if (node.attrs[a][0] === n) return node.attrs[a][1]; return null; };
    if (tag === 'sc-for') {
      var list = value(get('list') || '', scope) || [], as = get('as') || 'item';
      for (var idx = 0; idx < list.length; idx++) { var ex = { $index: idx }; ex[as] = list[idx]; kids(node, child(scope, ex), parent, svg); }
      return;
    }
    if (tag === 'sc-if') { if (value(get('value') || '', scope)) kids(node, scope, parent, svg); return; }
    if (tag === 'helmet') return;
    var isSvg = svg || tag === 'svg';
    var el = isSvg ? document.createElementNS(SVG_NS, node.raw) : document.createElement(tag);
    for (var a = 0; a < node.attrs.length; a++) {
      var name = node.attrs[a][0], raw = node.attrs[a][1], bare = node.attrs[a][2];
      if (name.indexOf('hint-') === 0) continue;
      if (/^on[A-Z]/.test(name)) {
        var fn = value(raw, scope);
        if (typeof fn === 'function') {
          var ev = name.slice(2).toLowerCase(); if (ev === 'change' && tag === 'input' && /text|search|number/.test(get('type') || 'text')) ev = 'input';
          el.addEventListener(ev, fn);
        }
        continue;
      }
      var v = bare ? true : value(raw, scope);
      if (!isSvg && PROPS[name]) {
        if (name === 'value') { el.setAttribute('value', v == null ? '' : v); el.value = v == null ? '' : v; }
        else { var on = v === true || v === '' || v === name || v === 'true'; el[name] = on; if (on) el.setAttribute(name, ''); }
        continue;
      }
      if (v === false || v == null) continue;
      el.setAttribute(name, v === true ? '' : String(v));
    }
    kids(node, scope, el, isSvg && tag !== 'foreignobject');
    parent.appendChild(el);
  }
  function kids(node, scope, parent, svg) { for (var c = 0; c < node.children.length; c++) render(node.children[c], scope, parent, svg); }

  /* ---------- component base ---------- */
  function DCLogic(props) { this.props = props || {}; this.state = this.state || {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, p); if (this.__rerender) this.__rerender();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__rerender) this.__rerender(); };
  window.DCLogic = DCLogic;

  /* ---------- mount ---------- */
  function mount(props) {
    var tplEl = document.getElementById('dc-template'), codeEl = document.querySelector('script[data-dc-script]');
    var tree = parse(tplEl.textContent);
    var helmets = [];
    (function find(n) { for (var c = 0; c < n.children.length; c++) { var k = n.children[c]; if (k.tag === 'helmet') helmets.push(k); else if (k.children) find(k); } })(tree);
    helmets.forEach(function (h) { var frag = document.createDocumentFragment(); kids(h, {}, frag, false); document.head.appendChild(frag); });
    var Component = new Function('DCLogic', codeEl.textContent + '\nreturn Component;')(DCLogic);
    var inst = new Component(props || {});
    if (!inst.state) inst.state = {};
    var host = document.getElementById('dc-root');
    inst.__rerender = function () {
      var x = window.scrollX, y = window.scrollY, frag = document.createDocumentFragment();
      kids(tree, inst.renderVals() || {}, frag, false);
      host.replaceChildren(frag);
      window.scrollTo(x, y);
    };
    inst.__rerender();
    if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
  }
  window.DC = { mount: mount, parse: parse };
})();
