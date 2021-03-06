'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T37 extends Technique {

  constructor() {
    super({
      name: 'Adding a link at the beginning of a block of repeated content to go to the end of the block',
      code: 'QW-HTML-T37',
      mapping: 'G123',
      description: 'The objective of this technique is to provide a mechanism to bypass a block of material by skipping to the end of the block.',
      metadata: {
        target: {
          element: 'a',
          attributes: 'href'
        },
        'success-criteria': [{
          name: '2.4.1',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks'
        }],
        related: ['G1', 'G124'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G123',
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

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (!element) {
      evaluation.verdict = 'failed';
      evaluation.description = `This page does not have links`;
      evaluation.resultCode = 'RC1';
    } else {

      const refElement = DomUtils.getElementReferencedByHREF(page, element);

      if (refElement) {
          evaluation.verdict = 'warning';
          evaluation.description = 'This link skips a content block';
          evaluation.resultCode = 'RC2';
      } else {
        evaluation.verdict = 'inapplicable';
        evaluation.description = `This link is not used to skip a content block`;
        evaluation.resultCode = 'RC4';
      }

      super.addEvaluationResult(evaluation, element);
    }
  }
}

export = QW_HTML_T37;
