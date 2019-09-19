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
  name: 'Failure of Success Criterion 1.3.1 due to using th elements, caption elements, or non-empty summary attributes in layout tables',
  code: 'QW-HTML-T15',
  mapping: 'F46',
  description: 'The objective of this technique is to describe a failure that occurs when a table used only for layout includes either th elements, a summary attribute, or a caption element. This is a failure because it uses structural (or semantic) markup only for presentation. The intent of the HTML and XHTML table elements is to present data.',
  metadata: {
    target: {
      element: 'table'
    },
    'success-criteria': [
      {
        name: '1.3.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
      }
    ],
    related: ['H39', 'H51', 'H73'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F46',
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

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: ''
  };

  if (element !== undefined) {
    let children = element.children;

    let summary;
    if (element.attribs !== undefined)
      summary = element.attribs["summary"];
    let checks = {};
    checks["hasCaption"] = false;
    checks["hasTh"] = false;

    checks = checkChildren(children, checks);

    if (summary !== "" && summary !== undefined) {

      evaluation.verdict = 'failed';
      evaluation.description = 'The table has a non-empty summary - Amend it if it\'s a layout table';
      technique.metadata.failed++;

    } else if (checks["hasTh"]) {

      evaluation.verdict = 'failed';
      evaluation.description = 'The table has a th element - Amend it if it\'s a layout table';
      technique.metadata.failed++;

    } else if (checks["hasCaption"]) {

      evaluation.verdict = 'failed';
      evaluation.description = 'The table has a caption element - Amend it if it\'s a layout table';
      technique.metadata.failed++;
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = `No incorrect elements used in layout table`;
      technique.metadata.warning++;

    }

    evaluation.code = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
  }

  technique.results.push(_.clone(evaluation));
}

function checkChildren(children, checks) {

  for (let child of children) {
    if (child["name"] === "th")
      checks["hasTh"] = true;
    if (child["name"] === "caption")
      checks["hasCaption"] = true;
    if (child["children"] !== undefined) {
      checkChildren(child["children"], checks);
    }

  }
  return checks;
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
