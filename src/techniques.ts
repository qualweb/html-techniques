import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T10 from './techniques/QW-HTML-T10';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T10': QW_HTML_T10
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T10': true
};

export {
  techniques,
  techniquesToExecute
};
