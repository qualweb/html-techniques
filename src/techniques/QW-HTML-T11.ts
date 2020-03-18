'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

class QW_HTML_T11 extends Technique {

  constructor() {
    super({
      name: 'Combining adjacent image and text links for the same resource',
      code: 'QW-HTML-T11',
      mapping: 'H2',
      description: 'The objective of this technique is to provide both text and iconic representations of links without making the web page more confusing or difficult for keyboard users or assistive technology users. Since different users finding text and icons more usable, providing both can improve the accessibility of the link.',
      metadata: {
        target: {
          element: 'a'
        },
        'success-criteria': [{
          name: '1.1.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv-all.html'
        },
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
        }
        ],
        related: ['G91', 'G94', 'H30', 'C9', 'F89'],
        url: 'https://www.w3.org/TR/WCAG20-TECHS/H2.html',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  async execute(element: ElementHandle | undefined): Promise<void> {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const images = await element.$$('img');

    const hasImage = images.length > 0;
    let hasNonEmptyAlt = false;
    let hasAlt = false;
    let equalAltText = false;

    for (const img of images || []) { // fails if the element doesn't contain an alt attribute
      if ((await DomUtils.elementHasAttribute(img, 'alt')) && !hasNonEmptyAlt && !equalAltText) {
        hasAlt = true;
        const alt = await DomUtils.getElementAttribute(img, 'alt');
        if (alt !== null) { 
          hasNonEmptyAlt = alt.trim() !== '';
          equalAltText = alt === await DomUtils.getElementText(element);
        }
      }
    }

    if (!hasImage || !hasAlt) {
      //inapplicable
    } else if (!hasNonEmptyAlt) {
      evaluation.verdict = 'passed';
      evaluation.description = `The a element contains an image that has an empty alt attribute`;
      evaluation.resultCode = 'RC1';
    } else if (equalAltText) {
      evaluation.verdict = 'failed';
      evaluation.description = `The element text is equal to img alternative text`;
      evaluation.resultCode = 'RC2';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = 'The a element contains an image that has an alt attribute that should be manually verified';
      evaluation.resultCode = 'RC3';
    }

    await super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T11;