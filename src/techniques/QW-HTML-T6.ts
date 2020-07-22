'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { ElementExists, ElementHasAttributes } from '../lib/decorators';
import { QWElement } from "@qualweb/qw-element";
import { DomUtils, AccessibilityUtils } from '@qualweb/util';
import { QWPage } from '@qualweb/qw-page';
import { Dom } from '@qualweb/dom';

class QW_HTML_T6 extends Technique {

  constructor() {
    super({
      name: 'Using both keyboard and other device-specific functions',
      code: 'QW-HTML-T6',
      mapping: 'SCR20',
      description: 'The objective of this technique is to verify the parity of keyboard-specific and mouse-specific events when code that has a scripting function associated with an event is used',
      metadata: {
        target: {
          element: '*',
          attributes: ['onmousedown', 'onmouseup', 'onclick', 'onmouseover', 'onmouseout']
        },
        'success-criteria': [{
          name: '2.1.1',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
        }],
        related: ['G90'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  @ElementExists 
  @ElementHasAttributes
  execute(element: QWElement,page:QWPage): void {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const hasOnmousedown = element.elementHasAttribute('onmousedown');
    const onmousedown = element.getElementAttribute('onmousedown');
    const onkeydown = element.getElementAttribute('onkeydown');

    const hasOnmouseup = element.elementHasAttribute('onmouseup');
    const onmouseup = element.getElementAttribute('onmouseup');
    const onkeyup = element.getElementAttribute('onkeyup');
    
    const hasOnclick = element.elementHasAttribute('onclick');
    const onclick = element.getElementAttribute('onclick');
    const onkeypress = element.getElementAttribute('onkeypress');

    const hasOnmouseover = element.elementHasAttribute('onmouseover');
    const onmouseover = element.getElementAttribute('onmouseover');
    const onfocus = element.getElementAttribute('onfocus');

    const hasOnmouseout = element.elementHasAttribute('onmouseout');
    const onmouseout = element.getElementAttribute('onmouseout');
    const onblur = element.getElementAttribute('onblur');

    let isWidget = AccessibilityUtils.isElementWidget(element,page);

    if (hasOnmousedown && onmousedown !== onkeydown) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mousedown attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC1';
    } else if (hasOnmouseup && onmouseup !== onkeyup) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseup attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC2';
    } else if (hasOnclick && onclick !== onkeypress && !isWidget) {
      evaluation.verdict = 'failed';
      evaluation.description = `The click attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC3';
    } else if (hasOnmouseover && onmouseover !== onfocus) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseover attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC4';
    } else if (hasOnmouseout && onmouseout !== onblur) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseout attribute doesn't have a keyboard equivalent`;
      evaluation.resultCode = 'RC5';
    } else {
      evaluation.verdict = 'passed';
      evaluation.description = `All the mouse event handlers have a keyboard equivalent`;
      evaluation.resultCode = 'RC6';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T6;
