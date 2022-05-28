const SPREADSHEET_ID = "1qA6bdIiZSv09FA5qgXhq0nRj_PeTWgp0ufYFmWqeDfM";
const GOOGLE_CLOUD_API_KEY = "AIzaSyC6lEYx6meglfkrIRHxixxRuYwk9UGtAzM";

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
    words = words.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}