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
import Technique from "./Technique.object";


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

class QW_HTML_T15 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: '',
    resultCode:''
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
      evaluation.resultCode = 'RC1';

    } else if (checks["hasTh"]) {

      evaluation.verdict = 'failed';
      evaluation.description = 'The table has a th element - Amend it if it\'s a layout table';
      evaluation.resultCode = 'RC2';

    } else if (checks["hasCaption"]) {

      evaluation.verdict = 'failed';
      evaluation.description = 'The table has a caption element - Amend it if it\'s a layout table';
      evaluation.resultCode = 'RC3';
    } else {
      evaluation.verdict = 'warning';
      evaluation.description = `No incorrect elements used in layout table`;
      evaluation.resultCode = 'RC4';

    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
  }

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T15;

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

