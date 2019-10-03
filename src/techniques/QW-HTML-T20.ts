'use strict';

import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';
import validator from 'html-validator';

import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Validating Web pages',
  code: 'QW-HTML-T20',
  mapping: 'G134',
  description: 'This technique checks that the web page follows the specification',
  metadata: {
    target: {
      element: '*',
    },
    'success-criteria': [
      {
        name: '4.1.1',
        level: 'A',
        principle: 'Robust',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing'
      }
    ],
    related: [],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G134',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T20 extends Technique {
  
  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async validate(url: string): Promise<void> {

    const options = {
      url,
      format: 'json'
    };

    const validation = await validator(options);

    for (const result of validation.messages || []) {
      const evaluation: HTMLTechniqueResult = {
        verdict: '',
        description: '',
        resultCode: ''
      };
      
      if (result.type === 'error') {
        evaluation.verdict = 'failed';
        evaluation.description = result.message;
        evaluation.resultCode = 'RC2';
      } else {
        evaluation.verdict = 'warning';
        evaluation.description = result.message;
        evaluation.resultCode = 'RC3';
      }

      super.addEvaluationResult(evaluation);
    }

    if (super.getNumberOfFailedResults() + super.getNumberOfWarningResults() === 0) {
       const evaluation: HTMLTechniqueResult = {
        verdict: 'passed',
        description: `The HTML document doesn't have errors`,
        resultCode: 'RC1'
      };

      super.addEvaluationResult(evaluation);
    }
  }
}

export = QW_HTML_T20;
