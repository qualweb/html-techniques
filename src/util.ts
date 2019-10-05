'use strict';

import { DomElement, DomUtils } from 'htmlparser2';
import html from 'htmlparser-to-html';
import _ from 'lodash';

const stew = new (require('stew-select')).Stew();

function getSelfLocationInParent(element: DomElement): string {
    let selector = '';

    if (element.name === 'body' || element.name === 'head') {
        return element.name;
    }

    let sameEleCount = 0;

    let prev = element.prev;
    while (prev) {
        if (prev.type === 'tag' && prev.name === element.name) {
            sameEleCount++;
        }
        prev = prev.prev;
    }

    selector += `${element.name}:nth-of-type(${sameEleCount + 1})`;

    return selector;
}

function getElementSelector(element: DomElement): string {

    if (element.name === 'html') {
        return 'html';
    } else if (element.name === 'head') {
        return 'html > head';
    } else if (element.name === 'body') {
        return 'html > body';
    }

    let selector = 'html > ';

    let parents = new Array<string>();
    let parent = element.parent;
    while (parent && parent.name !== 'html') {
        parents.unshift(getSelfLocationInParent(parent));
        parent = parent.parent;
    }

    selector += _.join(parents, ' > ');
    selector += ' > ' + getSelfLocationInParent(element);

    return selector;
}

function transform_element_into_html(element: DomElement, withText: boolean = true, fullElement: boolean = false): string {

    if (!element) {
        return '';
    }

    let codeElement: DomElement = _.clone(element);

    if (codeElement.attribs) {
        delete codeElement.attribs['computed-style'];
        delete codeElement.attribs['w-scrollx'];
        delete codeElement.attribs['w-scrolly'];
        delete codeElement.attribs['b-right'];
        delete codeElement.attribs['b-bottom'];
    }

    if (codeElement.attribs && codeElement.attribs.id && _.startsWith(codeElement.attribs.id, 'qualweb_generated_id')) {
        delete codeElement.attribs.id;
    }

    if (!fullElement) {
        if (withText) {
            let children = _.clone(codeElement.children);
            codeElement.children = [];

            for (let child of children || []) {
                if (child.type === 'text') {
                    codeElement.children.push(_.clone(child));
                }
            }
        } else {
            codeElement.children = [];
        }
    }

    return html(codeElement);
}

//multiple labels

function getAccessibleName(element: DomElement, processedHTML: DomElement[], reference: boolean): string {

    let isHidden, id, ariaLabelBy, ariaLabel,  textAlternative, nameFromContent;
    let textElement = getText(element);
    let title;
    let defaultName = getDefaultname(element);
    let hasRolePresentOrNone, hasControlWithinLabele, isReferenced = false;
    let  summaryChildOfDetails, isSummary;
    summaryChildOfDetails = summaryAsChildOfDetails(element);
    isSummary = element.name === "summary";
    let summaryCheck = ((isSummary && summaryChildOfDetails) || !isSummary);
    let referencedByWidgetVal;

    if (element.attribs) {
        title = element.attribs.title;
        ariaLabelBy = getElementById(element.attribs["aria-labelledby"], processedHTML) ? element.attribs["aria-labelledby"] : "";
        ariaLabel = element.attribs["aria-label"];
        id = element.attribs["id"];
        nameFromContent = allowsNameFromContent(element);
        isHidden = elementIsHidden(element);
        textAlternative = getTextAlternative(element, processedHTML, id);
        hasRolePresentOrNone = hasRolePresentationOrNone(element);
    }

    if (id) {
        referencedByWidgetVal = referencedByWidget(element, id, processedHTML);
        hasControlWithinLabele = hasControlWithinLabel(id,element, processedHTML);
        isReferenced = elementIsReferenced(id, processedHTML, element);
    }
    console.log(id+ element.name);
    //console.log("aria-lblBy"+ariaLabelBy);
    // console.log(isControle + "emb" + isEmbededControl);

    if (isHidden && !reference && !isReferenced) {//A
        return "" + "A";
    } else if (ariaLabelBy !== "" && !reference && summaryCheck) {//B
        // console.log(getElementById(ariaLabelBy, processedHTML)[0]);
        return getAccessibleNameFromAriaLabelBy(ariaLabelBy, processedHTML) + "B";
    } else if (ariaLabel && _.trim(ariaLabel) !== "" && !(referencedByWidgetVal && hasControlWithinLabele && reference) && summaryCheck) {//C
        return ariaLabel + "C";
    } else if (textAlternative && !hasRolePresentOrNone && summaryCheck&&!(referencedByWidgetVal && hasControlWithinLabele)) {//D
        return textAlternative + "D";
    } else if (referencedByWidgetVal && hasControlWithinLabele) {//E adicionar  a AN do label
        return getValueFromLabelWithControl(id,element, processedHTML) + "E";
    } else if ((nameFromContent || isReferenced)) {//F
        let textFromCss = getTextFromCss(element, textElement);
        console.log("css" + textFromCss);
        return getAccessibleNameFromChildren(element,processedHTML, textFromCss) + "F";
    } else if (textElement !== "") {//G
        return textElement +"G";
    } else if (title !== undefined) {//I toolTip
        return title + "I";
    }
    else if (defaultName !== "" && summaryCheck) {//J deafault name
        return title + "I";
    } else {
        return "";
    }

}


function elementIsHidden(element: DomElement): boolean {
    if (!element.attribs)
      return false;
    let aria_hidden = element.attribs["aria-hidden"] === 'true';
    let hidden = element.attribs["hidden"] !== undefined;
    let cssHidden = elementIsHiddenCSS(element);
    let parent = element.parent;
    let parentHidden = false;
  
    if (parent) {
      parentHidden = elementIsHidden(parent);
    }
    return cssHidden || hidden || aria_hidden || parentHidden;
  }
  
  function elementIsHiddenCSS(element: DomElement): boolean {
    if (!element.attribs)
      return false;
    let visibility = false;
    let displayNone = false;
    if (element.attribs['computed-style'] !== undefined) {
      displayNone = _.trim(getComputedStylesAttribute(element, "computed-style", "^ display:")) === 'none';
      let visibilityATT = _.trim(getComputedStylesAttribute(element, "computed-style", "^ visibility:"));
      visibility = visibilityATT === 'collapse' || visibilityATT === 'hidden';
    }
    return visibility || displayNone;
  }
  
  function getComputedStylesAttribute(element: DomElement, computedStyle: string, attribute: string): string {
    if (!element.attribs || !element.attribs[computedStyle]) {
      return "";
    }
    let computedStyleContent = element.attribs[computedStyle]
    let attribs = computedStyleContent.split(";");
    let isAttr = new RegExp(attribute);
    let attributeContent = "";
    for (let attr of attribs) {
      if (isAttr.test(attr)){
        attributeContent = attr.split(isAttr)[1];
        }
    }
    return attributeContent.replace("&quot", "");
  }

function elementIsReferenced(id: string, processedHTML: DomElement[], element: DomElement): boolean {

    let refrencedByAriaLabel = stew.select(processedHTML, `[aria-labelledby="${id}"]`);
    let refrencedByLabel = stew.select(processedHTML, `label[for="${id}"]`);
    let parent = element.parent;

    return (parent && parent.name === "label") || refrencedByAriaLabel.length !== 0 || refrencedByLabel.length !== 0;

}


function referencedByWidget(element: DomElement, id: string, processedHTML: DomElement[]): boolean {
    if (!element.attribs)
        return false;
    //label for id widget
    // aria label by id widget
    // widget com texto
    let text = DomUtils.getText(element);
    let widget = isWidget(element);
    let forAtt = element.attribs["for"];
    //let parent = element.parent
    //let refrencedByLabel = stew.select(processedHTML, `label[for="${id}"]`);
    let refrencedByAriaLabel = stew.select(processedHTML, `[aria-labelledby="${id}"]`);
    let result = false;
    let referenced = getElementById(forAtt, processedHTML);
    //console.log(element.name);
    //console.log(text);
    //console.log(forAtt);
   // console.log(referenced)

    if (forAtt && referenced) {
        result = isWidget(referenced[0]);
    } else if (refrencedByAriaLabel.length > 0) {
        result = isWidget(refrencedByAriaLabel[0]);
    } else if (widget && text) {//caso de AN de control dentro de label
        result = true;
    }
   // console.log(result)
    return result;

}


/** function isControl(element: DomElement): boolean {

    let controlRoles = ["textbox", "button", "combobox", "listbox", "range","progressbar","scrollbar","slider","spinbutton"];

    if (element.attribs === undefined)
        return false;

    let role = element.attribs.role;

    return controlRoles.indexOf(role) >= 0


}*/

function getElementById(id: string | undefined, processedHTML: DomElement[]): DomElement[] {
    let element;
    if (id)
        element = stew.select(processedHTML, '[id="' + id + '"]');

    return element;

}

function hasControlWithinLabel(id:string,element: DomElement, processedHTML: DomElement[]): boolean {
    let label = element;
    /** label = getLabel(id,processedHTML,element);
    if(!label)
        label = element;*/


    let hasControlWithinLabel = stew.select(label, `[role="spinbutton"],[role="slider"],[role="scrollbar"],role="progressbar"],[role="textbox"],[role="button"],[role="combobox"],[role="listbox"],[role="range"],button,select,textarea,input[type="text"]`);
    console.log(hasControlWithinLabel.length> 0);
    return hasControlWithinLabel.length > 0;


}

function getTextAlternative(element: DomElement, processedHTML: DomElement[], id: string): string {
    if (!element.attribs)
        return "";

    let alt = element.attribs["alt"];

    let title = element.attribs["title"];
    let value = element.attribs["value"];
    let placeHolder = element.attribs["placeholder"];
    let labelContent;

    let caption, figcaption, legend;

    if (id) {
        labelContent = stew.select(processedHTML, 'label[for="' + id + '"]');
    }
    if (element.name === 'table') {
        caption = stew.select(element, 'caption');
    }

    if (element.name === 'figure') {
        figcaption = stew.select(element, 'figcaption');
    }
    if (element.name === 'fieldset') {
        legend = stew.select(element, 'legend');
    }


    if (alt !== undefined && _.trim(alt) !== "")
        return alt;
    else if (title !== undefined && _.trim(title) !== "")
        return title;
    else if (labelContent && labelContent.length !== 0)
        return getText(labelContent[0]);
    else if (caption && caption.length !== 0)
        return getText(caption[0]);
    else if (value && _.trim(value) !== "")
        return value;
    else if (figcaption && figcaption.length !== 0)
        return getText(figcaption[0]);
    else if (legend && legend.length !== 0)
        return getText(legend[0]);
    else if (placeHolder && _.trim(placeHolder) !== "")
        return placeHolder;
    else
        return "";
}


function hasRolePresentationOrNone(element: DomElement): boolean {
    return !!element.attribs && (element.attribs["role"] === "none" || element.attribs["role"] === "presentation");

}

function getLabel(id: string, processedHTML: DomElement[], element: DomElement): DomElement {


    let refrencedByLabel = stew.select(processedHTML, `label[for="${id}"]`);
    let parent = element.parent;

    let result;


    if (refrencedByLabel.length !== 0) {

        result = refrencedByLabel[0];
    }
    else if (parent && parent.name === "label") {

        result = parent;
    }

    return result;

}

function getValueFromLabelWithControl(id: string,element: DomElement, processedHTML: DomElement[]): string {
    let label;
    label = getLabel(id,processedHTML,element);
    if(!label)
        label = element;
       
    let value = "";
    console.log(element.name);
    if (!label.children)
        return "";
    
    for (let child of label.children) {
        if (child.type === 'text')
            value +=  child.data;
        else
            value += getValueFromEmbededControl(child, processedHTML);

    }
    return value;


}

//adidcionar roles filhos e elementos html relacionados. adiconar selected
function getValueFromEmbededControl(element: DomElement, processedHTML: DomElement[]): string {//stew
    if (!element.attribs)
        return "";

    let role = element.attribs.role;
    let value = "";


    if ((element.name === "textarea" || role === "textbox") && element.children !== undefined) {
        value = DomUtils.getText(element);
    }else if (element.name === "input" && element.attribs && element.attribs["type"] === "text") {
        value = element.attribs["value"];
    }
    else if ((element.name === "button" || role === "button") && element.children !== undefined) {
        value = DomUtils.getText(element);
    }
    else if (role === "combobox") {
        let refrencedByLabel = stew.select(element, `[aria-activedescendant]`);
        let aria_descendendant, selectedElement;
        if (refrencedByLabel.length > 0) {
            aria_descendendant = refrencedByLabel[0].attribs["aria-activedescendant"];
            selectedElement = stew.select(element, `[id="${aria_descendendant}"]`);
        }

        let aria_owns = element.attribs["aria-owns"];
        let elementasToSelect = stew.select(processedHTML, `[id="${aria_owns}"]`);

        let elementWithAriaSelected;
        if (elementasToSelect.length > 0)
            elementWithAriaSelected = stew.select(elementasToSelect[0], `aria-selected="true"`);


        if (selectedElement.length > 0) {
            value = DomUtils.getText(selectedElement[0]);
        } else if (elementWithAriaSelected.length > 0) {
            value = DomUtils.getText(elementWithAriaSelected[0]);
        }

    }
    else if (role === "listbox" || element.name === 'select') {
        let elementsWithId = stew.select(element, `[id]`);
        let elementWithAriaSelected = stew.select(element, `aria-selected="true"`);
        let selectedElement = [];
        let optionSelected;

        for (let elementWithId of elementsWithId) {
            if (selectedElement.length === 0) {
                let id = elementWithId.attribs.id;
                selectedElement = stew.select(element, `[aria-activedescendant="${id}"]`);
            }
        }

        if (element.name === 'select') {
            optionSelected = stew.select(element, `[selected]`);
        }

        if (selectedElement.length > 0)
            value = DomUtils.getText(elementsWithId[0]);
        else if (elementWithAriaSelected.length > 0) {
            value = DomUtils.getText(elementWithAriaSelected[0]);
        }
        else if (optionSelected.length > 0) {
            value = DomUtils.getText(optionSelected[0]);
        }
    }
    else if (role === "range"||role === "progressbar" || role === "scrollbar"||role === "slider"|| role === "spinbutton") {
        if (element.attribs["aria-valuetext"] !== undefined)
            value = element.attribs["aria-valuetext"];
        else if (element.attribs["aria-valuenow"] !== undefined)
            value = element.attribs["aria-valuenow"];
    }

    return value;


}

function getText(element: DomElement): string {

    return _.trim(DomUtils.getText(element));
}

function isWidget(element: DomElement): boolean {

    let widgetRoles = ["button", "checkbox", "gridcell", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "progressbar", "radio", "scrollbar", "searchbox", "separator", "slider", "spinbutton", "switch", "tab", "tabpanel", "textbox", "treeitem"];

    if (element.attribs === undefined)
        return false;

    let role = element.attribs.role;

    return widgetRoles.indexOf(role) >= 0;
}



function allowsNameFromContent(element: DomElement): boolean {

    if (element.attribs === undefined)
        return false;

    let nameFromContentRoles = ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowgroup", "rowheader", "switch", "tab", "tooltip", "tree", "treeitem"];

    let role = element.attribs.role;

    return nameFromContentRoles.indexOf(role) >= 0;
}

function getTextFromCss(element: DomElement, textContent: string): string {

    let before = getComputedStylesAttribute(element, "computed-style-before", "^ content:&quot;");
    let after = getComputedStylesAttribute(element, "computed-style-after", "^ content:&quot;");


    return before + textContent + after;

}


function getAccessibleNameFromChildren(element: DomElement,processedHTML: DomElement[], acumulatedText: string): string {

    if (element.children) {
        for (let child of element.children) {

            acumulatedText += getAccessibleName(child,processedHTML,false);
        }
    }
    return acumulatedText;
}

//default name
function getDefaultname(element: DomElement): string {
    let name = element.name;
    let type;

    if (element.attribs) {
        type = element.attribs["type"];
    }
    let result = "";

    if (type === "image") {
        result = "image";
    }
    else if (type === "submit") {
        result = "reset";
    }
    else if (type === "reset") {
        result = "reset";
    }
    else if (name === "summary") {
        result = "details";
    }

    return result;

}
//summary
function summaryAsChildOfDetails(element: DomElement): boolean {
    return !!element.parent && element.parent.name === "details";
}

function getAccessibleNameFromAriaLabelBy(araLabelId: string, processedHTML: DomElement[]): string {
    let ListIDREFS = araLabelId.split(" ");
    let result = "";

    for (let id of ListIDREFS) {
        result = result + getAccessibleName(getElementById(id, processedHTML)[0], processedHTML, true);
    }

    return result;
}



export {
    getAccessibleName,
    getElementSelector,
    transform_element_into_html
};
