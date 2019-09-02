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
    code: 'QW-HTML-T7',
    mapping: 'H28',
    description: 'This technique checks the text alternative of area elements of images maps',
    metadata: {
        target: {
            element: 'abbr'
        },
        'success-criteria': [{
            name: '3.1.4',
            level: 'AAA',
            principle: 'Understandable',
            url: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-located.html'
        }
        ],
        related: ['G91', 'H30'],
        url: 'https://www.w3.org/TR/WCAG20-TECHS/H28.html',
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

    if (element === undefined) {
        return;
    }

    let evaluation: HTMLTechniqueResult = {
        verdict: '',
        description: ''
    };

    if(element.attribs === undefined){
        evaluation.verdict = 'failed';
        evaluation.description = `The element abbrv doesnt have the definition in the title attribute`;
        technique.metadata.failed++;
    }
    else if (element.attribs["title"] !== undefined && element.attribs["title"] !== "") {
        evaluation.verdict = 'passed';
        evaluation.description = `The element abbrv has the definition in the title attribute`;
        technique.metadata.passed++;
    }else{
        evaluation.verdict = 'failed';
        evaluation.description = `The element abbrv doesnt have the definition in the title attribute`;
        technique.metadata.failed++;

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
