'use strict';

import Technique from './Technique.object';

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

const technique: HTMLTechnique = {
  name: 'Using alt attributes on images used as submit buttons',
  code: 'QW-HTML-T5',
  mapping: 'H36',
  description: 'This technique checks all input elements that are buttons use alt text',
  metadata: {
    target: {
      element: 'input '
    },
    'success-criteria': [{
      name: '1.1.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
    }
    ],
    related: ['G94'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H36',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T5 extends Technique {

  constructor() {
    super(technique);
  }


  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

  if (element === undefined) {
    return;
  }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (verifyAlt(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The alt does not exist in the input element';
      evaluation.resultCode = 'RC1';
      technique.metadata.failed++;
    }
    if (verifyAltContent(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The alt is empty';
      evaluation.resultCode = 'RC2';
      technique.metadata.failed++;

    }
    if (technique.metadata.failed === 0) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the alt is a valid description of the input image';
      evaluation.resultCode = 'RC3';
      technique.metadata.warning++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
  super.addEvaluationResult(evaluation);
}
}

function verifyAlt(elem){
  return (elem.attribs !== undefined)?
      (elem.attribs['alt'] === undefined):true;
}

function verifyAltContent(elem){
  return (elem.attribs !== undefined) ? ((elem.attribs['alt'] !== undefined)? elem.attribs['alt'].trim() === '': true): true;

}

export = QW_HTML_T5;
