function on_page_load() {
    register_close_button_click_handler();
}

function on_close_button_click() {
    const preview_body = document.getElementsByClassName("preview-body")[0];
    preview_body.style.display = 'none';
}

function register_close_button_click_handler() {
    const close_button = document.getElementsByClassName("preview-close-button")[0];
    close_button.addEventListener("click", on_close_button_click);
}

window.onload = on_page_load;