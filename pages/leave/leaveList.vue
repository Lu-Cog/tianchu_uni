<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>请假审批</text>
				<text></text>
			</view>
		</view>
		<view class="tab">
			<text :class="{active:active==2}" @click="changeTab(2)">待审批</text>
			<text :class="{active:active==3}" @click="changeTab(3)">已审批</text>
		</view>
		<view class="leavelist">
			<view class="no" v-if="list.length<=0">
				暂无记录
			</view>
			<view v-else class="leavaItem" v-for="(item,index) in list" :key="index" @click="goto(item.holId)">
				<view class="itemHead flex acen jbtw">
					<view class="iheadl">
						审请人：{{item.nickName}}
					</view>
					<view class="time">
						{{item.createTime}}
					</view>
				</view>
				<view class="itemtype flex acen jbtw">
					<view>
						<text>请假类别：</text>
						<text>{{item.title}}</text>
					</view>
					<view class="stype" v-if="item.status==1">审批已通过</view>
					<view class="stypes" v-if="item.status==2">审批未通过</view>
				</view>
				<view class="iteminfo flex">
					<text>请假事由：</text>
					<text>{{item.content}}</text>
				</view>
				<view class="leavatime flex acen jbtw">
					<view class="ltimeL flex acen">
						<image src="../../static/img/date.png" mode="widthFix"></image>
						请假时间：{{item.startTime.split(' ')[0]}}至{{item.endTime.split(' ')[0]}}
					</view>
					<view class="ltimeR">
						共{{item.days}}天
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getHolidayList
	} from '../../api/api.js'
	export default {
		data() {
			return {
				active:2,
				list: [],
				page: 0
			};
		},
		onLoad() {
		},
		onShow() {
			this.getHolidayList()
		},
		onReachBottom() {
			this.getHolidayList(false)
		},
		methods: {
			changeTab(type){
				this.active = type
				this.getHolidayList()
			},
			getHolidayList(flag = true) {
				if (flag) {
					this.page = 0
				}
				let data = {
					page: this.page,
					type: this.active
				}
				getHolidayList(data).then(res => {
					if (flag) {
						this.list = res.data.content
						this.page++
					} else {
						if (res.data.content.length > 0) {
							this.list.push(...res.data.content)
							this.page++
						}
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goto(id) {
				uni.navigateTo({
					url: './leaveInfo?type=2&holId='+id
				})
			}
		}
	}
</script>

<style lang="less">
	.tab{
		overflow: hidden;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, .2);
		border-radius: 10rpx;
		width: 80%;
		margin: 30rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
		text{
			width: 50%;
			padding: 20rpx;
			text-align: center;
		}
		.active{
			background-color: rgba(13, 206, 151, 1);
			color: #fff;
		}
	}
	.btn {
		padding: 12rpx 0;
		text-align: center;
		width: 90%;
		background: rgba(13, 206, 151, 1);
		border-radius: 32rpx;
		color: #fff;
		position: absolute;
		bottom: 50rpx;
		left: 50%;
		transform: translateX(-50%);
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

			navigator {
				color: rgba(13, 206, 151, 1);
				font-size: 26rpx;
				font-weight: 700;
			}
		}
	}

	.leavelist {
		padding: 0rpx 32rpx 48rpx;

		.no {
			text-align: center;
			margin-top: 200rpx;
			color: #999;
		}

		.leavaItem {
			margin-bottom: 32rpx;
			padding: 18rpx 22rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 0px 8px rgba(0, 204, 146, 0.1);
			border-radius: 32rpx;

			.itemHead {
				.iheadl {
					color: rgba(56, 56, 56, 1);
					font-size: 32rpx;
					font-weight: 500;
				}

				.time {
					color: rgba(166, 166, 166, 1);
					font-size: 24rpx;
					font-weight: 400;
				}
			}

			.itemtype {
				margin: 22rpx 0;

				text {
					color: rgba(166, 166, 166, 1);
					font-size: 30rpx;
					font-weight: 400;
					color: rgba(56, 56, 56, 1);

					&:last-child {
						color: rgba(13, 206, 151, 1);
					}
				}
				.stype{
					color: rgba(0, 204, 146, 1);
					font-size: 24rpx;
					font-weight: 400;
				}
				.stypes{
					color: rgba(227, 60, 100, 1);
					font-size: 24rpx;
					font-weight: 400;
				}
			}

			.iteminfo {
				margin: 22rpx 0;

				text {
					color: rgba(166, 166, 166, 1);
					font-size: 30rpx;
					font-weight: 400;
				}
			}

			.leavatime {
				.ltimeL {
					image {
						width: 48rpx;
						height: 48rpx;
					}

					color: rgba(56, 56, 56, 1);
					font-size: 26rpx;
					font-weight: 400;
				}

				.ltimeR {
					color: rgba(56, 56, 56, 1);
					font-size: 30rpx;
					font-weight: 400;
				}
			}
		}
	}
</style>
