import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T35 from './techniques/QW-HTML-T35';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T35': new QW_HTML_T35()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T35': new QW_HTML_T35()
};

export {
  techniques,
  techniquesToExecute
};