'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement,DomUtils
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from "./Technique.object";

const technique: HTMLTechnique = {
  name: 'Providing text alternatives on applet elements',
  code: 'QW-HTML-T14',
  mapping: 'H35',
  description: 'Provide a text alternative for an applet by using the alt attribute to label an applet and providing the text alternative in the body of the applet element. In this technique, both mechanisms are required due to the varying support of the alt attribute and applet body text by user agents.',
  metadata: {
    'target': {
      element: 'applet'
    },
    'success-criteria': [
      {
        name: '1.1.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/text-equiv-all.html'
      }
    ],
    related: ['G94'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H35.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};


class QW_HTML_T14 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

  if (element === undefined) {
    return;
  }

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: '',
    resultCode:''
  };

  if (!element.attribs || element.attribs['alt'] === undefined) { // fails if the element doesn't contain an alt attribute
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an alt attribute`;
    technique.metadata.failed++;
  }
  else if (element.attribs['alt'] === '') { // fails if the element's alt attribute is empty
    evaluation.verdict = 'failed';
    evaluation.description = `The element's alt attribute is empty`;
    technique.metadata.failed++;
  } else {

      let has_text = DomUtils.getText(element);

      if (has_text) { // the element contains a non empty alt attribute and a text in his body
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify that the element's alt attribute value and his body text describes correctly the element`;
        technique.metadata.warning++;
      } else { // fails if the element doesn't contain a text in the body
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain a text in his body`;
        technique.metadata.failed++;
      }
    }
  

  evaluation.htmlCode = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T14;

