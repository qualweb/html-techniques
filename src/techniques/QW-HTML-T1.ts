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
    related: ['G91', 'H30'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H24.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T1 extends Technique {

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

    if (element.attribs === undefined) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain an alt attribute`;
    } else if (element.attribs['alt'] === undefined) { // fails if the element doesn't contain an alt attribute
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain an alt attribute`;
    } else if (element.attribs['alt'] === '') { // fails if the element's alt attribute value is empty
      evaluation.verdict = 'failed';
      evaluation.description = `The element's alt attribute value is empty`;
    } else { // the element contains an non-empty alt attribute, and it's value needs to be verified
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify the alt attribute value describes correctly the correspondent area of the image';
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);


    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T1;
