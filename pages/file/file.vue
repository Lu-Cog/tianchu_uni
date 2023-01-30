<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jbtw">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<view class="tab flex acen">
					<text :class="{active:active==1}" @click="changeTab(1)">政策文件</text>
					<text :class="{active:active==2}" @click="changeTab(2)">知识文档</text>
				</view>
				<image src="../../static/img/allxin.png" mode="widthFix" @click="goSc()"></image>
			</view>
		</view>
		<view class="fileMain" v-if="active==1">
			<view class="filetab flex acen">
				<text :class="{active2:active2==0}" @click="changeTab2(0)">全部</text>
				<text :class="{active2:active2==item.cateId}" v-for="(item,index) in cateList" :key='item'
					@click="changeTab2(item.cateId)">{{item.title}}</text>
			</view>
			<view class="filelist">
				<view class="no" v-if="list.length<=0">
					暂无文档
				</view>
				<view v-else class="fileitem flex acen jbtw" v-for="(item,index) in list" :key='item'
					@click="download(item.url)">
					<view class="item_l flex fCol">
						<text>{{item.title}}</text>
						<text>{{item.createTime}}</text>
					</view>
					<image :src="item.fav==1?'../../static/img/ysc.png':'../../static/img/wsc.png'" mode="widthFix"
						@click.stop="fav(item)"></image>
				</view>
			</view>
		</view>
		<view class="docuMain" v-if="active==2">
			<view class="filetab flex acen">
				<text :class="{active2:active3==0}" @click="changeTab3(0)">全部</text>
				<text :class="{active2:active3==item.cateId}" v-for="(item,index) in cateList" :key='item'
					@click="changeTab3(item.cateId)">{{item.title}}</text>
			</view>
			<view class="no" v-if="list.length<=0">
				暂无文档
			</view>
			<view v-else class="docuItem flex acen jbtw" v-for="(item,index) in list" :key='item'
				@click="download(item.url)">
				<view class="item_l flex acen">
					<image :src="item.icon" mode="aspectFill" style="margin-right: 10rpx;"></image>
					<view class="flex fCol">
						<text>{{item.title}}</text>
						<text>{{item.createTime}}</text>
					</view>
				</view>
				<image :src="item.fav==1?'../../static/img/ysc.png':'../../static/img/wsc.png'" mode="widthFix"
					@click.stop="fav(item)"></image>
			</view>
		</view>
		<lsj-upload class="upload" v-if="active==2 && active3!=0" ref="lsjUpload" childId="upload1" width="130rpx" height="130rpx"
			:option="option" :instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
			<image src="../../static/img/uplaod.png" mode="aspectFill"></image>
		</lsj-upload>
	</view>
</template>

<script>
	import {
		getDocList,
		getDocAct,
		getFlieAdd
	} from '@/api/api.js'
	export default {
		data() {
			return {
				active: 1,
				active2: 0,
				active3:0,
				list: [],
				page: 0,
				cateList: [],
				option: {
					// 上传服务器地址，此地址需要替换为你的接口地址
					url: 'http://tc.iqweb.net/api/localStorage/docpic',
					// 上传附件的key
					name: 'file',
					// 根据你接口需求自定义请求头
					header: {
						'Authorization': getApp().globalData.token
					}
				},
				// 选择文件后是否立即自动上传，true=选择后立即上传
				instantly: true,
			};
		},
		onLoad() {
			this.getDocList()
		},
		onReachBottom() {
			this.getDocList(false)
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.sendNativeEvent('back')
				return true
			}
		},
		methods: {
			// 某文件上传结束回调(成功失败都回调)
			onuploadEnd(item) {
				let res = item.responseText?JSON.parse(item.responseText):{}
				let data = {
					title:item.name,
					icon:'',
					url:res.path,
					cateId :this.active3
				}
				uni.showLoading({
					title:'上传中...'
				})
				getFlieAdd(data).then(res=>{
					uni.hideLoading()
					this.getDocList()
					uni.showToast({
						title:res.msg
					})
				})
			},
			// 上传进度回调
			onprogress(item) {
				console.log(222);
			},
			// 文件选择回调
			onChange(files) {
				console.log(111);
			},
			download(url) {
				let urlFileType = '',
					urlImgType = '';
				['.doc', '.xls', '.ppt', '.pdf', '.docx', '.xlsx', '.pptx'].forEach(item => {
					if (url.lastIndexOf(item, url.length - 1) > -1) {
						urlFileType = item
					}
				});
				['.png', '.jpg'].forEach(item => {
					if (url.lastIndexOf(item, url.length - 1) > -1) {
						urlImgType = item
					}
				});

				if (urlFileType) {
					uni.downloadFile({
						url: url,
						success: (res) => {
							if (res.statusCode === 200) {
								uni.openDocument({
									filePath: res.tempFilePath,
									showMenu: true,
									success: function(res) {
										console.log('打开文档成功');
									}
								});
							}
						}
					});
				} else if (urlImgType) {
					uni.previewImage({
						urls: url.split(','),
					});
				} else {
					uni.showModal({
						content: '确定下载此文档？',
						success(res) {
							if (res.confirm) {
								const downloadTask = uni.downloadFile({
									url: url,
									filePath : 'file://storage/emulated/0/tianchu',
									success: (res) => {
										if (res.statusCode === 200) {
											uni.saveFile({
												tempFilePath: res.tempFilePath,
												success: function(res) {
													uni.showToast({
														title: '文件保存在' + res
															.savedFilePath,
														icon: 'none',
														position: 'bottom'
													})
												}
											});
										}
									},
									fail: (res) => {
										uni.showToast({
											title: '文件下载失败',
											icon: 'none',
											position: 'bottom'
										})
									}
								});
								downloadTask.onProgressUpdate((res) => {
									if (res.progress < 100) {
										uni.showToast({
											title: '已下载' + res.progress + '%',
											icon: 'none',
											position: 'bottom'
										})
									}
								});
							}
						}
					})
				}

			},
			getDocList(flag = true) {
				if (flag) {
					this.page = 0
				}
				let data = {
					page: this.page,
					type: this.active,
					cateId: this.active==1?this.active2:this.active3,
					isFav: 0
				}
				getDocList(data).then(res => {
					this.cateList = res.data.cateList
					if (flag) {
						this.list = res.data.list
						this.page++
					} else {
						if (res.data.list.length > 0) {
							this.list.push(...res.data.list)
							this.page++
						}
					}
				})
			},
			fav(item) {
				let type = ''
				if (item.fav == 1) {
					type = 2
				} else {
					type = 1
				}
				let data = {
					docId: item.docId,
					type: type
				}
				getDocAct(data).then(res => {
					this.getDocList()
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
				})
			},
			back() {
				uni.sendNativeEvent('back')
			},
			changeTab(type) {
				this.active = type
				this.getDocList()
			},
			changeTab2(type) {
				this.active2 = type
				this.getDocList()
			},
			changeTab3(type) {
				this.active3 = type
				this.getDocList()
			},
			goSc() {
				uni.navigateTo({
					url: './fileSc'
				})
			}
		}
	}
</script>

<style lang="less">
	.upload {
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);

		image {
			width: 100%;
			height: 100%;
		}
	}

	.no {
		text-align: center;
		margin-top: 200rpx;
		color: #999;
	}

	.header {
		width: 100%;
		box-shadow: 0px 2px 6px rgba(0, 204, 146, 0.1);

		.head {
			padding: 30rpx;

			image {
				width: 50rpx;
				height: 50rpx;
			}

			text {
				font-size: 36rpx;
				font-weight: 400;

				&:first-child {
					margin-right: 20rpx;
				}
			}

			.active {
				position: relative;
				z-index: 100;

				&:before {
					content: '';
					z-index: 99;
					position: absolute;
					left: 0;
					bottom: 0;
					height: 10rpx;
					width: 100%;
					border-radius: 4rpx;
					background-color: rgba(13, 206, 151, 1);
					box-shadow: 0 10rpx 6rpx 3rpx rgba(0, 204, 146, 0.3);
				}
			}
		}
	}
	.filetab {
		margin-bottom: 30rpx;
		// padding: 32rpx 32rpx 20rpx;
	
		text {
			color: rgba(56, 56, 56, 1);
			font-size: 32rpx;
			font-weight: 400;
			// transition: all .3s;
			margin-left: 20rpx;
		}
	
		.active2 {
			color: rgba(13, 206, 151, 1);
			font-size: 32rpx;
			font-weight: 700;
		}
	}
	.fileMain {
		padding: 48rpx 32rpx;
		box-sizing: border-box;

		

		.filelist {
			.fileitem {
				box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
				border-radius: 8px;
				padding: 20rpx;
				margin: 20rpx 0;
				box-sizing: border-box;

				.item_l {
					width: 90%;
					text {
						width: 100%;
						color: rgba(56, 56, 56, 1);
						font-size: 28rpx;
						font-weight: 400;
						word-break:break-all;
						

						&:last-child {
							color: rgba(166, 166, 166, 1);
							font-size: 24rpx;
						}
					}
				}

				image {
					flex-shrink: 0;
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}

	.docuMain {
		padding: 48rpx 32rpx;
		box-sizing: border-box;

		.docuItem {
			padding: 20rpx;
			margin: 20rpx 0;

			.item_l {
				width: 80%;

				text {
					width: 100%;
					color: rgba(56, 56, 56, 1);
					font-size: 28rpx;
					font-weight: 400;
					word-break:break-all;
					
				
					&:last-child {
						color: rgba(166, 166, 166, 1);
						font-size: 24rpx;
					}
				}

			}

			image {
				flex-shrink: 0;
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
</style>
