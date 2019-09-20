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

const technique: HTMLTechnique = {
    name: 'Providing text alternatives for the area elements of image maps',
    code: 'QW-HTML-T1',
    mapping: 'H24',
    description: 'This technique checks the text alternative of area elements of images maps',
    metadata: {import QW_HTML_T1 from './techniques/QW-HTML-T1';
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

class QW_HTML_T9 extends Technique {

  constructor() {
    super(technique);
  }

  async execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise<void> {
    
    if (element === undefined || element.children === undefined) {
        return;
    }

    const evaluation: HTMLTechniqueResult = {
        verdict: '',
        description: '',
        resultCode:''
    };
    let regexp = new RegExp('^h[1-6]$');
    let name;
    let list: number[] = [];
    let split;

    for (let child of element.children) {
        name = child["name"];
        console.log(name);
        if (name !== undefined && regexp.test(name)) {
            split = name.split("h")
            list.push(split[1]);
        }

    }

    console.log(list);
    if (list.length === 0) {
        return;//no H elements
    }
    let sortedArray: number[] = list.sort((n1, n2) => n1 - n2);
    let equal = true;
    let complete = true;
    console.log(sortedArray[0]);

    for (let i = 0; i < list.length; i++) {
        if (list[i] !== sortedArray[i])
            equal = false;
        if (i > 0 && i - 1 < list.length && sortedArray[i] - sortedArray[i - 1] > 1){
            complete = false; }
    }



    if (!equal) { // fails if the headers arent in the correct order
        evaluation.verdict = 'failed';
        evaluation.description = `Headers are not in the correct order`;
        technique.metadata.failed++;
    } else if (!complete) { // fails if a header number is missing
        evaluation.verdict = 'failed';
        evaluation.description = `Header number is missing`;
        technique.metadata.failed++;
    } else { // the H elements are correctly used
        evaluation.verdict = 'warning';
        evaluation.description = 'Please verify that headers are used to divide the page correctly';
        technique.metadata.passed++;
    }

    console.log( evaluation.verdict);
    console.log( evaluation.description);

    evaluation.htmlCode = transform_element_into_html(element);
    evaluation.pointer = getElementSelector(element);

    super.addEvaluationResult(evaluation);
}}



export = QW_HTML_T9;


