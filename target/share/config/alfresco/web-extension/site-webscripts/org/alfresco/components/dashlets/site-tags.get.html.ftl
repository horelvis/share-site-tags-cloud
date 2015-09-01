<@markup id="css" >
   <#-- CSS Dependencies -->
</@>

<@markup id="js">
   
	<@script src="d3j/main.js" group="d3j"/>
</@>

<@markup id="widgets">
   <@createWidgets group="d3j"/>
</@>

<@markup id="post">
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign el=args.htmlid?html>
       <div class="dashlet siteTags">
         <div class="title">${msg("header")}</div>
          <div class="refresh"><a id="${args.htmlid}-refresh" href="#">&nbsp;</a></div>
		   <div class="toolbar flat-button">
		      <input id="${args.htmlid}-all" type="checkbox" name="all" value="${msg("filter.all")}" checked="checked" />
		      <input id="${args.htmlid}-filter" type="button" name="filter" value="${msg("filter.documentLibrary")}" />
		      <select id="${args.htmlid}-filter-menu">
		         <option value="wiki">${msg("filter.wiki")}</option>
		         <option value="blog">${msg("filter.blog")}</option>                
		         <option value="documentLibrary">${msg("filter.documentLibrary")}</option>
		         <option value="calendar">${msg("filter.calendar")}</option>
		         <option value="links">${msg("filter.links")}</option>
		         <option value="discussions">${msg("filter.discussions")}</option>                
		      </select>
		   </div>
         <div class="body scrollableList" <#if args.height??>style="height: ${args.height?html}px;"</#if>>
            <div class="renderD3j"></div>
         </div>
      </div>
   </@>
</@>
