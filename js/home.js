/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    /*========== sticky navbar ==========*/
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 80); // Adjusted threshold from 100 to 80

    /*========== remove menu icon navbar when click navbar link (scroll) ==========*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

/*========== swiper ==========*/
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 50,
        }
    }
});

/*========== dark light mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};

/*========== scroll reveal ==========*/
ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });

/*========== Google Maps Init ==========*/
let map;
function initMap() {
    const tirana = { lat: 41.3275, lng: 19.8189 };
  
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: tirana,
    });
  
    let allData;
  
    fetch("data/routes.geojson")
      .then(response => response.json())
      .then(data => {
        allData = data;
  
        const routeSelect = document.getElementById("routeSelect");
        const routeNames = new Set();
  
        // Extract all unique route names from LineStrings
        data.features.forEach(feature => {
          if (feature.geometry.type !== "Point") {
            const routeName = feature.properties.name;
            if (routeName && !routeNames.has(routeName)) {
              routeNames.add(routeName);
              const option = document.createElement("option");
              option.value = routeName;
              option.textContent = routeName;
              routeSelect.appendChild(option);
            }
          }
        });
  
        // Initial load: show all
        map.data.addGeoJson(allData);
        applyStyle(map);
  
        // Handle route selection
        routeSelect.addEventListener("change", () => {
          const selectedRoute = routeSelect.value;
  
          // Clear map
          map.data.forEach(f => map.data.remove(f));
  
          if (selectedRoute !== "") {
            // Filter both lines and points for the selected route
            const filteredFeatures = allData.features.filter(feature => {
              if (feature.geometry.type === "Point") {
                try {
                  const relName =
                    feature.properties["@relations"]?.[0]?.reltags?.name;
                  return relName === selectedRoute;
                } catch {
                  return false;
                }
              } else {
                return feature.properties.name === selectedRoute;
              }
            });
  
            filteredFeatures.forEach(f => map.data.addGeoJson(f));
          } else {
            // Show everything again
            map.data.addGeoJson(allData);
          }
  
          applyStyle(map);
        });
      })
      .catch(err => console.error("Failed to load GeoJSON:", err));
  
    // Styling logic
    function applyStyle(map) {
      map.data.setStyle(feature => {
        const type = feature.getGeometry().getType();
        if (type === "Point") {
          return {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
              fillColor: "#FF0000",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 1,
            },
          };
        } else {
          return {
            strokeColor: "#007BFF",
            strokeWeight: 4,
          };
        }
      });
    }
  }
  