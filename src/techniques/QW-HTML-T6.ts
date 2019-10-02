'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from "./Technique.object";

const technique: HTMLTechnique = {
  name: 'Using both keyboard and other device-specific functions',
  code: 'QW-HTML-T6',
  mapping: 'SCR20',
  description: 'The objective of this technique is to verify the parity of keyboard-specific and mouse-specific events when code that has a scripting function associated with an event is used',
  metadata: {
    target: {
      element: '*',
      attributes: 'onmousedown, onmouseup, onclick, onmouseover, onmouseout'
    },
    'success-criteria': [
      {
        name: '2.1.1',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
      }
    ],
    related: ['G90'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};
class QW_HTML_T6 extends Technique {

  constructor() {
    super(technique);
  }


  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

  if (element === undefined || element.attribs === undefined) {
    return;
  }

  let evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: '',
    resultCode: ''
  };


  if (element.attribs["onmousedown"] !== element.attribs["onkeydown"] && element.attribs["onmousedown"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mousedown attribute doesnt have a keyboard equivalent`;
    evaluation.resultCode = 'RC1';
  } else if (element.attribs["onmouseup"] !== element.attribs["onkeyup"] && element.attribs["onmouseup"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseup attribute doesnt have a keyboard equivalent`;
    evaluation.resultCode = 'RC2';
  } else if (element.attribs["onclick"] !== element.attribs["onkeypress"] && element.attribs["onclick"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The click attribute doesnt have a keyboard equivalent`;
    evaluation.resultCode = 'RC3';
  } else if (element.attribs["onmouseover"] !== element.attribs["onfocus"] && element.attribs["onmouseover"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseover attribute doesnt have a keyboard equivalent`;
    evaluation.resultCode = 'RC4';
  } else if (element.attribs["onmouseout"] !== element.attribs["onblur"] && element.attribs["onmouseout"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseout attribute doesnt have a keyboard equivalent`;
    evaluation.resultCode = 'RC5';
  } else {
    evaluation.verdict = 'passed';
    evaluation.description = `All the mouse event handlers have a keyboard equivalent`;
    evaluation.resultCode = 'RC6';

  }


  evaluation.htmlCode = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

  super.addEvaluationResult(evaluation);
}

}

export = QW_HTML_T6;
