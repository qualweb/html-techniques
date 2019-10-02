import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T8 from './techniques/QW-HTML-T8';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T8': new QW_HTML_T8()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T8': true
};

export {
  techniques,
  techniquesToExecute
};
