'use strict';

let createElement = (options) => {
    if (!options || !options.tagName)
        return undefined;

    let element = document.createElement(options.tagName);
    if (options.attr) {
        for (let name in options.attr) {
            element.setAttribute(name, options.attr[name])
        }
    }

    if (options.style) {
        for (let name in options.style) {
            element.style[name] = options.style[name];
        }
    }

    if (options.classList) {
        for (let item of options.classList) {
            element.classList.add(item);
        }
    }

    if (options.eventListener) {
        for (let listener in options.eventListener) {
            element.addEventListener(listener, options.eventListener[listener]);
        }
    }

    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    if (options.parent) {
        options.parent.appendChild(element);
    }

    return element;
};

module.exports = createElement;
