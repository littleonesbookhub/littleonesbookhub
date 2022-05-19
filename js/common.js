function register_navbar_menu_button_click_handler() {
    const navbar_menu_button = document.getElementsByClassName("navbar-menu")[0];
    navbar_menu_button.addEventListener("click", on_navbar_menu_button_click);
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

function on_page_load_common() {
    register_navbar_menu_button_click_handler();
}
function show_search_loading_spinner() {
    
}
function hide_search_loading_spinner() {
    
}