import QW_HTML_T1 from './techniques/QW-HTML-T1';
import QW_HTML_T2 from './techniques/QW-HTML-T2';
import QW_HTML_T3 from './techniques/QW-HTML-T3';
import QW_HTML_T4 from './techniques/QW-HTML-T4';
import QW_HTML_T30 from './techniques/QW-HTML-T30';
import QW_HTML_T5 from './techniques/QW-HTML-T5';
import QW_HTML_T6 from './techniques/QW-HTML-T6';
import QW_HTML_T32 from './techniques/QW-HTML-T32';
import QW_HTML_T7 from './techniques/QW-HTML-T7';
import QW_HTML_T9 from './techniques/QW-HTML-T9';
import QW_HTML_T10 from './techniques/QW-HTML-T10';
import QW_HTML_T11 from './techniques/QW-HTML-T11';
import QW_HTML_T12 from './techniques/QW-HTML-T12';
import QW_HTML_T13 from './techniques/QW-HTML-T13';

const techniques = {
  'QW-HTML-T1': new QW_HTML_T1(),
  'QW-HTML-T2': new QW_HTML_T2(),
  'QW-HTML-T3': new QW_HTML_T3(),
  'QW-HTML-T4': new QW_HTML_T4(),
  'QW-HTML-T32': new QW_HTML_T32(),
  'QW-HTML-T5': new QW_HTML_T5(),
  'QW-HTML-T6': new QW_HTML_T6(),
  'QW-HTML-T7': new QW_HTML_T7(),
  'QW-HTML-T9': new QW_HTML_T9(),
  'QW-HTML-T10': new QW_HTML_T10(),
  'QW-HTML-T11': new QW_HTML_T11(),
  'QW-HTML-T12': new QW_HTML_T12(),
  'QW-HTML-T13': new QW_HTML_T13(),
  'QW-HTML-T30': new QW_HTML_T30()};


const techniquesToExecute = {
  'QW-HTML-T1': false,
  'QW-HTML-T2': true,
  'QW-HTML-T3': true,
  'QW-HTML-T4': true,
  'QW-HTML-T32': true,
  'QW-HTML-T5': true,
  'QW-HTML-T6': true,
  'QW-HTML-T7': true,
  'QW-HTML-T9': true,
  'QW-HTML-T10': true,
  'QW-HTML-T11': true,
  'QW-HTML-T12': true,
  'QW-HTML-T13': true,
  'QW-HTML-T30': true
};

export {
  techniques,
  techniquesToExecute
};
