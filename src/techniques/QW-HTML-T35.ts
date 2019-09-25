'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement, DomUtils
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
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
    related: ['H44', 'H65', 'G167', 'ARIA6', 'ARIA9', 'ARIA16', 'ARIA14'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/F68.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T35 extends Technique {

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
    let forAt;
    let text = _.trim(DomUtils.getText(element));
    if (element.attribs)
      forAt = element.attribs["for"];



    if (!forAt) { // fails if the element doesn't contain an accessible name
      evaluation.verdict = 'failed';
      evaluation.description = `The label element has no for attribute`;
      technique.metadata['failed']++;
      evaluation.resultCode = 'RC1';
    } if (!text) { // fails if the element doesn't contain an accessible name
      evaluation.verdict = 'failed';
      evaluation.description = `The label element has no text content`;
      technique.metadata['failed']++;
      evaluation.resultCode = 'RC2';
    } else { // fails if the element doesn't contain an accessible name
      evaluation.verdict = 'passed';
      evaluation.description = 'The label element has text content and a for attribute';
      technique.metadata['passed']++;
      evaluation.resultCode = 'RC3';
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);


    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T35;