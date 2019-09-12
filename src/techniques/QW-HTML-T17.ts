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

const stew = new (require('stew-select')).Stew();

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
    //TODO verificar se ids sao unique ou nao? - usar htmlvalidator
    //TODO e se houver tds sem headers?
    let headersElements = stew.select(element, "[headers]");
    for (let headerElem of headersElements) {
      if (checkHeadersMatchId(element, headerElem.attribs.headers)) {
        evaluation.verdict = 'passed';
        evaluation.description = 'id and headers attributes are correctly used';
        technique.metadata.passed++;
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'id and headers attributes are not correctly used';
        technique.metadata.failed++;
      }
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
  let dataTable = false;
  for (let child of children) {
    if (child["name"] === "th")
      dataTable = true;
    if (child["children"] !== undefined && !dataTable) {
      dataTable = isDataTable(child["children"]);
    }
  }
  return dataTable;
}

function checkHeadersMatchId(table, headers) {
  let outcome = false;
  let result = 0;
  let splitHeaders = headers.split(" ");
  for (let header of splitHeaders) {
    let matchingIdElem = stew.select(table, '[id="' + header + '"]')[0];
    //console.log(header + " | " + matchingIdElem.name + " - " + matchingIdElem.attribs.id);
    if (matchingIdElem !== undefined) {
      let matchingIdElemHeaders = matchingIdElem.attribs.headers;
      /*console.log("- " + matchingIdElemHeaders);
      if(!matchingIdElemHeaders){
        console.log(headers.split().length);
      }*/
      if (headers.split(" ").length === 1 && matchingIdElemHeaders === undefined) {
        outcome = true;
      } else if (matchingIdElemHeaders !== undefined) {
        for (let headerIdElem of matchingIdElemHeaders.split(" ")) {
          /*console.log("-- " + headerIdElem);
          console.log(headers.split(" ").indexOf(headerIdElem));
          console.log(splitHeaders);
          console.log("ohoh " + headerIdElem + " - " + header); */
          if (splitHeaders.indexOf(headerIdElem) >= 0 && headerIdElem !== header) {
            result++;
          }
        }
        if (result === matchingIdElemHeaders.split(" ").length) {
          outcome = true;
          break;
        }
      }
    }
  }
  /*console.log("> " + outcome);
  console.log("-------");*/
  return outcome;
}
