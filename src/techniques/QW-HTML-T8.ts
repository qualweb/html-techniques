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

        if (element === undefined || element.attribs === undefined) {
            return;
        }

        const evaluation: HTMLTechniqueResult = {
            verdict: '',
            description: '',
            resultCode: ''
        };

        let patt = new RegExp(".+\\.(jpg|jpeg|png|gif|tiff|bmp)");
        let patt1 = new RegExp("^picture/s[0-9]+");
        let patt2 = new RegExp("[0-9]+");
        let patt3 = new RegExp("^Intro#[0-9]+");
        let patt4 = new RegExp("^imagem/s[0-9]+");

        let altText = element.attribs["alt"].toLocaleLowerCase();

        if (altText !== "" && !patt4.test(altText) && !patt3.test(altText) && !patt2.test(altText) && !patt1.test(altText) && !patt.test(altText) && !_.includes(default_title, altText)) {
            evaluation.verdict = 'warning';
            evaluation.description = `Text alternative needs manual verification`;
            evaluation.resultCode = 'RC1';
        } else {
            evaluation.verdict = 'failed';
            evaluation.description = 'Text alternative is not actually a text alternative for the non-text content';
            evaluation.resultCode = 'RC2';
        }

        evaluation.htmlCode = transform_element_into_html(element);
        evaluation.pointer = getElementSelector(element);


        super.addEvaluationResult(evaluation);
    }
}

export = QW_HTML_T8;
