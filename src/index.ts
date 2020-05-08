'use strict';

import { HTMLTOptions, HTMLTechniquesReport } from '@qualweb/html-techniques';
import { Optimization } from '@qualweb/util';

import * as techniques from './lib/techniques';

import mapping from './lib/mapping';
import { QWPage } from '@qualweb/qw-page';

class HTMLTechniques {

  private optimization = Optimization.Performance;
  private htmlValidatorEndpoint: string | undefined = undefined;
  private techniques: any;
  private techniquesToExecute: any;

  constructor(options?: HTMLTOptions) {
    this.techniques = {};
    this.techniquesToExecute = {};

    for(const technique of Object.keys(techniques) || []) {
      const _technique = technique.replace(/_/g, '-');
      this.techniques[_technique] = new techniques[technique]();
      this.techniquesToExecute[_technique] = true;
    }

    if (options) {
      this.configure(options);
    }
  }

  public configure(options: HTMLTOptions): void {
    if (options.principles) {
      options.principles = options.principles.map(p => (p.charAt(0).toUpperCase() + p.toLowerCase().slice(1)).trim());
    }
    if (options.levels) {
      options.levels = options.levels.map(l => l.toUpperCase().trim());
    }
    if (options.techniques) {
      options.techniques = options.techniques.map(t => t.toUpperCase().trim());
    }
  
    for (const technique of Object.keys(this.techniques) || []) {
      this.techniquesToExecute[technique] = true;
  
      if (options.principles && options.principles.length !== 0) {
        if (options.levels && options.levels.length !== 0) {
          if (!this.techniques[technique].hasPrincipleAndLevels(options.principles, options.levels)) {
            this.techniquesToExecute[technique] = false;
          }
        } else if (!this.techniques[technique].hasPrincipleAndLevels(options.principles, ['A', 'AA', 'AAA'])) {
          this.techniquesToExecute[technique] = false;
        }
      } else if (options.levels && options.levels.length !== 0) {
        if (!this.techniques[technique].hasPrincipleAndLevels(['Perceivable', 'Operable', 'Understandable', 'Robust'], options.levels)) {
          this.techniquesToExecute[technique] = false;
        }
      }
      if (!options.principles && !options.levels) {
        if (options.techniques && options.techniques.length !== 0) {
          if (!options.techniques.includes(technique) && !options.techniques.includes(this.techniques[technique].getTechniqueMapping())) {
            this.techniquesToExecute[technique] = false;
          }
        }
      } else {
        if (options.techniques && options.techniques.length !== 0) {
          if (options.techniques.includes(technique) || options.techniques.includes(this.techniques[technique].getTechniqueMapping())) {
            this.techniquesToExecute[technique] = true;
          }
        }
      }
    }

    if (options.optimize) {
      if (options.optimize.toLowerCase() === 'performance') {
        this.optimization = Optimization.Performance;
      } else if (options.optimize.toLowerCase() === 'error-detection') {
        this.optimization = Optimization.ErrorDetection;
      }
    }

    if (options.htmlValidatorEndpoint) {
      this.htmlValidatorEndpoint = options.htmlValidatorEndpoint;
    }
  }
  
  public resetConfiguration(): void {
    for (const technique in this.techniquesToExecute || {}) {
      this.techniquesToExecute[technique] = true;
    }
  }

  private async executeTechnique(technique: string, selector: string, page: QWPage, report: HTMLTechniquesReport): Promise<void> {
    const elements = await page.getElements(selector);
    if (elements.length > 0) {
      for (const elem of elements || []) {
        try {
          await this.techniques[technique].execute(elem, page, this.optimization);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      try {
        await this.techniques[technique].execute(undefined, page, this.optimization);
      } catch (err) {
        console.error(err);
      }
    }

    report.assertions[technique] = this.techniques[technique].getFinalResults();
    report.metadata[report.assertions[technique].metadata.outcome]++;
    this.techniques[technique].reset();
  }
  
  private async executeMappedTechniques(report: HTMLTechniquesReport, page: QWPage, selectors: string[], mappedTechniques: any): Promise<void> {
    const promises = new Array<any>();
    for (const selector of selectors || []) {
      for (const technique of mappedTechniques[selector] || []) {
        if (this.techniquesToExecute[technique]) {
          promises.push(this.executeTechnique(technique, selector, page, report));
        }
      }
    }
    await Promise.all(promises);
  }
  
  private async executeNotMappedTechniques(report: HTMLTechniquesReport, page: QWPage): Promise<void> {
    if (this.techniquesToExecute['QW-HTML-T20']) {
      await this.techniques['QW-HTML-T20'].validate(page, this.htmlValidatorEndpoint);
      report.assertions['QW-HTML-T20'] = this.techniques['QW-HTML-T20'].getFinalResults();
      report.metadata[report.assertions['QW-HTML-T20'].metadata.outcome]++;
      this.techniques['QW-HTML-T20'].reset();
    }
  
    if (this.techniquesToExecute['QW-HTML-T35']) {
      await this.techniques['QW-HTML-T35'].validate(page);
      report.assertions['QW-HTML-T35'] = this.techniques['QW-HTML-T35'].getFinalResults();
      report.metadata[report.assertions['QW-HTML-T35'].metadata.outcome]++;
      this.techniques['QW-HTML-T35'].reset();
    }
  }
  
  public async execute(page: QWPage): Promise<HTMLTechniquesReport> {
  
    const report: HTMLTechniquesReport = {
      type: 'html-techniques',
      metadata: {
        passed: 0,
        warning: 0,
        failed: 0,
        inapplicable: 0
      },
      assertions: {}
    };
  
    //await executeMappedTechniques(url,report, sourceHTML, Object.keys(mapping.pre), mapping.pre);

    await Promise.all([
      this.executeMappedTechniques(report, page, Object.keys(mapping.post), mapping.post),
      this.executeNotMappedTechniques(report, page)
    ]);
  
    return report;
  }
}

export { HTMLTechniques };
