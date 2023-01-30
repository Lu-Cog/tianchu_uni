let Url = 'http://ydapp.tentrue.com:8087/api/'
// let Url = 'http://192.168.2.35/api/'
function baseRequest(url, methed, data) {
	let header = {
		Authorization : getApp().globalData.token
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: Url + url,
			header:header,
			method: methed || 'GET',
			data: data || {},
			success(res) {
				if(res.statusCode==200){
					if (res.data.code == 0) {
						resolve(res.data)
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				}else if(res.statusCode==401){
					uni.showToast({
						title:'登录过期',
						icon:'none'
					})
					plus.runtime.quit()
				}else{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				}
			},
			fail(res) {
				uni.showToast({
					title:'请求失败',
					icon:'none'
				})
			}
		})
	})
}
const request = {};
['get', 'post'].forEach(methods => {
	request[methods] = (url, data) => baseRequest(url, methods, data)
})

export default request
