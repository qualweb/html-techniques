'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

class QW_HTML_T28 extends Technique {

  constructor() {
    super({
      name: 'Using ol, ul and dl for lists or groups of links',
      code: 'QW-HTML-T28',
      mapping: 'H48',
      description: 'The objective of this technique is to create lists of related items using list elements appropriate for their purposes',
      metadata: {
        target: {
          element: ['li', 'dd', 'dt']
        },
        'success-criteria': [{
          name: '1.3.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
        }],
        related: ['H40'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H48',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array < HTMLTechniqueResult > ()
    });
  }

  async execute(element: ElementHandle | undefined): Promise < void > {

    if (!element || !await DomUtils.getElementParent(element)) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const hasLi = (await element.$$('li')).length !== 0;
    const hasDd = (await element.$$('dd')).length !== 0;
    const hasDt = (await element.$$('dt')).length !== 0;

    const name = await DomUtils.getElementTagName(element);

    if (hasLi && name === 'ul') { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'warning';
      evaluation.description = 'Check that content that has the visual appearance of a list (with or without bullets) is marked as an unordered list';
      evaluation.resultCode = 'RC1';
    } else if (hasLi && name === 'ol') {
      evaluation.verdict = 'warning';
      evaluation.description = 'Check that content that has the visual appearance of a numbered list is marked as an ordered list.';
      evaluation.resultCode = 'RC2';
    } else if (name === 'dl' && (hasDt || hasDd)) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Check that content is marked as a definition list when terms and their definitions are presented in the form of a list.';
      evaluation.resultCode = 'RC3';
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `A list item is not contained in a correct list element`;
      evaluation.resultCode = 'RC4';
    }

    await super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T28;