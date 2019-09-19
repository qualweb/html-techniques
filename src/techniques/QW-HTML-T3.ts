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

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    if (!verifyFormControl(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The fieldset is not in a form control';
      evaluation.resultCode = 'RC1';
      technique.metadata.failed++;
    }
    if (!verifyLegendExistence(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend does not exist in the fieldset element';
      evaluation.resultCode = 'RC2';
      technique.metadata.failed++;

    }
    if (verifyLegendContent(element)) {
      evaluation.verdict = 'failed';
      evaluation.description = 'The legend is empty';
      evaluation.resultCode = 'RC3';
      technique.metadata.failed++;
    }
    if (technique.metadata.failed == 0) {
      evaluation.verdict = 'warning';
      evaluation.description = 'Please verify that the legend description is valid';
      evaluation.resultCode = 'RC4';
      technique.metadata.warning++;
    }


    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    technique.results.push(_.clone(evaluation));

}

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
