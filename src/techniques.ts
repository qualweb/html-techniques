
import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T5 from './techniques/QW-HTML-T5';
import QW_HTML_T32 from './techniques/QW-HTML-T32';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T32': new QW_HTML_T32(),
  'QW-HTML-T5': new QW_HTML_T5()
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T32': true,
  'QW-HTML-T5': true};




export {
  techniques,
  techniquesToExecute
};
