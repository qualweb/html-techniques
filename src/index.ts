/**
 * 
 */
'use strict';

import { DomElement } from 'htmlparser2';
import { HTMLTOptions, HTMLTechniquesReport } from '@qualweb/html-techniques';
const stew = new(require('stew-select')).Stew();

import mapping from './techniques/mapping.json';

import * as QW_HTML_T1 from './techniques/QW-HTML-T1';
import * as QW_HTML_T6 from './techniques/QW-HTML-T6';

const techniques = {
  'QW-HTML-T1': QW_HTML_T1,
  'QW-HTML-T6': QW_HTML_T6
};

const techniques_to_execute = {
  'QW-HTML-T1': true,
  'QW-HTML-T6': true

};

function configure(options: HTMLTOptions): void {
  if (options.principles) {
    options.principles = options.principles.map(p => (p.charAt(0).toUpperCase() + p.slice(1)).trim());
  }
  if (options.levels) {
    options.levels = options.levels.map(l => l.toUpperCase().trim());
  }
  if (options.techniques) {
    options.techniques = options.techniques.map(t => t.toUpperCase().trim());
  }

  for (const technique of Object.keys(techniques) || []) {
    techniques_to_execute[technique] = true;
    
    if (options.principles && options.principles.length !== 0) {
      if (options.levels && options.levels.length !== 0) {
        if (!techniques[technique].hasPrincipleAndLevels(options.principles, options.levels)) {
          techniques_to_execute[technique] = false;
        }
      } else if (!techniques[technique].hasPrincipleAndLevels(options.principles, ['A', 'AA', 'AAA'])) {
        techniques_to_execute[technique] = false;
      }
    } else if (options.levels && options.levels.length !== 0) {
      if (!techniques[technique].hasPrincipleAndLevels(['Perceivable', 'Operable', 'Understandable', 'Robust'], options.levels)) {
        techniques_to_execute[technique] = false;
      }
    }
    if (!options.principles && !options.levels) {
      if (options.techniques && options.techniques.length !== 0) {
        if (!options.techniques.includes(technique) && !options.techniques.includes(technique[technique].getTechniqueMapping())) {
          techniques_to_execute[technique] = false;
        }
      }
    } else {
      if (options.techniques && options.techniques.length !== 0) {
        if (options.techniques.includes(technique) || options.techniques.includes(technique[technique].getTechniqueMapping())) {
          techniques_to_execute[technique] = true;
        }
      }
    }
  }
}

async function executeHTMLT(sourceHTML: DomElement[], processedHTML: DomElement[]): Promise<HTMLTechniquesReport> {
  
  const report: HTMLTechniquesReport = {
    type: 'html-techniques',
    metadata: {
      passed: 0,
      warning: 0,
      failed: 0,
      inapplicable: 0
    },
    techniques: {}
  };

  const preTechniques = mapping['pre'];
  const preSelectors = Object.keys(preTechniques);
  
  for (const selector of preSelectors || []) {
    for (const technique of preTechniques[selector] || []) {
      if (techniques_to_execute[technique]) {
        let elements = stew.select(sourceHTML, selector);
        if (elements.length > 0) {
          for (const elem of elements || []) {
            await techniques[technique].execute(elem, sourceHTML);
          }
        } else {
          await techniques[technique].execute(undefined, sourceHTML);
        }
        report.techniques[technique] = techniques[technique].getFinalResults();
        report.metadata[report.techniques[technique].metadata.outcome]++;
        techniques[technique].reset();
      }
    }
  }

  const postTechniques = mapping['post'];
  const postSelectors = Object.keys(postTechniques);
  
  for (const selector of postSelectors || []) {
    for (const technique of postTechniques[selector] || []) {
      if (techniques_to_execute[technique]) {        
        let elements = stew.select(processedHTML, selector);
        if (elements.length > 0) {
          for (const elem of elements || []) {
            await techniques[technique].execute(elem, processedHTML);
          }
        } else {
          await techniques[technique].execute(undefined, processedHTML);
        }
        report.techniques[technique] = techniques[technique].getFinalResults();
        report.metadata[report.techniques[technique].metadata.outcome]++;
        techniques[technique].reset();
      }
    }
  }

  return report;
}

export { configure, executeHTMLT };
