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

const technique: HTMLTechnique = {
    name: 'Providing text alternatives for the area elements of image maps',
    code: 'QW-HTML-T8',
    mapping: 'F30',
    description: 'This technique checks the text alternative of area elements of images maps',
    metadata: {
        target: {
            'parent-sibling': 'img',
            parent: 'map',
            element: 'area'
        },
        'success-criteria': [{
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
        related: ['G91', 'H30'],
        url: 'https://www.w3.org/TR/WCAG20-TECHS/H24.html',
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

    if (element === undefined||element.attribs===undefined) {
        return;
    }

    const evaluation: HTMLTechniqueResult = {
        verdict: '',
        description: ''
    };

   if (element.attribs['alt'] === undefined) { // fails if the element doesn't contain an alt attribute
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain an alt attribute`;
        technique.metadata.failed++;
    } else if (element.attribs['alt'] === '') { // fails if the element's alt attribute value is empty
        evaluation.verdict = 'failed';
        evaluation.description = `The element's alt attribute value is empty`;
        technique.metadata.failed++;
    } else if (element.attribs['alt'] === 'spacer'||element.attribs['alt'] === 'image'||element.attribs['alt'] === 'area') { // fails if the element's alt attribute value is empty
       evaluation.verdict = 'failed';
       evaluation.description = `The element's alt attribute value doesnt provide extra information`;
       technique.metadata.failed++;
   } else { // the element contains an non-empty alt attribute, and it's value needs to be verified
        evaluation.verdict = 'warning';
        evaluation.description = 'Please verify the alt attribute value describes correctly the element';
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
    technique.results = new Array < HTMLTechniqueResult > ();
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
