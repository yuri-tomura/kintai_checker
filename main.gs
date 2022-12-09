// スラック投稿情報
const slackInfo = {
	token: '保存しておいたUser OAuth Token',
	bot_token: '保存しておいたBot User OAuth Token',
	targetChannel: '勤怠チャンネルのチャンネルID',
};

// 除外リスト（勤怠報告が不要だがチャンネルに所属しているメンバー）
const exclusionUsers = [
	'U0XXXXXXX', // 勤怠お知らせくん（bot本体のメンバーID）
	'XXXXXXXX', // 部長
];

// 通知リスト（スラックへ投稿する際メンションをつけてお知らせするメンバー）
const notifyUsersList = [
	'XXXXXXXXX', // DESマネジャーのメンバーID
	'XXXXXXXXX', // DESリーダーのメンバーID
	'XXXXXXXXX', // DESリーダーのメンバーID
	'XXXXXXXXX', // FEリーダーのメンバーID
	'XXXXXXXXX', // FEマネージャーのメンバーID
];

// メンションを作成する
function createMentionText() {
  if (notifyUsersList.length === 0) return '';
	let str = '<@';
	return str.concat(notifyUsersList.join('> <@'), '>');
}

// 送信するメッセージを作成する
function createSendMessage(noPostedUsers) {
	// 通知するユーザーのメンションを文字列に変換する
	const mentions = createMentionText();

	// 除外リストをチェックし存在するユーザーは対象から除外する
	const targetUsers = noPostedUsers.filter((value) => {
		return !exclusionUsers.includes(value);
	});

	// 送信するテキストの作成
	let text = `${mentions}\n【${getToday()}】\n:sun_with_face: おはようございます！:sun_with_face:\n`;

	// 対象者の有無によって文言を変更する
	if (targetUsers.length > 0) {
		const targetUserNameList = getUserName(targetUsers, slackInfo);
		const users = targetUserNameList.join('さん、');

		text +=
			'本日おやすみ、もしくはまだ朝の出勤報告をしていないメンバーは、' +
			'\n\n' +
			users +
			'さんです！' +
			'\n\n' +
			'ご確認お願いします！';
	} else {
		text +=
			'本日おやすみ、もしくはまだ朝の出勤報告がないメンバーは、いません！' +
			'\n' +
			'今日も1日みんなで元気にがんばりましょう〜！！';
	}
	return text;
}

// 所属メンバーの中から、本日未投稿のユーザーを抽出する
function getNotPostedUser(postedUsers, channelUsers) {
	const notPostedUsers = channelUsers.filter((value) => !postedUsers.includes(value));
	return notPostedUsers;
}

// 取得した投稿済みメッセージからユーザーIDを抽出する
function extractPostedUserId(messages) {
	const userList = [];
	for (const [key, value] of Object.entries(messages)) {
		if (typeof value !== 'undefined') {
			userList.push(value.user);
		}
	}
	return userList;
}

// 処理実行関数
function run() {
	// 投稿されたメッセージから、勤怠連絡済みのユーザーを抽出
	const messages = getPostedMessage(slackInfo);
	const postedUsers = extractPostedUserId(messages);

	// スラックチャネルに所属しているユーザーを取得
	const channelUsers = getChannelUser(slackInfo);

	// チャンネル所属ユーザーと比較して、投稿していないユーザーを取得
	const noPostedUsers = getNotPostedUser(postedUsers, channelUsers);

	// 投稿用のテキスト作成
	const sendText = createSendMessage(noPostedUsers);

	// スラックに投稿する
	postChannel(sendText, slackInfo);
}

// 平日に勤怠チェックを動かすトリガー関数（GASのトリガーに設定する）
const setTrigger = () => {
	const today = new Date();

	// 営業日でなければ処理終了
	if (!isWorkday(today)) return;

	// 起動時間を10:05:00に時刻を設定
	today.setHours(10);
	today.setMinutes(5);
	today.setSeconds(0);

	ScriptApp.newTrigger('run').timeBased().at(today).create();
};
