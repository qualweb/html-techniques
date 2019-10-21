import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T34 from './techniques/QW-HTML-T34';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T34': new QW_HTML_T34(),

};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T34': true
  
};

export {
  techniques,
  techniquesToExecute
};