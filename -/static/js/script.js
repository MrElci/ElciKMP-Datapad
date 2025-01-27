function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
}

let scrollInterval; // Kaydırma işlemi için interval değişkeni

function startScrolling(direction) {
  const content = document.querySelector('.content');
  scrollInterval = setInterval(() => {
    content.scrollBy({
      top: direction === 'up' ? -25 : 25, // Daha hızlı kaydırma için değeri artır
      behavior: 'smooth',
    });
  }, 30); // Daha hızlı kaydırma için süreyi azalt
}

function stopScrolling() {
  clearInterval(scrollInterval); // Kaydırmayı durdur
}

document.querySelector('.scroll-up').addEventListener('mousedown', () => {
  startScrolling('up'); // Yukarı kaydırma başlat
});

document.querySelector('.scroll-up').addEventListener('mouseup', stopScrolling); // Kaydırmayı durdur
document.querySelector('.scroll-up').addEventListener('mouseleave', stopScrolling); // Fare dışarı çıkarsa kaydırmayı durdur

document.querySelector('.scroll-down').addEventListener('mousedown', () => {
  startScrolling('down'); // Aşağı kaydırma başlat
});

document.querySelector('.scroll-down').addEventListener('mouseup', stopScrolling); // Kaydırmayı durdur
document.querySelector('.scroll-down').addEventListener('mouseleave', stopScrolling); // Fare dışarı çıkarsa kaydırmayı durdur