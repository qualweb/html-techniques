'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import { DomUtils } from '@qualweb/util';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T38 extends Technique {

  constructor() {
    super({
      name: 'Adding a link at the top of each page that goes directly to the main content area',
      code: 'QW-HTML-T38',
      mapping: 'G1',
      description: 'The objective of this technique is to provide a mechanism to bypass blocks of material that are repeated on multiple Web pages by skipping directly to the main content of the Web page.',
      metadata: {
        target: {
          element: 'body'
        },
        'success-criteria': [{
          name: '2.4.1',
          level: 'A',
          principle: 'Operable',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks'
        }],
        related: ['G123', 'G124'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G1',
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
    if (element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let children = element.getElementChildren();

    if (children !== null && children.length > 0) {
      let firstFocusableElem = findFirstFocusableElement(element);
      if (!!firstFocusableElem) {
        const firstFocusableElemName = firstFocusableElem.getElementTagName();
        //const firstFocusableElemAttribs = await DomUtils.getElementAttributes(firstFocusableElem);
        const firstFocusableElemHREF = firstFocusableElem.getElementAttribute('href');
        if (firstFocusableElemName === 'a' && firstFocusableElemHREF && firstFocusableElemHREF.trim()) {
          let url = page.getURL();
          let urlConcatWithId = url + '#';
          let lastSlash = url.lastIndexOf('/');
          let filename = url.substring(lastSlash + 1);
          if (firstFocusableElemHREF.startsWith('#') || firstFocusableElemHREF.startsWith(urlConcatWithId) ||
            firstFocusableElemHREF.startsWith(filename)) {
            let idSymbol = firstFocusableElemHREF.indexOf('#');
            let idReferenced = firstFocusableElemHREF.substring(idSymbol + 1);
            if (idReferenced.length > 0) {
              let idElementReferenced = element.getElement('[id="' + idReferenced + '"]')
              if (idElementReferenced !== null) {
                if (hasMainElementAsParent(idElementReferenced)) {
                  evaluation.verdict = 'warning';
                  evaluation.description = 'The first focusable control is a visible link to a <main> element.';
                  evaluation.resultCode = 'RC1';
                } else {
                  evaluation.verdict = 'warning';
                  evaluation.description = 'The first focusable control is a visible link to some content in the Web Page. Verify if it links to the main content.';
                  evaluation.resultCode = 'RC2';
                }
              } else {
                evaluation.verdict = 'failed';
                evaluation.description = 'The first focusable control on the Web page links to an inexistent element';
                evaluation.resultCode = 'RC3';
              }
            } else {
              //todo failed ou inapplicable?
              evaluation.verdict = 'failed';
              evaluation.description = 'The first focusable control on the Web page links to the top of the page';
              evaluation.resultCode = 'RC4';
            }
          } else {
            evaluation.verdict = 'failed';
            evaluation.description = 'The first focusable control on the Web page does not links to local content';
            evaluation.resultCode = 'RC5';
          }
        } else {
          evaluation.verdict = 'failed';
          evaluation.description = 'The first focusable control on the Web page is not a link';
          evaluation.resultCode = 'RC6';
        }
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'This Web page does not have focusable controls';
        evaluation.resultCode = 'RC7';
      }
    } else {
      evaluation.verdict = 'inapplicable';
      evaluation.description = 'This Web page is empty';
      evaluation.resultCode = 'RC8';
    }

    super.addEvaluationResult(evaluation, element);
  }
}

function findFirstFocusableElement(element: QWElement): QWElement | undefined {
  let foundFirstFocusableElem = false;
  let firstFocusableElem: QWElement | undefined;
  let children = element.getElementChildren();

  if (children && children.length > 0) {
    let i = 0;
    while (!foundFirstFocusableElem && i < children.length) {
      if (children[i] !== undefined) {
        if (DomUtils.isElementFocusable(children[i])) {
          firstFocusableElem = children[i];
          foundFirstFocusableElem = true;
        } else {
          firstFocusableElem = findFirstFocusableElement(children[i]);
          foundFirstFocusableElem = true;
        }
        i++;
      } else {
        foundFirstFocusableElem = true;
      }
    }
  }
  return firstFocusableElem;
}

function hasMainElementAsParent(element: QWElement | undefined): boolean {
  if (element) {
    let pointer = element.getElementSelector();
    return pointer.indexOf('main:') > 0;
  }

  return false;
}

export = QW_HTML_T38;
