<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back2.png" mode="widthFix" @click="back()"></image>
				<text>组织体系</text>
				<text></text>
			</view>
		</view>
		<view class="seach flex acen jcen">
			<input type="text" placeholder="请输入林长姓名" v-model="keyword">
			<view class="seachBtn flex acen jcen" @click.stop="getAreaList()"><image src="../../static/img/seach.png" mode="widthFix"></image></view>
		</view>
		<view class="table">
			<view class="tabhead flex acen jbtw">
				<text>林长级别</text>
				<text>姓名</text>
				<text>责任区</text>
				<text></text>
			</view>
			<view class="tabTr" v-for="(item,index) in areaList" :key="item" @click="openInfo(index)">
				<view class="tabTrLi flex acen jbtw">
					<text>{{item.roleName}}</text>
					<text>{{item.nickName}}</text>
					<text>{{item.title}}</text>
					<text>{{tabActive==index?'收起':'详情'}}</text>
				</view>
				<view class="info" :class="{hAuto:tabActive==index}">
					<view class="infoTitle">
						林情区域面积统计（公顷）
					</view>
					<view class="infoItem flex acen jbtw">
						<text>国土总面积</text>
						<text>{{areaInfo.gtzmj}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>林地总面积</text>
						<text>{{areaInfo.ldzmj}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>有林地</text>
						<text>{{areaInfo.yld}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>灌木林地</text>
						<text>{{areaInfo.gmld}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>未成林地</text>
						<text>{{areaInfo.wcld}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>苗圃地</text>
						<text>{{areaInfo.mpd}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>无林木林地</text>
						<text>{{areaInfo.wlmld}}</text>
					</view>
					<view class="infoItem flex acen jbtw">
						<text>辅助生产林地</text>
						<text>{{areaInfo.fzscld}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getAreaList
	} from '@/api/api.js'
	export default {
		data() {
			return {
				areaInfo:{},
				areaList:[],
				tabActive:-1,
				keyword:'',
			};
		},
		onLoad() {
			const pages = getCurrentPages();
			const pre = pages[pages.length - 2]; // 重新加载实名页面
			this.areaInfo = {...pre.$vm.areaInfo}
			this.getAreaList()
		},
		methods:{
			getAreaList(){
				let data = {
					name : this.areaInfo.title || '',
					keyword : this.keyword
				}
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				getAreaList(data).then(res=>{
					uni.hideLoading()
					this.areaList = res.data
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			openInfo(index){
				if(index==this.tabActive){
					this.tabActive =-1
				}else{
					this.tabActive = index
				}
			},
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
	.seach{
		margin: 16rpx auto 36rpx;
		position: relative;
		box-sizing: border-box;
		height: 60rpx;
		border-radius: 16rpx;
		width: 90%;
		border: 1px solid rgba(13, 206, 151, 1);
		display: flex;
		justify-content: flex-start;
		input{
			padding-left: 16rpx;
			width: 70%;
		}
		.seachBtn{
			position: absolute;
			right: -1rpx;
			width: 110rpx;
			height: 60rpx;
			background: rgba(13, 206, 151, 1);
			border-radius: 16rpx;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
	.table{
		padding: 0 32rpx;
		
		.tabhead{
			background: rgba(250, 250, 250, 1);
			text{
				padding: 20rpx 0;
				font-size: 30rpx;
				flex: 1;
				text-align: center;
			}
		}
		.tabTr{
			.tabTrLi{
				text{
					padding: 20rpx 0;
					font-size: 30rpx;
					flex: 1;
					text-align: center;
					&:last-child{
						color: rgba(13, 206, 151, 1);
					}
				}
			}
			.info{
				height: 0rpx;
				overflow: hidden;
				padding: 0rpx 50rpx;
				transition: height .3s;
				.infoTitle{
					font-size: 32rpx;
					margin-bottom: 20rpx;
				}
				.infoItem{
					padding: 10rpx 0;
					font-size: 28rpx;
				}
			}
			.hAuto{
				height: 540rpx;
			}
			&:nth-child(even){
				background: rgba(240, 252, 249, 1);
			}
			
		}
	}
</style>
