(function(){var d=YAHOO.util.Dom,c=YAHOO.util.Selector;var b=Alfresco.util.encodeHTML;Alfresco.component.TaskDetailsHeader=function e(f){Alfresco.component.TaskDetailsHeader.superclass.constructor.call(this,"Alfresco.component.TaskDetailsHeader",f,["button"]);YAHOO.Bubbling.on("taskDetailedData",this.onTaskDetailsData,this);return this};YAHOO.extend(Alfresco.component.TaskDetailsHeader,Alfresco.component.Base,{options:{referrer:null,nodeRef:null},onTaskDetailsData:function a(l,n){var f=n[1],m=f.id,p=f.properties.bpm_description,k=f.workflowInstance.id,h="workflow-details?workflowId="+k+"&taskId="+m;if(this.options.referrer){h+="&referrer="+encodeURIComponent(this.options.referrer)}else{if(this.options.nodeRef){h+="&nodeRef="+encodeURIComponent(this.options.nodeRef)}}if(p&&p!=f.title){p=this.msg("label.message",b(p),b(f.title))}else{p=this.msg("label.noMessage",b(f.title))}c.query(".links a",this.id,true).setAttribute("href",Alfresco.util.siteURL(h));d.removeClass(c.query(".links",this.id,true),"hidden");c.query("h1 span",this.id,true).innerHTML=p;var o=document.querySelectorAll('[data-datatype^="date"]');for(var j=0;j<o.length;j++){var g="date-format.default";if(o[j].getAttribute("data-datatype")==="date"){g="date-format.mediumDate"}o[j].innerHTML=Alfresco.util.formatDate(o[j].innerHTML,Alfresco.util.message(g))}}})})();