'use strict';

import {DomElement,DomUtils} from 'htmlparser2';
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

//Falta E,F
function getAccessibleName(element: DomElement, processedHTML: DomElement[], reference: boolean): string {

    let isHidden,id,ariaLabelBy, ariaLabel,isControle,textAlternative,nameFromContent;
    
    let textElement = getText(element);
    
    let title;
    let hasRolePresentOrNone,isEmbededControl,isReferenced = false;

    if(element.attribs){
        title = element.attribs.title;
        ariaLabelBy = getElementById(element.attribs["aria-labelledby"], processedHTML) ?  element.attribs["aria-labelledby"] : "";
        ariaLabel = element.attribs["aria-label"];
        id = element.attribs["id"];
        nameFromContent = allowsNameFromContent(element);
        isControle = isControl(element);
        isHidden = elementIsHidden(element);
        textAlternative = getTextAlternative(element,processedHTML,id);
        hasRolePresentOrNone = hasRolePresentationOrNone(element);
    }  

    if(id){
        isEmbededControl = isEmbededinWidget(element, processedHTML,id);
        isReferenced = elementIsReferenced(id, processedHTML);

    }
    console.log(element.name);
    console.log("text"+textElement+"textAlt"+ textAlternative);
    

    console.log(isHidden+"ref"+isReferenced);
    console.log(ariaLabelBy);

    if (isHidden && !reference && !isReferenced) {//A
        return ""+"A";
    } else if (ariaLabelBy !== "" && !reference) {//B
        console.log(getElementById(ariaLabelBy, processedHTML)[0]);
        return getAccessibleName(getElementById(ariaLabelBy, processedHTML)[0], processedHTML, true)+"B";
    } else if (_.trim(ariaLabel) !== "" && !(isControle && isEmbededControl && reference)) {//C
        return ariaLabel+"C";
    } else if (textAlternative && !hasRolePresentOrNone) {//D
        return textAlternative+"D";
    } else if (isControle && isEmbededControl) {//E
        return getValueFromEmbededControl(element)+"E";
    } else if (false&&(nameFromContent||isReferenced)) {//F todo
       // let textFromCss = getTextFromCss(element);
       // return getAccessibleNameFromChildren(element,textFromCss);
       return  "waiting for fix";
    } else if (textElement !== "") {//G
        return textElement+"G";
    } else if (title !== undefined) {//I toolTip
        return title+"I";
    }else{
        return "noname";
    }

}

function elementIsHidden(element: DomElement): boolean {
    // let styles = element.styles;
    if(!element.attribs)
        return false;


    let aria_hidden = Boolean(element.attribs["aria-hidden"]);
    let hidden = Boolean(element.attribs["hidden"]);
    let displayNone = false;
    //fixme css parser
    //if (element.attribs['computed-style'] !== undefined)
        //displayNone = element.attribs['computed-style']['display'] === 'none';

    let hasRolePresentOrNone = hasRolePresentationOrNone(element);
    return hasRolePresentOrNone || displayNone || hidden || aria_hidden;
}

function elementIsReferenced(id: string, processedHTML: DomElement[]): boolean {


    let refrencedByAriaLabel = stew.select(processedHTML, `[aria-labelledby="${id}"]`);
    let refrencedByDecribeAriaLabel = stew.select(processedHTML, `[aria-describedby="${id}"]`);
    let refrencedByLabel = stew.select(processedHTML, `label[for="${id}"]`);
    // let refrencedByheader = stew.select(processedHTML, `object[id="${id}"]>param`);

    return refrencedByAriaLabel.length !== 0 || refrencedByDecribeAriaLabel.length !== 0 || refrencedByLabel.length !== 0;

}

function getElementById(id: string|undefined, processedHTML: DomElement[]): DomElement[] {
    let element;
    if(id)
        element = stew.select(processedHTML, '[id="'+id+'"]');

    return element;

}

function isEmbededinWidget(element: DomElement, processedHTML: DomElement[], id:string): boolean {//stew

    let refrencedByAriaLabel = stew.select(processedHTML, `[aria-labelledby="${id}"]`);
    let refrencedByLabel = stew.select(processedHTML, `label[for="${id}"]`);
    let withinLabel = withingLabelOfWidget(element);

    let referenced;
    let result = false;

    if (refrencedByAriaLabel.length !== 0) {
        referenced = refrencedByAriaLabel[0];
        result = isWidget(referenced);

    } else if (refrencedByLabel.length !== 0) {

        referenced = refrencedByLabel[0];
        result = isWidget(referenced);

    }else {

        result = withinLabel;
    }

    return result;


}

function getTextAlternative(element: DomElement, processedHTML: DomElement[],id:string): string {//alt , title,label, fig capition  se for object procurar params
    if(!element.attribs)
        return "";

    let alt = element.attribs.alt;

    let title = element.attribs.title;
    let labelContent;

    console.log('label[for="'+ id+ '"]');
    console.log(id);

    if(id){
     labelContent = stew.select(processedHTML, 'label[for="'+ id+ '"]');}

     console.log(labelContent);


    if (alt !== undefined && _.trim(alt) !== "")
        return alt;
    else if (title !== undefined && _.trim(title) !== "")
        return title;
    else if (labelContent&&labelContent.length !== 0)
        return getText(labelContent[0]);
    else
        return "";

}


function hasRolePresentationOrNone(element: DomElement): boolean {//stew
    return !!element.attribs && (element.attribs.role === "none" || element.attribs.role === "presentation");

}


function getValueFromEmbededControl(element: DomElement): string {//stew
    if(!element.attribs)
    return "";
    
    let role = element.attribs.role;
    let value = "";


    if(role === "textbox"&&element.children!== undefined){
        value = element.children[0].data;
    }
    else if(role === "button"&&element.children!== undefined){
        value = element.children[0].data;
    }
    else if(role === "combobox"){
        let refrencedByLabel = stew.select(element, `[aria-activedescendant]`);
        let aria_descendendant = refrencedByLabel.attribs["aria-activedescendant"];
        let selectedElement = stew.select(element, `[id=/"${aria_descendendant}"/]`);
        value = DomUtils.getText(selectedElement);
    }
    else if(role === "listbox"){
        let elementsWithId = stew.select(element, `[id]`);

        for(let elementWithId of elementsWithId){

            let id =  elementWithId.attribs.id;
            let selectedElement = stew.select(element, `[aria-activedescendant=/"${id}"/]`);

            if(selectedElement!== undefined)
                value = DomUtils.getText(elementsWithId);
        }
    }
    else {//range
        if(element.attribs["aria-valuetext"]!==undefined)
            value = element.attribs["aria-valuetext"];
        else if(element.attribs["aria-valuenow"]!==undefined)
            value = element.attribs["aria-valuenow"];
        else {//alt
            //TODO
        }

    }

    return value;


}

function getText(element: DomElement): string {

    return DomUtils.getText(element);
}

function isWidget(element: DomElement): boolean {

    let widgetRoles = ["button","checkbox","gridcell","link","menuitem", "menuitemcheckbox", "menuitemradio","option","progressbar","radio","scrollbar","searchbox","separator","slider","spinbutton", "switch", "tab", "tabpanel","textbox", "treeitem"];

    if(element.attribs=== undefined)
        return false;

    let role = element.attribs.role;

    return widgetRoles.indexOf(role)>=0;
}

function isControl(element: DomElement): boolean {

    let controlRoles = ["textbox","button","combobox","listbox","range"];

    if(element.attribs=== undefined)
        return false;

    let role = element.attribs.role;

    return controlRoles.indexOf(role)>=0


}
function withingLabelOfWidget(element: DomElement): boolean {

      let parent = element.parent;
      let text = "";
      let widget = false;

      if(parent!== undefined){
        text = DomUtils.getText(parent);
        widget = isWidget(parent);
    }
    

      return text!== "" && widget;
}


function allowsNameFromContent(element: DomElement): boolean {

    if(element.attribs=== undefined)
        return false;

    let nameFromContentRoles = ["button","cell","checkbox","columnheader","gridcell","heading","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","row","rowgroup","rowheader","switch","tab","tooltip","tree","treeitem"];

    let role = element.attribs.role;

    return nameFromContentRoles.indexOf(role)>=0;
}
/*
function getTextFromCss(element: DomElement): string {
    let attribs = parseCSS (element);
    if(!attribs){
        return "";
    }
    let before = new RegExp('::before');
    let after = new RegExp('::after');


    for(let attrib of attribs ){
        if(before.test(attrib)){

        }else if(after.test(attrib)){

        }


    }

    return "";

}

function parseCSS (element: DomElement): string [] {
    if(!element.attribs||!element.attribs["computed-styles"]){
        return [];
    }

    let computedStyle = element.attribs["computed-styles"];

    return computedStyle.split(";");
    
}

function getAccessibleNameFromChildren(element: DomElement,acumulatedText:string): string {

}*/
export {
    getAccessibleName,
    getElementSelector,
    transform_element_into_html
};
