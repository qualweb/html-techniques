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
  transform_element_into_html,
  getAccessibleName
} from '../util';
import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Failure of Success Criterion 1.1.1 due to omitting the alt attribute or text alternative on img elements, area elements, and input elements of type "image" ',
  code: 'QW-HTML-T35',
  mapping: 'F65',
  description: 'This technique checks the accesible name for img,area and input of type image.',
  metadata: {
    target: {
      element: 'input,img,area'
    },
    'success-criteria': [
      {
        name: '1.1.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
      }
    ],
    related: ['H67', 'H37','ARIA10'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F65',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T36 extends Technique {

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
    let accesibleName = getAccessibleName(element,processedHTML,false);
    if (accesibleName) { // fails if the element doesn't contain an accessible name
      evaluation.verdict = 'passed';
      evaluation.description = `The element has an accessible name`;
      technique.metadata['success']++;
      evaluation.resultCode = 'RC1';
    } else { // fails if the element doesn't contain an accessible name
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain an accessible name`;
      technique.metadata['failed']++;
      evaluation.resultCode = 'RC2';
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T36;