/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 2.0 ( prototype )
*/

import { studentsAPI } from '../apiConsumers/studentsAPI.js';

//2.0
//For pagination:
let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
    setupPaginationControls();//2.0
    setupModalHandlers();
    closeModal();
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const student = getFormData();
    
        try 
        {
            let response;
            if (student.id) 
            {
                response = await studentsAPI.update(student);
            } 
            else 
            {
                response = await studentsAPI.create(student);
            }
            
            // Mostrar mensaje de éxito si PHP lo devuelve
            if (response && response.message) 
            {
                document.getElementById('modalTitle').textContent = 'Éxito en la operación';
                document.getElementById('modalMessage').textContent = response.message;
                openModal();
            }
            
            clearForm();
            loadStudents();
        }
        catch (err)
        {
            console.error('Error:', err.message);
            document.getElementById('modalTitle').textContent = 'Error en la operación';
            document.getElementById('modalMessage').textContent = err.message;
            openModal();
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}

//2.0
function setupPaginationControls() 
{
    document.getElementById('prevPage').addEventListener('click', () => 
    {
        if (currentPage > 1) 
        {
            currentPage--;
            loadStudents();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => 
    {
        if (currentPage < totalPages) 
        {
            currentPage++;
            loadStudents();
        }
    });

    document.getElementById('resultsPerPage').addEventListener('change', e => 
    {
        currentPage = 1;
        loadStudents();
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

//2.0
async function loadStudents()
{
    try 
    {
        const resPerPage = parseInt(document.getElementById('resultsPerPage').value, 10) || limit;
        const data = await studentsAPI.fetchPaginated(currentPage, resPerPage);
        console.log(data);
        renderStudentTable(data.students);
        totalPages = Math.ceil(data.total / resPerPage);
        document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
        document.getElementById('modalTitle').textContent = 'Error al cargar datos';
        document.getElementById('modalMessage').textContent = err.message;
        openModal();
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren();
  
    students.forEach(student => 
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;

    try
    {
        const response = await studentsAPI.remove(id, true);

        if (response.error) {
            document.getElementById('modalTitle').textContent = 'Error en la operación';
            document.getElementById('modalMessage').textContent = response.error;
            openModal();
            return;
        }

        document.getElementById('modalTitle').textContent = 'Éxito en la operación';
        document.getElementById('modalMessage').textContent = 'El estudiante se ha borrado correctamente';
        openModal();

        loadStudents();
    }
    catch (error)
    {
        document.getElementById('modalTitle').textContent = 'Error inesperado';
        document.getElementById('modalMessage').textContent = error.message;
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
  