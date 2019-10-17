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
  name: 'Failure of Success Criterion 4.1.2 due to a user interface control not having a programmatically determined name',
  code: 'QW-HTML-T35',
  mapping: 'F68',
  description: 'This technique checks the accesible name for input,select,textarea.',
  metadata: {
    target: {
      element: 'input,textarea,select'
    },
    'success-criteria': [
      {
        name: '4.1.2',
        level: 'A',
        principle: 'Robust',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html'
      }
    ],
    related: ['H44', 'H65','G167','ARIA6','ARIA9','ARIA16','ARIA14'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/F68.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T35 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined||(element.attribs&&element.name === 'input'&&(element.attribs['type'] === 'hidden'||element.attribs['type'] === 'submit'||element.attribs['type'] === 'reset'||element.attribs['type'] === 'button'))) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };
    console.log(element.name);
    let accesibleName = getAccessibleName(element, processedHTML,false,false);
    console.log(accesibleName);
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

export = QW_HTML_T35;
