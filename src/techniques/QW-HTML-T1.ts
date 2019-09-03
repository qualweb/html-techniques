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
    code: 'QW-HTML-T1',
    mapping: 'H24',
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
    results: new Array<HTMLTechniqueResult>()
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

async function execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {

    if (element === undefined || element.children === undefined) {
        return;
    }

    const evaluation: HTMLTechniqueResult = {
        verdict: '',
        description: ''
    };
    let regexp = new RegExp('^H[1-6]$');
    let name;
    let list: number[] = [];

    for (let child of element.children) {
        name = child["name"];
        if (name !== undefined && regexp.test(name)) {
            list.push();
        }

    }
    if (list.length === 0) {
        return;//no H elements
    }
    let sortedArray: number[] = list.sort((n1, n2) => n1 - n2);
    let equal = true;
    let complete = true;

    for (let i = 0; i < list.length; i++) {
        if (list[i] !== sortedArray[i])
            equal = false;
        if (i > 0 && i - 1 < list.length && sortedArray[i] - sortedArray[i - 1] > 1)
            complete = false;
    }


    if (!equal) { // fails if the headers arent in the correct order
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain an alt attribute`;
        technique.metadata.failed++;
    } else if (!complete) { // fails if a header number is missing
        evaluation.verdict = 'failed';
        evaluation.description = `The element doesn't contain an alt attribute`;
        technique.metadata.failed++;
    } else { // the H elements are correctly used
        evaluation.verdict = 'passed';
        evaluation.description = 'Please verify the alt attribute value describes correctly the correspondent area of the image';
        technique.metadata.passed++;
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
