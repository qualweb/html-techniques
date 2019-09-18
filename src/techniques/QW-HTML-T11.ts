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

const stew = new(require('stew-select')).Stew();

const technique: HTMLTechnique = {
  name: 'Combining adjacent image and text links for the same resource',
  code: 'QW-HTML-T11',
  mapping: 'H2',
  description: 'The objective of this technique is to provide both text and iconic representations of links without making the web page more confusing or difficult for keyboard users or assistive technology users. Since different users finding text and icons more usable, providing both can improve the accessibility of the link.',
  metadata: {
    target: {
      parent: 'a',
      element: 'img'
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
  results: new Array<HTMLTechniqueResult> ()
};

function getTechniqueMapping(): string {
  return technique.mapping;
}

function hasPrincipleAndLevels(principles: string[], levels: string[]): boolean {
  let has = false;
  for (const sc of technique.metadata['success-criteria'] || []) {
    if (principles.includes(sc.principle) && levels.includes(sc.level)) {
      has = true;
    }
  }
  return has;
}

async function execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise < void > {

  if (element === undefined) {
    return;
  }

  const evaluation: HTMLTechniqueResult = {
    verdict: '',
    description: ''
  };

  if (element.children === undefined) { // fails if the element doesn't contain an alt attribute
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an image inside the a tag`;
    technique.metadata.failed++;
  }

  let imgs = stew.select(processedHTML, 'img');

  let hasImage = imgs.length>0;
  let hasNonEmptyAlt = false;
  let hasAlt = false;

  for (const img of imgs ) { // fails if the element doesn't contain an alt attribute
      if(img.attribs&&img.attribs["alt"]){
        hasAlt= true;
        hasNonEmptyAlt = img.attribs["alt"] !== "";
      }

}

  if(!hasImage){
    evaluation.verdict = 'failed';
    evaluation.description = `The element doesn't contain an image attribute inside de a element`;
    technique.metadata.failed++;

  }else if (!hasAlt) {
    //inaplicable

  }else  if (!hasNonEmptyAlt) {
    evaluation.verdict = 'passed';
    evaluation.description = `The a element contains an image tha has an empty alt attribute`;
    technique.metadata.passed++;

  }else {
    evaluation.verdict = 'warning';
    evaluation.description = 'The a element contains an image tha has an alt attribute that should be manually verified';
    technique.metadata.warning++;

  }

  evaluation.code = transform_element_into_html(element);
  evaluation.pointer = getElementSelector(element);

  technique.results.push(_.clone(evaluation));
}

function getFinalResults() {
  outcomeTechnique();
  return _.cloneDeep(technique);
}

function reset(): void {
  technique.metadata.passed = 0;
  technique.metadata.warning = 0;
  technique.metadata.failed = 0;
  technique.metadata.inapplicable = 0;
  technique.results = new Array<HTMLTechniqueResult>();
}

function outcomeTechnique(): void {
  if (technique.metadata.failed > 0) {
    technique.metadata.outcome = 'failed';
  } else if (technique.metadata.warning > 0) {
    technique.metadata.outcome = 'warning';
  } else if (technique.metadata.passed > 0) {
    technique.metadata.outcome = 'passed';
  } else {
    technique.metadata.outcome = 'inapplicable';
  }

  if (technique.results.length > 0) {
    addDescription();
  }
}

function addDescription(): void {
  for (const result of technique.results || []) {
    if (result.verdict === technique.metadata.outcome) {
      technique.metadata.description = result.description;
      break;
    }
  }
}

export {
  getTechniqueMapping,
  hasPrincipleAndLevels,
  execute,
  getFinalResults,
  reset
};
