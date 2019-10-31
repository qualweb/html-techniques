'use strict';

import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';
import {
  DomUtils
} from '@qualweb/util';
import {trim} from 'lodash';
import Technique from './Technique.object';

const stew = new (require('stew-select')).Stew();

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

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    //todo ainda por fazer
    let isVisible = true;

    if (element.children) {
      let firstFocusableElem = findFirstFocusableElement(element);
      if (firstFocusableElem !== undefined) {
        if (isVisible) {
          if (firstFocusableElem.name === 'a' && firstFocusableElem.attribs && firstFocusableElem.attribs["href"]) {
            //todo pode ser o caminho absoluto no link... estudar isso...
            if (trim(firstFocusableElem.attribs["href"]).startsWith('#')) {
              let idSymbol = firstFocusableElem.attribs["href"].indexOf('#');
              let idReferenced = firstFocusableElem.attribs["href"].substring(idSymbol + 1);
              let idElementReferenced = stew.select(element, ["id=\"" + idReferenced + "\""])[0];
              if (idElementReferenced !== undefined) {
                if (hasMainElementAsParent(idElementReferenced)) {
                  evaluation.verdict = 'warning';
                  evaluation.description = 'The first focusable control is a visible link to a <main> element.';
                  evaluation.resultCode = 'RC';
                } else {
                  evaluation.verdict = 'warning';
                  evaluation.description = 'The first focusable control is a visible link to some content in the Web Page. Verify if it links to the main content.';
                  evaluation.resultCode = 'RC';
                }
              } else {
                evaluation.verdict = 'failed';
                evaluation.description = 'The first focusable control on the Web page links to an inexistent element';
                evaluation.resultCode = 'RC';
              }
            } else {
              evaluation.verdict = 'failed';
              evaluation.description = 'The first focusable control on the Web page does not links to local content';
              evaluation.resultCode = 'RC';
            }
          } else {
            evaluation.verdict = 'failed';
            evaluation.description = 'The first focusable control on the Web page is not a link';
            evaluation.resultCode = 'RC';
          }
        } else {
          evaluation.verdict = 'failed';
          evaluation.description = 'The first focusable control on the Web page is not visible when focused';
          evaluation.resultCode = 'RC';
        }
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = 'This Web page does not have focusable controls';
        evaluation.resultCode = 'RC';
      }
    } else {
      evaluation.verdict = 'inapplicable';
      evaluation.description = 'This Web page is empty';
      evaluation.resultCode = 'RC';
    }

    evaluation.htmlCode = DomUtils.transformElementIntoHtml(element);
    evaluation.pointer = DomUtils.getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }
}

function findFirstFocusableElement(element: DomElement): DomElement | undefined {
  let foundFirstFocusableElem = false;
  let firstFocusableElem: DomElement | undefined;

  if (element.children) {
    let i = 0;
    while (!foundFirstFocusableElem) {
      if (DomUtils.isElementFocusable(element.children[i])) {
        firstFocusableElem = element.children[i];
        foundFirstFocusableElem = true;
      } else {
        findFirstFocusableElement(element.children[i]);
      }
      i++;
    }
  }
  return firstFocusableElem;
}

function hasMainElementAsParent(element: DomElement): boolean {
  let result = false;
  while (!result && element.parent) {
    if (element.parent.name === 'main') {
      result = true;
    } else {
      hasMainElementAsParent(element.parent);
    }
  }
  return result;
}

export = QW_HTML_T38;
