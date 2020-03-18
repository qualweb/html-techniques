'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

class QW_HTML_T24 extends Technique {

  constructor() {
    super({
      name: 'Providing descriptive titles for Web pages',
      code: 'QW-HTML-T24',
      mapping: 'G88',
      description: 'This technique checks the title of a web page',
      metadata: {
        target: {
          element: 'title'
        },
        'success-criteria': [{
          name: '2.4.2',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
        }],
        related: ['H25'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G88.html',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: '',
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  async execute(element: ElementHandle | undefined): Promise < void > {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };
    const text = await DomUtils.getElementText(element);

    if (text) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the title describes the page correctly.';
      evaluation.resultCode = 'RC1';
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = 'The title is empty';
      evaluation.resultCode = 'RC2';
    }
    
    await super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T24;