<?php
/**
*    File        : backend/routes/studentsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/
require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/studentsController.php");

routeRequest($conn, [
    'POST' => function($conn) 
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'];
        $exist = getEmailByStudent($conn, $email);
        if ($exist['exist'] > 0) 
        {
            http_response_code(400);
            echo json_encode(["error" => "No se puede crear el estudiante porque el email ya esta registrado"]);
            return;
        }
        handlePost($conn);
    },
    'DELETE' => function($conn) 
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'];
        $subjects = getSubjectsByStudent($conn, $id);
    
        if (count($subjects) > 0) 
        {
            http_response_code(400);
            echo json_encode(["error" => "No se puede eliminar el estudiante porque esta inscripto en asignaturas"]);
            return;
        }
        handleDelete($conn);
    }
]);