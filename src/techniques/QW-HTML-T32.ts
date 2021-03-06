'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T32 extends Technique {

  constructor() {
    super({
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
        }],
        related: ['G80', 'H36', 'H84'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H32',
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

    const children = element.getElements(`input[type="submit"], input[type="image"], button[type="submit"]`);

    if (children.length > 0) { // the element contains one of the following elements input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'passed';
      evaluation.description = `The form contains one of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC1';
    } else { // fails if none of the following elements was found input[type~='submit image'], button[type='submit']
      evaluation.verdict = 'failed';
      evaluation.description = `Form tag doesn't contain any of the following elements input[type~="submit image"], button[type="submit"]`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T32;
