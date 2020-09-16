var BusinessCard = function(){

    var init = function(){

    }

    var renderCard = function(htmlel, _data){
        htmlel.html(cartUI());
    }

    var cartUI = function(){
       
        var myvar = '<div class="business-card">'+
        '              <div class="row m0">'+
        '                <div class="card-lhs">'+
        '                  <div class="card-image">'+
        '                    <img src="images/card-avatar.svg">'+
        '                    <div class="imageUpload btn btn-primary btn-sm">'+
        '                      Upload Image'+
        '                      <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg">'+
        '                    </div>'+
        '                  </div>'+
        '                  <div class="card-name">'+
        '                    <div class="form-group m0">'+
        '                      <input type="text" class="form-control userName" data-type="edt" placeholder="PALLAV SAMADDAR" disabled="">'+
        '                    </div>'+
        '                    <div class="form-group m0">'+
        '                      <input type="text" class="form-control compnay" data-type="edt" placeholder="The Times Of India" disabled="">'+
        '                    </div>'+
        '                    <div class="form-group m0">'+
        '                      <input type="text" class="form-control designation" data-type="edt" placeholder="Product Lead" disabled="">'+
        '                    </div>'+
        '                  </div>'+
        '                </div>'+
        '                <div class="card-rhs">'+
        '                    <div class="row mb-2"><i class="material-icons">phone</i>'+
        '                      <div class="form-group m0">'+
        '                        <input type="number" class="form-control phoneNo" data-type="edt" placeholder="9999599142" disabled="">'+
        '                      </div>'+
        '                    </div>'+
        '                    <div class="row"><i class="material-icons">email</i>'+
        '                      <div class="form-group m0">'+
        '                        <input type="email" class="form-control emailId" data-type="edt" placeholder="pallav.samaddar@timesinternet.in" disabled="">'+
        '                      </div>'+
        '                    </div>'+
        '                </div>'+
        '              </div>'+
        '            </div>'+
        '            <div class="modal-footer">'+
        '              <button type="button" class="btn btn-secondary btn-sm">Edit <i class="material-icons f16">edit</i></button>'+
        '              <button type="button" class="btn btn-secondary btn-sm">Share <i class="material-icons f16">edit</i></button>'+
        '            </div>';

        return myvar
  

    }

    return {
        init:init,
        renderCard:renderCard
    }

}

