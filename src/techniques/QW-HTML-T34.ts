'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { AccessibilityUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T34 extends Technique {

  constructor() {
    super({
      name: 'Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to not providing an accessible name for an image which is the only content in a link',
      code: 'QW-HTML-T34',
      mapping: 'F89',
      description: 'This technique checks the text alternative of images which are the only content of a link',
      metadata: {
        target: {
          parent: 'a',
          element: 'img'
        },
        'success-criteria': [
          {
            name: '2.4.4',
            level: 'A',
            principle: 'Operable',
            url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-refs.html'
          },
          {
            name: '2.4.9',
            level: 'AAA',
            principle: 'Operable',
            url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-link.html'
          },
          {
            name:'4.1.2',
            level:'A',
            principle:'Robust',
            url:'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value'
          }
        ],
        related: ['H2', 'H30','ARIA7','ARIA8'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F89',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult> ()
    });
  }

  execute(element: QWElement | undefined, page: QWPage): void {
    if (element === undefined||!(element.elementHasAttributes())) {
      return;
    }
    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let img = element.getElement("img");
    let aText = element.getElementText();

    if (aText !== undefined && aText.trim()!==""||!img) {

    }else if (AccessibilityUtils.getAccessibleName(element,page)) {
      evaluation['verdict'] = 'passed';
      evaluation['description'] = `The link has an accessible name`;
    } else {
      evaluation['verdict'] = 'failed';
      evaluation['description'] = `The image doesn't have an accessible name`;
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T34;
