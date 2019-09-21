import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T7 from './techniques/QW-HTML-T7';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T7': new QW_HTML_T7()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T7': true
};

export {
  techniques,
  techniquesToExecute
};