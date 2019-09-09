import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T16 from './techniques/QW-HTML-T16';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T16': QW_HTML_T16
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T16': true
};

export {
  techniques,
  techniquesToExecute
};