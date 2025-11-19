/**
* File        : frontend/js/controllers/studentsSubjectsController.js
* Project     : CRUD PHP
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Mayo 2025
* Status      : Prototype
* Iteration   : 1.2 ( Fix bugs UI )
*/

import { studentsAPI } from '../apiConsumers/studentsAPI.js';
import { subjectsAPI } from '../apiConsumers/subjectsAPI.js';
import { studentsSubjectsAPI } from '../apiConsumers/studentsSubjectsAPI.js';

document.addEventListener('DOMContentLoaded', async () => 
{
    // Hacemos el init asíncrono seguro para que no bloquee los eventos si falla la red
    await initSelects();
    setupFormHandler();
    setupCancelHandler();
    setupFilterHandler();
    setupModalHandlers(); // Configuramos el modal EXPLICITAMENTE
    loadRelations();
});

async function initSelects() 
{
    try 
    {
        // 1. Cargar Estudiantes
        const students = await studentsAPI.fetchAll();
        const studentSelect = document.getElementById('studentIdSelect');
        
        if (studentSelect) {
            students.forEach(s => {
                const option = document.createElement('option');
                option.value = s.id;
                option.textContent = s.fullname;
                studentSelect.appendChild(option);
            });
        }

        // 2. Cargar Materias
        const subjects = await subjectsAPI.fetchAll();
        
        // Select del Formulario (Asignación)
        const subjectSelect = document.getElementById('subjectIdSelect');
        if (subjectSelect) {
            subjects.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.id;
                option.textContent = sub.name;
                subjectSelect.appendChild(option);
            });
        }

        // Select del Filtro (Busqueda)
        const filterSelect = document.getElementById('filterSubjectSelect');
        if (filterSelect) {
            subjects.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.id;
                option.textContent = sub.name;
                filterSelect.appendChild(option);
            });
        }
    } 
    catch (err) 
    {
        console.error('Error crítico cargando listas:', err.message);
        // No usamos showModal aquí para evitar recursión si el DOM no está listo
    }
}

function setupFormHandler() 
{
    const form = document.getElementById('relationForm');
    if (!form) return; // Seguridad

    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const relation = getFormData();

        try 
        {
            let response;
            if (relation.id) 
            {
                response = await studentsSubjectsAPI.update(relation);
            } 
            else 
            {
                response = await studentsSubjectsAPI.create(relation);
            }
            
            if(response && response.message){
                 showModal('Éxito', response.message);
            }

            clearForm();
            loadRelations();
        } 
        catch (err) 
        {
            console.error('Error guardando relación:', err.message);
            showModal('Error', err.message);
        }
    });
}

function setupFilterHandler() 
{
    const btnFilter = document.getElementById('btnFilter');
    if (!btnFilter) return;

    btnFilter.addEventListener('click', async () => {
        const select = document.getElementById('filterSubjectSelect');
        const subjectId = select ? select.value : null;
        
        if (!subjectId) {
            showModal('Atención', 'Por favor seleccione una materia para filtrar.');
            return;
        }

        try {
            const students = await studentsSubjectsAPI.fetchBySubjectId(subjectId);
            renderFilterResults(students);
        } catch (err) {
            console.error('Error filtrando:', err.message);
            showModal('Información', err.message);
        }
    });
}

function renderFilterResults(studentsList) 
{
    const modal = document.getElementById('resultsModal');
    const listContainer = document.getElementById('resultsList');
    const noResults = document.getElementById('noResultsMsg');
    const modalTitle = document.getElementById('resultsModalTitle');
    const select = document.getElementById('filterSubjectSelect');
    
    if(!modal || !listContainer) return;

    const subjectName = select.options[select.selectedIndex].text;

    listContainer.innerHTML = ''; 
    modalTitle.textContent = `Alumnos en: ${subjectName}`;

    if (!studentsList || studentsList.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        studentsList.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s.fullname;
            li.className = "w3-padding-16";
            const icon = document.createElement('span');
            icon.className = "w3-large w3-margin-right";
            icon.innerHTML = "&#127891;"; 
            li.prepend(icon);
            listContainer.appendChild(li);
        });
    }

    modal.style.display = 'block';
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    if(cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('relationId').value = '';
        });
    }
}

function getFormData() 
{
    return{
        id: document.getElementById('relationId').value.trim(),
        student_id: document.getElementById('studentIdSelect').value,
        subject_id: document.getElementById('subjectIdSelect').value,
        approved: document.getElementById('approved').checked ? 1 : 0
    };
}

function clearForm() 
{
    document.getElementById('relationForm').reset();
    document.getElementById('relationId').value = '';
}

async function loadRelations() 
{
    try 
    {
        const relations = await studentsSubjectsAPI.fetchAll();
        
        // Validación extra por si la API no devuelve un array
        if (!Array.isArray(relations)) {
            throw new Error("Formato de datos inválido recibido del servidor");
        }

        relations.forEach(rel => {
            rel.approved = Number(rel.approved);
        });
        renderRelationsTable(relations);
    } 
    catch (err) 
    {
        console.error('Error cargando inscripciones:', err.message);
    }
}

function renderRelationsTable(relations) 
{
    const tbody = document.getElementById('relationTableBody');
    if (!tbody) return;
    
    tbody.replaceChildren();

    relations.forEach(rel => 
    {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(rel.student_fullname));
        tr.appendChild(createCell(rel.subject_name));
        tr.appendChild(createCell(rel.approved ? 'Sí' : 'No'));
        tr.appendChild(createActionsCell(rel));
        tbody.appendChild(tr);
    });
}

function createCell(text) 
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(relation) 
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(relation));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(relation.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(relation) 
{
    document.getElementById('relationId').value = relation.id;
    document.getElementById('studentIdSelect').value = relation.student_id;
    document.getElementById('subjectIdSelect').value = relation.subject_id;
    document.getElementById('approved').checked = !!relation.approved;
}

async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar esta inscripción?')) return;

    try 
    {
        await studentsSubjectsAPI.remove(id);
        showModal('Éxito', 'Inscripción eliminada correctamente');
        loadRelations();
    } 
    catch (err) 
    {
        console.error('Error al borrar inscripción:', err.message);
        showModal('Error', err.message);
    }
}

/**
 * LÓGICA DEL MODAL (Restaurada)
 */
function setupModalHandlers() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;

    const closeBtn = modalOverlay.querySelector('.close-btn');
    
    // Evento click fuera del modal
    modalOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'modalOverlay') {
            closeModal();
        }
    });

    // Evento click en la X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
}

function showModal(title, message) {
    const titleElem = document.getElementById('modalTitle');
    const msgElem = document.getElementById('modalMessage');
    const overlay = document.getElementById('modalOverlay');

    if (titleElem && msgElem && overlay) {
        titleElem.textContent = title;
        msgElem.textContent = message;
        overlay.style.display = 'flex'; // Usamos flex para centrar según tu CSS
    } else {
        alert(`${title}: ${message}`); // Fallback por si falla el HTML
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}