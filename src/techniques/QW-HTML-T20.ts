'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';

class QW_HTML_T20 extends Technique {

  constructor() {
    super({
      name: 'Using HTML according to spec',
      code: 'QW-HTML-T20',
      mapping: 'H88',
      description: 'This technique checks that the HTML or XHTML web page follows the specification',
      metadata: {
        target: {
          element: '*',
        },
        'success-criteria': [{
          name: '4.1.1',
          level: 'A',
          principle: 'Robust',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing'
        }, {
          name: '4.1.2',
          level: 'A',
          principle: 'Robust',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value'
        }, ],
        related: ['H74', 'H75'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H88',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  execute(): void {
    throw new Error('Method not implemented.');
  }

  validate(validation): void{


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
