<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image @click="goback()" src="../../static/img/back2.png" mode="widthFix"></image>
				<text>打卡记录</text>
				<text></text>
			</view>
			<view class="date" @click="open()">
				<text>{{date}}</text>
				<image src="../../static/img/sjx.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="list">
			<view class="no" v-if="dklist.length<=0">
				暂无记录
			</view>
			<view v-else class="listItem" v-for="item in dklist" :key="item">
				<view class="time">
					{{item.title}}
				</view>
				<view class="iteminfo flex acen jard" v-for="item2 in item.json" :key="item2">
					<text>{{item2.title}}</text>
					<view class="flex acen jard">
						<image :src="item2.status!=0?'../../static/img/ydk.png':'../../static/img/qk.png'"
							mode="widthFix"></image>
						<text class="centext">{{item2.dktime}}</text>
					</view>
					<text v-if="item2.status==3" class="chizao">迟到</text>
					<text v-if="item2.status==2" class="chizao">早退</text>
					<text v-if="item2.status==1" class="zhenchang">正常</text>
					<text v-if="item2.status==0" class="queka">缺卡</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :safeArea="false">
			<view class="popup2">
				<picker-view :indicator-style="indicatorStyle" mask-class="mask" :value="dataVal" @change="bindChange"
					class="picker-view">
					<picker-view-column>
						<view class="picker_item" v-for="(item,index) in year" :key="item">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker_item" v-for="(item,index) in mon" :key="item">{{item}}</view>
					</picker-view-column>
				</picker-view>
				<view class="btnclose" @click="close()">
					确认
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getDakaList
	} from '../../api/api.js'
	export default {
		onLoad() {
			for (let i = 1; i <= 12; i++) {
				if (i < 10) {
					i = '0' + i
				}
				this.mon.push(i)
			}
			for (let i = 2022; i <= 2032; i++) {
				this.year.push(i)
			}
			let y = new Date().getFullYear()
			let m = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
			this.date = y + '-' + m
			this.dataVal = [this.year.indexOf(y), this.mon.indexOf(m)]
			this.getDakaList()
		},
		onReachBottom() {
			this.getDakaList(false)
		},
		data() {
			return {
				status: 1,
				dataVal: [0, 0],
				indicatorStyle: `height: 50px;`,
				mon: [],
				year: [],
				date: '',
				page: 0,
				dklist: [],
			};
		},
		methods: {
			getDakaList(flag = true) {
				if (flag) {
					this.page = 0
				}
				let data = {
					page: this.page,
					date: this.date
				}
				getDakaList(data).then(res => {
					if (flag) {
						this.dklist = res.data
						this.page++
					} else {
						if (res.daka.length >= 0) {
							this.dklist.push(...res.data)
							this.page++
						}
					}
				})
			},
			bindChange: function(e) {
				this.dataVal = e.detail.value
			},
			goback() {
				uni.navigateBack({
					delta: 1
				})
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				let y = this.year[this.dataVal[0]]
				let m = this.mon[this.dataVal[1]]
				this.date = y + '-' + m
				this.getDakaList()
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="less">
	.no{
		text-align: center;
		margin-top: 200rpx;
		color: #999;
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
				// color: rgba(255, 255, 255, 1);
				font-size: 36rpx;
				font-weight: 400;
			}

		}

		.date {
			padding: 20rpx 50rpx;

			text {
				font-size: 28rpx;
				margin-right: 10rpx;
				font-weight: 700;
			}

			image {
				width: 36rpx;
				height: 28rpx;
			}
		}

	}

	.list {
		background: rgba(240, 242, 242, 1);
		width: 100%;
		min-height: 90vh;
		padding: 48rpx 32rpx;
		box-sizing: border-box;

		.listItem {
			margin-bottom: 40rpx;
			border-radius: 48rpx;
			padding: 26rpx 30rpx;
			border-left: 16rpx solid rgba(0, 204, 146, 1);
			background-color: #fff;
			box-sizing: border-box;

			.time {
				font-size: 32rpx;
				font-weight: 500;
			}

			.iteminfo {
				margin-top: 20rpx;
				background: rgba(242, 252, 249, 1);
				border-radius: 16rpx;
				padding: 8rpx 26rpx;

				image {
					width: 36rpx;
					height: 36rpx;
					margin-right: 20rpx;
				}

				text {
					font-size: 28rpx;
					font-weight: 400;
				}

				.centext {
					color: rgba(166, 166, 166, 1);
					min-width: 240rpx;
				}

				.chizao {
					color: rgba(255, 141, 26, 1);
					background: rgba(255, 235, 214, 1);
					border: 1px solid rgba(255, 141, 26, 1);
					border-radius: 16rpx;
					font-size: 24rpx;
					font-weight: 400;
					padding: 4rpx 10rpx;
				}

				.zhenchang {
					background: rgba(193, 245, 230, 1);
					border: 1px solid rgba(0, 204, 146, 1);
					color: rgba(0, 204, 146, 1);
					border-radius: 16rpx;
					font-size: 24rpx;
					font-weight: 400;
					padding: 4rpx 10rpx;
				}

				.queka {
					background: rgba(252, 204, 204, 1);
					border: 1px solid rgba(212, 48, 48, 1);
					color: rgba(212, 48, 48, 1);
					border-radius: 16rpx;
					font-size: 24rpx;
					font-weight: 400;
					padding: 4rpx 10rpx;
				}
			}
		}
	}

	.popup2 {
		// padding: 30rpx 0;
		border-bottom: none;
		border-radius: 30rpx 30rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		height: 50vh;
		overflow: auto;
		background-color: #fff;

		.picker-view {
			width: 750rpx;
			height: 88%;
			// margin-top: 20rpx;
		}

		.btnclose {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 12%;
			// padding: 20rpx 100rpx;
			color: #fff;
			text-align: center;
			background: linear-gradient(0deg, rgba(0, 204, 146, 0.65) 0%, rgba(0, 204, 146, 1) 100%);
		}

		.picker_item {
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
		}
	}
</style>
