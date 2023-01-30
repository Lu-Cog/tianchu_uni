<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>请假申请</text>
				<text></text>
			</view>
		</view>
		<view class="leave">
			<view class="leaveitem">
				<text>申请人</text>
				<input class="inputMan" type="text" v-model="name" placeholder="请输入" disabled>
			</view>
			<view class="leaveitem">
				<text>请假类别</text>
				<view class="inputMan" @click="open">
					{{typeName?typeName:'请选择'}}
				</view>
				<!-- <picker mode="selector" :range="typeList" @change="changeType" :value="typeIndex">
					<view class="pickerview flex acen jbtw">{{typeList[typeIndex]}}
						<image src="../../static/img/right.png" mode="widthFix"></image>
					</view>
				</picker> -->
			</view>
			<view class="leaveitem">
				<text>请假时间</text>
				<uni-datetime-picker v-model="range" type="daterange" rangeSeparator="至" @maskClick="maskClick" />
			</view>
			<view class="leaveitem">
				<text>请假事由</text>
				<textarea v-model="content" placeholder="请描述具体情况" />
			</view>
			<view class="leaveitem">
				<text>附件</text>
				<view class="imgList">
					<image v-for="(item,index) in img" :src="item" mode="aspectFill" @click="viewImg(index)"></image>
					<image src="../../static/img/paizhao.png" mode="aspectFill" @click="upload"></image>
				</view>
			</view>
			<view class="leaveitem">
				<text>流程</text>
				<view class="additem flex acen jbtw" @click="addman(1)">
					<text v-if="!spMan.user_id">请添加审批人</text>
					<view v-else class="itemIn flex acen">
						<image :src="spMan.img" mode="aspectFill"></image>
						<text>{{spMan.name}}</text>
					</view>
					<image src="../../static/img/add.png" mode="widthFix"></image>
				</view>
				<view class="additem flex acen jbtw" @click="addman(2)">
					<text v-if="!csMan.user_id">请添加抄送人</text>
					<view v-else class="itemIn flex acen">
						<image :src="csMan.img" mode="aspectFill"></image>
						<text>{{csMan.name}}</text>
					</view>
					<image src="../../static/img/add.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="btn" @click="sub()">
				提交申请
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :safe-area='false'>
			<view class="popupContent">
				<view class="typeList flex fWap">
					<view v-for="(item,index) in typeList" :key="index" class="typeItem" @click="changeType(item.id,item.name)" :class="{active:typeIndex==item.id}">
						{{item.name}}
					</view>
				</view>
				<view class="btnS" @click="close">
					确定
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getUserInfo,
		getHolidayAdd,
		getDictDetail
	} from '../../api/api.js'
	export default {
		onLoad() {
			this.getUserInfo()
			this.getDictDetail()
		},
		onShow() {
			let that = this
			uni.onNativeEventReceive((event, data) => {

				if (event == 'spContacts') {
					that.spMan.name = data.name
					that.spMan.img = data.img
					that.spMan.user_id = data.user_id
				} else if (event == 'csContacts') {
					that.csMan.name = data.name
					that.csMan.img = data.img
					that.csMan.user_id = data.user_id
				}

			})
		},
		data() {
			return {
				name: '',
				typeName:'',
				typeList: [],
				typeIndex: 0,
				range: [],
				img: [],
				content: '',
				csMan: {
					name: '',
					img: '',
					user_id: ''
				},
				spMan: {
					name: '',
					img: '',
					user_id: ''
				}
			};
		},
		methods: {
			getUserInfo(){
				getUserInfo({type:1}).then(res=>{
					this.name = res.data.nickName
				})
			},
			getDictDetail(){
				getDictDetail().then(res=>{
					this.typeList = res.data
				})
			},
			close(){
				this.$refs.popup.close()
			},
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open()
			},
			sub() {
				if (!this.name) {
					return uni.showToast({
						title: '请填写申请人',
						icon: 'none'
					})
				}
				if (this.typeIndex <= 0) {
					return uni.showToast({
						title: '请选择请假类型',
						icon: 'none'
					})
				}
				if (this.range.length < 2) {
					return uni.showToast({
						title: '请选择请假时间',
						icon: 'none'
					})
				}
				if (!this.content) {
					return uni.showToast({
						title: '请填写请假事由',
						icon: 'none'
					})
				}
				if (!this.spMan.user_id) {
					return uni.showToast({
						title: '请选择审批人',
						icon: 'none'
					})
				}
				uni.showLoading({
					title: '加载中...'
				})
				let data = {
					nickName: this.name,
					cate: this.typeIndex,
					content: this.content,
					startTime: this.range[0],
					endTime: this.range[1],
					imgs: this.img,
					userId1: this.spMan.user_id,
					userId2: this.csMan.user_id
				}
				getHolidayAdd(data).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.navigateBack({
						delta: 1
					})
				})
			},
			addman(type) {
				if (type == 1) {
					uni.sendNativeEvent('spContacts')
				} else {
					uni.sendNativeEvent('csContacts')
				}

			},
			changeType(val,name) {
				this.typeIndex = val
				this.typeName = name
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			maskClick(e) {
				console.log('maskClick事件:', e);
			},
			viewImg(index) {
				uni.previewImage({
					current:index,
					urls: this.img,
				})
			},
			upload() {
				let that = this
				uni.chooseImage({
					count: 9,
					success(res) {
						res.tempFilePaths.forEach(item=>{
							uni.uploadFile({
								url: 'http://tc.iqweb.net/api/index/uploadImg', //仅为示例，非真实的接口地址
								filePath: item,
								name: 'upfile',
								success: (uploadFileRes) => {
									that.img.push(JSON.parse(uploadFileRes.data).data.url)
								}
							});
						})
						
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.popupContent{
		border-radius: 20rpx 20rpx 0 0;
		padding: 50rpx 0 80rpx;
		width: 100%;
		background-color: #fff;
		.typeItem{
			width: 20%;
			margin: 0 6.5% 3%;
			text-align: center;
			padding: 10rpx 0;
		}
		.active{
			background: rgba(13, 206, 151, 1);
			border-radius: 8rpx;
			color: #fff;
		}
		.btnS{
			width: 80%;
			margin: 0 auto;
			text-align: center;
			border-radius: 32rpx;
			background: rgba(13, 206, 151, 1);
			padding: 10rpx;
			color: #fff;
			margin-top: 40rpx;
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

			.inputMan {
				padding: 20rpx 12rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
				border-radius: 16rpx;
			}

			.pickerview {
				padding: 20rpx 12rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
				border-radius: 16rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.uni-date-x--border {
				padding: 10rpx 0;
				border: none;
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
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
					margin: 4rpx;
					border-radius: 20rpx;
					width: 120rpx;
					height: 120rpx;
				}
			}

			.additem {
				box-shadow: 0px 0px 8px rgba(13, 206, 151, 0.15);
				margin-bottom: 30rpx;
				padding: 16rpx 26rpx;

				>text {
					color: rgba(56, 56, 56, 1);
					font-size: 32rpx;
					font-weight: 500;
				}

				.itemIn {
					image {
						border-radius: 16rpx;
						width: 100rpx;
						height: 100rpx;
					}

					text {
						font-size: 28rpx;
						margin-left: 20rpx;
					}
				}

				image {
					border-radius: 16rpx;
					width: 72rpx;
					height: 72rpx;
				}
			}

		}

		.btn {
			width: 100%;
			box-sizing: border-box;
			background: rgba(13, 206, 151, 1);
			border-radius: 16px;
			color: #fff;
			text-align: center;
			padding: 20rpx;
		}
	}
</style>
