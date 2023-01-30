<template>
	<view>
		<view class="header">
			<view class="status_bar"></view>
			<view class="head flex acen jcen">
				<image src="../../static/img/back.png" mode="widthFix" @click="back"></image>
				<text>考勤打卡</text>
				<navigator url="/pages/index/dakaList" hover-class="none">打卡记录</navigator>
			</view>
			<view class="headmain flex">
				<image :src="dakaInfo.avatarPath" mode="aspectFill"></image>
				<view class="headInfo flex fCol jbtw">
					<view class="headTop">
						<text>{{dakaInfo.nickName}}</text>
						<text>工号：{{dakaInfo.workNo}}</text>
					</view>
					<view class="headBtm">
						岗位：{{dakaInfo.roleName}}
					</view>
				</view>
			</view>
		</view>
		<view class="dakaMain flex fCol acen">
			<view class="title">
				{{dakaInfo.zhaohu1}}
			</view>
			<view class="dklist flex jbtw">
				<view class="dkItem">
					<view class="dktime">
						{{dakaInfo.left1}}
					</view>
					<view class="dkbtm flex acen jard" v-if="dakaInfo.left2">
						<image :src="dakaInfo.left3!=0?'../../static/img/ydk.png':'../../static/img/qk.png'"
							mode="widthFix"></image>
						<text>{{dakaInfo.left2}}</text>
						<text v-if="dakaInfo.left3==3">迟到</text>
						<text v-if="dakaInfo.left3==0">缺卡</text>
						<text v-if="dakaInfo.left3==1">正常</text>
						<text v-if="dakaInfo.left3==2">早退</text>
					</view>
					<view class="dkbtm flex acen jard" v-else>
						<text>暂未打卡</text>
						<text style="display: none;"></text>
					</view>
				</view>
				<view class="dkItem">
					<view class="dktime">
						{{dakaInfo.right1}}
					</view>
					<view class="dkbtm flex acen jard" v-if="dakaInfo.right2">
						<image :src="dakaInfo.right3!=0?'../../static/img/ydk.png':'../../static/img/qk.png'"
							mode="widthFix"></image>
						<text>{{dakaInfo.right2}}</text>
						<text v-if="dakaInfo.right3==3">迟到</text>
						<text v-if="dakaInfo.right3==0">缺卡</text>
						<text v-if="dakaInfo.right3==1">正常</text>
						<text v-if="dakaInfo.right3==2">早退</text>
					</view>
					<view class="dkbtm flex acen jard" v-else>
						<text>暂未打卡</text>
						<text style="display: none;"></text>
					</view>
				</view>
			</view>
			<view class="daka flex acen jcen">
				<view class="dakan flex fCol acen jcen" @click="daka()">
					<text>{{dakaInfo.tip}}</text>
					<text>{{mytime}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import permision from "@/js_sdk/wa-permission/permission.js"
	import {
		getDakaInfo,
		getDakaAct
	} from '../../api/api.js'
	export default {
		data() {
			return {
				mytime: '',
				dakaInfo: {},
				lon: '',
				lat: '',
				wifi:''
			}
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.sendNativeEvent('back')
				return true
			}
		},
		onLoad() {
			let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
			let min = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
			let sec = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
			this.mytime = hour + ':' + min + ':' + sec; //获取当前时间
			setInterval(() => {
				let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
				let min = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
				let sec = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
				this.mytime = hour + ':' + min + ':' + sec; //获取当前时间
			}, 1000)
			this.getDakaInfo()
		},
		methods: {
			getWifi(){
				let that = this
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType != "wifi") {
							that.wifi = ""
						} else {
							//判断获取的WiFi是否为机型WiFi
							// 主窗体  
							var MainActivity = plus.android.runtimeMainActivity()
							// 上下文  
							var Context = plus.android.importClass('android.content.Context')
							// 导入WIFI管理 和 WIFI 信息 的class  
							plus.android.importClass("android.net.wifi.WifiManager")
							plus.android.importClass("android.net.wifi.WifiInfo")
							plus.android.importClass("android.net.wifi.ScanResult")
							plus.android.importClass("java.util.ArrayList")
							// 获取 WIFI 管理实例  
							var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
				
							// 获取当前连接WIFI的信息  
							var info = wifiManager.getConnectionInfo()
				
							// 获取当前 WIFI 连接的 SSID (WIFI 名称)  
							var ssid = info.getSSID()
							// 这里的 获取到的名称 是 带 双引号的 如 "cmcc"    
							// 所以我们这里处理一下  
							ssid = ssid.replace(/(^\"*)|(\"*$)/g, "")
							that.wifi = ssid
				
						}
					}
				})
			},
			// 检查是否开启位置信息权限
			async checkOpenPermission() {
				let that = this
				let result = await permision.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION');
				if (result == 1) {
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							that.lon = res.longitude
							that.lat = res.latitude
							uni.hideLoading()
							that.doDaka()
						},
						fail() {
							uni.hideLoading()
							uni.showToast({
								title: '定位失败',
								icon: "none"
							})
						}
					});
				} else {
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: '请开启位置信息权限',
						showCancel: false,
						success() {
							permision.gotoAppPermissionSetting(); // 打开权限设置界面
						}
					});
				}
			},
			checkOpenGPSServiceByAndroidIOS() {
				let that = this
				let system = uni.getSystemInfoSync(); // 获取系统信息
				if (system.platform === 'android') { // 判断平台
					var context = plus.android.importClass("android.content.Context");
					var locationManager = plus.android.importClass("android.location.LocationManager");
					var main = plus.android.runtimeMainActivity();
					var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
					if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
						uni.showModal({
							title: '提示',
							content: '请打开定位服务功能',
							showCancel: false, // 不显示取消按钮
							success() {
								if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
									uni.hideLoading()
									var Intent = plus.android.importClass('android.content.Intent');
									var Settings = plus.android.importClass('android.provider.Settings');
									var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
									main.startActivity(intent); // 打开系统设置GPS服务页面
								} else {
									that.checkOpenPermission()
								}
							}
						});
					} else {
						that.checkOpenPermission()
					}
				} else if (system.platform === 'ios') {
					var cllocationManger = plus.ios.import("CLLocationManager");
					var enable = cllocationManger.locationServicesEnabled();
					var status = cllocationManger.authorizationStatus();
					plus.ios.deleteObject(cllocationManger);
					uni.hideLoading()
					if (enable && status != 2) {
						console.log("手机系统的定位已经打开");
						uni.getLocation({
							type: 'wgs84',
							success: function(res) {
								that.lon = res.longitude
								that.lat = res.latitude
							}
						});
					} else {
						console.log("手机系统的定位没有打开");
						uni.showModal({
							title: '提示',
							content: '请前往设置-隐私-定位服务打开定位服务功能',
							showCancel: false, // 不显示取消按钮
							success() {
								var UIApplication = plus.ios.import("UIApplication");
								var application2 = UIApplication.sharedApplication();
								var NSURL2 = plus.ios.import("NSURL");
								var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
								application2.openURL(setting2);
								plus.ios.deleteObject(setting2);
								plus.ios.deleteObject(NSURL2);
								plus.ios.deleteObject(application2);
							}
						});
					}
				}
			},

			getDakaInfo() {
				getDakaInfo().then(res => {
					this.dakaInfo = res.data
				})
			},
			back() {
				uni.sendNativeEvent('back')
			},
			daka() {
				if (this.dakaInfo.status == 0) return
				uni.showLoading({
					title:"打卡中...",
					mask:true
				})
				this.getWifi()
				this.checkOpenGPSServiceByAndroidIOS()
			},
			doDaka(){
				let that = this
				let data = {
					lon: this.lon,
					lat: this.lat,
					wifi: this.wifi,
				}
				console.log(data);
				if (this.dakaInfo.dktime > new Date().getTime()) {
					uni.showModal({
						content: '您确定要执行早退打卡？',
						success(res) {
							if (res.confirm) {
								getDakaAct(data).then(res => {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
									that.getDakaInfo()
								})
							}
						}
					})
				} else {
					getDakaAct(data).then(res => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.getDakaInfo()
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.header {
		width: 100%;
		height: 408rpx;
		background: linear-gradient(0deg, rgba(0, 204, 146, 0.65) 0%, rgba(0, 204, 146, 1) 100%);

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
				color: rgba(255, 255, 255, 1);
				font-size: 36rpx;
				font-weight: 400;
			}

			navigator {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 30rpx;
				color: rgba(255, 255, 255, 1);
				font-size: 26rpx;
				font-weight: 700;
			}
		}

		.headmain {
			margin: 22rpx 34rpx;

			image {
				width: 120rpx;
				height: 120rpx;
				border-radius: 32rpx;
				margin-right: 16rpx;
			}

			.headInfo {
				padding: 10rpx;
				color: #fff;

				.headTop {
					text {
						font-size: 36rpx;
						font-weight: 400;
						margin-right: 20rpx;

						&:last-child {
							font-size: 24rpx;
						}
					}
				}

				.headBtm {
					font-size: 28rpx;
				}
			}
		}
	}

	.dakaMain {
		margin-top: -40rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 32rpx 32rpx 0rpx 0rpx;
		overflow: hidden;
		padding: 10rpx 32rpx;

		.title {
			width: 100%;
			color: rgba(56, 56, 56, 1);
			font-size: 32rpx;
			font-weight: 700;
			margin: 20rpx 0;
		}

		.dklist {
			width: 100%;

			.dkItem {
				width: 48%;
				background: rgba(235, 255, 249, 1);
				border-radius: 32rpx;
				padding: 20rpx;
				box-sizing: border-box;

				.dktime {
					font-size: 28rpx;
					font-weight: 400;
					margin-bottom: 30rpx;
				}

				.dkbtm {
					image {
						width: 36rpx;
						height: 36rpx;
					}

					text {
						font-size: 28rpx;
						font-weight: 400;
						color: rgba(166, 166, 166, 1);

						&:last-child {
							background: rgba(255, 235, 214, 1);
							border: 1px solid rgba(255, 141, 26, 1);
							border-radius: 16rpx;
							padding: 4rpx 10rpx;
							color: rgba(255, 141, 26, 1);
							font-size: 24rpx;
							font-weight: 400;
						}
					}
				}
			}
		}

		.daka {
			margin-top: 140rpx;
			width: 400rpx;
			height: 400rpx;
			background: rgba(0, 204, 146, 0);
			border: 1px solid rgba(0, 204, 146, 0.08);
			border-radius: 50%;
			box-shadow: inset 0px 0px 12px rgba(0, 204, 146, 0.16);

			.dakan {
				border-radius: 50%;
				width: 266rpx;
				height: 266rpx;
				background: linear-gradient(0deg, rgba(196, 196, 196, 1) 0%, rgba(0, 204, 146, 1) 0.66%, rgba(0, 204, 146, 0.65) 100%);
				box-shadow: 1px 2px 6px 1px rgba(0, 204, 146, 0.68);

				text {
					color: rgba(255, 255, 255, 1);
					font-size: 36rpx;
					font-weight: 700;

					&:last-child {
						color: rgba(255, 255, 255, 0.6);
						font-size: 24rpx;
						font-weight: 400;
					}
				}
			}
		}
	}
</style>
