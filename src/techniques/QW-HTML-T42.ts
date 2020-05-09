'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { AccessibilityUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T42 extends Technique {

  constructor() {
    super({
      name: 'Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML without providing a role for the control',
      code: 'QW-HTML-T42',
      mapping: 'F59',
      description: 'This failure demonstrates how using generic HTML elements to create user interface controls can make the controls inaccessible to assistive technology.',
      metadata: {
        target: {
          element: ['*']
        },
        'success-criteria': [{
          name: '4.1.2',
          level: 'A',
          principle: 'Robust',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value'
        }
        ],
        related: ['F42'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F59',
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

    if (element === undefined||!(element.elementHasAttributes())) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (AccessibilityUtils.isElementControl(element)) {
      evaluation.verdict = 'passed';
      evaluation.description = `The element is a user interface control with an event handler`;
      evaluation.resultCode = 'RC1';
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `The element is a forcer user interface control without the proper role attribute`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T42;
