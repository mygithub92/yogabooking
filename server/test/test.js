(function(){
	var courses = [{"course_date":"2017-05-20","id":3107,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-20","id":3108,"start_time":"16:00:00","end_time":"18:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-25","id":3109,"start_time":"10:30:00","end_time":"12:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-25","id":3110,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-27","id":3111,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-23","id":3112,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-23","id":3113,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-27","id":3114,"start_time":"16:00:00","end_time":"18:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-30","id":3115,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-05-30","id":3116,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-01","id":3117,"start_time":"10:30:00","end_time":"12:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-01","id":3118,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-03","id":3119,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-03","id":3120,"start_time":"16:00:00","end_time":"18:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-06","id":3121,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-06","id":3122,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-08","id":3123,"start_time":"10:30:00","end_time":"12:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-08","id":3124,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-10","id":3125,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-10","id":3126,"start_time":"16:00:00","end_time":"18:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-13","id":3127,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-13","id":3128,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-15","id":3129,"start_time":"10:30:00","end_time":"12:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-15","id":3130,"start_time":"19:00:00","end_time":"21:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-17","id":3131,"start_time":"14:00:00","end_time":"16:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1},{"course_date":"2017-06-17","id":3132,"start_time":"16:00:00","end_time":"18:00:00","spot_number":9,"createdAt":"2017-05-19T12:01:47.000Z","updatedAt":"2017-05-19T12:01:47.000Z","coachId":1,"addressId":1}]
	
	var myArray = [
		{group: "one", color: "red"},
		{group: "two", color: "blue"},
		{group: "one", color: "green"},
		{group: "one", color: "black"}
	];

	var group_to_values = courses.reduce(function(obj,item){
		obj[item.course_date] = obj[item.course_date] || [];
		obj[item.course_date].push(item);
		return obj;
	}, {});

	var groups = Object.keys(group_to_values).map(function(key){
		var result  =moment(key).day();
		return {course_date: result, periods: group_to_values[key]};
	});

	console.log(groups);
})()