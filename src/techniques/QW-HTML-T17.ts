'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { AccessibilityUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T17 extends Technique {

  constructor() {
    super({
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
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
        }],
        related: [],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H43',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: ''
      },
      results: new Array<HTMLTechniqueResult>()
    });
  }

  execute(element: QWElement | undefined, page: QWPage): void {
    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let hasIds = element.getElements('[id]');
    let hasHeaders = element.getElements('[headers]');

    if (!AccessibilityUtils.isDataTable(element, page)) {
      if (hasIds.length > 0 || hasHeaders.length > 0) {
        evaluation.verdict = 'failed';
        evaluation.description = 'This table is a layout table with id or headers attributes';
        evaluation.resultCode = 'RC1';
      } else {
        evaluation.verdict = 'inapplicable';
        evaluation.description = 'This table is a layout table';
        evaluation.resultCode = 'RC2';
      }
    } else {
      if (doesTableHaveDuplicateIds(element)) {
        evaluation.verdict = 'failed';
        evaluation.description = 'There are duplicate `id`s in this data table';
        evaluation.resultCode = 'RC3';
      } else if (hasHeaders.length <= 0) {
        evaluation.verdict = 'inapplicable';
        evaluation.description = 'No header attributes are used in this data table';
        evaluation.resultCode = 'RC4';
      } else {
        let headersElements = element.getElements('[headers]');
        let headersMatchId = true;
        for (let headerElem of headersElements) {
          if (headersMatchId) {
            headersMatchId = doesHeadersMatchId(element, headerElem.getElementAttribute("headers"));
          }
        }

        if (headersMatchId) {
          evaluation.verdict = 'passed';
          evaluation.description = 'id and headers attributes are correctly used';
          evaluation.resultCode = 'RC5';
        } else {
          evaluation.verdict = 'failed';
          evaluation.description = 'id and headers attributes are not correctly used';
          evaluation.resultCode = 'RC6';
        }
      }
    }
    
    super.addEvaluationResult(evaluation, element);
  }
}

function doesTableHaveDuplicateIds(table: QWElement): boolean {
  let elementsId = table.getElements('[id]');
  let duplicate = false;
  let counter: number;

  for (let elementId of elementsId) {
    counter = 0;
    for (let elementId2 of elementsId) {
      if (elementId.getElementAttribute("id") === elementId2.getElementAttribute("id")) {
        counter++;
      }
      if (counter > 1) {
        duplicate = true;
        break;
      }
    }
  }
  return duplicate;
}

function doesHeadersMatchId(table: QWElement, headers: string | null): boolean {
  let outcome = false;
  let result = 0;
  if (headers) {
    if (headers.trim() === '') {
      return true;
    }
    let splitHeaders = headers.split(" ");

    for (let header of splitHeaders) {
      let matchingIdElem = table.getElement( '[id="' + header + '"]');
      if (matchingIdElem !== null) {
        let matchingIdElemHeaders = matchingIdElem['attribs']["headers"];
        if (splitHeaders.length === 1 && matchingIdElemHeaders === undefined) {
          outcome = true;
        } else if (matchingIdElemHeaders !== undefined) {
          for (let headerIdElem of matchingIdElemHeaders.split(" ")) {
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
  }
  return outcome;
}

export = QW_HTML_T17;
