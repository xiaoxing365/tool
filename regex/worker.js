'use strict';

var MAX_MATCHES = 1000;

self.onmessage = function (ev) {
  var data = ev.data || {};
  var result = { id: data.id, ok: true, matches: [], truncated: false };

  var re;
  try {
    re = new RegExp(data.pattern, data.flags);
  } catch (e) {
    result.ok = false;
    result.error = e.message || String(e);
    self.postMessage(result);
    return;
  }

  var text = typeof data.text === 'string' ? data.text : '';
  try {
    var m;
    while ((m = re.exec(text)) !== null) {
      var groups = [];
      for (var j = 1; j < m.length; j++) {
        groups.push(m[j] === undefined ? null : m[j]);
      }
      var named = null;
      if (m.groups) {
        named = {};
        Object.keys(m.groups).forEach(function (k) {
          named[k] = m.groups[k] === undefined ? null : m.groups[k];
        });
      }
      result.matches.push({ index: m.index, full: m[0], groups: groups, named: named });

      if (result.matches.length >= MAX_MATCHES) {
        result.truncated = true;
        break;
      }
      if (m[0].length === 0) {
        if (re.lastIndex >= text.length) break;
        re.lastIndex += 1;
      }
      if (!re.global && !re.sticky) break;
    }
  } catch (e) {
    result.ok = false;
    result.error = e.message || String(e);
  }
  self.postMessage(result);
};
