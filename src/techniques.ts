import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T34 from './techniques/QW-HTML-T34';
import QW_HTML_T35 from './techniques/QW-HTML-T35';
import QW_HTML_T36 from './techniques/QW-HTML-T36';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T34': new QW_HTML_T34(),
  'QW-HTML-T35': new QW_HTML_T35(),
  'QW-HTML-T36': new QW_HTML_T36(),
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T34': true,
  'QW-HTML-T35': true,
  'QW-HTML-T36': true,
  
};

export {
  techniques,
  techniquesToExecute
};