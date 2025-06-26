// Número de WhatsApp de la empresa
const WHATSAPP_NUMBER = "56912345678"

// Función para contactar por WhatsApp
function contactarWhatsApp(tipo = "catalogo") {
  let mensaje = ""

  switch (tipo) {
    case "catalogo":
      mensaje = "Hola! Me interesa recibir más información sobre su catálogo de cecinas artesanales."
      break
    case "cotizacion":
      mensaje = "Hola! Me gustaría solicitar una cotización personalizada para sus productos."
      break
    case "mayorista":
      mensaje = "Hola! Me interesa conocer las condiciones mayoristas para sus cecinas."
      break
    case "proveedor":
      mensaje = "Hola! Me interesa ser distribuidor/proveedor de sus cecinas artesanales."
      break
    default:
      mensaje = "Hola! Me contacto desde su catálogo digital para consultar sobre sus productos."
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}

// Función para descargar PDF (simulada)
function descargarPDF() {
  // En una implementación real, aquí se generaría el PDF
  alert("Función de descarga PDF en desarrollo. Por favor, use la opción de imprimir por ahora.")

  // Alternativa: abrir ventana de impresión
  window.print()
}

// Manejo del selector de tipo de cliente
document.addEventListener("DOMContentLoaded", () => {
  const selectorButtons = document.querySelectorAll(".selector-btn")
  const body = document.body

  selectorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover clase active de todos los botones
      selectorButtons.forEach((btn) => btn.classList.remove("active"))

      // Agregar clase active al botón clickeado
      button.classList.add("active")

      // Obtener el tipo de cliente
      const tipo = button.getAttribute("data-tipo")

      // Remover todas las clases de tipo de cliente del body
      body.classList.remove("show-minorista", "show-mayorista", "show-proveedor")

      // Agregar la clase correspondiente
      body.classList.add(`show-${tipo}`)

      // Tracking del evento
      trackEvent("cliente_type_selected", {
        tipo_cliente: tipo,
      })
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
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observar las tarjetas de productos
  const productCards = document.querySelectorAll(".producto-card")
  productCards.forEach((card) => {
    observer.observe(card)
  })

  // Smooth scroll para navegación interna
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      smoothScrollTo(targetId)
    })
  })

  // Efecto hover en las tarjetas de productos
  const productos = document.querySelectorAll(".producto-card")
  productos.forEach((producto) => {
    producto.addEventListener("mouseenter", () => {
      producto.style.transform = "translateY(-5px) scale(1.02)"
    })

    producto.addEventListener("mouseleave", () => {
      producto.style.transform = "translateY(0) scale(1)"
    })
  })

  // Funcionalidad de búsqueda (opcional)
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const productos = document.querySelectorAll(".producto-card")

      productos.forEach((producto) => {
        const title = producto.querySelector("h4").textContent.toLowerCase()
        const description = producto.querySelector(".producto-descripcion").textContent.toLowerCase()

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          producto.style.display = "block"
        } else {
          producto.style.display = "none"
        }
      })
    })
  }

  loadClientType()

  // Menú móvil para el catálogo
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show")

      // Cambiar icono del menú
      const icon = mobileMenuBtn.querySelector("i")
      if (navLinks.classList.contains("show")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })

    // Cerrar menú móvil al hacer click en un enlace
    const navLinksElements = document.querySelectorAll(".nav-link")
    navLinksElements.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove("show")
          const icon = mobileMenuBtn.querySelector("i")
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      })
    })

    // Cerrar menú móvil al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("show")
        const icon = mobileMenuBtn.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }
})

// Función para tracking de eventos
function trackEvent(eventName, parameters = {}) {
  console.log("Event tracked:", eventName, parameters)

  // Integración con Google Analytics
  if (typeof gtag !== "undefined" && typeof gtag === "function") {
    gtag("event", eventName, parameters)
  }

  // Integración con Facebook Pixel
  if (typeof fbq !== "undefined" && typeof fbq === "function") {
    fbq("track", eventName, parameters)
  }
}

// Tracking de interacciones importantes
document.addEventListener("click", (event) => {
  const target = event.target

  // Track clicks en productos
  if (target.closest(".producto-card")) {
    const productName = target.closest(".producto-card").querySelector("h4").textContent
    trackEvent("product_view", {
      product_name: productName,
    })
  }

  // Track clicks en botones de acción
  if (target.classList.contains("btn-action")) {
    trackEvent("action_button_click", {
      button_text: target.textContent.trim(),
    })
  }

  // Track clicks en precios
  if (target.closest(".precio")) {
    const tipoCliente = document.querySelector(".selector-btn.active").getAttribute("data-tipo")
    trackEvent("price_view", {
      tipo_cliente: tipoCliente,
    })
  }
})

// Función para imprimir catálogo optimizado
function imprimirCatalogo() {
  // Mostrar todos los precios para impresión
  const body = document.body
  const originalClass = body.className

  // Remover clases de filtro para mostrar todos los precios
  body.className = body.className.replace(/show-\w+/g, "")

  // Imprimir
  window.print()

  // Restaurar clases originales después de imprimir
  setTimeout(() => {
    body.className = originalClass
  }, 1000)
}

// Función para generar reporte de precios
function generarReportePrecios() {
  const productos = document.querySelectorAll(".producto-card")
  let reporte = "REPORTE DE PRECIOS - CECINAS ARTESANALES\n"
  reporte += "=".repeat(50) + "\n\n"

  productos.forEach((producto) => {
    const nombre = producto.querySelector("h4").textContent
    const minorista = producto.querySelector(".precio.minorista .precio-valor").textContent
    const mayorista = producto.querySelector(".precio.mayorista .precio-valor").textContent
    const proveedor = producto.querySelector(".precio.proveedor .precio-valor").textContent

    reporte += `${nombre}\n`
    reporte += `  Minorista: ${minorista}\n`
    reporte += `  Mayorista: ${mayorista}\n`
    reporte += `  Proveedor: ${proveedor}\n\n`
  })

  // Crear y descargar archivo de texto
  const blob = new Blob([reporte], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "reporte-precios-cecinas.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Función para compartir catálogo
function compartirCatalogo() {
  if (navigator.share) {
    navigator
      .share({
        title: "Catálogo Cecinas Artesanales",
        text: "Revisa nuestro catálogo completo de cecinas artesanales premium",
        url: window.location.href,
      })
      .then(() => {
        trackEvent("catalog_shared", { method: "native" })
      })
      .catch((error) => {
        console.log("Error sharing:", error)
      })
  } else {
    // Fallback para navegadores que no soportan Web Share API
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert("Enlace copiado al portapapeles")
      trackEvent("catalog_shared", { method: "clipboard" })
    })
  }
}

// Inicialización de tooltips (si se usan)
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      tooltip.textContent = e.target.getAttribute("data-tooltip")
      document.body.appendChild(tooltip)

      const rect = e.target.getBoundingClientRect()
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
    })

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    })
  })
}

// Auto-save del tipo de cliente seleccionado
function saveClientType(tipo) {
  localStorage.setItem("cecinas_client_type", tipo)
}

function loadClientType() {
  const savedType = localStorage.getItem("cecinas_client_type")
  if (savedType) {
    const button = document.querySelector(`[data-tipo="${savedType}"]`)
    if (button) {
      button.click()
    }
  }
}

// Cargar tipo de cliente guardado al inicializar
document.addEventListener("DOMContentLoaded", () => {
  loadClientType()
})

// Smooth scroll mejorado para navegación
function smoothScrollTo(targetId) {
  const element = document.getElementById(targetId)
  if (element) {
    const headerHeight = 64 // Altura del header de navegación
    const elementPosition = element.offsetTop - headerHeight

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}
