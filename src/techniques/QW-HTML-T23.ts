'use strict';

import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';

import {
  ElementHandle
} from 'puppeteer';

import {
  DomUtils
} from '@qualweb/util';

import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Providing links to navigate to related Web pages',
  code: 'QW-HTML-T23',
  mapping: 'G125',
  description: 'The objective of this technique is to make it possible for users to locate additional information by providing links to related Web pages',
  metadata: {
    target: {
      element: 'a',
      attributes: 'href'
    },
    'success-criteria': [{
      name: '2.4.5',
      level: 'AA',
      principle: 'Operable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways'
    }],
    related: ['G63', 'G64', 'G126', 'G185'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G125',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};

class QW_HTML_T23 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: ElementHandle | undefined): Promise < void > {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element) {
      const href = await DomUtils.getElementAttribute(element, 'href');

      if (href) {
        evaluation.verdict = 'warning';
        evaluation.description = `Check whether the link leads to related information`;
        evaluation.resultCode = 'RC1';

        evaluation.htmlCode = await DomUtils.getElementHtmlCode(element);
        evaluation.pointer = await DomUtils.getElementSelector(element);
      }
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `The webpage doesn't have any links`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T23;