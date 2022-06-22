// Event handlers

function on_page_load() {
    fetch_collections();

    register_navbar_search_button_click_handler();
    register_mobile_navbar_search_button_click_handler();
    register_click_outside_search_button_handler();
    register_mobile_click_outside_search_button_handler();
    on_page_load_common();
}

function on_collection_item_click(event) {
    event.preventDefault();

    disable_body_scrolling();

    const collection_thumb = event.currentTarget;
    const book_data_encoded = collection_thumb.getAttribute("data-book");
    const book_data = JSON.parse(decodeURIComponent(book_data_encoded));

    show_preview_dialog(book_data);
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

// Helper functions

function fetch_collections() {
    show_collections_loading_spinner();
    return get_collections_list()
        .then(collections => {
            return get_books_list().then(books_list => {
                books = books_list.reduce((d, e) => { d[e.id] = e; return d; }, {})
                return { collections: collections, books: books };
            })
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

    const b = books[book];
    const collection_thumb = document.createElement("a");
    collection_thumb.setAttribute("href", b.thumbnail_url);
    collection_thumb.style.textDecoration = "none";
    const image_src = b.thumbnail_url.startsWith("http") ? b.thumbnail_url : "";
    const bg_color = b.thumbnail_url.startsWith("http") ? "white" : b.thumbnail_url;
    if (b.thumbnail_url.startsWith("http")) {
        collection_thumb.innerHTML = `<img class="collection-thumb" src="${image_src}" alt="${b.title}">`;
    } else {
        collection_thumb.innerHTML = `<div class="collection-thumb-fallback" style="background-color: ${bg_color}"><p class="collection-thumb-fallback-title">${b.title}</p></div>`;
    }

    const book_data_encoded = encodeURIComponent(JSON.stringify(b));
    collection_thumb.setAttribute("data-book", book_data_encoded);
    collection_thumb.addEventListener("click", on_collection_item_click);

    item_ctr.appendChild(collection_thumb);
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

window.onload = on_page_load;
