'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T27 extends Technique {

  constructor() {
    super({
      name: 'Providing descriptive headings',
      code: 'QW-HTML-T27',
      mapping: 'G130',
      description: 'The objective of this technique is to make section headings within Web content descriptive',
      metadata: {
        target: {
          element: 'h1, h2, h3, h4, h5, h6'
        },
        'success-criteria': [{
          name: '2.4.6',
          level: 'AA',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels'
        }],
        related: [],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G130',
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

    evaluation.verdict = 'warning';
    evaluation.description = 'Check that each heading identifies its section of the content';
    evaluation.resultCode = 'RC1';

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T27;
