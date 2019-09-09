import * as QW_HTML_T1  from './techniques/QW-HTML-T1';
import * as QW_HTML_T11 from './techniques/QW-HTML-T11';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T11': QW_HTML_T11
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T11': true
};

export {
  techniques,
  techniquesToExecute
};