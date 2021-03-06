'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T26 extends Technique {

  constructor() {
    super({
      name: 'Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents',
      code: 'QW-HTML-T26',
      mapping: 'F25',
      description: 'This technique describes a failure condition when the Web page has a title, but the title does not identify the contents or purpose of the Web page',
      metadata: {
        target: {
          parent: 'head',
          element: 'title'
        },
        'success-criteria': [{
          name: '2.4.2',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
        }],
        related: ['H25'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F25',
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

    const default_title = [
      'ENTER THE TITLE OF YOUR HTML DOCUMENT HERE', 
      'UNTITLED DOCUMENT', 
      'NO TITLE', 
      'UNTITLED PAGE', 
      'NEW PAGE 1', 
      'ESCREVE O TÍTULO DO DOCUMENTO AQUI,', 
      'DOCUMENTO SEM TÍTULO', 
      'SEM TÍTULO', 
      'NOVA PÁGINA 1'
    ];

    const patt = new RegExp('.+\\.(html|htm)');
    const textData = element.getElementText();

    if (textData) {
      if (textData !== '' && !patt.test(textData) && !default_title.includes(textData.toLocaleUpperCase())) { // the title text exists and needs to be verified
        evaluation.verdict = 'warning';
        evaluation.description = `Please verify the title tag text correlates to the page's content`;
        evaluation.resultCode = 'RC1';
      } else { // fails if inside the title tag exists another element instead of text
        evaluation.verdict = 'failed';
        evaluation.description = 'Title tag contains text that doesn\'t identify the website';
        evaluation.resultCode = 'RC2';
      }
    } else { // fails if the title tag is empty
      evaluation.verdict = 'failed';
      evaluation.description = 'Title tag is empty';
      evaluation.resultCode = 'RC3';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

export = QW_HTML_T26;
