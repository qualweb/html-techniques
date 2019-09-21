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
import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Providing text alternatives for the area elements of image maps',
  code: 'QW-HTML-T1',
  mapping: 'H24',
  description: 'This technique checks the text alternative of area elements of images maps',
  metadata: {
    target: {
      'parent-sibling': 'img',
      parent: 'map',
      element: 'area'
    },
    'success-criteria': [
    {
      name: '2.4.5',
      level: 'AA',
      principle: 'Operable',
      url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/navigation-mechanisms-mult-loc.html'
    },
    {
      name: '2.4.8',
      level: 'AAA',
      principle: 'Operable',
      url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/navigation-mechanisms-location.html'
    }
    ],
    related: ['G1','G63','G64', 'G123'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H59.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T19 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (!element || !element.parent) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };
    let parentName = element.parent["name"];

    if (parentName != "head") {
      evaluation.verdict = 'failed';
      evaluation.description = `The element is not contained in the head element`;
      technique.metadata.failed++;
    }
    else if (!element.attribs) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain a rel or an href attribute`;
      technique.metadata.failed++;
    } else {
      let rel = element.attribs["rel"];
      let href = element.attribs["href"];

      if (!rel) {
        evaluation.verdict = 'warning';
        evaluation.description = `The element doesn't contain a rel attribute check if this element pertains navigation `;
        technique.metadata.warning++;
      } else if (!href) {
        evaluation.verdict = 'warning';
        evaluation.description = `The element doesn't contain an href attribute check if this element pertains navigation`;
        technique.metadata.warning++;
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = 'The element contains a rel and an href attribute that should be manually verified';
        technique.metadata.warning++;

      }

    }
    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);


    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T19;