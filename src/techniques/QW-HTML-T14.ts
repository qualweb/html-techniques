'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T14 extends Technique {

  constructor() {
    super({
      name: 'Providing text alternatives on applet elements',
      code: 'QW-HTML-T14',
      mapping: 'H35',
      description: 'Provide a text alternative for an applet by using the alt attribute to label an applet and providing the text alternative in the body of the applet element. In this technique, both mechanisms are required due to the varying support of the alt attribute and applet body text by user agents.',
      metadata: {
        'target': {
          element: 'applet'
        },
        'success-criteria': [{
          name: '1.1.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
        }],
        related: ['G94'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H25',
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

    const hasAlt = element.elementHasAttribute('alt');
    const alt = element.getElementAttribute('alt');

    if (!hasAlt) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'failed';
      evaluation.description = `The applet element does not contain an alt attribute`;
      evaluation.resultCode = 'RC1';
    } else if (alt && alt.trim() === '') { // fails if the element's alt attribute is empty
      evaluation.verdict = 'failed';
      evaluation.description = `The applet element has an empty alt attribute`;
      evaluation.resultCode = 'RC2';
    } else {
      const text = element.getElementText();

      if (text !== undefined) { // the element contains a non empty alt attribute and a text in his body
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify that the values of the alt attribute and the body text correctly describe the applet element`;
        evaluation.resultCode = 'RC3';
      } else { // fails if the element doesn't contain a text in the body
        evaluation.verdict = 'failed';
        evaluation.description = `The applet element does not contain alternative text in its body`;
        evaluation.resultCode = 'RC4';
      }
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T14;
