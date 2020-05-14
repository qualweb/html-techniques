'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T5 extends Technique {

  constructor() {
    super({
      name: 'Using alt attributes on images used as submit buttons',
      code: 'QW-HTML-T5',
      mapping: 'H36',
      description: 'This technique checks all input elements that are buttons use alt text',
      metadata: {
        target: {
          element: 'input'
        },
        'success-criteria': [{
          name: '1.1.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
        }],
        related: ['G94'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H36',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array < HTMLTechniqueResult > ()
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

    const alt = element.getElementAttribute('alt');

    if (alt === null) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The input element does not have an alt attribute';
      evaluation.resultCode = 'RC1';
    } else if (!alt.trim().length) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The input element has an empty alt attribute';
      evaluation.resultCode = 'RC2';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the value of the alt attribute correctly describes the function of the button';
      evaluation.resultCode = 'RC3';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T5;
