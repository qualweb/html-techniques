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
  name: 'Failure due to using meta redirect with a time limit',
  code: 'QW-HTML-T18',
  mapping: 'F40',
  description: 'meta http-equiv of {time-out}; url=... is often used to automatically redirect users. When this occurs after a time delay, it is an unexpected change of context that may interrupt the user. It is acceptable to use the meta element to create a redirect when the time-out is set to zero, since the redirect is instant and will not be perceived as a change of context. However, it is preferable to use server-side methods to accomplish this.',
  metadata: {
    target: {
      element: 'meta'
    },
    'success-criteria': [{
        name: '2.2.1',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable'
      },
      {
        name: '2.2.4',
        level: 'AAA',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/interruptions'
      }
    ],
    related: ['SVR1', 'H76'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F40',
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

  if (element !== undefined) {
    if(element.attribs !== undefined) { // always true
      let contentSeconds = parseInt((element.attribs["content"]).split(";")[0]);
      if (contentSeconds <= 72000 && contentSeconds >= 1) {
        evaluation.verdict = 'failed';
        evaluation.description = 'Time interval to redirect is between 1 and 72000 seconds';
        technique.metadata.failed++;
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = `Meta redirect time interval is correctly used`;
        technique.metadata.warning++;
      }
      evaluation.code = transform_element_into_html(element);
      evaluation.pointer = getElementSelector(element);
    }
  } else { // success if refresh element doesn't exist
    evaluation.verdict = 'inapplicable';
    evaluation.description = `Meta redirect is not used`;
    technique.metadata.inapplicable++;
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
