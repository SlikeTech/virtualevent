var BusinessCard = function(){
    var edit_, data_, dis, ol, callback, elt, oRef
    var init = function(){}

    var renderCard = function(htmlel, _d, _e, cb, _ref){
        edit_ = _e;
        dis = "disabled"
        data_ = _d;
        callback = cb;
        ol = {};
        elt = htmlel
        oRef = _ref;
        
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


        htmlel.html(cartUI(ol));
         if(edit_){ 
           bindEvent();
        }
    }

    var bindEvent = function(){
        $("#modalinsidebody button").off("click").on("click", function(){
            var i = this.id;
            if(i == "edit"){
                callback()
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
                      $(oRef).addClass("disableIcon")
                    //debugger
                }});
                $("#modalinsideclose").click();
            }

        })

    }

    var cartUI = function(_o){
        console.log(_o)
        var str = '<div class="business-card">'
        str += '<div class="row m0">'
        str += '<div class="card-lhs">'
        str += '<div class="card-image">'
        //data_.image !== "" ? str += '<img src="'+data_.image+'">' : 
        str += '<img src="images/card-avatar.svg">'
       // edit_ ? str += '<div class="imageUpload btn btn-primary btn-sm"><i class="material-icons f16">edit</i><input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"></div>' : ""
        
        str += '</div>'
        str += '<div class="card-name">'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control userName" data-type="edt" name="name" placeholder="'+_o.name+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control compnay" data-type="edt" name="company" placeholder="'+_o.companyname+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control designation" data-type="edt" name="job" placeholder="'+_o.jobtitle+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'


        str += '<div class="card-rhs">'
        str += '<div class="row mb-2"><i class="material-icons">phone</i>'
        str += '<div class="form-group m0">'
        str += '<input type="tel" class="form-control phoneNo" data-type="edt" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3} placeholder="'+_o.phone+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '<div class="row"><i class="material-icons">email</i>'
        str += '<div class="form-group m0">'
        str += '<input type="email" class="form-control emailId" name="email" placeholder="'+_o.email+'" disabled>'
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
    }

    var updateCard = function(_d){
        elt.html(cartUI(_d));
        //cartUI(_d);
        bindEvent();
       // debugger
    }

    return {
        init:init,
        renderCard:renderCard,
        updateCard:updateCard
    }

}

