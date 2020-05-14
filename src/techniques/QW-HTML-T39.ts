"use strict";

import { HTMLTechniqueResult } from "@qualweb/html-techniques";
import { AccessibilityUtils } from "@qualweb/util";
import Technique from "../lib/Technique.object";
import { QWElement } from "@qualweb/qw-element";
import { QWPage } from "@qualweb/qw-page";

class QW_HTML_T39 extends Technique {
  constructor() {
    super({
      name: "Accessible name on img elements",
      code: "QW-HTML-T39",
      mapping: "H37",
      description:
        'When using the img element, specify a short text alternative with the correct attribute (alt, title) or element (title, desc).',
      metadata: {
        target: {
          element: "img",
        },
        "success-criteria": [
          {
            name: "1.1.1",
            level: "A",
            principle: "Perceivable",
            url: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content",
          },
        ],
        related: ["G82", "H2", "H24", "H45", "H30"],
        url: "https://www.w3.org/WAI/WCAG21/Techniques/html/H37",
        passed: 0,
        warning: 0,
        failed: 0,
        outcome: "",
        description: "",
      },
      results: new Array<HTMLTechniqueResult>(),
    });
  }

  execute(element: QWElement | undefined, page: QWPage): void {
    if (element === undefined) {
      return;
    }

    const evaluation: HTMLTechniqueResult = {
      verdict: "",
      description: "",
      resultCode: "",
    };

    let AName, alt, inAT;

    alt = element.getElementAttribute("alt");
    inAT = AccessibilityUtils.isElementInAT(element, page);
    AName = AccessibilityUtils.getAccessibleName(element, page);

    if (!inAT || alt === "") {
      //inapplicable (presentation)
    } else {
      if (!AName || AName.trim() === "") {
        evaluation.verdict = "failed";
        evaluation.description = `The image does not have an accessible name`;
        evaluation.resultCode = "RC1";
      } else {
        evaluation.verdict = "warning";
        evaluation.description = `Please verify that the accessible name describes the image correctly`;
        evaluation.resultCode = "RC2";
      }

      super.addEvaluationResult(evaluation, element);
    }
  }
}

export = QW_HTML_T39;
