import { HTMLTOptions, HTMLTechniquesReport } from '@qualweb/html-techniques';
import { QWPage } from '@qualweb/qw-page';
import * as techniques from './lib/techniques';
import mapping from './lib/mapping';

class HTMLTechniques {

  private techniques: any;
  private techniquesToExecute: any;

  constructor(options?: HTMLTOptions) {
    this.techniques = {};
    this.techniquesToExecute = {};

    for (const technique of Object.keys(techniques) || []) {
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
  }

  public resetConfiguration(): void {
    for (const technique in this.techniquesToExecute || {}) {
      this.techniquesToExecute[technique] = true;
    }
  }

  private executeTechnique(technique: string, selector: string, page: QWPage, report: HTMLTechniquesReport): void {
    const elements = page.getElements(selector);
    if (elements.length > 0) {
      for (const elem of elements || []) {
        try {
          this.techniques[technique].execute(elem, page);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      try {
        this.techniques[technique].execute(undefined, page);
      } catch (err) {
        console.error(err);
      }
    }

    report.assertions[technique] = this.techniques[technique].getFinalResults();
    report.metadata[report.assertions[technique].metadata.outcome]++;
    this.techniques[technique].reset();
  }

  private executeMappedTechniques(report: HTMLTechniquesReport, page: QWPage, selectors: string[], mappedTechniques: any): void {
    for (const selector of selectors || []) {
      for (const technique of mappedTechniques[selector] || []) {
        if (this.techniquesToExecute[technique]) {
          this.executeTechnique(technique, selector, page, report)
        }
      }
    }
  }

  private executeNotMappedTechniques(report: HTMLTechniquesReport, newTabWasOpen: boolean, validation): void {
    if (this.techniquesToExecute['QW-HTML-T20']) {
      this.techniques['QW-HTML-T20'].validate(validation);
      report.assertions['QW-HTML-T20'] = this.techniques['QW-HTML-T20'].getFinalResults();
      report.metadata[report.assertions['QW-HTML-T20'].metadata.outcome]++;
      this.techniques['QW-HTML-T20'].reset();
    }

    if (this.techniquesToExecute['QW-HTML-T35']) {
      this.techniques['QW-HTML-T35'].validate(newTabWasOpen);
      report.assertions['QW-HTML-T35'] = this.techniques['QW-HTML-T35'].getFinalResults();
      report.metadata[report.assertions['QW-HTML-T35'].metadata.outcome]++;
      this.techniques['QW-HTML-T35'].reset();
    }
  }

  public execute(page: QWPage, newTabWasOpen: boolean, validation: any): HTMLTechniquesReport {

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

    this.executeMappedTechniques(report, page, Object.keys(mapping), mapping)
    this.executeNotMappedTechniques(report, newTabWasOpen, validation);

    return report;
  }
}

export { HTMLTechniques };
