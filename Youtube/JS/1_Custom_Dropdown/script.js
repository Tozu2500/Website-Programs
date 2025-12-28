const options = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "TypeScript",
    "PHP",
    "Perl",
    "Scala",
    "Haskell",
    "Dart",
    "R",
    "MATLAB",
    "Julia",
    "Elixir"
];

const dropdown = document.getElementById("dropdown");
const input = document.getElementById("dropdownInput");
const menu = document.getElementById("dropdownMenu");
const selectedValue = document.getElementById("selectedValue");
const selectedText = document.getElementById("selectedText");

let isOpen = false;
let focusedIndex = -1;
let filteredOptions = [...options];
let selectedOption = null;

function renderOptions() {
    menu.innerHTML = "";

    if (filteredOptions.length === 0) {
        menu.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }

    filteredOptions.forEach((option, index) => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = option;

        if (index === focusedIndex) {
            item.classList.add("focused");
        }

        if (option === selectedOption) {
            item.classList.add("selected");
        }

        item.addEventListener("click", () => selectOption(option));
        item.addEventListener("mouseenter", () => {
            focusedIndex = index;
            updateFocusedItem();
        });

        menu.appendChild(item);
    });
}

function updateFocusedItem() {
    const items = menu.querySelectorAll(".dropdown-item");
    items.forEach((item, index) => {
        item.classList.toggle("focused", index === focusedIndex);
    });

    if (focusedIndex >= 0 && items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function openDropdown() {
    isOpen = true;
    dropdown.classList.add("open");
    menu.classList.add("show");
    renderOptions();
}

function closeDropdown() {
    isOpen = false;
    dropdown.classList.remove("open");
    menu.classList.remove("show");
    focusedIndex = -1;
}

function selectOption(option) {
    selectedOption = option;
    input.value = option;
    selectedText.textContent = option;
    selectedValue.style.display = "block";
    closeDropdown();
}

function filterOptions(query) {
    filteredOptions = options.filter(option =>
        option.toLowerCase().includes(query.toLowerCase())
    );
    focusedIndex = filteredOptions.length > 0 ? 0 : -1;
    renderOptions();
}

input.addEventListener("click", () => {
    if (!isOpen) {
        openDropdown();
    }
});

input.addEventListener("input", (e) => {
    if (!isOpen) {
        openDropdown();
    }
    filterOptions(e.target.value);
});

input.addEventListener("keydown", (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
        openDropdown();
        e.preventDefault();
        return;
    }

    if (!isOpen) return;

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            focusedIndex = Math.min(focusedIndex + 1, filteredOptions.length - 1);
            updateFocusedItem();
            break;

        case "ArrowUp":
            e.preventDefault();
            focusedIndex = Math.max(focusedIndex - 1, 0);
            updateFocusedItem();
            break;

        case "Enter":
            e.preventDefault();
            if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
                selectOption(filteredOptions[focusedIndex]);
            }
            break;

        case "Escape":
            e.preventDefault();
            closeDropdown();
            break;
    }
});

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        closeDropdown();
    }
});

renderOptions();