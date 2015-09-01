const PREFERENCES_ROOT = "org.alfresco.share.dashlet";

function widgets()
{
	
	 var result, preferences = {};
	   
	   // Request the current user's preferences
	   var result = remote.call("/api/people/" + stringUtils.urlEncode(user.name) + "/preferences?pf=" + PREFERENCES_ROOT);
	   if (result.status == 200 && result != "{}")
	   {
	      var prefs = eval('(' + result + ')');
	      try
	      {
	         // Populate the preferences object literal for easy look-up later
	         preferences = eval('(prefs.' + PREFERENCES_ROOT + ')');
	         if (typeof preferences != "object")
	         {
	            preferences = {};
	         }
	      }
	      catch (e)
	      {
	      }
	   }

	   model.preferences = preferences;
	   
	   
   // Widget instantiation metdata...
	   
  var dashletResizer = {
		  id: "DashletResizer",
	      name: "Alfresco.widget.DashletResizer",
	      initArgs: ["\"" + args.htmlid + "\"", "\"" + instance.object.id + "\""],
	      useMessages: false
	   };
	   
   var dashletTitleBarActions = {
      id : "DashletTitleBarActions", 
      name : "Alfresco.widget.DashletTitleBarActions",
      useMessages : false,
      options : {
         actions: [
            {
               cssClass: "help",
               bubbleOnClick:
               {
                  message: msg.get("dashlet.help")
               },
               tooltip: msg.get("dashlet.help.tooltip")
            }
         ]
      }
   };
   
   var d3j = {
		   id:"d3j",
		   name:"Venzia.component.D3j",
		   options:{
			   siteId: page.url.templateArgs.site,
			   activeFilter: (preferences.siteTagsFilter!=null?preferences.siteTagsFilter:"all")
		   }
   }
   
   model.widgets = [dashletTitleBarActions,dashletResizer,d3j];
}

widgets();
