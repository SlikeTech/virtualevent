var BusinessCard = function(){
    var edit_, data_, dis, ol;
    var init = function(){

    }

    var renderCard = function(htmlel, _d, _e){
        edit_ = _e;
        dis = "disabled"
        data_ = _d;
        ol = {}


       
        
        if(edit_){
            var user = EventStore.getUserProfile();
            ol.name = user.firstname + " " + user.lastname
            ol.email = user.email
            ol.phone = user.phone
            ol.jobtitle = user.jobtitle
            ol.companyname = user.companyname
        }else{
            ol.name = data_.name
            ol.email = data_.email
            ol.phone = data_.phone
            ol.jobtitle = data_.jobtitle
            ol.companyname = data_.companyname
        }


        htmlel.html(cartUI());

         if(edit_){ 
            $("#modalinsidebody button").off("click").on("click", function(){
                var i = this.id;
                if(i == "edit"){
                    if($("#modalinsidebody [data-type=edt]:disabled").length){
                        $("#modalinsidebody [data-type=edt]").prop("disabled", "")
                    }else{
                        $("#modalinsidebody [data-type=edt]").prop("disabled", true);
                    }
                }else{
                    var n = $("#modalinsidebody [name=name]");
                    var e = $("#modalinsidebody [name=email]");
                    var c = $("#modalinsidebody [name=company]");
                    var j = $("#modalinsidebody [name=job]")
                    var p = $("#modalinsidebody [name=phone]")
                    var o = {};

                    o.name = n.val() === "" ? n.attr("placeholder") : n.val();
                    o.mail = e.val() === "" ? e.attr("placeholder") : e.val();
                    o.company = c.val() === "" ? c.attr("placeholder") : c.val();
                    o.job = j.val() === "" ? j.attr("placeholder") : j.val();
                    o.phone = p.val() === "" ? p.attr("placeholder") : p.val();

                    //POST DATA
                    //"f5i9uoz999"
                    var fd = new FormData();
                    fd.append("resourceid", data_.uuid) 
                    Utility.loader({url: "businesscard/share.json", data : fd, type :"POST", cb:function(_d){
                        console.log("done")
                        //debugger
                    }});
                    $("#modalinsideclose").click();
                }

            })
        }
    }

    var cartUI = function(){
        var str = '<div class="business-card">'
        str += '<div class="row m0">'
        str += '<div class="card-lhs">'
        str += '<div class="card-image">'
        //data_.image !== "" ? str += '<img src="'+data_.image+'">' : 
        str += '<img src="images/card-avatar.svg">'
        edit_ ? str += '<div class="imageUpload btn btn-primary btn-sm"><i class="material-icons f16">edit</i><input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"></div>' : ""
        
        str += '</div>'
        str += '<div class="card-name">'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control userName" data-type="edt" name="name" placeholder="'+ol.name+'" '+dis+'>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control compnay" data-type="edt" name="company" placeholder="'+ol.companyname+'"  '+dis+'>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control designation" data-type="edt" name="job" placeholder="'+ol.jobtitle+'" '+dis+'>'
        str += '</div>'
        str += '</div>'
        str += '</div>'


        str += '<div class="card-rhs">'
        str += '<div class="row mb-2"><i class="material-icons">phone</i>'
        str += '<div class="form-group m0">'
        str += '<input type="tel" class="form-control phoneNo" data-type="edt" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3} placeholder="'+ol.phone+'" '+dis+'>'
        str += '</div>'
        str += '</div>'
        str += '<div class="row"><i class="material-icons">email</i>'
        str += '<div class="form-group m0">'
        str += '<input type="email" class="form-control emailId" name="email" placeholder="'+ol.email+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'

        if(edit_){
            str += '<div class="modal-footer">'
            str += '<button type="button" id="edit" class="btn btn-secondary btn-sm">Edit <i class="material-icons f16">edit</i></button>'
            str += '<button type="button" id="shard" class="btn btn-secondary btn-sm">Share <i class="material-icons f16">edit</i></button>'
            str += '</div>';
        }
        return str
        
        

        
       
        /*var myvar = '<div class="business-card">'+
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
        '            </div>';*/

        return myvar
  

    }

    return {
        init:init,
        renderCard:renderCard
    }

}

