'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from "./Technique.object";

const technique: HTMLTechnique = {
  name: 'Using the title attribute of the frame and iframe elements',
  code: 'QW-HTML-T10',
  mapping: 'H64',
  description: 'The objective of this technique is to demonstrate the use of the title attribute of the frame or iframe element to describe the contents of each frame',
  metadata: {
    target: {
      element: 'frame, iframe'
    },
    'success-criteria': [{
      name: '2.4.1',
      level: 'A',
      principle: 'Operable',
      url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html'
    },
      {
        name: '4.1.2',
        level: 'A',
        principle: 'Robust',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html'
      }
    ],
    related: [],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H64.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T10 extends Technique {

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
    resultCode: ''
  };

  //1. Check each frame and iframe element in the HTML or XHTML
  //source code for the presence of a title attribute.
  // 2. Check that the title attribute contains text that identifies the frame.
  if (element.attribs && element.attribs['title'] !== undefined) {
    if (element.attribs['title'] !== '') {
      evaluation.verdict = 'warning';
      evaluation.description = 'Verify if title attribute contains text that identifies the frame';
      technique.metadata.warning++;
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = 'Title attribute is empty';
      technique.metadata.failed++;
    }
  } else {
    evaluation.verdict = 'failed';
    evaluation.description = 'frame or iframe doesn\'t have title attribute';
    technique.metadata.failed++;
  }

  evaluation.htmlCode = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

  super.addEvaluationResult(evaluation);
}}

export = QW_HTML_T10;


