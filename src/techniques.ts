import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T12 from './techniques/QW-HTML-T12';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T12': QW_HTML_T12
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T12': true
};

export {
  techniques,
  techniquesToExecute
};
