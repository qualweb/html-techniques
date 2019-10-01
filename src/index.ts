/**
 *
 */
'use strict';

import { DomElement } from 'htmlparser2';
import { HTMLTOptions, HTMLTechniquesReport } from '@qualweb/html-techniques';
const stew = new(require('stew-select')).Stew();

import mapping from './techniques/mapping.json';

import { techniques, techniquesToExecute } from './techniques';

function configure(options: HTMLTOptions): void {
  if (options.principles) {
    options.principles = options.principles.map(p => (p.charAt(0).toUpperCase() + p.toLowerCase().slice(1)).trim());
  }
  if (options.levels) {
    options.levels = options.levels.map(l => l.toUpperCase().trim());
  }
  if (options.techniques) {
    options.techniques = options.techniques.map(t => t.toUpperCase().trim());
  }

  for (const technique of Object.keys(techniques) || []) {
    techniquesToExecute[technique] = true;

    if (options.principles && options.principles.length !== 0) {
      if (options.levels && options.levels.length !== 0) {
        if (!techniques[technique].hasPrincipleAndLevels(options.principles, options.levels)) {
          techniquesToExecute[technique] = false;
        }
      } else if (!techniques[technique].hasPrincipleAndLevels(options.principles, ['A', 'AA', 'AAA'])) {
        techniquesToExecute[technique] = false;
      }
    } else if (options.levels && options.levels.length !== 0) {
      if (!techniques[technique].hasPrincipleAndLevels(['Perceivable', 'Operable', 'Understandable', 'Robust'], options.levels)) {
        techniquesToExecute[technique] = false;
      }
    }
    if (!options.principles && !options.levels) {
      if (options.techniques && options.techniques.length !== 0) {
        if (!options.techniques.includes(technique) && !options.techniques.includes(technique[technique].getTechniqueMapping())) {
          techniquesToExecute[technique] = false;
        }
      }
    } else {
      if (options.techniques && options.techniques.length !== 0) {
        if (options.techniques.includes(technique) || options.techniques.includes(technique[technique].getTechniqueMapping())) {
          techniquesToExecute[technique] = true;
        }
      }
    }
  }
}

function resetConfiguration(): void {
  for (const technique in techniquesToExecute) {
    techniquesToExecute[technique] = true;
  }
}

async function executeTechniques(report: HTMLTechniquesReport, html: DomElement[], selectors: string[], mappedTechniques: any): Promise<void> {
  for (const selector of selectors || []) {
    for (const technique of mappedTechniques[selector] || []) {
      if (techniquesToExecute[technique]) {
        let elements = stew.select(html, selector);

        if (elements.length > 0) {
          for (const elem of elements || []) {
            await techniques[technique].execute(elem, html);
          }
        } else {
          await techniques[technique].execute(undefined, html);
        }
        report.techniques[technique] = techniques[technique].getFinalResults();
        report.metadata[report.techniques[technique].metadata.outcome]++;
        techniques[technique].reset();
      }
    }
  }
}

async function executeHTMLT(sourceHTML: DomElement[], processedHTML: DomElement[]): Promise<HTMLTechniquesReport> {

  if (sourceHTML === null || sourceHTML === undefined) {
    throw new Error(`Source html can't be null or undefined`);
  }

  if (processedHTML === null || processedHTML === undefined) {
    throw new Error(`Processed html can't be null or undefined`);
  }

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

  await executeTechniques(report, sourceHTML, preSelectors, preTechniques);

  /*for (const selector of preSelectors || []) {
    for (const technique of preTechniques[selector] || []) {
      if (techniquesToExecute[technique]) {
        let elements = stew.select(sourceHTML, selector);
        if (elements.length > 0) {
          for (const elem of elements || []) {
            await techniques[technique].execute(elem, sourceHTML);
          }
        } else {
          await techniques[technique].execute(undefined, sourceHTML);
        }
        report[technique] = techniques[technique].getFinalResults();
        report.metadata[report.techniques[technique].metadata.outcome]++;
        techniques[technique].reset();
      }
    }
  }*/

  const postTechniques = mapping['post'];
  const postSelectors = Object.keys(postTechniques);

  await executeTechniques(report, sourceHTML, postSelectors, postTechniques);

  /*for (const selector of postSelectors || []) {
    for (const technique of postTechniques[selector] || []) {
      if (techniquesToExecute[technique]) {
        let elements = stew.select(processedHTML, selector);
        if (elements.length > 0) {
          for (const elem of elements || []) {
            await techniques[technique].execute(elem, processedHTML);
          }
        } else {
          await techniques[technique].execute(undefined, processedHTML);
        }
        report[technique] = techniques[technique].getFinalResults();
        report.metadata[report.techniques[technique].metadata.outcome]++;
        techniques[technique].reset();
      }
    }
  }*/

  resetConfiguration();

  return report;
}

export { configure, executeHTMLT };
