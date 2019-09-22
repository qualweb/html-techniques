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

const default_title = [
    "spacer", "image", "picture", "separador", "imagem", "fotografia"
];


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


    const text = element['children'][0];

    let textData = text['data'];
    if (text['type'] !== 'text') {
        evaluation['verdict'] = 'failed';
        evaluation['description'] = 'Title tag contains elements instead of text';
        technique['metadata']['failed']++;

    } else if (textData !== "" && !patt4.test(textData) && !patt3.test(textData) && !patt2.test(textData) && !patt1.test(textData) && !patt.test(textData) && !_.includes(default_title, textData)) { // the title text exists and needs to be verified
        evaluation['verdict'] = 'warning';
        evaluation['description'] = `Please verify the title text correlates to the page's content`;
        technique['metadata']['warning']++;
    } else { // fails if inside the title tag exists another element instead of text
        evaluation['verdict'] = 'failed';
        evaluation['description'] = 'Title tag contains text that doesnt identify the website ';
        technique['metadata']['failed']++;
    }

    evaluation.htmlCode = transform_element_into_html(element);
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
