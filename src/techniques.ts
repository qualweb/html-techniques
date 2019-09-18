import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T5 from './techniques/QW-HTML-T5';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T5': QW_HTML_T5
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T5': true
};

export {
  techniques,
  techniquesToExecute
};
