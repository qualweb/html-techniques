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
  getElementSelector, isFocusable,
  transform_element_into_html
} from '../util';
import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Adding a link at the beginning of a block of repeated content to go to the end of the block',
  code: 'QW-HTML-T37',
  mapping: '',
  description: 'The objective of this technique is to provide a mechanism to bypass a block of material by skipping to the end of the block.',
  metadata: {
    target: {
      element: 'a',
      attributes: 'href'
    },
    'success-criteria': [{
      name: '2.4.1',
      level: 'A',
      principle: 'Operable',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks'
    }
    ],
    related: ['G1', 'G124'],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G123',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T37 extends Technique {

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

    if (isFocusable(element)) {
      evaluation.verdict = 'passed';
      technique.metadata.passed++;
    } else {
      evaluation.verdict = 'failed';
      technique.metadata.failed++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);


    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T37;
