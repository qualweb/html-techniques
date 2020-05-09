'use strict';

import { HTMLTechniqueResult } from '@qualweb/html-techniques';
import Technique from '../lib/Technique.object';
import { QWElement } from "@qualweb/qw-element";

class QW_HTML_T25 extends Technique {

  constructor() {
    super({
      name: 'Positioning labels to maximize predictability of relationships',
      code: 'QW-HTML-T25',
      mapping: 'G162',
      description: 'This technique checks the correct position of labels in forms',
      metadata: {
        target: {
          element: 'form'
        },
        'success-criteria': [{
            name: '1.3.1',
            level: 'A',
            principle: 'Perceivable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'
          },
          {
            name: '3.3.2',
            level: 'A',
            principle: 'Understandable',
            url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions'
          },
        ],
        related: ['H44', 'H71', 'H65', 'G131', 'G167'],
        url: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G162.html',
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: '',
        description: '',
      },
      results: new Array < HTMLTechniqueResult > ()
    });
  }

  execute(element: QWElement | undefined): void {

    if (!element) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const result = this.verifyInputLabelPosition(element);

    if (result === 'checkbox') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The checkbox label is not immediately after the field';
      evaluation.resultCode = 'RC1';
    } else if (result === 'radio') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The radio label is not immediately after the field';
      evaluation.resultCode = 'RC2';
    } else if (result === 'other') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The form field label is not immediately before the field';
      evaluation.resultCode = 'RC3';
    } else if (result === 'noLabel') {
      evaluation.verdict = 'failed';
      evaluation.description = 'The form field does not have a label';
      evaluation.resultCode = 'RC4';
    } else if (result === 'pass') {
      evaluation.verdict = 'passed';
      evaluation.description = 'The form field has well positioned label';
      evaluation.resultCode = 'RC5';
    }

    super.addEvaluationResult(evaluation, element);
  }

  private verifyInputLabelPosition(element: QWElement): string | undefined {
    if (element.elementHasAttributes()) {
      const type = element.getElementAttribute('type');

      const prevElement = element.getElementPreviousSibling();
      let prevElementTagName;
      let prevElementHasAttributes;
      let prevElementAttributeFor;

      if (prevElement) {
        prevElementTagName = prevElement.getElementTagName();
        prevElementHasAttributes = prevElement.elementHasAttributes();
        prevElementAttributeFor = prevElement.getElementAttribute('for');
      }

      const nextElement = element.getElementNextSibling();
      let nextElementTagName;
      let nextElementHasAttributes;
      let nextElementAttributeFor;

      if (nextElement) {
        nextElementTagName = nextElement.getElementTagName();
        nextElementHasAttributes = nextElement.elementHasAttributes();
        nextElementAttributeFor = nextElement.getElementAttribute('for');
      }

      const elementId = element.getElementAttribute('id');

      if (type && (type === 'radio' || type === 'checkbox')) {
        if (nextElement) {
          if (nextElementTagName === 'label' && nextElementHasAttributes && nextElementAttributeFor === elementId) {
            return 'pass';
          }
        } else if (prevElement) {
          if (prevElementTagName === 'label' && prevElementHasAttributes && prevElementAttributeFor === elementId) {
            return type;
          }
        } else {
          return 'noLabel';
        }
      }
      if (type && (type !== 'checkbox' && type !== 'radio')) {
        if (prevElement) {
          if (prevElementTagName === 'label' && prevElementHasAttributes && prevElementAttributeFor === elementId) {
            return 'pass';
          }
        } else if (nextElement) {
          if (nextElementTagName === 'label' && nextElementHasAttributes && nextElementAttributeFor === elementId) {
            return 'other';
          }
        } else {
          return 'noLabel';
        }
      }
    }

    return undefined;
  }
}

export = QW_HTML_T25;
