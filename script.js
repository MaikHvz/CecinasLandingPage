// Número de WhatsApp de la empresa (reemplazar con el número real)
const WHATSAPP_NUMBER = "56912345678" // Formato: código país + número sin +

// Función para contactar por WhatsApp
function contactarWhatsApp(tipo = "general") {
  let mensaje = ""

  switch (tipo) {
    case "cotizacion":
      mensaje = "Hola! Me interesa solicitar una cotización para sus productos de cecinas artesanales."
      break
    case "mayorista":
      mensaje = "Hola! Me interesa conocer los precios mayoristas para sus cecinas artesanales."
      break
    case "minorista":
      mensaje = "Hola! Me interesa conocer los precios minoristas de sus productos."
      break
    case "proveedor":
      mensaje = "Hola! Me interesa ser proveedor/distribuidor de sus cecinas artesanales."
      break
    case "catalogo":
      mensaje = "Hola! Me gustaría recibir su catálogo completo de productos."
      break
    case "conocer-mas":
      mensaje = "Hola! Me gustaría conocer más sobre su empresa y productos artesanales."
      break
    case "flotante":
      mensaje = "Hola! Me contacto desde su página web. Me interesan sus cecinas artesanales."
      break
    default:
      mensaje = "Hola! Me contacto desde su página web para consultar sobre sus productos."
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 64 // Altura del header fijo
    const elementPosition = element.offsetTop - headerHeight

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

// Menú móvil
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const nav = document.getElementById("nav")

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.style.display = nav.style.display === "flex" ? "none" : "flex"
      nav.style.position = "absolute"
      nav.style.top = "64px"
      nav.style.left = "0"
      nav.style.right = "0"
      nav.style.background = "#000"
      nav.style.flexDirection = "column"
      nav.style.padding = "1rem"
      nav.style.gap = "1rem"
    })
  }

  // Cerrar menú móvil al hacer click en un enlace
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.style.display = "none"
      }
    })
  })

  // Animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  const animatedElements = document.querySelectorAll(".producto-card, .servicio-card, .feature")
  animatedElements.forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })

  // Highlight del menú activo
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.clientHeight
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })

  // Ajustar menú al cambiar tamaño de pantalla
  window.addEventListener("resize", () => {
    const nav = document.getElementById("nav")
    if (!nav) return
    if (window.innerWidth > 768) {
      nav.style.display = "flex"
      nav.style.position = "static"
      nav.style.background = ""
      nav.style.flexDirection = ""
      nav.style.padding = ""
      nav.style.gap = ""
    } else {
      nav.style.display = "none"
      nav.style.position = "absolute"
      nav.style.top = "64px"
      nav.style.left = "0"
      nav.style.right = "0"
      nav.style.background = "#000"
      nav.style.flexDirection = "column"
      nav.style.padding = "1rem"
      nav.style.gap = "1rem"
    }
  })
})

// Función para manejar el envío de formularios (si se agregan más adelante)
function handleFormSubmit(event) {
  event.preventDefault()
  // Aquí se puede agregar lógica para manejar formularios
  contactarWhatsApp("formulario")
}

// Función para mostrar/ocultar el botón de WhatsApp según el scroll
window.addEventListener("scroll", () => {
  const whatsappFloat = document.querySelector(".whatsapp-float")
  if (window.scrollY > 300) {
    whatsappFloat.style.opacity = "1"
    whatsappFloat.style.visibility = "visible"
  } else {
    whatsappFloat.style.opacity = "0.7"
  }
})

// Preloader simple (opcional)
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Función para analytics (Google Analytics, Facebook Pixel, etc.)
function trackEvent(eventName, parameters = {}) {
  // Aquí se pueden agregar llamadas a Google Analytics, Facebook Pixel, etc.
  console.log("Event tracked:", eventName, parameters)

  // Ejemplo para Google Analytics 4
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, parameters)
  }

  // Ejemplo para Facebook Pixel
  if (typeof fbq !== "undefined") {
    fbq("track", eventName, parameters)
  }
}

// Tracking de clicks en botones importantes
document.addEventListener("click", (event) => {
  const target = event.target

  if (target.classList.contains("btn-primary")) {
    trackEvent("button_click", {
      button_text: target.textContent,
      button_location: target.closest("section")?.id || "unknown",
    })
  }

  if (target.closest(".whatsapp-float")) {
    trackEvent("whatsapp_click", {
      source: "floating_button",
    })
  }
})
