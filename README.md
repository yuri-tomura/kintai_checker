# Slac APIとGoogle Apps Scriptを使って勤怠チェックを自動化する

Qiitaの[こちら]()の記事に詳細記載してあります。


### SlackAPIの設定
Slack Appを作成し、「Bot Token Scopes」と「User Token Scopes」に以下の権限を設定する

#### Bot Token Scopes
- chat:write
- chat:write.public


#### User Token Scopes
* channels:history
* channels:read
* chat:write
* groups:history
* groups:read
* users:read

### ソース内の修正箇所
#### ■slack投稿情報（main.gs）
```javaScript:main.gs
// slack投稿情報
const slackInfo = {
	token: '保存しておいたUser OAuth Token',
	bot_token: '保存しておいたBot User OAuth Token',
	targetChannel: '勤怠チャンネルのチャンネルID',
};
```
| 修正箇所 | 修正内容 |
|:-|:-|
|token |User OAuth Token|
|bot_token|Bot User OAuth Token|
|targetChannel|slackの勤怠チャンネルのチャンネルID|



#### ■除外リスト（main.gs）
```javaScript:main.gs
// 除外リスト（勤怠連絡が不要だがチャンネルに所属しているメンバー）
const exclusionUsers = [
	'U0XXXXXXX', // 勤怠お知らせくん（bot本体のメンバーID）
	'XXXXXXXX', // 部長
];
```
チャンネルに所属しているが、勤怠管理が不要なメンバーのメンバーIDを設定。
また、bot自身のメンバーIDも除外リストに設定。

#### ■通知リスト（main.gs）
```javaScript:main.gs
// 通知リスト（slackへ投稿する際メンションをつけてお知らせするメンバー）
const notifyUsersList = [
	'XXXXXXXXX', // DESマネジャーのメンバーID
	'XXXXXXXXX', // DESリーダーのメンバーID
	'XXXXXXXXX', // DESリーダーのメンバーID
	'XXXXXXXXX', // FEリーダーのメンバーID
	'XXXXXXXXX', // FEマネージャーのメンバーID
];
```
勤怠をお知らせするときに、メンションしたいメンバーのメンバーIDを設定。
通知が不要の場合は空配列にする。


#### ■【任意】チェッカーの通知時間（main.gs）

```javaScript:main.gs
// 起動時間を10:05:00に時刻を設定
today.setHours(10);
today.setMinutes(5);
today.setSeconds(0);
```
起動したい時間を変更する場合は修正する。
また、上記を修正した場合は、投稿を取得する範囲の時間も一緒に変更する。（slack.gs）

```javaScript:main.gs
const oldest = getUnixTime(`${getToday()} 05:00:00`); // 朝5時から
const latest = getUnixTime(`${getToday()} 10:05:00`); // 朝10時5分まで

```
