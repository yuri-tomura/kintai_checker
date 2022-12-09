// HTTPリクエスト実行処理
function fetchSlackApi(url, options) {
	try {
		const res = UrlFetchApp.fetch(url, options);
		const jsonObj = JSON.parse(res);
		return jsonObj;
	} catch (e) {
		console.error(error);
	}
}

// スラックからのメッセージを取得する
function getPostedMessage(slackInfo) {
	// 投稿を取得する時間の範囲をタイムスタンプで取得する
	const oldest = getUnixTime(`${getToday()} 05:00:00`); // 朝5時から
	const latest = getUnixTime(`${getToday()} 10:05:00`); // 朝10時5分まで

	// 取得する情報の詳細を設定
	const url = 'https://slack.com/api/conversations.history';
	const options = {
		method: 'get',
		payload: {
			token: slackInfo.token,
			channel: slackInfo.targetChannel,
			oldest: oldest, //この日時から
			latest: latest, //この日時まで
			inclusive: true, //oldestとlatestを含めるか true, false
		},
	};

	const data = fetchSlackApi(url, options);
	return data.messages;
}

// スラックチャネルに所属しているユーザーを取得
function getChannelUser(slackInfo) {
	//チャンネルのユーザー取得
	const url = 'https://slack.com/api/conversations.members';
	const options = {
		method: 'get',
		payload: {
			token: slackInfo.token,
			channel: slackInfo.targetChannel,
		},
	};
	const data = fetchSlackApi(url, options);
	return data.members;
}

// 引数で取得したメンバーIDからスクリーンネームを取得し配列で返却する
function getUserName(idList, slackInfo) {
	const url = 'https://slack.com/api/users.info';
	let array = [];

	idList.forEach(async (userId) => {
		const options = {
			payload: {
				token: slackInfo.token,
				user: userId,
			},
		};

		const data = fetchSlackApi(url, options);
		array.push(data.user.real_name);
	});

	return array;
}

// Slackにメッセージを投稿する
function postChannel(text, slackInfo) {
  const url = 'https://slack.com/api/chat.postMessage';
	const options = {
		method: 'post',
		payload: {
			token: slackInfo.bot_token,
			channel: slackInfo.targetChannel,
			text: text,
		},
	};

	try {
		const result = UrlFetchApp.fetch(url, options);
	} catch (e) {
		console.error(error);
	}
}
