export default 

class reciboCliente{
    constructor(nombre,telefono, email, totalAPagar, nombreHamburguesas){
    this.nombre = nombre;
    this.telefono = telefono; 
    this.email = email;
    this.hamburguesas = nombreHamburguesas;
    this.importeTotal = totalAPagar;
    this.neto = ((parseInt(this.importeTotal))/1.21).toFixed(2) ;
    this.iva = (parseInt(this.importeTotal)-this.neto).toFixed(2);
}

    obtenerRecibo(){
    const pedido = 
   `
   <div>
    <div class="card text-center id="para-descargar">
      <div class="card-header">
        Confirmación de pedido
      </div>
      <div class="card-body">
        <h5 class="card-title">Mirador Hamburguesería</h5>
          <div class="card-text">
              <ol class="list-group">
                <li class="list-group-item">Cliente: ${this.nombre}</li>
                <li class="list-group-item">Teléfono: ${this.telefono}</li>
                <li class="list-group-item">Hamburguesas seleccionadas: ${this.hamburguesas}</li>
                <li class="list-group-item">Importe Neto: $ ${this.neto}</li>
                <li class="list-group-item">IVA: $ ${this.iva}</li>
                <li class="list-group-item">Total a pagar: $ ${this.importeTotal}</li>
              </ol>
          </div>
        <br>
          <div class="d-grid gap-2 col-6 mx-auto">
              <button id="btnDownload" class="btn btn-primary">Enviar comprobante por email</button>
              <button class="btn btn-warning">Realizar otra compra</button>
          </div>
        </div> 
          <div class="card-footer text-muted">
            Nos estaremos comunicando a la brevedad para confirmar tu pedido!
          </div>
        </div>
    </div>`
    return pedido;
 }   

 
}
