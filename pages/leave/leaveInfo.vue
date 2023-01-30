<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>{{pageType==2?"请假审批":"请假详情"}}</text>
				<text></text>
			</view>
		</view>
		<view class="leave">
			<view class="flex acen jbtw">
				<view class="leaveitem" style="width: 40%;">
					<text>申请人</text>
					<view>{{holDetail.nickName}}</view>
				</view>
				<view class="leaveitem" style="width: 40%;">
					<text>申请时间</text>
					<view>{{holDetail.createTime.split(' ')[0]}}</view>
				</view>
			</view>
			<view class="leaveitem">
				<text>请假类别</text>
				<view class="jia">{{holDetail.title}}</view>
			</view>
			<view class="leaveitem">
				<text>请假时间</text>
				<view class="flex acen jbtw">
					<view class="flex acen">
						<image class="dataimg" src="../../static/img/date.png" mode="widthFix"></image>
						<text>{{holDetail.startTime.split(' ')[0]}}</text> <text style="margin: 0 10rpx;"> 至 </text> <text>{{holDetail.endTime.split(' ')[0]}}</text>
					</view>
					<view class="numday">共{{holDetail.days}}天</view>
				</view>
			</view>
			<view class="leaveitem">
				<text>请假事由</text>
				<view class="">
					{{holDetail.content}}
				</view>
			</view>
			<view class="leaveitem">
				<text>附件</text>
				<view class="imgList">
					<image v-for="(item,index) in JSON.parse(holDetail.imgs)" :src="item" mode="aspectFill" @click="viewImg(index,JSON.parse(holDetail.imgs))"></image>
				</view>
			</view>
			<view class="leaveitem flex acen jbtw">
				<view class="additem">
					<text>审批人</text>
					<view class="flex acen">
						<image :src="holDetail.avatarPath1" mode="aspectFill">
						</image>
						<text>{{holDetail.nickName1}}</text>
					</view>
				</view>
				<view class="additem">
					<text>抄送人</text>
					<view class="flex acen">
						<image :src="holDetail.avatarPath2" mode="aspectFill">
						</image>
						<text>{{holDetail.nickName2}}</text>
					</view>
				</view>
			</view>
			<view class="leaveitem">
				<text>审批意见</text>
				<textarea v-model="note" placeholder="审批意见" :disabled='pageType==1 || holDetail.status!=0'/>
			</view>
			<view class="leaveitem" v-if="holDetail.replyTime">
				<text>审批时间</text>
				<view class="">
					{{holDetail.replyTime}}
				</view>
			</view>
			<view class="btnqx" v-if="pageType==1 && holDetail.status==0" @click="getHcancel(holDetail.holId)">
				撤销
			</view>
			<view class="btnList flex acen jbtw" v-if="pageType==2 && holDetail.status==0">
				<view class="btnitem no" @click="sub(2)">
					不同意
				</view>
				<view class="btnitem yes" @click="sub(1)">
					同意
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getHolidayDetail,getHolidayAct,getHcancel} from '../../api/api.js'
	export default {
		data() {
			return {
				pageType:1,
				holId:'',
				holDetail:{},
				note:''
			};
		},
		onLoad(option) {
			this.pageType = option.type
			this.holId = option.holId
			this.getHolidayDetail()
		},
		methods: {
			getHcancel(id){
				let that = this
				uni.showModal({
					content:'是否撤销？',
					success(res) {
						if(res.confirm){
							getHcancel({holId:id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									that.back()
								},400)
								
							})
						}
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			viewImg(index,list) {
				uni.previewImage({
					current:index,
					urls: list,
				})
			},
			sub(type){
				if(!this.note){
					return uni.showToast({
						title:'请填写审批意见',
						icon:'none'
					})
				}
				let data = {
					holId:this.holDetail.holId,
					status:type,
					reply:this.note
				}
				getHolidayAct(data).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.back()
					},400)
				})
			},
			getHolidayDetail(){
				let data = {
					holId : this.holId
				}
				getHolidayDetail(data).then(res=>{
					this.holDetail = res.data
					this.note = this.holDetail.reply
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

	.leave {
		padding: 48rpx 32rpx;

		.leaveitem {
			margin-bottom: 32rpx;

			>text {
				color: rgba(56, 56, 56, 1);
				font-size: 30rpx;
				font-weight: 400;
				display: inline-block;
				margin-bottom: 10rpx;
			}

			.jia {
				color: rgba(13, 206, 151, 1);
				font-size: 34rpx;
				font-weight: 700;
			}

			>view {
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
				padding: 20rpx;
				border-radius: 10rpx;

				.dataimg {
					width: 48rpx;
					height: 48rpx;
					margin-right: 10rpx;
				}

				.numday {
					color: rgba(13, 206, 151, 1);
					font-size: 30rpx;
				}
			}

			textarea {
				background: rgba(255, 255, 255, 1);
				width: 100%;
				padding: 20rpx;
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
				border-radius: 8px;
				box-sizing: border-box;
			}

			.imgList {
				padding: 24rpx 20rpx;
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);

				image {
					border-radius: 20rpx;
					width: 120rpx;
					height: 120rpx;
				}
			}

			.additem {
				width: 48%;
				box-shadow: none;
				padding: 0;

				text {
					color: rgba(56, 56, 56, 1);
					font-size: 32rpx;
					font-weight: 500;
				}

				>view {
					margin-top: 20rpx;
					padding: 20rpx;
					border-radius: 10rpx;
					box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);

					text {
						font-size: 28rpx;
						font-weight: 400;
					}
				}

				image {
					border-radius: 16rpx;
					width: 72rpx;
					height: 72rpx;
					margin-right: 10rpx;
				}
			}

		}
		.btnqx{
			width: 90%;
			padding: 16rpx;
			text-align: center;
			border-radius: 32rpx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid #999;
			color: #999;
		}
		.btnList {
			.btnitem {
				box-sizing: border-box;
				width: 48%;
				padding: 16rpx;
				text-align: center;
				border-radius: 32rpx;
			}

			.no {
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(227, 60, 100, 1);
				color: rgba(227, 60, 100, 1);
			}

			.yes {
				background: rgba(13, 206, 151, 1);
				color: #fff;
			}
		}

	}
</style>
