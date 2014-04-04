// Redners the javascript from the script section with id=script_id, starting from
// the start_tag (default is // [MainScriptStarts]), and ends at end tag (default
// is // [MainScriptEnds]); the script will be rendered to the divs section with
// the specified div_id, after which, SyntaxHighler will be invoked to highlight
// the code.
var RenderCodeSection = function(script_id, div_id, start_tag, end_tag) {
	var script_start_tag = '// [MainScriptStarts]';
	var script_end_tag = '// [MainScriptEnds]';
	if (start_tag !== undefined) {
		script_start_tag = start_tag;
	}
	if (end_tag !== undefined) {
		script_end_tag = end_tag;
	}
	var script_content = $('#'+script_id).text();
	var script_begin = script_content.indexOf(script_start_tag) + script_start_tag.length;
	var script_end = script_content.indexOf(script_end_tag);
	var script_val = script_content.substr(script_begin, script_end - script_begin);
	
	$('#'+div_id).append('<pre class="brush: js">' + script_val + '</pre>');
	SyntaxHighlighter.all();
}

var kHighChart2Colors = [
   '#4572A7', 
   '#AA4643', 
   '#89A54E', 
   '#80699B', 
   '#3D96AE', 
   '#DB843D', 
   '#92A8CD', 
   '#A47D7C', 
   '#B5CA92',
];