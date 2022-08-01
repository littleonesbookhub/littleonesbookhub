const SPREADSHEET_ID = "1lDXf5bUKeHNE1xExYd0emhyMYcx2OCrll-J5Bmja_Jw";
const GOOGLE_CLOUD_API_KEY = "AIzaSyBw0q8CSm8ak1B7I-HsJ1lZfKyflNsXbuc";
const BOOK_NOTIFICATION_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSf687aNIna4gIcqtgqk-eNU7BdxWZn02J2PpfHhYH7-zICURQ/viewform?usp=pp_url&entry.466358951=TITLE&entry.687757412=ID";

let g_spreadsheet_data = null;

function register_navbar_menu_button_click_handler() {
    const navbar_menu_button = document.getElementsByClassName("navbar-menu")[0];
    navbar_menu_button.addEventListener("click", on_navbar_menu_button_click);
}

function register_scroll_handler() {
    const desktop_nav = document.querySelector('.desktop-nav');
    const mobile_nav = document.querySelector('.mobile-nav');
    window.onscroll = function () {
        if (window.pageYOffset > 0) {
            desktop_nav.classList.add('scrolled');
            mobile_nav.classList.add('scrolled');
        } else {
            desktop_nav.classList.remove('scrolled');
            mobile_nav.classList.remove('scrolled');
        }
    }
}

function on_navbar_menu_button_click() {
    const mobile_nav_links = document.getElementById("mobile-nav-links")
    const mobile_nav = document.querySelector('.mobile-nav')
    if (mobile_nav_links.style.display === "block") {
        mobile_nav.classList.remove("mobile-nav-open");
        mobile_nav_links.style.display = "none";
    }
    else {
        mobile_nav.classList.add("mobile-nav-open");
        mobile_nav_links.style.display = "block";
    }
}

function cloneObject(source) {
    return (JSON.parse(JSON.stringify(source)));
}

function on_page_load_common() {
    register_navbar_menu_button_click_handler();
    register_scroll_handler();
}

function get_query_parameter(key) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params[key];
}

function disable_body_scrolling() {
    document.body.style.overflow = "hidden";
}

function enable_body_scrolling() {
    document.body.style.overflow = "initial";
}

function convert_to_title_case(words) {
    words = words.toLowerCase();
    words = words.split('_');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}

function on_preview_dialog_close() {
    hide_preview_dialog();
    enable_body_scrolling();
}

function show_preview_dialog(book_data) {
    const preview_dialog_frame = document.getElementsByClassName("preview-dialog-frame")[0];
    const prop_keys = ["title", "author", "genre", "age_group", "description"];
    const q = preview_dialog_frame.contentWindow.document.querySelector.bind(preview_dialog_frame.contentWindow.document);
    prop_keys.forEach(k => {
        const selector = `.preview-${k.replace('_', '-')} span`;
        const el = q(selector);
        el.parentElement.style.display = 'block';
        const prop = book_data[k];
        if (Array.isArray(prop) && prop.length) {
            el.innerText = prop.join(", ");
        } else if (!Array.isArray(prop) && prop) {
            el.innerText = prop;
        } else {
            el.parentElement.style.display = 'none';
        }
    });
    const preview_thumb = q(".preview-thumb");
    const preview_thumb_fallback = q(".preview-thumb-fallback");
    const preview_thumb_fallback_title = q(".preview-thumb-fallback-title");
    if (book_data.thumbnail_url) {
        preview_thumb.src = book_data.thumbnail_url;
        preview_thumb.style.visibility = "visible";
        preview_thumb_fallback.style.visibility = "hidden";
    } else {
        preview_thumb.src = '';
        preview_thumb_fallback.style.backgroundColor = book_data.thumbnail_bg_color;
        preview_thumb_fallback_title.innerText = book_data.title;
        preview_thumb.style.visibility = "hidden";
        preview_thumb_fallback.style.visibility = "visible";
    }
    preview_thumb.alt = book_data.title;

    if (book_data.availability === 'available') {
        preview_dialog_frame.contentWindow.document.querySelector(".preview-availability span").innerHTML = 'Available';
    } else {
        preview_dialog_frame.contentWindow.document.querySelector(".preview-availability span").innerHTML = `Unvailable. <a href="${get_notification_form_link(book_data.title, book_data.id)}" target="_blank">NOTIFY ME</a>`;
    }

    preview_dialog_frame.style.display = "initial";
    preview_dialog_frame.contentWindow.focus();
}

function hide_preview_dialog() {
    const preview_dialog_frame = document.getElementsByClassName("preview-dialog-frame")[0];
    preview_dialog_frame.style.display = "none";
}

function get_collections_list() {
    return get_sheet_list("collections")
        .then(collections_list => {
            return collections_list.map(e => {
                e.books = e.books.replaceAll(' ', '');
                e.books = e.books.split(",");
                return e;
            })
        });
}

function get_books_list() {
    return get_sheet_list("books")
        .then(books_list => {
            return books_list.map(e => {
                e.genre = e.genre.trim() ? e.genre.split(";").map(f => f.replace(">", " ")) : [];
                e.age_group = e.age_group.trim() ? e.age_group.split(";").map(f => f + " years") : [];
                e["thumbnail_bg_color"] = generate_thumb_background_color();
                return e;
            })
        });
}

function get_sheet_list(sheetname) {
    if (!g_spreadsheet_data) {
        g_spreadsheet_data = fetch_spreadsheet_data();
    }
    return g_spreadsheet_data.then(result => {
        let sheet_list = [];
        const spreadsheet = result;
        spreadsheet.sheets.forEach(function (sheet) {
            if (sheet.properties.title === sheetname) {
                sheet.data.forEach(function (gridData) {
                    headers = [];
                    gridData.rowData.forEach(function (row, index) {
                        try {
                            row_cells = row.values.map(e => e.formattedValue ? e.formattedValue : "")
                            if (index === 0) { // header in spreadsheet
                                headers = row_cells;
                                header_index_map = headers.reduce((d, e) => { d[e] = headers.indexOf(e); return d; }, {});
                                return;
                            }
                            let sheet_object = headers.reduce((d, e) => { d[e] = row_cells[header_index_map[e]] || ""; return d; }, {});
                            if (!sheet_object["id"]) {
                                return;
                            }
                            sheet_list.push(sheet_object);
                        } catch (err) {
                            console.error(err);
                        }
                    });
                });
            }
        });
        return sheet_list;
    });
}

function fetch_spreadsheet_data() {
    return fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json());
}

function get_genre_list(genre_str) {
    return genre_str.split(";").map(e => String(e).replace(">", ""));
}

function get_age_group_list(age_group_str) {
    return age_group_str.split(";").map(e => e + " years")
}

function generate_thumb_background_color() {
    const BG_COLORS = ["#782F4E", "#DB5B42", "#F5B267", "#0B7C86", "#3A3461"];
    const num_colors = BG_COLORS.length;
    const index = Math.floor(Math.random() * num_colors);
    return BG_COLORS[index];
}

function get_notification_form_link(title, id) {
    return BOOK_NOTIFICATION_FORM_LINK.replace("TITLE", encodeURIComponent(title)).replace("ID", encodeURIComponent(id));
}