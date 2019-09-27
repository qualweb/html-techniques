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
	name: 'Providing descriptive titles for Web pages',
	code: 'QW-HTML-T24',
	mapping: 'G88',
	description: 'This technique checks the title of a web page',
	metadata: {
		target: {
			element: 'title'
		},
		'success-criteria': [{
				name: '2.4.2',
				level: 'A',
				principle: 'Operable',
				url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
			}
		],
		related: ['H25'],
		url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G88.html',
		passed: 0,
		warning: 0,
		failed: 0,
		inapplicable: 0,
		outcome: '',
		description: '',
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



async function execute(element: DomElement | undefined, processedHTML: DomElement[]): Promise < void > {

	if (element === undefined) {
		return;
	}

	const evaluation: HTMLTechniqueResult = {
		verdict: '',
		description: '',
		resultCode: ''
	};

	if ((element.children !== undefined && element.children.length > 0)? element.children[0].data.trim() === '': true){
		evaluation.verdict = 'failed';
		evaluation.description = 'The title is empty';
		evaluation.resultCode = 'RC1';
		technique.metadata.failed++;
	}
	if(technique.metadata.failed == 0){
		evaluation.verdict = 'warning';
		evaluation.description = 'Please verify that the title describes the page correctly.';
		evaluation.resultCode = 'RC2';
		technique.metadata.warning++;
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
			technique.metadata.description = <string> result.description;
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
