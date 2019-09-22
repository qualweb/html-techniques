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
import Technique from './Technique.object';
const stew = new (require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Providing submit buttons',
  code: 'QW-HTML-T32',
  mapping: 'H32',
  description: 'The objective of this technique is to provide a mechanism that allows users to explicitly request changes of context. The intended use of a submit button is to generate an HTTP request that submits data entered in a form, so it is an appropriate control to use for causing a change of context.',
  metadata: {
    target: {
      element: 'form'
    },
    'success-criteria': [{
        name: '3.2.2',
        level: 'A',
        principle: 'Understandable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/on-input'
      }
    ],
    related: ['G80', 'H36', 'H84'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H32',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T32 extends Technique {

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

    const children = stew.select(element, `input[type="submit"], input[type="image"], button[type="submit"]`);

    if (_.size(children) > 0) { // the element contains one of the following elements input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'passed';
      evaluation.description = `The form contains one of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC1';
      technique.metadata.passed++;
    } else { // fails if none of the following elements was found input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'failed';
      evaluation.description = `Form tag doesn't contain any of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC2';
      technique.metadata.failed++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T32;
