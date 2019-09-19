import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T18 from './techniques/QW-HTML-T18';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T18': QW_HTML_T18
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T18': true
};

export {
  techniques,
  techniquesToExecute
};
