$(document).ready(()=>{
	/* Renders select page dynamically when button with id "createSchedule" is clicked */
	$("#createSchedule-button").on("click",()=>{
		sendPOSTRender("select");
	})
});


/* Renders new page content dynamically into "#inner cover" through post request */
function sendPOSTRender(page){
	$.ajax({
		type: "POST",
		data: {page : page},
		success:(res)=>{
			$("#inner cover").html(res);
		},
		error:(res)=>{
			$("#inner cover").html(res);
		}
	})
}