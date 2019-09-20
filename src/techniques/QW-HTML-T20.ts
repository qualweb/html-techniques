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

class QW_HTML_T20 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined||!element.attribs) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element.attribs["onmousedown"]) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mousedown attribute is used`;
      technique.metadata.failed++;
    } else if (element.attribs["onmouseup"]) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseup attribute is used`;
      technique.metadata.failed++;
    } else if (element.attribs["onclick"]) {
      evaluation.verdict = 'failed';
      evaluation.description = `The click attribute is used`;
      technique.metadata.failed++;
    } else if (element.attribs["onmouseover"] ) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseover attribute is used`;
      technique.metadata.failed++;
    } else if (element.attribs["onmouseout"] ) {
      evaluation.verdict = 'failed';
      evaluation.description = `The mouseout attribute is used`;
      technique.metadata.failed++;
    } else {
      evaluation.verdict = 'passed';
      evaluation.description = `No mouse specific event handlers are used`;
      technique.metadata.passed++;
  
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T20;