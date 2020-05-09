'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T41 extends Technique {

  constructor() {
    super({
      name: 'Using the scope attribute to associate header cells and data cells in data tables',
      code: 'QW-HTML-T41',
      mapping: 'H63',
      description: 'The objective of this technique is to associate header cells with data cells in complex tables using the scope attribute.',
      metadata: {
        target: {
          element: ['th', 'td[scope]']
        },
        'success-criteria': [{
          name: '1.3.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
        }
        ],
        related: ['H43', 'H51'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H63',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  execute(element: QWElement | undefined): void {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const name = element.getElementTagName();

    const hasScope = element.elementHasAttribute('scope');
    const scope = element.getElementAttribute('scope');

    if (name === 'th' && !hasScope) {
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain a scope attribute`;
      evaluation.resultCode = 'RC1';
    } else if (name === 'th' && scope === '') {
      evaluation.verdict = 'failed';
      evaluation.description = `The element's scope attribute is empty`;
      evaluation.resultCode = 'RC2';
    } else {
      if (scope && ['col', 'row', 'colgroup', 'rowgroup'].includes(scope)) {
        evaluation.verdict = 'passed';
        evaluation.description = 'The element\'s scope attribute matches the following values: col, row, colgroup, rowgroup';
        evaluation.resultCode = 'RC3';
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'The element\'s scope attribute doesn\'t match any of the following values: col, row, colgroup, rowgroup';
        evaluation.resultCode = 'RC4';
      }
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T41;
