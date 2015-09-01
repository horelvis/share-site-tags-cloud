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
      <div class="dashlet" id="${el}-site-tags-dashlet">
         <div class="title">${msg("header")}</div>
         <div class="body scrollableList" <#if args.height??>style="height: ${args.height?html}px;"</#if>>

            <div id="${el}-message" class="my-docs-editing-message hidden"></div>
            <div id="${el}-my-docs" class="my-docs-editing">
               <@markup id="documents">
               <div class="hdr">
                  <h3>${msg('text.documents')}</h3>
               </div>
               <div id="${el}-documents" class="hidden"></div>
               <div id="${el}-documents-wait" class="my-docs-editing-wait"></div>
               </@markup>
               <@markup id="content">
               <div class="hdr">
                  <h3>${msg('text.blogposts')}</h3>
               </div>
               <div id="${el}-blogposts" class="hidden"></div>
               <div class="hdr">
                  <h3>${msg('text.wikipages')}</h3>
               </div>
               <div id="${el}-wikipages" class="hidden"></div>
               <div class="hdr">
                  <h3>${msg('text.forumposts')}</h3>
               </div>
               <div id="${el}-forumposts" class="hidden"></div>
               <div id="${el}-content-wait" class="my-docs-editing-wait"></div>
               </@markup>
            </div>

         </div>
      </div>
      <div class="hidden">
			<div class="renderD3j" ></div>
      </div>
   </@>
</@>
