const DEFAULT_FILTERS = {
    Age: {
        "0-2 years": false,
        "2-4 years": false,
        "4-6 years": false,
        "6-10 years": false,
        "10+ years": false
    },
    Availability: {
        "Available": false,
        "In use": false
    },
    Genres: {
        "Science Fiction": false,
        "Fantasy": false
    }
}

var filters = cloneObject(DEFAULT_FILTERS); //this is the global variable to be used for search results
function close_filter_dialog_preview() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "none";

    filters = cloneObject(DEFAULT_FILTERS);
    const selected_filter_options = document.getElementsByClassName("selected-filter-option");
    for (var i = 0; i < selected_filter_options.length; i++) {
        filter_type = selected_filter_options[i].parentNode.dataset.optionsFor;
        filter_option_with_true_value = selected_filter_options[i].text;
        filters[filter_type][filter_option_with_true_value] = true;
    }
    console.log(filters);
}

function on_filter_close_button_click() {
    close_filter_dialog_preview();
}

function on_filters_button_click() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "block";
}

function on_filter_option_click(event) {
    if (event.target.classList.contains("selected-filter-option"))
        event.target.classList.remove("selected-filter-option");
    else
        event.target.classList.add("selected-filter-option");
}

function on_filter_section_clear_button_click(event) {
    clicked_clear_button = event.target.dataset.clearButtonOf;
    filter_options_to_clear = document.getElementsByClassName(clicked_clear_button);
    for (var i = 0; i < filter_options_to_clear.length; i++) {
        filter_options_to_clear[i].classList.remove("selected-filter-option");
    }
}

function on_filter_container_click(event) {
    const filter_main = document.getElementsByClassName("filter-main")[0];
    if (!filter_main.contains(event.target))
        close_filter_dialog_preview();
}

function register_filter_close_button_click_handler() {
    const filter_close_button = document.getElementsByClassName("filter-close-button")[0];
    filter_close_button.addEventListener("click", on_filter_close_button_click);
}

function register_filters_button_click_handler() {
    const filters_button = document.getElementsByClassName("filters_button")[0];
    filters_button.addEventListener("click", on_filters_button_click);
}

function register_filter_option_button_click_handler() {
    const option = document.getElementsByClassName("option");
    for (var i = 0; i < option.length; i++) {
        option[i].addEventListener("click", on_filter_option_click);
    }
}

function register_clear_button_click_handler() {
    const filter_section_clear_button = document.getElementsByClassName("filter-section-clear-button");
    for (var i = 0; i < filter_section_clear_button.length; i++) {
        filter_section_clear_button[i].addEventListener("click", on_filter_section_clear_button_click);
    }
}

function register_filter_container_click_handler() {
    const filter_container = document.getElementsByClassName("filter-ctr")[0];
    filter_container.addEventListener("click", on_filter_container_click)
}

function add_filter_item_title(key, value) {
    filter_main_ctr = document.getElementsByClassName("filter-main-ctr")[0];
    var options_string = ""
    Object.keys(value).forEach((filter_option) => {
        options_string += '<a class="option ' + key + '" href="#">' + filter_option + '</a>';
    })
    filter_main_ctr.innerHTML += '<div class="filter-type"><p class="filter-type-title">' + key + '</p>' +
        '<a class="filter-section-clear-button" data-clear-button-of="' + key + '" href="#">Clear</a>' +
        '</div>' +
        '<div class="filter-options" data-options-for="' + key + '">' + options_string + '</div>';
}

function add_filter_types() {
    Object.entries(filters).forEach(([key, value]) => {
        add_filter_item_title(key, value);
    })
}

function setup_filter_ui() {
    register_filters_button_click_handler();
    add_filter_types();
    register_filter_close_button_click_handler();
    register_filter_option_button_click_handler();
    register_clear_button_click_handler();
    register_filter_container_click_handler();
}

function on_page_load() {
    on_page_load_common();
    setup_filter_ui();
}

window.onload = on_page_load;