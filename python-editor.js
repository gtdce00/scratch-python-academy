// --- python-editor.js (CodeMirror Setup) ---

let editorInstance = null;

export function initEditor(defaultCode) {
    const textArea = document.getElementById('python-editor');
    
    // Check if already initialized
    if (!editorInstance) {
        editorInstance = CodeMirror.fromTextArea(textArea, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Tab": function(cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            }
        });
        
        editorInstance.setSize("100%", "100%");
    }
    
    editorInstance.setValue(defaultCode);
    
    // Make sure layout updates
    setTimeout(() => {
        editorInstance.refresh();
    }, 100);
}

export function getCode() {
    if (editorInstance) return editorInstance.getValue();
    return "";
}

export function clearEditor() {
    if (editorInstance) editorInstance.setValue("");
}
