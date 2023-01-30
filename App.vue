<script>
	export default {
		globalData: {
			token:'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyOWYyNDFhZjNhYzQ0YThiODFkODViNGJlMWQzZDNlNSIsInVzZXIiOiIxNTY3MzM3MDY5MSIsInN1YiI6IjE1NjczMzcwNjkxIn0.aVLbwDX6BJ0iU7gcTqvNuHzm18dxpBP3I5lv4GIJ8yywRF6o18hvuYJvOQxXaxdMI8L-XhWCXNNlvugXT0DKjA'
		},
		onLaunch: function(option) {
			// 锁定竖屏  
			plus.screen.lockOrientation("portrait-primary");  
			this.globalData.token = option.referrerInfo.extraData.token
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.flex {
		display: flex;
	}

	.fCol {
		flex-direction: column;
	}

	.fWap {
		flex-wrap: wrap;
	}

	.acen {
		align-items: center;
	}

	.jcen {
		justify-content: center;
	}

	.jbtw {
		justify-content: space-between;
	}

	.jard {
		justify-content: space-around;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
