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
import { getNumberOfOpenPages } from '../util';

const stew = new(require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Failure of Success Criterion 3.2.1 and 3.2.5 due to opening a new window as soon as a new page is loaded ',
  code: 'QW-HTML-T35',
  mapping: 'F52',
  description: 'The objective of this technique is to ensure that pages do not disorient users by opening up one or more new windows that automatically attain focus as soon as a page is loaded. ',
  metadata: {
    target: {
      element: '*'
    },
    'success-criteria': [{
      name: '3.2.5',
      level: 'AAA',
      principle: 'Understandable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/change-on-request'
    }],
    related: ['G107'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F52',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};


class QW_HTML_T35 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(): Promise < void > {
    throw new Error('Method not implemented.');
  }

  async validate(url: string): Promise < void > {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const numberOfPages =  await getNumberOfOpenPages(url);
    if (numberOfPages < 2) { // the element contains one of the following elements input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'passed';
      evaluation.description = `The form contains one of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC1';
    } else { // fails if none of the following elements was found input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'failed';
      evaluation.description = `Form tag doesn't contain any of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T35;