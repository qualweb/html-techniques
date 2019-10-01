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
    code: 'QW-HTML-T7',
    mapping: 'H28',
    description: 'This technique checks the text alternative of area elements of images maps',
    metadata: {
        target: {
            element: 'abbr'
        },
        'success-criteria': [{
            name: '3.1.4',
            level: 'AAA',
            principle: 'Understandable',
            url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-located.html'
        }
        ],
        related: ['G91', 'H30'],
        url: 'https://www.w3.org/TR/WCAG20-TECHS/H28.html',
        passed: 0,
        warning: 0,
        failed: 0,
        inapplicable: 0,
        outcome: '',
        description: ''
    },
    results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T7 extends Technique {

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

 
    if(element.attribs === undefined){
        evaluation.verdict = 'failed';
        evaluation.description = `The element abbrv doesnt have the definition in the title attribute`;
        technique.metadata.failed++;
    }
    else if (element.attribs["title"] !== undefined && element.attribs["title"] !== "") {
        evaluation.verdict = 'passed';
        evaluation.description = `The element abbrv has the definition in the title attribute`;
        technique.metadata.passed++;
    }else{
        evaluation.verdict = 'failed';
        evaluation.description = `The element abbrv doesnt have the definition in the title attribute`;
        technique.metadata.failed++;

    }
    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T7;

