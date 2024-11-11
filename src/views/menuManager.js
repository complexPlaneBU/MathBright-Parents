// Add an event listener to all menu icons
document.querySelectorAll('.bottom-nav button').forEach(button => {
    button.addEventListener('click', handleMenuIconClick);
});

function handleMenuIconClick(event) {
    const iconName = event.currentTarget.dataset.icon;
    const screenDiv = document.getElementById('screens');

    switch (iconName) {
        case 'home':
            import('./screens/home.js').then(module => {
                // Clear previous content
                screenDiv.innerHTML = '';
                // Render new content
                module.renderHomeHTML(screenDiv);
            }).catch(error => {
                console.error('Error loading home module:', error);
            });
            break;
        case 'vault':

            const scriptElement = document.currentScript;
            const scriptUrl = scriptElement ? scriptElement.src : '';
            console.log('Current script URL:', scriptUrl);

            import('./screens/vault.js').then(module => {
                // Clear previous content
                screenDiv.innerHTML = '';
                // Render new content
                module.initialize();
            }).catch(error => {
                console.error('Error loading vault module:', error);
            });
            break;
        // Add more cases as needed
        default:
            console.warn('Unknown icon name:', iconName);
    }
}

