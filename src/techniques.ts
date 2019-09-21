import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T19 from './techniques/QW-HTML-T19';


const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T19': new QW_HTML_T19()
};

const techniquesToExecute = {
  'QW-HTML-T1': true,
  'QW-HTML-T19': true
};

export {
  techniques,
  techniquesToExecute
};