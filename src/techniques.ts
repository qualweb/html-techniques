import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T13 from './techniques/QW-HTML-T13';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T13': QW_HTML_T13
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T13': true
};

export {
  techniques,
  techniquesToExecute
};