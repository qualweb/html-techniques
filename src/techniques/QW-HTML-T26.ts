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
import Technique from './Technique.object';

const default_title = [
    "Enter the title of your HTML document here", "Untitled Document", "No Title", "Untitled Page", "New Page 1", "Escreve o título do documento aqui,", "Documento sem título", "Sem título", "Nova página 1"
];


const technique: HTMLTechnique = {
    name: 'Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents',
    code: 'QW-HTML-T26',
    mapping: 'F25',
    description: 'This technique describes a failure condition when the Web page has a title, but the title does not identify the contents or purpose of the Web page',
    metadata: {
        target: {
            parent: 'head',
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

        let patt = new RegExp(".+\\.(html|htm)");
        let textData = DomUtils.getText(element);

        if (textData) {
            if (textData !== "" && !patt.test(textData) && !_.includes(default_title, textData)) { // the title text exists and needs to be verified
                evaluation.verdict = 'warning';
                evaluation.description = `Please verify the title tag text correlates to the page's content`;
                evaluation.resultCode = 'RC1';
            } else { // fails if inside the title tag exists another element instead of text
                evaluation.verdict = 'failed';
                evaluation.description = 'Title tag contains text that doesn\'t identify the website';
                evaluation.resultCode = 'RC2';
            }
        } else { // fails if the title tag is empty
            evaluation.verdict = 'failed';
            evaluation.description = 'Title tag is empty';
            evaluation.resultCode = 'RC3';
        }

        evaluation.htmlCode = transform_element_into_html(element);
        evaluation.pointer = getElementSelector(element);


        super.addEvaluationResult(evaluation);
    }
}

export = QW_HTML_T26;
