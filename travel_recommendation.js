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

function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById('recommendation-list');
    resultsContainer.innerHTML = '';

    recommendations.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('recommendation-item');
        
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;

        const title = document.createElement('h3');
        title.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        itemElement.appendChild(image);
        itemElement.appendChild(title);
        itemElement.appendChild(description);

        resultsContainer.appendChild(itemElement);
    });
}

document.getElementById('search-btn').addEventListener('click', async () => {
    const keyword = document.getElementById('search-bar').value.toLowerCase();
    const data = await fetchData();
    
    if (data) {
        let results = [];

        // Search through beaches
        if (Array.isArray(data.beaches)) {
            data.beaches.forEach(item => {
                if (item.name.toLowerCase().includes(keyword)) {
                    results.push(item);
                }
            });
        }

        // Search through temples
        if (Array.isArray(data.temples)) {
            data.temples.forEach(item => {
                if (item.name.toLowerCase().includes(keyword)) {
                    results.push(item);
                }
            });
        }

        // Search through countries
        if (Array.isArray(data.countries)) {
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(keyword)) {
                    results.push(...country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(keyword)) {
                            results.push(city);
                        }
                    });
                }
            });
        }

        displayRecommendations(results);
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('search-bar').value = '';
    document.getElementById('recommendation-list').innerHTML = '';
});
