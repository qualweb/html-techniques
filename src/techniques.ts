import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T28 from './techniques/QW-HTML-T28';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T28': new QW_HTML_T28()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T28': true
};

export {
  techniques,
  techniquesToExecute
};