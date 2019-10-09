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

import Technique from "./Technique.object";

const technique: HTMLTechnique = {
  name: 'Using the summary attribute of the table element to give an overview of data tables',
  code: 'QW-HTML-T4',
  mapping: 'H73',
  description: 'This technique checks the correct use of the summary attribute for table elements',
  metadata: {
    target: {
      element: 'table'
    },
    'success-criteria': [{
      name: '1.3.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
    }],
    related: ['H39', 'H51', 'F46'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H73',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};


class QW_HTML_T4 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined): Promise < void > {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (!DomUtils.elementHasAttribute(element, 'summary')) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The summary does not exist in the table element';
      evaluation.resultCode = 'RC1';
    } else if (DomUtils.getElementAttribute(element, 'summary').trim() === '') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The summary is empty';
      evaluation.resultCode = 'RC2';
    } else if (DomUtils.getElementAttribute(element, 'summary').trim() === DomUtils.getElementChildTextContent(element, 'caption').trim()) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The caption is a duplicate of the summary';
      evaluation.resultCode = 'RC3';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the summary is a valid description of the table';
      evaluation.resultCode = 'RC4';
    }

    evaluation.htmlCode = DomUtils.transformElementIntoHtml(element);
    evaluation.pointer = DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T4;