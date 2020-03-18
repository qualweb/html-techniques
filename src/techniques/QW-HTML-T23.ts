'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

import { HTMLTechnique } from '../lib/decorators';

@HTMLTechnique
class QW_HTML_T23 extends Technique {

  constructor(technique?: any) {
    super(technique);
  }

  async execute(element: ElementHandle | undefined): Promise<void> {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element) {
      const href = await DomUtils.getElementAttribute(element, 'href');

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

    await super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T23;