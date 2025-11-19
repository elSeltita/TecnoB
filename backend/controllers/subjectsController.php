<?php
/**
*    File        : backend/controllers/subjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./repositories/subjects.php");
require_once("./repositories/studentsSubjects.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) 
    {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } 
    else 
    {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}


function handlePost($conn){

    $input = json_decode(file_get_contents("php://input"),true);

    $name = trim($input['name']); //El trim lo uso para eliminar los datos al principio al final
    $exist = VerifyName($conn,$name);


    if ($name == ""){
        http_response_code(400);
        echo json_encode(["error" => "No se puede poner nombres vacios"]);
        return;
    }

    else if ($exist > 0) {
        http_response_code(400);
        echo json_encode(["error" => "No se puede agregar la materia, el nombre no esta disponible"]);
        return;
    }
    
    else {
            $result = createSubject($conn, $input['name']);
            if ($result['inserted'] > 0) 
                {echo json_encode(["message" => "Materia creada correctamente"]); }                
                else 
                {
                    http_response_code(500);
                    echo json_encode(["error" => "No se pudo crear"]);                    
                }
    }
}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    $name = trim($input['name']);


    if ($name == ""){
        http_response_code(400);
        echo json_encode(["error" => "Nombre en blanco"]);
        return;
    }

    $exist = VerifyName($conn,$name,$input['id']);

    if ($exist > 0) {
        http_response_code(400);
        echo json_encode(["error" => "Nombre en uso"]);
        return;
    }

    $result = updateSubject($conn, $input['id'], $input['name']);

    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Materia actualizada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}


function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'];
    $linked = linkedSubjectToStudent($conn, $id);
    if ($linked['linked'] == 0){
        $result = deleteSubject($conn, $input['id']);

        if ($result['deleted'] > 0) 
        {
            http_response_code(200);
            echo json_encode(["message" => "Materia eliminada correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar"]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar, hay alumnos anotados en la materia"]);
    }
}
?>