import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T3 from './techniques/QW-HTML-T3';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T3': QW_HTML_T3
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T3': true
};

export {
  techniques,
  techniquesToExecute
};
