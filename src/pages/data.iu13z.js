
export function saveButton_click(event) {
    $w('#txtcompletado').show()
    $w('#image21').show()
		$w('#txtcompletado').text ="Espere un momento su información esta siendo procesada"
    
    $w('#txterror').hide()
    $w('#dataset1').save()
    .then( (item) => {
        	$w('#txtcompletado').text ="Su información se guardo con exito"
          $w('#image21').hide()
      } )
      .catch( (err) => {
        let errMsg = err;
        $w('#txterror').text = "A ocurrido un error intente de nuevo"
        $w('#txtcompletado').hide()
        $w('#image21').hide()
      } );

  
}