window.addEventListener("load", () => {
    const loaderWrapper = document.getElementById("loader-wrapper");
    const content = document.querySelector(".content");

    // Start fade-out animation
    loaderWrapper.style.opacity = "0";
    loaderWrapper.style.transition = "opacity 0.4s ease";

    setTimeout(() => {
        loaderWrapper.style.display = "none";
        content.style.visibility = "visible"; 
        content.style.opacity = "1";

        // If you're using AOS, refresh animations after loader disappears
        if (window.AOS) {
            AOS.refresh();
        }
    }, 400);
});