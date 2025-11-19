/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

import { subjectsAPI } from '../apiConsumers/subjectsAPI.js';
document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
    setupModalHandlers();
    closeModal();
});

function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', async e => 
  {
        e.preventDefault();
        const subject = 
        {
            id: document.getElementById('subjectId').value.trim(),
            name: document.getElementById('name').value.trim()
        };
        const subjects = await subjectsAPI.fetchAll();
        const Exist = subjects.some(s => s.name.toLowerCase() === subject.name.toLowerCase() && s.id != subject.id);
        
        if (subject.name === "") {
            document.getElementById('modalTitle').textContent = 'Error en la operación';
            document.getElementById('modalMessage').textContent = "El nombre no puede estar vacío.";
            openModal();
            return;
        }

        if (Exist) {
            document.getElementById('modalTitle').textContent = 'Error en la operación';
            document.getElementById('modalMessage').textContent = "La materia Existe.";
            openModal();
            return;
        }        

        try 
        {
            
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            }
            else
            {
                await subjectsAPI.create(subject);
            }
            
            form.reset();
            document.getElementById('subjectId').value = '';
            loadSubjects();
        }
        catch (err)
        {
            console.error(err.message);
        }
  });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

async function loadSubjects()
{
    try
    {
        const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(subjects);
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
        document.getElementById('modalTitle').textContent = 'Error en la operación';
        document.getElementById('modalMessage').textContent = "La materia Existe.";
        openModal()
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(subject.name));
        tr.appendChild(createSubjectActionsCell(subject));

        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDeleteSubject(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

async function confirmDeleteSubject(id)
{
    if (await confirm("¿Eliminar esta asignatura?")) {
        console.log("Eliminado");
    } else {
        console.log("Cancelado");
        return
    }
    try
    {
        let response = await subjectsAPI.remove(id);

        if (response && response.message){
            document.getElementById('modalTitle').textContent = 'Éxito en la operación';
            document.getElementById('modalMessage').textContent = response.message;
            openModal();
        }

        loadSubjects();
    }
    catch (err)
    {
        console.error('Error:', err.message);
        document.getElementById('modalTitle').textContent = 'Error al eliminar materia';
        document.getElementById('modalMessage').textContent = err.message;
        openModal();
    }
}

function setupModalHandlers() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    const closeBtn = modalOverlay.querySelector('.close-btn');
    
    // Cerrar al hacer clic en el overlay (fuera del modal)
    modalOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'modalOverlay') {
            closeModal();
        }
    });
    

    // Cerrar con el botón X
    closeBtn.addEventListener('click', closeModal);
}

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}
