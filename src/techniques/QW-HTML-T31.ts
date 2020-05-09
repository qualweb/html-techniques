'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T31 extends Technique {

  constructor() {
    super({
      name: 'Using longdesc',
      code: 'QW-HTML-T31',
      mapping: 'H45',
      description: 'The objective of this technique is to provide information in a file designated by the longdesc attribute when a short text alternative does not adequately convey the function or information provided in the image',
      metadata: {
        target: {
          element: 'img'
        },
        "success-criteria": [{
          name: '1.1.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
        }],
        related: ['G73', 'G74', 'G92', 'G94'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H45',
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

    const longdesc = element.getElementAttribute('longdesc');

    if (longdesc === null) { // fails if the element doesn't contain a longdesc attribute
      evaluation['verdict'] = 'failed';
      evaluation['description'] = `The image does not contain a longdesc attribute`;
      evaluation.resultCode = 'RC1';
    } else if (longdesc.trim() === '') { // fails if the element's longdesc attribute is empty
      evaluation['verdict'] = 'failed';
      evaluation['description'] = `The longdesc attribute is empty`;
      evaluation.resultCode = 'RC2';
    } else {
      if (longdesc.includes('#')) {
        const i = longdesc.indexOf('#');
        let id;

        if (i > 0) {
          id = longdesc.split('#')[1];
        } else {
          id = longdesc;
        }

        const exists = page.getElementByID(id, element);

        if (exists) { // the element has a longdesc attribute pointing to a resource in the current page
          evaluation.verdict = 'warning';
          evaluation.description = 'Please verify that the resource the longdesc is pointing at describes correctly the image';
          evaluation.resultCode = 'RC3';
        } else { // fails if the element that the longdesc is pointing at doesn't exist
          evaluation.verdict = 'failed';
          evaluation.description = `The resource that longdesc is pointing at does not exist`;
          evaluation.resultCode = 'RC4';
        }
      } else { // the element has a longdesc attribute pointing to a resource outside the current page
        //var res = request('GET', longdesc);
        evaluation.verdict = 'warning';
        evaluation.description = 'Please verify that the resource the longdesc is pointing at exists and describes correctly the image';
        evaluation.resultCode = 'RC5';
      }
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T31;
