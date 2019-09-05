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
  name: 'Using the title attribute of the frame and iframe elements',
  code: 'QW-HTML-T10',
  mapping: 'H64',
  description: '',
  metadata: {
    target: {
      element: 'frame, iframe'
    },
    'success-criteria': [{
      name: '2.4.1',
      level: 'A',
      principle: 'Operable',
      url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html'
    },
      {
        name: '4.1.2',
        level: 'A',
        principle: 'Robust',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html'
      }
    ],
    related: [],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H64.html',
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

  //1. Check each frame and iframe element in the HTML or XHTML
  //source code for the presence of a title attribute.
  if (element.name === 'frame' || element.name === 'iframe') {
    // 2. Check that the title attribute contains text that identifies the frame.
    if (element.attribs && element.attribs['title'] !== undefined) {
      if (element.attribs['title'] !== '') {
        evaluation.verdict = 'warning';
        evaluation.description = 'Verify if title attribute contains text that identifies the frame';
        technique.metadata.warning++;
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'Title attribute is empty';
        technique.metadata.failed++;
      }
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = 'frame or iframe doesn\'t have title attribute';
      technique.metadata.failed++;
    }
  } else {
    evaluation.verdict = 'failed';
    evaluation.description = '';
    technique.metadata.failed++;
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
