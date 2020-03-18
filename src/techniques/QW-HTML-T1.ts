'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { ElementHandle } from 'puppeteer';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';

import { HTMLTechnique, ElementExists } from '../lib/decorators';

@HTMLTechnique
class QW_HTML_T1 extends Technique {

  constructor(technique?: any) {
    super(technique);
  }

  @ElementExists
  async execute(element: ElementHandle): Promise<void> {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const alt = await DomUtils.getElementAttribute(element, 'alt');

    if (alt === null) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain an alt attribute`;
      evaluation.resultCode = 'RC1';
    } else if (alt.trim() === '') { // fails if the element's alt attribute value is empty
      evaluation.verdict = 'failed';
      evaluation.description = `The element's alt attribute value is empty`;
      evaluation.resultCode = 'RC2';
    } else { // the element contains an non-empty alt attribute, and it's value needs to be verified
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify the alt attribute value describes correctly the correspondent area of the image';
      evaluation.resultCode = 'RC3';
    }

    await super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T1;