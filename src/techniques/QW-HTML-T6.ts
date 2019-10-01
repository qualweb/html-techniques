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
  name: 'Using both keyboard and other device-specific functions',
  code: 'QW-HTML-T6',
  mapping: 'SCR20',
  description: 'The objective of this technique is to verify the parity of keyboard-specific and mouse-specific events when code that has a scripting function associated with an event is used',
  metadata: {
    target: {
      element: '*',
      attributes: 'onmousedown, onmouseup, onclick, onmouseover, onmouseout'
    },
    'success-criteria': [
      {
        name: '2.1.1',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard'
      }
    ],
    related: ['G90'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20',
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

  if (element === undefined || element.attribs === undefined) {
    return;
  }

  let evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: ''
  };


  if (element.attribs["onmousedown"] !== element.attribs["onkeydown"] && element.attribs["onmousedown"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mousedown attribute doesnt have a keyboard equivalent`;
    technique.metadata.failed++;
  } else if (element.attribs["onmouseup"] !== element.attribs["onkeyup"] && element.attribs["onmouseup"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseup attribute doesnt have a keyboard equivalent`;
    technique.metadata.failed++;
  } else if (element.attribs["onclick"] !== element.attribs["onkeypress"] && element.attribs["onclick"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The click attribute doesnt have a keyboard equivalent`;
    technique.metadata.failed++;
  } else if (element.attribs["onmouseover"] !== element.attribs["onfocus"] && element.attribs["onmouseover"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseover attribute doesnt have a keyboard equivalent`;
    technique.metadata.failed++;
  } else if (element.attribs["onmouseout"] !== element.attribs["onblur"] && element.attribs["onmouseout"] !== undefined) {
    evaluation.verdict = 'failed';
    evaluation.description = `The mouseout attribute doesnt have a keyboard equivalent`;
    technique.metadata.failed++;
  } else {
    evaluation.verdict = 'passed';
    evaluation.description = `All the mouse event handlers have a keyboard equivalent`;
    technique.metadata.passed++;

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
