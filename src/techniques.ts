import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T21 from './techniques/QW-HTML-T21';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T21': new QW_HTML_T21()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T21': true
};

export {
  techniques,
  techniquesToExecute
};