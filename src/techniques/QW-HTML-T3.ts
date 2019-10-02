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
  name: 'Providing a description for groups of form controls using fieldset and legend elements',
  code: 'QW-HTML-T3',
  mapping: 'H71',
  description: 'This technique checks the correct use of the description element for form controls',
  metadata: {
    target: {
      element: 'fieldset'
    },
    'success-criteria': [{
      name: '1.3.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
    },
      {
      name: '3.3.2',
      level: 'A',
      principle: 'Understandable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions'
    },
    ],
    related: ['H44', 'H65'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H71',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T3 extends Technique {

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

    if (!verifyFormControl(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The fieldset is not in a form control';
      evaluation.resultCode = 'RC1';
    }
    if (!verifyLegendExistence(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend does not exist in the fieldset element';
      evaluation.resultCode = 'RC2';

    }
    if (verifyLegendContent(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend is empty';
      evaluation.resultCode = 'RC3';
    }
    if (technique.metadata.failed == 0) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the legend description is valid';
      evaluation.resultCode = 'RC4';
    }


    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    super.addEvaluationResult(evaluation);

}}

function verifyFormControl(elem){
  return elem.parent.name === 'form';

}

function verifyLegendExistence(elem){
  const childs = elem.children;
  for (let i = 0; i < childs.length; i++){
    if(childs[i] !== undefined && childs[i].name !== undefined){
      return childs[i].name === 'legend'
    }
  }
  return false;
}

function verifyLegendContent(elem){
  const children = elem.children;
  if(children !== undefined) {
    for (let i = 0; i < children.length; i++) {
      if (children[i] !== undefined && children[i].name === 'legend' && children[i].children.length > 0 && children[i].children[0].data !== undefined) {
        return children[i].children[0].data.trim() === '';
      }
    }
  }
  return true;
}

  export = QW_HTML_T3;

