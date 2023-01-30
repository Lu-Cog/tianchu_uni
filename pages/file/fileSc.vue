<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>我的收藏</text>
				<text></text>
			</view>
		</view>
		<view class="filetab flex acen">
			<text :class="{active:active==1}" @click="changeTab(1)">政策文件</text>
			<text :class="{active:active==2}" @click="changeTab(2)">知识文档</text>
		</view>
		<view class="fileMain" v-if="active==1">
			<view class="filelist">
				<view class="no" v-if="list.length<=0">
					暂无文档
				</view>
				<view class="fileitem flex acen jbtw" v-for="(item,index) in list" :key='index' @click="download(item.url)">
					<view class="item_l flex fCol">
						<text>{{item.title}}</text>
						<text>{{item.createTime}}</text>
					</view>
					<image :src="item.fav==1?'../../static/img/ysc.png':'../../static/img/wsc.png'" mode="widthFix" @click.stop="fav(item)"></image>
				</view>
			</view>
		</view>
		<view class="docuMain" v-if="active==2">
			<view class="no" v-if="list.length<=0">
				暂无文档
			</view>
			<view v-else class="docuItem flex acen jbtw" v-for="(item,index) in list" :key='index' @click="download(item.url)">
				<view class="item_l flex acen">
					<image :src="item.icon" mode="aspectFill"></image>
					<view class="flex fCol">
						<text>{{item.title}}</text>
						<text>{{item.createTime}}</text>
					</view>
				</view>
				<image :src="item.fav==1?'../../static/img/ysc.png':'../../static/img/wsc.png'" mode="widthFix" @click.stop="fav(item)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDocList,
		getDocAct
	} from '@/api/api.js'
	export default {
		data() {
			return {
				active:1,
				list:[],
				page:0
			};
		},
		onLoad() {
			this.getDocList()
		},
		onReachBottom() {
			this.getDocList(false)
		},
		methods:{
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
					cateId: '',
					isFav: 1
				}
				getDocList(data).then(res => {
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
				getDocAct(data).then(res=>{
					this.getDocList()
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				})
			},
			changeTab(type){
				this.active = type
				this.getDocList()
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less">
	.no {
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
				font-size: 36rpx;
				font-weight: 400;
			}
		}
	}
	.filetab{
		padding: 32rpx 32rpx 20rpx;
		box-sizing: border-box;
		// margin-bottom: 30rpx;
		text{
			color: rgba(56, 56, 56, 1);
			font-size: 32rpx;
			font-weight: 400;
			transition: all .3s;
			margin-left: 20rpx;
		}
		.active{
			position: relative;
			z-index: 100;
			&:before{
				content: '';
				z-index: 99;
				position: absolute;
				left: 0;
				bottom: -8rpx;
				height: 10rpx;
				width: 100%;
				border-radius: 4rpx;
				background-color:rgba(13, 206, 151, 1);
			}
		}
	}
	.fileMain{
		padding: 0rpx 32rpx 48rpx;
		box-sizing: border-box;
		
		.filelist{
			.fileitem{
				box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
				border-radius: 8px;
				padding: 20rpx;
				margin: 20rpx 0;
				box-sizing: border-box;
				.item_l{
					text{
						color: rgba(56, 56, 56, 1);
						font-size: 28rpx;
						font-weight: 400;
						word-break:break-all;
						&:last-child{
							color: rgba(166, 166, 166, 1);
							font-size: 24rpx;
						}
					}
				}
				image{
					flex-shrink: 0;
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
	.docuMain{
		padding: 0rpx 32rpx 48rpx;
		box-sizing: border-box;
		.docuItem{
			padding: 20rpx;
			margin: 20rpx 0;
			.item_l{
				width: 80%;
				text{
					word-break:break-all;
					margin-left: 20rpx;
					color: rgba(56, 56, 56, 1);
					font-size: 26rpx;
					font-weight: 400;
					&:last-child{
						color: rgba(166, 166, 166, 1);
						font-size: 24rpx;
					}
				}
				
			}
			image{
				flex-shrink: 0;
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
</style>
