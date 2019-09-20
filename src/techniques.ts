import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T23 from './techniques/QW-HTML-T23';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T23': new QW_HTML_T23()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T23': true
};

export {
  techniques,
  techniquesToExecute
};
