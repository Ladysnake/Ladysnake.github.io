// adapted from https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get("query")

function displaySearchResults(results, indexData) {
    const searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
        let appendString = '';

        const sortedResults = results.sort((a, b) => a.score < b.score);
        for (const result of sortedResults) {  // Iterate over the results
            const page = indexData[result.ref];
            appendString += `<li><a href="${page.url}"><h3>${page.display_title}</h3></a>`;
            appendString += `<p>${page.display_content}</p></li>`;
        }

        searchResults.innerHTML = appendString;
    } else {
        searchResults.innerHTML = '<li>No results found</li>';
    }
}

/**
 * @param {Map<string, {title: string, content: string, url: string}>} indexData
 */
export default function search(indexData) {

    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);

        // Initalize lunr with the fields it will be searching on.
        // Titles and tags are given a boost of 10 to indicate matches on these fields are more important.
        const idx = lunr(function () {
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('tags', { boost: 10 })

            for (const [id, { title, content, tags, boost }] of Object.entries(indexData)) {
                this.add({ id, title, content, tags }, { boost });
            }
        });
        const results = idx.search(searchTerm);
        displaySearchResults(results, indexData);
    }
}
