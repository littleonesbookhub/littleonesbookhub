

function on_close_button_click() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "none";
}

function on_filters_button_click() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "block";
}

function on_option_click(event) {
    event.target.classList.add("selected");
}

function on_filter_section_clear_button_click(event) {
    if (event.target.classList.contains("age-clear")) {
        const age_option = document.getElementsByClassName("age-option");
        for (var i = 0; i < age_option.length; i++) {
            age_option[i].classList.remove("selected");
        }
    }
    else if (event.target.classList.contains("availability-clear")) {
        const availability_option = document.getElementsByClassName("availability-option");
        for (var i = 0; i < availability_option.length; i++) {
            availability_option[i].classList.remove("selected");
        }
    }
    else {
        const generes_option = document.getElementsByClassName("generes-option");
        for (var i = 0; i < generes_option.length; i++) {
            generes_option[i].classList.remove("selected");
        }
    }
}

function register_close_button_click_handler() {
    const filter_close_button = document.getElementsByClassName("filter-close-button")[0];
    filter_close_button.addEventListener("click", on_close_button_click);
}

function register_filters_button_click_handler() {
    const filters_button = document.getElementsByClassName("filters_button")[0];
    filters_button.addEventListener("click", on_filters_button_click);
}

function register_filter_option_button_click_handler() {
    const option = document.getElementsByClassName("option");
    for (var i = 0; i < option.length; i++) {
        option[i].addEventListener("click", on_option_click);
    }
}

function register_clear_button_click_handler() {
    const filter_section_clear_button = document.getElementsByClassName("filter-section-clear-button");
    for (var i = 0; i < filter_section_clear_button.length; i++) {
        filter_section_clear_button[i].addEventListener("click", on_filter_section_clear_button_click);
    }
}

function on_page_load() {
    on_page_load_common();
    register_close_button_click_handler();
    register_filters_button_click_handler();
    register_filter_option_button_click_handler();
    register_clear_button_click_handler();
}

window.onload = on_page_load;