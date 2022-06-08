let filters = {
    "age_group": {},
    "availability": {},
    "genre": {},
    "author": {}
}

const DEFAULT_SORT_BY = {
    "Title A-Z": true,
    "Title Z-A": false,
}

const SORTING_FUNCTIONS = {
    "Title A-Z": (a, b) => a.title.localeCompare(b.title),
    "Title Z-A": (a, b) => b.title.localeCompare(a.title),
};

let sort_by = cloneObject(DEFAULT_SORT_BY); //this is the global variable to be used for search results

let g_books = [];

function fetch_books() {
    show_search_loading_spinner();
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json())
        .then(result => {
            let books = [];
            const spreadsheet = result;
            spreadsheet.sheets.forEach(function (sheet) {
                if (sheet.properties.title === "books") {
                    sheet.data.forEach(function (gridData) {
                        gridData.rowData.forEach(function (row, index) {
                            if (index < 1) { // header in spreadsheet
                                return;
                            }
                            try {
                                const id = row.values[0].formattedValue ? row.values[0].formattedValue : "";
                                const title = row.values[1].formattedValue ? row.values[1].formattedValue : "";
                                const author = row.values[2].formattedValue ? row.values[2].formattedValue : "";
                                const genre = row.values[3].formattedValue ? row.values[3].formattedValue : "";
                                const age_group = row.values[4].formattedValue ? row.values[4].formattedValue : "";
                                const available = row.values[5].formattedValue ? row.values[5].formattedValue : "";
                                const available_date = row.values[6].formattedValue ? row.values[6].formattedValue : "";
                                const description = row.values[7].formattedValue ? row.values[7].formattedValue : "";
                                const thumbnail_url = row.values[8].formattedValue ? row.values[8].formattedValue : "";
                                if (id === "") {
                                    return;
                                }
                                books.push({ id: id, title: title, author: author, genre: genre, age_group: age_group, availability: available, available_date: available_date, description: description, thumbnail_url: thumbnail_url });
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    });
                }
            });
            return books;
        })
        .then(books_data => on_books_fetched(books_data))
        .finally(() => {
            hide_search_loading_spinner();
        });
}

function load_filter_options(books) {
    const filter_types = ["genre", "author", "availability", "age_group"]
    for (let i in books) {
        filter_types.forEach(function (filter_type) {
            const current_filter_option = books[i][filter_type];
            filters[filter_type][current_filter_option] = false;
        })
    }
    setup_filter_ui();
}

function on_books_fetched(books) {
    g_books = books;
    load_filter_options(books);
    const search_text = get_query_parameter("q") || "";
    const search_input = document.getElementsByClassName('search-input')[0];
    search_input.value = search_text;
    filter_books(books, search_text, filters, sort_by);
}

function get_number_dummy_search_results(total_results) {
    return (3 - (total_results % 3)) % 3;
}

function filter_books(books, searchInput, filters, sort_by) {
    console.log("filters", filters);
    function filterItems() {
        return books.filter(function (book) {
            const search_input_keys = ['title', 'author', 'genre'];
            const filter_keys = ['age_group', 'availability', 'genre', 'author'];
            return search_input_keys.some(function (search_input_key) {
                return searchInput === "" || book[search_input_key].toLowerCase().indexOf(searchInput.toLowerCase()) !== -1
            }) && filter_keys.every(function (filter_key) {
                // either all filter options are false, or the true filter option matches with the book
                return Object.values(filters[filter_key]).every(filter_value => filter_value === false) || filters[filter_key][book[filter_key]];
            });
        })
    }
    const filtered_books = filterItems();
    console.log("filtered books", filtered_books);

    const sort_option = Object.keys(sort_by).reduce((p, c) => sort_by[c] ? c : p, "Title A-Z");
    filtered_books.sort(SORTING_FUNCTIONS[sort_option]);
    console.log("sorted books", filtered_books);

    clear_search_results();
    filtered_books.forEach(book => add_book_result_item(book));
    const number_dummy_search_results = get_number_dummy_search_results(filtered_books.length);
    for (let i = 0; i < number_dummy_search_results; ++i) {
        add_book_result_item(null);
    }
    if (filtered_books.length === 0) {
        const search_results_cards_div = document.getElementsByClassName("search-results-cards")[0];
        search_results_cards_div.innerHTML += `<div style="width: 100%; text-align: center;">No results.</div>`;
    }
}

function show_search_loading_spinner() {
    document.querySelector(".common-loading-spinner").style.display = "flex";
}
function hide_search_loading_spinner() {
    document.querySelector(".common-loading-spinner").style.display = "none";
}

function reset_filters() {
    Object.keys(filters).forEach((filter_type) => {
        Object.keys(filters[filter_type]).forEach((filter_option) => {
            filters[filter_type][filter_option] = false;
        })
    })
}

function close_filter_dialog_preview() {
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "none";

    reset_filters();
    update_filters_from_filter_dialog();
    enable_body_scrolling();

    setup_search_input_section_filters(filters);

    console.log("selected filters", filters);
    filter_books(g_books, "", filters, sort_by);
}

function update_filters_from_filter_dialog() {
    const selected_filter_options = document.getElementsByClassName("selected-filter-option");
    for (let i = 0; i < selected_filter_options.length; i++) {
        filter_type = selected_filter_options[i].parentNode.dataset.optionsFor;
        filter_option_with_true_value = selected_filter_options[i].text;
        filters[filter_type][filter_option_with_true_value] = true;
    }
}

function update_filter_dialog_from_filters() {
    const filter_options = document.getElementsByClassName("option");
    for (let i = 0; i < filter_options.length; i++) {
        const filter_option = filter_options[i];
        const filter_type = filter_option.dataset.filterType;
        const filter_type_option = filter_option.dataset.filterTypeOption;
        if (filters[filter_type][filter_type_option]) {
            filter_option.classList.add("selected-filter-option");
        } else {
            filter_option.classList.remove("selected-filter-option");
        }
    }
}

function on_filter_close_button_click() {
    close_filter_dialog_preview();
}

function on_filters_button_click() {
    update_filter_dialog_from_filters();
    const filter_dialog = document.getElementsByClassName("filter-dialog")[0];
    filter_dialog.style.display = "block";
    disable_body_scrolling();
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
    for (let i = 0; i < filter_options_to_clear.length; i++) {
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
    const filters_button = document.getElementsByClassName("filters-button")[0];
    filters_button.addEventListener("click", on_filters_button_click);
}

function register_filter_option_button_click_handler() {
    const option = document.getElementsByClassName("option");
    for (let i = 0; i < option.length; i++) {
        option[i].addEventListener("click", on_filter_option_click);
    }
}

function register_clear_button_click_handler() {
    const filter_section_clear_button = document.getElementsByClassName("filter-section-clear-button");
    for (let i = 0; i < filter_section_clear_button.length; i++) {
        filter_section_clear_button[i].addEventListener("click", on_filter_section_clear_button_click);
    }
}

function register_filter_container_click_handler() {
    const filter_container = document.getElementsByClassName("filter-ctr")[0];
    filter_container.addEventListener("click", on_filter_container_click)
}

function add_filter_item_title(key, value) {
    const filter_main_ctr = document.getElementsByClassName("filter-main-ctr")[0];
    let options_string = ""
    Object.keys(value).forEach((filter_option) => {
        options_string += `<a class="option" data-filter-type="${key}" data-filter-type-option="${filter_option}" href="#">${filter_option}</a>`;
    })
    filter_main_ctr.innerHTML += '<div class="filter-type"><p class="filter-type-title">' + convert_to_title_case(key) + '</p>' +
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

function on_sort_by_button_click() {
    const sort_by_options = document.getElementsByClassName("sort-by-option");
    for (let i = 0; i < sort_by_options.length; i++) {
        const selected_button = sort_by_options[i].text;
        if (sort_by[selected_button] == true) {
            sort_by_options[i].classList.add("selected-sort-by-option");
        }
        else {
            sort_by_options[i].classList.remove("selected-sort-by-option");
        }
    }
    const sort_by_dialog = document.getElementsByClassName("sort-by-dialog")[0];
    sort_by_dialog.style.display = "block";
    disable_body_scrolling();
}

function on_sort_by_option_click(event) {
    const sort_by_options = document.getElementsByClassName("sort-by-option");
    for (let i = 0; i < sort_by_options.length; i++)
        sort_by_options[i].classList.remove("selected-sort-by-option");
    event.target.classList.add("selected-sort-by-option");
}

function close_sort_by_dialog_preview() {
    const sort_by_dialog = document.getElementsByClassName("sort-by-dialog")[0];
    sort_by_dialog.style.display = "none";

    for (let key in sort_by) {
        sort_by[key] = false;
    }

    const selected_sort_by_option = document.getElementsByClassName("selected-sort-by-option")[0];
    sort_by_option_with_true_value = selected_sort_by_option.text;
    sort_by[sort_by_option_with_true_value] = true;

    enable_body_scrolling();

    setup_search_input_section_sort_by(sort_by);

    const search_input = document.getElementsByClassName('search-input')[0];
    filter_books(g_books, search_input.value, filters, sort_by);

    console.log("selected sortby options", sort_by)
}

function on_sort_by_close_button_click() {
    close_sort_by_dialog_preview();
}

function on_sort_by_container_click(event) {
    const sort_by_main = document.getElementsByClassName("sort-by-main")[0];
    if (!sort_by_main.contains(event.target))
        close_sort_by_dialog_preview();
}

function register_sort_by_button_click_handler() {
    const sort_by_button = document.getElementsByClassName("sort-by-button")[0];
    sort_by_button.addEventListener("click", on_sort_by_button_click);
}

function register_sort_by_option_button_click_handler() {
    const option = document.getElementsByClassName("sort-by-option");
    for (let i = 0; i < option.length; i++) {
        option[i].addEventListener("click", on_sort_by_option_click);
    }
}

function register_sort_by_close_button_click_handler() {
    const sort_by_close_button = document.getElementsByClassName("sort-by-close-button")[0];
    sort_by_close_button.addEventListener("click", on_sort_by_close_button_click);
}

function register_sort_by_container_click_handler() {
    const sort_by_container = document.getElementsByClassName("sort-by-ctr")[0];
    sort_by_container.addEventListener("click", on_sort_by_container_click);
}

function add_sort_by_options() {
    const sort_by_options_container = document.getElementsByClassName("sort-by-options")[0];
    const sort_by_options = Object.keys(sort_by)
    for (let i = 0; i < sort_by_options.length; i++) {
        sort_by_options_container.innerHTML += `<a class="sort-by-option" href="#">${sort_by_options[i]}</a>`;
    }
}

function setup_sort_by_ui() {
    register_sort_by_button_click_handler();
    add_sort_by_options();
    register_sort_by_option_button_click_handler();
    register_sort_by_close_button_click_handler();
    register_sort_by_container_click_handler();
}

function on_page_load() {
    on_page_load_common();
    fetch_books();
    // setup_filter_ui();
    setup_sort_by_ui();
    setup_search_input_section();
}

window.onload = on_page_load;

function clear_search_results() {
    const search_results_cards_div = document.getElementsByClassName("search-results-cards")[0];
    search_results_cards_div.innerHTML = "";
}

function add_book_result_item(book) {
    const book_data_encoded = encodeURIComponent(JSON.stringify(book));
    const search_results_cards_div = document.getElementsByClassName("search-results-cards")[0];
    if (book === null) {
        search_results_cards_div.innerHTML += `<div class="search-results-card search-results-card--no-bg"></div`;
    } else {
        search_results_cards_div.innerHTML += `<div class="search-results-card" onclick="on_search_result_item_click(event)" data-book="${book_data_encoded}">
    <img src="${book.thumbnail_url}"
    class="search-results-card--img">
    <div class="search-results-card--text">
        <p class="search-results-card--title">${book.title}</p>
        <p class="search-results-card--author">${book.author}</p>
        <div class="search-results-card--status">
            <p>${book.availability}</p>
            <a class="search-results-card--notify-link" href="${BOOK_NOTIFICATION_FORM_LINK}" target="_blank" ${book.availability === 'available' ? 'hidden' : ''}>Notify me</a>
        </div>
        <p class="search-results-card--genre">${book.genre}</p>
    </div>
</div>`;
    }
}

function setup_search_input_section() {
    // register the event handlers for the search input
    const search_input_form = document.getElementsByClassName('search-input-form')[0];
    search_input_form.addEventListener('submit', on_search_input_submit)

    const search_input = document.getElementsByClassName('search-input')[0];
    search_input.addEventListener('input', on_search_input_change)
}

function on_search_input_submit(event) {
    event.preventDefault();
}

function on_search_input_change(event) {
    const search_input_text = this.value;
    filter_books(g_books, search_input_text, filters, sort_by);
}

function setup_search_input_section_filters(filters) {
    clear_search_input_filters();

    Object.entries(filters).forEach(([filter_type, filter_type_value]) => {
        Object.entries(filter_type_value).forEach(([filter_type_option, filter_type_option_value]) => {
            if (filter_type_option_value) {
                add_search_input_filter(filter_type, filter_type_option);
            }
        });
    });

    register_search_input_clear_button_handlers();
}

function setup_search_input_section_sort_by(sort_by) {
    Object.entries(sort_by).forEach(([sort_by_option, sort_by_option_value]) => {
        if (sort_by_option_value) {
            const search_input_sort_by = document.getElementsByClassName("search-input-sort-by")[0];
            search_input_sort_by.innerText = sort_by_option;
        }
    });
}

function clear_search_input_filters() {
    const search_input_filter_buttons = document.getElementsByClassName("search-input-filter-buttons")[0];
    search_input_filter_buttons.innerHTML = "";
}

function add_search_input_filter(filter_type, filter_type_option) {
    // add a search-input-filter-button inside search-input-filter-buttons
    const search_input_filter_buttons = document.getElementsByClassName("search-input-filter-buttons")[0];
    search_input_filter_buttons.innerHTML += `<button class="search-input-filter-button">${filter_type_option} <a class="search-input-filter-clear-button" data-filter-type="${filter_type}" data-filter-type-option="${filter_type_option}">x</a></button>`;
}

function register_search_input_clear_button_handlers() {
    const search_input_filter_buttons = document.getElementsByClassName("search-input-filter-buttons")[0];
    const search_input_filter_clear_buttons = document.getElementsByClassName("search-input-filter-clear-button");
    for (let i = 0; i < search_input_filter_clear_buttons.length; ++i) {
        const search_input_filter_clear_button = search_input_filter_clear_buttons[i];
        search_input_filter_clear_button.onclick = function () {
            search_input_filter_buttons.removeChild(search_input_filter_clear_button.parentNode);
            const filter_type = search_input_filter_clear_button.dataset.filterType;
            const filter_type_option = search_input_filter_clear_button.dataset.filterTypeOption;
            filters[filter_type][filter_type_option] = false;
            const search_input = document.getElementsByClassName('search-input')[0];
            filter_books(g_books, search_input.value, filters, sort_by);
        };
    }
}

function on_search_result_item_click(event) {
    if (event.target.classList.contains("search-results-card--notify-link")) {
        return;
    }

    event.preventDefault();

    disable_body_scrolling();

    const search_result_item = event.currentTarget;
    const book_data_encoded = search_result_item.getAttribute("data-book");
    const book_data = JSON.parse(decodeURIComponent(book_data_encoded));

    show_preview_dialog(book_data);
}