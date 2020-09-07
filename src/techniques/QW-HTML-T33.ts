'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T33 extends Technique {

  constructor() {
    super({
      name: 'Supplementing link text with the title attribute',
      code: 'QW-HTML-T33',
      mapping: 'H33',
      description: 'Supplementing link text with the title attribute',
      metadata: {
        target: {
          element: 'a'
        },
        'success-criteria': [{
          name: '2.4.4',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context'
        }, {
          name: '2.4.9',
          level: 'AAA',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-link-only'
        }],
        related: ['C7', 'H30'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H33',
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
    let trimTitle: string | undefined;
    let title = element.getElementAttribute('title');
    if (title)
      trimTitle = title.trim();
    const text = element.getElementText();

    if (!trimTitle || trimTitle === "") {
      evaluation.verdict = 'inapplicable';
      evaluation.description = `The element's title attribute is empty`;
      evaluation.resultCode = 'RC1';
    } else if (text &&  trimTitle === text.trim()) {
      evaluation.verdict = 'failed';
      evaluation.description = `The element contains a title attribute equal to the text in the link`;
      evaluation.resultCode = 'RC2';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = `Please verify that the element's title attribute describes correctly the link`;
      evaluation.resultCode = 'RC3';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T33;
