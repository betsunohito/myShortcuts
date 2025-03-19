document.addEventListener("DOMContentLoaded", function () {
    const savedAlignment = localStorage.getItem("backgroundAlignment") || "bottom center";
    let isVisible = false; // Track visibility of input fields and buttons

    // Function to apply background alignment based on saved settings
    function applyBackgroundAlignment(alignment) {
        document.body.style.backgroundPosition = (document.body.style.background || "").includes(",")
            ? theme.images.additional_backgrounds.map(() => alignment).join(", ")
            : alignment;
    }

    // Apply background settings based on browser theme
    if (typeof browser !== "undefined" && browser.theme) {
        browser.theme.getCurrent().then(theme => {
            const themeFrameImage = theme.images?.theme_frame;
            const themeColor = theme.colors?.frame;

            if (themeFrameImage) {
    // Apply the saved alignment or default to "center center"
    const alignment = localStorage.getItem("backgroundAlignment") || "center center";
    document.body.style.background = `url(${themeFrameImage}) no-repeat ${alignment} fixed`;
    document.body.style.backgroundSize = "cover";
}




else if (theme.images?.additional_backgrounds?.length) {
                document.body.style.background = theme.images.additional_backgrounds.map(imageUrl => `url(${imageUrl}) repeat`).join(", ") + `, ${themeColor || "#f0f0f0"}`;
                document.body.style.backgroundSize = "auto";
                applyBackgroundAlignment(savedAlignment); // Apply saved alignment
            } else if (themeColor) {
                document.body.style.backgroundColor = themeColor;
            } else {
                document.body.style.backgroundColor = "#f0f0f0"; // Fallback color
            }
        });
    }

    const buttonsContainer = document.getElementById("buttonsContainer");
    const toggleVisibleElements = document.querySelectorAll(".toggleVisible");
    const siteNameInput = document.getElementById("siteNameInput");
    const addButton = document.getElementById("addButton");

    // Load saved shortcuts from localStorage
    function loadShortcuts() {
        buttonsContainer.innerHTML = ""; // Clear existing shortcuts
        const savedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];

        savedShortcuts.forEach(siteName => createShortcut(siteName, isVisible));
        updateContainerSize(); // Adjust container size after loading
    }

    // Create a shortcut inside a div wrapper
    function createShortcut(siteName, isVisible) {
        const shortcutDiv = document.createElement("div");
        shortcutDiv.classList.add("shortcut");

        const button = document.createElement("a");
        button.classList.add("button");
        button.href = siteName;
        button.target = "_blank";

        // Extract domain for favicon
        let faviconDomain = siteName.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=32`;
        button.style.backgroundImage = `url(${faviconUrl})`;
        button.style.backgroundSize = "16px 16px";
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundPosition = "center";

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.innerText = "X";
        removeBtn.onclick = () => removeShortcut(siteName, shortcutDiv);

        if (!isVisible) {
            removeBtn.classList.add("hidden"); // Hide if not visible
        }

        // Append elements
        shortcutDiv.appendChild(button);
        shortcutDiv.appendChild(removeBtn);
        buttonsContainer.appendChild(shortcutDiv);
        updateContainerSize(); // Update container size when a shortcut is added
    }

    // Add new shortcut
    addButton.addEventListener("click", function () {
        let siteName = siteNameInput.value.trim().toLowerCase();
        if (!siteName) return;

        if (!siteName.startsWith("http")) {
            siteName = "https://" + siteName; // Ensure valid URLs
        }

        let savedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
        if (!savedShortcuts.includes(siteName)) {
            savedShortcuts.push(siteName);
            localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
            createShortcut(siteName, isVisible);
        }

        siteNameInput.value = ""; // Clear input field
    });

    // Remove a shortcut
    function removeShortcut(siteName, shortcutDiv) {
        let savedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
        savedShortcuts = savedShortcuts.filter(name => name !== siteName);
        localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));

        // Remove the shortcut div
        buttonsContainer.removeChild(shortcutDiv);
        updateContainerSize(); // Update container size when a shortcut is removed
    }

    toggleVisibleElements.forEach(element => {
        element.classList.add("hidden");
    });

    // Function to toggle visibility
    function toggleVisibility(show) {
        const removeButtons = document.querySelectorAll(".remove-btn");
        if (show) {
            toggleVisibleElements.forEach(element => {
                element.classList.remove("hidden");
            });
            removeButtons.forEach(button => button.classList.remove("hidden"));
        } else {
            toggleVisibleElements.forEach(element => {
                element.classList.add("hidden");
            });
            removeButtons.forEach(button => button.classList.add("hidden"));
        }

        isVisible = show; // Update the visibility state
    }

    // Detect double-click anywhere on the document body to toggle visibility
    document.body.addEventListener("dblclick", function () {
        isVisible = !isVisible;
        toggleVisibility(isVisible);
    });

    // Ensure minimum space when no shortcuts exist
    function updateContainerSize() {
        if (buttonsContainer.children.length === 0) {
            buttonsContainer.style.minWidth = "75px";
            buttonsContainer.style.minHeight = "75px";
        } else {
            buttonsContainer.style.minWidth = "auto";
            buttonsContainer.style.minHeight = "auto";
        }
    }

    // Load existing shortcuts when the page loads
    loadShortcuts();
});
