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

function isFocusable(element: DomElement) {

  if (element.attribs && element.attribs["disabled"] !== undefined) { // TODO ainda falta verificar se está escondido por css
    return false;
  } else if (isDefaultFocusable(element)) {
    return true;
  }

  let tabIndex = element.attribs ? element.attribs["tabindex"] : undefined;
  console.log(!!(tabIndex && !isNaN(parseInt(tabIndex, 10))));
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

function getElementByHRef(element: DomElement) {

  // @ts-ignore
  let href = element.attribs['href'];
  if (!href) {
    return null;
  }

  if (href.charAt(0) === '#') {
    href = decodeURIComponent(href.substring(1));
  } else if (href.substr(0, 2) === '/#') {
    href = decodeURIComponent(href.substring(2));
  }

  let result = document.getElementById(href);
  if (result) {
    return result;
  }

  let results = document.getElementsByName(href);
  if (results.length) {
    return results[0];
  }
  return null;
}



export {
  getElementSelector,
  transform_element_into_html,
  isFocusable,
  getElementByHRef
};
