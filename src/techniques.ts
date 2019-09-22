import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T26 from './techniques/QW-HTML-T26';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T26': new QW_HTML_T26()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T26': true
};

export {
  techniques,
  techniquesToExecute
};
