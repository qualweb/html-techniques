import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T31 from './techniques/QW-HTML-T31';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T31': new QW_HTML_T31()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T31': true
};

export {
  techniques,
  techniquesToExecute
};