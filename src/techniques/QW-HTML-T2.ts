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
import Technique from "./Technique.object";

const technique: HTMLTechnique = {
	name: 'Using caption elements to associate data table captions with data tables',
	code: 'QW-HTML-T2',
	mapping: 'H39',
	description: 'This technique checks the caption element is correcly use on tables',
	metadata: {
		target: {
			element: 'table'
		},
		'success-criteria': [{
				name: '1.3.1',
				level: 'A',
				principle: 'Perceivable',
				url: 'https://www.w3.org/TR/2016/NOTE-UNDERSTANDING-WCAG20-20161007/content-structure-separation-programmatic.html'
			}
		],
		related: ['H51', 'H73', 'F46'],
		url: 'https://www.w3.org/TR/WCAG20-TECHS/H39.html',
		passed: 0,
		warning: 0,
		failed: 0,
		inapplicable: 0,
		outcome: '',
		description: '',
	},
	results: new Array<HTMLTechniqueResult>()
};
class QW_HTML_T2 extends Technique {

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

	if (!verifyCaptionExistence(element)){
		evaluation.verdict = 'failed';
		evaluation.description = 'The caption does not exist in the table element';
		evaluation.resultCode = 'RC1';
		technique.metadata.failed++;

	}
	if (verifyCaptionContent(element)){
		evaluation.verdict = 'failed';
		evaluation.description = 'The caption is empty';
		evaluation.resultCode = 'RC2';
		technique.metadata.failed++;
	}
	if(technique.metadata.failed == 0){
		evaluation.verdict = 'warning';
		evaluation.description = 'Please verify that the caption element identifies the table correctly.';
		evaluation.resultCode = 'RC3';
		technique.metadata.warning++;
	}


	evaluation.htmlCode = transform_element_into_html(element);
	evaluation.pointer = getElementSelector(element);

	super.addEvaluationResult(evaluation);
}}


function verifyCaptionExistence(elem){
	const childs = elem.children;
	for (let i = 0; i < childs.length; i++){
		if(childs[i] !== undefined && childs[i].name !== undefined){
			return childs[i].name === 'caption'
		}
	}
	return false;
}

function verifyCaptionContent(elem){
	const children = elem.children;
	if(children !== undefined) {
		for (let i = 0; i < children.length; i++) {
			if (children[i] !== undefined && children[i].name === 'caption') {
				if(children[i].children.length > 0){
					return (children[i].children !== undefined || children[i].children[0] !== undefined)?
						children[i].children[0].data.trim() === '' : true;
				}
			}
		}
	}
	return true;
}


export = QW_HTML_T2;
