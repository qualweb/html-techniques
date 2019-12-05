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
  name: 'Using the link element and navigation tools',
  code: 'QW-HTML-T19',
  mapping: 'H59',
  description: 'The objective of this technique is to describe how the link element can provide metadata about the position of an HTML page within a set of Web pages or can assist in locating content with a set of Web pages.',
  metadata: {
    target: {
      element: 'link'
    },
    'success-criteria': [{
        name: '2.4.5',
        level: 'AA',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways'
      },
      {
        name: '2.4.8',
        level: 'AAA',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/location'
      }
    ],
    related: ['G1', 'G63', 'G64', 'G123'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H59',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};

class QW_HTML_T19 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: ElementHandle | undefined): Promise < void > {

    if (!element) {
      return;
    }

    const parent = await DomUtils.getElementParent(element);

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const parentName = await DomUtils.getElementTagName(parent);

    if (parentName !== 'head') {
      evaluation.verdict = 'warning';
      evaluation.description = `The element is not contained in the head element. Verify if this link is used for navigation, and if it is, it must be inside the <head>`;
      evaluation.resultCode = 'RC1';
    } else if (!(await DomUtils.elementHasAttributes(element))) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'inapplicable';
      evaluation.description = `The element doesn't contain a rel or an href attribute`;
      evaluation.resultCode = 'RC2';
    } else {
      //const rel = await DomUtils.getElementAttribute(element, 'rel');
      //const href = await DomUtils.getElementAttribute(element, 'href');

      const [rel, href] = await Promise.all([
        DomUtils.getElementAttribute(element, 'rel'),
        DomUtils.getElementAttribute(element, 'href')
      ]);

      const relNavigationValues = ['alternate', 'author', 'help', 'license', 'next', 'prev', 'search'];

      const relForNavigation = rel && relNavigationValues.includes(rel);

      if (!relForNavigation) {
        evaluation.verdict = 'inapplicable';
        evaluation.description = `The element doesn't contain a rel attribute or doesn't pertains navigation`;
        evaluation.resultCode = 'RC3';
      } else if (!href) {
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain an href attribute and pertains navigation`;
        evaluation.resultCode = 'RC4';
      } else {
        evaluation.verdict = 'passed';
        evaluation.description = 'The link has rel and href attributes and pertains navigation';
        evaluation.resultCode = 'RC5';
      }
    }
    
    evaluation.htmlCode = await DomUtils.getElementHtmlCode(element);
    evaluation.pointer = await DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T19;