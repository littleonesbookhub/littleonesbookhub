const BOOK_AVAILABLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSf66BFvFTCPGlnl1D0PgwBItYGV6rhvVlzj81Vd6seq-MtHFQ/viewform?usp=pp_url&entry.233549370=";

function fetch_collections() {
    show_collections_loading_spinner();
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json())
        .then(result => {
            let collections = [];
            let books = {};
            const spreadsheet = result;
            spreadsheet.sheets.forEach(function (sheet) {
                if (sheet.properties.title === "collections") {
                    sheet.data.forEach(function (gridData) {
                        gridData.rowData.forEach(function (row, index) {
                            if (index < 1) { // header in spreadsheet
                                return;
                            }
                            try {
                                const id = row.values[0].formattedValue ? row.values[0].formattedValue : "";
                                const name = row.values[1].formattedValue ? row.values[1].formattedValue : "";
                                let books = row.values[2].formattedValue ? row.values[2].formattedValue : "";
                                books = books.replaceAll(' ', '');
                                books = books.split(",");
                                if (id === "") {
                                    return;
                                }
                                collections.push({ id: id, name: name, books: books });
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    });
                } else if (sheet.properties.title === "books") {
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
                                books[id] = { id: id, title: title, author: author, genre: genre, age_group: age_group, available: available, available_date: available_date, description: description, thumbnail_url: thumbnail_url };
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    });
                }
            });
            return { collections: collections, books: books };
        })
        .then(collections_data => on_collections_fetched(collections_data))
        .finally(() => {
            hide_collections_loading_spinner();
        });
}

function show_collections_loading_spinner() {
    document.querySelector(".common-loading-spinner").style.display = "flex";
}

function hide_collections_loading_spinner() {
    document.querySelector(".common-loading-spinner").style.display = "none";
}

function add_collection(collection, books, collections_ctr) {
    const article = document.createElement("article");
    collections_ctr.appendChild(article);

    article.innerHTML = '<p><b>' + collection.name + '</b></p><div class="collection-thumbs"></div>';
    article.classList.add("collection");

    const all_collection_thumbs = document.getElementsByClassName("collection-thumbs");
    const collection_thumbs = all_collection_thumbs[all_collection_thumbs.length - 1];
    collection.books.forEach(book => {
        add_collection_item(book, books, collection_thumbs);
    });
}

function add_collection_item(book, books, item_ctr) {
    if (!book in books) {
        console.log(`Unable to find book ${book} in books.`);
        return;
    }
    const collection_thumb = document.createElement("a");
    collection_thumb.setAttribute("href", books[book].thumbnail_url);
    collection_thumb.innerHTML = `<img class="collection-thumb" src="${books[book].thumbnail_url}">`;
    const book_data_encoded = encodeURIComponent(JSON.stringify(books[book]));
    collection_thumb.setAttribute("data-book", book_data_encoded);
    collection_thumb.addEventListener("click", on_collection_item_click);

    item_ctr.appendChild(collection_thumb);
}

function show_preview_dialog(book_data) {
    const preview_dialog_frame = document.getElementsByClassName("preview-dialog-frame")[0];
    preview_dialog_frame.contentWindow.document.querySelector(".preview-thumb").src = book_data.thumbnail_url;
    preview_dialog_frame.contentWindow.document.querySelector(".preview-title span").innerText = book_data.title;
    preview_dialog_frame.contentWindow.document.querySelector(".preview-author span").innerText = book_data.author;
    preview_dialog_frame.contentWindow.document.querySelector(".preview-genre span").innerText = book_data.genre;
    preview_dialog_frame.contentWindow.document.querySelector(".preview-age-group span").innerText = book_data.age_group;
    preview_dialog_frame.contentWindow.document.querySelector(".preview-description span").innerText = book_data.description;

    if (book_data.available.toLowerCase() === 'yes') {
        preview_dialog_frame.contentWindow.document.querySelector(".preview-availability span").innerHTML = 'Available';
    } else {
        preview_dialog_frame.contentWindow.document.querySelector(".preview-availability span").innerHTML = `Unvailable. <a href="${BOOK_AVAILABLE_FORM_LINK}${book_data.id}" target="_blank">NOTIFY ME</a>`;
    }

    preview_dialog_frame.style.display = "initial";
}

function hide_preview_dialog() {
    const preview_dialog_frame = document.getElementsByClassName("preview-dialog-frame")[0];
    preview_dialog_frame.style.display = "none";
}

function on_collections_fetched(collections_data) {
    const collections_ctr = document.getElementsByClassName('collections-ctr')[0];
    collections_data.collections.forEach(collection => add_collection(collection, collections_data.books, collections_ctr));
}

function on_navbar_search_button_click() {
    const desktop_nav_search = document.getElementById("desktop-nav-search");
    const text_input_search = document.getElementById("text-input-search");
    if (text_input_search.style.display === "flex") {
        if (text_input_search.value.length == 0) {
            desktop_nav_search.classList.remove("clicked-search-icon");
            text_input_search.style.display = "none";
        }
        else {
            window.location.href = `search.html?q=${encodeURIComponent(text_input_search.value)}`;
        }
    }
    else {
        desktop_nav_search.classList.add("clicked-search-icon");
        text_input_search.style.display = "flex";
        text_input_search.focus();
    }
}

function on_mobile_navbar_search_button_click() {
    const mobile_nav_search = document.getElementById("mobile-nav-search");
    const mobile_text_input_search = document.getElementById("mobile-text-input-search");
    if (mobile_text_input_search.style.display === "flex") {
        if (mobile_text_input_search.value.length == 0) {
            mobile_nav_search.classList.remove("clicked-mobile-search-icon");
            mobile_text_input_search.style.display = "none";
        }
        else {
            window.location.href = `search.html?q=${encodeURIComponent(mobile_text_input_search.value)}`;
        }
    }
    else {
        mobile_nav_search.classList.add("clicked-mobile-search-icon");
        mobile_text_input_search.style.display = "flex";
        mobile_text_input_search.focus();
    }
}

function on_click_outside_search_button() {
    const text_input_search = document.getElementById("text-input-search");
    const desktop_nav_search = document.getElementById("desktop-nav-search");
    if (text_input_search.style.display === "flex" && text_input_search.value.length == 0) {
        desktop_nav_search.classList.remove("clicked-search-icon");
        text_input_search.style.display = "none";
    }
}

function on_mobile_click_outside_search_button() {
    const mobile_text_input_search = document.getElementById("mobile-text-input-search");
    const mobile_nav_search = document.getElementById("mobile-nav-search");
    if (mobile_text_input_search.style.display === "flex" && mobile_text_input_search.value.length == 0) {
        mobile_nav_search.classList.remove("clicked-mobile-search-icon");
        mobile_text_input_search.style.display = "none";
    }
}

function register_navbar_search_button_click_handler() {
    const navbar_search_button = document.querySelector(".search");
    navbar_search_button.addEventListener("click", on_navbar_search_button_click);
    const text_input_search = document.getElementById("text-input-search");
    text_input_search.addEventListener("keyup", (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            on_navbar_search_button_click();
        }
    });
}

function register_mobile_navbar_search_button_click_handler() {
    const mobile_navbar_search_button = document.querySelector(".mobile-search");
    mobile_navbar_search_button.addEventListener("click", on_mobile_navbar_search_button_click);
    const mobile_text_input_search = document.getElementById("mobile-text-input-search");
    mobile_text_input_search.addEventListener("keyup", (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            on_mobile_navbar_search_button_click();
        }
    });
}

function register_click_outside_search_button_handler() {
    let search_button = document.getElementById('search');
    document.addEventListener('click', function (event) {
        let clicked_inside = search_button.contains(event.target);
        if (!clicked_inside) {
            on_click_outside_search_button();
        }
    });
}

function register_mobile_click_outside_search_button_handler() {
    let mobile_search_button = document.getElementById('mobile-search');
    document.addEventListener('click', function (event) {
        let clicked_inside = mobile_search_button.contains(event.target);
        if (!clicked_inside) {
            on_mobile_click_outside_search_button();
        }
    });
}

function on_collection_item_click(event) {
    event.preventDefault();

    disable_body_scrolling();

    const collection_thumb = event.currentTarget;
    const book_data_encoded = collection_thumb.getAttribute("data-book");
    const book_data = JSON.parse(decodeURIComponent(book_data_encoded));

    show_preview_dialog(book_data);
}

function on_preview_dialog_close() {
    hide_preview_dialog();
    enable_body_scrolling();
}

function on_page_load() {
    fetch_collections();

    register_navbar_search_button_click_handler();
    register_mobile_navbar_search_button_click_handler();
    register_click_outside_search_button_handler();
    register_mobile_click_outside_search_button_handler();
    on_page_load_common();
}

window.onload = on_page_load;
