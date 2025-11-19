<?php
/**
*    File        : backend/routes/subjectsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/subjectsController.php");

routeRequest($conn, [
    'DELETE' => function($conn) 
    {    
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'];
        $linked = linkedSubjectToStudent($conn, $id);
        if ($linked['linked'] == 0){
            handleDelete($conn);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar, hay alumnos anotados en la materia"]);
        }
    }
]);