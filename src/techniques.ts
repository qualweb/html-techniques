import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T17 from './techniques/QW-HTML-T17';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T17': QW_HTML_T17
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T17': true
};

export {
  techniques,
  techniquesToExecute
};
