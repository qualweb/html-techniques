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
        name: '2.2.1',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
      }
    ],
    related: [ 'SCR20'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F54',
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
      evaluation.verdict = 'warning';
      evaluation.description = `The mousedown attribute is used`;
      technique.metadata.warning++;
    } else if (element.attribs["onmouseup"]) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseup attribute is used`;
      technique.metadata.warning++;
    } else if (element.attribs["onclick"]) {
      evaluation.verdict = 'warning';
      evaluation.description = `The click attribute is used`;
      technique.metadata.warning++;
    } else if (element.attribs["onmouseover"] ) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseover attribute is used`;
      technique.metadata.warning++;
    } else if (element.attribs["onmouseout"] ) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseout attribute is used`;
      technique.metadata.warning++;
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