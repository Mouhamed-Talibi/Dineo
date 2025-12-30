document.querySelectorAll('.offcanvas .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
        // Get the offcanvas element
        const offcanvasEl = this.closest('.offcanvas');
        // Get Bootstrap instance
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        bsOffcanvas.hide();
        // Delay navigation slightly
        setTimeout(() => {
            window.location.href = href;
        }, 300);
        e.preventDefault();
        }
    });
});