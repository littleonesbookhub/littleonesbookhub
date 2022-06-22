// Event handlers

function on_page_load() {
    register_close_button_click_handler();
    register_preview_container_click_handler();
}

function on_close_button_click() {
    hide_preview_dialog();
}

function on_preview_container_click(event) {
    const preview_container = document.getElementsByClassName("preview-ctr")[0];
    if (event.target === preview_container) {
        hide_preview_dialog();
    }
}

function on_document_keyup(e) {
    if (e.key === "Escape") {
        on_close_button_click();
    }
}

// Helper functions

function register_close_button_click_handler() {
    const close_button = document.getElementsByClassName("preview-close-button")[0];
    close_button.addEventListener("click", on_close_button_click);
    document.addEventListener("keyup", on_document_keyup);
}


function register_preview_container_click_handler() {
    const preview_container = document.getElementsByClassName("preview-ctr")[0];
    preview_container.addEventListener("click", on_preview_container_click);
}

function hide_preview_dialog() {
    parent && parent.on_preview_dialog_close && parent.on_preview_dialog_close();
}

window.onload = on_page_load;