'use strict';

import {DomElement} from 'htmlparser2';
import html from 'htmlparser-to-html';
import clone from 'lodash/clone';

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

  selector += parents.join(' > ');
  selector += ' > ' + getSelfLocationInParent(element);

  return selector;
}

function transform_element_into_html(element: DomElement, withText: boolean = true, fullElement: boolean = false): string {

  if (!element) {
    return '';
  }

  let codeElement: DomElement = clone(element);

  if (codeElement.attribs) {
    delete codeElement.attribs['computed-style'];
    delete codeElement.attribs['computed-style-after'];
    delete codeElement.attribs['computed-style-before'];
    delete codeElement.attribs['w-scrollx'];
    delete codeElement.attribs['w-scrolly'];
    delete codeElement.attribs['b-right'];
    delete codeElement.attribs['b-bottom'];
    delete codeElement.attribs['window-inner-height'];
    delete codeElement.attribs['window-inner-width'];
    delete codeElement.attribs['document-client-height'];
    delete codeElement.attribs['document-client-width'];
  }

  if (codeElement.attribs && codeElement.attribs.id && codeElement.attribs.id.startsWith('qw-generated-id')) {
    delete codeElement.attribs.id;
  }

  if (!fullElement) {
    if (withText) {
      let children = clone(codeElement.children);
      codeElement.children = [];

      for (let child of children || []) {
        if (child.type === 'text') {
          codeElement.children.push(clone(child));
        }
      }
    } else {
      codeElement.children = [];
    }
  }

  return html(codeElement);
}

function isFocusable(element: DomElement) {
  if (element.attribs && (element.attribs['disabled'] !== undefined || elementIsHidden(element))){
    return false;
  } else if (isDefaultFocusable(element)) {
    return true;
  }
  let tabIndex = element.attribs ? element.attribs['tabindex'] : undefined;
  return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}

function isDefaultFocusable(element: DomElement) {
  switch (element.name) {
    case 'a':
    case 'area':
    case 'link':
      if (element.attribs && element.attribs['href'])
        return true;
      break;
    case 'input':
      return element.attribs && element.attribs['type'] !== 'hidden';
    case 'summary':
      let parent = element.parent;
      // @ts-ignore
      return parent && parent.name === 'details' && parent.children[0] === element;
    case 'textarea':
    case 'select':
    case 'button':
      return true;
  }
  return false;
}

function getElementByHRef(processedHTML: DomElement[], element: DomElement): string | null {
  if (!element.attribs) {
    return null;
  }

  let href = element.attribs['href'];
  if (!href) {
    return null;
  }

  if (href.charAt(0) === '#' && href.length > 1) {
    href = decodeURIComponent(href.substring(1));
  } else if (href.substr(0, 2) === '/#' && href.length > 2) {
    href = decodeURIComponent(href.substring(2));
  } else {
    return null;
  }
  
  let result = stew.select_first(processedHTML, '#' + href); //'[id='' + href + '']'
  if (result) {
    return result;
  }
  result = stew.select_first(processedHTML, '[name="' + href + '"]');
  if (result) {
    return result;
  }
  return null;
}

function elementIsHidden(element: DomElement): boolean {
  const aria_hidden = element.attribs ? element.attribs['aria-hidden'] === 'true' : false;
  const hidden = element.attribs ? element.attribs['hidden'] !== undefined : false;
  const cssHidden = elementIsHiddenCSS(element);
  const parent = element.parent;
  let parentHidden = false;

  if (parent) {
    parentHidden = elementIsHidden(parent);
  }

  return cssHidden || hidden || aria_hidden || parentHidden;
}

function elementIsHiddenCSS(element: DomElement): boolean {
  if (!element.attribs) {
    return false;
  }
  let visibility = false;
  let displayNone = false;
  
  if (element.attribs['computed-style'] !== undefined) {
    displayNone = getComputedStylesAttribute(element, 'computed-style', '^ display:').trim() === 'none';
    let visibilityATT = getComputedStylesAttribute(element, 'computed-style', '^ visibility:').trim();
    visibility = visibilityATT === 'collapse' || visibilityATT === 'hidden';
  }
  return visibility || displayNone;
}

function getComputedStylesAttribute(element: DomElement, computedStyle: string, attribute: string): string {
  if (!element.attribs || !element.attribs[computedStyle]) {
    return '';
  }
  const computedStyleContent = element.attribs[computedStyle].replace('&quot;', '');
  const attribs = computedStyleContent.split(';');
  const isAttr = new RegExp(attribute);
  let attributeContent = '';
  for (const attr of attribs || []) {
    if (isAttr.test(attr)){
      attributeContent = attr.split(isAttr)[1];
    }
  }
  
  return attributeContent.replace('&quot', '');
}


export {
  getElementSelector,
  transform_element_into_html,
  isFocusable,
  getElementByHRef,
  elementIsHidden
};
