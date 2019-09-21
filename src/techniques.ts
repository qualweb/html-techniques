import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T27 from './techniques/QW-HTML-T27';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T27': new QW_HTML_T27()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T27': true
};

export {
  techniques,
  techniquesToExecute
};
