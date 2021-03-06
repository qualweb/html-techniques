'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T30 extends Technique {

  constructor() {
    super({
      name: 'Using table markup to present tabular information',
      code: 'QW-HTML-T30',
      mapping: 'H51',
      description: 'The objective of this technique is to present tabular information in a way that preserves relationships within the information even when users cannot see the table or the presentation format is changed. Using the table element with the child elements tr, th, and td makes these relationships perceivable.',
      metadata: {
        target: {
          element: 'table'
        },
        'success-criteria': [{
          name: '1.3.1',
          level: 'A',
          principle: 'Perceivable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
        }],
        related: ['H39', 'H43', 'H63'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H51',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  execute(element: QWElement | undefined): void {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    // verificar se existe pelo menos um th
    const has_th = (element.getElements('th')).length > 0;
    // verificar se existe pelo menos um tr
    const has_tr = (element.getElements('tr')).length > 0;
    // verificar se existe pelo menos um td
    const has_td = (element.getElements('td')).length > 0;

    // verificar pelo menos uma ocorrencia de cada elemento
    if (has_td && has_tr && has_th) {
      evaluation.verdict = 'passed';
      evaluation.description = 'There is at least one occurrence of table, tr, td and th';
      evaluation.resultCode = 'RC1';
    }
    // elementos em falta
    else {
      evaluation.verdict = 'failed';
      evaluation.description = 'There are missing table child elements';
      evaluation.resultCode = 'RC2';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T30;
