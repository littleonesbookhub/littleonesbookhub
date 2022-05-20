// FILTER DIALOG

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

var filters = JSON.parse(JSON.stringify(DEFAULT_FILTERS)); //this is the global variable to be used for search results

function close_filter_dialog_preview() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "none";

    filters = JSON.parse(JSON.stringify(DEFAULT_FILTERS));
    const selected_filter_options = document.getElementsByClassName("selected-filter-option");
    for (var i = 0; i < selected_filter_options.length; i++) {
        filter_type = selected_filter_options[i].parentNode.dataset.optionsFor;
        filter_option_with_true_value = selected_filter_options[i].text;
        filters[filter_type][filter_option_with_true_value] = true;
    }
    console.log(filters)
}

function on_filters_close_button_click() {
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
    filter_close_button.addEventListener("click", on_filters_close_button_click);
}

function register_filters_button_click_handler() {
    const filters_button = document.getElementsByClassName("filters-button")[0];
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
    filter_container.addEventListener("click", on_filter_container_click);
}

function add_filter_item_title(key, value, index) {

    filter_main_ctr = document.getElementsByClassName("filter-main-ctr")[0];
    filter_main_ctr.innerHTML += '<div class="filter-type"><p class="filter-type-title">' + key + '</p>' +
        '<a class="filter-section-clear-button" data-clear-button-of="' + key + '" href="#">Clear</a>' +
        '</div>' +
        '<div class="options" data-options-for="' + key + '"></div>';
    if (index === 0) {
        document.getElementsByClassName("filter-type")[0].classList.add("first-filter-type");
    }
    options = document.getElementsByClassName("options")[index];
    for (var i = 0; i < Object.keys(value).length; i++) {
        options.innerHTML += '<a class="option ' + key + '" href="#">' + Object.keys(value)[i] + '</a>';
    }
}

function add_filter_types() {
    Object.entries(filters).forEach(([key, value], index) => {
        add_filter_item_title(key, value, index);
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

// SORT BY DIALOG

const DEFAULT_SORT_BY = {
    "Title A-Z": false,
    "Title Z-A": false,
    "Date Available": false
}

var sort_by = JSON.parse(JSON.stringify(DEFAULT_SORT_BY)); //this is the global variable to be used for search results

function on_sort_by_button_click() {
    const sort_by_dialog = document.getElementsByClassName("sort-by-dialog")[0];
    sort_by_dialog.style.display = "block";
}

function on_sort_by_option_click(event) {
    if (event.target.classList.contains("selected-sort-by-option"))
        event.target.classList.remove("selected-sort-by-option");
    else
        event.target.classList.add("selected-sort-by-option");
}

function close_sort_by_dialog_preview() {
    const sort_by_dialog = document.getElementsByClassName("sort-by-dialog")[0];
    sort_by_dialog.style.display = "none";

    sort_by = JSON.parse(JSON.stringify(DEFAULT_SORT_BY));
    const selected_sort_by_options = document.getElementsByClassName("selected-sort-by-option");
    for (var i = 0; i < selected_sort_by_options.length; i++) {
        sort_by_option_with_true_value = selected_sort_by_options[i].text;
        sort_by[sort_by_option_with_true_value] = true;
    }
    console.log(sort_by)
}

function on_sort_by_close_button_click() {
    close_sort_by_dialog_preview();
}

function on_sort_by_container_click(event) {
    const sort_by_main = document.getElementsByClassName("sort-by-main")[0];
    if (!sort_by_main.contains(event.target))
        close_sort_by_dialog_preview();
}

function register_sort_by_close_button_click_handler() {
    const sort_by_close_button = document.getElementsByClassName("sort-by-close-button")[0];
    sort_by_close_button.addEventListener("click", on_sort_by_close_button_click);
}

function register_sort_by_button_click_handler() {
    const sort_by_button = document.getElementsByClassName("sort-by-button")[0];
    sort_by_button.addEventListener("click", on_sort_by_button_click);
}

function register_sort_by_option_button_click_handler() {
    const option = document.getElementsByClassName("option");
    for (var i = 0; i < option.length; i++) {
        option[i].addEventListener("click", on_sort_by_option_click);
    }
}

function register_sort_by_container_click_handler() {
    const sort_by_container = document.getElementsByClassName("sort-by-ctr")[0];
    sort_by_container.addEventListener("click", on_sort_by_container_click);
}

function add_sort_by_options() {
    const sort_by_options_container = document.getElementsByClassName("sort-by-options")[0];
    const sort_by_options = Object.keys(sort_by)
    for (var i = 0; i < Object.keys(sort_by).length; i++) {
        sort_by_options_container.innerHTML += '<a class="option">' + sort_by_options[i] + '</a>';
    }
}

function setup_sort_by_ui() {
    register_sort_by_button_click_handler();
    add_sort_by_options();
    register_sort_by_option_button_click_handler();
    register_sort_by_close_button_click_handler();
    register_sort_by_container_click_handler();
}

// COMMON

function on_page_load() {
    on_page_load_common();
    setup_filter_ui();
    setup_sort_by_ui();
}

window.onload = on_page_load;