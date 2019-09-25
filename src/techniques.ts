import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T37 from './techniques/QW-HTML-T37';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T37': new QW_HTML_T37()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T37': true
};

export {
  techniques,
  techniquesToExecute
};
