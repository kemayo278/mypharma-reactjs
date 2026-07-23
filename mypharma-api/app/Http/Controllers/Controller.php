<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /** 
* @OA \Info( 
* title="Swagger avec Laravel", 
* version="1.0.0", 
* ) 
* @OA \SecurityScheme( 
* type="http", 
* securityScheme="bearerAuth", 
* schéma="porteur", 
* porteurFormat="JWT" 
​​* )
* 
*/
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
