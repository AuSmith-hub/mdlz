const listContainer = document.getElementById("acronymList");
const searchInput = document.getElementById("searchInput");
const alphabetBar = document.getElementById("alphabetBar");

let acronymList = []; // Array to store acronyms

// Function to render acronym list
function renderList(acronyms) {
    listContainer.innerHTML = "";
    acronyms.forEach(acronym => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${acronym.acronym}</strong><br>${acronym.fullForm}<br><span>${acronym.meaning}</span>`;
        listContainer.appendChild(listItem);
    });
}

// Function to filter acronyms based on search input
function filterList(searchText) {
    const filteredAcronyms = acronymList.filter(acronym => {
        return acronym.acronym.toLowerCase().includes(searchText.toLowerCase()) ||
               acronym.fullForm.toLowerCase().includes(searchText.toLowerCase()) ||
               acronym.meaning.toLowerCase().includes(searchText.toLowerCase());
    });
    renderList(filteredAcronyms);
}

// Event listener for search input
searchInput.addEventListener("input", function() {
    filterList(this.value);
});

// Function to generate alphabet navigation bar
function generateAlphabetBar() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    alphabet.forEach(letter => {
        const link = document.createElement("a");
        link.href = `#${letter}`;
        link.textContent = letter;
        alphabetBar.appendChild(link);
    });
}

// Function to handle scrolling and show/hide alphabet navigation bar
let lastScrollPosition = 0;
let isScrolling = false;

function handleScroll() {
    // Show/hide alphabet navigation bar based on scrolling direction
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollPosition > lastScrollPosition && !isScrolling) {
        isScrolling = true;
        alphabetBar.classList.remove("visible");
    } else if (!isScrolling) {
        isScrolling = true;
        alphabetBar.classList.add("visible");
    }
    lastScrollPosition = currentScrollPosition;

    // Highlight active letter in the alphabet navigation bar based on current scroll position
    const sections = document.querySelectorAll(".acronym-list > li");
    let activeLetter = "";
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) {
            activeLetter = section.querySelector("strong").textContent[0];
        }
    });
    setActiveLetter(activeLetter);

    // Reset isScrolling flag after 300ms to avoid rapid toggle of opacity
    setTimeout(() => {
        isScrolling = false;
    }, 300);
}

// Event listener for scrolling
window.addEventListener("scroll", handleScroll);

// Function to handle scrolling to specific section when clicking on alphabet navigation links
function handleAlphabetNavigation(event) {
    event.preventDefault();
    const targetLetter = event.target.textContent;
    const targetSection = document.getElementById(targetLetter);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
    }
}

// Event listener for alphabet navigation links
alphabetBar.addEventListener("click", handleAlphabetNavigation);

// Function to set active letter in the alphabet navigation bar
function setActiveLetter(letter) {
    const alphabetLinks = document.querySelectorAll("#alphabetBar a");
    alphabetLinks.forEach(link => {
        link.classList.remove("active");
        if (link.textContent === letter) {
            link.classList.add("active");
        }
    });
}

// Function to fetch and parse CSV file
function fetchCSV() {
    fetch('acronyms.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').filter(row => row.trim() !== ''); // Filter out empty rows
            rows.forEach(row => {
                const [acronym, fullForm, meaning] = row.split(',');
                acronymList.push({ acronym, fullForm, meaning });
            });
            renderList(acronymList);
            generateAlphabetBar();
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
        });
}

// Initial data fetching
fetchCSV();
