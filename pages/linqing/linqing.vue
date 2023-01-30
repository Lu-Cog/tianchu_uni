<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>林情概况</text>
				<text></text>
			</view>
		</view>
		<view class="lqMain">
			<view class="lqHead flex jard">
				<view class="lqItem flex fCol acen">
					<text>森林覆盖率</text>
					<arprogress :percent="areaInfo.slfgl"><text>{{areaInfo.slfgl}}%</text></arprogress>
				</view>
				<view class="lqItem flex fCol acen">
					<text>林地面积（公顷）</text>
					<text>{{areaInfo.ldzmj}}</text>
				</view>
				<view class="lqItem flex fCol acen">
					<text>绿化率</text>
					<arprogress :percent="areaInfo.lhl"><text>{{areaInfo.lhl}}%</text></arprogress>
				</view>
			</view>
			<view class="lqMap">
				<text class="dian" v-for="item in areaInfo.points" :key="item"
					:style="{top:item.top+'rpx',left:item.left+'rpx'}" @click="openTos(item.name)">{{item.name}}</text>
				<image :src="loadInfo.img" mode="widthFix" @load="imgLoad"></image>
			</view>
		</view>
		<view class="footer flex jard acen">
			<navigator hover-class="none" url="/pages/linqing/organ" class="fitem flex fCol acen">
				<image src="../../static/img/zztx.png" mode="widthFix"></image>
				<text>组织体系</text>
			</navigator>
			<navigator hover-class="none" :url="'/pages/linqing/organInfo?content='+areaInfo.content"
				class="fitem flex fCol acen">
				<image src="../../static/img/yl.png" mode="widthFix"></image>
				<text>林业详情</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		getAreaInfo
	} from '@/api/api.js'
	import arprogress from '@/components/ar-circle-progress/index.vue'
	export default {
		components: {
			arprogress
		},
		data() {
			return {
				areaName: '',
				areaInfo: {},
				loadInfo: {}
			};
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				if (this.areaInfo.sname) {
					this.areaName = this.areaInfo.sname
					this.getAreaInfo()
				} else {
					uni.sendNativeEvent('back')
				}
				return true
			}
		},
		onLoad() {
			this.getAreaInfo()
		},
		methods: {
			imgLoad() {
				uni.hideLoading()
				this.areaInfo = this.loadInfo
			},
			errImg() {
				uni.hideLoading()
			},
			getAreaInfo() {
				let data = {
					name: this.areaName
				}
				uni.showLoading({
					title: '加载中...'
				})
				getAreaInfo(data).then(res => {
					res.data.points = res.data.points ? JSON.parse(res.data.points) : ''
					if(res.data.img){
						if(res.data.img==this.loadInfo.img){
							uni.hideLoading()
							this.areaInfo = res.data
						}else{
							this.loadInfo = res.data
						}
					}else{
						uni.hideLoading()
						this.loadInfo = {}
						this.areaInfo = res.data
					}
				})
			},
			openTos(name) {
				if (this.areaInfo.click == 1) {
					this.areaName = name
					this.getAreaInfo()
				}
			},
			back() {
				if (this.areaInfo.sname) {
					this.areaName = this.areaInfo.sname
					this.getAreaInfo()
				} else {
					uni.sendNativeEvent('back')
				}
			},
		}
	}
</script>

<style lang="less">
	.footer {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 0;
		box-shadow: -4rpx 0 8rpx 4rpx rgba(0, 0, 0, .09);

		.fitem {
			width: 50%;

			image {
				width: 48rpx;
				height: 48rpx;
			}

			text {
				color: rgba(56, 56, 56, 1);
				font-size: 24rpx;
				font-weight: 400;
				white-space: nowrap;
			}
		}
	}

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

	.lqMain {
		border-top: 1rpx #f5f5f5 solid;
		// background-color: #f5f5f5;
		min-height: 90vh;
		position: relative;

		.lqHead {
			position: absolute;
			z-index: 100;
			width: 100%;
			box-sizing: border-box;
			padding: 16rpx 32rpx;

			.lqItem {
				>text {
					margin-bottom: 22rpx;
					color: rgba(56, 56, 56, 1);
					font-size: 28rpx;

					&:last-child {
						font-size: 36rpx;
						font-weight: 700;

					}
				}
			}
		}

		.lqMap {
			margin-top: 200rpx;
			width: 100%;
			height: 100%;
			position: relative;

			image {
				z-index: -1;
				width: 100%;
				height: 100%;
			}
		}
	}

	.dian {
		position: absolute;
		white-space: nowrap;
		padding: 30rpx;
		color: #4b9977;
		font-size: 32rpx;
		font-weight: bolder;
		transform: translate(-50%, -50%);
	}
</style>
