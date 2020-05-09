'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T3 extends Technique {

  constructor() {
    super({
      name: 'Providing a description for groups of form controls using fieldset and legend elements',
      code: 'QW-HTML-T3',
      mapping: 'H71',
      description: 'This technique checks the correct use of the description element for form controls',
      metadata: {
        target: {
          element: 'fieldset'
        },
        'success-criteria': [{
            name: '1.3.1',
            level: 'A',
            principle: 'Perceivable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
          },
          {
            name: '3.3.2',
            level: 'A',
            principle: 'Understandable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions'
          },
        ],
        related: ['H44', 'H65'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H71',
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
    const formATT = element.getElementAttribute('form');
    
    let validFormAtt = new Array<any>();

    if(formATT){
      validFormAtt = page.getElements('form[id="' + validFormAtt + '"]');
    }

    const hasParent = element.elementHasParent('form');
    const hasChild = element.elementHasChild('legend');
    const childText = element.getElementChildTextContent('legend');

    if (!hasParent && validFormAtt.length === 0) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The fieldset is not in a form and is not referencing a form';
      evaluation.resultCode = 'RC1';
    } else if (!hasChild) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend does not exist in the fieldset element';
      evaluation.resultCode = 'RC2';
    } else if (childText && childText.trim() === '') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend is empty';
      evaluation.resultCode = 'RC3';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the legend description is valid';
      evaluation.resultCode = 'RC4';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T3;
