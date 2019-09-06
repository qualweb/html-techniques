'use strict';

import {DomElement} from 'htmlparser2';
import html from 'htmlparser-to-html';
import _ from 'lodash';

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

function getAccessibleName(element: DomElement, processedHTML: DomElement[], reference: boolean): string {


    let noAttributes = element.attribs === undefined;
    let isHidden = elementIsHidden(element, noAttributes);
    let id, ariaLabelBy, ariaLabel;
    let isReferenced = elementIsReferenced(id, processedHTML);
    let isEmbededControl = isEmbededControl(element);
    let textAlternative;
    let hasRolePresentOrNone = false;

    if (!noAttributes) {
        id = element.attribs["id"];
        ariaLabelBy = getElementById(element.attribs["ariaLabelBy"], processedHTML) === [] ? undefined : element.attribs["ariaLabelBy"];
        ariaLabel = element.attribs["ariaLabel"];
        textAlternative = getTextAlternative(element);
        hasRolePresentOrNone = hasRolePresentationOrNone();

    }

    if (isHidden && !reference && !isReferenced) {//A
        return ""
    } else if (ariaLabelBy !== undefined && !reference) {//B
        return getAccessibleName(getElementById(ariaLabelBy, processedHTML), processedHTML, true);
    } else if (_.trim(ariaLabel) !== "" && !(isEmbededControl && reference)) {//C
        return ariaLabel;
    }else if(textAlternative != undefined && !hasRolePresentOrNone){//D
        return textAlternative;
    }else if(isControlWithinLabel(element,processedHTML) ){//E o q fazer se nao for nenhum dos roles?
        return getValueFromEmbededControl(element);
    }else if (false){//F todo

    }else if (element.name === "text"){//G
        return element.data;
    }else {//I toolTip
        return "todo";
    }

    return "";
}

function elementIsHidden(element: DomElement, noAttributes: boolean): boolean {

}

function elementIsReferenced(id: string, processedHTML: DomElement[]): boolean {//stew

}

function getElementById(id: string, processedHTML: DomElement[]): DomElement {//stew

}

function isEmbededControl(element: DomElement): boolean {//stew

}

function getTextAlternative(element: DomElement): string {//stew

}
function hasRolePresentationOrNone(element: DomElement): boolean {//stew

}
function isControlWithinLabel (element: DomElement, processedHTML: DomElement[]): boolean {

}
function getValueFromEmbededControl(element: DomElement): string {//stew

}




export {
    getAccessibleName,
    getElementSelector,
    transform_element_into_html
};
