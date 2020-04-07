export default {
  'pre': {
  },
  'post': {
    'img + map > area': ['QW-HTML-T1'],
    'fieldset': ['QW-HTML-T3'],
    ':not(svg) > title': ['QW-HTML-T13', 'QW-HTML-T24', 'QW-HTML-T26'],
    'body': ['QW-HTML-T9','QW-HTML-T38'],
    'input[type="image"]': ['QW-HTML-T5'],
    'frame, iframe': ['QW-HTML-T10'],
    'applet': ['QW-HTML-T14'],
    'table': ['QW-HTML-T2', 'QW-HTML-T4', 'QW-HTML-T15','QW-HTML-T17', 'QW-HTML-T30'],
    'a': ['QW-HTML-T11','QW-HTML-T34','QW-HTML-T33'],
    '*[onmousedown], *[onmouseup], *[onclick], *[onmouseover], *[onmouseout]': ['QW-HTML-T6', 'QW-HTML-T29'],
    'abbr': ['QW-HTML-T7'],
    'link': ['QW-HTML-T19'],
    '[text], [vlink], [alink], [link]': ['QW-HTML-T22'],
    'a[href], area[href]': ['QW-HTML-T23'],
    'blink': ['QW-HTML-T16'],
    'input': ['QW-HTML-T25'],
    'ol, ul, dl': ['QW-HTML-T28'],
    'h1, h2, h3, h4, h5, h6': ['QW-HTML-T27'],
    'img': ['QW-HTML-T31'],
    'form': ['QW-HTML-T32'],
    'a[href]': ['QW-HTML-T37'],
    'body, body *': ['QW-HTML-T40'],
    'th, td[scope]': ['QW-HTML-T41'],
    'p, div, h1, h2, h3, h4, h5, h6, col, colgroup, tbody, thead, tfoot, tr, th, td': ['QW-HTML-T43'],
    'img,svg': ['QW-HTML-T39'],
    '*[onmousedown], *[onmouseup], *[onclick], *[onmouseover], *[onmouseout], *[keydown], *[keyup], *[keypress], *[focus], *[blur]': ['QW-HTML-T42'],
    'ol,ul,dl': ['QW-HTML-T28'],
    '[alt]': ['QW-HTML-T8']
  }
};
