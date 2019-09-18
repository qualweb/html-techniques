import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T4 from './techniques/QW-HTML-T4';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T4': QW_HTML_T4
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T4': true
};

export {
  techniques,
  techniquesToExecute
};
