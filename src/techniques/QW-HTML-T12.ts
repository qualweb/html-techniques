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
  name: 'Failure of Success Criterion 2.2.1, 2.2.4, and 3.2.5 due to using meta refresh to reload the page',
  code: 'QW-HTML-T12',
  mapping: 'F41',
  description: 'meta http-equiv of refresh is often used to periodically refresh pages or to redirect users to another page. If the time interval is too short, and there is no way to turn auto-refresh off, people who are blind will not have enough time to make their screen readers read the page before the page refreshes unexpectedly and causes the screen reader to begin reading at the top. Sighted users may also be disoriented by the unexpected refresh.',
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
      },
      {
        name: '3.2.5',
        level: 'AAA',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/change-on-request'
      }
    ],
    related: [],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F41',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
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

async function execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

  if (element === undefined) {
    return;
  }

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: ''
  };

  if (element !== undefined) {
    if (element.attribs !== undefined) { // always true
      let content = element.attribs["content"];
      let intContent = parseInt(content);
      console.log(content);
      console.log(intContent);
      console.log(content.includes('url'));
      if (content.includes('url')) {
        // meta refresh with url is a redirect
      } else if (intContent > 0 && intContent <= 72000) {
        evaluation.verdict = 'failed';
        evaluation.description = 'Time interval to refresh is between 1 and 72000 seconds';
        technique.metadata.failed++;
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = `Meta refresh time interval is correctly used`;
        technique.metadata.warning++;
      }
      evaluation.code = transform_element_into_html(element);
      evaluation.pointer = getElementSelector(element);
    }
  } else {
    // refresh element doesn't exist
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
