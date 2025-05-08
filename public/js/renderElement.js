const bx =document.querySelector('.bx-icon');
const bx_icon = document.querySelector('.bx-icon i');
const dropdownMenu = document.querySelector('.dropdown_menu');
bx.onclick = function(){
    dropdownMenu.classList.toggle("open");
    const isOpen = dropdownMenu.classList.contains('open');
    bx_icon.classList = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars'
} ;
gsap.to(".container", {
    opacity: 1,
    y: 0,
    duration: 1,        
    ease: "power2.out"  
});

gsap.to(".features_A", {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.1,           
    ease: "power2.out"
});

gsap.to(".how_it_works_A", {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.1,           
    ease: "power2.out"
});
const scrollArrow = document.getElementById('scrollArrow');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const halfPage = document.body.scrollHeight / 2;
    if (scrollY > halfPage) {
    scrollArrow.classList.add('show');
    } else {
    scrollArrow.classList.remove('show');
    }
});
scrollArrow.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const scrollArrows = document.getElementById('scrollArrow');
let isVisible = false;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const halfPage = document.body.scrollHeight / 2;

    if (scrollY > halfPage && !isVisible) {
        isVisible = true;
        gsap.to(scrollArrow, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        onStart: () => scrollArrow.style.visibility = "visible",
        onComplete: () => scrollArrow.style.pointerEvents = "auto"
    });
    } else if (scrollY <= halfPage && isVisible) {
        isVisible = false;
        gsap.to(scrollArrow, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
            scrollArrow.style.visibility = "hidden";
            scrollArrow.style.pointerEvents = "none";
        }
    });
    }
});

    scrollArrow.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  