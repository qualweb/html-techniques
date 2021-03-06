'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T10 extends Technique {

  constructor() {
    super({
      name: 'Using the title attribute of the frame and iframe elements',
      code: 'QW-HTML-T10',
      mapping: 'H64',
      description: 'The objective of this technique is to demonstrate the use of the title attribute of the frame or iframe element to describe the contents of each frame',
      metadata: {
        target: {
          element: 'frame, iframe'
        },
        'success-criteria': [{
            name: '2.4.1',
            level: 'A',
            principle: 'Operable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks'
          },
          {
            name: '4.1.2',
            level: 'A',
            principle: 'Robust',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value'
          }
        ],
        related: [],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H64',
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

    //1. Check each frame and iframe element in the HTML or XHTML
    //source code for the presence of a title attribute.
    // 2. Check that the title attribute contains text that identifies the frame.
    const hasTitle = element.elementHasAttribute('title');
    const title = element.getElementAttribute('title');
    if (hasTitle) {
      if (title && title.trim() !== '') {
        evaluation.verdict = 'warning';
        evaluation.description = 'Verify if title attribute contains text that identifies the frame';
        evaluation.resultCode = 'RC1';
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'Title attribute is empty';
        evaluation.resultCode = 'RC2';
      }
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `frame or iframe doesn't have title attribute`;
      evaluation.resultCode = 'RC3';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T10;
