'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T16 extends Technique {

  constructor() {
    super({
      name: 'Failure of Success Criterion 2.2.2 due to using the blink element',
      code: 'QW-HTML-T16',
      mapping: 'F47',
      description: 'The blink element, while not part of the official HTML or XHTML specification, is supported by many user agents. It causes any text inside the element to blink at a predetermined rate. This cannot be interrupted by the user, nor can it be disabled as a preference. The blinking continues as long as the page is displayed. Therefore, content that uses blink fails the Success Criterion because blinking can continue for more than three seconds.',
      metadata: {
        target: {
          element: 'blink'
        },
        'success-criteria': [{
          name: '2.2.2',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide'
        }],
        related: [],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F47',
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

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element !== undefined) {
      evaluation.verdict = 'failed';
      evaluation.description = 'Used blink element';
      evaluation.resultCode = 'RC1';
    } else { // success if refresh element doesn't exist
      evaluation.verdict = 'passed';
      evaluation.description = `Blink is not used`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T16;
