'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { HTMLTechnique } from '../lib/decorators';
import { QWElement } from "@qualweb/qw-element";

@HTMLTechnique
class QW_HTML_T23 extends Technique {

  constructor(technique?: any) {
    super(technique);
  }

  execute(element: QWElement | undefined): void {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element) {
      const href = element.getElementAttribute('href');
      console.log(href);

      if (href) {
        evaluation.verdict = 'warning';
        evaluation.description = `Check whether the link leads to related information`;
        evaluation.resultCode = 'RC1';
      }
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = `The webpage doesn't have any links`;
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T23;
