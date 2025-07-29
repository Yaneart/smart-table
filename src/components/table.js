import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    root.container.addEventListener('change', () => {
        onAction();
    });
    
    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 500)
    });
    root.container.addEventListener('submit', () => {
        e.preventDefault();
        onAction(e.submitter);
    })


    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map((item) => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textConten = item[key]
                }
             });
            return row;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}