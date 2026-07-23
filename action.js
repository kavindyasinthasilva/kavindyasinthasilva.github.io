const bubbles = document.querySelector('.bubbles');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (bubbles && window.innerWidth < 400) {
    bubbles.style.setProperty('--transform-duration', '15s');
    bubbles.style.setProperty('--transform-y', '-700vh');
}

const animatedElements = {
    text: document.getElementById('text'),
    cloud: document.getElementById('cloud'),
    bird1: document.getElementById('bird1'),
    bird2: document.getElementById('bird2'),
    explore: document.getElementById('explore'),
    rocks: document.getElementById('rocks'),
    forest: document.getElementById('forest'),
    sky: document.getElementById('sky'),
    mountains: document.getElementById('mountains'),
    header: document.getElementById('header'),
    sun: document.getElementById('sun'),
    splash: document.getElementById('splash'),
    fish1: document.getElementById('fish1'),
    fish2: document.getElementById('fish2'),
    fish3: document.getElementById('fish3'),
    fish4: document.getElementById('fish4')
};

let animationFrame = 0;

const renderParallax = () => {
    animationFrame = 0;

    if (prefersReducedMotion.matches) {
        return;
    }

    const value = window.scrollY;
    const mobile = window.innerWidth < 400;
    const fish2Start = mobile ? 1680 : 100;
    const fish3Start = mobile ? 3000 : 900;
    const fish4Start = mobile ? 4300 : 1200;

    animatedElements.text.style.top = `${50 - value * 0.2}%`;
    animatedElements.cloud.style.left = `${value * 2}px`;
    animatedElements.bird1.style.transform = `translate(${value}px, ${value * 0.1}px)`;
    animatedElements.bird2.style.transform = `translate(${-value * 2}px, ${-value * 0.1}px)`;
    animatedElements.explore.style.marginTop = `${value * 1.5}px`;
    animatedElements.rocks.style.top = `${value * -0.14}px`;
    animatedElements.forest.style.top = `${value * 0.4}px`;
    animatedElements.sky.style.top = `${value * 0.25}px`;
    animatedElements.mountains.style.top = `${value * 0.25}px`;
    animatedElements.header.style.top = `${value * 0.7}px`;
    animatedElements.sun.style.top = `${value}px`;

    if (value < 380) {
        animatedElements.splash.style.top = `${20 - value * 0.3}px`;
    }

    animatedElements.fish1.style.right = `${value - 100}px`;
    animatedElements.fish2.style.left = `${value - fish2Start}px`;
    animatedElements.fish3.style.right = `${value - fish3Start}px`;
    animatedElements.fish4.style.left = `${value - fish4Start}px`;
};

const requestParallax = () => {
    if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(renderParallax);
    }
};

window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax, { passive: true });
prefersReducedMotion.addEventListener('change', requestParallax);

const npmPackageCards = [...document.querySelectorAll('[data-npm-package]')];
const npmTotalDownloads = document.getElementById('npm-total-downloads');
const numberFormatter = new Intl.NumberFormat('en');

if (npmPackageCards.length && npmTotalDownloads) {
    Promise.all(
        npmPackageCards.map(async (card) => {
            const packageName = card.dataset.npmPackage;
            const downloadElement = card.querySelector('[data-weekly-downloads]');

            try {
                const response = await fetch(
                    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`
                );

                if (!response.ok) {
                    throw new Error(`npm downloads request failed with ${response.status}`);
                }

                const data = await response.json();
                downloadElement.textContent = numberFormatter.format(data.downloads);
                downloadElement.title = `${data.start} to ${data.end}`;
                return data.downloads;
            } catch {
                return Number.parseInt(downloadElement.textContent.replace(/\D/g, ''), 10) || 0;
            }
        })
    ).then((downloads) => {
        npmTotalDownloads.textContent = numberFormatter.format(
            downloads.reduce((total, count) => total + count, 0)
        );
    });
}
