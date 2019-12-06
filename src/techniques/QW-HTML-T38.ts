'use strict';


import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';

import {
  Page,
  ElementHandle
} from 'puppeteer';

import {
  DomUtils
} from '@qualweb/util';

import {trim,indexOf} from 'lodash';

import Technique from './Technique.object';
const technique: HTMLTechnique = {
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
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T38 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: ElementHandle | undefined, page: Page): Promise<void> {
    if (element === null||element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };
   
    let children = await DomUtils.getElementChildren(element);

    if (children !== null && children.length > 0) {
      let firstFocusableElem = await findFirstFocusableElement(element);
      if (firstFocusableElem !== undefined) {
        let isVisible = await DomUtils.isElemenVisible(firstFocusableElem);
        if (isVisible) {
          const firstFocusableElemName = await DomUtils.getElementTagName(firstFocusableElem);
          //const firstFocusableElemAttribs = await DomUtils.getElementAttributes(firstFocusableElem);
          const firstFocusableElemHREF = trim(await DomUtils.getElementAttribute(firstFocusableElem, 'href'));
          if (firstFocusableElemName === 'a'   && firstFocusableElemHREF) {
            let url = await page.url();
            let urlConcatWithId = url + '#';
            let lastSlash = url.lastIndexOf('/');
            let filename = url.substring(lastSlash + 1);
            if (firstFocusableElemHREF.startsWith('#') || firstFocusableElemHREF.startsWith(urlConcatWithId) ||
              firstFocusableElemHREF.startsWith(filename)) {
              let idSymbol = firstFocusableElemHREF.indexOf('#');
              let idReferenced = firstFocusableElemHREF.substring(idSymbol + 1);
              if (idReferenced.length > 0) {
                let idElementReferenced = await element.$( '[id="' + idReferenced + '"]')
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
          evaluation.description = 'The first focusable control on the Web page is not visible when focused';
          evaluation.resultCode = 'RC7';
        }
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'This Web page does not have focusable controls';
        evaluation.resultCode = 'RC8';
      }
    } else {
      evaluation.verdict = 'inapplicable';
      evaluation.description = 'This Web page is empty';
      evaluation.resultCode = 'RC9';
    }

    evaluation.htmlCode = await DomUtils.getElementHtmlCode(element);
    evaluation.pointer = await DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

async function findFirstFocusableElement(element: ElementHandle):Promise< ElementHandle | undefined> {
  let foundFirstFocusableElem = false;
  let firstFocusableElem: ElementHandle | undefined;
  let children = await DomUtils.getElementChildren(element);

  if (children && children.length > 0) {
    let i = 0;
    while (!foundFirstFocusableElem) {
      if (children[i] !== undefined) {
        if ( await DomUtils.isElementFocusable(children[i])) {
          firstFocusableElem = children[i];
          foundFirstFocusableElem = true;
        } else {
          findFirstFocusableElement(children[i]);
        }
        i++;
      } else {
        return undefined;
      }
    }
  }
  return firstFocusableElem;
}

function hasMainElementAsParent(element: ElementHandle|null): boolean {
  let pointer = DomUtils.getElementSelector(element);
  return indexOf(pointer, 'main:') > 0;
}

export = QW_HTML_T38;
