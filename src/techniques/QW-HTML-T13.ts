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
  name: 'Providing a title using the title element',
  code: 'QW-HTML-T13',
  mapping: 'H25',
  description: 'All HTML and XHTML documents, including those in individual frames in a frameset, have a title element in the head section that defines in a simple phrase the purpose of the document. This helps users to orient themselves within the site quickly without having to search for orientation information in the body of the page.',
  metadata: {
    target: {
      element: 'title'
    },
    'success-criteria': [
      {
        name: '2.4.2',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html'
      }
    ],
    related: ['G88', 'G127'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H25.html',
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
    if (element.children !== undefined && _.size(element.children) > 0) {
      const text = element.children[0];
      if (text['type'] === 'text') { // the title text exists and needs to be verified
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify the title text correlates to the page's content`;
        technique.metadata.warning++;
      } else { // fails if inside the title tag exists another element instead of text
        evaluation.verdict = 'failed';
        evaluation.description = `Title tag contains elements instead of text`;
        technique.metadata.failed++;
      }
    } else { // fails if the title tag is empty
      evaluation.verdict = 'failed';
      evaluation.description = `Title text is empty`;
      technique.metadata.failed++;
    }

    evaluation.code = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

  } else { // fails if title element doesn't exist
    evaluation.verdict = 'failed';
    evaluation.description = `Title tag doesn't exist`;
    technique.metadata.failed++;
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
