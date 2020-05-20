'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T2 extends Technique {

  constructor() {
    super({
      name: 'Using caption elements to associate data table captions with data tables',
      code: 'QW-HTML-T2',
      mapping: 'H39',
      description: 'This technique checks the caption element is correctly use on tables',
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
        related: ['H51', 'H73', 'F46'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H39',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: '',
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

    const hasChild = element.elementHasChild('caption');
    const childText = element.getElementChildTextContent('caption');

    if (!hasChild) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The caption does not exist in the table element';
      evaluation.resultCode = 'RC1';
    } else if (!childText ||childText && childText.trim() === '') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The caption is empty';
      evaluation.resultCode = 'RC2';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the caption element identifies the table correctly.';
      evaluation.resultCode = 'RC3';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T2;
