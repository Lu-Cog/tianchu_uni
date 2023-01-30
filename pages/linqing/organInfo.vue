<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>林业详情</text>
				<text></text>
			</view>
		</view>
		<view class="content" v-html="content">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				
			};
		},
		onLoad() {
			const pages = getCurrentPages();
			const pre = pages[pages.length - 2]; // 重新加载实名页面
			this.content = pre.$vm.areaInfo.content
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less">
	.header {
		width: 100%;
		box-shadow: 0px 2px 6px rgba(0, 204, 146, 0.1);

		.head {
			position: relative;
			padding: 30rpx;

			image {
				position: absolute;
				left: 30rpx;
				width: 50rpx;
				height: 50rpx;
			}

			text {
				font-size: 36rpx;
				font-weight: 400;
			}
		}
	}
	.content{
		padding: 48rpx 32rpx;
		background-color: #f5f5f5;
		min-height: 90vh;
		image{
			width: 100%;
		}
	}
</style>
