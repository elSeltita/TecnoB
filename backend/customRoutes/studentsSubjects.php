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

require_once("../config/databaseConfig.php");
require_once("../routes/routesFactory.php");
require_once("../repositories/studentsSubjects.php");
//Elijo hacer las verificaciones acá porque me parece más consistente y fácil de debuggear
//sino, solo funciona haciendo una verificación en el controller y otra en el repositorio, lo cual es confuso 
//para quien lea el código

routeRequest($conn, [
    'GET' => function($conn) 
    {
        $subjectID = $_GET['subject_id'] ?? null;//se usa esto porque php://input saca del body de la solicitud pero los datos están en la URL
        if (!$subjectID) 
        {
            http_response_code(400);
            echo json_encode(["error" => "Falta el ID de la materia"]);
            return;
        }
        $subjects = getStudentsBySubject($conn, $subjectID);
        if (count($subjects) == 0) 
        {
            http_response_code(400);
            echo json_encode(["error" => "La materia no tiene estudiantes"]);
        }
        echo json_encode($subjects);
    }
]);