'use strict';

// requires
import _ from 'lodash';
const stew = new (require('stew-select')).Stew();
const API = require('@apis/evaluation');

const technique = {
	'name': 'Using caption elements to associate data table captions with data tables',
	'code': 'H39',
	'metadata': {
		'target': {
			'element': 'table'
		},
		'success-criteria': [
			{
				'name': '1.3.1',
				'level': 'A',
				'principle': 'Perceivable'
			}
		],
		'related': ['H51', 'H73', 'F46'],
		'url': 'https://www.w3.org/WAI/WCAG21/Techniques/html/H39',
		'success': 0,
		'warning': 0,
		'failed': 0,
		'errorCodes' : []
	},
	'data': []
};

exports.hasPrincipleAndLevels = (principles, lvls) => {
  let has = false;
  for (let sc of technique.metadata['success-criteria']) {
    if (_.includes(principles, sc.principle) && _.includes(lvls, sc.level)) {
      has = true;
    }
  }
  return has;
}

exports.evaluate = async (elem, dom) => {

	const evaluation = {
		'verdict': '',
		'description': [],
		'metadata':[]
	};

	if (elem !== undefined) {
		if (!verifyCaptionExistence(elem)){
			evaluation['verdict'] = 'failed';
			evaluation['description'].push('The caption does not exist in the table element');
			technique['metadata']['errorCodes'].push(['0.1','caption']);
			technique['metadata']['failed']++;

		}
		if (verifyCaptionContent(elem)){
			evaluation['verdict'] = 'failed';
			evaluation['description'].push('The caption is empty');
			technique['metadata']['errorCodes'].push(['0.2','caption']);
			technique['metadata']['failed']++;
		}
		if(technique.metadata.failed == 0){
			evaluation['verdict'] = 'warning';
			evaluation['description'].push('Please verify that the caption element identifies the table correctly.');
			technique['metadata']['errorCodes'].push(['39.1','Please check that the content of the caption element identifies the table correctly.']);
			technique['metadata']['warning']++;
		}

	} else {
		return;
	}

	evaluation['repair'] = {};

	technique['data'].push(evaluation);
	
}


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
				return children[i].children[0].data.replace(/\s+/g, '') === '';
			}
		}
	}
	return false;
}

exports.getFinalResults = () => {
	return technique;
}

/**
 * Resets the technique evaluation
 */
exports.reset = () => {
	technique.metadata.success = 0;
	technique.metadata.failed = 0;
	technique.metadata.warning = 0;
	technique.metadata.errorCodes = [];
	technique.data = [];
}
