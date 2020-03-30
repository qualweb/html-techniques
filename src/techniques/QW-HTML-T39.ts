'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle, Page } from 'puppeteer';
import { DomUtils, AccessibilityUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

class QW_HTML_T39 extends Technique {

  constructor() {
    super({
      name: 'Accessible name on img and svg elements',
      code: 'QW-HTML-T39',
      mapping: 'H37',
      description: 'When using the img or the svg element, specify a short text alternative with the correct atribute (alt,title) or element (title,desc).". ',
      metadata: {
        target: {
          element: 'svg,img'
        },
        'success-criteria': [{
          name: '1.1.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
        }],
        related: ['G82', 'H2', 'H24', 'H45', 'H30'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H37',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  async execute(element: ElementHandle | undefined, page: Page): Promise<void> {

    if (element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let AName, alt, role,inAT;
    let name = await DomUtils.getElementTagName(element);
    if (name === "img") {
      alt = await DomUtils.getElementAttribute(element, 'alt');
      role = await DomUtils.getElementAttribute(element, 'role');
      inAT = await AccessibilityUtils.isElementInAT(element,page);
      AName = await AccessibilityUtils.getAccessibleName(element, page);
    } else {
      AName = await AccessibilityUtils.getAccessibleNameSVG(element, page);
    }
    if (name === "img" && role === "none" || role === "presentation" || alt === "") {
      //inapplicable (presentation)
    } else {
      if (!inAT||!AName || AName.trim() === "") {
        evaluation.verdict = 'failed';
        evaluation.description = `The image doesnt have a valid accessible name`;
        evaluation.resultCode = 'RC1';
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify that the element's accessible describes  the image correctly`;
        evaluation.resultCode = 'RC2';
      }

      await super.addEvaluationResult(evaluation, element);
    }
  }
}

export = QW_HTML_T39;
