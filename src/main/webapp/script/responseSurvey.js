$.fn.bindReportClick = function(){
	this.click(function(){
		if($('.sTop > ul > li:nth-child(4)').css("display")=="none"){
			$('.sTop > ul > li:nth-child(4)').css("display","block");
		}
		else{
			$('.sTop > ul > li:nth-child(4)').css("display","none");
		}
	})
};

$.submitReport = function(){
	
	if($('#reportText').val().trim() == ''){
		alert('신고 사유는 필수 입력 사항입니다.');
		return;
	}
	$.ajax({
		url:'../ReportInsert.do',
		type:'post',
		data:JSON.stringify({
			cause: $('#reportText').val(),
			reporter : $('.questionList').data('respondent'),
			s_code : $('.questionList').data('s_code')
		}),
		contentType: 'application/json',
		success:function(data){
			alert(data.message);
			if(data.result){
				location.href = "index.jsp";
			}
		}
	})
}

$.fn.bindSubmitReport = function(){
	$(this).one('click', function(){
		let reporter = $('.questionList').data('respondent');
		let s_code = $('.questionList').data('s_code');
		$.ajax({
			url:'../ReportCheck.do?s_code=' + s_code + '&reporter=' + reporter,
			type:'GET',
			success:function(data){
				if(data.result){
					$.submitReport();
				}
				else{
					alert(data.message);
				}
			}
		})
	})
}

$.addInterest = function(){
	$.ajax({
		url:'../InterestInsert.do',
		type:'post',
		data:JSON.stringify({
			email: $('.questionList').data('respondent'),
			s_code : $('.questionList').data('s_code')
		}),
		contentType: 'application/json',
		success:function(data){
			alert(data.message);
		}
	})
}

$.fn.bindAddInterest = function(){
	$(this).one('click', function(){
		let email = $('.questionList').data('respondent');
		let s_code = $('.questionList').data('s_code');
		$.ajax({
			url:'../InterestCheck.do?email=' + email + '&s_code=' + s_code,
			type:'GET',
			success:function(data){
				if(data.result){
					$.addInterest();
				}
				else{
					alert(data.message);
				}
			}
		})
	})
}

function showResponseSurvey(s_code) {
	$.ajax({
		url: '../GetSurvey.do?s_code=' + s_code,
		type: 'GET',
		success: function(data) {
			if (!data.result) {
				alert(data.message);
				return;
			}

			let s_code = data.s_code;
		
			let li1 = $('<li>').text('작성자: '+data.email);
			let li2 = $('<li>').text('카테고리: '+ data.c_desc);
			let li3 = $('<li>').text('제목: '+data.s_title);
		
			$('#btnReport').closest('li').before(li1);
			$('#btnReport').closest('li').after(li2);
			$('#btnSubmitReport').closest('li').after(li3);
			
			showResponseQuestion(s_code);
		}
	});
}

function showResponseQuestion(s_code) {
	$.ajax({
		url: '../GetQuestion.do?s_code=' + s_code,
		type: 'GET',
		success: function(data) {
			if (!data.result) {
				alert(data.message);
				return;
			}
			for (let i = 0; i < data.questions.length; i++) {
				
				let q = data.questions[i];
				let s_code = q.s_code;
				let q_number = q.q_number;
				let q_title = q.q_title;
				let q_type = q.q_type;
				
				let li = $('<li>').text('질문' + q_number + '] ' + q_title);
				
				if (q_type == 'C') {
					let ul = $('<ul data-qType="C"></ul>');
					ul.data("q_number", q_number);
					ul.attr('id', 'choiceQ');
					ul.append(li);
					ul.appendTo($('.questionList'));
					showResponseChoice(s_code, q_number);
				}
				else {
					let ul = $('<ul data-qType="S"></ul>');
					ul.data("q_number", q_number);
					ul.attr('id', 'subjectiveQ');
					let li2 = $('<li>');
					let textarea = $('<textarea>');
					textarea.attr('id', 'sTypeRe');
					li2.append(textarea);
					ul.append(li);
					ul.append(li2);
					ul.appendTo($('.questionList'));
				}
			}
		}
	});
}

function showResponseChoice(s_code, q_number) {
	$.ajax({
		url: '../GetChoice.do?s_code=' + s_code + '&q_number=' + q_number,
		type: 'GET',
		success: function(data) {
			if (!data.result) {
				alert(data.message);
				return;
			}
			let ul = $('.questionList > ul:nth-child(' + q_number + ')');
			for (let i = 0; i < data.choiceList.length; i++) {
				let q = data.choiceList[i];
				let li = $('<li>');
				let label = $('<label><input type="radio" data-num="'+q.choice_num+'" name="choice'+q_number+'"> ' + q.choice_content + '</label>');
				li.append(label);
				ul.append(li);
			}
		}
	});
}

$.sendChoiceResult = function(){
	var choices = [];
	var q_numbers = [];
	let qList = $('.questionList').find('[id=choiceQ]');
	qList.each(function(index, item){
		if($(item).find('input[type=radio]:checked').data('num') != null){
			choices.push($(item).find('input[type=radio]:checked').data('num'));
		}
		q_numbers.push($(item).closest('ul').data('q_number'));
	})
	
	$.ajax({
		url:'../ChoiceResultInsert.do',
		type:'post',
		data:JSON.stringify({
			choices:choices,
			s_code:$('.questionList').data('s_code'),
			respondent : $('.questionList').data('respondent'),
			q_numbers:q_numbers
		}),
		contentType: 'application/json',
		success:function(data){
			if(data.result){
			}
			else{
				alert(data.message);
			}
		}
	})
}

$.sendSubjectiveResult = function(){
	var answers = [];
	var q_numbers = [];
	let qList = $('.questionList').find('[id=subjectiveQ]');
	qList.each(function(index, item){
		if($(item).find('textarea').val().trim() != ''){
			answers.push(($(item).find('textarea').val()));
		}
		q_numbers.push($(item).closest('ul').data('q_number'));
	})
	
	$.ajax({
		url:'../SubjectiveResultInsert.do',
		type:'post',
		data:JSON.stringify({
			answers : answers,
			s_code:$('.questionList').data("s_code"),
			respondent: $('.questionList').data("respondent"),
			q_numbers : q_numbers
		}),
		contentType: 'application/json',
		success:function(data){
			if(data.result){
				
			}
			else{
				alert(data.message);
			}
		}
	})
	
}
$.sendResult = function(){
	
	var answers = [];
	var s_q_numbers = [];
	let s_qList = $('.questionList').find('[id=subjectiveQ]');
	s_qList.each(function(index, item){
		if($(item).find('textarea').val().trim() != ''){
			answers.push(($(item).find('textarea').val()));
		}
		s_q_numbers.push($(item).closest('ul').data('q_number'));
	})
	var choices = [];
	var c_q_numbers = [];
	let c_qList = $('.questionList').find('[id=choiceQ]');
	c_qList.each(function(index, item){
		if($(item).find('input[type=radio]:checked').data('num') != null){
			choices.push($(item).find('input[type=radio]:checked').data('num'));
		}
		c_q_numbers.push($(item).closest('ul').data('q_number'));
	})
	
	if((s_q_numbers.length != answers.length) || (c_q_numbers.length != choices.length)){
		alert('모든 문항에 응답하셔야 제출이 가능합니다.');
		return;
	}
	
	if((s_qList.length != 0) && (c_qList.length != 0)){
		$.sendSubjectiveResult();
		$.sendChoiceResult();
		$.submitToPointHistory();
	}
	else if((s_qList.length == 0) && (c_qList.length != 0)){
		$.sendChoiceResult();
		$.submitToPointHistory();
	}
	else if((s_qList.length != 0) && (c_qList.length == 0)){
		$.sendSubjectiveResult();
		$.submitToPointHistory();
	}
	
	
}

$.submitToPointHistory = function(){
	$.ajax({
		url:'../PointHistoryInsertRespondent.do',
		type:'post',
		data:JSON.stringify({
			s_code : $('.questionList').data('s_code'),
			respondent : $('.questionList').data('respondent')
		}),
		contentType: 'application/json',
		success:function(data){
			if(data.result){
				alert('응답 결과가 제출되었습니다.');
				$.updatePrice();
			}
			else{
				alert(data.message);
			}
		}
	})
}

$.updatePrice = function(){
	let s_code = $('.questionList').data('s_code');
	$.ajax({
		url:'../SurveyPriceUpdate.do?s_code=' + s_code,
		type:'PUT',
		success:function(data){
			if(data.result){
				location.href = 'index.jsp';
			}
			else{
				alert(data.message);
			}
		}
	})
}

$(document).ready(function(){
	$('#btnReport').bindReportClick();
	$('#btnSubmitReport').bindSubmitReport();
	$('#btnInterest').bindAddInterest();
	
	var address = unescape(location.href);
	var loc_s_code = address.indexOf('s_code', 0);
	var loc_respondent = address.indexOf('respondent', 0);
	var s_code = '';
	var respondent = '';

	if (loc_s_code != -1) {
		tmp1 = address.substring(loc_s_code);
	}
	
	if (loc_respondent != -1) {
		tmp2 = address.substring(loc_respondent);
	}

	var arr1 = tmp1.split('&');
	var arr2 = arr1[0].split('=');
	s_code = arr2[1];
	
	var arr3 = tmp2.split('=');
	respondent = arr3[1];
	$('.questionList').data("respondent", respondent);
	$('.questionList').data("s_code", s_code);
	showResponseSurvey(s_code);
	
	$('#surBtnReply').click(function(){
		$.sendResult();
	})
});