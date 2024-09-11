// Function to fetch data from the JSON file
async function fetchData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging statement
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to display recommendations
function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById('recommendation-list');
    resultsContainer.innerHTML = ''; // Clear existing results

    if (recommendations.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    recommendations.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('recommendation-item');
        
        const title = document.createElement('h3');
        title.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        itemElement.appendChild(title);
        itemElement.appendChild(description);

        resultsContainer.appendChild(itemElement);
    });
}

// Search button event listener
document.getElementById('search-btn').addEventListener('click', async () => {
    const keyword = document.getElementById('search-bar').value.toLowerCase();
    console.log('Search keyword:', keyword); // Debugging statement
    const data = await fetchData();

    if (data) {
        let results = [];

        // Search through beaches
        if (Array.isArray(data.beaches)) {
            results = results.concat(data.beaches.filter(item =>
                item.name.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword)
            ));
        }

        // Search through temples
        if (Array.isArray(data.temples)) {
            results = results.concat(data.temples.filter(item =>
                item.name.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword)
            ));
        }

        // Search through countries and their cities
        if (Array.isArray(data.countries)) {
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(keyword)) {
                    results = results.concat(country.cities);
                } else {
                    results = results.concat(country.cities.filter(city =>
                        city.name.toLowerCase().includes(keyword) ||
                        city.description.toLowerCase().includes(keyword)
                    ));
                }
            });
        }

        console.log('Search results:', results); // Debugging statement
        displayRecommendations(results);
    }
});

// Reset button event listener
document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('search-bar').value = '';
    document.getElementById('recommendation-list').innerHTML = '';
});
