'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { AccessibilityUtils } from '@qualweb/util';
import { QWPage } from '@qualweb/qw-page';

class QW_HTML_T4 extends Technique {

  constructor() {
    super({
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
        outcome: '',
        description: ''
      },
      results: new Array < HTMLTechniqueResult > ()
    });
  }

  execute(element: QWElement | undefined, page: QWPage): void {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const isDataTable = AccessibilityUtils.isDataTable(element, page);
    const caption = element.getElementChildTextContent('caption');
    const summary = element.getElementAttribute('summary');
    
    if(isDataTable){
      if (summary === null) {
        evaluation.verdict = 'inapplicable';
        evaluation.description = 'The summary does not exist in the table element';
        evaluation.resultCode = 'RC1';
      } else if (!summary.trim().length) {
        evaluation.verdict = 'failed';
        evaluation.description = 'The summary is empty';
        evaluation.resultCode = 'RC2';
      } else if (caption && summary.trim() === caption.trim()) {
        evaluation.verdict = 'failed';
        evaluation.description = 'The caption is a duplicate of the summary';
        evaluation.resultCode = 'RC3';
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = 'Please verify that the summary is a valid description of the table';
        evaluation.resultCode = 'RC4';
      }
    } else {
      evaluation.verdict = 'inapplicable';
      evaluation.description = 'This table is not a data table';
      evaluation.resultCode = 'RC5';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T4;
