$(document).ready(()=>{
	$("#createSchedule-button").on("click",()=>{
		sendPOSTRender("select");
	})
});



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