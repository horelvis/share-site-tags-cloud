(function(){var g=YAHOO.util.Dom,b=YAHOO.util.Event,f=Alfresco.util.formatDate,e=Alfresco.util.fromISO8601;Alfresco.DocumentMetadata=function d(i){Alfresco.DocumentMetadata.superclass.constructor.call(this,"Alfresco.DocumentMetadata",i);YAHOO.Bubbling.on("metadataRefresh",this.doRefresh,this);return this};YAHOO.extend(Alfresco.DocumentMetadata,Alfresco.component.Base,{options:{nodeRef:null,site:null,formId:null},onReady:function c(){Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/form",dataObj:{htmlid:this.id+"-formContainer",itemKind:"node",itemId:this.options.nodeRef,formId:this.options.formId,mode:"view"},successCallback:{fn:this.onFormLoaded,scope:this},failureMessage:this.msg("message.failure"),scope:this,execScripts:true})},onFormLoaded:function a(i){var j=g.get(this.id+"-formContainer"),k=this;j.innerHTML=i.serverResponse.responseText;g.getElementsByClassName("viewmode-value-date","span",j,function(){var m=g.getAttribute(this,"data-show-time"),p=g.getAttribute(this,"data-date-iso8601"),l=(m=="false")?k.msg("date-format.defaultDateOnly"):k.msg("date-format.default"),n=m=="false",o=e(p,n);this.innerHTML=f(o,l)})},doRefresh:function h(){YAHOO.Bubbling.unsubscribe("metadataRefresh",this.doRefresh,this);this.refresh("components/document-details/document-metadata?nodeRef={nodeRef}"+(this.options.siteId?"&site={siteId}":"")+(this.options.formId?"&formId={formId}":""))}})})();