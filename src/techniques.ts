import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T20 from './techniques/QW-HTML-T20';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T20': new QW_HTML_T20()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T20': true
};

export {
  techniques,
  techniquesToExecute
};