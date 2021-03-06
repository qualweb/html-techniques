'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import intersection from 'lodash.intersection';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T22 extends Technique {

  constructor() {
    super({
      name: 'Separating information and structure from presentation to enable different presentations',
      code: 'QW-HTML-T22',
      mapping: 'G140',
      description: 'This technique checks that no attributes are being used to control the visual text presentation',
      metadata: {
        target: {
          attributes: ['text', 'vlink', 'alink', 'link']
        },
        'success-criteria': [{
            name: '1.3.1',
            level: 'A',
            principle: 'Perceivable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
          },
          {
            name: '1.4.5',
            level: 'AA',
            principle: 'Perceivable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/images-of-text'
          },
          {
            name: '1.4.9',
            level: 'AAA',
            principle: 'Perceivable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/images-of-text-no-exception'
          }
        ],
        related: ['C29'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G140',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  execute(element: QWElement | undefined): void {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element === undefined) {
      evaluation.verdict = 'passed';
      evaluation.description = `The webpage does not use attributes to control the visual text presentation`;
      evaluation.resultCode = 'RC1';
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `The webpage uses attributes in ${element.getElementTagName()} element to control the visual text presentation`;
      evaluation.resultCode = 'RC2';

      const hasAttributes = element.elementHasAttributes();
      const attributes = element.getElementAttributesName();

      evaluation.attributes = hasAttributes ? intersection(attributes, ['text', 'vlink', 'alink', 'link']) : undefined;
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T22;
