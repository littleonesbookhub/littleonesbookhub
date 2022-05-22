function fetch_collections() {
    show_collections_loading_spinner();
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json())
        .then(result => {
            let collections = [];
            let books = [];
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
                                books.push({ id: id, title: title, author: author, genre: genre, age_group: age_group, available: available, available_date: available_date, description: description, thumbnail_url: thumbnail_url }) ;
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
let searchInput = document.getElementById('text-input-search').value;
searchInput.addEventListener('keyup', filterItems);

function filterItems(books, searchInput) {
    return books.filter(function(el) {
      return el.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1
    })
  }

function on_page_load() {
    fetch_books();
    on_page_load_common();
}

window.onload = on_page_load;
