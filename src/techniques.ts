import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T14 from './techniques/QW-HTML-T14';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T14': QW_HTML_T14
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T14': true
};

export {
  techniques,
  techniquesToExecute
};