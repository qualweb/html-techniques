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
  name: 'Failure of Success Criterion 2.2.2 due to using the blink element',
  code: 'QW-HTML-T16',
  mapping: 'F47',
  description: 'The blink element, while not part of the official HTML or XHTML specification, is supported by many user agents. It causes any text inside the element to blink at a predetermined rate. This cannot be interrupted by the user, nor can it be disabled as a preference. The blinking continues as long as the page is displayed. Therefore, content that uses blink fails the Success Criterion because blinking can continue for more than three seconds.',
  metadata: {
    target: {
      element: 'blink'
    },
    'success-criteria': [
      {
        name: '2.2.2',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/time-limits-pause.html'
      }
    ],
    related: [],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/F47.html',
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

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: ''
  };

  if (element !== undefined) {

    evaluation.verdict = 'failed';
    evaluation.description = 'Used blink element';
    technique.metadata.failed++;

    evaluation.code = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
  } else { // success if refresh element doesn't exist
    evaluation.verdict = 'passed';
    evaluation.description = `Blink is not used`;
    technique.metadata.passed++;
  }

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
