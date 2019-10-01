
import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T30 from './techniques/QW-HTML-T30';
import QW_HTML_T5 from './techniques/QW-HTML-T5';
import QW_HTML_T32 from './techniques/QW-HTML-T32';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T32': new QW_HTML_T32(),
  'QW-HTML-T5': new QW_HTML_T5(),
  'QW-HTML-T30': new QW_HTML_T30()
};

const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T32': true,
  'QW-HTML-T5': true,
  'QW-HTML-T30': true
};

export {
  techniques,
  techniquesToExecute
};
