'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T7 extends Technique {

  constructor() {
    super({
      name: 'Providing definitions for abbreviations by using the abbr element',
      code: 'QW-HTML-T7',
      mapping: 'H28',
      description: 'The objective of this technique is to provide expansions or definitions for abbreviations by using the abbr element',
      metadata: {
        target: {
          element: 'abbr'
        },
        'success-criteria': [{
          name: '3.1.4',
          level: 'AAA',
          principle: 'Understandable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/abbreviations'
        }],
        related: ['G91', 'H30'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H28',
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

    const hasTitle = element.elementHasAttribute('title');
    const title = element.getElementAttribute('title');

    if (hasTitle && title && title.trim() !== '') {
      evaluation.verdict = 'passed';
      evaluation.description = `The element abbrv has the definition in the title attribute`;
      evaluation.resultCode = 'RC1';
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `The element abbrv doesn't have the definition in the title attribute`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T7;
