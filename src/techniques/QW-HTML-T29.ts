'use strict';

import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';

import {
  DomUtils
} from '@qualweb/util';

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
      name: '2.2.1',
      level: 'A',
      principle: 'Operable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
    }],
    related: ['SCR20'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F54',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array < HTMLTechniqueResult > ()
};

class QW_HTML_T29 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined): Promise < void > {

    if (element === undefined || !element.attribs) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (element.attribs['onmousedown']) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mousedown attribute is used`;
      evaluation.resultCode = 'RC1';
    } else if (element.attribs['onmouseup']) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseup attribute is used`;
      evaluation.resultCode = 'RC2';
    } else if (element.attribs['onclick']) {
      evaluation.verdict = 'warning';
      evaluation.description = `The click attribute is used`;
      evaluation.resultCode = 'RC3';
    } else if (element.attribs['onmouseover']) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseover attribute is used`;
      evaluation.resultCode = 'RC4';
    } else if (element.attribs['onmouseout']) {
      evaluation.verdict = 'warning';
      evaluation.description = `The mouseout attribute is used`;
      evaluation.resultCode = 'RC5';
    } else {
      evaluation.verdict = 'passed';
      evaluation.description = `No mouse specific event handlers are used`;
      evaluation.resultCode = 'RC6';
    }

    evaluation.htmlCode = DomUtils.transformElementIntoHtml(element);
    evaluation.pointer = DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T29;