import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T9 from './techniques/QW-HTML-T9';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T9': new QW_HTML_T9()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T9': true
};

export {
  techniques,
  techniquesToExecute
};