'use strict';

import _ from 'lodash';
import {
  HTMLTechnique,
  HTMLTechniqueResult
} from '@qualweb/html-techniques';
import {
  DomElement
} from 'htmlparser2';
import * as rp from 'request-promise';

import {
  getElementSelector,
  transform_element_into_html
} from '../util';
import Technique from './Technique.object';

const technique: HTMLTechnique = {
  name: 'Validating Web pages',
  code: 'QW-HTML-T20',
  mapping: 'G134',
  description: 'This technique checks that the web page follows the specification',
  metadata: {
    target: {
      element: 'html',
    },
    'success-criteria': [
      {
        name: '4.1.1',
        level: 'A',
        principle: 'Robust',
        url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing'
      }
    ],
    related: [],
    url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G134',
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<HTMLTechniqueResult> ()
};

class QW_HTML_T20 extends Technique {
  
  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async validate(url: string): Promise<void> {

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const validations = await rp.default(`http://validador-html.fccn.pt/check?uri=${encodeURIComponent(url)}&output=json`);

    //TODO: necessário o validador do Jorge estar a funcionar na nova máquina para testar. Neste momento não está

    super.addEvaluationResult(evaluation);
  }
}

export = QW_HTML_T20;