import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T15 from './techniques/QW-HTML-T15';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T15': QW_HTML_T15
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T15': true
};

export {
  techniques,
  techniquesToExecute
};