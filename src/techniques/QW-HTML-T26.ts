'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement,DomUtils
} from 'htmlparser2';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from './Technique.object';

const default_title = [
  "Enter the title of your HTML document here,", "Untitled Document", "No Title", "Untitled Page", "New Page 1", "Escreve o titulo do documento aqui,", "Documento sem titulo", "Sem titulo", "Nova pagina 1"
];


const technique: HTMLTechnique = {
  name: 'Providing text alternatives for the area elements of image maps',
  code: 'QW-HTML-T26',
  mapping: 'F25',
  description: 'This technique checks the text alternative of area elements of images maps',
  metadata: {
    target: {
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
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult>()
};

class QW_HTML_T26 extends Technique {

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

    var patt = new RegExp(".+\\.(html|htm)");
    let textData = DomUtils.getText(element);

    if (textData) {
       if (textData !== "" && !patt.test(textData) && !_.includes(default_title, textData)) { // the title text exists and needs to be verified
        evaluation['verdict'] = 'warning';
        evaluation['description'] = `Please verify the title text correlates to the page's content`;
        technique['metadata']['warning']++;
      } else { // fails if inside the title tag exists another element instead of text
        evaluation['verdict'] = 'failed';
        evaluation['description'] = 'Title tag contains text that doesnt identify the website ';
        technique['metadata']['failed']++;
      }
    } else { // fails if the title tag is empty
      evaluation['verdict'] = 'failed';
      evaluation['description'] = 'Title text is empty';
      technique['metadata']['failed']++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);


    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T26;