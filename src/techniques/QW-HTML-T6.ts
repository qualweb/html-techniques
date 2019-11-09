'use strict';

import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';

import {
  DomUtils
} from '@qualweb/util';

import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Using both keyboard and other device-specific functions',
  code: 'QW-HTML-T6',
  mapping: 'SCR20',
  description: 'The objective of this technique is to verify the parity of keyboard-specific and mouse-specific events when code that has a scripting function associated with an event is used',
  metadata: {
    target: {
      element: '*',
      attributes: ['onmousedown', 'onmouseup', 'onclick', 'onmouseover', 'onmouseout']
    },
    'success-criteria': [{
      name: '2.1.1',
      level: 'A',
      principle: 'Operable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
    }],
    related: ['G90'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};
class QW_HTML_T6 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined): Promise < void > {

    if (!element || !DomUtils.elementHasAttributes(element)) {
      return;
    }

    let evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (DomUtils.elementHasAttribute(element, 'onmousedown') && DomUtils.getElementAttribute(element,'onmousedown') !== DomUtils.getElementAttribute(element,'onkeydown')) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mousedown attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC1';
    } else if (DomUtils.elementHasAttribute(element, 'onmouseup') && DomUtils.getElementAttribute(element,'onmouseup') !== DomUtils.getElementAttribute(element,'onkeyup')) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseup attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC2';
    } else if (DomUtils.elementHasAttribute(element, 'onclick') && DomUtils.getElementAttribute(element,'onclick') !== DomUtils.getElementAttribute(element,'onkeypress')) {
      evaluation.verdict = 'failed';
      evaluation.description = `The click attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC3';
    } else if (DomUtils.elementHasAttribute(element, 'onmouseover') && DomUtils.getElementAttribute(element,'onmouseover') !== DomUtils.getElementAttribute(element,'onfocus')) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseover attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC4';
    } else if (DomUtils.elementHasAttribute(element, 'onmouseout') && DomUtils.getElementAttribute(element,'onmouseout') !== DomUtils.getElementAttribute(element,'onblur')) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseout attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC5';
    } else {
      evaluation.verdict = 'passed';
      evaluation.description = `All the mouse event handlers have a keyboard equivalent`;
      evaluation.resultCode = 'RC6';
    }
    console.log( evaluation.resultCode )
    console.log(element.attribs);
    console.log(DomUtils.elementHasAttribute(element, 'onmouseout'));
    console.log(DomUtils.elementHasAttribute(element, 'onmouseout') +"  !   "+ DomUtils.getElementAttribute('onmouseout') !== DomUtils.getElementAttribute('onblur'));

    evaluation.htmlCode = DomUtils.transformElementIntoHtml(element);
    evaluation.pointer = DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T6;
