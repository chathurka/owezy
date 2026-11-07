/*
 * Owezy prototype runtime (standalone).
 * Renders the *.dc.html screen files in any browser, outside the design canvas.
 *
 * Supported template syntax:
 *   {{ path.to.value }}            text / attribute holes (dotted lookups only)
 *   attr="{{ fn }}" on onXxx attrs  event handlers (onClick, onChange, ...)
 *   <sc-for list="{{ items }}" as="item">   repeats children ({{ $index }} available)
 *   <sc-if value="{{ cond }}">     renders children when truthy
 * Logic: <script type="text/x-dc" data-dc-script> class Component extends DCLogic { renderVals() {...} }
 */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, next);
      if (this.__render) this.__render();
    }
    forceUpdate() { if (this.__render) this.__render(); }
  }
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function lookup(scope, expr) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^(['"]).*\1$/.test(expr)) return expr.slice(1, -1);
    var parts = expr.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) {
      var v = lookup(scope, p);
      return v == null ? '' : String(v);
    });
  }

  var ATTR_ALIASES = { classname: 'class', htmlfor: 'for' };

  function renderNodes(nodes, scope, out) {
    for (var i = 0; i < nodes.length; i++) renderNode(nodes[i], scope, out);
    return out;
  }

  function renderNode(node, scope, out) {
    if (node.nodeType === 3) { out.push(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;

    if (tag === 'sc-for') {
      var m = WHOLE.exec(node.getAttribute('list') || '');
      var list = m ? lookup(scope, m[1]) : null;
      var as = node.getAttribute('as') || 'item';
      (list || []).forEach(function (item, idx) {
        var child = Object.create(scope);
        child[as] = item;
        child.$index = idx;
        renderNodes(node.childNodes, child, out);
      });
      return;
    }
    if (tag === 'sc-if') {
      var mv = WHOLE.exec(node.getAttribute('value') || '');
      if (mv && lookup(scope, mv[1])) renderNodes(node.childNodes, scope, out);
      return;
    }

    var el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.tagName)
      : document.createElement(tag);

    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a];
      var name = at.name, val = at.value;
      var lname = name.toLowerCase();
      var whole = WHOLE.exec(val);

      if (lname.indexOf('on') === 0 && whole) {
        var fn = lookup(scope, whole[1]);
        if (typeof fn === 'function') el.addEventListener(lname.slice(2), fn);
        continue;
      }
      if (lname === 'defaultvalue') { el.value = whole ? String(lookup(scope, whole[1]) ?? '') : interp(val, scope); continue; }
      if (lname.indexOf('hint-') === 0) continue;
      name = ATTR_ALIASES[lname] || name;

      var value = whole ? lookup(scope, whole[1]) : interp(val, scope);
      if (value === undefined || value === null || value === false && !/^aria-/.test(lname)) continue;
      try { el.setAttribute(name, String(value)); } catch (e) { /* ignore invalid attribute names */ }
    }
    renderNodes(node.childNodes, scope, []).forEach(function (c) { el.appendChild(c); });
    out.push(el);
  }

  function boot() {
    var host = document.querySelector('x-dc');
    if (!host) return;
    var raw = host.innerHTML;
    var tpl = document.createElement('template');
    tpl.innerHTML = raw;

    // Self-hosted Inter, so screens render correctly offline.
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = '../../fonts/inter.css';
    document.head.appendChild(font);

    // <helmet> contents go to <head> once.
    var helmet = tpl.content.querySelector('helmet');
    if (helmet) {
      Array.prototype.slice.call(helmet.childNodes).forEach(function (n) {
        if (n.nodeType === 1) document.head.appendChild(n.cloneNode(true));
      });
      helmet.parentNode.removeChild(helmet);
    }

    var scriptEl = document.querySelector('script[data-dc-script]');
    var props = {};
    var Component = DCLogic;
    if (scriptEl) {
      try {
        var decl = JSON.parse(scriptEl.getAttribute('data-props') || '{}');
        Object.keys(decl).forEach(function (k) {
          if (k.charAt(0) !== '$' && decl[k] && 'default' in decl[k]) props[k] = decl[k]['default'];
        });
      } catch (e) { console.warn('[owezy] could not parse data-props', e); }
      Component = new Function('DCLogic', scriptEl.textContent + '\n;return Component;')(DCLogic);
    }

    var root = document.createElement('div');
    root.id = 'dc-root';
    host.parentNode.replaceChild(root, host);

    var inst = new Component(props);
    inst.__render = function () {
      var vals = inst.renderVals ? inst.renderVals() || {} : {};
      var nodes = renderNodes(tpl.content.childNodes, vals, []);
      root.textContent = '';
      nodes.forEach(function (n) { root.appendChild(n); });
    };
    inst.__render();
    if (inst.componentDidMount) inst.componentDidMount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
