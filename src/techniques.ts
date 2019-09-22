import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T30 from './techniques/QW-HTML-T30';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T30': new QW_HTML_T30()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T30': true
};

export {
  techniques,
  techniquesToExecute
};
