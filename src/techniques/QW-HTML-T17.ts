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
const stew = new(require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Using id and headers attributes to associate data cells with header cells in data tables',
  code: 'QW-HTML-T17',
  mapping: 'H43',
  description: 'This technique checks if data cells are associated with header cells in data tables',
  metadata: {
    target: {
      element: 'table'
    },
    'success-criteria': [{
      name: '1.3.1',
      level: 'A',
      principle: 'Perceivable',
      url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/content-structure-separation-programmatic.html'
    }
    ],
    related: [],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H43.html',
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

  // if is layout table = there is not a th
  if (!isDataTable(element.children)) {
    evaluation.verdict = 'inapplicable';
    evaluation.description = 'This table is a layout table';
    technique.metadata.inapplicable++;
  } else {
    //TODO verificar se ids sao unique ou nao?
    //TODO e se houver tds sem headers?
    let headersElements = stew.select(element.children, "[headers]");
    if (checkHeadersMatchId(element, headersElements)){
      evaluation.verdict = 'passed';
      evaluation.description = 'id and headers attributes are correctly used to correlate data cells to data headers';
      technique.metadata.passed++;
    } else {
      evaluation.verdict = 'failed';
      evaluation.description = 'id and headers attributes are not correctly used';
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

function isDataTable(children) {
  let hasTh = false;
  for (let child of children) {
    console.log(child["name"]);
    if (child["name"] === "th")
      hasTh = true;
    if (child["children"] !== undefined && !hasTh) {
      hasTh = isDataTable(child["children"]);
    }
  }
  return hasTh;
}

function checkHeadersMatchId(table, headers) {
  let outcome = false;
  let result;
  for (let header of headers) {
    let headersOf = stew.select(table, "[id/=/$header]");
    if (headersOf !== undefined) {
      console.log(headersOf);
      if (headers.length === 1 && headersOf.attribs.headers === undefined) {
        outcome = true;
      } else {
        for (let head of headersOf.attribs.headers.split(" ")) {
          if (headers.indexOf(head) >= 0 && head != header) {
            result++;
          }
        }
        if (result === headersOf.attribs.headrs.split(" ").length) {
          outcome = true;
          break;
        }
      }
    }
  }
  return outcome;
}
