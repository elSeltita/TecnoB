<?php
/**
*    File        : backend/routes/studentsSubjectsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/studentsSubjectsController.php");

//Elijo hacer las verificaciones acá porque me parece más consistente y fácil de debuggear
//sino, solo funciona haciendo una verificación en el controller y otra en el repositorio, lo cual es confuso 
//para quien lea el código

routeRequest($conn, [
    'POST' => function($conn) 
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $studentID = $input['student_id'];
        $subjectID = $input['subject_id'];
        $assigned = isAlreadyAssigned($conn, $studentID, $subjectID);
        if ($assigned['assigned'] > 0) 
        {
            http_response_code(400);
            echo json_encode(["error" => "La asignación entre estudiante y materia ya fué hecha previamente"]);
            return;
        }
        handlePost($conn);
    }
]);
routeRequest($conn, [
    'PUT' => function($conn) 
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $approved = assignmentState($conn, $input['id']);
        if ($approved == $input['approved']) 
        {
            http_response_code(400);
            echo json_encode(["error" => "No realizó cambios en la asignación"]);
            return;
        }
        handlePut($conn);
    }
]);