const hero = document.querySelector(".hero");

    const images = [
        "imgs/Hero-1.webp",
        "imgs/Hero-2.webp",
        "imgs/Hero-3.webp",
        "imgs/Hero-4.webp",
        "imgs/Hero-5.webp",
    ];

    let index = 0;

    function changeHeroBg() {
        hero.style.backgroundImage = `url(${images[index]})`;
        index = (index + 1) % images.length;
    }

    // initial image
    changeHeroBg();

    // change every 5 seconds
    setInterval(changeHeroBg, 10000);