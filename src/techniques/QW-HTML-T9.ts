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
const stew = new(require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Organizing a page using headings',
  code: 'QW-HTML-T9',
  mapping: 'G141',
  description: 'The objective of this technique is to ensure that sections have headings that identify them and that the heading are used in the correct order',
  metadata: {
    target: {
      element: 'h1,h2,h3,h4,h5,h6'
    },
    'success-criteria': [{
      name: '1.3.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
    },
      {
        name: '2.4.10',
        level: 'AAA',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/section-headings'
      }
    ],
    related: ['G91', 'H30'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G141',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T9 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined || element.children === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let regexp = new RegExp('^h[1-6]$');
    let name;
    let list: number[] = [];
    let split;

    for (let child of element.children) {
      name = child["name"];
      if (name !== undefined && regexp.test(name)) {
        split = name.split("h");
        list.push(split[1]);
      }
    }

    if (list.length === 0) {
      return; // no heading elements
    }

    let sortedArray: number[] = list.sort((n1, n2) => n1 - n2);
    let equal = true;
    let complete = true;
    let startsWithOne = (sortedArray[0]-1)=== 0;
    let hasH1= stew.select(processedHTML, 'h1').length>0;

    for (let i = 0; i < list.length; i++) {
      if (list[i] !== sortedArray[i])
        equal = false;
      if (i > 0 && i - 1 < list.length && sortedArray[i] - sortedArray[i - 1] > 1) {
        complete = false;
      }
    }

    if (!equal) { // fails if the headings aren't in the correct order
      evaluation.verdict = 'failed';
      evaluation.description = `Headings are not in the correct order`;
      evaluation.resultCode = 'RC1';
    } else if (!complete) { // fails if a header number is missing
      evaluation.verdict = 'failed';
      evaluation.description = `Heading number is missing`;
      evaluation.resultCode = 'RC2';
    } else if(!startsWithOne && !hasH1){
      evaluation.verdict = 'failed';
      evaluation.description = 'Headings dont start with h1';
      evaluation.resultCode = 'RC3';
    }else { // the heading elements are correctly used
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that headers are used to divide the page correctly';
      evaluation.resultCode = 'RC4';
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T9;
