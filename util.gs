// Unix時間を取得する
function getUnixTime(dateTime) {
	var date = new Date(dateTime);
	var millisec = date.getTime();
	var sec = millisec / 1000;
	var time = sec.toString();
	return time;
}

// 本日の日付をY/M/Dの形式で返却する
function getToday() {
	var d = new Date();
	var y = d.getFullYear();
	var mon = d.getMonth() + 1;
	var d2 = d.getDate();
	var today = y + '/' + mon + '/' + d2;
	return today;
}

// 指定された日が営業日か判定する
function isWorkday(today) {
	// 本日の曜日を取得し土日であれば休日(false)
	const week = today.getDay();
	if (week === 0 || week === 6) return false;

	// 祝日カレンダーを確認する
	const calJpHolidayUrl = 'ja.japanese#holiday@group.v.calendar.google.com';
	const calJpHoliday = CalendarApp.getCalendarById(calJpHolidayUrl);

	// 祝日カレンダーに本日の日付があれば祝祭日(false)
	if (calJpHoliday.getEventsForDay(today).length !== 0) return false;

	// 全て当てはまらなければ営業日(true)
	return true;
}
