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

const technique: HTMLTechnique = {
  name: 'Using alt attributes on images used as submit buttons',
  code: 'QW-HTML-T5',
  mapping: 'H36',
  description: 'This technique checks all input elements that are buttons use alt text',
  metadata: {
    target: {
      element: 'input '
    },
    'success-criteria': [{
      name: '1.1.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
    }
    ],
    related: ['G94'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H36',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

function getTechniqueMapping(): string {
  return technique.mapping;
}

function hasPrincipleAndLevels(principles: string[], levels: string[]): boolean {
  let has = false;
  for (const sc of technique.metadata['success-criteria'] || []) {
    if (principles.includes(sc.principle) && levels.includes(sc.level)) {
      has = true;
    }
  }
  return has;
}



async function execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise < void > {

  if (element === undefined) {
    return;
  }
  else{

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (verifyAlt(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The alt does not exist in the input element';
      evaluation.resultCode = 'RC1';
      technique.metadata.failed++;
    }
    if (verifyAltContent(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The alt is empty';
      evaluation.resultCode = 'RC2';
      technique.metadata.failed++;

    }
    if (technique.metadata.failed === 0) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the alt is a valid description of the input image';
      evaluation.resultCode = 'RC3';
      technique.metadata.warning++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    technique.results.push(_.clone(evaluation));
  }

}

function verifyAlt(elem){
  return (elem.attribs['alt'] === undefined);
}

function verifyAltContent(elem){
  return (elem.atribs['alt'] !== undefined)? elem.atribs['alt'].trim(): true;

}


function getFinalResults() {
  outcomeTechnique();
  return _.cloneDeep(technique);
}

function reset(): void {
  technique.metadata.passed = 0;
  technique.metadata.warning = 0;
  technique.metadata.failed = 0;
  technique.metadata.inapplicable = 0;
  technique.results = new Array<HTMLTechniqueResult>();
}

function outcomeTechnique(): void {
  if (technique.metadata.failed > 0) {
    technique.metadata.outcome = 'failed';
  } else if (technique.metadata.warning > 0) {
    technique.metadata.outcome = 'warning';
  } else if (technique.metadata.passed > 0) {
    technique.metadata.outcome = 'passed';
  } else {
    technique.metadata.outcome = 'inapplicable';
  }

  if (technique.results.length > 0) {
    addDescription();
  }
}

function addDescription(): void {
  for (const result of technique.results || []) {
    if (result.verdict === technique.metadata.outcome) {
      technique.metadata.description = <string> result.description;
      break;
    }
  }
}

export {
  getTechniqueMapping,
  hasPrincipleAndLevels,
  execute,
  getFinalResults,
  reset
};
