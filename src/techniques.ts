import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T29 from './techniques/QW-HTML-T29';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T29': new QW_HTML_T29()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T29': true
};

export {
  techniques,
  techniquesToExecute
};