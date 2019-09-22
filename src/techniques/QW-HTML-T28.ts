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
  name: 'Using ol, ul and dl for lists or groups of links',
  code: 'QW-HTML-T28',
  mapping: 'H48',
  description: 'This technique checks the text alternative of area elements of images maps',
  metadata: {
    target: {
      'parent-sibling': 'img',
      parent: 'map',
      element: 'area'
    },
    'success-criteria': [{
        name: '1.3.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-programmatic.html'
      }
    ],
    related: [ 'H40'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H48.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T28 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined||!element.parent) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };


    if (element.parent["name"] === "ul"&& element["name"]==="li") { // fails if the element doesn't contain an alt attribute
        evaluation['verdict'] = 'warning';
        evaluation['description'] = 'Check that content that has the visual appearance of a list (with or without bullets) is marked as an unordered list';
        technique['metadata']['warning']++;
    }else if(element.parent["name"] === "ol"&& element["name"]==="li"){
        evaluation['verdict'] = 'warning';
        evaluation['description'] = 'Check that content that has the visual appearance of a numbered list is marked as an ordered list.';
        technique['metadata']['warning']++;

    }else if(element.parent["name"] === "dl"&& (element["name"]==="dd"||element["name"]==="dt")) {
        evaluation['verdict'] = 'warning';
        evaluation['description'] = 'Check that content is marked as a definition list when terms and their definitions are presented in the form of a list.';
        technique['metadata']['warning']++;
    }else {
        evaluation['verdict'] = 'failed';
        evaluation['description'] = `The list item is not contained in a valid list`;
        technique['metadata']['failed']++;}


    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T28;