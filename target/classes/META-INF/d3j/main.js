
/**
 * Venzia root namespace.
 *
 * @namespace Venzia
 */
// Ensure Venzia root object exists
if (typeof Venzia == "undefined" || !Venzia)
{
   var Venzia = {};
}

/**
 * Venzia top-level component namespace.
 *
 * @namespace Alfresco
 * @class Venzia.component
 */
Venzia.component = Venzia.component || {};


/**
 * D3j component.
 *
 * @namespace Alfresco
 * @class Venzia.component.d3j
 */
(function()
{
	

	var wordcloud, size = [600, 300];
	var fillColor = d3.scale.category20c();
	var fontSize = d3.scale.log().range([15, 100]);
	
	 /**
	    * YUI Library aliases
	    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event;

	   
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
   		$combine = Alfresco.util.combinePaths;
   
   /**
    * Preferences
    */
   var PREFERENCES_DASHLET = "org.alfresco.share.dashlet",
      PREF_SITE_TAGS_FILTER = PREFERENCES_DASHLET + ".siteTagsFilter";

   /**
    * D3j constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Venzia.component.D3j} The new GoogleMap instance
    * @constructor
    */
   Venzia.component.D3j = function(htmlId)
   {
      return Venzia.component.D3j.superclass.constructor.call(this, "Venzia.component.D3j", htmlId);
   };

   YAHOO.extend(Venzia.component.D3j, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
    	 
      },
      /**
       * Tags DOM container.
       * 
       * @property tagsContainer
       * @type object
       */
      tagsContainer: null,

      /**
       * ContainerId for tag scope query
       *
       * @property containerId
       * @type string
       * @default ""
       */
      
      containerId: null,
      
      /**
       * Fired by YUI when parent element is available for scripting.
       * Initial History Manager event registration
       *
       * @method onReady
       */
      onReady: function D3j_onReady()
      {
    	  var me = this;
      
	      // The tags container
	      this.tagsContainer = Dom.get(".renderD3j");
      
      	 // Hook the refresh icon click
          Event.addListener(this.id + "-refresh", "click", this.onRefresh, this, true);

          // Preferences service
          this.services.preferences = new Alfresco.service.Preferences();

          // "All" filter
          this.widgets.all = new YAHOO.widget.Button(this.id + "-all",
          {
             type: "checkbox",
             value: "all",
             checked: true
          });
          this.widgets.all.on("checkedChange", this.onAllCheckedChanged, this.widgets.all, this);

          
    	  // Dropdown filter
          this.widgets.filter = new YAHOO.widget.Button(this.id + "-filter",
          {
             type: "split",
             menu: this.id + "-filter-menu",
             lazyloadmenu: false
          });
          this.widgets.filter.on("click", this.onFilterClicked, this, true);
          
          // Clear the lazyLoad flag and fire init event to get menu rendered into the DOM
          var menu = this.widgets.filter.getMenu();
          menu.subscribe("click", function (p_sType, p_aArgs)
          {
             var menuItem = p_aArgs[1];
             if (menuItem)
             {
                me.widgets.filter.set("label", menuItem.cfg.getProperty("text"));
                me.onFilterChanged.call(me, p_aArgs[1]);
             }
          });
          
          if (this.options.activeFilter == "all")
          {
             this.widgets.filter.value = "documentLibrary";
             this.setActiveFilter("all");
          }
          else
          {
             this.widgets.filter.value = this.options.activeFilter;

             // Loop through and find the menuItem corresponding to the default filter
             var menuItems = menu.getItems(),
                menuItem,
                i, ii;

             for (i = 0, ii = menuItems.length; i < ii; i++)
             {
                menuItem = menuItems[i];
                if (menuItem.value == this.options.activeFilter)
                {
                   menu.clickEvent.fire(
                   {
                      type: "click"
                   }, menuItem);
                   break;
                }
             }
          }

      },
      tagsCloud: function D3j_tagsCloud(words){
    	  
    	  d3.layout.cloud()
	  		.size(size)
	  		.words(words)
	  		.font("Impact")
	  		.fontSize(function(d) { return fontSize(+d.size); })
	  		.rotate(function() { return ~~(Math.random() * 5) * 30 - 60; })
	  		.on("end", this.draw)
	  		.start();
    	  
      },
      draw:	function D3j_draw(words){

    		
    		wordcloud = d3.select(".renderD3j")
    			.append("svg")
    			.attr("width", size[0])
    			.attr("height", size[1])
    			.append("g")
    			.attr("transform", "translate(" + (size[0]/2) + "," + (size[1]/2) + ")");
    		
    		wordcloud.selectAll("text")
    			.data(words)
    			.enter().append("text")
    			.style("font-size", function(d) { return d.size + "px"; })
    			.style("fill", function(d) { return fillColor(d.text.toLowerCase()); })
    			.attr("text-anchor", "middle")
    			.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
    			.text(function(d) { return d.text; });
      },
      /**
       * Event handler for refresh click
       * @method onRefresh
       * @param e {object} Event
       */
      onRefresh: function SiteTags_onRefresh(e)
      {
         if (e)
         {
            // Stop browser's default click behaviour for the link
            Event.preventDefault(e);
         }
         this.refreshTags();
      },
      
      /**
       * Refresh tags
       * @method refreshTags
       */
      refreshTags: function SiteTags_refreshTags()
      {
         // Hide the existing content
         Dom.setStyle(this.tagsContainer, "display", "none");
         
         // Make an AJAX request to the Tag Service REST API
         Alfresco.util.Ajax.jsonGet(
         {
            url: Alfresco.constants.PROXY_URI + "api/tagscopes/site/" + $combine(this.options.siteId, this.containerId, "tags"),
            successCallback:
            {
               fn: this.onTagsSuccess,
               scope: this
            },
            failureCallback:
            {
               fn: this.onTagsFailed,
               scope: this
            },
            scope: this,
            noReloadOnAuthFailure: true
         });
      },

      /**
       * Tags retrieved successfully
       * @method onTagsSuccess
       * @param p_response {object} Response object from request
       */
      onTagsSuccess: function SiteTags_onTagsSuccess(p_response)
      {
          // Retrieve the tags list from the JSON response and trim accordingly
          var tags = p_response.json.tags.slice(0, this.options.maxItems),
             numTags = tags.length,
             html = "",
             i, ii,
             words = [];

         // Tags to show?
         if (tags.length === 0)
         {
            html = '<div class="msg">' + this.msg("message.no-tags") + '</div>';
         }
         else
         {
             // Generate HTML mark-up for each tag
            for (i = 0, ii = tags.length; i < ii; i++)
            {
               tag = tags[i];
               words.push({text:tag.name,size:tag.count,url:this.getUriTemplate(tag)});
            }
            this.tagsCloud(words);
         }
         this.tagsContainer.innerHTML = html;
         
         // Fade the new content in
         Alfresco.util.Anim.fadeIn(this.tagsContainer);
      },

      /**
       * Tags request failed
       * @method onTagsFailed
       */
      onTagsFailed: function SiteTags_onTagsFailed()
      {
         this.tagsContainer.innerHTML = this.msg("refresh-failed");
         Alfresco.util.Anim.fadeIn(this.tagsContainer);
      },
      
      /**
       * Generate Uri template based on current active filter
       * @method getUriTemplate
       * @param tag {object} Tag object literal
       */
      getUriTemplate: function SiteTags_getUriTemplate(tag)
      {
         var uri = Alfresco.constants.URL_CONTEXT + 'page/site/' + this.options.siteId;
         switch (this.options.activeFilter)
         {
            case "wiki":
               uri += '/wiki';
               break;

            case "blog":
               uri += '/blog-postlist';
               break;

            case "documentLibrary":
               uri += '/documentlibrary#filter=tag|' + encodeURIComponent(tag.name);
               break;

            case "calendar":
               uri += '/calendar';
               break;

            case "links":
               uri += '/links';
               break;

            case "discussions":
               uri += '/discussions-topiclist';
               break;
            
            default:
               uri += '/search?tag=' + encodeURIComponent('"' + tag.name + '"') + '&amp;a=false';
         }
         return uri;
      },

      /**
       * Sets the active filter highlight in the UI
       * @method updateFilterUI
       */
      updateFilterUI: function SiteTags_updateFilterUI()
      {
         switch (this.options.activeFilter)
         {
            case "all":
               Dom.removeClass(this.widgets.filter.get("element"), "yui-checkbox-button-checked");
               break;

            default:
               this.widgets.all.set("checked", false, true);
               Dom.addClass(this.widgets.filter.get("element"), "yui-checkbox-button-checked");
               break;
         }
      },

      /**
       * Saves active filter to user preferences
       * @method saveActiveFilter
       * @param filter {string} New filter to set
       * @param noPersist {boolean} [Optional] If set, preferences are not updated
       */
      setActiveFilter: function SiteTags_saveActiveFilter(filter, noPersist)
      {
         this.options.activeFilter = filter;
         this.containerId = filter !== "all" ? filter : "";
         this.updateFilterUI();
         this.refreshTags();
         if (noPersist !== true)
         {
            this.services.preferences.set(PREF_SITE_TAGS_FILTER, filter);
         }
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */

      /**
       * All tasks
       * @method onAllCheckedChanged
       * @param p_oEvent {object} Button event
       * @param p_obj {object} Button
       */
      onAllCheckedChanged: function Sitetags_onAllCheckedChanged(p_oEvent, p_obj)
      {
         this.setActiveFilter("all");
         p_obj.set("checked", true, true);
      },

      /**
       * Filter button clicked event handler
       * @method onFilterClicked
       * @param p_oEvent {object} Dom event
       */
      onFilterClicked: function SiteTags_onFilterClicked(p_oEvent)
      {
         this.setActiveFilter(this.widgets.filter.value);
      },
      
      /**
       * Filter drop-down changed event handler
       * @method onFilterChanged
       * @param p_oMenuItem {object} Selected menu item
       */
      onFilterChanged: function SiteTags_onFilterChanged(p_oMenuItem)
      {
         var filter = p_oMenuItem.value;
         this.widgets.filter.value = filter;
         this.setActiveFilter(filter);
      }
   });
})();