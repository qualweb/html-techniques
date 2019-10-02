'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement, DomUtils
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from "./Technique.object";

const stew = new (require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Combining adjacent image and text links for the same resource',
  code: 'QW-HTML-T11',
  mapping: 'H2',
  description: 'The objective of this technique is to provide both text and iconic representations of links without making the web page more confusing or difficult for keyboard users or assistive technology users. Since different users finding text and icons more usable, providing both can improve the accessibility of the link.',
  metadata: {
    target: {
      element: 'a'
    },
    'success-criteria': [
      {
        name: '1.1.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv-all.html'
      },
      {
        name: '2.4.4',
        level: 'A',
        principle: 'Operable',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-refs.html'
      },
      {
        name: '2.4.9',
        level: 'AAA',
        principle: 'Operable',
        url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-link.html'
      }
    ],
    related: ['G91', 'G94', 'H30', 'C9', 'F89'],
    url: 'https://www.w3.org/TR/WCAG20-TECHS/H2.html',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T11 extends Technique {

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
    resultCode:''
  };

  if (element.children === undefined) { // fails if the element doesn't contain an image inside it
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an image inside the a element`;
    evaluation.resultCode = 'RC1';
  }

  let imgs = stew.select(element, 'img');

  let hasImage = imgs.length > 0;
  let hasNonEmptyAlt = false;
  let hasAlt = false;
  let equalAltText = false;

  for (const img of imgs) { // fails if the element doesn't contain an alt attribute
    if (img.attribs && img.attribs["alt"] !== undefined && !hasNonEmptyAlt && !equalAltText) {
      hasAlt = true;
      hasNonEmptyAlt = img.attribs["alt"] !== "";
      equalAltText = img.attribs["alt"] === DomUtils.getText(element);
    }

  }

  if (!hasImage) {
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an image attribute inside the a element`;
    evaluation.resultCode = 'RC2';
  } else if (!hasAlt) {
    //inapplicable
  } else if (!hasNonEmptyAlt) {
    evaluation.verdict = 'passed';
    evaluation.description = `The a element contains an image that has an empty alt attribute`;
    evaluation.resultCode = 'RC3';
  } else if (equalAltText) {
    evaluation.verdict = 'failed';
    evaluation.description = `The element text is equal to img alternative text`;
    evaluation.resultCode = 'RC4';
  } else {
    evaluation.verdict = 'warning';
    evaluation.description = 'The a element contains an image that has an alt attribute that should be manually verified';
    evaluation.resultCode = 'RC5';
  }

  evaluation.htmlCode = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

    super.addEvaluationResult(evaluation);
  }}

export = QW_HTML_T11;

