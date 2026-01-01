const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

        // active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || filter === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
