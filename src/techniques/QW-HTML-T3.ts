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
  name: 'Using the summary attribute of the table element to give an overview of data tables',
  code: 'QW-HTML-T3',
  mapping: 'H73',
  description: 'This technique checks the correcy use of the summary attribute for table elements',
  metadata: {
    target: {
      element: 'table'
    },
    'success-criteria': [{
      name: '1.3.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
    }
    ],
    related: ['H39', 'H51', 'F46'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H73',
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

    if (verifySummary(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The summary does not exist in the table element';
      evaluation.resultCode = 'RC1';
      technique.metadata.failed++;
    }
    if (verifySummaryContent(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The summary is empty';
      evaluation.resultCode = 'RC2';
      technique.metadata.failed++;

    }
    if (verifyCaptionDuplicate(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The caption is a duplicate of the summary';
      evaluation.resultCode = 'RC3';
      technique.metadata.failed++;
    }
    if (technique.metadata.failed === 0) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the summary is a valid description of the table';
      evaluation.resultCode = 'RC4';
      technique.metadata.warning++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    technique.results.push(_.clone(evaluation));
  }

}

  function verifySummary(elem){
    return elem.attribs['summary'] === undefined;
  }

  function verifySummaryContent(elem){
    return (elem.attribs['summary'] !== undefined)? elem.attribs['summary'].trim() === '' : true;
  }

  function verifyCaptionDuplicate(elem){
    let caption;
    if (elem.children !== undefined){
      for (let i = 0; i < elem.children.length; i++){
        if(elem.children[i].name === 'caption'){
          caption = elem.children[i];
        }
      }
    }
    if(caption !== undefined && caption.children.length > 0){
      return (elem.attribs['summary'] !== undefined)?
          (elem.attribs['summary']).replace(/\s+/g, '') === caption.children[0].data.replace(/\s+/g, ''): true;

    }
    else
      return false;

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
