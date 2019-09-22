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
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from './Technique.object';

const default_title = [
  "spacer", "image", "picture", "separador", "imagem", "fotografia"
];

const technique: HTMLTechnique = {
  name: 'Failure of Success Criterion 1.1.1 and 1.2.1 due to using text alternatives that are not alternatives',
  code: 'QW-HTML-T8',
  mapping: 'F30',
  description: 'This describes a failure condition for all techniques involving text alternatives. If the text in the "text alternative" cannot be used in place of the non-text content without losing information or function then it fails because it is not, in fact, an alternative to the non-text content.',
  metadata: {
    target: {
      attributes: 'alt'
    },
    'success-criteria': [{
        name: '1.1.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content'
      },
      {
        name: '1.2.1',
        level: 'A',
        principle: 'Perceivable',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded'
      }
    ],
    related: [],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F30',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T8 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined || !element['children']) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    let patt = new RegExp(".+\\.(jpg|png)");
    let patt1 = new RegExp("^picture/s[0-9]+");
    let patt2 = new RegExp("[0-9]+");
    let patt3 = new RegExp("^Intro#[0-9]+");
    let patt4 = new RegExp("^imagem/s[0-9]+");

    const text = element.children[0];
    let textData = text['data'];
    if (text['type'] !== 'text') {
      evaluation.verdict = 'failed';
      evaluation.description = 'Title tag contains elements instead of text';
      evaluation.resultCode = 'RC1';
      technique.metadata.failed++;
    } else if (textData !== "" && !patt4.test(textData) && !patt3.test(textData) && !patt2.test(textData) && !patt1.test(textData) && !patt.test(textData) && !_.includes(default_title, textData)) { // the title text exists and needs to be verified
      evaluation.verdict = 'warning';
      evaluation.description = `Please verify the title text correlates to the page's content`;
      evaluation.resultCode = 'RC2';
      technique.metadata.warning++;
    } else { // fails if inside the title tag exists another element instead of text
      evaluation.verdict = 'failed';
      evaluation.description = 'Title tag contains text that doesnt identify the website';
      evaluation.resultCode = 'RC3';
      technique.metadata.failed++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);
    

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T8;
