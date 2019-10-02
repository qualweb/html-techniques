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
import Technique from './Technique.object';

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

class QW_HTML_T12 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

      if (element.attribs !== undefined) { // always true
        let content = element.attribs["content"];
        let intContent = parseInt(content);
        if (content.includes('url')) {
          // meta refresh with url is a redirect
        } else if (intContent > 0 && intContent <= 72000) {
          evaluation.verdict = 'failed';
          evaluation.description = 'Time interval to refresh is between 1 and 72000 seconds';
          evaluation.resultCode = 'RC1';
        } else {
          evaluation.verdict = 'warning';
          evaluation.description = `Meta refresh time interval is correctly used`;
          evaluation.resultCode = 'RC2';
        }
        evaluation.htmlCode = transform_element_into_html(element);
        evaluation.pointer = getElementSelector(element);
      }

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T12;
