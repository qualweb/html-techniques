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
  name: 'Providing text alternatives on applet elements',
  code: 'QW-HTML-T14',
  mapping: 'H35',
  description: 'Provide a text alternative for an applet by using the alt attribute to label an applet and providing the text alternative in the body of the applet element. In this technique, both mechanisms are required due to the varying support of the alt attribute and applet body text by user agents.',
  metadata: {
    'target': {
      element: 'applet'
    },
    'success-criteria': [
      {
        name: '1.1.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/text-equiv-all.html'
      }
    ],
    related: ['G94'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H35.html',
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
    description: ''
  };

  if (!element.attribs || element.attribs['alt'] === undefined) { // fails if the element doesn't contain an alt attribute
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an alt attribute`;
    technique.metadata.failed++;
  }
  else if (element.attribs['alt'] === '') { // fails if the element's alt attribute is empty
    evaluation.verdict = 'failed';
    evaluation.description = `The element's alt attribute is empty`;
    technique.metadata.failed++;
  } else {
    if (element.children) {
      let has_text = false;

      for (let i = 0 ; i < _.size(element.children) ; i++) {
        let child = element.children[i];
        if (child['type'] === 'text' && _.trim(child['data']) !== '') {
          has_text = true;
          break;
        }
      }

      if (has_text) { // the element contains a non empty alt attribute and a text in his body
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify that the element's alt attribute value and his body text describes correctly the element`;
        technique.metadata.warning++;
      } else { // fails if the element doesn't contain a text in the body
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain a text in his body`;
        technique.metadata.failed++;
      }
    }
    else { // fails if the element doesn't contain a text in the body
      evaluation.verdict = 'failed';
      evaluation.description = `The element doesn't contain a text in his body`;
      technique.metadata.failed++;
    }
  }

  evaluation.code = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

  technique.results.push(_.clone(evaluation));
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
      technique.metadata.description = result.description;
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
