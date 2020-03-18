'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

class QW_HTML_T29 extends Technique {

  constructor() {
    super({
      name: 'Failure of Success Criterion 2.1.1 due to using only pointing-device-specific event handlers (including gesture) for a function ',
      code: 'QW-HTML-T29',
      mapping: 'F54',
      description: 'This technique counts the number of mouse specific events',
      metadata: {
        target: {
          'parent-sibling': 'img',
          parent: 'map',
          element: 'area'
        },
        'success-criteria': [{
          name: '2.2.1',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
        }],
        related: ['SCR20'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F54',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  async execute(element: ElementHandle | undefined): Promise < void > {

    if (!element || !(await DomUtils.elementHasAttributes(element))) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const hasOnmousedown = await DomUtils.elementHasAttribute(element, 'onmousedown');
    const hasOnmouseup = await DomUtils.elementHasAttribute(element, 'onmouseup');
    const hasOnclick = await DomUtils.elementHasAttribute(element, 'onclick');
    const hasOnmouseover = await DomUtils.elementHasAttribute(element, 'onmouseover');
    const hasOnmouseout = await DomUtils.elementHasAttribute(element, 'onmouseout');

    if (hasOnmousedown) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mousedown attribute is used`;
      evaluation.resultCode = 'RC1';
    } else if (hasOnmouseup) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseup attribute is used`;
      evaluation.resultCode = 'RC2';
    } else if (hasOnclick) {
      evaluation.verdict = 'warning';
      evaluation.description = `The click attribute is used`;
      evaluation.resultCode = 'RC3';
    } else if (hasOnmouseover) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseover attribute is used`;
      evaluation.resultCode = 'RC4';
    } else if (hasOnmouseout) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseout attribute is used`;
      evaluation.resultCode = 'RC5';
    }

    await super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T29;
