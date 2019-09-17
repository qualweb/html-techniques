import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T2 from './techniques/QW-HTML-T2';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T2': QW_HTML_T2
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T2': true
};

export {
  techniques,
  techniquesToExecute
};
