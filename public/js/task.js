let sortOrder = {};
let currentPage = 0;
let pageSize = 5;
let currentSortField = null;

let allRows = []; // Guardamos todas las filas originales

document.addEventListener("DOMContentLoaded", () => {
    // Guardamos todas las filas originales
    const tbody = document.getElementById("task-tbody");
    allRows = Array.from(tbody.querySelectorAll("tr"));

    renderTable();

    // Inicializar el select de pageSize
    const pageSizeSelect = document.getElementById("page-size");
    pageSizeSelect.value = pageSize;
    pageSizeSelect.addEventListener("change", changePageSize);

    // Inicializar input de búsqueda
    const searchInput = document.getElementById("task-search");
    searchInput.addEventListener("keyup", () => {
        currentPage = 0; // reset page
        renderTable();
    });
});

function filterTasks() {
    currentPage = 0;
    renderTable();
}

function sortTable(field) {
    if (currentSortField === field) {
        sortOrder[field] = !sortOrder[field];
    } else {
        currentSortField = field;
        sortOrder[field] = true;
    }
    updateHeaderIcons();
    renderTable();
}

function updateHeaderIcons() {
    const headers = document.querySelectorAll("#task-table th");
    headers.forEach((th, index) => {
        th.classList.remove("is-selected", "sorted-asc", "sorted-desc");
        const icon = th.querySelector("i");
        if (!icon) return;

        const fieldMap = ["id","title","description","isCompleted","createdAt"];
        const field = fieldMap[index];
        if (field === currentSortField) {
            th.classList.add("is-selected");
            if (sortOrder[field]) {
                th.classList.add("sorted-asc");
                icon.className = "fa-solid fa-arrow-up";
            } else {
                th.classList.add("sorted-desc");
                icon.className = "fa-solid fa-arrow-down";
            }
        } else {
            icon.className = "fa-solid fa-arrow-up-wide-short";
        }
    });
}

function getFilteredRows() {
    const input = document.getElementById("task-search").value.toLowerCase();
    return allRows.filter(row => row.innerText.toLowerCase().includes(input));
}

function renderTable() {
    const tbody = document.getElementById("task-tbody");
    let rows = getFilteredRows();

    // Ordenamiento
    if (currentSortField) {
        const index = getColumnIndex(currentSortField) - 1;
        rows.sort((a, b) => {
            const aText = a.children[index].innerText;
            const bText = b.children[index].innerText;
            return sortOrder[currentSortField] ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
    }

    // Paginación
    const start = currentPage * pageSize;
    const end = start + pageSize;
    tbody.innerHTML = "";
    rows.slice(start, end).forEach(row => tbody.appendChild(row));

    // Actualizar contador
    document.getElementById("task-count").innerText = `${rows.length} resultados`;
}

function getColumnIndex(field) {
    switch(field) {
        case 'id': return 1;
        case 'title': return 2;
        case 'description': return 3;
        case 'isCompleted': return 4;
        case 'createdAt': return 5;
    }
}

function nextPage() {
    const rows = getFilteredRows();
    if ((currentPage + 1) * pageSize < rows.length) {
        currentPage++;
        renderTable();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderTable();
    }
}

function changePageSize() {
    const select = document.getElementById("page-size");
    pageSize = parseInt(select.value);
    currentPage = 0;
    renderTable();
}

let activeDropdown = null;
let outsideClickListener = null;

function toggleDropdown(el) {
    const dropdown = el.parentElement;

    // Si el dropdown actual ya está abierto -> ciérralo
    if (dropdown.classList.contains("active")) {
        closeDropdown(dropdown);
        return;
    }

    // Cierra cualquier dropdown previamente abierto
    if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.remove("active");
    }

    // Abre el nuevo dropdown
    dropdown.classList.add("active");
    activeDropdown = dropdown;

    // Agrega listener global si no existe
    if (!outsideClickListener) {
        outsideClickListener = (event) => {
            if (activeDropdown && !activeDropdown.contains(event.target)) {
                closeDropdown(activeDropdown);
            }
        };
        document.addEventListener("click", outsideClickListener);
    }
}

function closeDropdown(dropdown) {
    dropdown.classList.remove("active");

    // Si era el activo, lo limpiamos
    if (dropdown === activeDropdown) {
        activeDropdown = null;
    }

    // Si no hay dropdowns abiertos, quitamos el listener global
    if (!document.querySelector(".dropdown.active") && outsideClickListener) {
        document.removeEventListener("click", outsideClickListener);
        outsideClickListener = null;
    }
}


function deleteTask(id) {
    if(confirm("¿Estás seguro de eliminar esta tarea?")) {
        const row = allRows.find(r => r.children[0].innerText == id);
        if(row) {
            row.remove();
            allRows = allRows.filter(r => r !== row); // eliminar de referencia global
        }
        renderTable();
    }
}
