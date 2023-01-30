<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back"></image>
				<text>请假管理</text>
				<navigator url="/pages/leave/leaveList" hover-class="none">请假审批</navigator>
			</view>
		</view>
		<view class="leavelist">
			<view class="no" v-if="list.length<=0">
				暂无记录
			</view>
			<view v-else class="leavaItem" v-for="(item,index) in list" :key="index" @click="goto(item.holId)">
				<view class="itemHead flex acen jbtw">
					<view class="iheadl flex acen">
						<image src="../../static/img/date.png" mode="widthFix"></image>
						<text>{{item.createTime}}</text>
					</view>
					<view class="stype" v-if="item.status==1">审批已通过</view>
					<view class="stype0" v-if="item.status==0">审批中</view>
					<view class="stype0" v-if="item.status==3">已撤销</view>
					<view class="stypes" v-if="item.status==2">审批未通过</view>
				</view>
				<view class="iteminfo flex">
					<text>{{item.title}}</text>
					<text>请假事由：</text>
					<text>{{item.content}}</text>
				</view>
				<view class="leavatime flex acen jbtw">
					<view class="ltimeL">
						请假时间：{{item.startTime.split(' ')[0]}}至{{item.endTime.split(' ')[0]}}
					</view>
					<view class="ltimeR">
						共{{item.days}}天
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @click="goSq()">
			我要请假
		</view>
	</view>
</template>

<script>
	import {getHolidayList} from '../../api/api.js'
	export default {
		data() {
			return {
				list:[],
				page : 0
			};
		},
		onBackPress(e) {
			if(e.from=='backbutton'){
				uni.sendNativeEvent('back')
				return true
			}
		},
		onLoad() {
		},
		onShow() {
			this.getHolidayList()
		},
		onReachBottom() {
			this.getHolidayList(false)
		},
		methods:{
			getHolidayList(flag = true){
				if(flag){
					this.page = 0
				}
				let data= {
					page:this.page,
					type:1
				}
				getHolidayList(data).then(res=>{
					if(flag){
						this.list = res.data.content
						this.page++
					}else{
						if(res.data.content.length>0){
							this.list.push(...res.data.content)
							this.page++
						}
					}
				})
			},
			back(){
				uni.sendNativeEvent('back')
			},
			goto(id){
				uni.navigateTo({
					url:'./leaveInfo?type=1&holId='+id
				})
			},
			goSq(){
				uni.navigateTo({
					url:'./leaveSq'
				})
			}
		}
	}
</script>

<style lang="less">
	.btn{
		padding: 12rpx 0;
		text-align: center;
		width: 90%;
		background: rgba(13, 206, 151, 1);
		border-radius: 32rpx;
		color: #fff;
		position: fixed;
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
				position: absolute;left: 30rpx;
				width: 50rpx;
				height: 50rpx;
			}

			text {
				font-size: 36rpx;
				font-weight: 400;
			}

			navigator {
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translateY(-50%);
				color: rgba(13, 206, 151, 1);
				font-size: 26rpx;
				font-weight: 700;
			}
		}
	}
	.leavelist{
		.no{
			text-align: center;
			margin-top: 200rpx;
			color: #999;
		}
		padding: 48rpx 32rpx 100rpx;
		.leavaItem{
			margin-bottom: 32rpx;
			padding: 18rpx 22rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 0px 8px rgba(0, 204, 146, 0.1);
			border-radius: 32rpx;
			.itemHead{
				image{
					width: 48rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
				text{
					color: rgba(128, 128, 128, 1);
					font-size: 28rpx;
					font-weight: 400;
					margin-right: 20rpx;
				}
				.stype{
					color: rgba(0, 204, 146, 1);
					font-size: 24rpx;
					font-weight: 400;
				}
				.stype0{
					color:#FF8D1A;
					font-size: 24rpx;
					font-weight: 400;
				}
				.stypes{
					color: rgba(227, 60, 100, 1);
					font-size: 24rpx;
					font-weight: 400;
				}
			}
			.iteminfo{
				margin: 22rpx 0;
				text{
					color: rgba(166, 166, 166, 1);
					font-size: 30rpx;
					font-weight: 400;
					margin:0 20rpx;
					&:first-child{
						color: rgba(13, 206, 151, 1);
						font-weight: 700;
						margin: 0;
					}
					&:last-child{
						color: rgba(56, 56, 56, 1);
						margin: 0;
					}
				}
			}
			.leavatime{
				.ltimeL{
					color: rgba(166, 166, 166, 1);
					font-size: 30rpx;
					font-weight: 400;
				}
				.ltimeR{
					color: rgba(56, 56, 56, 1);
					font-size: 30rpx;
					font-weight: 400;
					white-space: nowrap;
				}
			}
		}
	}
</style>
